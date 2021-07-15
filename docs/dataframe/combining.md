# Combining Dataframes

The following methods allow binding, combining, and merging dataframes.

- [`cbind`](#cbind)
- [`rbind`](#rbind)

## cbind
[Back to top](#combining-dataframes).

Combines two dataframes column-wise.

Usage:

```javascript
df.cbind(df2);
```

Arguments:
- `df2`: Another dataframe to combine with `df`

Returns:
- A Dataframe object, with `df2` appended horizontally after `df`.

Note that `cbind` will throw an error if `df` and `df2` are of non-matching lengths.

## rbind
[Back to top](#combining-dataframes).

Combines two dataframes row-wise.

Usage:

```javascript
df.rbind(df2);
```

Arguments:
- `df2`: Another dataframe to combine with `df`

Returns:
- A Dataframe object, with `df2` appended vertically after `df`.

Note that `rbind` by default fills in any non-matching columns between `df` and `df2` with null (missing) values.