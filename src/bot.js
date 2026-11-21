class Bot {
    
    constructor(options)
    {
        this.cards    = options?.cards    ?? []; // Just usual cards
        this.specials = options?.specials ?? []; // Special cards that have unique functions
        this.health   = options?.health   ?? 1000; // For the future...
    }

    reset() {
        this.cards = [];
        this.specials = [];
        this.health = 1000;
    }

    /**
     *  Just trying jsdoc 

     * Take card or pass
     * @param botsCards cards that bot currently have
     * @param freeDeck cards that do not belong to the bot or to a player
     * @param currentLimit limit of the game, usually 21 (for the future...)
     * @returns 0 to pass, 1 to take card
     */
    decideMove(botsCards, freeDeck, currentLimit) {
        console.group("Bot decides his move");

        
        const sum = botsCards.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const median = freeDeck[Math.floor(freeDeck.length / 2)]

        console.log("Sum of cards: ", sum);
        console.log("Median: ", median);
        console.log(sum + median < currentLimit);

        if (sum + median < currentLimit) {
            console.log("Bot takes card");
            console.groupEnd("");
            return 1;
        }
        
        console.log("Bot passes");
        console.groupEnd("");
        return 0;
    }


    doRandomActions() {
        // later
    }

    /**
     * @returns bot's variables to store in localstorage
     */
    getState() {
        return { 
            health: this.health,
            cards: this.cards,
            specials: this.specials
        }
    }

}

export default Bot;