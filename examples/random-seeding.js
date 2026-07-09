const nstat = require('../index.js');

nstat.random.set_global_seed(2026);
const normalA = nstat.random.normal(0, 1);
const drawsA = normalA.sample(5);

nstat.random.set_global_seed(2026);
const normalB = nstat.random.normal(0, 1);
const drawsB = normalB.sample(5);

console.log('Draws A:', drawsA);
console.log('Draws B:', drawsB);
console.log('Deterministic with same seed:', JSON.stringify(drawsA) === JSON.stringify(drawsB));
