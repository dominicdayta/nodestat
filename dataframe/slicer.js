'use strict';

let colToArray = function(data, colIndex){
    let colValues = [];

    if(data.length == 0) return(colValues);
    let names = Object.keys(data[0]);
    let nrow = data.length;

    if(! names.includes(colIndex)) throw(`Specified column ${colIndex} not in data`);
    
    for(let i = 0; i < nrow; i ++){
        colValues.push(data[i][colIndex]);
    }

    return colValues;
}

let rowToObject = function(data, rowIndex){
    rowIndex = Number(rowIndex);
    if(isNaN(rowIndex)) throw("Invalid row index given");
    if(rowIndex >= data.length) throw("Index out of bounds");
    return(this.data[rowIndex]);
}

let rowToArray = function(data, rowIndex){
    let thisRow = [];
    rowIndex = Number(rowIndex);

    if(isNaN(rowIndex)) throw("Invalid row index given");
    if(rowIndex >= data.length) throw("Index out of bounds");
    let thisDataRow = data[rowIndex];
    let thisDataNames = Object.keys(thisDataRow);
    
    for(let j = 0; j < thisDataNames.length; j++){
        thisRow.push(thisDataRow[thisDataNames[j]]);
    }

    return(thisRow);
}

let subset = function(data, col, FUN){
    let subsetData = [];

    if(data.length == 0) return(subsetData);
    
    let dataNames = Object.keys(data[0]);
    if(!dataNames.includes(col)) throw(`Specified column name ${col} not in dataframe`);
    
    let currentCol = colToArray(data, col);
    for(let i = 0; i < data.length; i++){
        if(FUN(currentCol[i])) subsetData.push(data[i]);
    }

    return subsetData;
}

let select = function(data, colIndices){
    let dataSubset = [];

    if(data.length == 0) return(dataSubset);
    if(colIndices.length == 0) throw("Must specify one or more columns to select");    

    let names = Object.keys(data[0]);
    for(let j = 0; j < colIndices.length; j++){
        if(! names.includes(colIndices[j])) throw(`One or more column names specified not in data: ${col}`);
    }
    
    for(let i = 0; i < data.length; i++){
        let currentRow = data[i];
        let currentSubsetRow = {};
        
        for(let j = 0; j < colIndices.length; j++){
            currentSubsetRow[colIndices[j]] = currentRow[colIndices[j]];
        }

        dataSubset.push(currentSubsetRow);
    }

    return dataSubset;
}

let drop = function(data, colIndices){
    let dataSubset = [];

    if(colIndices.length == 0) throw("Must specify one or more columns to drop");
    if(data.length == 0) return(dataSubset);

    let names = Object.keys(data[0]);

    for(let j = 0; j < colIndices.length; j++){
        if(! names.includes(colIndices[j])) throw(`One or more column names specified not in data: ${colIndices[j]}`);
    }
    
    for(let i = 0; i < data.length; i++){
        let currentRow = data[i];
        let currentSubsetRow = {};
        
        for(let j = 0; j < names.length; j++){
            if(! colIndices.includes(names[j])) currentSubsetRow[names[j]] = currentRow[names[j]];
        }

        dataSubset.push(currentSubsetRow);
    }

    return dataSubset;
}

let head = function(data, n){
    let dataHead = [];

    if(data.length == 0) return(dataHead);

    for(let i = 0; i < Math.min(data.length, n); i ++){
        dataHead.push(data[i]);
    }

    return dataHead;
}

let tail = function(data, n){
    let dataHead = [];
    if(data.length == 0) return(dataHead);
    
    for(let i = 1; i <= Math.min(data.length, n); i ++){
        dataHead.push(data[data.length - i]);
    }

    return dataHead;
}

module.exports.colToArray = colToArray;
module.exports.rowToArray = rowToArray;
module.exports.rowToObject = rowToObject;
module.exports.subset = subset;
module.exports.select = select;
module.exports.drop = drop;
module.exports.head = head;
module.exports.tail = tail;
