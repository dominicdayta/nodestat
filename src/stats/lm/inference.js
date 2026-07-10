'use strict';

const { transpose, multiply, invert } = require('./matrix.js');
const { pFromT, fCdf } = require('../tests/helpers.js');

const mean = function(values){
    let s = 0;
    for(let i = 0; i < values.length; i++) s += values[i];
    return s / values.length;
};

const computeInference = function(X, y, fit, options = {}){
    const n = y.length;
    const p = fit.coefficients.length;
    const dfResidual = fit.df_residual;
    const hasIntercept = options.intercept !== false;
    const dfModel = hasIntercept ? p - 1 : p;

    const ybar = mean(y);
    let tss = 0;
    for(let i = 0; i < n; i++) tss += (y[i] - ybar) ** 2;

    const rss = fit.rss;
    const rSquared = tss > 0 ? 1 - rss / tss : NaN;
    const adjRSquared = (dfResidual > 0 && n - 1 > 0)
        ? 1 - ((1 - rSquared) * (n - 1)) / dfResidual
        : NaN;
    const mse = dfResidual > 0 ? rss / dfResidual : NaN;

    const Xt = transpose(X);
    const XtXInv = invert(multiply(Xt, X));
    const covBeta = [];
    for(let i = 0; i < p; i++){
        const row = [];
        for(let j = 0; j < p; j++) row.push(mse * XtXInv[i][j]);
        covBeta.push(row);
    }

    const coeffRows = [];
    for(let j = 0; j < p; j++){
        const estimate = fit.coefficients[j];
        const stdError = Math.sqrt(covBeta[j][j]);
        const tStatistic = stdError > 0 ? estimate / stdError : NaN;
        const pValue = Number.isFinite(tStatistic)
            ? pFromT(tStatistic, dfResidual, 'two.sided')
            : NaN;
        coeffRows.push({
            estimate,
            std_error: stdError,
            t_statistic: tStatistic,
            p_value: pValue,
        });
    }

    let fStatistic = NaN;
    let fPValue = NaN;
    if(dfModel > 0 && dfResidual > 0){
        const ssModel = tss - rss;
        const msModel = ssModel / dfModel;
        const msResidual = rss / dfResidual;
        fStatistic = msModel / msResidual;
        fPValue = 1 - fCdf(fStatistic, dfModel, dfResidual);
    }

    return {
        r_squared: rSquared,
        adj_r_squared: adjRSquared,
        mse,
        df_model: dfModel,
        anova: {
            statistic: fStatistic,
            df_model: dfModel,
            df_residual: dfResidual,
            p_value: fPValue,
        },
        coeff_rows: coeffRows,
    };
};

module.exports = {
    computeInference,
};
