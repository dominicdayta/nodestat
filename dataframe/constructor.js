'use strict';

let getClass = require('../utils/getclass.js');

let dfConstruct = function(data = []){
    let newData = [];
    let classes = [];
    let names = null;

        if(data.length == 0){ // early exit
            return {
                data: newData,
                classes: classes,
                names: names
            };
        }

        names = Object.keys(data[0]);
        classes = getClass(data);

        for(let i = 0; i < data.length; i++){
            let thisDataRow = {};
            let thisInputRow = data[i];

            for(let j = 0; j < names.length; j++){
                let thisVal = thisInputRow[names[j]];
                let thisClass = classes[j];

                thisDataRow[names[j]] = String(thisVal);
                if(thisClass == "numeric") thisDataRow[names[j]] = Number(thisVal);
            }

            newData.push(thisDataRow);
        }

    return {
        data: newData,
        classes: classes,
        names: names
    };
}

module.exports = dfConstruct;