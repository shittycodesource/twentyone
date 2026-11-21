export function chooseSound(array, phrasesCounter) {
    const leastPlayed = Math.min(
        ...array.map((sound) => phrasesCounter[sound]),
    );

    const candidates = array.filter(
        (sound) => phrasesCounter[sound] == leastPlayed,
    );

    const randomIndex = Math.floor(Math.random() * candidates.length);

    return candidates[randomIndex];
}
