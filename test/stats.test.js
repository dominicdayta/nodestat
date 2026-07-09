const test = require('node:test');
const assert = require('node:assert/strict');

const nodestat = require('../index.js');

test('stat.sum and stat.mean compute basic aggregates', () => {
    assert.equal(nodestat.stat.sum([1, 2, 3, 4]), 10);
    assert.equal(nodestat.stat.mean([1, 2, 3, 4]), 2.5);
});

test('stat.countValid excludes invalid values', () => {
    const values = [1, 2, NaN, null, undefined, Infinity, 3];
    assert.equal(nodestat.stat.countValid(values), 3);
});

test('stat.var and stat.sd are coherent', () => {
    const sample = [2, 4, 4, 4, 5, 5, 7, 9];
    const variance = nodestat.stat.var(sample);
    const sd = nodestat.stat.sd(sample);

    assert.ok(variance > 0);
    assert.equal(sd, variance ** 0.5);
});

test('stat.dataset returns known built-in dataset', () => {
    const titanic = nodestat.stat.dataset('Titanic');
    assert.ok(titanic.nrow() > 0);
    assert.ok(titanic.columns().includes('Survived'));
});
