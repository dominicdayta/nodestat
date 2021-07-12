'use strict';

let createKey = function(data, cols){
    let keyCol = [];

    for(let i = 0; i < data.length; i++){
        let thisDataRow = data[i];
        let thisRowKey = "";
        
        for(let j = 0; j < cols.length - 1; j++){
            thisRowKey += String(thisDataRow[cols[j]]) + "-";
        }

        thisRowKey += String(thisDataRow[cols[cols.length - 1]]);
        keyCol.push({_key: thisRowKey});
    }

    return(keyCol);
}

module.exports = createKey;