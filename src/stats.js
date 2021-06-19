class Stats {

    // -> returns the minimum and maximum of the array
    min = (x) => {
        if(x.length == 0) return(Infinity);

        let minVal = Number(x[0]);

        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) < minVal) minVal = x;
        }

        return(minVal);
    }

    max = (x) => {
        if(x.length == 0) return(Infinity);
        
        let maxVal = Number(x[0]);

        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) > maxVal) maxVal = x;
        }

        return(maxVal);
    }

    // -> gives the sum of an array
    sum = (x) => {
        if(x.length == 0) return(Infinity);

        let arrSum = 0;
        for(let i = 0; i < x.length; i++){
            arrSum += Number(x[i]);
        }

        return(arrSum);
    }

    // -> gives the number of valid values (not NaN, not null, not undefined, not infinite)
    countValid = (x) => {
        if(x.length == 0) return(0);

        let count = 0;
        for(let i = 0; i < x.length; i++){
            if(! isNaN(x[i]) && x[i] != null && x[i] != undefined && x[i] != Infinity) count += 1;
        }

        return(count);
    }

    // -> gives the mean of an array
    mean = (x) => {
        return(this.sum(x) / this.countValid(x));
    }

    // -> rounds to the nearest decimal
    round = (x, fig = 0) => {

        if(x.constructor === Number){
            return(Number(x.toFixed(fig)));
        }

        if(x.constructor === Array){
            let arrayVal = [];
            for(let i = 0; i < x.length; i++){
                arrayVal.push(Number(x.toFixed(fig)));
            }

            return(arrayVal);
        }

        if(x.constructor === Dataframe){
            let roundedData = [];
            for(let i = 0; i < x.nrow(); i++){
                let thisRoundedRow = {};
                let thisDataRow = x.data[i];
                for(let j = 0; j < x.ncol(); j++){
                    thisRoundedRow[x.columns()[j]] = thisDataRow[x.columns()[j]];
                    if(thisDataRow[x.columns()[j]].constructor === Number){
                        let currentNum = Number(thisDataRow[x.columns()[j]]);
                        thisRoundedRow[x.columns()[j]] = Number(currentNum.toFixed(fig));

                    }

                }

                roundedData.push(thisRoundedRow);
            }

            return(new Dataframe(roundedData));
        }

        throw("Unimplemented");
    }

    // -> gives the standard deviation and variance of an array
    var = (x) => {

        if(x.length == 0) return(Infinity);
        let deviations = [];
        let mean = this.mean(x);

        for(let i = 0; i < x.length; i++){
            deviations.push((x[i] - mean) ** 2);
        }

        let variance = this.mean(deviations) * (this.countValid(x) / (this.countValid(x) - 1));

        return(variance);
    }

    sd = (x) => {
        return(this.var(x) ** (0.5));
    }

}