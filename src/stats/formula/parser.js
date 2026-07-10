'use strict';

const splitTopLevel = function(input, delimiter){
    const parts = [];
    let depth = 0;
    let current = '';
    for(let i = 0; i < input.length; i++){
        const ch = input[i];
        if(ch === '(') depth += 1;
        if(ch === ')') depth -= 1;
        if(ch === delimiter && depth === 0){
            parts.push(current.trim());
            current = '';
            continue;
        }
        current += ch;
    }
    if(current.trim().length > 0) parts.push(current.trim());
    return parts;
};

const expandStarChunk = function(chunk){
    if(!chunk.includes('*')) return [chunk];
    const factors = chunk.split('*').map((s) => s.trim()).filter(Boolean);
    const terms = [];
    const total = 1 << factors.length;
    for(let mask = 1; mask < total; mask++){
        const parts = [];
        for(let i = 0; i < factors.length; i++){
            if(mask & (1 << i)) parts.push(factors[i]);
        }
        terms.push(parts.join(':'));
    }
    return terms;
};

const parseFormula = function(formula){
    const sides = formula.split('~');
    if(sides.length !== 2) throw new Error('Formula must look like "response ~ predictors".');

    const response = sides[0].trim();
    const rhs = sides[1].trim();
    const chunks = splitTopLevel(rhs, '+');
    const predictors = [];

    for(let i = 0; i < chunks.length; i++){
        const expanded = expandStarChunk(chunks[i]);
        for(let j = 0; j < expanded.length; j++){
            if(expanded[j].length > 0) predictors.push(expanded[j]);
        }
    }

    return {
        response,
        predictors,
        formula,
    };
};

module.exports = {
    parseFormula,
    splitTopLevel,
    expandStarChunk,
};
