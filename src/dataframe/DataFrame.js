const dfConstruct = require('./constructor.js');
const plyr = require('./ops/apply.js');
const slicer = require('./ops/slicer.js');
const binder = require('./ops/binder.js');
const sorter = require('./ops/sort.js');

const fromArrayList = require('./inputs/fromArrayList.js');

const createKey = require('../utils/createKey.js');
const unique = require('../utils/unique.js');

class DataFrame {
    constructor(data = []){
        let inputData = dfConstruct(data);

        this.data = inputData.data;
        this.classes = inputData.classes;
        this.names = inputData.names;
        return true;
    }

    _hasColumn = (colName) => {
        let firstRow = this.data[0];
        if(Object.keys(firstRow).includes(colName)) return true;
        return false;
    }

    _createKey = (cols = []) => {
        let keyCol = createKey(this.data, cols);
        return(new DataFrame(keyCol));
    }

    toString = () => {
        return(JSON.stringify(this.data));
    }

    static fromArrayList = (arrayList) => {
        let newdf = fromArrayList(arrayList);
        return(new DataFrame(newdf));
    }

    print = () => {
        return this.data;
    }

    nrow = () => {
        return(this.data.length);
    }

    columns = () => {
        if(this.nrow() == 0) return([]);
        let firstRow = this.data[0];
        return(Object.keys(firstRow));
    }

    ncol = () => {
        if(this.nrow() == 0) return(0);
        return(this.columns().length);
    }

    colToArray = (colIndex) => {
        let colValues = slicer.colToArray(this.data, colIndex);
        return(colValues);
    }

    rowToObject = (rowIndex) => {
        let rowValues = slicer.rowToObject(this.data, rowIndex);
        return(rowValues);
    }

    rowToArray = (rowIndex) => {
        let rowValues = slicer.rowToArray(this.data, rowIndex);
        return(rowValues);
    }

    unique = (col) => {
        let uniqueVals = unique(this.data, col);
        return(uniqueVals);
    }

    select = (colIndices = []) => {
        let dataSubset = slicer.select(this.data, colIndices);
        return(new DataFrame(dataSubset));
    }

    drop = (colIndices = []) => {
        let dataSubset = slicer.drop(this.data, colIndices);
        return(new DataFrame(dataSubset));
    }

    head = (n = 5) => {
        let dataHead = slicer.head(this.data, n);
        return(new DataFrame(dataHead));
    }

    tail = (n = 5) => {
        let dataTail = slicer.tail(this.data, n);
        return(new DataFrame(dataTail));
    }

    cbind = (df) => {
        if(df.constructor !== DataFrame) throw("Not a dataframe");
        let bindedData = binder.cbind(this.data,df);
        return(new DataFrame(bindedData));
    }

    rbind = (df) => {
        if(df.constructor !== DataFrame) throw("Not a dataframe");
        let bindedData = binder.rbind(this.data, df);
        return(new DataFrame(bindedData));
    }

    apply = (FUN, axis=1, name="x") => {
        let applyData = plyr.apply(this.data, FUN, axis, name);
        return(new DataFrame(applyData));
    }

    colApply = (FUN, col, name = "x") => {
        if(this.nrow() == 0) return(new DataFrame([]));
        if(! this._hasColumn(col)) throw("Specified column name not in dataframe");

        let thisColumn = this.colToArray(col);
        let applyData = [];
        for(let i = 0; i < this.nrow(); i++){
            let applyDataRow = {};

            applyDataRow[name] = FUN(thisColumn[i]);
            applyData.push(applyDataRow);
        }

        return(new DataFrame(applyData));
    }

    colTransform = (FUN, col) => {
        if(this.nrow() == 0) return(new DataFrame([]));
        if(! this._hasColumn(col)) throw("Specified column name not in dataframe");

        let thisColumn = this.colToArray(col);
        let applyData = [];
        for(let i = 0; i < this.nrow(); i++){
            let applyDataRow = {};
            let originalDataRow = JSON.parse(JSON.stringify(this.data))[i];

            applyDataRow[col] = FUN(thisColumn[i]);
            applyData.push({...originalDataRow,...applyDataRow});
        };

        return(new DataFrame(applyData));
    }

    subset = (col, FUN) => {
        let subsetData = slicer.subset(this.data, col, FUN);
        return(new DataFrame(subsetData));
    }

    aggregate = (by = [], FUN) => {
        let aggregatedData = plyr.aggregate(this.data, by, FUN);
        return(new DataFrame(aggregatedData));
    }

    order = (by = [], desc = []) => {
        let sortedData = sorter.orderRows(this.data, by, desc);
        return(new DataFrame(sortedData));
    }
}

module.exports = DataFrame;
