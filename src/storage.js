class Storage {
    constructor() {
        this.STORAGE_KEY = 'twentyooooone';

        this.defaultSave = {
            unusedCards: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            usedCards: [],
            isDefault: true,
        };
    }

    saveGame(context) {
        try {
            const save = {
                round: context.round,
                isPlayersTurn: context.flags.isPlayersTurn,
                passCounter: context.passCounter,
                player: context.player,
                usedCards: context.cards.getUsedCards(),
                unusedCards: context.cards.getUnusedCards(),
                botState: context.bot.getState(),
            };

            console.log('----> SAVE', save);

            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(save));
        } catch (error) {
            console.error("i can't save:", error);
        }
    }

    loadGame() {
        let raw;

        try {
            raw = localStorage.getItem(this.STORAGE_KEY);
        } catch (error) {
            console.log("can't get item frm localstorage", error);
            return false;
        }

        if (!raw) {
            console.log("can't load");
            return false;
        }

        let data;

        try {
            data = JSON.parse(raw);
        } catch (error) {
            console.error("can't parse save, reset", error);
            this.clearSave();
            return false;
        }

        if (!this.isValidSave(data)) {
            console.error('save is corruped, reset');
            this.clearSave();
            return false;
        }

        const save = {
            round: data.round,
            isPlayersTurn: data.isPlayersTurn,
            passCounter: data.passCounter,
            player: data.player,
            usedCards: data.usedCards,
            unusedCard: data.unusedCards,
            botState: data.botState,
            isDefault: false,
        };

        console.log('loading from storage', save);

        return save;
    }

    isValidSave(data) {
        if (data == null || typeof data !== 'object') return false;

        if (typeof data.round !== 'number') return false;
        if (typeof data.isPlayersTurn !== 'boolean') return false;
        if (typeof data.passCounter !== 'number') return false;
        if (!Array.isArray(data.usedCards)) return false;

        if (data.player == null || !Array.isArray(data.player.cards))
            return false;
        if (data.botState == null || !Array.isArray(data.botState.cards))
            return false;
        if (data.player.cards.every(Number.isInteger) != true) return false;

        return true;
    }

    clearSave() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

export default Storage;
