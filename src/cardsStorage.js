class CardStorage {
    constructor(options) {
        this.deck = options?.deck ?? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

        this.unusedCards = options?.unusedCards ?? this.deck;
        this.usedCards = options?.usedCards ?? [];

        this.recursionCounter = 0;
    }

    reset() {
        this.recursionCounter = 0;
        this.unusedCards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
        this.usedCards = [];
    }

    giveRandomCard() {
        if (this.recursionCounter >= 100) {
            console.log('Recursion counter stopped the function'); //actually i dont need this
            return false; // but im not sure
        }

        const number = Math.floor(Math.random() * 11) + 1;

        if (this.usedCards.length == this.deck.length) {
            // window.alert('NO CARDS AVAILABLE');
            return false;
        }

        if (this.usedCards.includes(number) == false) {
            this.usedCards.push(number);
            this.unusedCards = this.unusedCards.filter((num) => num != number);

            return number;
        } else {
            console.log('Finding unused card...');

            this.recursionCounter++;
            return this.giveRandomCard();
        }
    }

    getMedian() {
        return this.unusedCards[Math.floor(this.unusedCards.length / 2)];
    }

    getUsedCards = () => this.usedCards;

    getUnusedCards = () => this.unusedCards;
}

export default CardStorage;
