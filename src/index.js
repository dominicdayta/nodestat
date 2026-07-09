module.exports = Object.assign(
    {},
    require('./dataframe/index.js'),
    require('./stats/index.js'),
    {
        desc: require('./dataframe/ops/sort.js').desc,
        asc: require('./dataframe/ops/sort.js').asc,
    }
);
