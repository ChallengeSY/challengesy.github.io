var reserveReusable = 0;
var reserveStacked = null;

function playReserve(event) {
	var imgRef, selectionRef;
	var baseID, whichSlot;
	
	try {
		baseID = this.id;
		whichSlot = parseInt(baseID.substring(4,6));

		imgRef = document.getElementById(baseID);
		if (selectX >= 0 && selectX < reserveStart) {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX >= reserveStart) {
			selectionRef = document.getElementById("open" + (selectX - reserveStart));
		}

		if (!solGame.gameActive) {
			updateStatus("The game has already ended!");
		} else if (reserveStacked != null && reserveSlot[whichSlot+1] != null && !newSubRestack(whichSlot+1)) {
			updateStatus("Reserve cards must be unobstructed first before they are usable");
			skipSounds = 2;
		} else if (selectDepth > 0) {
			updateStatus("Multiple cards may not be moved to a reserve slot at once");
		} else if (reserveSlot[whichSlot] == null && reserveReusable == 0) {
			updateStatus("Reserve slots stay empty for the rest of the game.");
			skipSounds = 2;
		} else if (reserveSlot[whichSlot] == null && whichSlot >= reserveReusable) {
			updateStatus("That reserve slot stays empty for the rest of the game.");
			skipSounds = 2;
		} else if (selectX == -1) {
			if (reserveSlot[whichSlot] == null) {
				updateStatus("You may not select an empty reserve slot.");
			} else if (reserveSlot[whichSlot].rank == "King" && wizardScoring == "pairAdd13") {
				reserveSlot[whichSlot] = null;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
				incrementMove();
				endingCheck();
			} else if (reserveSlot[whichSlot].rank == "Ace" && wizardScoring == "pairAdd15") {
				reserveSlot[whichSlot] = null;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
				incrementMove();
				endingCheck();
			} else {
				selectX = whichSlot + reserveStart;
				selectCard(document.getElementById("open" + whichSlot));
			}
		} else if (selectX == whichSlot + reserveStart)  {
			deselectCard(document.getElementById("open" + whichSlot));
			selectX = -1;
		} else if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
			deselectCard(selectionRef);

			if (reserveSlot[whichSlot] == null) {
				updateStatus("&emsp;");
				reserveSlot[whichSlot] = stockPile[solGame.wasteSize];
				deleteEntry();
				
				incrementMove();
				renderPlayarea();
			} else if (pairingGame) {
				if (pairCheck(stockPile[solGame.wasteSize],reserveSlot[whichSlot])) {
					reserveSlot[whichSlot] = null;
					solGame.casualScore++;
					
					deleteEntry();
					if (scoreStockCards) {
						solGame.casualScore++;
					}
					
					playSound(cardDown);
					playSound(scoreCard);
					renderPlayarea();
					incrementMove();
					endingCheck();
				} else {
					updateStatus("Invalid move. " + buildTxt);
				}
			} else {
				updateStatus("Invalid move. A reserve slot may not hold more than one card at a time.");
				playSound(cardDown);
			}
			selectX = -1;
		} else if (selectX >= reserveStart) {
			if (reserveSlot[whichSlot] == null) {
				updateStatus("&emsp;");
				reserveSlot[whichSlot] = reserveSlot[selectX-reserveStart];
				reserveSlot[selectX-reserveStart] = null;

				playSound(cardDown);
				incrementMove();
				renderPlayarea();
			} else if (pairingGame) {
				if (pairCheck(reserveSlot[selectX-reserveStart],reserveSlot[whichSlot])) {
					reserveSlot[selectX-reserveStart] = null;
					solGame.casualScore++;
					
					reserveSlot[whichSlot] = null;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					incrementMove();
					endingCheck();
				} else {
					updateStatus("Invalid move. " + buildTxt);
					playSound(cardDown);
				}
			} else {
				updateStatus("Invalid move. A reserve slot may not hold more than one card at a time.");
				playSound(cardDown);
			}
			selectX = -1;
			deselectCard(selectionRef);
		} else if (selectX < reserveStart) {
			if (reserveSlot[whichSlot] == null) {
				updateStatus("&emsp;");
				reserveSlot[whichSlot] = tableau[selectX][height[selectX]];
				tableau[selectX][height[selectX]] = null;

				incrementMove();
				renderPlayarea();
			} else if (pairingGame) {
				if (pairCheck(tableau[selectX][height[selectX]],reserveSlot[whichSlot])) {
					tableau[selectX][height[selectX]] = null;
					height[selectX]--;
					solGame.casualScore++;
					
					reserveSlot[whichSlot] = null;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					incrementMove();
					endingCheck();
				} else {
					updateStatus("Invalid move. " + buildTxt);
				}
			} else {
				updateStatus("Invalid move. A reserve slot may not hold more than one card at a time.");
				playSound(cardDown);
			}
			selectX = -1;
			deselectCard(selectionRef);
		}
	} catch(err) {
		throwError(err);
	}
}

function newSubRestack(slotId) {
	for (i = 0; i < reserveStacked.length; i++) {
		if (slotId == reserveStacked[i]) {
			return true;
		}
	}
	
	return false;
}
