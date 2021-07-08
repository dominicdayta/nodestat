# @dominicdayta/nodestat
## A lightweight package for data wrangling and analysis

Written For NodeJS By Dominic Dayta

### Install
```
$ npm install @dominicdayta/nodestat
```

### Usage and Documentation

The package currently contains two primary modules:

`stat`: Contains basic statistical formulas and tests.

`df`: Contains useful functions for creating and managing dataframes.

```
const nstat = require('../index.js');

let df = new nstat.df([{x:1,y:2,z:1},{x:2,y:3,z:4},{x:3, y:4, z:9}]);

console.log("Number of columns: ");
console.log(df.ncol());
console.log("Number of rows: ");
console.log(df.nrow());
console.log("Name of columns: ");
console.log(df.columns());
```

You can look into some sample use cases in the `./demo` directory. Our full documentation is still in progress.