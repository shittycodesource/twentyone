import test from 'node:test';
import assert from 'node:assert';

import Bot from '../src/bot.js';

test('bot takes card when sum and median are below the limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [5, 4],
        [1, 2, 3, 4, 5],
        21
    );

    assert.equal(result, 1);
});

test('bot passes when sum and median equal the limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [10, 5],
        [1, 2, 3, 4, 5],
        18
    );

    assert.equal(result, 0);
});

test('bot passes when sum and median exceed the limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [15, 5],
        [1, 2, 3, 4, 5],
        21
    );

    assert.equal(result, 0);
});

test('bot takes a card when its current sum is low', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [3],
        [1, 2, 3, 4, 5],
        21
    );

    assert.equal(result, 1);
});

test('bot passes when it is already at the limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [21],
        [1, 2, 3, 4, 5],
        21
    );

    assert.equal(result, 0);
});

test('bot uses the middle card of the free deck as its median', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [10],
        [1, 2, 10, 11, 12],
        21
    );

    assert.equal(result, 1);
});

test('bot passes when median would make it exceed the limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [15],
        [1, 2, 10, 11, 12],
        21
    );

    assert.equal(result, 0);
});

test('bot takes card when sum plus median is one below limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [10],
        [1, 2, 10, 11, 12],
        21
    );

    assert.equal(result, 1);
});

test('bot passes when sum plus median is exactly one above limit', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [11],
        [1, 2, 10, 11, 12],
        21
    );

    assert.equal(result, 0);
});

test('bot passes when free deck is empty', () => {
    const bot = new Bot();

    const result = bot.decideMove(
        [10],
        [],
        21
    );

    assert.equal(result, 0);
});