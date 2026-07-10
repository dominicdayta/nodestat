'use strict';

const transpose = function(A){
    if(A.length === 0) return [];
    const rows = A.length;
    const cols = A[0].length;
    const out = [];
    for(let j = 0; j < cols; j++){
        const row = [];
        for(let i = 0; i < rows; i++) row.push(A[i][j]);
        out.push(row);
    }
    return out;
};

const multiply = function(A, B){
    const rows = A.length;
    const inner = A[0].length;
    const cols = B[0].length;
    const out = [];
    for(let i = 0; i < rows; i++){
        const row = [];
        for(let j = 0; j < cols; j++){
            let sum = 0;
            for(let k = 0; k < inner; k++) sum += A[i][k] * B[k][j];
            row.push(sum);
        }
        out.push(row);
    }
    return out;
};

const identity = function(n){
    const out = [];
    for(let i = 0; i < n; i++){
        const row = new Array(n).fill(0);
        row[i] = 1;
        out.push(row);
    }
    return out;
};

const invert = function(matrix){
    const n = matrix.length;
    const aug = [];
    for(let i = 0; i < n; i++){
        aug.push(matrix[i].concat(identity(n)[i]));
    }

    for(let col = 0; col < n; col++){
        let pivot = col;
        for(let row = col + 1; row < n; row++){
            if(Math.abs(aug[row][col]) > Math.abs(aug[pivot][col])) pivot = row;
        }
        if(Math.abs(aug[pivot][col]) < 1e-12) throw new Error('Design matrix is singular; model is not identifiable.');
        if(pivot !== col){
            const tmp = aug[col];
            aug[col] = aug[pivot];
            aug[pivot] = tmp;
        }

        const div = aug[col][col];
        for(let j = 0; j < 2 * n; j++) aug[col][j] /= div;

        for(let row = 0; row < n; row++){
            if(row === col) continue;
            const factor = aug[row][col];
            for(let j = 0; j < 2 * n; j++) aug[row][j] -= factor * aug[col][j];
        }
    }

    const inv = [];
    for(let i = 0; i < n; i++) inv.push(aug[i].slice(n));
    return inv;
};

const asColumn = function(values){
    return values.map((v) => [v]);
};

const fromColumn = function(col){
    return col.map((row) => row[0]);
};

const fitOls = function(X, y){
    const Xt = transpose(X);
    const XtX = multiply(Xt, X);
    const XtXInv = invert(XtX);
    const betaCol = multiply(multiply(XtXInv, Xt), asColumn(y));
    const beta = fromColumn(betaCol);

    const fittedCol = multiply(X, betaCol);
    const fitted = fromColumn(fittedCol);
    const residuals = [];
    for(let i = 0; i < y.length; i++) residuals.push(y[i] - fitted[i]);

    const n = y.length;
    const p = beta.length;
    const dfResidual = n - p;
    let rss = 0;
    for(let i = 0; i < n; i++) rss += residuals[i] ** 2;
    const sigma2 = dfResidual > 0 ? rss / dfResidual : NaN;

    return {
        coefficients: beta,
        fitted,
        residuals,
        residual_standard_error: Math.sqrt(sigma2),
        df_residual: dfResidual,
        rss,
    };
};

const predictFromDesign = function(X, beta){
    return fromColumn(multiply(X, asColumn(beta)));
};

module.exports = {
    transpose,
    multiply,
    invert,
    fitOls,
    predictFromDesign,
};
