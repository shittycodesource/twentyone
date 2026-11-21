import test from 'node:test';
import assert from 'node:assert';

import { chooseSound } from '../src/chooseSound.js';

test('chooses a sound with the lowest play count', () => {
    const sounds = ['1.mp3', '2.mp3', '3.mp3'];

    const counters = {
        '1.mp3': 5,
        '2.mp3': 2,
        '3.mp3': 4,
    };

    const result = chooseSound(sounds, counters);

    assert.equal(result, '2.mp3');
});

test('chooses only sounds with the lowest play count', () => {
    const sounds = ['1.mp3', '2.mp3', '3.mp3'];

    const counters = {
        '1.mp3': 5,
        '2.mp3': 2,
        '3.mp3': 2,
    };

    const result = chooseSound(sounds, counters);

    assert.ok(['2.mp3', '3.mp3'].includes(result));
});

test('all random sounds are played equally after repeated selections', () => {
    const sounds = ['2.mp3', '8.mp3'];

    const counters = {
        '2.mp3': 0,
        '8.mp3': 0,
    };

    for (let i = 0; i < 100; i++) {
        const selectedSound = chooseSound(sounds, counters);

        counters[selectedSound]++;
    }

    assert.equal(counters['2.mp3'], 50);
    assert.equal(counters['8.mp3'], 50);
});

test('all thinking sounds are played equally after repeated selections', () => {
    const sounds = [
        '1.mp3',
        '3.mp3',
        '4.mp3',
        '5.mp3',
        '6.mp3',
        '7.mp3',
    ];

    const counters = Object.fromEntries(
        sounds.map(sound => [sound, 0])
    );

    for (let i = 0; i < 600; i++) {
        const selectedSound = chooseSound(sounds, counters);

        counters[selectedSound]++;
    }

    for (const sound of sounds) {
        assert.equal(counters[sound], 100);
    }
});

test('sound play counts never differ by more than one', () => {
    const sounds = [
        '1.mp3',
        '3.mp3',
        '4.mp3',
        '5.mp3',
        '6.mp3',
        '7.mp3',
    ];

    const counters = Object.fromEntries(
        sounds.map(sound => [sound, 0])
    );

    for (let i = 0; i < 101; i++) {
        const selectedSound = chooseSound(sounds, counters);

        counters[selectedSound]++;
    }

    const playCounts = Object.values(counters);

    const highestCount = Math.max(...playCounts);
    const lowestCount = Math.min(...playCounts);

    assert.ok(highestCount - lowestCount <= 1);
});

test('only sounds from the provided array are selected', () => {
    const sounds = ['2.mp3', '8.mp3'];

    const counters = {
        '1.mp3': 100,
        '2.mp3': 0,
        '3.mp3': 100,
        '4.mp3': 100,
        '5.mp3': 100,
        '6.mp3': 100,
        '7.mp3': 100,
        '8.mp3': 0,
    };

    for (let i = 0; i < 100; i++) {
        const selectedSound = chooseSound(sounds, counters);

        assert.ok(sounds.includes(selectedSound));
    }
});