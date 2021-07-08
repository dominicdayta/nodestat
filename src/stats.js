const Dataframes = require('./dataframes.js');

module.exports.stat = class Stats {

    // -> datasets
    static dataset = (name) => {
        let Titanic = [{"Class":"1st","Sex":"Male","Age":"Child","Survived":"No","Freq":0},{"Class":"2nd","Sex":"Male","Age":"Child","Survived":"No","Freq":0},{"Class":"3rd","Sex":"Male","Age":"Child","Survived":"No","Freq":35},{"Class":"Crew","Sex":"Male","Age":"Child","Survived":"No","Freq":0},{"Class":"1st","Sex":"Female","Age":"Child","Survived":"No","Freq":0},{"Class":"2nd","Sex":"Female","Age":"Child","Survived":"No","Freq":0},{"Class":"3rd","Sex":"Female","Age":"Child","Survived":"No","Freq":17},{"Class":"Crew","Sex":"Female","Age":"Child","Survived":"No","Freq":0},{"Class":"1st","Sex":"Male","Age":"Adult","Survived":"No","Freq":118},{"Class":"2nd","Sex":"Male","Age":"Adult","Survived":"No","Freq":154},{"Class":"3rd","Sex":"Male","Age":"Adult","Survived":"No","Freq":387},{"Class":"Crew","Sex":"Male","Age":"Adult","Survived":"No","Freq":670},{"Class":"1st","Sex":"Female","Age":"Adult","Survived":"No","Freq":4},{"Class":"2nd","Sex":"Female","Age":"Adult","Survived":"No","Freq":13},{"Class":"3rd","Sex":"Female","Age":"Adult","Survived":"No","Freq":89},{"Class":"Crew","Sex":"Female","Age":"Adult","Survived":"No","Freq":3},{"Class":"1st","Sex":"Male","Age":"Child","Survived":"Yes","Freq":5},{"Class":"2nd","Sex":"Male","Age":"Child","Survived":"Yes","Freq":11},{"Class":"3rd","Sex":"Male","Age":"Child","Survived":"Yes","Freq":13},{"Class":"Crew","Sex":"Male","Age":"Child","Survived":"Yes","Freq":0},{"Class":"1st","Sex":"Female","Age":"Child","Survived":"Yes","Freq":1},{"Class":"2nd","Sex":"Female","Age":"Child","Survived":"Yes","Freq":13},{"Class":"3rd","Sex":"Female","Age":"Child","Survived":"Yes","Freq":14},{"Class":"Crew","Sex":"Female","Age":"Child","Survived":"Yes","Freq":0},{"Class":"1st","Sex":"Male","Age":"Adult","Survived":"Yes","Freq":57},{"Class":"2nd","Sex":"Male","Age":"Adult","Survived":"Yes","Freq":14},{"Class":"3rd","Sex":"Male","Age":"Adult","Survived":"Yes","Freq":75},{"Class":"Crew","Sex":"Male","Age":"Adult","Survived":"Yes","Freq":192},{"Class":"1st","Sex":"Female","Age":"Adult","Survived":"Yes","Freq":140},{"Class":"2nd","Sex":"Female","Age":"Adult","Survived":"Yes","Freq":80},{"Class":"3rd","Sex":"Female","Age":"Adult","Survived":"Yes","Freq":76},{"Class":"Crew","Sex":"Female","Age":"Adult","Survived":"Yes","Freq":20}];
        let sleep = [{"extra":0.7,"group":"1","ID":"1"},{"extra":-1.6,"group":"1","ID":"2"},{"extra":-0.2,"group":"1","ID":"3"},{"extra":-1.2,"group":"1","ID":"4"},{"extra":-0.1,"group":"1","ID":"5"},{"extra":3.4,"group":"1","ID":"6"},{"extra":3.7,"group":"1","ID":"7"},{"extra":0.8,"group":"1","ID":"8"},{"extra":0,"group":"1","ID":"9"},{"extra":2,"group":"1","ID":"10"},{"extra":1.9,"group":"2","ID":"1"},{"extra":0.8,"group":"2","ID":"2"},{"extra":1.1,"group":"2","ID":"3"},{"extra":0.1,"group":"2","ID":"4"},{"extra":-0.1,"group":"2","ID":"5"},{"extra":4.4,"group":"2","ID":"6"},{"extra":5.5,"group":"2","ID":"7"},{"extra":1.6,"group":"2","ID":"8"},{"extra":4.6,"group":"2","ID":"9"},{"extra":3.4,"group":"2","ID":"10"}];
        let anscombe = [{"x1":10,"x2":10,"x3":10,"x4":8,"y1":8.04,"y2":9.14,"y3":7.46,"y4":6.58},{"x1":8,"x2":8,"x3":8,"x4":8,"y1":6.95,"y2":8.14,"y3":6.77,"y4":5.76},{"x1":13,"x2":13,"x3":13,"x4":8,"y1":7.58,"y2":8.74,"y3":12.74,"y4":7.71},{"x1":9,"x2":9,"x3":9,"x4":8,"y1":8.81,"y2":8.77,"y3":7.11,"y4":8.84},{"x1":11,"x2":11,"x3":11,"x4":8,"y1":8.33,"y2":9.26,"y3":7.81,"y4":8.47},{"x1":14,"x2":14,"x3":14,"x4":8,"y1":9.96,"y2":8.1,"y3":8.84,"y4":7.04},{"x1":6,"x2":6,"x3":6,"x4":8,"y1":7.24,"y2":6.13,"y3":6.08,"y4":5.25},{"x1":4,"x2":4,"x3":4,"x4":19,"y1":4.26,"y2":3.1,"y3":5.39,"y4":12.5},{"x1":12,"x2":12,"x3":12,"x4":8,"y1":10.84,"y2":9.13,"y3":8.15,"y4":5.56},{"x1":7,"x2":7,"x3":7,"x4":8,"y1":4.82,"y2":7.26,"y3":6.42,"y4":7.91},{"x1":5,"x2":5,"x3":5,"x4":8,"y1":5.68,"y2":4.74,"y3":5.73,"y4":6.89}];
        let AirPassengers = {"passengers": [112,118,132,129,121,135,148,148,136,119,104,118,115,126,141,135,125,149,170,170,158,133,114,140,145,150,178,163,172,178,199,199,184,162,146,166,171,180,193,181,183,218,230,242,209,191,172,194,196,196,236,235,229,243,264,272,237,211,180,201,204,188,235,227,234,264,302,293,259,229,203,229,242,233,267,269,270,315,364,347,312,274,237,278,284,277,317,313,318,374,413,405,355,306,271,306,315,301,356,348,355,422,465,467,404,347,305,336,340,318,362,348,363,435,491,505,404,359,310,337,360,342,406,396,420,472,548,559,463,407,362,405,417,391,419,461,472,535,622,606,508,461,390,432]};
        let women = [{"height":58,"weight":115},{"height":59,"weight":117},{"height":60,"weight":120},{"height":61,"weight":123},{"height":62,"weight":126},{"height":63,"weight":129},{"height":64,"weight":132},{"height":65,"weight":135},{"height":66,"weight":139},{"height":67,"weight":142},{"height":68,"weight":146},{"height":69,"weight":150},{"height":70,"weight":154},{"height":71,"weight":159},{"height":72,"weight":164}];

        if(name == "Titanic") return(new Dataframes.df(Titanic));
        if(name == "sleep") return(new Dataframes.df(sleep));
        if(name == "anscombe") return(new Dataframes.df(anscombe));
        if(name == "AirPassengers") return(Dataframes.df.fromArrayList(AirPassengers));
        if(name == "women") return( new Dataframes.df(women));
        throw("Unknown dataset '" + name + "'");
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