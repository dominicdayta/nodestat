# Random Distributions Reference

All distribution constructors are called from `nstat.random`.

## Shared API pattern

Every distribution object supports:

- `sample()`: draws one sample
- `sample(n)`: draws `n` samples and returns a Javascript array
- `cdf(x)`: cumulative probability up to `x`

Continuous distributions expose:

- `pdf(x)`

Discrete distributions expose:

- `pmf(k)`
- `pdf(k)` (alias to `pmf(k)` for convenience)

---

## Normal

Constructor:

```javascript
const d = nstat.random.normal(loc = 0, scale = 1);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Exponential

Constructor:

```javascript
const d = nstat.random.exponential(rate = 1);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Gamma

Constructor:

```javascript
const d = nstat.random.gamma(shape, scale = 1);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Geometric

Constructor:

```javascript
const d = nstat.random.geometric(p);
```

Methods: `pmf(k)`, `pdf(k)`, `cdf(k)`, `sample(n?)`

---

## Uniform

Constructor:

```javascript
const d = nstat.random.uniform(low = 0, high = 1);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Poisson

Constructor:

```javascript
const d = nstat.random.poisson(lambda);
```

Methods: `pmf(k)`, `pdf(k)`, `cdf(k)`, `sample(n?)`

---

## Binomial

Constructor:

```javascript
const d = nstat.random.binomial(n, p);
```

Methods: `pmf(k)`, `pdf(k)`, `cdf(k)`, `sample(n?)`

---

## Chi-square

Constructor:

```javascript
const d = nstat.random.chisquare(df);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Student's t

Constructor:

```javascript
const d = nstat.random.studentt(df);
```

Methods: `pdf(x)`, `cdf(x)`, `sample(n?)`

---

## Hypergeometric

Constructor:

```javascript
const d = nstat.random.hypergeometric(populationSize, successStates, draws);
```

Methods: `pmf(k)`, `pdf(k)`, `cdf(k)`, `sample(n?)`

---

## Reproducibility notes

- Use `nstat.random.set_global_seed(seed)` before constructing distributions if you want reproducible draws.
- All distributions use the same global random engine by default.
