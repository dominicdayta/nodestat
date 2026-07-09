# Statistical Tests

Nodestat provides hypothesis testing utilities under `nstat.stat.tests`, patterned after common R functions in `stats`.

## Calling the module

```javascript
const nstat = require('@dominicdayta/nodestat');
const tests = nstat.stat.tests;
```

## Available procedures

- `t_test` / `t.test`: one- and two-sample t-tests
- `wilcox_test` / `wilcox.test`: one- and two-sample Wilcoxon tests
- `aov`: one-way ANOVA
- `tukeyHSD`: Tukey honest significant differences after ANOVA
- `p_adjust` / `p.adjust`: multiple-comparison p-value adjustment

See [Tests Reference](tests-reference.md) for full signatures and return values.

## Quick example

```javascript
const sleep = nstat.stat.dataset('sleep');
const g1 = sleep.subset('group', (x) => x === '1').colToArray('extra');
const g2 = sleep.subset('group', (x) => x === '2').colToArray('extra');

const paired = nstat.stat.tests.t_test(g1, g2, { paired: true });
console.log(paired.statistic, paired.p_value);

const model = nstat.stat.tests.aov('extra ~ group', sleep);
const hsd = nstat.stat.tests.tukeyHSD(model);
console.log(hsd.comparisons);
```

For paired tests with arrays, observations in `x` and `y` must be aligned by index.
