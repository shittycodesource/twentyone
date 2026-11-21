import test from 'node:test';
import assert from 'node:assert';

import { decideWinner } from '../src/gameRules.js';

test('player wins when bot exceeds 21', () => {
    assert.equal(decideWinner(20, 22), 'player');
});

test('bot wins when player exceeds 21', () => {
    assert.equal(decideWinner(22, 20), 'bot');
});

test('draw when both players exceed 21', () => {
    assert.equal(decideWinner(22, 25), 'draw');
});

test('draw when both players have equal scores', () => {
    assert.equal(decideWinner(18, 18), 'draw');
});

test('player wins with higher score without busting', () => {
    assert.equal(decideWinner(20, 18), 'player');
});

test('bot wins with higher score without busting', () => {
    assert.equal(decideWinner(17, 20), 'bot');
});

test('21 beats a lower score', () => {
    assert.equal(decideWinner(21, 20), 'player');
});

test('both players having 21 results in a draw', () => {
    assert.equal(decideWinner(21, 21), 'draw');
});