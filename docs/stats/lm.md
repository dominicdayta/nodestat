# Linear Models (`lm`)

Nodestat provides object-oriented linear models similar to R's `lm()`, with a Python-style model object API.

## Calling the module

```javascript
const nstat = require('@dominicdayta/nodestat');
const model = nstat.lm('weight ~ height', dataframe);
```

`nstat.stat.lm(...)` is also available.

## Formula features

Supported formula syntax includes:

- Basic terms: `weight ~ height + age`
- Interactions via `*`: `y ~ x * group` expands to `x + group + x:group`
- Transformations: `log(weight) ~ log(height)`
- As-is expressions: `weight ~ I(height^2)`
- Categorical predictors are automatically encoded as dummy variables

## Model object API

After fitting:

```javascript
model.coef();
model.coeftable();
model.anova();
model.aov();                 // alias of anova()
model.summary();
model.predict(newDataframe);
```

`fitted_values` and `residuals` return dataframe-compatible objects, so you can combine them with original data:

```javascript
const augmented = dataframe.cbind(model.residuals).cbind(model.fitted_values);
```

See [Linear Models Reference](lm-reference.md) for details.
