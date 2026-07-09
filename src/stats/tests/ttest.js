'use strict';

const {
    toNumericArray,
    mean,
    varSample,
    sd,
    pFromT,
} = require('./helpers.js');

const oneSample = function(x, mu, options){
    const alternative = options.alternative || 'two.sided';
    const n = x.length;
    if(n < 2) throw new Error('Not enough observations for one-sample t-test.');

    const xbar = mean(x);
    const s = sd(x);
    const t = (xbar - mu) / (s / Math.sqrt(n));
    const df = n - 1;
    const p = pFromT(t, df, alternative);

    return {
        statistic: t,
        parameter: { df, mu },
        p_value: p,
        method: 'One Sample t-test',
        alternative,
        estimate: xbar,
        data_name: options.data_name || 'x',
    };
};

const twoSample = function(x, y, options){
    const alternative = options.alternative || 'two.sided';
    const paired = options.paired || false;
    const varEqual = options.var_equal || false;

    if(paired){
        if(x.length !== y.length) throw new Error('Paired t-test requires equal sample sizes.');
        const diff = x.map((xi, i) => xi - y[i]);
        return oneSample(diff, 0, {
            alternative,
            data_name: options.data_name || 'paired differences',
        });
    }

    const n1 = x.length;
    const n2 = y.length;
    if(n1 < 2 || n2 < 2) throw new Error('Not enough observations for two-sample t-test.');

    const m1 = mean(x);
    const m2 = mean(y);
    const v1 = varSample(x);
    const v2 = varSample(y);

    let t;
    let df;
    let method;

    if(varEqual){
        const sp2 = ((n1 - 1) * v1 + (n2 - 1) * v2) / (n1 + n2 - 2);
        t = (m1 - m2) / Math.sqrt(sp2 * (1 / n1 + 1 / n2));
        df = n1 + n2 - 2;
        method = 'Two Sample t-test (equal variances)';
    } else {
        const se2 = v1 / n1 + v2 / n2;
        t = (m1 - m2) / Math.sqrt(se2);
        const num = se2 ** 2;
        const den = ((v1 / n1) ** 2) / (n1 - 1) + ((v2 / n2) ** 2) / (n2 - 1);
        df = num / den;
        method = 'Welch Two Sample t-test';
    }

    const p = pFromT(t, df, alternative);

    return {
        statistic: t,
        parameter: { df },
        p_value: p,
        method,
        alternative,
        estimate: { mean_x: m1, mean_y: m2 },
        conf_int: null,
        data_name: options.data_name || 'x and y',
    };
};

const tTest = function(x, yOrMu, options = {}){
    const xArr = toNumericArray(x);
    const mu = options.mu !== undefined ? options.mu : 0;

    if(yOrMu === undefined || typeof yOrMu === 'number'){
        const hypothesized = typeof yOrMu === 'number' ? yOrMu : mu;
        return oneSample(xArr, hypothesized, options);
    }

    const yArr = toNumericArray(yOrMu);
    return twoSample(xArr, yArr, options);
};

module.exports = tTest;
