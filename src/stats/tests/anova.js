'use strict';

const {
    toNumericArray,
    mean,
    fCdf,
    parseFormula,
    ptukey,
} = require('./helpers.js');

const partitionByGroup = function(response, group){
    const groups = {};
    const names = [];
    for(let i = 0; i < response.length; i++){
        const g = String(group[i]);
        if(!groups[g]){
            groups[g] = [];
            names.push(g);
        }
        groups[g].push(response[i]);
    }
    return { groups, names };
};

const aov = function(spec, data){
    let response;
    let group;
    let responseName;
    let groupName;

    if(typeof spec === 'string'){
        const parsed = parseFormula(spec, data);
        response = parsed.response;
        group = parsed.group;
        responseName = parsed.responseName;
        groupName = parsed.groupName;
    } else if(spec && spec.response && spec.group && spec.data){
        response = toNumericArray(spec.data.colToArray(spec.response));
        group = spec.data.colToArray(spec.group);
        responseName = spec.response;
        groupName = spec.group;
    } else if(spec && Array.isArray(spec.response) && Array.isArray(spec.group)){
        response = toNumericArray(spec.response);
        group = spec.group;
        responseName = spec.responseName || 'response';
        groupName = spec.groupName || 'group';
    } else {
        throw new Error('aov expects a formula string + dataframe, or an object with response/group/data.');
    }

    const { groups, names } = partitionByGroup(response, group);
    const k = names.length;
    if(k < 2) throw new Error('aov requires at least two groups.');

    const n = response.length;
    const grandMean = mean(response);
    let ssTotal = 0;
    for(let i = 0; i < n; i++) ssTotal += (response[i] - grandMean) ** 2;

    let ssBetween = 0;
    const groupMeans = {};
    const groupSizes = {};
    for(let i = 0; i < k; i++){
        const g = names[i];
        const vals = groups[g];
        groupSizes[g] = vals.length;
        groupMeans[g] = mean(vals);
        ssBetween += vals.length * (groupMeans[g] - grandMean) ** 2;
    }

    const ssWithin = ssTotal - ssBetween;
    const dfBetween = k - 1;
    const dfWithin = n - k;
    const msBetween = ssBetween / dfBetween;
    const msWithin = ssWithin / dfWithin;
    const f = msBetween / msWithin;
    const p = 1 - fCdf(f, dfBetween, dfWithin);

    return {
        terms: [groupName],
        response: responseName,
        group: groupName,
        statistic: f,
        parameter: { df_between: dfBetween, df_within: dfWithin },
        p_value: p,
        method: 'One-way ANOVA',
        sums_of_squares: {
            between: ssBetween,
            within: ssWithin,
            total: ssTotal,
        },
        means_squares: {
            between: msBetween,
            within: msWithin,
        },
        group_means: groupMeans,
        group_sizes: groupSizes,
        group_names: names,
        mse: msWithin,
        df_residual: dfWithin,
        data: { response, group, names, groups },
    };
};

const tukeyHSD = function(aovResult){
    if(!aovResult || !aovResult.group_names) throw new Error('tukeyHSD expects the result of aov().');

    const names = aovResult.group_names;
    const k = names.length;
    const df = aovResult.df_residual;
    const mse = aovResult.mse;
    const comparisons = [];

    for(let i = 0; i < k; i++){
        for(let j = i + 1; j < k; j++){
            const g1 = names[i];
            const g2 = names[j];
            const n1 = aovResult.group_sizes[g1];
            const n2 = aovResult.group_sizes[g2];
            const diff = aovResult.group_means[g1] - aovResult.group_means[g2];
            const se = Math.sqrt(mse * (1 / n1 + 1 / n2));
            const q = Math.abs(diff) / se;
            const p = 1 - ptukey(q, k, df);

            comparisons.push({
                comparison: `${g1}-${g2}`,
                diff,
                lwr: diff - se * q,
                upr: diff + se * q,
                p_adj: p,
            });
        }
    }

    return {
        term: aovResult.group,
        mse,
        df,
        comparisons,
    };
};

module.exports = {
    aov,
    tukeyHSD,
};
