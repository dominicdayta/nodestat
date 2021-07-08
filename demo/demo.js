const nstat = require('../index.js');


let df = new nstat.df([{x:1,y:2,z:1},{x:2,y:3,z:4},{x:3, y:4, z:9}]);
let df2 = new nstat.df([{x:4, y:5, z:16}]);
let df3 = new nstat.df([{xx:1},{xx:8},{xx:27}]);

let arrays = {x: [1,2,3,4,5,6], y:[1,3,5,7,9,10], z:[2,4,6,8,10,12]};
let arrays2 = {type: ["a","a","b","a","b"], zone:[0,0,0,1,1], count: [0,0,2,1,1]};
df4 = nstat.df.fromArrayList(arrays2);

console.log("Number of columns: ");
console.log(df.ncol());
console.log("Number of rows: ");
console.log(df.nrow());
console.log("Name of columns: ");
console.log(df.columns());

console.log(nstat.stat.dataset("Titanic"));