window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop;
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 52; y++) {
		for (var x = 0; x < 7; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 140;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
	}

	// Create foundation piles
	for (var i = 0; i < 4; i++) {
		leftPos = (i + 3) * COLUMN_WIDTH;
		topPos = 0;
		
		createDivFrag("home"+i,leftPos,topPos,"");
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	selectX = -1;
	changeDiff(true);
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Build down by alternating colors (Yukon), or by suit (Russian Solitaire)

function buildCheck(objA, objB) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var outcome = false;

	if (rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 &&
		getColor(objA) != getColor(objB) && solGame.difficulty < 3) {
		outcome = true;
	}

	if (rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 &&
		getSuit(objA) == getSuit(objB) && solGame.difficulty == 3) {
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
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		imgRef = document.getElementById(baseID);
		if (selectX >= 0 && selectX < 20) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX >= 20) {
			selectionRef = document.getElementById("open" + (selectX - 20));
		}
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			if (selectX == -1) {
				updateStatus("There are no cards in the empty tableau pile to pick up.");
				skipSounds = 2;
			} else if (tableau[selectX][height[selectX]-selectDepth].rank == "King") {
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
			} else {
				updateStatus("Invalid move. Empty tableau piles may be filled only by a King");
				for (var z = 0; z <= selectDepth; z++) {
					yRef = height[selectX] - selectDepth + z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);
					deselectCard(selectionRef);
				}
				selectDepth = 0;
				selectX = -1;
			}
		} else if (selectX == -1) {
			selectDepth = height[x] - y;
			selectX = x;
			
			for (var j = height[x]; j > y; j--) {
				if (j <= downturn[x]) {
					updateStatus("You can select multiple cards, as long as no face-down cards are involved.");
					
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
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
			
				height[x]++;
				tableau[x][height[x]] = tableau[selectX][yRef];
				tableau[selectX][yRef] = null;
			}
			
			playSound(cardDown);
			renderPlayarea();
			incrementMove();
		} else {
			if (solGame.difficulty == 3) {
				updateStatus("Invalid move. Build down tableau by suit");
			} else {
				updateStatus("Invalid move. Build down tableau by alternating colors");
			}
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
			playDeck = new solDeck(1);
			if (newSeed) {
				shuffleDeck(1);
			} else if (!readPass(1)) {
				passInvalid = true;
				shuffleDeck(1);
			}
			
			// Reset tableau
			for (var y = 0; y < 52; y++) {
				for (var x = 0; x < 7; x++) {
					tableau[x][y] = null;
				}
			}
			
			// Sets up the tableau
			for (var y = 0; y < 11; y++) {
				for (var x = 0; x < 7; x++) {
					if (y <= x || (y <= x + 4 && x > 0)) {
						tableau[x][y] = assignSeedCard();
						downturn[x] = x;
					}
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < 4; i++) {
				foundationPile[i] = null;
			}

			renderPlayarea();
			
			if (greetings) {
				if (solGame.difficulty == 2) {
					updateStatus("Welcome to Yukon Solitaire.");
				} else {
					updateStatus("Welcome to Russian Solitaire.");
				}
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
		
		solGame.difficulty = selected[index].index + 2;
	} else {
		newGame(false,true);
		if (solGame.totalMoves == 0) {
			var index = document.getElementById("gameDiff").selectedIndex;
			var selected = document.getElementById("gameDiff").options;
			
			solGame.difficulty = selected[index].index + 2;
			updateStatus("Difficulty successfully changed.")
		} else {
			document.getElementById("gameDiff").selectedIndex = solGame.difficulty - 2;
		}
	}

	switch (solGame.difficulty) {
		case 2:
			baseStatFile = "yukon";
			break;
		case 3:
			baseStatFile = "russianSol";
			break;
	}
}
