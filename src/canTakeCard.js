export function canTakeCard(cards, limit = 21) {
    const total = cards.reduce((sum, card) => sum + card, 0);

    return total < limit;
}
