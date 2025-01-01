var baseStatFile = "tripeaks";
traditionalStock = false;
rectangularTableau = false;
wizardDecks = 1;
maxScore = 28;

window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 10; x++) {
			if (y % 2 == 0) {
				leftPos = (x + 0.5) * COLUMN_WIDTH;
			} else {
				leftPos = x * COLUMN_WIDTH;
			}
			topPos = y * FANNING_Y;
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
			
			addEvent(divFrag, "click", playCard, false);
			tableauPanel.appendChild(divFrag);
		}
	}
	
	// Create stock pile
	for (var i = 0; i < 8; i++) {
		leftPos = 0 + i;
		topPos = 140 + (3 * FANNING_Y) + i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		
		addEvent(divFrag, "click", dealStock, false);
		tableauPanel.appendChild(divFrag);
	}
	
	// Create waste pile
	for (var i = 0; i < 52; i++) {
		leftPos = COLUMN_WIDTH + Math.floor(i/3);
		topPos = 140 + (3 * FANNING_Y) + Math.floor(i/3);

		createDivFrag("waste"+i,leftPos,topPos,i); 
		divFrag.style.cursor = "";
		tableauPanel.appendChild(divFrag);
	}

	resizeHeight();
	loadSoundEffects();
	newGame(true,true);
}

// Victory conditions
	
function endingCheck() {
	var movesPossible = false, imgRef;
	if (solGame.casualScore >= maxScore) {
		if (tallyStreak > longestStreak) {
			longestStreak = tallyStreak;
		}
		gameWon();
		//updateStatus("Congratulations! You've won with a longest streak of "+ longestStreak +" cards in "+ solGame.dealTime +" seconds!");
	} else if (solGame.stockRemain == 0) {
		for (var y = 0; y < 4; y++) {
			for (var x = 0; x < 10; x++) {
				if (!solGame.obstructed[x][y] && adjacentRanks(solGame.tableau[x][y],solGame.stockPile[solGame.wasteSize])) {
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
		recordMove();
		if (tallyStreak > longestStreak) {
			longestStreak = tallyStreak;
		}
		tallyStreak = 0;

		solGame.wasteSize++;
		solGame.stockPile[solGame.wasteSize] = assignSeedCard();
		solGame.stockRemain--;
		
		playSound(cardDown);
		updateStatus("&emsp;");
		renderPlayarea();
		endingCheck();
	}
}

// Checks for adjacent ranks

function adjacentRanks(objA, objB) {
	var outcome = false;
	
	if (objA && objB) {
		if (getRank(objA) == getRank(objB) - 1) {
			outcome = true;
		}

		if (getRank(objA) == getRank(objB) + 1) {
			outcome = true;
		}
		
		if (getRank(objA) + getRank(objB) == 12 && (getRank(objB) == 12 || getRank(objB) == 0)) {
			outcome = true;
		}
	}
	
	return outcome;
}

// Play a card. The foundation pile is built up or down regardless of suit, with King-Ace wrapping

function playCard(x, y) {
	var imgRef, compareA, compareB, downRefA, downRefB;
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
		} else if (solGame.obstructed[x][y]) {
			updateStatus("Only fully exposed cards are playable.");
		} else if (adjacentRanks(solGame.tableau[x][y],solGame.stockPile[solGame.wasteSize])) {
			recordMove();
			solGame.wasteSize++;
			solGame.stockPile[solGame.wasteSize] = solGame.tableau[x][y];

			solGame.tableau[x][y] = null;
			solGame.casualScore++;
			
			playSound(scoreCard);
			tallyStreak++;

			if (y > 0) {
				if (y % 2 == 1) {
					compareA = x - 1;
				} else {
					compareA = x;
				}
				compareB = compareA + 1;
				
				if (compareA < 0)  {
					compareA = null;
				}

				if (compareB > 9)  {
					compareB = null;
				}
				
				if (compareA != null && solGame.tableau[compareA][y-1] != null) {
					downRefA = document.getElementById("x" + compareA + "y" + parseInt(y - 1));
				}
				
				if (compareB != null && solGame.tableau[compareB][y-1] != null) {
					downRefB = document.getElementById("x" + compareB + "y" + parseInt(y - 1));
				}
				
				if (x > 0) {
					if (!solGame.tableau[x-1][y] && downRefA) {
						solGame.obstructed[compareA][y-1] = 0;
					}
				} else if (downRefA) {
					solGame.obstructed[compareA][y-1] = 0;
				}
				
				if (y > 1) {
					solGame.obstructed[x][y-2] = 1;
				}
				
				if (x < 9) {
					if (!solGame.tableau[x+1][y] && downRefB) {
						solGame.obstructed[compareB][y-1] = 0;
					}
				} else if (downRefB) {
					solGame.obstructed[compareB][y-1] = 0;
				}
				
				updateStatus("&emsp;");
			} else {
				updateStatus("Peak cleared!");
			}
	
			renderPlayarea();
			endingCheck();
		} else {
			updateStatus("Invalid move. Build up or down regardless of suit. Wrapping enabled");
		}
	} catch(err) {
		throwError(err);
	}
}

// Starts a new game

function newGame(greetings, newSeed) {
	var imgRef, dealIt, message, passInvalid;
	
	passInvalid = false;
	oldPassword = seedPassword;
	
	try {
		if (newSeed) {
			message = "Abort this game and start a new game?";
		} else {
			message = "Inputting in a password will end this game. Confirm?";
		}
	
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
			tallyStreak = 0;
			longestStreak = 0;
			cardsDealt = 0;
			resetInternals();
			playDeck = new solDeck(1);
			if (newSeed) {
				shuffleDeck(1);
			} else if (!readPass(1)) {
				passInvalid = true;
				shuffleDeck(1);
			}
         
			for (var y = 0; y < 4; y++) {
				for (var x = 0; x < 10; x++) {
					dealIt = false;
					switch (y) {
						case 0:
							if (x % 3 == 1) {
								dealIt = true;
							}
							break;
						case 1:
							if (x % 3 != 0) {
								dealIt = true;
							}
							break;
						case 2:
							if (x < 9) {
								dealIt = true;
							}
							break;
						default:
							dealIt = true;
					}
					
					if (dealIt) {
						solGame.tableau[x][y] = assignSeedCard();
						solGame.obstructed[x][y] = Math.min(3 - y, 2);
					}
				}
			}
			
			solGame.wasteSize = 0;
			solGame.stockPile[solGame.wasteSize] = assignSeedCard();
			solGame.stockRemain = 23;
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to TriPeaks Solitaire.");
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

function customRender() {
	for (var y = 0; y < 4; y++) {
		for (var x = 0; x < 10; x++) {
			divRef = document.getElementById("x" + x + "y" + y);
			if (y == 0 && !solGame.tableau[x][y]) {
				renderDiv(divRef,"invis");
			}
			
			if (solGame.tableau[x][y] && solGame.obstructed[x][y] > 0) {
				divRef.innerHTML = "";
				if (facedownHints > 2 || (solGame.obstructed[x][y] == 1 && facedownHints > 1)) {
					divRef.title = "(" + solGame.tableau[x][y].nameParse() + ")";
				} else {
					divRef.title = "Face-down card";
				}
			}
		}
	}
}
