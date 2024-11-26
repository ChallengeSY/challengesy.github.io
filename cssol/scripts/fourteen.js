var baseStatFile = "fourteen";
window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 5; y++) {
		for (var x = 0; x < 12; x++) {
			if (x < 6) {
				leftPos = x * COLUMN_WIDTH;
				topPos = y * FANNING_Y;
			} else {
				leftPos = (x - 6) * COLUMN_WIDTH;
				topPos = 150 + (y + 4.5) * FANNING_Y;
			}
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
	}
	
	selectX = -1;
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Victory conditions

function endingCheck() {
	var movesPossible = false;
	
	if (solGame.casualScore == 52) {
		gameWon();
	} else {
		for (var x = 0; x < 12; x++) {
			for (var dx = 0; dx < 12; dx++) {
				if (x != dx && height[x] >= 0 && height[dx] >= 0) {
					if (pairingMatch(tableau[x][height[x]],tableau[dx][height[dx]])) {
						movesPossible = true;
					}
				}
			}
		}
	
		if (!movesPossible) {
			noMovesLeft();
		}
	}
}


// Checks for pairs that add to fourteen

function pairingMatch(objA, objB) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var outcome = false;
	
	if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 14) {
		outcome = true;
	}

	return outcome;
}

// Play a card

function playCard(event) {
	var imgRef, selectionRef;
	var baseID, x, y;

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		imgRef = document.getElementById("x" + x + "y" + y)
		if (selectX != -1) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		}
	
	
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			updateStatus("There are no cards in the empty tableau pile to interact.");
			skipSounds = 2;
		} else if (selectX == -1) {
			if (y < height[x]) {
				updateStatus("Only fully exposed cards are playable.");
				skipSounds = 2;
			} else {
				selectX = x;
				selectCard(imgRef);
			}
		} else if (x == selectX) {
			selectX = -1;
			deselectCard(imgRef);
		} else if (pairingMatch(tableau[x][height[x]],tableau[selectX][height[selectX]])) {
			tableau[x][height[x]] = null;
			solGame.casualScore++;
			tableau[selectX][height[selectX]] = null;
			solGame.casualScore++;

			playSound(cardDown);
			playSound(scoreCard);
			incrementMove();
			renderPlayarea();
			endingCheck();
		} else {
			updateStatus("Invalid move. Remove pairs that add up to fourteen.");
			selectX = -1;

			deselectCard(selectionRef);
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
	
	try {
		if (selectX != -1) {
			updateStatus("A new game may not be started while there is a card selected.");
		} else if (solGame.totalMoves == 0) {
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
				for (var x = 0; x < 12; x++) {
					if (cardsDealt < 52) {
						tableau[x][y] = assignSeedCard();
					}
				}
			}
			
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Fourteen Out.");
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
			endingCheck();
		}
	} catch(err) {
		throwError(err);
	}
}
