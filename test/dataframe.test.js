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

test('order sorts by one numeric column ascending and descending', () => {
    const df = new nodestat.df([
        { value: 2 },
        { value: 10 },
        { value: 1 },
    ]);

    assert.deepEqual(df.order(['value']).colToArray('value'), [1, 2, 10]);
    assert.deepEqual(df.order(['value'], [true]).colToArray('value'), [10, 2, 1]);
});

test('order sorts by multiple columns with mixed directions', () => {
    const df = new nodestat.df([
        { group: 'B', score: 2, id: 'b1' },
        { group: 'A', score: 3, id: 'a1' },
        { group: 'A', score: 1, id: 'a2' },
        { group: 'B', score: 5, id: 'b2' },
        { group: 'A', score: 3, id: 'a3' },
    ]);

    const sorted = df.order(['group', 'score', 'id'], [false, true, false]);
    assert.deepEqual(sorted.colToArray('id'), ['a1', 'a3', 'a2', 'b2', 'b1']);
});

test('order supports inline desc helper and keeps old API', () => {
    const df = new nodestat.df([
        { group: 'A', score: 2, id: 'a1' },
        { group: 'A', score: 5, id: 'a2' },
        { group: 'B', score: 1, id: 'b1' },
        { group: 'B', score: 3, id: 'b2' },
    ]);

    const helperSorted = df.order(['group', nodestat.desc('score')]);
    const legacySorted = df.order(['group', 'score'], [false, true]);

    assert.deepEqual(helperSorted.colToArray('id'), ['a2', 'a1', 'b2', 'b1']);
    assert.deepEqual(legacySorted.colToArray('id'), ['a2', 'a1', 'b2', 'b1']);
});
