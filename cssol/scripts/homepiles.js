var finishPtr;
var KAbuild = false;
var maxScore = 52;
var foundationsReusable = false;
var advancedFoundations = false;
var buildFoundString = "";
setBaseRank("Ace");

function foundationCheck(objA, objB) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var buildLegal = false;
	
	if (objA == null && baseRank == "") {
		setBaseRank(objB.rank);
		buildLegal = true;
	}
	
	if (objA == null && objB.rank == baseRank) {
		buildLegal = true;
	}
	
	if (scoringModel == "buildUpSuit") {
		if (objA != null && objA.suit == objB.suit && 
			rankValue[getRank(objA)] + 1 ==	rankValue[getRank(objB)]) {
			buildLegal = true;
		}
		
		if (objA != null && objA.suit == objB.suit && 
			objA.rank == "King" && objB.rank == "Ace") {
			buildLegal = true;
		}
		
		buildFoundString = "by suit";
	} else if (scoringModel == "buildUpColorAlt") {
		if (objA != null && getColor(objA) != getColor(objB) && 
			rankValue[getRank(objA)] + 1 ==	rankValue[getRank(objB)]) {
			buildLegal = true;
		}
		
		if (objA != null && getColor(objA) != getColor(objB) && 
			objA.rank == "King" && objB.rank == "Ace") {
			buildLegal = true;
		}
		
		buildFoundString = "by alternating colors";
	}
	
	if (objA != null && objB.rank == baseRank) {
		buildLegal = false;
	}
	
	return buildLegal;
}

function playFoundation(event) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var selectionRef, foundationRef;
	var baseID, whichPile;
	var someMovesInvalid = false;
	
	try {
		baseID = this.id;
		whichPile = baseID.substring(4,6);
		foundationRef = document.getElementById(baseID);
		
		if (!solGame.gameActive) {
			updateStatus("The game has already ended!");
		} else if (selectX == -1) {
			if (!foundationsReusable) {
				updateStatus("Cards in the foundation piles are not reusable");
			} else if (foundationPile[whichPile] == null) {
				updateStatus("You cannot select an empty foundation pile");
			}
		} else if (scoringModel == "buildKASpider") {
			if (KAbuild) {
				if (foundationPile[whichPile] == null) {
					foundationPile[whichPile] = tableau[selectX][height[selectX]];
					for (d = 0; d < 13; d++) {
						heightRef = height[selectX] - d;
						tableau[selectX][heightRef] = null;
					}
					renderPlayarea();
					incrementMove();
					endingCheck();
					
					playSound(cardDown);
					playSound(scoreCard);
					selectDepth = 0;
					selectX = -1;
				} else {
					updateStatus("A " + finalRank + "-" + baseRank + " build must be moved to an empty foundation pile");
				}
			} else {
				for (var z = 0; z <= selectDepth; z++) {
					yRef = height[selectX] - selectDepth + z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);
					deselectCard(selectionRef);
				}
					
				updateStatus("Invalid move. Only full " + finalRank + "-" + baseRank + " builds may be moved to a foundation pile");
				
				selectDepth = 0;
				selectX = -1;
			}
		} else if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
			deselectCard(selectionRef);
			
			if (foundationCheck(foundationPile[whichPile],stockPile[solGame.wasteSize])) {

				updateStatus("&emsp;");
				foundationPile[whichPile] = stockPile[solGame.wasteSize];
				deleteEntry();
				
				incrementMove();
				solGame.casualScore++;
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				playSound(scoreCard);
			} else {
				updateStatus("Invalid move. Build up foundations "+buildFoundString+" starting with the " + baseRank);
			}
			
			selectX = -1;
			endingCheck();
		} else if (selectX >= reserveStart) {
			var reserveID = selectX - reserveStart;
		
			selectionRef = document.getElementById("open" + reserveID);
			deselectCard(selectionRef);

			if (solGame.casualScore == 0 && baseStatFile == "terrace") {
				updateStatus("Invalid move. The first card must come from the tableau.");
			} else if (foundationCheck(foundationPile[whichPile],reserveSlot[reserveID])) {
				updateStatus("&emsp;");
				foundationPile[whichPile] = reserveSlot[reserveID];
				reserveSlot[reserveID] = null;

				incrementMove();
				solGame.casualScore++;
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				playSound(scoreCard);
			} else {
				updateStatus("Invalid move. Build up foundations "+buildFoundString+" starting with the " + baseRank);
			}
			
			selectX = -1;
			endingCheck();
		} else {
			if (foundationCheck(foundationPile[whichPile],tableau[selectX][height[selectX]])) {
				for (var z = 0; z <= selectDepth; z++) {
					yRef = height[selectX] - z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);

					if (foundationCheck(foundationPile[whichPile],tableau[selectX][yRef])) {
						foundationPile[whichPile] = tableau[selectX][yRef];
						tableau[selectX][yRef] = null;
						solGame.casualScore++;
					} else {
						someMovesInvalid = true;
						break;
					}
				}

				
				tableau[selectX][height[selectX]] = null;
				
				incrementMove();
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				if (someMovesInvalid) {
					updateStatus("Some cards could not be moved to foundation pile. Build up foundations "+buildFoundString+" starting with the " + baseRank);
				}
				playSound(cardDown);
				playSound(scoreCard);
				endingCheck();
			} else {
				for (var z = 0; z <= selectDepth; z++) {
					yRef = height[selectX] - selectDepth + z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);
					deselectCard(selectionRef);
				}
				
				updateStatus("Invalid move. Build up foundations "+buildFoundString+" starting with the " + baseRank);
			}
			
			selectDepth = 0;
			selectX = -1;
			document.getElementById("casualScore").innerHTML = solGame.casualScore;
		}
	} catch(err) {
		throwError(err);
	}
}

function autoFoundation(internalSelect, whichPile) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	var selectionRef, foundationRef;
	var moveLegal = false;

	selectDepth = 0;

	try {
		selectX = internalSelect;

		foundationRef = document.getElementById("home" + whichPile);

		if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
			
			if (solGame.wasteSize < 0) {
				//Failsafe in case waste pile is empty
			} else if (foundationCheck(foundationPile[whichPile],stockPile[solGame.wasteSize])) {
				updateStatus("&emsp;");
				foundationPile[whichPile] = stockPile[solGame.wasteSize];
				deleteEntry();
					
				incrementMove();
				solGame.casualScore++;
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				moveLegal = true;
			}
			
			selectX = -1;

		} else if (selectX >= reserveStart) {
			var reserveID = selectX - reserveStart;
		
			selectionRef = document.getElementById("open" + reserveID);
			
			if (!reserveSlot[reserveID]) {
				//Failsafe in case slot is empty
			} else if (foundationCheck(foundationPile[whichPile],reserveSlot[reserveID])) {
				updateStatus("&emsp;");
				foundationPile[whichPile] = reserveSlot[reserveID];
				reserveSlot[reserveID] = null;
				
				incrementMove();
				solGame.casualScore++;
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				moveLegal = true;
			}
			
			selectX = -1;

		} else {
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
			deselectCard(selectionRef);
			
			if (foundationCheck(foundationPile[whichPile],tableau[selectX][height[selectX]])) {
				updateStatus("&emsp;");
				foundationPile[whichPile] = tableau[selectX][height[selectX]];
				tableau[selectX][height[selectX]] = null;
				height[selectX]--;
				
				incrementMove();
				solGame.casualScore++;
				if (advancedFoundations) {
					customRender();
				} else {
					renderPlayarea();
				}
				moveLegal = true;
			}
			
			selectX = -1;
		}
		
		endingCheck();
		return moveLegal;
	} catch(err) {
		return false;
	}
}

function roboBuild(pileCount, reserveCount, wastePresent) {
	var breakChain = false;
	var i, success = false;
	
	try {
		for (var x = 0; x < pileCount; x++) {
			if (height[x] >= 0) {
				for (i = 0; i < 24; i++) {
					success = autoFoundation(x,i);
					
					if (success) {
						breakChain = true;
						break;
					}
				}
				
				if (breakChain) {
					break;
				}
			}
		}
		
		if (!breakChain && reserveCount > 0) {
			for (var j = 0; j < reserveCount; j++) {
				if (reserveSlot[j] && (!reserveSlot[j+1] || !reserveStacked || newSubRestack(j+1))) {
					for (i = 0; i < 24; i++) {
						success = autoFoundation(j+reserveStart,i);
						
						if (success) {
							breakChain = true;
							break;
						}
					}
				}
				
				if (breakChain) {
					break;
				}
			}
		}
		
		if (!breakChain && wastePresent) {
			for (i = 0; i < 24; i++) {
				success = autoFoundation(99,i);
				
				if (success) {
					break;
				}
			}
		}
		
		if (solGame.gameActive) {
			updateStatus("Auto-building cards...");
		}
		
		if (solGame.gameActive == false) {
			selectX = -1;
			clearInterval(finishPtr);
			finishPtr = null;
		} else if (success == false) {
			updateStatus("&emsp;");
			selectX = -1;
			clearInterval(finishPtr);
			finishPtr = null;
		}
	} catch(err) {
		selectX = -1;
		clearInterval(finishPtr);
		finishPtr = null;
		throwError(err);
	}
}

function autoFinish(numPiles, numReserve, wastePile) {
	if (scoringModel != "buildUpSuit" && scoringModel != "buildUpColorAlt") {
		updateStatus("Autobuild is available in games where foundation piles can be built up one card at a time.");
	} else if (solGame.gameActive) {
		if (baseRank == "") {
			updateStatus("At least one card must be in the Foundation piles (to set a Base Rank) before Autobuild can be used.");
		} else if (!finishPtr) {
			finishPtr = setInterval(function(){roboBuild(numPiles, numReserve, wastePile)},25);
		}
	} else {
		updateStatus("A game must be in progress before cards can be automatically moved");
	}
}

// Victory conditions

function endingCheck() {
	if (solGame.casualScore >= maxScore) {
		gameWon();
	}
}
