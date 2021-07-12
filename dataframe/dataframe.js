const dfConstruct = require('./constructor.js');
const plyr = require('./apply.js');
const slicer = require('./slicer.js');
const binder = require('./binder.js');

const fromArrayList = require('./inputs/fromarraylist.js');

const createKey = require('../utils/createkey.js');
const unique = require('../utils/unique.js');

module.exports.df = class Dataframe {

    //-> creates a new Dataframe from a javascript object
    constructor(data = []){
        let inputData = dfConstruct(data);

        this.data = inputData.data;
        this.classes = inputData.classes;
        this.names = inputData.names;
        return true;
    }

    //-> internal method: checks if a column is in the data
    _hasColumn = (colName) => {
        let firstRow = this.data[0];
        if(Object.keys(firstRow).includes(colName)) return true;
        return false;
    }

    //-> internal method: create a key from a given set of columns
    _createKey = (cols = []) => {
        let keyCol = createKey(this.data, cols);
        return(new Dataframe(keyCol));
    }

    //->repeat an element n times
    _repeat(str,times){
        let repeated = [];
        for(let i = 0; i < times; i++){
            repeated.push(str);
        }

        return(repeated);
    }

    //-> internal method: sorts a dataframe
    _stableSort = (arr, compare) => arr
        .map((item, index) => ({item, index}))
        .sort((a, b) => compare(a.item, b.item) || a.index - b.index)
        .map(({item}) => item)
        
    _sortObject = (sortedData,sortCol,sortDesc) => {
        let sorted = this._stableSort(sortedData, (a, b) => a[sortCol] - b[sortCol]);
        if(sortDesc == true) sorted = this._stableSort(sortedData, (a, b) => b[sortCol] - a[sortCol]);
        return(sorted);
    }

    //-> returns the data as a JSON string
    toString = () => {
        return(JSON.stringify(this.data));
    }

    //-> create a new dataframe from an object of arrays
    static fromArrayList = (arrayList) => {
        let newdf = fromArrayList(arrayList);
        return(new Dataframe(newdf));
    }

    //-> show data
    print = () => {
        return this.data;
    }

    //-> returns the length of the data object
    nrow = () => {
        return(this.data.length);
    }

    //-> returns an array of the column names in the data object
    columns = () => {
        if(this.nrow() == 0) return([]);
        let firstRow = this.data[0];
        return(Object.keys(firstRow));
    }

    //-> returns the number of columns in the data object
    ncol = () => {
        if(this.nrow() == 0) return(0);
        return(this.columns().length);
    }

    //-> returns a specified column as an array
    colToArray = (colIndex) => {
        let colValues = slicer.colToArray(this.data, colIndex);
        return(colValues);
    }

    //-> returns a specified row as an object
    rowToObject = (rowIndex) => {
        let rowValues = slicer.rowToObject(this.data, rowIndex);
        return(rowValues);
    }

    //-> returns a specified row as an array, not recommended
    rowToArray = (rowIndex) => {
        let rowValues = slicer.rowToArray(this.data, rowIndex);
        return(rowValues);
    }

    //-> return unique values of a column
    unique = (col) => {
        let uniqueVals = unique(this.data, col);
        return(uniqueVals);
    }

    //-> gives a specific subset of the dataframe based on the named columns
    select = (colIndices = []) => {
        let dataSubset = slicer.select(this.data, colIndices);
        return(new Dataframe(dataSubset));
    }

    //-> similar to select, but drops one or more columns from the data
    drop = (colIndices = []) => {
        let dataSubset = slicer.drop(this.data, colIndices);
        return(new Dataframe(dataSubset));
    }

    //-> gives the first n rows of a dataframe, as a dataframe
    head = (n = 5) => {
        let dataHead = slicer.head(this.data, n);
        return(new Dataframe(dataHead));
    }

    //-> gives the last n rows of a dataframe, as a dataframe
    tail = (n = 5) => {
        let dataTail = slicer.tail(this.data, n);
        return(new Dataframe(dataTail));
    }

    //-> bind two dataframes together (by column or row)
    cbind = (df) => {
        if(df.constructor !== Dataframe) throw("Not a dataframe");
        let bindedData = binder.cbind(this.data,df);
        return(new Dataframe(bindedData));
    }

    rbind = (df) => {
        if(df.constructor !== Dataframe) throw("Not a dataframe");
        let bindedData = binder.rbind(this.data, df);
        return(new Dataframe(bindedData));        
    }

    //-> apply a function to the data, axis 1 is by column, axis 2 by row
    apply = (FUN, axis=1, name="x") => {
        let applyData = plyr.apply(this.data, FUN, axis, name);
        return(new Dataframe(applyData));
    }

    //-> apply a function along a specific column
    colApply = (FUN, col, name = "x") => {
        if(this.nrow() == 0) return(new Dataframe([]));
        if(! this._hasColumn(col)) throw("Specified column name not in dataframe");

        let thisColumn = this.colToArray(col);
        let applyData = [];
        for(let i = 0; i < this.nrow(); i++){
            let applyDataRow = {};

            applyDataRow[name] = FUN(thisColumn[i]);
            applyData.push(applyDataRow);
        }

        return(new Dataframe(applyData));
    }

    //-> apply a function along a specific column. Similar to colApply, but returns the data with the column replaced
    colTransform = (FUN, col) => {
        if(this.nrow() == 0) return(new Dataframe([]));
        if(! this._hasColumn(col)) throw("Specified column name not in dataframe");

        let thisColumn = this.colToArray(col);
        let applyData = [];
        for(let i = 0; i < this.nrow(); i++){
            let applyDataRow = {};
            let originalDataRow = JSON.parse(JSON.stringify(this.data))[i];

            applyDataRow[col] = FUN(thisColumn[i]);
            applyData.push({...originalDataRow,...applyDataRow});
        };

        return(new Dataframe(applyData));
    }

    //-> subset a data based on a true/false function
    subset = (col, FUN) => {
        let subsetData = slicer.subset(this.data, col, FUN);
        return(new Dataframe(subsetData));
    }

    //-> aggregates the columns by one or more columns, and a function
    aggregate = (by = [], FUN) => {
        let aggregatedData = plyr.aggregate(this.data, by, FUN);
        return(new Dataframe(aggregatedData));
    }

    //-> TODO: sort a dataframe by one or more columns
    // if DESC is not given, assume false for all
    // if DESC is given, must be of same length as BY
    order = (by = [], desc = []) => {
        let sortedData = JSON.parse(JSON.stringify(this.data));
        if(desc.length == 0) desc = this._repeat(false, by.length);
        if(desc.length != by.length) throw("Argument for BY not matching with DESC");
        console.log(desc);

        for(let j = 0; j < by.length; j++){
            let sortCol = by[j];
            let sortDesc = desc[j];

            sortedData = this._sortObject(sortedData,sortCol,sortDesc);
        }

        return(new Dataframe(sortedData));
    }

}