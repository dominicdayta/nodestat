const test = require('node:test');
const assert = require('node:assert/strict');

const nstat = require('../index.js');

const approx = (actual, expected, tol = 0.05) => {
    assert.ok(Math.abs(actual - expected) <= tol, `Expected ${actual} ~ ${expected}`);
};

test('lm fits simple linear regression on women data', () => {
    const women = nstat.stat.dataset('women');
    const model = nstat.lm('weight ~ height', women);

    const coef = model.coef();
    approx(coef['(Intercept)'], -87.52, 0.1);
    approx(coef.height, 3.45, 0.01);
    assert.equal(model.fitted_values.nrow(), women.nrow());
    assert.equal(model.residuals.nrow(), women.nrow());
});

test('lm supports log transforms and I() terms', () => {
    const women = nstat.stat.dataset('women');
    const logModel = nstat.lm('log(weight) ~ log(height)', women);
    assert.equal(logModel.fitted_values.columns()[0], 'fitted');

    const polyModel = nstat.lm('weight ~ I(height^2)', women);
    assert.ok(polyModel.coef()['I(height^2)'] !== undefined);
});

test('lm encodes categorical predictors as dummy variables', () => {
    const sleep = nstat.stat.dataset('sleep');
    const model = nstat.lm('extra ~ group', sleep);
    const coef = model.coef();
    assert.ok(coef['(Intercept)'] !== undefined);
    assert.ok(coef.group2 !== undefined);
});

test('lm expands interaction terms with categorical factors', () => {
    const df = new nstat.df([
        { y: 2, x: 1, group: 'A' },
        { y: 4, x: 2, group: 'A' },
        { y: 3, x: 3, group: 'A' },
        { y: 5, x: 1, group: 'B' },
        { y: 7, x: 2, group: 'B' },
        { y: 9, x: 3, group: 'B' },
    ]);
    const model = nstat.lm('y ~ x * group', df);
    const names = model.feature_names;
    assert.ok(names.includes('x'));
    assert.ok(names.includes('groupB'));
    assert.ok(names.some((n) => n.includes('x:') && n.includes('groupB')));
});

test('lm predict residuals and fitted_values are dataframe-compatible', () => {
    const women = nstat.stat.dataset('women');
    const model = nstat.lm('weight ~ height', women);

    const augmented = women.cbind(model.residuals).cbind(model.fitted_values);
    assert.ok(augmented.columns().includes('residuals'));
    assert.ok(augmented.columns().includes('fitted'));

    const predicted = model.predict();
    assert.deepEqual(predicted.colToArray('fitted'), model.fitted_values.colToArray('fitted'));
});

test('lm summary matches R-style regression output on women data', () => {
    const women = nstat.stat.dataset('women');
    const model = nstat.lm('weight ~ height', women);
    const summary = model.summary();

    approx(summary.r_squared, 0.9915, 0.001);
    approx(summary.adj_r_squared, 0.9903, 0.001);
    approx(summary.mse, 2.326, 0.01);
    approx(summary.anova.statistic, 1433, 5);
    assert.equal(summary.anova.df_model, 1);
    assert.equal(summary.anova.df_residual, 13);
    assert.ok(summary.anova.p_value < 0.001);

    const table = model.coeftable();
    assert.equal(table.columns().includes('estimate'), true);
    assert.equal(table.columns().includes('std_error'), true);
    assert.equal(table.columns().includes('t_statistic'), true);
    assert.equal(table.columns().includes('p_value'), true);
    assert.deepEqual(model.aov(), model.anova());
});

test('formula parser expands star operator into main and interaction effects', () => {
    const { parseFormula } = require('../src/stats/formula/parser.js');
    const parsed = parseFormula('y ~ a * b');
    assert.deepEqual(parsed.predictors, ['a', 'b', 'a:b']);
});
