const delay = ms => new Promise(res => setTimeout(res, ms));

class GAME {

	constructor(options) 
	{
		this.buttons = document.getElementById("buttons");
		this.takeButton = document.getElementById("take");
		this.passButton = document.getElementById("pass");

		this.dialogueBox = document.querySelector(".action-box__main");
		this.roundCounter = document.querySelector('.round-counter');

		// PLAYER
		this.playerCardsGrid = document.querySelector('#playerCards');
		this.playerCardsCounter = document.querySelector('#playerCardsCounter');

		// SCENE / OPPONENT
		this.opponentCardsGrid = document.querySelector('.scene__exposed');
		this.opponentHelper = document.querySelector('.scene__helper');




		this.TAKE_CARD_ACTION    = "TAKE_CARD_ACTION"
		this.TAKE_SPECIAL_ACTION = "TAKE_SPECIAL_ACTION"
		this.PASS_ACTION         = "PASS_CARD_ACTION"

		this.round = 0;

		this.isPlayersTurn = false;
		this.areActionsLocked = false;

		this.availableCards = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11 ];
		this.usedCards = [];

		this.passCounter = 0;

		this.player = { health: 1000, cards: [], specials: [], inventory: [] };
		this.bot =    { health: 1000, cards: [], specials: [], inventory: [] };


		// this.start();
	}



	/* SOME KIND OF LOGIC =============== **/

	giveRandomCard(currentPlayer) { // Gives a card to a player or to a bot
		const number = Math.floor(Math.random() * 11) + 1;

	    if (this.usedCards.length != this.availableCards.length) {
	        
	        if (this.usedCards.includes(number) == false) {
	            this.usedCards.push(number);
	            
	            currentPlayer.cards.push(number);
	    
	        } else {
	            this.giveRandomCard(currentPlayer);
	            console.log("Try again...");
	        }
	    } else {
	        window.alert("NO CARDS AVAILABLE");
	    }
	}

	
	makeBotsDecision() {
		// returns object "decision" { action: CONST, special: ... } 
	}


	decideWhoIsFirst() {
		const random = Math.floor(Math.random() * 10) + 1;
    
	    if (random > 5) { 
	    	this.isPlayersTurn = true; 
	    }  else { 
	    	this.isPlayersTurn = false; 
	    }

	    console.group("Start Gane");
	    console.log(this.isPlayersTurn ? "It's player's turn" : "It's bot's turn");
	    console.groupEnd();
	}


	makeBotsMove() {
		// what do i event put here
		console.group("Bot is making a move...");
		console.log("thinking (maybe)...");


		const random = Math.floor(Math.random() * 10) + 1;

	    if (random > 5) { 
	    	this.giveRandomCard(this.bot);
			this.passCounter = 0;

			console.log("Bot took a card");

	    }  else { 
	    	this.passCounter++;

			console.log("Bot PASSES"); 
			console.log("Pass counter: ", this.passCounter);
	    }

	    // console.log("Waiting for delay...");
	    // console.log("Delay is over");


		this.passTheControls();
		console.groupEnd();
	}


	passTheControls() {
		console.group("Passing controls");
		
		this.isPlayersTurn = !this.isPlayersTurn;
		this.toggleButtons();

		console.log("Is player in control ", this.isPlayersTurn);
		console.groupEnd();
	}



	// NO IDEA HOW TO NAME ============================

	start() {
		// Starting game
		this.setEventListeners();
		this.decideWhoIsFirst();
		this.toggleButtons();
		this.nextRound();


		this.typeWriter("Hello, Player!", 0);
	}


	nextRound() { // Logic for next round
		console.group("startRound");
    	console.log("Current round", this.round);
		console.log("Pass counter: ", this.passCounter);

	    if (this.passCounter == 2) {
			window.alert("Open up cards, count results");
			console.groupEnd();
	    	return false;
	    }

	    this.renderRoundCounter();

    	if (this.round == 0) { // Initially give everyone 2 cards
    		this.giveRandomCard(this.player);
    		this.giveRandomCard(this.player);
    		this.giveRandomCard(this.bot);
    		this.giveRandomCard(this.bot);
    	}


    	if (this.isPlayersTurn == false) {
			this.makeBotsMove();
    	}

    	this.round++;
    	this.renderPlayerUI();
		this.renderSceneUI();
	

    	console.groupEnd();
	}




	/* EVENTS =========================**/ 
	takeEvent() {
	    console.group("takeEvent");
	    
	    this.passCounter = 0;
	    this.giveRandomCard(this.player);
	    this.passTheControls();
	    this.makeBotsMove();

	    this.nextRound();

	    console.groupEnd();
	}

	passEvent() {
		console.group("passEvent");
		
		this.passCounter++;
		this.passTheControls();
		this.makeBotsMove();

		this.nextRound();

		console.groupEnd();
	}




	/* EVENT LISTENERS =============== **/
	setTakeEvent() {
		this.takeButton.addEventListener("click", () => this.takeEvent());
	}

	setPassEvent() {
		this.passButton.addEventListener("click", () => this.passEvent());
	}

	setEventListeners() {
		this.setTakeEvent();
		this.setPassEvent();
	}




	/* RENDERS =============== **/ 
	renderPlayerUI() {
		const cards = this.player.cards;
	    let cardsHTML = '';
	    let helper = 0;
	    
	    for (let i = 0; i < cards.length; i++)  {
	        cardsHTML += this.getPlayerCardTemplate(i, cards[i]); 
	        helper += cards[i]
	    }
	    
	    const helperHTML = `${helper} / 21`;

	    this.playerCardsGrid.innerHTML    = cardsHTML;
	    this.playerCardsCounter.innerHTML = helperHTML;

	}


	renderSceneUI() {
		const cards = this.bot.cards;
	    let cardsHTML = '';
	    let helper = 0;

	    for (let i = 0; i < cards.length; i++)  {
	        cardsHTML += this.getOpponentCardHTML(i, cards[i]); 
	        helper += cards[i]
	    }

	    const helperHTML = `? + ${helper - cards[0]} / 21`; 

	    this.opponentCardsGrid.innerHTML = cardsHTML;
	    this.opponentHelper.innerHTML    = helperHTML;
	}


	typeWriter(text, index) {
	    if (index < text.length) {
	        this.dialogueBox.innerHTML += text.charAt(index);
	        
	        setTimeout(() => {
	            this.typeWriter(text, index + 1);
	        }, 100);

	    }
	}


	toggleButtons() {
		this.buttons.classList.toggle("hide", this.isPlayersTurn == false);
	} 


	renderRoundCounter() {
		this.roundCounter.innerHTML = `ROUND: ${this.round}`;
	}



	/* HTML HELPERS =============== **/ 
	getPlayerCardTemplate(i, card) {
	    return `<div class="play-card ${i == 0 ? 'play-card--anonymous' : ''}">${card}</div>`
	}

	getOpponentCardHTML(i, card) {
	    return i == 0 
	        ? `<div class="exposed-card exposed-card--anonymous">?</div>`
	        : `<div class="exposed-card">${card}</div>`
	}

	getCardsCounterHTML(i, cards, isHidden=false) {
	    return `
	        ${isHidden == false ? cards[i] : '?'} 
	        ${i == cards.length - 1 ? '' : ' + '} 
	    `;
	}
}


const game = new GAME();