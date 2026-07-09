'use strict';

const math = require('../../random/math.js');
const {
    toNumericArray,
    rankWithTies,
    tieCorrection,
} = require('./helpers.js');

const normalTwoSidedP = function(z){
    const p = 1 - math.normalCdf(Math.abs(z), 0, 1);
    return 2 * p;
};

const signedRankOneSample = function(x, mu, options){
    const alternative = options.alternative || 'two.sided';
    const diffs = x.map((v) => v - mu).filter((d) => d !== 0);
    const n = diffs.length;
    if(n === 0) throw new Error('All differences are zero.');

    const absDiffs = diffs.map(Math.abs);
    const ranks = rankWithTies(absDiffs);
    let wPlus = 0;
    for(let i = 0; i < n; i++){
        if(diffs[i] > 0) wPlus += ranks[i];
    }

    const meanW = n * (n + 1) / 4;
    const tie = tieCorrection(ranks);
    const varW = (n * (n + 1) * (2 * n + 1) - tie / 2) / 24;
    const z = (wPlus - meanW - 0.5) / Math.sqrt(varW);

    let p;
    if(alternative === 'two.sided') p = normalTwoSidedP(z);
    else if(alternative === 'greater') p = 1 - math.normalCdf(z, 0, 1);
    else if(alternative === 'less') p = math.normalCdf(z, 0, 1);
    else throw new Error(`Unknown alternative: ${alternative}`);

    return {
        statistic: { W: wPlus, z },
        parameter: { n },
        p_value: p,
        method: 'Wilcoxon signed rank test with continuity correction',
        alternative,
        estimate: null,
        data_name: options.data_name || 'x',
    };
};

const mannWhitney = function(x, y, options){
    const alternative = options.alternative || 'two.sided';
    const n1 = x.length;
    const n2 = y.length;
    if(n1 === 0 || n2 === 0) throw new Error('Not enough observations for Wilcoxon test.');

    const combined = x.map((v) => ({v, g: 1})).concat(y.map((v) => ({v, g: 2})));
    const values = combined.map((e) => e.v);
    const ranks = rankWithTies(values);

    let r1 = 0;
    for(let i = 0; i < combined.length; i++){
        if(combined[i].g === 1) r1 += ranks[i];
    }

    const u1 = r1 - (n1 * (n1 + 1)) / 2;
    const u2 = n1 * n2 - u1;
    const u = Math.min(u1, u2);

    const tie = tieCorrection(ranks);
    const meanU = (n1 * n2) / 2;
    const varU = (n1 * n2 * (n1 + n2 + 1) - tie / 2) / 12;
    const z = (u - meanU + 0.5) / Math.sqrt(varU);

    let p;
    if(alternative === 'two.sided') p = normalTwoSidedP(z);
    else if(alternative === 'greater') p = 1 - math.normalCdf(z, 0, 1);
    else if(alternative === 'less') p = math.normalCdf(z, 0, 1);
    else throw new Error(`Unknown alternative: ${alternative}`);

    return {
        statistic: { W: u, z },
        parameter: { n_x: n1, n_y: n2 },
        p_value: p,
        method: 'Wilcoxon rank sum test with continuity correction',
        alternative,
        estimate: { median_x: median(x), median_y: median(y) },
        data_name: options.data_name || 'x and y',
    };
};

const median = function(arr){
    const s = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    if(s.length % 2 === 0) return (s[mid - 1] + s[mid]) / 2;
    return s[mid];
};

const wilcoxTest = function(x, yOrMu, options = {}){
    const xArr = toNumericArray(x);
    const mu = options.mu !== undefined ? options.mu : 0;

    if(yOrMu === undefined || typeof yOrMu === 'number'){
        const hypothesized = typeof yOrMu === 'number' ? yOrMu : mu;
        return signedRankOneSample(xArr, hypothesized, options);
    }

    const yArr = toNumericArray(yOrMu);
    if(options.paired){
        if(xArr.length !== yArr.length) throw new Error('Paired Wilcoxon test requires equal sample sizes.');
        const diff = xArr.map((xi, i) => xi - yArr[i]);
        return signedRankOneSample(diff, 0, {
            ...options,
            data_name: options.data_name || 'paired differences',
        });
    }

    return mannWhitney(xArr, yArr, options);
};

module.exports = wilcoxTest;
