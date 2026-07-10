const Dataframe = require('../dataframe/index.js');
const datasets = require('../datasets/index.js');
const tests = require('./tests/index.js');
const { lm } = require('./lm/index.js');

module.exports.stat = class Stats {
    static dataset = (name) => {
        if(name.toLowerCase() == "titanic") return(new Dataframe.df(datasets.titanic));
        if(name.toLowerCase() == "sleep") return(new Dataframe.df(datasets.sleep));
        if(name.toLowerCase() == "anscombe") return(new Dataframe.df(datasets.anscombe));
        if(name.toLowerCase() == "airpassengers") return(Dataframe.df.fromArrayList(datasets.airpassengers));
        if(name.toLowerCase() == "women") return(new Dataframe.df(datasets.women));
        throw(`Unknown dataset '${name}'`);
    }

    static min = (x) => {
        if(x.length == 0) return(Infinity);

        let minVal = Number(x[0]);
        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) < minVal) minVal = x[i];
        }
        return(minVal);
    }

    static max = (x) => {
        if(x.length == 0) return(Infinity);

        let maxVal = Number(x[0]);
        for(let i = 1; i < x.length; i++){
            if(Number(x[i]) > maxVal) maxVal = x[i];
        }
        return(maxVal);
    }

    static sum = (x) => {
        if(x.length == 0) return(Infinity);

        let arrSum = 0;
        for(let i = 0; i < x.length; i++){
            arrSum += Number(x[i]);
        }

        return(arrSum);
    }

    static countValid = (x) => {
        if(x.length == 0) return(0);

        let count = 0;
        for(let i = 0; i < x.length; i++){
            if(! isNaN(x[i]) && x[i] != null && x[i] != undefined && x[i] != Infinity) count += 1;
        }

        return(count);
    }

    static mean = (x) => {
        return(this.sum(x) / this.countValid(x));
    }

    static round = (x, fig = 0) => {
        if(x.constructor === Number){
            return(Number(x.toFixed(fig)));
        }

        if(x.constructor === Array){
            let arrayVal = [];
            for(let i = 0; i < x.length; i++){
                arrayVal.push(Number(x[i].toFixed(fig)));
            }

            return(arrayVal);
        }

        if(x.constructor === Dataframe.df){
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

            return(new Dataframe.df(roundedData));
        }

        throw("Unimplemented");
    }

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

module.exports.stat.tests = tests;
module.exports.stat.lm = lm;
module.exports.lm = lm;
