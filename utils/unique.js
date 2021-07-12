'use strict';

let unique = function(data, col){
    let uniqueVals = [];
    if(data.length==0) return(uniqueVals);

    let names = Object.keys(data[0]);
    if(! names.includes(col)) throw(`Specified column not in dataframe: ${col}`);
    
    for(let i = 0; i < data.length; i++){
        let thisValue = data[i][col];
        if(! uniqueVals.includes(thisValue)) uniqueVals.push(thisValue);
    }

    return uniqueVals
};

module.exports = unique;