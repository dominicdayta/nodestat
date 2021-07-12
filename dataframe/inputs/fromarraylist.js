'use strict';

let fromArrayList = function(arrayList){
    let arrayNames = Object.keys(arrayList);
    let lengthOfFirstArray = arrayList[arrayNames[0]].length;
    let jsonFormat = [];

    for(let i = 0; i < arrayList[arrayNames[0]].length; i++){
        let jsonFormatRow = {};

        for(let j = 0; j < arrayNames.length; j++){
            let thisColumn = arrayList[arrayNames[j]];
            if(thisColumn.length != lengthOfFirstArray) throw("One or more arrays not compatible in length");

            jsonFormatRow[arrayNames[j]] = thisColumn[i];
        }

        jsonFormat.push(jsonFormatRow);
    }

    return jsonFormat;
}

module.exports = fromArrayList;