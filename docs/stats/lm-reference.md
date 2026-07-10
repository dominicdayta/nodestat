# Linear Models Reference

## lm(formula, data, options?)

Fit an ordinary least squares linear model.

```javascript
const model = nstat.lm('weight ~ height', women);
```

### Arguments

- `formula`: model formula string (`response ~ predictors`)
- `data`: nodestat dataframe
- `options.intercept`: include intercept column (default `true`)

### Formula operators

| Syntax | Meaning |
| --- | --- |
| `+` | add terms |
| `*` | main effects plus interaction (`a * b` → `a + b + a:b`) |
| `:` | interaction only (`a:b`) |
| `I(expr)` | evaluate expression as-is (`I(x^2)`) |
| `log(x)`, `exp(x)`, `sqrt(x)` | transformations |

Non-numeric predictors are converted to dummy variables (first level is reference).

---

## LinearModel methods and properties

### `coef()`

Returns an object mapping term names to estimated coefficients.

### `predict(newData?)`

Returns a single-column dataframe with key `fitted`.

- Without `newData`, returns in-sample fitted values.
- With `newData`, requires the same formula structure and compatible columns.

### `fitted_values`

Getter returning a single-column dataframe (`fitted`) for `cbind` with original data.

### `residuals`

Getter returning a single-column dataframe (`residuals`) for `cbind` with original data.

### `summary()`

Returns an object similar to R's `summary.lm()`:

- `r_squared`, `adj_r_squared`, `mse`
- `anova`: omnibus model F-test (`statistic`, `df_model`, `df_residual`, `p_value`)
- `coeff_table`: coefficient inference table
- `coefficients`, `residual_standard_error`, `df_residual`

### `coeftable()`

Returns a dataframe with columns:

- `term`, `estimate`, `std_error`, `t_statistic`, `p_value`

### `anova()` / `aov()`

Returns the omnibus ANOVA F-test object for the fitted model.

---

## Examples

```javascript
const women = nstat.stat.dataset('women');

const linear = nstat.lm('weight ~ height', women);
const logLog = nstat.lm('log(weight) ~ log(height)', women);
const poly = nstat.lm('weight ~ I(height^2)', women);

const sleep = nstat.stat.dataset('sleep');
const withGroup = nstat.lm('extra ~ group', sleep);
const withInteraction = nstat.lm('extra ~ group * ID', sleep);
```
