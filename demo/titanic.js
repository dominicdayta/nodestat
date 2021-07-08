// const nstat = require('@dominicdayta/nodestat');
const nstat = require('../index.js');

let stats = nstat.stat;

// initiate the titanic dataset
let titanic = stats.dataset("Titanic");

// get the subset containing only survivors
let titanicSurvivors = titanic.subset(col = "Survived", function(x){return(x == "Yes")});
console.log(titanicSurvivors.data);

// aggregate the total number of survivors by sex and class
let freqSurvivedBySexClass = titanic.select(["Class","Sex","Freq"]).aggregate(by = ["Class","Sex"], stats.sum);
console.log(freqSurvivedBySexClass.data);

// aggregate the total number of non-survivors by sex and age
let freqDiedSexAge = titanic
    .subset(col = "Survived", function(x){return(x == "No")})
    .select(["Sex","Age","Freq"])
    .aggregate(by = ["Sex","Age"], stats.sum)
    .data;
console.log(freqDiedSexAge);
