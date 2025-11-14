var finishPtr;
var KAbuild = false;
var maxScore = 52;
var foundationsReusable = false;
var buildFoundString = "";
setBaseRank("Ace");

function foundationCheck(objA, objB) {
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
	} else {
		return false;
	}
	
	if (objA != null && objB.rank == baseRank) {
		buildLegal = false;
	}
	
	return buildLegal;
}

function playFoundation(event) {
	var selectionRef, foundationRef;
	var baseID, whichPile;
	var someMovesInvalid = false;
	
	baseID = this.id;
	whichPile = baseID.substring(4,6);
	foundationRef = document.getElementById(baseID);
	
	if (!solGame.gameActive) {
		updateStatus("The game has already ended!");
	} else if (selectX == -1) {
		if (!foundationsReusable) {
			updateStatus("Cards in the foundation piles are not reusable");
		} else if (solGame.foundationPile[whichPile] == null) {
			updateStatus("You cannot select an empty foundation pile");
		}
	} else if (scoringModel == "buildKASpider") {
		if (KAbuild) {
			if (solGame.foundationPile[whichPile] == null) {
				recordMove();
				solGame.foundationPile[whichPile] = solGame.tableau[selectX][solGame.height[selectX]];
				for (d = 0; d < 13; d++) {
					heightRef = solGame.height[selectX] - d;
					solGame.tableau[selectX][heightRef] = null;
				}
				renderPlayarea();
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
				yRef = solGame.height[selectX] - selectDepth + z;
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
		
		if (foundationCheck(solGame.foundationPile[whichPile],solGame.stockPile[solGame.wasteSize])) {
			recordMove();
			updateStatus("&emsp;");
			solGame.foundationPile[whichPile] = solGame.stockPile[solGame.wasteSize];
			deleteEntry();
			
			solGame.casualScore++;
			renderPlayarea();
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
		} else if (foundationCheck(solGame.foundationPile[whichPile],solGame.reserveSlot[reserveID])) {
			recordMove();
			updateStatus("&emsp;");
			solGame.foundationPile[whichPile] = solGame.reserveSlot[reserveID];
			solGame.reserveSlot[reserveID] = null;

			solGame.casualScore++;
			renderPlayarea();
			playSound(scoreCard);
		} else {
			updateStatus("Invalid move. Build up foundations "+buildFoundString+" starting with the " + baseRank);
		}
		
		selectX = -1;
		endingCheck();
	} else {
		if (foundationCheck(solGame.foundationPile[whichPile],solGame.tableau[selectX][solGame.height[selectX]])) {
			recordMove();
			for (var z = 0; z <= selectDepth; z++) {
				yRef = solGame.height[selectX] - z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);

				if (foundationCheck(solGame.foundationPile[whichPile],solGame.tableau[selectX][yRef])) {
					solGame.foundationPile[whichPile] = solGame.tableau[selectX][yRef];
					solGame.tableau[selectX][yRef] = null;
					solGame.casualScore++;
				} else {
					someMovesInvalid = true;
					break;
				}
			}

			solGame.tableau[selectX][solGame.height[selectX]] = null;
			renderPlayarea();
			
			if (someMovesInvalid) {
				updateStatus("Some cards could not be moved to foundation pile. Build up foundations "+buildFoundString+" starting with the " + baseRank);
			}
			playSound(cardDown);
			playSound(scoreCard);
			endingCheck();
		} else {
			for (var z = 0; z <= selectDepth; z++) {
				yRef = solGame.height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				deselectCard(selectionRef);
			}
			
			updateStatus("Invalid move. Build up foundations "+buildFoundString+" starting with the " + baseRank);
		}
		
		selectDepth = 0;
		selectX = -1;
		document.getElementById("casualScore").innerHTML = solGame.casualScore;
	}
}

function autoFoundation(internalSelect, whichPile) {
	var selectionRef, foundationRef;
	var moveLegal = false;

	selectDepth = 0;

	selectX = internalSelect;

	foundationRef = document.getElementById("home" + whichPile);

	if (selectX == 99) {
		selectionRef = document.getElementById("waste" + solGame.wasteSize);
		
		if (solGame.wasteSize < 0) {
			//Failsafe in case waste pile is empty
		} else if (foundationCheck(solGame.foundationPile[whichPile],solGame.stockPile[solGame.wasteSize])) {
			recordMove();
			updateStatus("&emsp;");
			solGame.foundationPile[whichPile] = solGame.stockPile[solGame.wasteSize];
			deleteEntry();
				
			solGame.casualScore++;
			renderPlayarea();
			moveLegal = true;
		}
		
		selectX = -1;

	} else if (selectX >= reserveStart) {
		var reserveID = selectX - reserveStart;
	
		selectionRef = document.getElementById("open" + reserveID);
		
		if (!solGame.reserveSlot[reserveID]) {
			//Failsafe in case slot is empty
		} else if (foundationCheck(solGame.foundationPile[whichPile],solGame.reserveSlot[reserveID])) {
			recordMove();
			updateStatus("&emsp;");
			solGame.foundationPile[whichPile] = solGame.reserveSlot[reserveID];
			solGame.reserveSlot[reserveID] = null;
			
			solGame.casualScore++;
			renderPlayarea();
			moveLegal = true;
		}
		
		selectX = -1;

	} else {
		selectionRef = document.getElementById("x" + selectX + "y" + solGame.height[selectX]);
		deselectCard(selectionRef);
		
		if (foundationCheck(solGame.foundationPile[whichPile],solGame.tableau[selectX][solGame.height[selectX]])) {
			updateStatus("&emsp;");
			recordMove();
			solGame.foundationPile[whichPile] = solGame.tableau[selectX][solGame.height[selectX]];
			solGame.tableau[selectX][solGame.height[selectX]] = null;
			solGame.height[selectX]--;
			
			solGame.casualScore++;
			renderPlayarea();
			moveLegal = true;
		}
		
		selectX = -1;
	}
	
	endingCheck();
	return moveLegal;
}

function roboBuild(pileCount, reserveCount, wastePresent) {
	var i, success = false;
	
	try {
		// Prioritize the Reserve Pool *if* any slots are reusable OR if it is stacked in any way
		autoRobo: {
			if (reserveCount > 0 && (reserveReusable > 0 || reserveStacked != null)) {
				for (var j = 0; j < reserveCount; j++) {
					if (solGame.reserveSlot[j] && (!solGame.reserveSlot[j+1] || !reserveStacked || newSubRestack(j+1))) {
						for (i = 0; i < 24; i++) {
							success = autoFoundation(j+reserveStart,i);
							
							if (success) {
								break autoRobo;
							}
						}
					}
				}
			}
			
			// Waste pile comes next
			if (wastePresent) {
				for (i = 0; i < 24; i++) {
					success = autoFoundation(99,i);
					
					if (success) {
						break autoRobo;
					}
				}
			}
			
			// Tableau next
			for (var x = 0; x < pileCount; x++) {
				if (solGame.height[x] >= 0) {
					for (i = 0; i < 24; i++) {
						success = autoFoundation(x,i);
						
						if (success) {
							break autoRobo;
						}
					}
				}
			}
			
			// Reserve Pool comes last, assuming neither of the previous two conditions were met
			if (reserveCount > 0) {
				for (var j = 0; j < reserveCount; j++) {
					if (solGame.reserveSlot[j] && (!solGame.reserveSlot[j+1] || !reserveStacked || newSubRestack(j+1))) {
						for (i = 0; i < 24; i++) {
							success = autoFoundation(j+reserveStart,i);
							
							if (success) {
								break autoRobo;
							}
						}
					}
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
		console.error(err);
	}
}

function autoFinish() {
	var findObj;
	
	if (scoringModel != "buildUpSuit" && scoringModel != "buildUpColorAlt") {
		updateStatus("Autobuild is available in games where foundation piles can be built up one card at a time.");
		
		findObj = document.getElementById("autoBuild");
		if (findObj) {
			findObj.disabled = true;
		}
	} else if (solGame.gameActive) {
		if (baseRank == "") {
			updateStatus("At least one card must be in the Foundation piles (to set a Base Rank) before Autobuild can be used.");
		} else if (!finishPtr) {
			var numPiles = 0;
			var numReserve = 0;
			var wastePresent = false;
			
			for (tx = 0; tx < 49; tx++) {
				findObj = document.getElementById("x"+tx+"y0");
				
				if (findObj) {
					numPiles++;
				} else {
					break;
				}
			}
			
			for (rs = 0; rs < 48; rs++) {
				findObj = document.getElementById("open"+rs);
				
				if (findObj) {
					numReserve++;
				} else {
					break;
				}
			}
			
			if (document.getElementById("waste0")) {
				wastePresent = true;
			}
			
			finishPtr = setInterval(function(){roboBuild(numPiles, numReserve, wastePresent)},25);
		}
	} else {
		updateStatus("A game must be in progress before cards can be automatically moved");
	}
}
