const nstat = require('../index.js');

const df = new nstat.df([
    { group: 'A', score: 2, name: 'alice' },
    { group: 'A', score: 9, name: 'ava' },
    { group: 'B', score: 3, name: 'ben' },
    { group: 'B', score: 1, name: 'bill' },
    { group: 'A', score: 9, name: 'amy' },
]);

const sortedLegacy = df.order(['group', 'score', 'name'], [false, true, false]);
console.log('Legacy order(by, desc):');
console.log(sortedLegacy.print());

const sortedHelpers = df.order(['group', nstat.desc('score'), nstat.asc('name')]);
console.log('\nHelper order([..., desc(...), asc(...)]):');
console.log(sortedHelpers.print());
