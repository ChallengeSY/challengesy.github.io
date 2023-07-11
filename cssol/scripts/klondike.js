window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 19; y++) {
		for (var x = 0; x < 7; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 150;
			
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


	// Create stock pile
	for (var i = 0; i < 8; i++) {
		leftPos = i;
		topPos = i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	// Create waste pile
	for (var i = 0; i < 24; i++) {
		leftPos = COLUMN_WIDTH + Math.floor(i/3);
		topPos = Math.floor(i/3);

		createDivFrag("waste"+i,leftPos,topPos,i);
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	selectX = -1;
	changeDiff(true);
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Deal a card from the stock

function dealStock() {
	if (solGame.gameActive && selectX != 99) {
		updateStatus("&emsp;");
		if (solGame.stockRemain) {
			if (solGame.difficulty == 2) {
				wasteDealBy = 1 + solGame.redeals;
			}
			for (var i = 1; i <= wasteDealBy; i++) {
                if (solGame.stockRemain > 0) {
                    solGame.wasteSize++;
                    solGame.stockRemain--;
                    incrementMove();
                }
			}
			playSound(cardDown);
			
		} else if (solGame.redeals > 0) {
			if (solGame.wasteSize >= 0) {
				solGame.stockRemain = solGame.wasteSize + 1;
				solGame.wasteSize = -1;
				
				solGame.redeals--;
				playSound(redealSnd);
			}
		}
		renderPlayarea();
	}
}

function deleteEntry() {
	for (var i = solGame.wasteSize; i < 23; i++) {
		stockPile[i] = stockPile[i+1];
	}
	stockPile[23] = null;
	solGame.wasteSize--;
}

function playWaste() {
	var divRef = document.getElementById("waste" + solGame.wasteSize);

	if (selectX == -1) {
		selectCard(divRef);
		selectX = 99;
	} else if (selectX == 99) {
		deselectCard(divRef);
		selectX = -1;
	} else {
		updateStatus("You may not interact with the waste pile while you have a selection")
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
	var divRef, selectionRef, yRef;
	var baseID, x, y;

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		divRef = document.getElementById(baseID);
		if (selectX >= 0 && selectX < 7) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
		}
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			if (selectX == -1) {
				updateStatus("There are no cards in the empty tableau pile to pick up.");
				skipSounds = 2;
			} else if (selectX == 99)  {
				if (stockPile[solGame.wasteSize].rank == "King") {
					tableau[x][0] = stockPile[solGame.wasteSize];
					height[x] = 0;
					
					playSound(cardDown);
					deleteEntry();
					incrementMove();
					renderPlayarea();
				} else {
					updateStatus("Invalid move. Empty tableau piles may be filled only by a King");
					deselectCard(selectionRef);
				}
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
			}
			
			selectX = -1;
		} else if (selectX == -1) {
			selectDepth = height[x] - y;
			selectX = x;
			
			for (var j = height[x]; j > y; j--) {
				if (j <= downturn[x] || !buildCheck(tableau[x][j-1],tableau[x][j],true)) {
					updateStatus("You can select multiple cards, but only if they form a build, and that no face-down cards are involved.");
					
					skipSounds = 2;
					selectDepth = 0;
					selectX = -1;
					break;
				}
			}
			
			if (selectX >= 0) {
				for (var j = height[x]; j >= y; j--) {
					divRef = document.getElementById("x" + x + "y" + j)
					selectCard(divRef);
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
		} else if (selectX >= 99) {
			if (buildCheck(tableau[x][height[x]],stockPile[solGame.wasteSize])) {
				height[x]++;
				tableau[x][height[x]] = stockPile[solGame.wasteSize];
				playSound(cardDown);
				deleteEntry();
				renderPlayarea();
				incrementMove();
			} else {
				updateStatus("Invalid move. Build down tableau by alternating colors");
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
	var passInvalid, message;
	
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
			if (solGame.difficulty == 2) {
				solGame.redeals = 2;
				wasteDealBy = 3;
			} else {
				solGame.redeals = Infinity;
			}
			playDeck = new solDeck(1);
			if (newSeed) {
				shuffleDeck(1);
			} else if (!readPass(1)) {
				passInvalid = true;
				shuffleDeck(1);
			}
			
			// Reset tableau
			for (var y = 0; y < 19; y++) {
				for (var x = 0; x < 7; x++) {
					tableau[x][y] = null;
				}
			}
			
			// Sets up the tableau
			for (var y = 0; y < 7; y++) {
				for (var x = 0; x < 7; x++) {
					if (y <= x) {
						tableau[x][y] = assignSeedCard();
						if (solGame.difficulty == 4) {
							downturn[x] = 0;
						} else {
							downturn[x] = y;
						}
					}
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < 4; i++) {
				foundationPile[i] = null;
			}
			
			//Empties out the waste pile and create a stock pile
			solGame.wasteSize = -1;
			for (var i = 0; i < 24; i++) {
				stockPile[i] = assignSeedCard();
			}

			solGame.stockRemain = 24;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Klondike Solitaire.");
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
	var divRef, oldDifficulty;

	if (firstTime) {
		var index = document.getElementById("gameDiff").selectedIndex;
		var selected = document.getElementById("gameDiff").options;
		
		solGame.difficulty = selected[index].index + 1;
	} else {
		var index = document.getElementById("gameDiff").selectedIndex;
		var selected = document.getElementById("gameDiff").options;
		
		oldDifficulty = solGame.difficulty;
		solGame.difficulty = selected[index].index + 1;
		
		newGame(false,true);
		if (solGame.totalMoves == 0) {
			if (solGame.difficulty == 2) {
				solGame.redeals = 2;
			} else {
				solGame.redeals = Infinity;
			}
			updateStatus("Difficulty successfully changed.");
		} else {
			solGame.difficulty = oldDifficulty;
			document.getElementById("gameDiff").selectedIndex = solGame.difficulty - 1;
		}
	}

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "klondike";
			wasteDealBy = 1;
			break;
		case 2:
			baseStatFile = "goldRush";
			wasteDealBy = 3;
			break;
		case 3:
			baseStatFile = "klondike3s";
			wasteDealBy = 3;
			break;
		case 4:
			baseStatFile = "saratoga";
			wasteDealBy = 3;
			break;
	}
}

