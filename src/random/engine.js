'use strict';

const DEFAULT_SEED = 123456789;

const hashSeed = function(seed){
    if(typeof seed === 'number' && Number.isFinite(seed)){
        return (Math.floor(seed) >>> 0) || DEFAULT_SEED;
    }

    const text = String(seed);
    let h = 2166136261 >>> 0;
    for(let i = 0; i < text.length; i++){
        h ^= text.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

class RandomEngine {
    constructor(seed = DEFAULT_SEED){
        this._normalCache = null;
        this.setSeed(seed);
    }

    setSeed(seed){
        this._seed = hashSeed(seed);
        this._state = this._seed;
        this._normalCache = null;
    }

    getSeed(){
        return this._seed;
    }

    next(){
        let t = this._state += 0x6D2B79F5;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        const out = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        return out;
    }

    nextOpen(){
        const x = this.next();
        if(x === 0) return Number.EPSILON;
        if(x === 1) return 1 - Number.EPSILON;
        return x;
    }

    nextInt(minInclusive, maxInclusive){
        if(maxInclusive < minInclusive) throw new Error('Invalid integer range.');
        const span = maxInclusive - minInclusive + 1;
        return minInclusive + Math.floor(this.next() * span);
    }

    nextNormal(){
        if(this._normalCache !== null){
            const z = this._normalCache;
            this._normalCache = null;
            return z;
        }

        const u1 = this.nextOpen();
        const u2 = this.nextOpen();
        const mag = Math.sqrt(-2.0 * Math.log(u1));
        const z0 = mag * Math.cos(2.0 * Math.PI * u2);
        const z1 = mag * Math.sin(2.0 * Math.PI * u2);
        this._normalCache = z1;
        return z0;
    }
}

module.exports = {
    RandomEngine,
    DEFAULT_SEED,
    hashSeed,
};
