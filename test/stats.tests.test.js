const test = require('node:test');
const assert = require('node:assert/strict');

const nstat = require('../index.js');

const approx = (actual, expected, tol = 0.02) => {
    assert.ok(Math.abs(actual - expected) <= tol, `Expected ${actual} ~ ${expected}`);
};

const sleep = nstat.stat.dataset('sleep');
const g1 = sleep.subset('group', (x) => x === '1').colToArray('extra');
const g2 = sleep.subset('group', (x) => x === '2').colToArray('extra');
const diff = g1.map((x, i) => x - g2[i]);

test('t.test one sample returns expected shape', () => {
    const result = nstat.stat.tests.t_test(diff, 0);
    assert.equal(typeof result.statistic, 'number');
    assert.equal(typeof result.p_value, 'number');
    assert.ok(result.p_value >= 0 && result.p_value <= 1);
    assert.equal(result.method, 'One Sample t-test');
});

test('t.test paired sleep data matches aligned differences', () => {
    const result = nstat.stat.tests.t_test(g1, g2, { paired: true });
    approx(result.statistic, -4.0621, 0.01);
    assert.equal(result.parameter.df, 9);
    approx(result.p_value, 0.00283, 0.001);
});

test('wilcox.test one sample on paired differences', () => {
    const result = nstat.stat.tests.wilcox_test(diff, 0);
    assert.equal(result.statistic.W, 0);
    assert.ok(result.p_value > 0 && result.p_value < 1);
});

test('wilcox.test two sample independent test runs', () => {
    const result = nstat.stat.tests.wilcox_test(g1, g2);
    assert.ok(result.statistic.W > 0);
    assert.ok(result.p_value > 0 && result.p_value <= 1);
});

test('aov on sleep data matches R approximately', () => {
    const result = nstat.stat.tests.aov('extra ~ group', sleep);
    approx(result.statistic, 3.463, 0.01);
    assert.equal(result.parameter.df_between, 1);
    assert.equal(result.parameter.df_within, 18);
    approx(result.p_value, 0.07919, 0.01);
});

test('tukeyHSD returns pairwise comparisons for aov result', () => {
    const model = nstat.stat.tests.aov('extra ~ group', sleep);
    const hsd = nstat.stat.tests.tukeyHSD(model);
    assert.equal(hsd.comparisons.length, 1);
    assert.equal(typeof hsd.comparisons[0].p_adj, 'number');
    assert.ok(hsd.comparisons[0].p_adj > 0 && hsd.comparisons[0].p_adj <= 1);
});

test('p.adjust holm and hochberg methods', () => {
    const p = [0.01, 0.04, 0.03];
    const holm = nstat.stat.tests.p_adjust(p, 'holm');
    approx(holm[0], 0.03, 0.001);
    approx(holm[1], 0.06, 0.001);
    approx(holm[2], 0.06, 0.001);

    const hochberg = nstat.stat.tests.p_adjust(p, 'hochberg');
    approx(hochberg[0], 0.03, 0.001);
    approx(hochberg[1], 0.04, 0.001);
    approx(hochberg[2], 0.04, 0.001);
});

test('p.adjust BY method is conservative versus holm', () => {
    const p = [0.01, 0.04, 0.03];
    const holm = nstat.stat.tests.p_adjust(p, 'holm');
    const by = nstat.stat.tests.p_adjust(p, 'BY');
    assert.ok(by[0] >= holm[0]);
    assert.ok(by[1] >= holm[1]);
    assert.ok(by[2] >= holm[2]);
});

test('R-style aliases exist on stat.tests', () => {
    assert.equal(typeof nstat.stat.tests['t.test'], 'function');
    assert.equal(typeof nstat.stat.tests['wilcox.test'], 'function');
    assert.equal(typeof nstat.stat.tests['p.adjust'], 'function');
});
