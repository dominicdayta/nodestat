class Dataframe {

    //-> creates a new Dataframe from a javascript object
    constructor(data = []){
        let newData = [];
        let classes = [];
        let firstRow = null;
        let names = null;

        if(data.length == 0){
            this.data = newData;
            this.classes = classes;
            return true;
        }

        firstRow = data[0];
        names = Object.keys(firstRow);
        for(let j = 0; j < names.length; j ++){
            let testClass = null;
            let testVal = firstRow[names[j]];
            if(testVal.constructor == Number) testClass = "numeric";
            if(testVal.constructor == String) testClass = "character";
            if(isNaN(Number(testVal))) testClass = "character";
            if(testClass == null) throw("Unknown data type in dataframe");
            
            classes.push(testClass);
        }

        for(let i = 0; i < data.length; i++){
            let thisDataRow = {};
            let thisInputRow = data[i];

            for(let j = 0; j < names.length; j++){
                let thisVal = thisInputRow[names[j]];
                let thisClass = classes[j];

                thisDataRow[names[j]] = String(thisVal);
                if(thisClass == "numeric") thisDataRow[names[j]] = Number(thisVal);
            }

            newData.push(thisDataRow);
        }
        
        this.data = newData;
        this.classes = classes;
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
        let keyCol = [];
        for(let i = 0; i < this.nrow(); i++){
            let thisDataRow = this.data[i];
            let thisRowKey = "";
            for(let j = 0; j < cols.length - 1; j++){
                thisRowKey += String(thisDataRow[cols[j]]) + "-";
            }

            thisRowKey += String(thisDataRow[cols[cols.length - 1]]);
            keyCol.push({_key: thisRowKey});
        }
        return(new Dataframe(keyCol));
    }

    //-> returns the data as a JSON string
    toString = () => {
        return(JSON.stringify(this.data));
    }

    //-> create a new dataframe from an object of arrays
    static fromArrayList = (arrayList) => {
        let arrayNames = Object.keys(arrayList);
        let lengthOfFirstArray = arrayList[arrayNames[0]].length;
        let jsonFormat = [];

        for(let i = 0; i < arrayList[arrayNames[0]].length; i++){
            let jsonFormatRow = {};

            for(let j = 0; j < arrayNames.length; j++){
                let thisColumn = arrayList[arrayNames[j]];
                if(thisColumn.length != lengthOfFirstArray) throw("One or more arrays not compatible in length");

                jsonFormatRow[arrayNames[j]] = thisColumn[i];
            }

            jsonFormat.push(jsonFormatRow);
        }

        return(new Dataframe(jsonFormat));
    }

    //-> create a new dataframe from an html table
    static fromHTMLTable = (id = null, parentID = null, index = 0) => {
        let tableElement = null;
        let tableHeader = null;
        let tableRows = null;
        let tableHeaderContents = null;

        let jsonFormat = [];
        let columns = [];

        if(id != null)  tableElement = document.getElementById(id);
        if(parentID != null){
            let parentElement = document.getElementById(id);
            let tables = parentElement.getElementsByTagName("table");
            if(tables.length == 0) throw("No table found in specified container");
            if(tables.length > 0){
                if(index == 0) console.warn("More than one table element found in container. Use index to specify which element should be used");
                if(index > tables.length) throw("Subscript out of bounds");
            }
            
            tableElement = tables[index];
        }

        if(tableElement == null) throw("Unable to find specified element");

        // get header
        tableHeader = tableElement.getElementsByTagName("thead");
        tableRows = tableElement.getElementsByTagName("tr");

        if(tableHeader == null){
            tableHeader = tableRows[0];
            console.warn("No <thead> found in table. The first row will be used as a header instead");
        }

        tableHeader = tableHeader[0].getElementsByTagName("tr")[0];
        tableHeaderContents = tableHeader.getElementsByTagName("*");
        for(let j = 0; j < tableHeaderContents.length; j++){
            columns.push(String(tableHeaderContents[j].innerHTML));
        }

        for(let i = 1; i < tableRows.length; i++){
            let thisDataRow = {};
            let thisTableRow = tableRows[i].getElementsByTagName("*");
            for(let j = 0; j < columns.length; j++){
                let thisVal = thisTableRow[j].innerHTML;
                
                thisDataRow[columns[j]] = Number(thisVal);
                if(isNaN(Number(thisVal))) thisDataRow[columns[j]] = String(thisVal);
            }

            jsonFormat.push(thisDataRow);
        }

        return(new Dataframe(jsonFormat));
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
        let firstRow = this.data[0];
        return(this.columns().length);
    }

    //-> returns a specified column as an array
    colToArray = (colIndex) => {
        if(! this._hasColumn(colIndex)) throw("Specified column not in data");
        if(this.nrow() == 0) return([]);
        let colValues = [];
        
        for(let i = 0; i < this.nrow(); i ++){
            colValues.push(this.data[i][colIndex]);
        }

        return(colValues);
    }

    //-> returns a specified row as an object
    rowToObject = (rowIndex) => {
        rowIndex = Number(rowIndex);
        if(isNaN(rowIndex)) throw("Invalid row index given");
        if(rowIndex >= this.nrow()) throw("Index out of bounds");
        return(this.data[rowIndex]);
    }

    //-> returns a specified row as an array, not recommended
    rowToArray = (rowIndex) => {
        rowIndex = Number(rowIndex);
        if(isNaN(rowIndex)) throw("Invalid row index given");
        if(rowIndex >= this.nrow()) throw("Index out of bounds");

        let thisRow = [];
        let thisDataRow = this.data[rowIndex];
        
        for(let j = 0; j < this.ncol(); j++){
            thisRow.push(thisDataRow[this.columns()[j]]);
        }

        return(thisRow);
    }

    //-> return unique values of a column
    unique = (col) => {
        if(! this._hasColumn(col)) throw("Specified column not in dataframe");
        let uniqueVals = [];
        let thisColumn = this.colToArray(col);

        for(let i = 0; i < this.nrow(); i++){
            let thisValue = thisColumn[i];
            if(! uniqueVals.includes(thisValue)) uniqueVals.push(thisValue);
        }
        
        return(uniqueVals);
    }

    //-> gives a specific subset of the dataframe based on the named columns
    select = (colIndices = []) => {
        if(colIndices.length == 0) throw("Must specify one or more columns to select");
        
        for(let j = 0; j < colIndices.length; j++){
            if(! this._hasColumn(colIndices[j])) throw("One or more column names specified not in data");
        }

        let dataSubset = [];
        for(let i = 0; i < this.nrow(); i++){
            let currentRow = this.data[i];
            let currentSubsetRow = {};
            
            for(let j = 0; j < colIndices.length; j++){
                currentSubsetRow[colIndices[j]] = currentRow[colIndices[j]];
            }

            dataSubset.push(currentSubsetRow);
        }

        return(new Dataframe(dataSubset));
    }

    //-> similar to select, but drops one or more columns from the data
    drop = (colIndices = []) => {
        if(colIndices.length == 0) throw("Must specify one or more columns to drop");

        for(let j = 0; j < colIndices.length; j++){
            if(! this._hasColumn(colIndices[j])) throw("One or more column names specified not in data");
        }

        let dataSubset = [];
        for(let i = 0; i < this.nrow(); i++){
            let currentRow = this.data[i];
            let currentSubsetRow = {};
            
            for(let j = 0; j < this.ncol(); j++){
                if(! colIndices.includes(this.columns()[j])) currentSubsetRow[this.columns()[j]] = currentRow[this.columns()[j]];
            }

            dataSubset.push(currentSubsetRow);
        }

        return(new Dataframe(dataSubset));
    }

    //-> gives the first n rows of a dataframe, as a dataframe
    head = (n = 5) => {
        if(this.nrow() == 0) return(new Dataframe([]));
        let dataHead = [];
        for(let i = 0; i < Math.min(this.nrow(), n); i ++){
            dataHead.push(this.data[i]);
        }

        return(new Dataframe(dataHead));
    }

    //-> gives the last n rows of a dataframe, as a dataframe
    tail = (n = 5) => {
        if(this.nrow() == 0) return(new Dataframe([]));
        let dataHead = [];
        for(let i = 1; i <= Math.min(this.nrow(), n); i ++){
            dataHead.push(this.data[this.nrow() - i]);
        }

        return(new Dataframe(dataHead));
    }

    //-> bind two dataframes together (by column or row)
    cbind = (df) => {
        if(df.constructor !== Dataframe) throw("Not a dataframe");
        if(this.nrow() != df.nrow()) throw("Rows do not match");
        
        let bindedData = [];

        for(let i = 0; i < this.nrow(); i++){
            let leftRow = this.data[i];
            let rightRow = df.data[i];
            let mergedRow = {...leftRow, ...rightRow};
            
            bindedData.push(mergedRow);
        }

        return(new Dataframe(bindedData));
    }

    rbind = (df) => {
        if(df.constructor !== Dataframe) throw("Not a dataframe");
        return(new Dataframe(this.data.concat(df.data)));        
    }

    //-> apply a function to the data, axis 1 is by column, axis 2 by row
    apply = (FUN, axis=1, name="x") => {
        if(this.nrow() == 0) return(new Dataframe([]));
        if(! [1,2].includes(axis)) throw("Invalid axis value");
        let applyData = [];

        if(axis == 1){
            let applyDataRow = {};

            for(let j = 0; j < this.ncol(); j ++){
                applyDataRow[this.columns()[j]] = FUN(this.colToArray(this.columns()[j]));
            }

            applyData.push(applyDataRow);

        }else{
            for(let i = 0; i < this.nrow(); i++){
                let applyDataRow = {};
                applyDataRow[name] = FUN(this.rowToArray(i));
                applyData.push(applyDataRow);
            }

        }

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

    //-> apply a function along a specific column. Similar to colApply, but replaces the column
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
        if(this.nrow() == 0) return(new Dataframe([]));
        if(! this._hasColumn(col)) throw("Specified column name not in dataframe");
        let subsetData = [];
        let currentCol = this.colToArray(col);
        for(let i = 0; i < this.nrow(); i++){
            if(FUN(currentCol[i])) subsetData.push(this.data[i]);
        }

        return(new Dataframe(subsetData));
    }

    //-> aggregates the columns by one or more columns, and a function
    aggregate = (by = [], FUN) => {
        if(this.nrow() == 0) return(new Dataframe([]));
        if(by.length == 0) throw("Need to identify one or more columns in BY");

        for(let j = 0; j < by.length; j++){
            if(! this._hasColumn(by[j])) throw("One or more columns in BY not found in data");
        }

        let dataWithKey = this.cbind(this._createKey(by));
        let keys = dataWithKey.unique("_key");
        let aggregatedData = [];

        for(let k = 0; k < keys.length; k++){
            let dataForCurrentKey = dataWithKey.subset("_key",(x)=>{return(x == keys[k])});
            let resultObject = dataForCurrentKey.drop(["_key"].concat(by)).apply(FUN, 1).data[0];

            let resultAxis = {};
            for(let j = 0; j < by.length; j++){
                resultAxis[by[j]] = dataForCurrentKey.data[0][by[j]];
            }

            let mergedResult = {...resultAxis, ...resultObject}
            aggregatedData.push(mergedResult);
        }
        
        return(new Dataframe(aggregatedData));
    }

    //-> TODO: sort a dataframe by one or more columns
    // if DESC is not given, assume false for all
    // if DESC is given, must be of same length as BY
    sort = (by = [], desc = []) =>{
        return(Infinity);
    }

}