class HtmlController {

    constructor() {

        this.buttons = document.getElementById('buttons');
        this.takeButton = document.getElementById('take');
        this.passButton = document.getElementById('pass');
        this.restartButton = document.getElementById('restart');


        this.dialogueBox = document.querySelector('.action-box__main');
        this.roundCounter = document.querySelector('.round-counter');


        // PLAYER
        this.playerCardsGrid = document.querySelector('#playerCards');
        this.playerCardsCounter = document.querySelector('#playerCardsCounter');


        // SCENE / OPPONENT
        this.opponentCardsGrid = document.querySelector('.scene__exposed');
        this.opponentHelper = document.querySelector('.scene__helper');

        this.isTypeWriterActive = false;
    }


    reset() {
        this.dialogueBox.innerHTML = '';
        this.playerCardsGrid.innerHTML = '';
        this.playerCardsCounter.innerHTML = '';
        this.playerCardsCounter.classList.remove('red');
        this.opponentCardsGrid.innerHTML = '';
        this.opponentHelper.innerHTML = '';
        this.restartButton.classList.add('hide');
        this.buttons.classList.add('hide');

        this.dialogueBox.innerHTML = '';

        this.typeWriter('Играем на квартиру', 0, () => {
            if (this.isPlayersTurn == false) {
                this.makeBotsMove();
            } else {
                this.toggleButtons();
            }
        });
    }


    unhideOrSomething() {
        // i dont even know how to name this
        this.buttons.classList.add('hide');
        this.restartButton.classList.remove('hide');
        this.playerCardsCounter.classList.remove('hide');
        this.opponentHelper.classList.remove('hide');
    }

    /* RENDERS =============== **/

    // Takes player's cards
    renderPlayerUI(cards) {
        let cardsHTML = '';
        let helper = 0;

        for (let i = 0; i < cards.length; i++) {
            cardsHTML += this.getPlayerCardTemplate(i, cards[i]);
            helper += cards[i];
        }

        const helperHTML = `${helper} / 21`;

        this.playerCardsGrid.innerHTML = cardsHTML;
        this.playerCardsCounter.innerHTML = helperHTML;
        this.playerCardsCounter.classList.toggle('red', helper > 21);
    }

    // Takes bot's cards
    renderSceneUI(cards) {
        let cardsHTML = '';
        let helper = 0;

        for (let i = 0; i < cards.length; i++) {
            cardsHTML += this.getOpponentCardHTML(i, cards[i]);
            helper += cards[i];
        }

        const helperHTML = `? + ${helper - cards[0]} / 21`;

        this.opponentCardsGrid.innerHTML = cardsHTML;
        this.opponentHelper.innerHTML = helperHTML;
    }

    typeWriter(text, index, onComplete) {
        this.isTypeWriterActive = true;

        if (index < text.length) {
            this.dialogueBox.innerHTML += text.charAt(index);

            setTimeout(() => {
                this.typeWriter(text, index + 1, onComplete);
            }, 50);
        } else {
            if (typeof onComplete === 'function') {
                onComplete();
                this.isTypeWriterActive = false;
            }
        }
    }

    dialogue(text) {
        this.dialogueBox.innerHTML = '';
    }

    toggleButtons(isPlayersTurn, areActionsLocked) {
        const shouldHide = (isPlayersTurn == false) || (areActionsLocked == true);

        this.buttons.classList.toggle('hide', shouldHide);
    }

    renderRoundCounter(round) {
        this.roundCounter.innerHTML = `ROUND: ${round}`;
    }

    renderAngryGoomba() {
        const el = document.querySelector('#goomba');
        el.classList.toggle('hide');
        console.log("ELEMENT", el)
        if (!el.paused && !el.ended) {
            el.stop();          // Pauses playback
        }
    }

    renderStare() {
        const el = document.querySelector('#stare');
        el.classList.remove('hide');
    }

    stopEndMedia() {
        document
            .querySelectorAll('.scene__opponent--end')
            .forEach((el) => el.classList.add('hide'));

        const el = document.querySelector('#goomba');
        console.log("ELEMENT", el)
        if (!el.paused && !el.ended) {
            el.stop();          // Pauses playback
        }
    }

    renderPlayerCounter(total) {
        this.playerCardsCounter.innerHTML = `${total} / 21`;
        this.playerCardsCounter.classList.toggle('red', total > 21);
    }


    render(context) {
        // this.renderRoundCounter();
        this.renderPlayerUI(context.player.cards);
        this.renderSceneUI(context.bot.cards);
    }


    /* HTML HELPERS =============== **/
    getPlayerCardTemplate(i, card) {
        return `<div class="play-card ${i == 0 ? 'play-card--anonymous' : ''}">${card}</div>`;
    }

    getOpponentCardHTML(i, card) {
        return i == 0
            ? `<div class="exposed-card exposed-card--anonymous">?</div>`
            : `<div class="exposed-card">${card}</div>`;
    }

    getCardsCounterHTML(i, cards, isHidden = false) {
        return `
	        ${isHidden == false ? cards[i] : '?'} 
	        ${i == cards.length - 1 ? '' : ' + '} 
	    `;
    }

    setEvent(element, handler) {
        element.addEventListener("click", () => handler());
    }
}


export default HtmlController;