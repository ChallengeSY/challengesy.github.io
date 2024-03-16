window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop;
window.ondrop = deselectAll;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;
	var linkFrag;

	// Create tableau
	for (var y = 0; y < 21; y++) {
		for (var x = 0; x < 9; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 140;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
	}

	// Create reserve slots
	for (var i = 0; i < 7; i++) {
		leftPos = i * COLUMN_WIDTH / 2;
		topPos = 0;
		
		createDivFrag("open"+i,leftPos,topPos,"");
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}

	// Create foundation piles
	for (var i = 0; i < 4; i++) {
		leftPos = (i + 5) * COLUMN_WIDTH;
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
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}

		imgRef = document.getElementById(baseID);
		if (selectX >= 0 && selectX < reserveStart) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX >= reserveStart) {
			selectionRef = document.getElementById("open" + (selectX - reserveStart));
		}
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (height[x] == -1) {
			if (selectX >= reserveStart) {
				height[x]++;
				tableau[x][0] = reserveSlot[selectX-reserveStart];
				reserveSlot[selectX-reserveStart] = null;
				
				playSound(cardDown);
				renderPlayarea();
				incrementMove();
			} else if (selectX >= 0) {
				if (canFillColumn) {
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
			
			for (var m = 0; m < 9; m++) {
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
		} else if (selectX >= reserveStart) {
			if (buildCheck(tableau[x][height[x]],reserveSlot[selectX-reserveStart])) {
				height[x]++;
				tableau[x][height[x]] = reserveSlot[selectX-reserveStart];
				reserveSlot[selectX-reserveStart] = null;
				
				playSound(cardDown);
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
	var imgRef, passInvalid, message, newCard, acesFound;
	
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
			acesFound = 0;
			resetInternals();
			playDeck = new solDeck(1);
			if (newSeed) {
				shuffleDeck(1);
			} else if (!readPass(1)) {
				passInvalid = true;
				shuffleDeck(1);
			}
			
			//Reset the reserve piles
			for (var i = 0; i < 7; i++) {
				reserveSlot[i] = null;
			}
			
			// Reset tableau
			for (var y = 0; y < 21; y++) {
				for (var x = 0; x < 9; x++) {
					tableau[x][y] = null;
				}
			}
			
			// Sets up the tableau
			for (var y = 0; y < 9; y++) {
				for (var x = 0; x < 9; x++) {
					if (y <= x && solGame.difficulty == 1 && y < 7) {
						newCard = assignSeedCard();
						while (newCard.rank == "Ace") {
							foundationPile[acesFound] = newCard;
							solGame.casualScore++;

							acesFound++;
							newCard = assignSeedCard();
						}
					
						tableau[x][y] = newCard;
					} else if (y < 9 - x && solGame.difficulty > 1) {
						newCard = assignSeedCard();
						tableau[x][y] = newCard;
					}
				}
			}
			
			//Fills up the reserve piles
			for (var i = 0; i < 5 + solGame.difficulty; i++) {
				newCard = assignSeedCard();
				while (newCard.rank == "Ace" && solGame.difficulty == 1) {
					foundationPile[acesFound] = newCard;
					solGame.casualScore++;

					acesFound++;
					newCard = assignSeedCard();
				}
					
				reserveSlot[i] = newCard;
			}
			
			if (solGame.difficulty > 1) {
				//Empties out the foundation piles in King Albert
				for (var i = 0; i < 4; i++) {
					foundationPile[i] = null;
				}
			} else { 
				while (cardsDealt < 52) {
					newCard = assignSeedCard();
					foundationPile[acesFound] = newCard;
					solGame.casualScore++;
					acesFound++;
				}
			}

			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Raglan Solitaire.");
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
	var imgRef;

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
			baseStatFile = "raglan";
			break;
		case 2:
			baseStatFile = "kingAlbert";
			break;
	}
}
