# Basic Methods

Each dataframe contains a number of basic methods and properties. These are listed below:

- [`toString`](#toString)
- [`print`](#print)
- [`nrow`](#nrow)
- [`ncol`](#ncol)
- [`columns`](#columns)
- [`classes`](#classes)
- [`data`](#data)

## toString
[Back to top](#basic-methods).

Returns the dataframe as a JSON string.

Usage:

```javascript
df.toString();
```

Returns:
- A JSON string of the data contained in `df`.

## print
[Back to top](#basic-methods).

Prints the data to console. Note that this is not recommended when dealing with very large dataframes. Consider using [`head`](slicing.md#head) or [`tail`](slicing.md#tail) instead.

Usage:

```javascript
df.print();
```

Returns:
- A JSON string of the data contained in `df`.

## nrow
[Back to top](#basic-methods).

Returns the number of rows in the dataframe.

Usage:

```javascript
df.nrow();
```

Returns:
- Number, the number of rows in the dataframe.

## ncol
[Back to top](#basic-methods).

Returns the number of column in the dataframe.

Usage:

```javascript
df.ncol();
```

Returns:
- Number, the number of columns in the dataframe.

## columns
[Back to top](#basic-methods).

Returns an array of all column names in the dataframe

Usage:

```javascript
df.columns();
```

Returns:
- A Javascript array containing the names (as Strings) of all the columns in the dataframe.

## classes
[Back to top](#basic-methods).

Technically an attribute and not a method (call without the parentheses). This is an array of the different data type ("String" or "Number") associated with each column in the dataframe.

Usage:

```javascript
df.classes;
```

Returns:
- A Javascript array containing the data types (String or Number) of each column in the dataframe.

## data
[Back to top](#basic-methods).

Technically an attribute and not a method (call without the parentheses). This is the data contained in the Dataframe, as a Javascript object.

Usage:

```javascript
df.data;
```

Returns:
- A Javascript object of the data contained in the dataframe.