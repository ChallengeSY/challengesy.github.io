var reserveReusable = 0;
var reserveStacked = null;

function playReserve(event) {
	var imgRef, selectionRef;
	var baseID, whichSlot;
	
	baseID = this.id;
	whichSlot = parseInt(baseID.substring(4,6));

	imgRef = document.getElementById(baseID);
	if (selectX >= 0 && selectX < reserveStart) {
		selectionRef = document.getElementById("x" + selectX + "y" + solGame.height[selectX]);
	} else if (selectX >= reserveStart) {
		selectionRef = document.getElementById("open" + (selectX - reserveStart));
	}

	if (!solGame.gameActive) {
		updateStatus("The game has already ended!");
	} else if (reserveStacked != null && solGame.reserveSlot[whichSlot+1] != null && !newSubRestack(whichSlot+1)) {
		updateStatus("Reserve cards must be unobstructed first before they are usable");
		skipSounds = 2;
	} else if (selectDepth > 0) {
		updateStatus("Multiple cards may not be moved to a reserve slot at once");
	} else if (solGame.reserveSlot[whichSlot] == null && reserveReusable == 0) {
		updateStatus("Manual reserve pool refilling is disabled.");
		skipSounds = 2;
	} else if (solGame.reserveSlot[whichSlot] == null && whichSlot >= reserveReusable) {
		updateStatus("Manual refilling of that reserve slot is disabled.");
		skipSounds = 2;
	} else if (selectX == -1) {
		if (solGame.reserveSlot[whichSlot] == null) {
			updateStatus("There are no cards in the empty reserve slot to interact.");
		} else if (solGame.reserveSlot[whichSlot].rank == "King" && scoringModel == "pairAdd13") {
			recordMove();
			solGame.reserveSlot[whichSlot] = null;
			solGame.casualScore++;
			
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else if (solGame.reserveSlot[whichSlot].rank == "Ace" && scoringModel == "pairAdd15") {
			recordMove();
			solGame.reserveSlot[whichSlot] = null;
			solGame.casualScore++;
			
			playSound(scoreCard);
			renderPlayarea();
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

		if (solGame.reserveSlot[whichSlot] == null) {
			recordMove();
			updateStatus("&emsp;");
			solGame.reserveSlot[whichSlot] = stockPile[solGame.wasteSize];
			deleteEntry();
			
			renderPlayarea();
		} else if (pairingGame) {
			if (pairCheck(stockPile[solGame.wasteSize],solGame.reserveSlot[whichSlot])) {
				recordMove();
				solGame.reserveSlot[whichSlot] = null;
				solGame.casualScore++;
				
				deleteEntry();
				if (scoreStockCards) {
					solGame.casualScore++;
				}
				
				playSound(cardDown);
				playSound(scoreCard);
				renderPlayarea();
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
		if (solGame.reserveSlot[whichSlot] == null) {
			recordMove();
			updateStatus("&emsp;");
			solGame.reserveSlot[whichSlot] = solGame.reserveSlot[selectX-reserveStart];
			solGame.reserveSlot[selectX-reserveStart] = null;

			playSound(cardDown);
			renderPlayarea();
		} else if (pairingGame) {
			if (pairCheck(solGame.reserveSlot[selectX-reserveStart],solGame.reserveSlot[whichSlot])) {
				recordMove();
				solGame.reserveSlot[selectX-reserveStart] = null;
				solGame.casualScore++;
				
				solGame.reserveSlot[whichSlot] = null;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
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
		if (solGame.reserveSlot[whichSlot] == null) {
			recordMove();
			updateStatus("&emsp;");
			solGame.reserveSlot[whichSlot] = solGame.tableau[selectX][solGame.height[selectX]];
			solGame.tableau[selectX][solGame.height[selectX]] = null;

			renderPlayarea();
		} else if (pairingGame) {
			if (pairCheck(solGame.tableau[selectX][solGame.height[selectX]],solGame.reserveSlot[whichSlot])) {
				recordMove();
				solGame.tableau[selectX][solGame.height[selectX]] = null;
				solGame.height[selectX]--;
				solGame.casualScore++;
				
				solGame.reserveSlot[whichSlot] = null;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
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
}

function newSubRestack(slotId) {
	for (i = 0; i < reserveStacked.length; i++) {
		if (slotId == reserveStacked[i]) {
			return true;
		}
	}
	
	return false;
}
