'use strict';

const { evaluateResponse, evaluatePredictorTerm } = require('./evaluate.js');

const buildDesignMatrix = function(parsed, data, options = {}){
    const includeIntercept = options.intercept !== false;
    const n = data.nrow();
    const y = evaluateResponse(parsed.response, data);
    const featureNames = [];
    const columns = [];

    if(includeIntercept){
        featureNames.push('(Intercept)');
        columns.push(new Array(n).fill(1));
    }

    for(let i = 0; i < parsed.predictors.length; i++){
        const termColumns = evaluatePredictorTerm(parsed.predictors[i], data);
        for(let j = 0; j < termColumns.length; j++){
            featureNames.push(termColumns[j].name);
            columns.push(termColumns[j].values);
        }
    }

    const X = [];
    for(let row = 0; row < n; row++){
        const xrow = [];
        for(let col = 0; col < columns.length; col++){
            xrow.push(columns[col][row]);
        }
        X.push(xrow);
    }

    return {
        X,
        y,
        featureNames,
        n,
        p: featureNames.length,
    };
};

module.exports = {
    buildDesignMatrix,
};
