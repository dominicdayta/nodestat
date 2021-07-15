# Creating Dataframes

Dataframes can be created using a number of possible methods:

- [Creating a new Dataframe instance](#creating-a-new-dataframe-instance)
- [`fromArrayList`: From individual arrays](#fromarraylist)

## Creating a new Dataframe instance
[Back to top](#creating-dataframes).

Usage:

```javascript
let df = new nstat.df($obj);
```

Arguments:
- $obj: a Javascript object containing the data

Returns:
- A Dataframe object

Dataframes are defined as an ES6 class built on top of the standard use of Javascript object to denote multi-row, multi-feature data. For instance, suppose the following data was pulled from a database:

```json
[
    {x: 1, y: 1, z: 1},
    {x: 2, y: 4, z: 8},
    {x: 3, y: 9, z: 27}
]
```

Load this into the object `dataObj` and create a new Dataframe by using:

```javascript
const dataObj = [
    {x: 1, y: 1, z: 1},
    {x: 2, y: 4, z: 8},
    {x: 3, y: 9, z: 27}
];

let df = new Dataframe(dataObj);
```

## fromArrayList
[Back to top](#creating-dataframes).

Usage:

```javascript
let df = nstat.df.fromArrayList({arr1: [], arr2: [], ...});
```

Arguments:
- An object containing arrays, where each array is an individual variable column. Each array must be of similar lengths.

Returns:
- A Dataframe object.

In many cases, the data returned may not come in the form of a standard Javascript object. It is possible that the data is actually separated into arrays, where each array represents a new column of data. To create a new dataframe from these arrays, simply pass them within an object, where the keys stand for the name of the variables.

Consider the following `dataObj`:

```json
[
    {x: 1, y: 1, z: 1},
    {x: 2, y: 4, z: 8},
    {x: 3, y: 9, z: 27}
]
```

This can be passed into a new Dataframe object alternatively as

```javascript
let df = nstat.df.fromArrayList({
    x: [1,2,3],
    y: [1,4,9],
    z: [1,8,27]
});
```