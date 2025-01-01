var baseStatFile = "poker";
window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop
window.ondrop = deselectAll;

selectedCard = [null, null];
reverseRender = true;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 5; y++) {
		for (var x = 0; x < 5; x++) {
			leftPos = x * COLUMN_WIDTH;
			topPos = y * 140;
			
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
	
	if (solGame.moneyScore >= 125) {
		gameWon();
	}
}

function scoreRow(hand) {
	var handStraight = false;

	// First, sort by rank
	hand.sort((a, b) => getRankValue(a) - getRankValue(b));

	var handFlush = (hand[0].suit == hand[1].suit && hand[0].suit == hand[2].suit && hand[0].suit == hand[3].suit && hand[0].suit == hand[4].suit);

	if ((ranksAdjacent(hand[0],hand[1]) && ranksAdjacent(hand[1],hand[2]) && ranksAdjacent(hand[2],hand[3])) &&
		(ranksAdjacent(hand[3],hand[4]) || (hand[4].rank == "Ace" && hand[0].rank == "2"))) {
		handStraight = true;
	}

	if (handStraight && handFlush) {
		console.log("Straight FLush!");
		return 30;
	} else if (longestRankStreak(hand) == 4) {
		console.log("Four of a Kind");
		return 16;
	} else if (handStraight) {
		console.log("Straight");
		return 12;
	} else if (longestRankStreak(hand) == 3 && ranksMatch(hand[0],hand[1]) && ranksMatch(hand[3],hand[4])) {
		console.log("Full House");
		return 10; // Full House
	} else if (longestRankStreak(hand) == 3) {
		console.log("Three of a Kind");
		return 6;
	} else if (handFlush) {
		console.log("Flush");
		return 5;
	} else if (longestRankStreak(hand) == 2) {
		if (pairsFound(hand) == 2) {
			console.log("Two Pairs");
			return 3;
		} else {
			console.log("One Pair");
			return 1;
		}
	}

	return 0;
}

function longestRankStreak(hand) {
	var longestStreak = 0;

	for (var i = 0; i < hand.length - 1; i++) {
		var activeStreak = 0;
		for (var j = i + 1; j < hand.length; j++) {
			if (ranksMatch(hand[i],hand[j])) {
				activeStreak++;
			}
		}

		longestStreak = Math.max(longestStreak,1 + activeStreak);
	}

	return longestStreak;
}

function pairsFound(hand) {
	var pairsFound = 0;

	for (var i = 0; i < hand.length - 1; i++) {
		for (var j = i + 1; j < hand.length; j++) {
			if (ranksMatch(hand[i],hand[j])) {
				pairsFound++;
			}
		}
	}

	return pairsFound;
}

function ranksAdjacent(a, b) {
	return (getRankValue(a) - getRankValue(b) == -1);
}

function ranksMatch(a, b) {
	return (a.rank == b.rank);
}

function getRankValue(inCard) {
	switch (inCard.rank) {
		case "Ace":
			return 14;
		case "Jack":
			return 11;
		case "Queen":
			return 12;
		case "King":
			return 13;
	}

	return parseInt(inCard.rank);
}

function customRender() {
    solGame.moneyScore = 0;
	console.clear();

	for (var i = 0; i < 5; i++) {
        solGame.moneyScore += scoreRow([solGame.tableau[0][i],solGame.tableau[1][i],solGame.tableau[2][i],solGame.tableau[3][i],solGame.tableau[4][i]]);

        solGame.moneyScore += scoreRow([solGame.tableau[i][0],solGame.tableau[i][1],solGame.tableau[i][2],solGame.tableau[i][3],solGame.tableau[i][4]]);
    }

    solGame.moneyScore += scoreRow([solGame.tableau[0][0],solGame.tableau[1][1],solGame.tableau[2][2],solGame.tableau[3][3],solGame.tableau[4][4]]);
    solGame.moneyScore += scoreRow([solGame.tableau[0][4],solGame.tableau[1][3],solGame.tableau[2][2],solGame.tableau[3][1],solGame.tableau[4][0]]);

	document.getElementById("moneyScore").innerHTML = solGame.moneyScore;
	endingCheck();
}

// Play a card

function playCard(event) {
	var imgRef, selectionRef;
	var baseID, x, y;

	try {
		baseID = this.id;
		x = parseInt(baseID.substring(1,3));
		y = parseInt(baseID.substring(3,5));

		imgRef = document.getElementById(baseID);
		selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (selectX == -1) {
			selectX = x;
			selectY = y;
			
			if (selectX >= 0) {
				imgRef = document.getElementById("x" + x + "y" + y)
				selectCard(imgRef);
			}
		} else if (x == selectX && y == selectY) {
			selectionRef = document.getElementById("x" + selectX + "y" + selectY);
			deselectCard(selectionRef);

			selectX = -1;
			selectY = -1;
		} else {
            var swapCard = solGame.tableau[selectX][selectY];

            solGame.tableau[selectX][selectY] = solGame.tableau[x][y];
            solGame.tableau[x][y] = swapCard;

			playSound(cardDown);
            incrementMove();
            renderPlayarea();
        }
	} catch(err) {
		throwError(err);
	}
}

// Starts a new game

function newGame(greetings, newSeed) {
	var imgRef, passInvalid, message;
		
	if (newSeed) {
		message = "End this game and start a new game?";
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
			for (var y = 0; y < 5; y++) {
				for (var x = 0; x < 5; x++) {
					solGame.tableau[x][y] = null;
				}
			}
						
			// Sets up the tableau
			for (var y = 0; y < 5; y++) {
				for (var x = 0; x < 5; x++) {
                    solGame.tableau[x][y] = assignSeedCard();
				}
			}
			
			renderPlayarea();
			
			if (greetings) {
				updateStatus("Welcome to Poker Grid.");
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
