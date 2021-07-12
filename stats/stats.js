const Dataframes = require('../dataframe/dataframe.js');

const anscombe = require('../data/anscombe.js');
const sleep = require('../data/sleep.js');
const titanic = require('../data/titanic.js');
const airpassengers = require('../data/airpassengers.js');
const women = require('../data/women.js');

module.exports.stat = class Stats {

    // -> datasets
    static dataset = (name) => {
    
        if(name.toLowerCase() == "titanic") return(new Dataframes.df(titanic));
        if(name.toLowerCase() == "sleep") return(new Dataframes.df(sleep));
        if(name.toLowerCase() == "anscombe") return(new Dataframes.df(anscombe));
        if(name.toLowerCase() == "airpassengers") return(Dataframes.df.fromArrayList(airpassengers));
        if(name.toLowerCase() == "women") return( new Dataframes.df(women));
        throw(`Unknown dataset '${name}'`);
    }

    // -> returns the minimum and maximum of the array
    static min = (x) => {
        if(x.length == 0) return(Infinity);

        let minVal = Number(x[0]);

        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) < minVal) minVal = x;
        }

        return(minVal);
    }

    static max = (x) => {
        if(x.length == 0) return(Infinity);
        
        let maxVal = Number(x[0]);

        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) > maxVal) maxVal = x;
        }

        return(maxVal);
    }

    // -> gives the sum of an array
    static sum = (x) => {
        if(x.length == 0) return(Infinity);

        let arrSum = 0;
        for(let i = 0; i < x.length; i++){
            arrSum += Number(x[i]);
        }

        return(arrSum);
    }

    // -> gives the number of valid values (not NaN, not null, not undefined, not infinite)
    static countValid = (x) => {
        if(x.length == 0) return(0);

        let count = 0;
        for(let i = 0; i < x.length; i++){
            if(! isNaN(x[i]) && x[i] != null && x[i] != undefined && x[i] != Infinity) count += 1;
        }

        return(count);
    }

    // -> gives the mean of an array
    static mean = (x) => {
        return(this.sum(x) / this.countValid(x));
    }

    // -> rounds to the nearest decimal
    static round = (x, fig = 0) => {

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

            return(new Dataframes.df(roundedData));
        }

        throw("Unimplemented");
    }

    // -> gives the standard deviation and variance of an array
    static var = (x) => {

        if(x.length == 0) return(Infinity);
        let deviations = [];
        let mean = this.mean(x);

        for(let i = 0; i < x.length; i++){
            deviations.push((x[i] - mean) ** 2);
        }

        let variance = this.mean(deviations) * (this.countValid(x) / (this.countValid(x) - 1));

        return(variance);
    }

    static sd = (x) => {
        return(this.var(x) ** (0.5));
    }

}