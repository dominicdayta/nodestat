# Nodestat

A Node JS package for data wrangling and analysis

[![GitHub license](https://img.shields.io/github/license/dominicdayta/nodestat)](https://github.com/dominicdayta/nodestat/blob/main/LICENSE)
[![GitHub issues](https://img.shields.io/github/issues/dominicdayta/nodestat)](https://github.com/dominicdayta/nodestat/issues)

## Project Goals

Both Javascript and Node already have a variety of packages that deal with dataframes and statistical computation. The goal with Nodestat is to create a unified grammar of data analysis that can transform Javascript into a fully capable language for data analysis. Specific design goals are as follows:

- An Intuitive Grammar. Even without a third party package, Javascript already contains some functionality for handling data using Javascript Objects and JSON. In fact, many of the base functions that Nodestat implements through its `Dataframe` module are hardly novel and can be written by any experienced Javascript developer. With Nodestat, however, the aim is to create a grammar for data analysis that is intuitive and efficient, allowing the same split-apply-combine strategy for data wrangling that the `plyr`/`dplyr` package provides for the R language, and that `pandas` provides for the Python language.

- Close Integration with Statistical Packages. The `Dataframe` module isn't just another package for handling data in Javascript. It's designed to play well with packages for data analysis and statistical computation. The `Stats` module demonstrates this capability. In the future, hopefully additional modules and independent packages will be developed following the `Dataframe` grammar for more advanced data analysis and machine learning.

If you are interested in contributing to this project, please see our [contribution guidelines](contributing.md) for more information.
## Usage
### Install

Install using NPM as

```properties
$ npm install @dominicdayta/nodestat
```

### API Documentation

The package currently contains three primary modules:

`stat`: Contains basic statistical formulas and tests.

`df`: Contains useful functions for creating and managing dataframes.

`random`: Seedable random number generation and object-oriented probability distributions.

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

// sort using helper syntax (similar to dplyr::arrange)
let sorted = titanic.order(["Class", nstat.desc("Freq")]);
console.log(sorted.head(5).data);
```

### Random module

Nodestat provides a seedable random API with distribution objects similar to NumPy and PyTorch. Create a distribution, then call `pdf`, `cdf`, and `sample`:

```javascript
const nstat = require('@dominicdayta/nodestat');

// reproducible sampling
nstat.random.set_global_seed(2026);

const normal = nstat.random.normal(0, 1);
console.log(normal.pdf(0));
console.log(normal.cdf(1.96));
console.log(normal.sample(5));

const pois = nstat.random.poisson(3);
console.log(pois.pmf(2));
console.log(pois.sample());
```

Supported distributions include normal, exponential, gamma, geometric, uniform, poisson, binomial, chi-square, Student's t, and hypergeometric. See [random module docs](docs/random/introduction.md) for the full reference.

You can look into sample runnable use cases in the `./examples` directory (legacy examples are in `./demo`). For full documentation on how to use the API, please look into the `./docs` directory.

# License

This package is licensed under the MIT License. Copyright &copy; 2021, Dominic Dayta.