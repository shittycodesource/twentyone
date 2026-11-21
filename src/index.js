import CardStorage from "./cardsStorage.js";
import Bot from "./bot.js";
import HtmlController from "./htmlController.js";
import Storage from "./storage.js";

class Game {

    constructor() {
        this.storage = new Storage();
        this.save = this.storage.loadGame();


        this.flags = {
            areActionsLocked: false,
            isPlayersTurn: false,
        }

        this.passCounter = 0;
        this.round = 0;
        this.currentLimit = 21;


        if (this.save == false) 
        {
            this.htmlController = new HtmlController();
            this.cards = new CardStorage({ usedCards: [], unusedCards:[1,2,3,4,5,6,7,8,9,10,11] });
            this.bot = new Bot({ health: 1000, cards: [], specials: [] });
            this.player = { health: 1000, cards: [], specials: [] };
        }
        else
        {
            this.flags = {
                areActionsLocked: this.save.areActionsLocked,
                isPlayersTurn: this.save.isPlayersTurn
            }

            this.htmlController = new HtmlController();
            
            this.cards = new CardStorage({
                usedCards: this.save.usedCards,
                unusedCards: this.save.unusedCard,
            });
            
            this.bot = new Bot(this.save.botState);
            this.player = this.save.player;
        }

    }

    giveRandomCard(currentPlayer) {
        const card = this.cards.giveRandomCard();

        if (card) {
            currentPlayer.cards.push(card);
            console.log("---> ", card);
        }
    }

    decideWhoIsFirst() {
        const random = Math.floor(Math.random() * 10) + 1;

        if (random > 5) {
            this.flags.isPlayersTurn = true;
        } else {
            this.flags.isPlayersTurn = false;
        }

        console.group('Start Gane');
        console.log(
            this.flags.isPlayersTurn ? "It's player's turn" : "It's bot's turn",
        );
        console.groupEnd();
    }

    passControls() {
        console.group('Passing controls');

        // this.flags.isPlayersTurn = !this.flags.isPlayersTurn;
        this.htmlController.toggleButtons(this.flags.isPlayersTurn, this.flags.areActionsLocked);

        console.log('Is player in control ', this.flags.isPlayersTurn);
        console.groupEnd();
    }

    start() {
        this.setEventListeners();

        if (this.save.isDefault) {

            this.decideWhoIsFirst();
            this.nextRound();

            this.htmlController.dialogue('');
            this.htmlController.typeWriter('Ну привет', 0, () => {

                if (this.flags.isPlayersTurn == false) {
                    this.makeBotsMove();
                } else {
                    this.htmlController.toggleButtons();
                }
                
            });

        } else {
            this.htmlController.render(this);
            this.htmlController.toggleButtons();

            this.htmlController.typeWriter('1000 лет спустя...', 0, () => {
                
                if (this.passCounter == 2) {
                    this.finishRound();
                } 
                else if (this.flags.isPlayersTurn == false) {
                    this.makeBotsMove();
                    this.flags.isPlayersTurn = true;
                } 
                else {
                    this.htmlController.toggleButtons();
                }

            });
        }

    }

    nextRound() {
         // Logic for next round
        console.group('startRound');
        console.log('Current round', this.round);
        console.log('Pass counter: ', this.passCounter);

        if (this.passCounter >= 2) {
            this.finishRound();
            console.groupEnd();
            return false;
        }

        // this.renderRoundCounter();

        if (this.round == 0) {
            // Initially give everyone 2 cards
            this.giveRandomCard(this.player);
            this.giveRandomCard(this.bot);
        }

        this.round++;
        this.htmlController.render(this);
        this.storage.saveGame(this);

        console.groupEnd();
    }

    restart() {
        console.group('restart');

        this.htmlController.stopEndMedia();
        this.storage.clearSave();

        this.round = 0;
        this.passCounter = 0;
        this.flags = {
            areActionsLocked: false,
            isPlayersTurn: false,
        }

        this.cards.reset();
        this.bot.reset()
        this.htmlController.reset();

        this.player = { health: 1000, cards: [], specials: [], inventory: [] };

        this.decideWhoIsFirst();
        this.nextRound();

        console.groupEnd();
    }


    finishRound() {
         console.group('finishRound');

        this.htmlController.unhideOrSomething();

        const playerTotal = this.player.cards.reduce((a, b) => a + b, 0);
        const botTotal = this.bot.cards.reduce((a, b) => a + b, 0);

        console.log('Player total:', playerTotal);
        console.log('Bot total:', botTotal);

        let message;
        if (playerTotal > 21 && botTotal > 21)
        {
            message = 'Ничья!';
            this.htmlController.renderStare();
        } 
        else if (playerTotal > 21) 
        {
            message = 'Кирилл победил!';
            this.htmlController.renderStare();
        } 
        else if (botTotal > 21) 
        {
            message = `Кирилл перебрал. Ты победил! (У Кирилла ${this.bot.cards.reduce((acc, curr) => acc + curr, 0)})`;
            this.htmlController.renderAngryGoomba();
        } 
        else if (playerTotal == botTotal) 
        {
            message = 'Ничья!';
            this.htmlController.renderStare();
        } 
        else if (playerTotal > botTotal) 
        {
            message = `Ты победил! (У Кирилла ${this.bot.cards.reduce((acc, curr) => acc + curr, 0)})`;
            this.htmlController.renderAngryGoomba();
        } 
        else 
        {
            message = 'Кирилл победил!';
            
            this.htmlController.renderStare();
        }

        this.htmlController.renderPlayerCounter(playerTotal);

        this.htmlController.dialogue('');
        this.htmlController.typeWriter(message, 0, () => {
            this.storage.clearSave();
            // this.htmlController.stopEndMedia();
            console.groupEnd();
        });

        console.groupEnd();
    }


    makeBotsMove() {
        console.group('Bot is making a move...');

        const move = this.bot.decideMove(this.bot.cards, this.cards.unusedCards, this.currentLimit);

        let message;
        if (move) {
            this.passCounter = 0;
            
            this.giveRandomCard(this.bot);
            console.log('Bot took a card');
            
            message = 'Кирилл взял карту';
        } else {
            this.passCounter++;
            
            console.log('Bot PASSES');
            console.log('Pass counter: ', this.passCounter);

            message = 'Кирилл пасует';
        }

        this.htmlController.render(this);
        this.flags.areActionsLocked = true;
        this.htmlController.toggleButtons();
        
        this.htmlController.dialogue('');
        this.htmlController.typeWriter(message, 0, () => {
            this.flags.areActionsLocked = false;

            if (this.passCounter >= 2) {
                this.finishRound();
            } else {
                this.flags.isPlayersTurn = true;
                this.passControls();
            }

            this.storage.saveGame(this);
        });

        console.groupEnd();
    }


    /* EVENTS =========================**/
    takeEvent() {
        this.htmlController.stopEndMedia();
        if (this.htmlController.isTypeWriterActive) return;

        if (
            this.areActionsLocked ||
            this.isPlayersTurn == false ||
            this.passCounter >= 2
        ) {
            return;
        }

        console.group('takeEvent');

        this.passCounter = 0;
        this.giveRandomCard(this.player);

        console.log(this)
        this.flags.isPlayersTurn = false;
        this.passControls();

        this.htmlController.render(this);
        this.storage.saveGame(this);


        this.makeBotsMove();

        console.groupEnd();
    }

    passEvent() {
        this.htmlController.stopEndMedia();
        if (this.htmlController.isTypeWriterActive) return;

        if (
            this.areActionsLocked ||
            this.isPlayersTurn == false ||
            this.passCounter >= 2
        ) {
            return;
        }

        console.group('passEvent');

        
        this.passCounter++;

        this.flags.isPlayersTurn = false;
        this.passControls();

        this.storage.saveGame(this);

        if (this.passCounter >= 2) {
            this.finishRound();
            console.groupEnd();
            return;
        }

        this.makeBotsMove();

        console.groupEnd();
    }

    restartEvent() {
        this.htmlController.stopEndMedia();
        if (this.htmlController.isTypeWriterActive) return;

        if (this.flags.areActionsLocked) {
            return;
        }

        console.group('restartEvent');
        this.restart();
        console.groupEnd();
    }


    setEventListeners() {
        this.htmlController.setEvent(this.htmlController.takeButton, this.takeEvent.bind(this));
        this.htmlController.setEvent(this.htmlController.passButton, this.passEvent.bind(this));
        this.htmlController.setEvent(this.htmlController.restartButton, this.restartEvent.bind(this));
    }

}

const game = new Game();
game.start();