const test = require('node:test');
const assert = require('node:assert/strict');

const nodestat = require('../index.js');

test('df constructs from row objects', () => {
    const df = new nodestat.df([
        { a: 1, b: 'x' },
        { a: 2, b: 'y' },
    ]);

    assert.equal(df.nrow(), 2);
    assert.equal(df.ncol(), 2);
    assert.deepEqual(df.columns(), ['a', 'b']);
});

test('df.fromArrayList builds a dataframe', () => {
    const df = nodestat.df.fromArrayList({
        a: [1, 2, 3],
        b: ['x', 'y', 'z'],
    });

    assert.equal(df.nrow(), 3);
    assert.deepEqual(df.columns(), ['a', 'b']);
    assert.deepEqual(df.rowToArray(1), [2, 'y']);
});

test('select and drop return expected columns', () => {
    const df = new nodestat.df([
        { a: 1, b: 2, c: 3 },
        { a: 4, b: 5, c: 6 },
    ]);

    assert.deepEqual(df.select(['a', 'c']).columns(), ['a', 'c']);
    assert.deepEqual(df.drop(['b']).columns(), ['a', 'c']);
});

test('subset filters rows with predicate', () => {
    const df = new nodestat.df([
        { group: 'A', value: 1 },
        { group: 'A', value: 2 },
        { group: 'B', value: 3 },
    ]);

    const filtered = df.subset('group', (x) => x === 'A');
    assert.equal(filtered.nrow(), 2);
    assert.deepEqual(filtered.colToArray('value'), [1, 2]);
});
