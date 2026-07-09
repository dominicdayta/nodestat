'use strict';

const METHODS = {
    bonferroni: 'bonferroni',
    holm: 'holm',
    hochberg: 'hochberg',
    by: 'BY',
};

const normalizeMethod = function(method){
    const key = String(method || 'holm').toLowerCase();
    if(key === 'bonferroni-hochberg' || key === 'hochberg') return METHODS.hochberg;
    if(key === 'bonferroni-yekutieli' || key === 'yekutieli' || key === 'by') return METHODS.by;
    if(key === 'bonferroni') return METHODS.bonferroni;
    if(key === 'holm' || key === 'bonferroni-holm') return METHODS.holm;
    throw new Error(`Unknown p.adjust method: ${method}`);
};

const bonferroni = function(p, m){
    return p.map((pi) => Math.min(pi * m, 1));
};

const holm = function(p){
    const m = p.length;
    const order = p.map((pi, i) => ({ pi, i })).sort((a, b) => a.pi - b.pi);
    const adjusted = new Array(m);
    let prev = 0;
    for(let rank = 0; rank < m; rank++){
        const factor = m - rank;
        const val = Math.min(1, order[rank].pi * factor);
        prev = Math.max(prev, val);
        adjusted[order[rank].i] = prev;
    }
    return adjusted;
};

const hochberg = function(p){
    const m = p.length;
    const order = p.map((pi, i) => ({ pi, i })).sort((a, b) => a.pi - b.pi);
    const adjusted = new Array(m);
    let prev = 1;
    for(let rank = m - 1; rank >= 0; rank--){
        const factor = m - rank;
        const val = Math.min(1, order[rank].pi * factor);
        prev = Math.min(prev, val);
        adjusted[order[rank].i] = prev;
    }
    return adjusted;
};

const byAdjust = function(p){
    const m = p.length;
    let cm = 0;
    for(let i = 1; i <= m; i++) cm += 1 / i;
    const order = p.map((pi, i) => ({ pi, i })).sort((a, b) => a.pi - b.pi);
    const adjusted = new Array(m);
    let prev = 0;
    for(let rank = 0; rank < m; rank++){
        const factor = (m / (rank + 1)) * cm;
        const val = Math.min(1, order[rank].pi * factor);
        prev = Math.max(prev, val);
        adjusted[order[rank].i] = prev;
    }
    return adjusted;
};

const pAdjust = function(p, method = 'holm'){
    if(!Array.isArray(p) || p.length === 0) return [];
    const normalized = normalizeMethod(method);
    const cleaned = p.map((pi) => {
        const v = Number(pi);
        if(!Number.isFinite(v) || v < 0 || v > 1) throw new Error('p-values must be numbers in [0, 1].');
        return v;
    });

    if(normalized === METHODS.bonferroni) return bonferroni(cleaned, cleaned.length);
    if(normalized === METHODS.holm) return holm(cleaned);
    if(normalized === METHODS.hochberg) return hochberg(cleaned);
    if(normalized === METHODS.by) return byAdjust(cleaned);
    throw new Error(`Unsupported method: ${method}`);
};

module.exports = pAdjust;
