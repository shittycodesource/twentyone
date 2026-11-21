export function decideWinner(playerTotal, botTotal, limit = 21) {
    if (playerTotal > limit && botTotal > limit) {
        return 'draw';
    }

    if (playerTotal > limit) {
        return 'bot';
    }

    if (botTotal > limit) {
        return 'player';
    }

    if (playerTotal == botTotal) {
        return 'draw';
    }

    if (playerTotal > botTotal) {
        return 'player';
    }

    return 'bot';
}
