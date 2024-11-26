var baseStatFile = "gypsy";

maxScore = 104;
window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 104; y++) {
		for (var x = 0; x < 8; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 140;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
	}

	// Create foundation piles
	for (var i = 0; i < 8; i++) {
		leftPos = i * COLUMN_WIDTH;
		topPos = 0;
		
		createDivFrag("home"+i,leftPos,topPos,"");
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}


	// Create stock pile
	for (var i = 0; i < 27; i++) {
		leftPos = (8 * COLUMN_WIDTH) + i;
		topPos = i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	selectX = -1;
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Deal a card from the stock to each tableau pile

function dealStock() {
	var imgRef;
	if (solGame.gameActive && solGame.stockRemain) {
		incrementMove();
		updateStatus("&emsp;");
		
		for (var i = 0; i < 8; i++) {
			if (solGame.stockRemain) {
				solGame.stockRemain--;
				height[i]++;
				tableau[i][height[i]] = assignSeedCard();
			} else {
				break;
			}
		}
		
		playSound(redealSnd);
		renderPlayarea();
	}
}

// Build down by alternating colors

function buildCheck(objA, objB) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var outcome = false;
	
	if (rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 &&
		getColor(objA) != getColor(objB)) {
		outcome = true;
	}

	return outcome;
}

// Play a card

function playCard(event) {
	var imgRef, selectionRef, yRef;
	var baseID, x, y;

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		y = parseInt(baseID.substring(3,6));

		imgRef = document.getElementById(baseID);
		selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			if (selectX == -1) {
				updateStatus("There are no cards in the empty tableau pile to pick up.");
				skipSounds = 2;
			} else {
				for (var z = 0; z <= selectDepth; z++) {
					yRef = height[selectX] - selectDepth + z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				
					height[x]++;
					tableau[x][height[x]] = tableau[selectX][yRef];
					tableau[selectX][yRef] = null;
				}
				
				playSound(cardDown);
				renderPlayarea();
				incrementMove();
			}
		} else if (selectX == -1) {
			selectDepth = height[x] - y;
			selectX = x;
			
			for (var j = height[x]; j > y; j--) {
				if (j <= downturn[x] || !buildCheck(tableau[x][j-1],tableau[x][j])) {
					updateStatus("You can select multiple cards, but only if they form a build, and that no face-down cards are involved.");
					
					skipSounds = 2;
					selectDepth = 0;
					selectX = -1;
					break;
				}
			}
			
			if (selectX >= 0) {
				for (var j = height[x]; j >= y; j--) {
					imgRef = document.getElementById("x" + x + "y" + j)
					selectCard(imgRef);
				}
			}
		} else if (x == selectX) {
			for (var z = 0; z <= selectDepth; z++) {
				yRef = height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				deselectCard(selectionRef);
			}

			selectDepth = 0;
			selectX = -1;
		} else if (buildCheck(tableau[x][height[x]],tableau[selectX][height[selectX]-selectDepth])) {
			for (var z = 0; z <= selectDepth; z++) {
				yRef = height[selectX] - selectDepth + z;
			
				height[x]++;
				tableau[x][height[x]] = tableau[selectX][yRef];
				tableau[selectX][yRef] = null;
			}
			
			playSound(cardDown);
			renderPlayarea();
			incrementMove();
		} else {
			updateStatus("Invalid move. Build down tableau by alternating colors");
			for (var z = 0; z <= selectDepth; z++) {
				yRef = height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				deselectCard(selectionRef);
			}
			selectDepth = 0;
			selectX = -1;
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
			playDeck = new solDeck(2);
			if (newSeed) {
				shuffleDeck(2);
			} else if (!readPass(2)) {
				passInvalid = true;
				shuffleDeck(2);
			}
			
			// Reset tableau
			for (var y = 0; y < 104; y++) {
				for (var x = 0; x < 8; x++) {
					tableau[x][y] = null;
				}
			}
						
			// Sets up the tableau
			for (var y = 0; y < 3; y++) {
				for (var x = 0; x < 8; x++) {
					tableau[x][y] = assignSeedCard();
					downturn[x] = 2;
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < 8; i++) {
				foundationPile[i] = null;
			}

			solGame.stockRemain = 80;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Gypsy Solitaire.");
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
