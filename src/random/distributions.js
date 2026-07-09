'use strict';

const { RandomEngine } = require('./engine.js');
const math = require('./math.js');

class Distribution {
    constructor(globalRandomAccessor){
        this._getGlobalRandom = globalRandomAccessor;
    }

    _engine(randomEngine){
        if(randomEngine) return randomEngine;
        return this._getGlobalRandom();
    }

    sample(n = 1, randomEngine){
        if(n <= 0) return [];
        const engine = this._engine(randomEngine);
        if(n === 1) return this._sampleOne(engine);
        const out = [];
        for(let i = 0; i < n; i++){
            out.push(this._sampleOne(engine));
        }
        return out;
    }
}

class NormalDistribution extends Distribution {
    constructor(loc, scale, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(scale > 0)) throw new Error('scale must be > 0');
        this.loc = loc;
        this.scale = scale;
    }
    pdf(x){ return math.normalPdf(x, this.loc, this.scale); }
    cdf(x){ return math.normalCdf(x, this.loc, this.scale); }
    _sampleOne(engine){ return this.loc + this.scale * engine.nextNormal(); }
}

class UniformDistribution extends Distribution {
    constructor(low, high, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(high > low)) throw new Error('high must be > low');
        this.low = low;
        this.high = high;
    }
    pdf(x){
        if(x < this.low || x > this.high) return 0;
        return 1 / (this.high - this.low);
    }
    cdf(x){
        if(x <= this.low) return 0;
        if(x >= this.high) return 1;
        return (x - this.low) / (this.high - this.low);
    }
    _sampleOne(engine){ return this.low + (this.high - this.low) * engine.next(); }
}

class ExponentialDistribution extends Distribution {
    constructor(rate, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(rate > 0)) throw new Error('rate must be > 0');
        this.rate = rate;
    }
    pdf(x){ return x < 0 ? 0 : this.rate * Math.exp(-this.rate * x); }
    cdf(x){ return x < 0 ? 0 : 1 - Math.exp(-this.rate * x); }
    _sampleOne(engine){ return -Math.log(engine.nextOpen()) / this.rate; }
}

class GammaDistribution extends Distribution {
    constructor(shape, scale, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(shape > 0) || !(scale > 0)) throw new Error('shape and scale must be > 0');
        this.shape = shape;
        this.scale = scale;
    }
    pdf(x){
        if(x < 0) return 0;
        const k = this.shape;
        const theta = this.scale;
        return Math.pow(x, k - 1) * Math.exp(-x / theta) / (Math.pow(theta, k) * math.gamma(k));
    }
    cdf(x){
        if(x < 0) return 0;
        return math.lowerRegularizedGamma(this.shape, x / this.scale);
    }
    _sampleOne(engine){
        const k = this.shape;
        const theta = this.scale;

        if(k < 1){
            const u = engine.nextOpen();
            const g = this._sampleWithShapeAtLeastOne(k + 1, engine);
            return theta * g * Math.pow(u, 1 / k);
        }

        return theta * this._sampleWithShapeAtLeastOne(k, engine);
    }
    _sampleWithShapeAtLeastOne(k, engine){
        const d = k - 1 / 3;
        const c = 1 / Math.sqrt(9 * d);
        while(true){
            const z = engine.nextNormal();
            const v = Math.pow(1 + c * z, 3);
            if(v <= 0) continue;
            const u = engine.nextOpen();
            if(u < 1 - 0.0331 * Math.pow(z, 4)) return d * v;
            if(Math.log(u) < 0.5 * z * z + d * (1 - v + Math.log(v))) return d * v;
        }
    }
}

class GeometricDistribution extends Distribution {
    constructor(p, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(p > 0 && p <= 1)) throw new Error('p must be in (0, 1]');
        this.p = p;
    }
    pmf(k){
        if(k < 1 || Math.floor(k) !== k) return 0;
        return Math.pow(1 - this.p, k - 1) * this.p;
    }
    pdf(k){ return this.pmf(k); }
    cdf(k){
        if(k < 1) return 0;
        const kk = Math.floor(k);
        return 1 - Math.pow(1 - this.p, kk);
    }
    _sampleOne(engine){
        return Math.floor(Math.log(1 - engine.nextOpen()) / Math.log(1 - this.p)) + 1;
    }
}

class PoissonDistribution extends Distribution {
    constructor(lambda, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(lambda > 0)) throw new Error('lambda must be > 0');
        this.lambda = lambda;
    }
    pmf(k){
        if(k < 0 || Math.floor(k) !== k) return 0;
        return Math.exp(k * Math.log(this.lambda) - this.lambda - math.logGamma(k + 1));
    }
    pdf(k){ return this.pmf(k); }
    cdf(k){
        if(k < 0) return 0;
        const kk = Math.floor(k);
        let s = 0;
        for(let i = 0; i <= kk; i++){
            s += this.pmf(i);
        }
        return math.clamp(s, 0, 1);
    }
    _sampleOne(engine){
        const L = Math.exp(-this.lambda);
        let p = 1;
        let k = 0;
        do {
            k += 1;
            p *= engine.nextOpen();
        } while(p > L);
        return k - 1;
    }
}

class BinomialDistribution extends Distribution {
    constructor(n, p, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(n >= 0) || Math.floor(n) !== n) throw new Error('n must be a non-negative integer');
        if(!(p >= 0 && p <= 1)) throw new Error('p must be in [0, 1]');
        this.n = n;
        this.p = p;
    }
    pmf(k){
        if(k < 0 || k > this.n || Math.floor(k) !== k) return 0;
        if(this.p === 0) return k === 0 ? 1 : 0;
        if(this.p === 1) return k === this.n ? 1 : 0;
        return Math.exp(math.logChoose(this.n, k) + k * Math.log(this.p) + (this.n - k) * Math.log(1 - this.p));
    }
    pdf(k){ return this.pmf(k); }
    cdf(k){
        if(k < 0) return 0;
        const kk = Math.floor(Math.min(k, this.n));
        let s = 0;
        for(let i = 0; i <= kk; i++){
            s += this.pmf(i);
        }
        return math.clamp(s, 0, 1);
    }
    _sampleOne(engine){
        let x = 0;
        for(let i = 0; i < this.n; i++){
            if(engine.next() < this.p) x += 1;
        }
        return x;
    }
}

class ChiSquareDistribution extends Distribution {
    constructor(df, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(df > 0)) throw new Error('df must be > 0');
        this.df = df;
        this._gamma = new GammaDistribution(df / 2, 2, globalRandomAccessor);
    }
    pdf(x){ return this._gamma.pdf(x); }
    cdf(x){ return this._gamma.cdf(x); }
    _sampleOne(engine){ return this._gamma._sampleOne(engine); }
}

class StudentTDistribution extends Distribution {
    constructor(df, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(df > 0)) throw new Error('df must be > 0');
        this.df = df;
    }
    pdf(x){
        const v = this.df;
        const num = math.gamma((v + 1) / 2);
        const den = Math.sqrt(v * Math.PI) * math.gamma(v / 2);
        return (num / den) * Math.pow(1 + (x * x) / v, -(v + 1) / 2);
    }
    cdf(x){
        const v = this.df;
        const t = v / (v + x * x);
        const ib = math.regularizedIncompleteBeta(t, v / 2, 0.5);
        if(x >= 0) return 1 - 0.5 * ib;
        return 0.5 * ib;
    }
    _sampleOne(engine){
        const z = engine.nextNormal();
        const chi = new ChiSquareDistribution(this.df, () => this._engine(engine));
        const x = chi._sampleOne(engine);
        return z / Math.sqrt(x / this.df);
    }
}

class HypergeometricDistribution extends Distribution {
    constructor(populationSize, successStates, draws, globalRandomAccessor){
        super(globalRandomAccessor);
        if(!(populationSize > 0) || Math.floor(populationSize) !== populationSize) throw new Error('populationSize must be positive integer');
        if(!(successStates >= 0) || Math.floor(successStates) !== successStates || successStates > populationSize) throw new Error('successStates invalid');
        if(!(draws >= 0) || Math.floor(draws) !== draws || draws > populationSize) throw new Error('draws invalid');
        this.populationSize = populationSize;
        this.successStates = successStates;
        this.draws = draws;
        this.minK = Math.max(0, draws - (populationSize - successStates));
        this.maxK = Math.min(draws, successStates);
    }
    pmf(k){
        if(k < this.minK || k > this.maxK || Math.floor(k) !== k) return 0;
        const ln = math.logChoose(this.successStates, k) +
            math.logChoose(this.populationSize - this.successStates, this.draws - k) -
            math.logChoose(this.populationSize, this.draws);
        return Math.exp(ln);
    }
    pdf(k){ return this.pmf(k); }
    cdf(k){
        if(k < this.minK) return 0;
        const kk = Math.min(Math.floor(k), this.maxK);
        let s = 0;
        for(let i = this.minK; i <= kk; i++){
            s += this.pmf(i);
        }
        return math.clamp(s, 0, 1);
    }
    _sampleOne(engine){
        let successes = this.successStates;
        let failures = this.populationSize - this.successStates;
        let pickedSuccess = 0;
        for(let i = 0; i < this.draws; i++){
            const probSuccess = successes / (successes + failures);
            if(engine.next() < probSuccess){
                pickedSuccess += 1;
                successes -= 1;
            } else {
                failures -= 1;
            }
        }
        return pickedSuccess;
    }
}

const createFactory = function(getGlobalRandom){
    return {
        normal: (loc = 0, scale = 1) => new NormalDistribution(loc, scale, getGlobalRandom),
        exponential: (rate = 1) => new ExponentialDistribution(rate, getGlobalRandom),
        gamma: (shape, scale = 1) => new GammaDistribution(shape, scale, getGlobalRandom),
        geometric: (p) => new GeometricDistribution(p, getGlobalRandom),
        uniform: (low = 0, high = 1) => new UniformDistribution(low, high, getGlobalRandom),
        poisson: (lambda) => new PoissonDistribution(lambda, getGlobalRandom),
        binomial: (n, p) => new BinomialDistribution(n, p, getGlobalRandom),
        chisquare: (df) => new ChiSquareDistribution(df, getGlobalRandom),
        studentt: (df) => new StudentTDistribution(df, getGlobalRandom),
        hypergeometric: (populationSize, successStates, draws) => new HypergeometricDistribution(populationSize, successStates, draws, getGlobalRandom),
    };
};

module.exports = {
    Distribution,
    NormalDistribution,
    ExponentialDistribution,
    GammaDistribution,
    GeometricDistribution,
    UniformDistribution,
    PoissonDistribution,
    BinomialDistribution,
    ChiSquareDistribution,
    StudentTDistribution,
    HypergeometricDistribution,
    createFactory,
    RandomEngine,
};
