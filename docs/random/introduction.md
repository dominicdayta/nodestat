# Random Module Introduction

Nodestat includes a `random` module for seedable random number generation and object-oriented probability distributions.

## Calling the module

```javascript
const nstat = require('@dominicdayta/nodestat');
```

Then call random utilities through `nstat.random`.

## Global seed control

Use the global seed to make sampling deterministic and reproducible:

```javascript
nstat.random.set_global_seed(2026);
let seed = nstat.random.get_global_seed();
```

You can also draw a raw uniform random number in `[0, 1)`:

```javascript
let u = nstat.random.random();
```

## Distribution objects

Like NumPy/Torch style APIs, you first create a distribution object, then call methods such as `pdf`, `cdf`, and `sample`:

```javascript
const normal = nstat.random.normal(0, 1);

let density = normal.pdf(0);
let probability = normal.cdf(1.96);
let oneDraw = normal.sample();
let manyDraws = normal.sample(1000);
```

## Supported distributions

Nodestat currently supports:

- Normal
- Exponential
- Gamma
- Geometric
- Uniform
- Poisson
- Binomial
- Chi-square
- Student's t
- Hypergeometric

For constructor signatures and methods for each distribution, see [Per Distribution Reference](distributions.md).
