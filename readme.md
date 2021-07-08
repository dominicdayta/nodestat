# @dominicdayta/nodestat
## A lightweight package for data wrangling and analysis

[![GitHub license](https://img.shields.io/github/license/dominicdayta/nodestat)](https://github.com/dominicdayta/nodestat/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/dominicdayta/nodestat)](https://github.com/dominicdayta/nodestat/issues)

Written For NodeJS By Dominic Dayta (@dominicdayta)

### Install

Install using NPM as

```properties
$ npm install @dominicdayta/nodestat
```

### Usage and Documentation

The package currently contains two primary modules:

`stat`: Contains basic statistical formulas and tests.

`df`: Contains useful functions for creating and managing dataframes.

```javascript
const nstat = require('@dominicdayta/nodestat');

let stats = nstat.stat; // for shorthand

// initiate the titanic dataset
let titanic = stats.dataset("Titanic");

// get the subset containing only survivors
let titanicSurvivors = titanic.subset(col = "Survived", 
    function(x){
        return(x == "Yes")
    }
);
console.log(titanicSurvivors.data);

// aggregate the total number of survivors by sex and class
let freqSurvivedBySexClass = titanic
    .select(["Class","Sex","Freq"])
    .aggregate(by = ["Class","Sex"], stats.sum);
console.log(freqSurvivedBySexClass.data);

// aggregate the total number of non-survivors by sex and age
let freqDiedSexAge = titanic
    .subset(col = "Survived", function(x){return(x == "No")})
    .select(["Sex","Age","Freq"])
    .aggregate(by = ["Sex","Age"], stats.sum)
    .data;
console.log(freqDiedSexAge);
```

You can look into some sample use cases in the `./demo` directory. Our full documentation is still in progress.