maxScore = 104;
window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;
	var linkFrag;

	// Create tableau
	for (var y = 0; y < 17; y++) {
		for (var x = 0; x < 10; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 290;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
	}

	// Create foundation piles
	for (var i = 0; i < 8; i++) {
		leftPos = (i + 2) * COLUMN_WIDTH;
		topPos = 0;

		createDivFrag("home"+i,leftPos,topPos,"");
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	// Create stock pile
	for (var i = 0; i < 22; i++) {
		leftPos = i;
		topPos = i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	wasteFanned = true;
	// Create waste pile
	for (var i = 0; i < 64; i++) {
		leftPos = i * FANNING_X;
		topPos = 150;

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
	var dealBy;
	if (solGame.gameActive && selectX != 99) {
		updateStatus("&emsp;");
		if (solGame.stockRemain) {
			dealBy = 1;
			for (var i = 1; i <= dealBy; i++) {
				solGame.wasteSize++;
				solGame.stockRemain--;
				incrementMove();
			}
			playSound(cardDown);
			renderPlayarea();
		} else {
			updateStatus("Stock pile is empty. No redeals allowed")
		}

	}
}

function deleteEntry() {
	for (var i = solGame.wasteSize; i < 63; i++) {
		stockPile[i] = stockPile[i+1];
	}
	stockPile[64] = null;
	solGame.wasteSize--;
}

function playWaste() {
	var imgRef = document.getElementById("waste" + solGame.wasteSize);

	if (selectX == -1) {
		selectCard(imgRef);
		selectX = 99;
	} else if (selectX == 99) {
		deselectCard(imgRef);
		selectX = -1;
	} else {
		updateStatus("You may not interact with the waste pile while you have a selection")
	}
}

// Build down by suit (default)

function buildCheck(objA, objB) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var outcome = false;
	
	if (rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 &&
		(getSuit(objA) == getSuit(objB) || solGame.difficulty == 1)) {
		outcome = true;
	}

	return outcome;
}

// Play a card

function playCard(event) {
	var imgRef, selectionRef, yRef;
	var baseID, x, y, buildHow;
	
	if (solGame.difficulty == 1) {
		buildHow = "regardless of suit";
	} else {
		buildHow = "by suit";
	}

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		imgRef = document.getElementById(baseID);
		if (selectX >= 0 && selectX < reserveStart) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
		}
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			if (selectX == 99) {
				tableau[x][0] = stockPile[solGame.wasteSize];
				height[x] = 0;
				
				playSound(cardDown);
				deleteEntry();
				incrementMove();
				renderPlayarea();
			} else if (selectX >= 0) {
				if (canFillColumn) {
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
					updateStatus("Invalid move. Movement capacity insufficient to fill an empty tableau pile");
					for (var z = 0; z <= selectDepth; z++) {
						yRef = height[selectX] - selectDepth + z;
						selectionRef = document.getElementById("x" + selectX + "y" + yRef);
						deselectCard(selectionRef);
					}
					selectDepth = 0;
					selectX = -1;
				}
			} else {
				updateStatus("There are no cards in the empty tableau pile to pick up.");
				skipSounds = 2;
			}
		} else if (selectX == -1) {
			var freeSpace, spaceNeeded;
			selectDepth = height[x] - y;
			spaceNeeded = selectDepth + 1;
			freeSpace = 1;
			selectX = x;
			
			for (var m = 0; m < 10; m++) {
				if (height[m] < 0) {
					freeSpace = freeSpace * 2;
				}
			}
			
			for (var j = height[x]; j > y; j--) {
				if (!buildCheck(tableau[x][j-1],tableau[x][j])) {
					updateStatus("You can select multiple cards, but only if they form a build.");
					
					skipSounds = 2;
					selectDepth = 0;
					selectX = -1;
					break;
				}
			}
			
			if (selectX >= 0 && spaceNeeded > freeSpace) {
				updateStatus("That selection requires moving " + spaceNeeded + " cards. You only have enough space to move " + freeSpace + ".");
				skipSounds = 2;
				selectDepth = 0;
				selectX = -1;
			}
			
			if (spaceNeeded * 2 <= freeSpace) {
				canFillColumn = true;
			} else {
				canFillColumn = false;
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
		} else if (selectX == 99) {
			if (buildCheck(tableau[x][height[x]],stockPile[solGame.wasteSize])) {
				height[x]++;
				tableau[x][height[x]] = stockPile[solGame.wasteSize];
				
				playSound(cardDown);
				deleteEntry();
				renderPlayarea();
				incrementMove();
			} else {
				updateStatus("Invalid move. Build down tableau " + buildHow);
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
			updateStatus("Invalid move. Build down tableau " + buildHow);
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
	var imgRef, passInvalid, message, newCard;
	
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
			for (var y = 0; y < 17; y++) {
				for (var x = 0; x < 10; x++) {
					tableau[x][y] = null;
				}
			}
			
			// Sets up the tableau
			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 10; x++) {
					tableau[x][y] = assignSeedCard();
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < 8; i++) {
				foundationPile[i] = null;
			}
			
			//Empties out the waste pile and create a stock pile
			solGame.wasteSize = -1;
			for (var i = 0; i < 64; i++) {
				stockPile[i] = assignSeedCard();
			}
			
			solGame.stockRemain = 64;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Forty Thieves Solitaire.");
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
			newGame(false,true);
			updateStatus("Difficulty successfully changed.")
		} else {
			document.getElementById("gameDiff").selectedIndex = solGame.difficulty - 1;
		}
	}

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "napoleonExile";
			break;
		case 2:
			baseStatFile = "40thieves";
			break;
	}
}
