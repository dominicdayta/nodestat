# Statistical Tests Reference

All functions are available on `nstat.stat.tests`.

## t.test

One-sample:

```javascript
tests.t_test(x, mu);
tests.t_test(x, { mu: 0, alternative: 'two.sided' });
```

Two-sample:

```javascript
tests.t_test(x, y);
tests.t_test(x, y, { paired: true });
tests.t_test(x, y, { var_equal: true, alternative: 'greater' });
```

Returns an object with:

- `statistic`
- `parameter` (`df`, and `mu` for one-sample)
- `p_value`
- `method`
- `alternative`
- `estimate`

---

## wilcox.test

One-sample signed-rank:

```javascript
tests.wilcox_test(x, mu);
```

Two-sample:

```javascript
tests.wilcox_test(x, y);
tests.wilcox_test(x, y, { paired: true });
```

Returns an object with:

- `statistic` (`W`, `z`)
- `parameter`
- `p_value`
- `method`
- `alternative`

---

## aov

One-way ANOVA using a formula and dataframe:

```javascript
tests.aov('response ~ group', dataframe);
```

Or an object:

```javascript
tests.aov({
    response: 'extra',
    group: 'group',
    data: dataframe,
});
```

Returns:

- `statistic` (F)
- `parameter` (`df_between`, `df_within`)
- `p_value`
- `group_means`, `group_sizes`, `mse`, `df_residual`

---

## tukeyHSD

Pairwise comparisons after ANOVA:

```javascript
const model = tests.aov('extra ~ group', df);
const hsd = tests.tukeyHSD(model);
```

Returns:

- `term`
- `mse`
- `df`
- `comparisons` array with `comparison`, `diff`, `lwr`, `upr`, `p_adj`

---

## p.adjust

Adjust a vector of p-values for multiple comparisons:

```javascript
tests.p_adjust([0.01, 0.04, 0.03], 'holm');
tests.p_adjust(p, 'hochberg');
tests.p_adjust(p, 'bonferroni');
tests.p_adjust(p, 'BY');
```

Supported methods:

- `bonferroni`
- `holm` (Bonferroni-Holm step-down)
- `hochberg` (Bonferroni-Hochberg step-up)
- `BY` (Bonferroni-Yekutieli)

Returns an array of adjusted p-values in the original order.
