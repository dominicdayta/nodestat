# Nodestat Documentation

These pages contain the API documentation for Nodestat, a Node JS library for data wrangling and analysis. For demo and sample uses, you may also visit the `./demo` directory.

## Installing

Install using NPM as

```properties
$ npm install @dominicdayta/nodestat
```

## Calling Nodestat

After installing Nodestat through npm, simply call it using

```javascript
const nstat = require('@dominicdayta/nodestat');
//-> To call the Dataframe module, use nstat.df
//-> To call the Stats module, use nstat.stats
```

## Contents

The rest of this documentation is split according to module. We also provide some sample documentations for how the package can integrate with other, existing packages, particularly the Plotly library for creating beautiful data visualizations.

- Dataframe
    - [Introduction](dataframe/introduction.md)
    - [Creating Dataframes](dataframe/creating.md)
    - [Basic Methods](basic.md)
    - [Slicing and Subsetting](dataframe/slicing.md)
    - [Combining](dataframe/combining.md)
    - [The Apply Functions](dataframe/apply.md)
- Stats
    - [Introduction](stats/introduction.md)
    - Statistics
    - Summarizing Data
    - Statistical Tests
- Extending to other packages
    - [Visualizing Dataframes with Plotly](extending/plotly.md)



Copyright &copy; 2021. Dominic Dayta. The code is licensed under the [MIT License](https://opensource.org/licenses/MIT).