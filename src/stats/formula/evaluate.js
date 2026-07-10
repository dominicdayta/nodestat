'use strict';

const isIdentifier = function(token){
    return /^[A-Za-z_][A-Za-z0-9_]*$/.test(token);
};

const getColumnValues = function(data, name){
    if(!data._hasColumn(name)) throw new Error(`Unknown column in formula: ${name}`);
    return data.colToArray(name);
};

const isNumericColumn = function(data, name){
    const values = getColumnValues(data, name);
    if(values.length === 0) return false;
    return values.every((v) => typeof v === 'number' && Number.isFinite(v));
};

const encodeCategoricalValues = function(name, values){
    const levels = [];
    for(let i = 0; i < values.length; i++){
        const v = String(values[i]);
        if(!levels.includes(v)) levels.push(v);
    }
    levels.sort();

    const columns = [];
    for(let j = 1; j < levels.length; j++){
        const level = levels[j];
        const col = [];
        for(let i = 0; i < values.length; i++){
            col.push(String(values[i]) === level ? 1 : 0);
        }
        columns.push({ name: `${name}${level}`, values: col });
    }
    return columns;
};

const evaluateIExpression = function(expr, data){
    const names = data.columns();
    let jsExpr = expr.trim();
    for(let i = 0; i < names.length; i++){
        const col = names[i];
        const re = new RegExp(`\\b${col}\\b`, 'g');
        jsExpr = jsExpr.replace(re, `values["${col}"]`);
    }
    jsExpr = jsExpr.replace(/\^/g, '**');

    const n = data.nrow();
    const out = [];
    for(let row = 0; row < n; row++){
        const values = {};
        for(let i = 0; i < names.length; i++){
            values[names[i]] = Number(data.rowToObject(row)[names[i]]);
        }
        let result;
        try {
            result = Function('values', 'Math', `return (${jsExpr});`)(values, Math);
        } catch (err) {
            throw new Error(`Could not evaluate I(${expr}): ${err.message}`);
        }
        if(!Number.isFinite(result)) throw new Error(`I(${expr}) produced a non-finite value at row ${row}.`);
        out.push(result);
    }
    return out;
};

const evaluateCall = function(callExpr, data){
    const match = callExpr.match(/^([A-Za-z_][A-Za-z0-9_]*)\((.+)\)$/);
    if(!match) throw new Error(`Invalid function term: ${callExpr}`);
    const fn = match[1];
    const arg = match[2].trim();
    const supported = { log: Math.log, exp: Math.exp, sqrt: Math.sqrt };
    if(!supported[fn]) throw new Error(`Unsupported formula function: ${fn}`);

    let values;
    if(isIdentifier(arg)){
        values = getColumnValues(data, arg).map(Number);
    } else if(arg.startsWith('I(') && arg.endsWith(')')){
        values = evaluateIExpression(arg.slice(2, -1), data);
    } else {
        throw new Error(`Unsupported function argument: ${arg}`);
    }

    return values.map((v) => {
        const out = supported[fn](v);
        if(!Number.isFinite(out)) throw new Error(`Transformation ${fn} produced non-finite value.`);
        return out;
    });
};

const evaluateAtomicFactor = function(term, data){
    const trimmed = term.trim();
    if(trimmed.startsWith('I(') && trimmed.endsWith(')')){
        return [{ name: trimmed, values: evaluateIExpression(trimmed.slice(2, -1), data) }];
    }
    if(/^[A-Za-z_][A-Za-z0-9_]*\(.+\)$/.test(trimmed)){
        return [{ name: trimmed, values: evaluateCall(trimmed, data) }];
    }
    if(isIdentifier(trimmed)){
        if(isNumericColumn(data, trimmed)){
            return [{ name: trimmed, values: getColumnValues(data, trimmed).map(Number) }];
        }
        return encodeCategoricalValues(trimmed, getColumnValues(data, trimmed));
    }
    throw new Error(`Could not parse formula term: ${term}`);
};

const multiplyColumns = function(a, b){
    if(a.length !== b.length) throw new Error('Interaction terms require equal-length columns.');
    const out = [];
    for(let i = 0; i < a.length; i++) out.push(a[i] * b[i]);
    return out;
};

const crossInteraction = function(leftCols, rightCols){
    const out = [];
    for(let i = 0; i < leftCols.length; i++){
        for(let j = 0; j < rightCols.length; j++){
            out.push({
                name: `${leftCols[i].name}:${rightCols[j].name}`,
                values: multiplyColumns(leftCols[i].values, rightCols[j].values),
            });
        }
    }
    return out;
};

const evaluateResponse = function(responseExpr, data){
    const cols = evaluateAtomicFactor(responseExpr, data);
    if(cols.length !== 1) throw new Error('Response must evaluate to a single numeric column.');
    return cols[0].values;
};

const evaluatePredictorTerm = function(term, data){
    if(!term.includes(':')){
        return evaluateAtomicFactor(term, data);
    }

    const parts = term.split(':').map((s) => s.trim());
    let combined = evaluateAtomicFactor(parts[0], data);
    for(let i = 1; i < parts.length; i++){
        const next = evaluateAtomicFactor(parts[i], data);
        combined = crossInteraction(combined, next);
    }
    return combined;
};

module.exports = {
    evaluateResponse,
    evaluatePredictorTerm,
    evaluateAtomicFactor,
    isNumericColumn,
    getColumnValues,
};
