'use strict';

let slicer = require('./slicer.js');
let binder = require('./binder.js');
let createKey = require('../utils/createkey.js');
let unique = require('../utils/unique.js');

let apply = function(data, FUN, axis, name){

    if(! [1,2].includes(axis)) throw("Invalid axis value");
    
    let applyData = [];
    if(data.length == 0) return(applyData);

    let names = Object.keys(data[0]);
    let ncol = names.length;    
    let nrow = data.length;

    if(axis == 1){
        let applyDataRow = {};

        for(let j = 0; j < ncol; j ++){
            applyDataRow[names[j]] = FUN(slicer.colToArray(data, names[j]));
        }

        applyData.push(applyDataRow);

    }else{
        for(let i = 0; i < nrow; i++){
            let applyDataRow = {};
            applyDataRow[name] = FUN(slicer.rowToArray(data, i));
            applyData.push(applyDataRow);
        }

    }

    return applyData;
};

let aggregate = function(data, by, FUN){
    let aggregatedData = [];

    if(data.length == 0) return(aggregatedData);
    if(by.length == 0) throw("Need to identify one or more columns in BY");

    let names = Object.keys(data[0]);

    for(let j = 0; j < by.length; j++){
        if(! names.includes(by[j])) throw(`One or more columns in BY not found in data: ${by[j]}`);
    }

    let dataWithKey = binder.cbind(data, createKey(data, by));
    let keys = unique(dataWithKey, "_key");

    for(let k = 0; k < keys.length; k++){
        let dataForCurrentKey = slicer.subset(dataWithKey, "_key",(x)=>{return(x == keys[k])});
        let resultObject = apply(slicer.drop(dataWithKey, ["_key"].concat(by)), FUN, 1)[0];

        let resultAxis = {};
        for(let j = 0; j < by.length; j++){
            resultAxis[by[j]] = dataForCurrentKey[0][by[j]];
        }

        let mergedResult = {...resultAxis, ...resultObject}
        aggregatedData.push(mergedResult);
    }

    return(aggregatedData);
    
};

module.exports.apply = apply;
module.exports.aggregate = aggregate;