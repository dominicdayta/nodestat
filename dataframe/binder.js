'use strict';

let cbind = function(df1, df2){
    let bindedData = [];

    if(df1.length != df2.length) throw("Rows do not match");
    
    for(let i = 0; i < df1.length; i++){
        let leftRow = df1[i];
        let rightRow = df2[i];
        let mergedRow = {...leftRow, ...rightRow};
        
        bindedData.push(mergedRow);
    }

    return(bindedData);
}

let rbind = function(df1, df2){
    let df1Names = Object.keys(df1);
    let df2Names = Object.keys(df2);
    
    if(df1Names.length != df2Names) warn("Left and right dataframes not matching in columns.");
    return(df1.concat(df2));
}

module.exports.cbind = cbind;
module.exports.rbind = rbind;