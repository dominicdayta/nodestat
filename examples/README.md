# Examples

Runnable usage examples for the current `src/`-based API.

## Run examples

From the repository root:

```bash
node examples/sorting.js
node examples/random-seeding.js
node examples/random-distributions.js
```

## Available examples

- `examples/sorting.js`: Demonstrates dataframe sorting with:
  - legacy signature: `order(by, desc)`
  - helper signature: `order([..., nstat.desc("col"), nstat.asc("col")])`
- `examples/random-seeding.js`: Demonstrates `nstat.random.set_global_seed(...)` reproducibility.
- `examples/random-distributions.js`: Demonstrates construction and basic `pdf`/`cdf`/`pmf`/`sample` usage across the random distribution family.
