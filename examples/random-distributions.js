const nstat = require('../index.js');

nstat.random.set_global_seed(7);

const normal = nstat.random.normal(0, 1);
const expo = nstat.random.exponential(2);
const gamma = nstat.random.gamma(2, 3);
const geom = nstat.random.geometric(0.3);
const unif = nstat.random.uniform(10, 20);
const pois = nstat.random.poisson(4);
const binom = nstat.random.binomial(10, 0.25);
const chi = nstat.random.chisquare(5);
const t = nstat.random.studentt(12);
const hyper = nstat.random.hypergeometric(100, 12, 8);

console.log('normal.pdf(0):', normal.pdf(0));
console.log('normal.cdf(1.96):', normal.cdf(1.96));
console.log('normal.sample(3):', normal.sample(3));

console.log('exponential.sample():', expo.sample());
console.log('gamma.sample():', gamma.sample());
console.log('geometric.pmf(3):', geom.pmf(3));
console.log('uniform.sample():', unif.sample());
console.log('poisson.pmf(2):', pois.pmf(2));
console.log('binomial.cdf(3):', binom.cdf(3));
console.log('chisquare.sample():', chi.sample());
console.log("studentt.cdf(0):", t.cdf(0));
console.log('hypergeometric.pmf(1):', hyper.pmf(1));
