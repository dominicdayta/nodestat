// const nstat = require('@dominicdayta/nodestat');
const nstat = require('../index.js');

let stats = nstat.stat;
let women = stats.dataset("women");
let meanWeightHeight = women.apply(stats.mean, 1);
let varWeightHeight = women.apply(stats.var, 1);

console.log(meanWeightHeight.data);
console.log(varWeightHeight.data);

// rounded to 2 decimal places
meanWeightHeight = women.apply(function(x){return(stats.round(stats.mean(x),2))}, 1);
varWeightHeight = women.apply(function(x){return(stats.round(stats.var(x),2))}, 1);

console.log(meanWeightHeight.data);
console.log(varWeightHeight.data);