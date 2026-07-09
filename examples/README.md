# Examples

Runnable usage examples for the current `src/`-based API.

## Run examples

From the repository root:

```bash
node examples/sorting.js
```

## Available examples

- `examples/sorting.js`: Demonstrates dataframe sorting with:
  - legacy signature: `order(by, desc)`
  - helper signature: `order([..., nstat.desc("col"), nstat.asc("col")])`
