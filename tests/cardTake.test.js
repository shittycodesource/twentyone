import assert from 'node:assert';
import { canTakeCard } from '../src/canTakeCard.js';

assert.equal(canTakeCard([5, 7]), true);
assert.equal(canTakeCard([10, 5]), true);
assert.equal(canTakeCard([10, 10]), true);
assert.equal(canTakeCard([10, 10, 1]), false);
assert.equal(canTakeCard([11, 10]), false);
assert.equal(canTakeCard([]), true);