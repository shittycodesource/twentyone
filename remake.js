class GAME {

	constructor(options) 
	{
		this.buttons = document.getElementById("buttons");
		this.takeButton = document.getElementById("take");
		this.passButton = document.getElementById("pass");
		this.restartButton = document.getElementById("restart");

		this.dialogueBox = document.querySelector(".action-box__main");
		this.roundCounter = document.querySelector('.round-counter');

		// PLAYER
		this.playerCardsGrid = document.querySelector('#playerCards');
		this.playerCardsCounter = document.querySelector('#playerCardsCounter');

		// SCENE / OPPONENT
		this.opponentCardsGrid = document.querySelector('.scene__exposed');
		this.opponentHelper = document.querySelector('.scene__helper');


		this.STORAGE_KEY         = "twenty-one-save";

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
		console.group("Bot is making a move...");
		console.log("thinking (maybe)...");

		const random = Math.floor(Math.random() * 10) + 1;

		let message;

	    if (random > 8) { 
	    	this.giveRandomCard(this.bot);
			this.passCounter = 0;

			console.log("Bot took a card");

			message = "Кирилл взял карту";

	    }  else { 
	    	this.passCounter++;

			console.log("Bot PASSES"); 
			console.log("Pass counter: ", this.passCounter);

			message = "Кирилл пасует";
	    }

		this.renderPlayerUI();
		this.renderSceneUI();

		this.areActionsLocked = true;
		this.toggleButtons();

		this.dialogueBox.innerHTML = "";

		this.typeWriter(message, 0, () => {
		
			this.areActionsLocked = false;

			if (this.passCounter >= 2) {
				this.finishRound();
			} else {
				this.passTheControls();
			}

			this.saveGame();
		});

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

	start() { // Starting torture
		this.setEventListeners();

		const loaded = this.loadGame();

		if (loaded == false) {
			
			this.decideWhoIsFirst();
			this.nextRound();

			this.dialogueBox.innerHTML = "";

			this.typeWriter("Ну привет", 0, () => {

				if (this.isPlayersTurn == false) {
					this.makeBotsMove();
				} else {
					this.toggleButtons();
				}

			});

		} else { // render UI and go from a saved state
			this.renderRoundCounter();
			this.renderPlayerUI();
			this.renderSceneUI();
			this.toggleButtons();

			this.dialogueBox.innerHTML = "";

			this.typeWriter("1000 лет спустя...", 0, () => {
				if (this.passCounter == 2) {
					this.finishRound();
				} else if (this.isPlayersTurn == false) {
					this.makeBotsMove();
				} else {
					this.toggleButtons();
				}
			});
		}
	}


	restart() {
		console.group("restart");
		
		this.stopEndMedia();
		this.clearSave();

		this.round = 0;
		this.isPlayersTurn = false;
		this.areActionsLocked = false;
		this.isEndMediaActive = false;
		this.usedCards = [];
		this.passCounter = 0;

		this.player = { health: 1000, cards: [], specials: [], inventory: [] };
		this.bot =    { health: 1000, cards: [], specials: [], inventory: [] };

		this.dialogueBox.innerHTML = "";
		this.playerCardsGrid.innerHTML = "";
		this.playerCardsCounter.innerHTML = "";
		this.playerCardsCounter.classList.remove("red");
		this.opponentCardsGrid.innerHTML = "";
		this.opponentHelper.innerHTML = "";

		this.restartButton.classList.add("hide");
		this.buttons.classList.add("hide");

		this.decideWhoIsFirst();
		this.nextRound();

		this.dialogueBox.innerHTML = "";

		this.typeWriter("Играем на квартиру", 0, () => {
			if (this.isPlayersTurn == false) {
				this.makeBotsMove();
			} else {
				this.toggleButtons();
			}
		});

		console.groupEnd();
	}


	nextRound() { // Logic for next round
		console.group("startRound");
    	console.log("Current round", this.round);
		console.log("Pass counter: ", this.passCounter);

		if (this.passCounter >= 2) {
			this.finishRound();
			console.groupEnd();
	    	return false;
	    }

	    this.renderRoundCounter();

    	if (this.round == 0) { // Initially give everyone 2 cards
    		this.giveRandomCard(this.player);
    		this.giveRandomCard(this.bot);
    		// this.giveRandomCard(this.player);
    		// this.giveRandomCard(this.bot);
    	}

    	this.round++;
    	this.renderPlayerUI();
		this.renderSceneUI();
		this.saveGame();

    	console.groupEnd();
	}


	finishRound() {
		console.group("finishRound");

		this.buttons.classList.add("hide");
		this.restartButton.classList.remove("hide");
		this.playerCardsCounter.classList.remove("hide");
		this.opponentHelper.classList.remove("hide");

		const playerTotal = this.player.cards.reduce((a, b) => a + b, 0);
		const botTotal    = this.bot.cards.reduce((a, b) => a + b, 0);

		console.log("Player total:", playerTotal);
		console.log("Bot total:", botTotal);

		let message;

		if (playerTotal > 21 && botTotal > 21) 
		{
			message = "Ничья!";
			this.renderStare();
		} 
		else if (playerTotal > 21) 
		{
			message = "Кирилл победил!";
			this.renderStare();
		} 
		else if (botTotal > 21) 
		{
			message = `Кирилл перебрал. Ты победил! (У Кирилла ${this.bot.cards.reduce((acc, curr) => acc + curr, 0)})`;
			this.renderAngryGoomba();
		} 
		else if (playerTotal == botTotal) 
		{
			message = "Ничья!";
			this.renderStare();
		} 
		else if (playerTotal > botTotal) 
		{
			message = `Ты победил! (У Кирилла ${this.bot.cards.reduce((acc, curr) => acc + curr, 0)})`;
			this.renderAngryGoomba();
		} 
		else 
		{
			message = "Кирилл победил!";
			this.renderStare();
		}

		this.renderPlayerCounter(playerTotal);

		this.dialogueBox.innerHTML = "";


		this.typeWriter(message, 0, () => {
			this.clearSave();
			console.groupEnd();
		});

		console.groupEnd();
	}




	/* EVENTS =========================**/ 
	takeEvent() {
		this.stopEndMedia();

	    if (this.areActionsLocked || this.isPlayersTurn == false || this.passCounter >= 2) {
	    	return;
	    }

	    console.group("takeEvent");
	    
	    this.passCounter = 0;
	    this.giveRandomCard(this.player);
	    this.passTheControls();

	    this.renderPlayerUI();
	    this.renderSceneUI();
	    this.saveGame();

	    this.makeBotsMove();

	    console.groupEnd();
	}

	passEvent() {
		this.stopEndMedia();

		if (this.areActionsLocked || this.isPlayersTurn == false || this.passCounter >= 2) {
			return;
		}

		console.group("passEvent");
		
		this.passCounter++;
		this.passTheControls();

		this.saveGame();

		if (this.passCounter >= 2) {
			this.finishRound();
			console.groupEnd();
			return;
		}

		this.makeBotsMove();

		console.groupEnd();
	}

	restartEvent() {
		this.stopEndMedia();

		if (this.areActionsLocked) {
			return;
		}

		console.group("restartEvent");
		this.restart();
		console.groupEnd();
	}




	/* EVENT LISTENERS =============== **/
	setTakeEvent() {
		this.takeButton.addEventListener("click", () => this.takeEvent());
	}

	setPassEvent() {
		this.passButton.addEventListener("click", () => this.passEvent());
	}

	setRestartEvent() {
		this.restartButton.addEventListener("click", () => this.restartEvent());
	}

	setEventListeners() {
		this.setTakeEvent();
		this.setPassEvent();
		this.setRestartEvent();
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
	    this.playerCardsCounter.classList.toggle("red", helper > 21);

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


	typeWriter(text, index, onComplete) {
	    if (index < text.length) {
	        this.dialogueBox.innerHTML += text.charAt(index);
	        
	        setTimeout(() => {
	            this.typeWriter(text, index + 1, onComplete);
	        }, 50);

	    } else {
	    	if (typeof onComplete === "function") {
	    		onComplete();
	    	}
	    }
	}


	toggleButtons() {
		const shouldHide = this.isPlayersTurn == false || this.areActionsLocked == true;
		this.buttons.classList.toggle("hide", shouldHide);
	} 


	renderRoundCounter() {
		this.roundCounter.innerHTML = `ROUND: ${this.round}`;
	}


	renderAngryGoomba() {
		const el = document.querySelector('#goomba');
		el.classList.toggle("hide");
		
		if (this.isEndMediaActive == false) {
			el.play();
		} else {
			el.stop();
		}

		this.isEndMediaActive = true;
	}

	renderStare() {
		this.isEndMediaActive = true;

		const el = document.querySelector("#stare");
		el.classList.remove("hide");

	}

	stopEndMedia() {
		this.isEndMediaActive = false;
		document.querySelectorAll(".scene__opponent--end").forEach(el => el.classList.add("hide"));
	}

	renderPlayerCounter(total) {
		this.playerCardsCounter.innerHTML = `${total} / 21`;
		this.playerCardsCounter.classList.toggle("red", total > 21);
	}



	/* SAVE OR LOAD GAME =============== **/ 
	saveGame() {
		try {

			const data = {
				round: this.round,
				isPlayersTurn: this.isPlayersTurn,
				usedCards: this.usedCards,
				passCounter: this.passCounter,
				player: this.player,
				bot: this.bot
			};

			localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
		} catch (e) {
			console.log("i can't save:", e);
		}
	}


	loadGame() {
		let raw;

		try {
			raw = localStorage.getItem(this.STORAGE_KEY);
		} catch (error) {
			console.log("can't get item frm localstorage");
			return false;
		}

		if (!raw) {
			console.log("can't load")
			return false;
		}

		let data;

		try {
			data = JSON.parse(raw);
		} catch (e) {
			console.log("can't parse save, reset");
			this.clearSave();
			return false;
		}
		
		if (!this.isValidSave(data)) {
			console.log("save is corruped, reset");
			this.clearSave();
			return false;
		}

		this.round = data.round;
		this.isPlayersTurn = data.isPlayersTurn;
		this.usedCards = data.usedCards;
		this.passCounter = data.passCounter;
		this.player = data.player;
		this.bot = data.bot;

		return true;
	}


	isValidSave(data) {
		if (data == null || typeof data !== "object") return false;

		if (typeof data.round !== "number")          return false;
		if (typeof data.isPlayersTurn !== "boolean") return false;
		if (typeof data.passCounter !== "number")    return false;
		if (!Array.isArray(data.usedCards))          return false;

		if (data.player == null || !Array.isArray(data.player.cards)) return false;
		if (data.bot == null || !Array.isArray(data.bot.cards))       return false;

		return true;
	}


	clearSave() {
		localStorage.removeItem(this.STORAGE_KEY);
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
game.start();