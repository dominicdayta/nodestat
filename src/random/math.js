'use strict';

const SQRT2 = Math.sqrt(2);
const SQRT2PI = Math.sqrt(2 * Math.PI);

const clamp = function(x, low, high){
    return Math.min(high, Math.max(low, x));
};

const erf = function(x){
    const sign = x < 0 ? -1 : 1;
    const ax = Math.abs(x);
    const t = 1 / (1 + 0.3275911 * ax);
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-ax * ax);
    return sign * y;
};

const normalPdf = function(x, mu = 0, sigma = 1){
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * SQRT2PI);
};

const normalCdf = function(x, mu = 0, sigma = 1){
    return 0.5 * (1 + erf((x - mu) / (sigma * SQRT2)));
};

const logGamma = function(z){
    const p = [
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7,
    ];
    if(z < 0.5){
        return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
    }

    z -= 1;
    let x = 0.99999999999980993;
    for(let i = 0; i < p.length; i++){
        x += p[i] / (z + i + 1);
    }
    const t = z + p.length - 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
};

const gamma = function(z){
    return Math.exp(logGamma(z));
};

const lowerRegularizedGamma = function(s, x){
    if(x <= 0) return 0;
    if(x < s + 1){
        let ap = s;
        let sum = 1 / s;
        let del = sum;
        for(let n = 1; n <= 200; n++){
            ap += 1;
            del *= x / ap;
            sum += del;
            if(Math.abs(del) < Math.abs(sum) * 1e-14) break;
        }
        return sum * Math.exp(-x + s * Math.log(x) - logGamma(s));
    }

    let b = x + 1 - s;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    for(let i = 1; i <= 200; i++){
        const an = -i * (i - s);
        b += 2;
        d = an * d + b;
        if(Math.abs(d) < 1e-30) d = 1e-30;
        c = b + an / c;
        if(Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if(Math.abs(del - 1) < 1e-14) break;
    }
    return 1 - Math.exp(-x + s * Math.log(x) - logGamma(s)) * h;
};

const betaContinuedFraction = function(a, b, x){
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - qab * x / qap;
    if(Math.abs(d) < 1e-30) d = 1e-30;
    d = 1 / d;
    let h = d;
    for(let m = 1; m <= 200; m++){
        const m2 = 2 * m;
        let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if(Math.abs(d) < 1e-30) d = 1e-30;
        c = 1 + aa / c;
        if(Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d;
        h *= d * c;

        aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if(Math.abs(d) < 1e-30) d = 1e-30;
        c = 1 + aa / c;
        if(Math.abs(c) < 1e-30) c = 1e-30;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if(Math.abs(del - 1) < 1e-14) break;
    }
    return h;
};

const regularizedIncompleteBeta = function(x, a, b){
    if(x <= 0) return 0;
    if(x >= 1) return 1;

    const bt = Math.exp(
        logGamma(a + b) - logGamma(a) - logGamma(b) +
        a * Math.log(x) + b * Math.log(1 - x)
    );

    if(x < (a + 1) / (a + b + 2)){
        return bt * betaContinuedFraction(a, b, x) / a;
    }
    return 1 - bt * betaContinuedFraction(b, a, 1 - x) / b;
};

const logChoose = function(n, k){
    if(k < 0 || k > n) return -Infinity;
    return logGamma(n + 1) - logGamma(k + 1) - logGamma(n - k + 1);
};

module.exports = {
    SQRT2,
    SQRT2PI,
    clamp,
    erf,
    normalPdf,
    normalCdf,
    logGamma,
    gamma,
    lowerRegularizedGamma,
    regularizedIncompleteBeta,
    logChoose,
};
