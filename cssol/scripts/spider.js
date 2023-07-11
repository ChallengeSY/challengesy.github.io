var baseStatFile;

window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop;
window.ondrop = deselectAll;
maxScore = 104;
scoringModel = "buildKASpider";

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 104; y++) {
		for (var x = 0; x < 10; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * FANNING_Y + 150;
			
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
	for (var i = 0; i < 17; i++) {
		leftPos = i;
		topPos = i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		autoAddEvents(divFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	selectX = -1;
	changeDiff(true);
	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Deal a card from the stock to each tableau pile

function dealStock() {
	var imgRef, dealAllowed;
	if (solGame.gameActive) {
		dealAllowed = true;
		for (var i = 0; i < 10; i++) {
			if (height[i] < 0) {
				dealAllowed = false;
			}
		} 
		
		if (solGame.stockRemain == 0) {
			updateStatus("Stock pile is empty. No redeals allowed");
		} else if (dealAllowed) {
			incrementMove();
			for (var i = 0; i < 10; i++) {
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
		} else {
			updateStatus("A new row may not be dealt while there are empty columns.");
		}
	}
}

// Build down regardless of suit. Movement limited by builds and difficulty

function buildCheck(objA, objB, limitMove) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var outcome = false;
	
	if (rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 &&
		((getColor(objA) == getColor(objB) && solGame.difficulty == 2) || 
		(getSuit(objA) == getSuit(objB) && solGame.difficulty == 3) ||
		solGame.difficulty == 1 || !limitMove)) {
		outcome = true;
	}

	return outcome;
}

// Play a card

function playCard(event) {
	var imgRef, selectionRef, yRef;
	var baseID, x, y;
	var aceSelected = false, kingSelected = false;

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
					height[x]++;
					tableau[x][height[x]] = tableau[selectX][yRef];
					tableau[selectX][yRef] = null;
				}

				playSound(cardDown);
				renderPlayarea();
				incrementMove();
				endingCheck();
			}
		} else if (selectX == -1) {
			selectDepth = height[x] - y;
			selectX = x;
			
			for (var j = height[x]; j > y; j--) {
				if (j <= downturn[x] || !buildCheck(tableau[x][j-1],tableau[x][j],true)) {
					updateStatus("You can select multiple cards, but only if they form a movable build, and that no face-down cards are involved.");
					
					skipSounds = 2;
					selectDepth = 0;
					selectX = -1;
					break;
				}
			}
			
			if (selectX >= 0) {
				for (var j = height[x]; j >= y; j--) {
					if (tableau[x][j].rank == "Ace") {
						aceSelected = true;
					}

					if (tableau[x][j].rank == "King") {
						kingSelected = true;
					}

					imgRef = document.getElementById("x" + x + "y" + j)
					selectCard(imgRef);
				}
				
				KAbuild = (kingSelected && aceSelected);
			}
		} else if (x == selectX) {
			for (var z = 0; z <= selectDepth; z++) {
				yRef = height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				deselectCard(selectionRef);
			}

			selectDepth = 0;
			selectX = -1;
		} else if (buildCheck(tableau[x][height[x]],tableau[selectX][height[selectX]-selectDepth],false)) {
			for (var z = 0; z <= selectDepth; z++) {
				yRef = height[selectX] - selectDepth + z;
				height[x]++;
				tableau[x][height[x]] = tableau[selectX][yRef];
				tableau[selectX][yRef] = null;
			}
			playSound(cardDown);
			renderPlayarea();
			incrementMove();
			endingCheck();
		} else {
			updateStatus("Invalid move. Build down tableau regardless of suit");
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
			solGame.stockRemain = 104;
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
				for (var x = 0; x < 10; x++) {
					tableau[x][y] = null;
				}
			}
						
			// Sets up the tableau
			for (var y = 0; y < 6; y++) {
				for (var x = 0; x < 10; x++) {
					if (solGame.stockRemain > 50) {
						tableau[x][y] = assignSeedCard();
						downturn[x] = y;
						solGame.stockRemain--;
					}
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < 8; i++) {
				foundationPile[i] = null;
			}
			
			forceRender = true;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Spider Solitaire.");
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
			baseStatFile = "spider1";
			solGame.spiderCon = "downAnySuit";
			break;
		case 2:
			baseStatFile = "spider2";
			solGame.spiderCon = "downColor";
			break;
		case 3:
			baseStatFile = "spider";
			solGame.spiderCon = "downSuit";
			break;
	}
}
