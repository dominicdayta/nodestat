'use strict';

const compareValues = function(left, right){
    if(left === right) return 0;

    const leftMissing = left === null || left === undefined;
    const rightMissing = right === null || right === undefined;
    if(leftMissing && rightMissing) return 0;
    if(leftMissing) return 1;
    if(rightMissing) return -1;

    if(typeof left === 'number' && typeof right === 'number'){
        return left < right ? -1 : 1;
    }

    const leftString = String(left);
    const rightString = String(right);
    return leftString.localeCompare(rightString, undefined, {
        numeric: true,
        sensitivity: 'base',
    });
};

const desc = function(column){
    return {
        _nodestatOrder: 'desc',
        column: column,
    };
};

const asc = function(column){
    return {
        _nodestatOrder: 'asc',
        column: column,
    };
};

const isOrderSpec = function(value){
    return Boolean(
        value &&
        typeof value === 'object' &&
        value._nodestatOrder &&
        typeof value.column === 'string'
    );
};

const normalizeByAndDesc = function(by, descArg){
    const hasInlineSpecs = by.some((entry) => isOrderSpec(entry));

    if(!hasInlineSpecs){
        return {
            byColumns: by,
            desc: descArg,
        };
    }

    if(
        typeof descArg === 'boolean' ||
        (Array.isArray(descArg) && descArg.length > 0)
    ){
        throw("Do not mix inline order specs with DESC argument");
    }

    const byColumns = [];
    const desc = [];

    for(let i = 0; i < by.length; i++){
        const entry = by[i];
        if(isOrderSpec(entry)){
            byColumns.push(entry.column);
            desc.push(entry._nodestatOrder === 'desc');
            continue;
        }

        byColumns.push(entry);
        desc.push(false);
    }

    return {
        byColumns: byColumns,
        desc: desc,
    };
};

const normalizeDesc = function(desc, byLength){
    if(typeof desc === 'boolean'){
        return new Array(byLength).fill(desc);
    }

    if(!Array.isArray(desc) || desc.length === 0){
        return new Array(byLength).fill(false);
    }

    if(desc.length !== byLength){
        throw("Argument for BY not matching with DESC");
    }

    return desc.map((flag) => Boolean(flag));
};

const orderRows = function(data, by = [], desc = []){
    if(by.length === 0) throw("Must specify one or more columns in BY");
    if(data.length === 0) return [];

    const normalized = normalizeByAndDesc(by, desc);
    const byColumns = normalized.byColumns;
    const descArg = normalized.desc;

    const names = Object.keys(data[0]);
    for(let j = 0; j < byColumns.length; j++){
        if(!names.includes(byColumns[j])) throw(`Specified column name ${byColumns[j]} not in dataframe`);
    }

    const descFlags = normalizeDesc(descArg, byColumns.length);

    return data
        .map((row, index) => ({row, index}))
        .sort((a, b) => {
            for(let i = 0; i < byColumns.length; i++){
                const direction = descFlags[i] ? -1 : 1;
                const col = byColumns[i];
                const result = compareValues(a.row[col], b.row[col]);
                if(result !== 0) return result * direction;
            }

            return a.index - b.index;
        })
        .map((entry) => entry.row);
};

module.exports.orderRows = orderRows;
module.exports.desc = desc;
module.exports.asc = asc;
