'use strict';

const DataFrame = require('../../dataframe/DataFrame.js');
const { parseFormula } = require('../formula/parser.js');
const { buildDesignMatrix } = require('../formula/designMatrix.js');
const { fitOls, predictFromDesign } = require('./matrix.js');
const { computeInference } = require('./inference.js');

class LinearModel {
    constructor({
        formula,
        parsed,
        data,
        design,
        coefficients,
        featureNames,
        fitted,
        residuals,
        residualStandardError,
        dfResidual,
        inference,
        options,
    }){
        this.formula = formula;
        this.parsed = parsed;
        this.data = data;
        this.design = design;
        this.coefficients = coefficients;
        this.feature_names = featureNames;
        this.residual_standard_error = residualStandardError;
        this.df_residual = dfResidual;
        this.options = options;
        this._fitted = fitted;
        this._residuals = residuals;
        this._inference = inference;
    }

    _toSingleColumnDataframe(columnName, values){
        const rows = [];
        for(let i = 0; i < values.length; i++){
            const row = {};
            row[columnName] = values[i];
            rows.push(row);
        }
        return new DataFrame(rows);
    }

    get fitted_values(){
        return this._toSingleColumnDataframe('fitted', this._fitted);
    }

    get residuals(){
        return this._toSingleColumnDataframe('residuals', this._residuals);
    }

    coef(){
        const out = {};
        for(let i = 0; i < this.feature_names.length; i++){
            out[this.feature_names[i]] = this.coefficients[i];
        }
        return out;
    }

    coeftable(){
        const rows = [];
        for(let i = 0; i < this._inference.coeff_rows.length; i++){
            const row = { ...this._inference.coeff_rows[i] };
            row.term = this.feature_names[i];
            rows.push(row);
        }
        return new DataFrame(rows);
    }

    anova(){
        return { ...this._inference.anova };
    }

    aov(){
        return this.anova();
    }

    predict(newData = null){
        const data = newData || this.data;
        const design = buildDesignMatrix(this.parsed, data, this.options);
        if(design.featureNames.join('|') !== this.feature_names.join('|')){
            throw new Error('Prediction data produced a different design matrix than the fitted model.');
        }
        const values = predictFromDesign(design.X, this.coefficients);
        return this._toSingleColumnDataframe('fitted', values);
    }

    summary(){
        return {
            formula: this.formula,
            r_squared: this._inference.r_squared,
            adj_r_squared: this._inference.adj_r_squared,
            mse: this._inference.mse,
            residual_standard_error: this.residual_standard_error,
            df_residual: this.df_residual,
            anova: this.anova(),
            coeff_table: this.coeftable().data,
            coefficients: this.coef(),
        };
    }
}

const lm = function(formula, data, options = {}){
    if(typeof formula !== 'string') throw new Error('lm expects a formula string.');
    if(!data || typeof data.colToArray !== 'function') throw new Error('lm expects a dataframe as data.');

    const parsed = parseFormula(formula);
    const design = buildDesignMatrix(parsed, data, options);
    if(design.n <= design.p) throw new Error('Not enough observations to estimate all model coefficients.');

    const fit = fitOls(design.X, design.y);
    const inference = computeInference(design.X, design.y, fit, options);
    return new LinearModel({
        formula,
        parsed,
        data,
        design,
        coefficients: fit.coefficients,
        featureNames: design.featureNames,
        fitted: fit.fitted,
        residuals: fit.residuals,
        residualStandardError: fit.residual_standard_error,
        dfResidual: fit.df_residual,
        inference,
        options,
    });
};

module.exports = {
    LinearModel,
    lm,
};
