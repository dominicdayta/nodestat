const test = require('node:test');
const assert = require('node:assert/strict');

const nstat = require('../index.js');

const approxEqual = (actual, expected, tol = 1e-6) => {
    assert.ok(Math.abs(actual - expected) <= tol, `Expected ${actual} ~ ${expected}`);
};

test('random global seed makes sampling deterministic', () => {
    nstat.random.set_global_seed(42);
    const d1 = nstat.random.normal(0, 1);
    const seq1 = d1.sample(5);

    nstat.random.set_global_seed(42);
    const d2 = nstat.random.normal(0, 1);
    const seq2 = d2.sample(5);

    assert.deepEqual(seq1, seq2);
});

test('normal distribution exposes pdf cdf sample', () => {
    const d = nstat.random.normal(0, 1);
    approxEqual(d.pdf(0), 0.3989422804, 1e-6);
    approxEqual(d.cdf(0), 0.5, 1e-6);
    assert.equal(typeof d.sample(), 'number');
});

test('uniform distribution basic behavior', () => {
    const d = nstat.random.uniform(2, 5);
    approxEqual(d.pdf(3), 1 / 3, 1e-12);
    approxEqual(d.cdf(2), 0, 1e-12);
    approxEqual(d.cdf(5), 1, 1e-12);
    const xs = d.sample(20);
    assert.equal(xs.length, 20);
    assert.ok(xs.every((x) => x >= 2 && x <= 5));
});

test('discrete distributions expose pmf/pdf cdf sample', () => {
    const pois = nstat.random.poisson(3);
    approxEqual(pois.pmf(0), Math.exp(-3), 1e-12);
    assert.ok(pois.cdf(3) > 0 && pois.cdf(3) < 1);
    assert.equal(Number.isInteger(pois.sample()), true);

    const binom = nstat.random.binomial(10, 0.25);
    assert.ok(binom.pmf(2) > 0);
    assert.ok(binom.cdf(10) <= 1);
    assert.equal(Number.isInteger(binom.sample()), true);

    const geom = nstat.random.geometric(0.3);
    assert.ok(geom.pmf(1) > 0);
    assert.equal(geom.sample() >= 1, true);
});

test('gamma family distributions return valid values', () => {
    const gamma = nstat.random.gamma(2, 3);
    assert.ok(gamma.pdf(1) > 0);
    assert.ok(gamma.cdf(1) > 0 && gamma.cdf(1) < 1);
    assert.ok(gamma.sample() >= 0);

    const chi = nstat.random.chisquare(4);
    assert.ok(chi.pdf(1) > 0);
    assert.ok(chi.cdf(1) > 0 && chi.cdf(1) < 1);
    assert.ok(chi.sample() >= 0);
});

test('student t and hypergeometric basic behavior', () => {
    const t = nstat.random.studentt(10);
    approxEqual(t.cdf(0), 0.5, 1e-6);
    assert.ok(t.pdf(0) > 0);

    const hg = nstat.random.hypergeometric(50, 8, 5);
    assert.ok(hg.pmf(1) >= 0);
    assert.ok(hg.cdf(5) <= 1);
    const draw = hg.sample();
    assert.equal(Number.isInteger(draw), true);
    assert.ok(draw >= 0 && draw <= 5);
});
