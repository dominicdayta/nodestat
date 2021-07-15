# Apply Functions

The following methods allow you to apply custom functions and operations across a dataframe.

- [`apply`](#apply)
- [`aggregate`](#rowtoarray)
- [`colApply`](#colapply)
- [`colTransform`](#coltransform)

## apply
[Back to top](#apply-functions).

Applies a custom function across each row or each column of a dataframe.

Usage:

```javascript
df.apply(FUN, axis, name);
```

Arguments:
- `FUN`: The function to apply to the dataframe
- `axis`: Defines the direction of operation. Use `axis = 1` to apply the function row-wise, or `axis = 2` to apply the function column-wise.
- `name`: Optional, and only useful when `axis = 2`. Since the operation will result in a column of values, `name` indicates what name will be given to this new column.

Returns:
- A Dataframe object, containing the result of the operation.

Example:

```javascript
// get the average statistics of all samples in the women dataset
// uses the stats.mean method
const stats = nstat.stat;

let aveStats = women.apply((x) => {
    return(stats.round(stats.mean(x),2))
}, 1);
```

## aggregate
[Back to top](#apply-functions).

Aggregate a dataframe with a defined operation according to a set of grouping variables.

Usage:

```javascript
df.aggregate(by = [], FUN);
```

Arguments:
- `by`: An array of column names to use as grouping variables
- `FUN`: The operation to perform in aggregating

Returns:
- A Dataframe object, containing the aggregated data

Note that `aggregate` performs the function `FUN` across all variables in the dataframe **except** those named in `by`, which are used as grouping variables. In order to exclude particular variables from this behavior, it is recommended to use `aggregate` in conjunction with either [`select`](slicing.md#select) or [`drop`](slicing.md#drop) methods (see example).

Example:

```javascript
// get the average statistics of all samples in the women dataset
// uses the stats.mean method
const stats = nstat.stat;

// aggregate the total number of non-survivors by sex and age
let freqDiedSexAge = titanic
    .subset(col = "Survived", function(x){return(x == "No")})
    .select(["Sex","Age","Freq"])
    .aggregate(by = ["Sex","Age"], stats.sum)
    .data;
```

## colApply
[Back to top](#apply-functions).

Apply a function along a specific column in a dataframe. Returns a dataframe containing only the column that results from this operation.

Usage:

```javascript
df.colApply(FUN, col, name);
```

Arguments:
- `FUN`: The operation to perform
- `col`: Name of the column on which to apply the function
- `name`: Name of the new column generated

Returns:
- A Dataframe object, containing only a single column of data (named `name`) of values that result from applying `FUN` to `col`.

Example:

```javascript
// get the average statistics of all samples in the women dataset
// uses the stats.mean method
let sqFreq = titanic.colApply((x) => {return( x**2 )}, "Freq", "F2");
```

## colTransform
[Back to top](#apply-functions).

Apply a function along a specific column in a dataframe. Similar to [`colApply`](#colapply) except it returns the complete dataframe with the original column changed into the resulting values.

Usage:

```javascript
df.colApply(FUN, col);
```

Arguments:
- `FUN`: The operation to perform
- `col`: Name of the column on which to apply the function

Returns:
- A Dataframe object, containing the full dataframe, but with column `col` changed to its resulting values after applying `FUN`.

Example:

```javascript
// get the average statistics of all samples in the women dataset
// uses the stats.mean method
let sqFreq = titanic.colTransform((x) => {return( x**2 )}, "Freq");
```