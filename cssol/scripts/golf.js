var baseStatFile;
traditionalStock = false;

window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;
	
	// Create tableau
	for (var y = 0; y < 5; y++) {
		for (var x = 0; x < 7; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			
			addEvent(divFrag, "click", playCard, false);
			tableauPanel.appendChild(divFrag);
		}
	}
	
	// Create stock pile
	for (var i = 0; i < 6; i++) {
		leftPos = i;
		topPos = 140 + (4 * FANNING_Y) + i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		
		addEvent(divFrag, "click", dealStock, false);
		tableauPanel.appendChild(divFrag);
	}
	
	wasteFanned = true;
	// Create waste pile
	for (var i = 0; i < 52; i++) {
		leftPos = COLUMN_WIDTH + i * FANNING_X;
		topPos = 140 + (4 * FANNING_Y);
		
		createDivFrag("waste"+i,leftPos,topPos,i); 
		divFrag.style.cursor = "";
		tableauPanel.appendChild(divFrag);
	}
	
	changeDiff(true);
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Victory conditions

function endingCheck() {
	var movesPossible = false;
	
	if (solGame.casualScore <= 0) {
		solGame.casualScore = -solGame.stockRemain;
		gameWon();
	} else if (solGame.stockRemain == 0) {
		for (var x = 0; x < 7; x++) {
			if (height[x] >= 0) {
				if (adjacentRanks(tableau[x][height[x]],stockPile[solGame.wasteSize])) {
					movesPossible = true;
				}
			}
		}
	
		if (!movesPossible) {
			noMovesLeft();
		}
	}
}

// Deal a card from the stock

function dealStock() {
	if (solGame.stockRemain && solGame.gameActive) {
		solGame.wasteSize++;
		stockPile[solGame.wasteSize] = assignSeedCard();
		solGame.stockRemain--;
		incrementMove();
		
		playSound(cardDown);
		renderPlayarea();
		endingCheck();
	}
}

// Checks for adjacent ranks

function adjacentRanks(objA, objB) {
	var outcome = false;
	
	if (getRank(objA) == getRank(objB) - 1) {
		outcome = true;
	}

	if (getRank(objA) == getRank(objB) + 1) {
		outcome = true;
	}
	
	if (getRank(objA) + getRank(objB) == 12 && (getRank(objB) == 12 || getRank(objB) == 0)) {
		outcome = true;
	}
	
	if (getRank(objA) + getRank(objB) == 23 && solGame.difficulty >= 2) {
		outcome = false;
	}
	
	if (getRank(objB) == 11 && solGame.difficulty == 3) {
		outcome = false;
	}

	return outcome;
}

// Play a card. The foundation pile is built up or down regardless of suit, without King-Ace wrapping

function playCard(event) {
	var imgRef;
	var baseID, x, y;

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (y < height[x]) {
			updateStatus("Only fully exposed cards are playable.");
		} else if (tableau[x][y] && adjacentRanks(tableau[x][y],stockPile[solGame.wasteSize])) {
			solGame.wasteSize++;
			stockPile[solGame.wasteSize] = tableau[x][y];
			tableau[x][y] = null;
			solGame.casualScore--;
			incrementMove();
			
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else if (getRank(stockPile[solGame.wasteSize]) == 11 && solGame.difficulty > 2) {
			updateStatus("Invalid move. No building allowed on a King.");
		} else if (solGame.difficulty < 2) {
			updateStatus("Invalid move. Build up or down regardless of suit. Wrapping enabled");
		} else {
			updateStatus("Invalid move. Build up or down regardless of suit. Wrapping disabled");
		}
	} catch(err) {
		throwError(err);
	}
}

// Starts a new game

function newGame(greetings, newSeed) {
	var imgRef, passInvalid, message;
	
	if (newSeed) {
		message = "Abort this game and start a new game?";
	} else {
		message = "Inputting in a password will end this game. Confirm?";
	}
	
	passInvalid = false;
	oldPassword = seedPassword;
	
	try {
		if (solGame.totalMoves == 0) {
			solGame.gameActive = false;
		} else if (solGame.gameActive && confirm(message)) {
			playSound(gameLostSnd);
			solGame.gameActive = false;
		}
	
		if (solGame.gameActive) {
			seedPassword = oldPassword;
			passField.value = seedPassword;
		} else {
			cardsDealt = 0;
			resetInternals();
			playDeck = new solDeck(1);
			if (newSeed) {
				shuffleDeck(1);
			} else if (!readPass(1)) {
				passInvalid = true;
				shuffleDeck(1);
			}

			for (var y = 0; y < 5; y++) {
				for (var x = 0; x < 7; x++) {
					tableau[x][y] = assignSeedCard();
				}
			}
			
			solGame.casualScore = 35;
			solGame.wasteSize = 0;
			stockPile[solGame.wasteSize] = assignSeedCard();
			solGame.stockRemain = 16;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Golf Solitaire.");
			} else if (!newSeed) {
				if (passInvalid) {
					updateStatus("Not a valid password. New game started");
				} else {
					updateStatus("Password successful");
					solGame.recordWin = false;
					solGame.recordPlay = false;
				}
			} else {
				updateStatus("Game started");
			}
		}
	} catch(err) {
		throwError(err);
	}
}

function changeDiff(firstTime) {
	if (firstTime) {
		var index = document.getElementById("gameDiff").selectedIndex;
		var selected = document.getElementById("gameDiff").options;
		
		solGame.difficulty = selected[index].index + 1;
	} else {
		newGame(false,true);
		if (solGame.totalMoves == 0) {
			var index = document.getElementById("gameDiff").selectedIndex;
			var selected = document.getElementById("gameDiff").options;
			
			solGame.difficulty = selected[index].index + 1;
			updateStatus("Difficulty successfully changed.");
		} else {
			document.getElementById("gameDiff").selectedIndex = solGame.difficulty - 1;
		}
	}

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "relaxedGolf";
			break;
		case 2:
			baseStatFile = "golf";
			break;
		case 3:
			baseStatFile = "deadKing";
			break;
	}
}

