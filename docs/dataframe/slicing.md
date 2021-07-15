# Slicing And Subsetting Datasets

The following methods allow you to split, slice, and subset your dataframes.

- [`colToArray`](#coltoarray)
- [`rowToArray`](#rowtoarray)
- [`rowToObject`](#rowtoobject)
- [`subset`](#subset)
- [`select`](#select)
- [`drop`](#drop)
- [`head`](#head)
- [`tail`](#tail)

## colToArray
[Back to top](#slicing-and-subsetting-datasets).

Takes a named column of a dataframe and returns it as a Javascript array.

Usage:

```javascript
df.colToArray(col);
```

Arguments:
- `col`: The name of the column to extract

Returns:
- A Javascript array, containing all data in `df` from column `col`.

Note that `col` must be a specific reference (string) to the column name as it appears on the data and is case sensitive.

Example:

```javascript
let titanicClasses = titanic.colToArray("Class");
```

## rowToArray
[Back to top](#slicing-and-subsetting-datasets).

Takes a row (identified by its numeric index) of a dataframe and returns it as a Javascript array. Note that this is not recommended as the dataframe may contain variables of different types. For a safer implementation, use [`rowToObject`](#rowtoobject) instead.

Usage:

```javascript
df.rowToArray(row);
```

Arguments:
- `row`: The index of the column to be returned.

Returns:
- A Javascript array, containing data for all variables in the specified row.

Note that `row` pertains to the row index (number from 0 to `df.nrow() - 1`).

Example:

```javascript
let firstPassenger = titanic.rowToArray(0);
```

## rowToObject
[Back to top](#slicing-and-subsetting-datasets).

Takes a row (identified by its numeric index) of a dataframe and returns it as a Javascript object. This is a safer implementation of [`rowToArray`](#rowtoarray) for the general use case as it prevents confusion from varying data types across columns in the dataframe.

Usage:

```javascript
df.rowToObject(row);
```

Arguments:
- `row`: The index of the column to be returned.

Returns:
- A Javascript object, containing data for all variables in the specified row.

Note that `row` pertains to the row index (number from 0 to `df.nrow() - 1`).

Example:

```javascript
let firstPassenger = titanic.rowToObject(0);
```

## subset
[Back to top](#slicing-and-subsetting-datasets).

Returns a subset of the dataframe according to a custom logic on a specified column.

Usage:

```javascript
df.subset(col, FUN);
```

Arguments:
- `col`: The name of the column on which to subset the data.
- `FUN`: An anonymous function that returns a `true`/`false` result for each row of the dataframe.

Returns:
- A Dataframe object, containing the subset of the original data.

The use of a custom function `FUN` allows the user to apply custom logic in subsetting the data. The `subset` method applies `FUN` to each row of the data, and returns only rows that return a `true` result on this function.

Example:

```javascript
let malePassengers = titanic.subset("sex", (x) => {
    if(x["Sex"] == "Male") return true;
    return false;
});
```

## select
[Back to top](#slicing-and-subsetting-datasets).

Subsets a dataframe-columnwise, by returning only a set of named variables.

Usage:

```javascript
df.subset(cols);
```

Arguments:
- `cols`: An array of column names to return from the dataframe.

Returns:
- A Dataframe object, containing only the columns names in `cols`.

Example:

```javascript
let titanicFreqs = titanic.select(["Sex","Class","Freq"]);
```

## drop
[Back to top](#slicing-and-subsetting-datasets).

Reverse form of [`select`](#select), this time returning the dataframe all columns **except** a set of named columns.

Usage:

```javascript
df.drop(cols);
```

Arguments:
- `cols`: An array of column names to drop from the dataframe.

Returns:
- A Dataframe object, containing all columns except those named in `cols`.

Example:

```javascript
let titanicFreqs = titanic.drop(["Survived"]);
```

## head
[Back to top](#slicing-and-subsetting-datasets).

Returns the first `n` rows of a dataframe.

Usage:

```javascript
df.head(n);
```

Arguments:
- `n`: The number of rows to return. Defaults to `n = 5`.

Returns:
- A Dataframe object, containing the first `n` rows from a dataframe.

Example:

```javascript
titanic.head(5);
```

## tail
[Back to top](#slicing-and-subsetting-datasets).

Returns the last `n` rows of a dataframe.

Usage:

```javascript
df.tail(n);
```

Arguments:
- `n`: The number of rows to return. Defaults to `n = 5`.

Returns:
- A Dataframe object, containing the last `n` rows from a dataframe.

Example:

```javascript
titanic.tail(5);
```