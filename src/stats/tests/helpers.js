'use strict';

const math = require('../../random/math.js');

const toNumericArray = function(x){
    if(Array.isArray(x)) return x.map(Number).filter((v) => Number.isFinite(v));
    if(x && typeof x.colToArray === 'function' && typeof x === 'object'){
        throw new Error('Pass a column array, not a dataframe. Use df.colToArray("col").');
    }
    throw new Error('Expected a numeric array.');
};

const sum = (x) => {
    let s = 0;
    for(let i = 0; i < x.length; i++) s += Number(x[i]);
    return s;
};

const mean = (x) => sum(x) / x.length;

const varSample = (x) => {
    const m = mean(x);
    let ss = 0;
    for(let i = 0; i < x.length; i++) ss += (x[i] - m) ** 2;
    return ss / (x.length - 1);
};

const sd = (x) => Math.sqrt(varSample(x));

const studentTCdf = function(t, df){
    if(df <= 0) return NaN;
    const dist = { cdf: (x) => {
        const v = df;
        const tt = v / (v + x * x);
        const ib = math.regularizedIncompleteBeta(tt, v / 2, 0.5);
        if(x >= 0) return 1 - 0.5 * ib;
        return 0.5 * ib;
    }};
    return dist.cdf(t);
};

const fCdf = function(x, d1, d2){
    if(x <= 0) return 0;
    const z = (d1 * x) / (d1 * x + d2);
    return math.regularizedIncompleteBeta(z, d1 / 2, d2 / 2);
};

const pFromT = function(t, df, alternative){
    const absT = Math.abs(t);
    if(alternative === 'two.sided') return 2 * (1 - studentTCdf(absT, df));
    if(alternative === 'greater') return 1 - studentTCdf(t, df);
    if(alternative === 'less') return studentTCdf(t, df);
    throw new Error(`Unknown alternative: ${alternative}`);
};

const rankWithTies = function(values){
    const indexed = values.map((v, i) => ({v, i}));
    indexed.sort((a, b) => a.v - b.v);
    const ranks = new Array(values.length);
    let i = 0;
    while(i < indexed.length){
        let j = i;
        while(j + 1 < indexed.length && indexed[j + 1].v === indexed[i].v) j += 1;
        const avgRank = (i + j + 2) / 2;
        for(let k = i; k <= j; k++){
            ranks[indexed[k].i] = avgRank;
        }
        i = j + 1;
    }
    return ranks;
};

const tieCorrection = function(ranks){
    const counts = {};
    for(let i = 0; i < ranks.length; i++){
        const r = ranks[i];
        counts[r] = (counts[r] || 0) + 1;
    }
    let correction = 0;
    const keys = Object.keys(counts);
    for(let i = 0; i < keys.length; i++){
        const t = counts[keys[i]];
        if(t > 1) correction += (t ** 3) - t;
    }
    return correction;
};

// Studentized range CDF approximation (AS 190 style, adequate for HSD)
// TODO: Implement this as an actual distribution
const ptukey = function(q, k, df){
    if(k < 2 || df < 1) return NaN;
    if(q <= 0) return 0;

    if(k === 2){
        return studentTCdf(q, df) - studentTCdf(-q, df);
    }

    const steps = 128;
    const upper = q + 8;
    const width = upper / steps;
    let total = 0;
    for(let i = 0; i < steps; i++){
        const x = (i + 0.5) * width;
        const px = studentizedRangePdf(x, k, df);
        total += px * width;
    }
    return Math.min(1, Math.max(0, total));
};

const studentizedRangePdf = function(q, k, df){
    const tPdf = (x) => {
        const v = df;
        const coef = math.gamma((v + 1) / 2) / (Math.sqrt(v * Math.PI) * math.gamma(v / 2));
        return coef * Math.pow(1 + (x * x) / v, -(v + 1) / 2);
    };

    const innerSteps = 64;
    const upper = q + 6;
    const width = (2 * upper) / innerSteps;
    let integral = 0;
    for(let i = 0; i < innerSteps; i++){
        const t = -upper + (i + 0.5) * width;
        const cdfTerm = studentTCdf(t + q, df) - studentTCdf(t, df);
        if(cdfTerm < 0) continue;
        integral += Math.pow(cdfTerm, k - 1) * tPdf(t) * width;
    }
    return k * integral;
};

const parseFormula = function(formula, data){
    const parts = formula.split('~').map((s) => s.trim());
    if(parts.length !== 2) throw new Error('Formula must look like "response ~ group".');
    const response = parts[0];
    const group = parts[1];
    if(!data || typeof data.colToArray !== 'function') throw new Error('Formula syntax requires a dataframe.');
    return {
        response: data.colToArray(response).map(Number),
        group: data.colToArray(group),
        responseName: response,
        groupName: group,
    };
};

module.exports = {
    toNumericArray,
    mean,
    varSample,
    sd,
    sum,
    studentTCdf,
    fCdf,
    pFromT,
    rankWithTies,
    tieCorrection,
    ptukey,
    parseFormula,
};
