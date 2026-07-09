'use strict';

let getClass = function(data = []){
    let classes = [];

    if(data.length == 0) return classes;

    let firstRow = data[0];
    let names = Object.keys(firstRow);

    for(let j = 0; j < names.length; j ++){
        let testClass = null;
        let testVal = firstRow[names[j]];
        if(testVal.constructor == Number) testClass = "numeric";
        if(testVal.constructor == String) testClass = "character";
        if(isNaN(Number(testVal))) testClass = "character";
        if(testClass == null) throw("Unknown data type in dataframe");

        classes.push(testClass);
    }

    return classes;
}

module.exports = getClass;
