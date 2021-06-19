class Dataframe {

    //-> creates a new Dataframe from a javascript object
    constructor(data = []){
        this.data = data;
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
    fromArrayList = (arrayList) => {
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

    //-> TODO create a new dataframe from an html table

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

    //-> TODO: sort a dataframe by column
    sort = (by = [], order = []) =>{
        return(Infinity);
    }

}