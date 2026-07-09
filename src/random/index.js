'use strict';

const { RandomEngine } = require('./engine.js');
const distributions = require('./distributions.js');

let globalEngine = new RandomEngine();

const getGlobalRandom = function(){
    return globalEngine;
};

const randomApi = Object.assign(
    {
        set_global_seed: (seed) => {
            globalEngine = new RandomEngine(seed);
            return globalEngine.getSeed();
        },
        get_global_seed: () => globalEngine.getSeed(),
        create_engine: (seed) => new RandomEngine(seed),
        random: () => globalEngine.next(),
    },
    distributions.createFactory(getGlobalRandom),
    {
        distributions: {
            Distribution: distributions.Distribution,
            NormalDistribution: distributions.NormalDistribution,
            ExponentialDistribution: distributions.ExponentialDistribution,
            GammaDistribution: distributions.GammaDistribution,
            GeometricDistribution: distributions.GeometricDistribution,
            UniformDistribution: distributions.UniformDistribution,
            PoissonDistribution: distributions.PoissonDistribution,
            BinomialDistribution: distributions.BinomialDistribution,
            ChiSquareDistribution: distributions.ChiSquareDistribution,
            StudentTDistribution: distributions.StudentTDistribution,
            HypergeometricDistribution: distributions.HypergeometricDistribution,
        },
    }
);

module.exports = randomApi;
