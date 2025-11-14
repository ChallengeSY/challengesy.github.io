baseStatFile = "wizard";
window.onload = setupGame;
window.onresize = resizeHeight;
window.onbeforeunload = function(event) {confirmLeave(event, "")};
window.ondragover = allowDrop;
window.ondrop = deselectAll;
var buildTxt = "";
var allowAnyBaseRank = false;
var KAbuild = false;
var deckCost = 0;
var scoreStockCards = false;
var reserveFound = 0;
var challengeDealing = false;
var forceFinalBottom = false;
seriesPassword = "";

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;
	var calcedReserveWidth = 0;
	var calcWidthNeeded = 0;
	var leftPadding = 0;
	var topPadding = 0;
	var addFoundationPadding;
	var reserveMultiplier = 1.0;
	var screenColumns = 11;
	
	maxScore = 52 * wizardDecks;
	pairingGame = (scoringModel.startsWith("pair"));
	golfGame = (scoringModel.startsWith("golf"));
	traditionalStock = (!golfGame);
	
	if (window.innerWidth) {
		var screenWidth = window.innerWidth - 20;
		
		screenColumns = Math.floor(screenWidth / COLUMN_WIDTH);
	}

	if (deckCost < maxScore) {
		// Create stock pile
		for (var i = 0; i < Math.ceil((maxScore - deckCost)/3); i++) {
			leftPos = i;
			topPos = i;
		
			createDivFrag("stock"+i,leftPos,topPos,i);
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
		
		topPadding = 140 + wizardDecks*10;
	
		if (stockDealTo == 0) {
			// Create a stacked waste pile
			for (var i = 0; i < maxScore; i++) {
				leftPos = COLUMN_WIDTH + Math.floor(i/3);
				topPos = Math.floor(i/3);

				createDivFrag("waste"+i,leftPos,topPos,i);
				autoAddEvents(divFrag);
				tableauPanel.appendChild(divFrag);
			}
			
			leftPadding = (wasteDealBy > 3 ? 3 : 2);
		} else {
			if (stockDealTo == 1) {
				wasteFanned = true;
				// Create a fanned waste pile
				for (var i = 0; i < maxScore; i++) {
					if (golfGame) {
						leftPos = COLUMN_WIDTH +  i * FANNING_X;
						topPos = 0;
					} else {
						leftPos = i * FANNING_X;
						topPos = topPadding;
					}

					createDivFrag("waste"+i,leftPos,topPos,i);
					autoAddEvents(divFrag);
					tableauPanel.appendChild(divFrag);
				}
				
				if (!golfGame) {
					topPadding = topPadding + 140;
				}
			} else {
				maxRedeals = 0;
			}

			leftPadding = 1;
		}
	} else if (golfGame) {
		// Create an empty "waste" pile
		topPadding = 140 + wizardDecks*10;
	
		if (stockDealTo == 0) {
			// Create a stacked waste pile
			for (var i = 0; i < maxScore; i++) {
				leftPos = COLUMN_WIDTH + Math.floor(i/3);
				topPos = Math.floor(i/3);

				createDivFrag("waste"+i,leftPos,topPos,i);
				autoAddEvents(divFrag);
				tableauPanel.appendChild(divFrag);
			}
			
			leftPadding = (wasteDealBy > 3 ? 3 : 2);
		} else {
			wasteFanned = true;
			// Create a fanned waste pile
			for (var i = 0; i < maxScore; i++) {
				leftPos = i * FANNING_X;
				topPos = 0;

				createDivFrag("waste"+i,leftPos,topPos,i);
				autoAddEvents(divFrag);
				tableauPanel.appendChild(divFrag);
			}
			
			leftPadding = 1;
		}
	} else {
		// Avoid Reserve-related bugs in case there is no stock available
		if (stockDealTo >= 4) {
			stockDealTo = 0;
		}
	}
	
	screenColumns -= leftPadding;
	
	try {
		reserveReusable = maxReserve;
				
		if (reserveStacked != null || (reserveReusable == 0 && prefilledReserve > 9)) {
			reserveMultiplier = FANNING_X / COLUMN_WIDTH;
		} else if (reserveReusable == 0 && prefilledReserve > 4) {
			reserveMultiplier = 0.5;
		}
	} catch(err) {
		// Blank catch. If these variables are undefined (no reserve slots at all), then we simply move on without them.
	}
	
	if (stockDealTo == 4 && deckCost >= maxScore) {
		stockDealTo = 0; // Invalidate Trapdoor concept; useless with no stock pile
	}
	
	if (stockDealTo >= 4) {
		reserveMultiplier = 0;
		calcedReserveWidth = 0;
		
		if (stockDealTo == 5) {
			reserveStacked = [0];
			
			var stackSize = Math.ceil((maxScore - deckCost) / maxReserve);
			var leftover = (maxScore - deckCost) % maxReserve;
			var stackPos = 0;
			
			for (var h = 0; h < maxReserve; h++) {
				if (leftover == 0 || h < leftover) {
					stackPos += stackSize;
				} else {
					stackPos += stackSize - 1;
				}
				
				reserveStacked.push(stackPos);
			}
			
			reserveReusable = 0;
		}
	} else {
		calcedReserveWidth = Math.ceil((1 - reserveMultiplier) + Math.max(maxReserve,prefilledReserve) * reserveMultiplier);
	}
	
	
	calcWidthNeeded = calcedReserveWidth + leftPadding;
	if (scoringModel != "noneScoreSpider" && !pairingGame) {
		calcWidthNeeded = calcWidthNeeded + wizardDecks*4;
	}
	
	if (stockDealTo == 5 && maxScore - deckCost > 0) {
		var maxSlots = maxScore - deckCost;
		reserveFound = maxSlots;
		
		for (var i = 0; i < maxSlots; i++) {
			var pool = 0;
			var depth = 0;
			
			while (pool+1 < reserveStacked.length && i >= reserveStacked[pool+1]) {
				pool++;
			}
			
			depth = i - reserveStacked[pool] ;
			leftPos = COLUMN_WIDTH * pool + depth * 2;
			topPos = topPadding + depth * 2;
			
			createDivFrag("open"+i,leftPos,topPos,"");
			divFrag.title = "Empty Reserve Slot";
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
		
		topPadding = topPadding + 140;
	} else if (Math.max(maxReserve,prefilledReserve) > 0) {
		// Create reserve slots
		for (var i = 0; i < Math.max(maxReserve,prefilledReserve); i++) {
			if (stockDealTo < 4) {
				leftPos = leftPadding * COLUMN_WIDTH + (i * reserveMultiplier * COLUMN_WIDTH);
				topPos = 0;
			} else if (stockDealTo == 4) {
				leftPos = COLUMN_WIDTH * i;
				topPos = topPadding;
			}
			
			createDivFrag("open"+i,leftPos,topPos,"");
			divFrag.title = "Empty Reserve Slot";
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}
		reserveReusable = maxReserve;
		
		if ((scoringModel == "noneScoreSpider" || pairingGame || wizardDecks*4 + calcedReserveWidth > Math.max(tableauWidth + 1,screenColumns)) &&
			deckCost >= maxScore) {
			topPadding = topPadding + 140;
		}
	} else {
		reserveReusable = 0;
	}

	if (scoringModel != "noneScoreSpider" && !pairingGame && !golfGame) {
		// Create foundation piles
		for (var i = 0; i < wizardDecks*4; i++) {
			if (stockDealTo != 4 && (wizardDecks*4 + calcedReserveWidth > Math.max(tableauWidth + 1,screenColumns) ||
				(Math.max(maxReserve,prefilledReserve,reserveFound) == 0 && (calcWidthNeeded > Math.max(tableauWidth + 1,screenColumns) || deckCost >= maxScore)))) {
				leftPos = Math.max(tableauWidth-wizardDecks*4,0);
				addFoundationPadding = true;
			} else {
				leftPos = Math.max(leftPadding,calcWidthNeeded-wizardDecks*4,tableauWidth-wizardDecks*4);
			}
			
			/* leftPos = Math.max((i + (calcWidthNeeded > tableauWidth ? 0 : leftPadding + Math.max(maxReserve,prefilledReserve))),
				tableauWidth+i-wizardDecks*4) * COLUMN_WIDTH; */
			leftPos = (i + leftPos) * COLUMN_WIDTH;
			topPos = (addFoundationPadding ? topPadding : 0);
			
			createDivFrag("home"+i,leftPos,topPos,"");
			autoAddEvents(divFrag);
			tableauPanel.appendChild(divFrag);
		}

		if (addFoundationPadding || deckCost >= maxScore) {
			topPadding = topPadding + 140;
		}
	}
	
	if (stockDealTo == 4) {
		topPadding = topPadding + 140;
	}
	
	// Create tableau
	if (tableauWidth > 0) {
		for (var y = 0; y < maxScore; y++) {
			for (var x = 0; x < tableauWidth; x++) {
				leftPos = x * COLUMN_WIDTH;
				topPos = y * FANNING_Y + topPadding;
				
				createDivFrag("x"+x+"y"+y,leftPos,topPos,y);
				autoAddEvents(divFrag);
				tableauPanel.appendChild(divFrag);
			}
		}
	}

	if (scoringModel == "buildKASpider" || scoringModel == "noneScoreSpider") {
		solGame.spiderCon = tableauBuilding;
		
		if (tableauMovement == "spiderStyle" || tableauBuilding == "dnUpSuit") {
			solGame.spiderCon = "downSuit";
		} else if (tableauMovement == "taranStyle") {
			solGame.spiderCon = "downColor";
		}
	} else if (pairingGame) {
		scoreStockCards = (stockDealTo > 1 || emptyAutoRefills > 0 || reserveReusable > 0 || emptyPileRefills == "anyCard");
		if (!scoreStockCards) {
			maxScore = Math.min(deckCost, maxScore);
		}
	} else if (golfGame) {
		maxScore = Math.min(deckCost, maxScore);
	}
	
	selectX = -1;
	try {
		// If the game has a unique setup, use its layout.
		mutateSetup();
	} catch(err) {
		// Otherwise, just stick with the standard "Wizard" layout.
	}
	try {
		changeDiff(true);
	} catch(err) {
		// Blank catch. Not all games have a difficulty system.
	}
	resizeHeight();
	loadSoundEffects();
	newGame(true,(baseStatFile != "seriesPlay" || seriesPassword == ""));
}

function reposElement(objId, newX, newY) {
	var workObj = document.getElementById(objId);
	if (workObj) {
		if (newX < 0) {
			workObj.remove();
		} else {
			workObj.style.left = newX+"px";
			workObj.style.top = newY+"px";
		}
	}
}

function dealStock() {
	var newCard;
	var emptyTableau = false;
	
	if (solGame.gameActive && selectX != 99) {
		updateStatus("&emsp;");
		for (var h = 0; h < tableauWidth; h++) {
			if (solGame.tableau[h][0] == null) {
				emptyTableau = true;
				break;
			}
		}
		
		if (golfGame) {
			if (solGame.stockRemain) {
				recordMove();
				solGame.wasteSize++;
				solGame.stockPile[solGame.wasteSize] = assignSeedCard();
				solGame.stockRemain--;
				
				playSound(cardDown);
			}
			renderPlayarea();
			endingCheck();
		} else if (stockDealTo < 0) {
			updateStatus("Manual stock dealing is disabled.");
		} else if (stockDealTo < 2) {
			if (dynamicDealCt) {
				wasteDealBy = solGame.redeals + 1;
			}
			
			// Deal to waste
			if (solGame.stockRemain) {
				for (var i = 1; i <= wasteDealBy; i++) {
					if (solGame.stockRemain > 0) {
						if (i == 1) {
							recordMove();
						}
						solGame.wasteSize++;
						solGame.stockRemain--;
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
		} else if (stockDealTo == 3 && emptyTableau) {
			if (solGame.stockRemain > 0) {
				updateStatus("A new row may not be dealt while there are empty columns.");
			}
		} else {
			for (var j = 0; j < wasteDealBy; j++) {
				if (stockDealTo < 5) {
					for (var i = 0; i < tableauWidth; i++) {
						if (solGame.stockRemain) {
							if (i == 0 && j == 0) {
								playSound(redealSnd);
								recordMove();
							}
							
							solGame.stockRemain--;
							do {
								newCard = assignSeedCard();
							} while (startingCards >= 4 && newCard.rank == baseRank);
							if (stockDealTo < 4) {
								// Deal row(s) to tableau
								solGame.tableau[i][++solGame.height[i]] = newCard;
							} else if (stockDealTo == 4) {
								// Push row(s) through the "trapdoor"
								if (solGame.reserveSlot[i]) {
									solGame.tableau[i][++solGame.height[i]] = solGame.reserveSlot[i];
								}
								solGame.reserveSlot[i] = newCard;
							}
							
						} else if (i > 0 && stockDealTo == 4) {
							// Finish pushing the reserve once stock is exhausted
							if (solGame.reserveSlot[i]) {
								solGame.tableau[i][++solGame.height[i]] = solGame.reserveSlot[i];
							}
							solGame.reserveSlot[i] = null;
						} else {
							break;
						}
					}
				} else {
					for (var i = 0; i < reserveStacked.length-1; i++) {
						if (solGame.stockRemain) {
							if (i == 0) {
								playSound(redealSnd);
								recordMove();
							}

							solGame.stockRemain--;
							do {
								newCard = assignSeedCard();
							} while (startingCards >= 4 && newCard.rank == baseRank);
							
							var h = reserveStacked[i];
							
							while (solGame.reserveSlot[h] != null) {
								h++;
							}
							
							solGame.reserveSlot[h] = newCard;
						}
					}
				}
			}
			renderPlayarea();
			endingCheck();
		}
	}
}

function quickDealStock() {
	if (solGame.stockRemain) {
		if (stockDealTo >= 0 && stockDealTo < 2) {
			solGame.wasteSize++;
			solGame.stockRemain--;
		} else {
			solGame.stockRemain--;
			do {
				newCard = assignSeedCard();
			} while (startingCards >= 4 && newCard.rank == baseRank);
			
			return newCard;
		}
	}

	return null;
}

function deleteEntry() {
	for (var i = solGame.wasteSize; i < 312; i++) {
		solGame.stockPile[i] = solGame.stockPile[i+1];
	}
	solGame.stockPile[312] = null;
	solGame.wasteSize--;
}

function playWaste(event) {
	var divRef = document.getElementById("waste" + solGame.wasteSize);
	var selectionRef;
	if (selectX >= 0 && selectX < 49) {
		selectionRef = document.getElementById("x" + selectX + "y" + solGame.height[selectX]);
	} else if (selectX >= reserveStart && selectX < 99) {
		selectionRef = document.getElementById("open" + (selectX - reserveStart));
	}

	if (solGame.gameActive == false) {
		if (baseStatFile != "seriesPlay") {
			updateStatus("The game has already ended!");
		}
	} else if (selectX == -1) {
		if (solGame.stockPile[solGame.wasteSize].rank == "King" && scoringModel == "pairAdd13") {
			recordMove();
			deleteEntry();
			if (scoreStockCards) {
				solGame.casualScore++;
			}
			
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else if (solGame.stockPile[solGame.wasteSize].rank == "Ace" && scoringModel == "pairAdd15") {
			recordMove();
			deleteEntry();
			if (scoreStockCards) {
				solGame.casualScore++;
			}
			
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else {
			selectCard(divRef);
			selectX = 99;
		}
	} else if (selectX == 99) {
		deselectCard(divRef);
		selectX = -1;
	} else if (pairingGame) {
		if (selectX >= reserveStart) {
			if (pairCheck(solGame.stockPile[solGame.wasteSize],solGame.reserveSlot[selectX-reserveStart])) {
				recordMove();
				solGame.reserveSlot[selectX-reserveStart] = null;
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
				deselectCard(selectionRef);
			}
		
			selectDepth = 0;
			selectX = -1;
		} else if (pairCheck(solGame.stockPile[solGame.wasteSize],solGame.tableau[selectX][solGame.height[selectX]])) {
			recordMove();
			solGame.tableau[selectX][solGame.height[selectX]] = null;
			solGame.height[selectX]--;
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
			deselectCard(selectionRef);
		
			selectDepth = 0;
			selectX = -1;
		}
	} else {
		updateStatus("You may not interact with the waste pile while you have a selection")
	}
}

// Do these two cards build, according to the configuration?

function buildCheck(objA, objB, auxConn) {
	var outcome = false;
	if (!pairingGame && !golfGame) {
		buildTxt = "No building on the tableau";
	}
	
	if (golfGame) {
		if (objB == null) {
			// Always take the first card, if empty
			outcome = true;
		} else {
			switch (scoringModel) {
				case "golfUpDnAnyNoking":
					buildTxt = "No building allowed on a King.";
					
					if (getRank(objB) == 11) {
						outcome = false;
						break;
					}

					// Fall through, unless a King has been found on the top of the Waste pile
				case "golfUpDnAnyNowrap":
					buildTxt = "Build up or down regardless of suit. Wrapping disabled.";
					
					if (getRank(objA) + getRank(objB) == 23) {
						outcome = false;
						break;
					}

					// Fall through, unless a King-Ace loop has been discovered
				case "golfUpDnAnyWrap":
					if (getRank(objA) == getRank(objB) - 1) {
						outcome = true;
					}
					if (getRank(objA) == getRank(objB) + 1) {
						outcome = true;
					}
					if (getRank(objA) + getRank(objB) == 12 && (getRank(objB) == 12 || getRank(objB) == 0)) {
						outcome = true;
					}
					
					if (!buildTxt.endsWith("Wrapping disabled.")) {
						buildTxt = "Build up or down regardless of suit. Wrapping enabled.";
					}
					break;
				case "golfUpAny":
					outcome = (getRank(objA) == getRank(objB) + 1 || (getRank(objA) == 0 && getRank(objB) == 12));
					buildTxt = "Build up regardless of suit. Wrapping enabled.";
					break;
			}
		}
	} else if (auxConn == "suit") {
		if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
			objB.rank == "King" && objA.rank == "Ace") &&
			objA.suit == objB.suit && (objB.rank != finalRank && objA.rank != baseRank)) {
			outcome = true;
		}
	} else if (auxConn == "color") {
		if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
			objB.rank == "King" && objA.rank == "Ace") &&
			getColor(objA) == getColor(objB) && (objB.rank != finalRank && objA.rank != baseRank)) {
			outcome = true;
		}
	} else {
		switch (tableauBuilding) {
			case "downSuit":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					(objB.rank == "King" && objA.rank == "Ace")) &&
					objA.suit == objB.suit && objB.rank != finalRank && objA.rank != baseRank) {
					outcome = true;
				}
				buildTxt = "Build down by suit.";
				break;
			case "dnUpSuit":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					rankValue[getRank(objA)] == rankValue[getRank(objB)] - 1 ||
					(objB.rank == "King" && objA.rank == "Ace") || (objB.rank == "Ace" && objA.rank == "King")) &&
					objA.suit == objB.suit) {
					outcome = true;
				}
				buildTxt = "Build up or down by suit.";
				break;
			case "downDiffSuit":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					(objB.rank == "King" && objA.rank == "Ace")) &&
					objA.suit != objB.suit && objB.rank != finalRank && objA.rank != baseRank) {
					outcome = true;
				}
				buildTxt = "Build down by any non-matching suit.";
				break;
			case "downColor":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					(objB.rank == "King" && objA.rank == "Ace")) &&
					getColor(objA) == getColor(objB) && objB.rank != finalRank && objA.rank != baseRank) {
					outcome = true;
				}
				buildTxt = "Build down by color.";
				break;
			case "downColorAlt":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					(objB.rank == "King" && objA.rank == "Ace")) &&
					getColor(objA) != getColor(objB) && objB.rank != finalRank && objA.rank != baseRank) {
					outcome = true;
				}
				buildTxt = "Build down by alternating colors.";
				break;
			case "downAnySuit":
				if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
					(objB.rank == "King" && objA.rank == "Ace")) &&
					objB.rank != finalRank && objA.rank != baseRank) {
					outcome = true;
				}
				buildTxt = "Build down regardless of suit.";
				break;
		}
	}

	return outcome;
}

// Do these two cards pair up, according to the configuration?

function pairCheck(objA, objB, auxConn) {
	var outcome = false;
	buildTxt = "";
	
	switch (scoringModel) {
		case "pairSameRank":
			if (getRank(objA) == getRank(objB)) {
				outcome = true;
			}
			buildTxt = "Remove pairs that match in rank.";
			break;
		case "pairSameSuit":
			if (getSuit(objA) == getSuit(objB)) {
				outcome = true;
			}
			buildTxt = "Remove pairs that match in suit.";
			break;
		case "pairAdd10":
			if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 10) {
				outcome = true;
			} else if (rankValue[getRank(objA)] >= 10 && rankValue[getRank(objA)] == rankValue[getRank(objB)]) {
				outcome = true;
			}
			buildTxt = "Remove pairs that add up to ten. (Tens and face cards are instead removed if they match in rank.)";
			break;
		case "pairAdd11":
			if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 11) {
				outcome = true;
			} else if (rankValue[getRank(objA)] >= 11 && rankValue[getRank(objA)] == rankValue[getRank(objB)]) {
				outcome = true;
			}
			buildTxt = "Remove pairs that add up to eleven. (Face cards are instead removed if they match in rank.)";
			break;
		case "pairAdd13":
			if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 13) {
				outcome = true;
			}
			buildTxt = "Remove pairs that add up to thirteen.";
			break;
		case "pairAdd14":
			if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 14) {
				outcome = true;
			}
			buildTxt = "Remove pairs that add up to fourteen.";
			break;
		case "pairAdd15":
			if (rankValue[getRank(objA)] + rankValue[getRank(objB)] == 15) {
				outcome = true;
			}
			buildTxt = "Remove pairs that add up to fifteen.";
			break;
	}

	return outcome;
}

// Check for victory conditions and available moves

function endingCheck() {
	if (solGame.casualScore >= maxScore) {
		gameWon();
	} else {
		var movesPossible = [0, 0];
		var moveCap = 1;
		var checkAux = null;
		if ((solGame.stockRemain > 0 || (solGame.redeals > 0 && solGame.wasteSize > 0)) && stockDealTo >= 0) {
			movesPossible[0]++;
			movesPossible[1]++;
		}
		
		for (var b = 0; b < tableauWidth; b++) {
			if (solGame.height[b] < 0) {
				if (emptyPileRefills == "anyCard") {
					movesPossible[0]++;
					movesPossible[1]++;
					moveCap = moveCap * 2;
				}
			}
		}
		
		if (tableauMovement != "oneCard") {
			moveCap = Infinity;
			
			if (tableauMovement == "taranStyle") {
				checkAux = "color";
			} else if (tableauMovement == "spiderStyle") {
				checkAux = "suit";
			}
		}
		
		if (golfGame) {
			for (var a = 0; a < tableauWidth; a++) {
				if (solGame.height[a] >= 0) {
					if (buildCheck(solGame.tableau[a][solGame.height[a]],solGame.stockPile[solGame.wasteSize])) {
						movesPossible[0]++;
						movesPossible[1]++;
					}
				}
			}
		} else if (pairingGame) {
			for (var x = 0; x < tableauWidth; x++) {
				for (var dx = 0; dx < tableauWidth; dx++) {
					if (x != dx && solGame.height[x] >= 0 && solGame.height[dx] >= 0) {
						if (pairCheck(solGame.tableau[x][solGame.height[x]],solGame.tableau[dx][solGame.height[dx]])) {
							movesPossible[0]++;
							movesPossible[1]++;
						}
					}
				}
			}
		} else {
			for (var r = 0; r < 49; r++) {
				if (solGame.reserveSlot[r] == null) {
					if (r < reserveReusable) {
						movesPossible[0]++;
						movesPossible[1]++;
						moveCap++;
					}
				} else if (reserveStacked == null || solGame.reserveSlot[r+1] == null || newSubRestack(r+1)) {
					for (var dx = 0; dx < tableauWidth; dx++) {
						if (solGame.height[dx] >= 0) {
							if (buildCheck(solGame.tableau[dx][solGame.height[dx]],solGame.reserveSlot[r])) {
								movesPossible[0]++;
								movesPossible[1]++;
							}
						} else if (emptyPileRefills == "finalRank" && solGame.reserveSlot[r].rank == finalRank) {
							movesPossible[0]++;
							movesPossible[1]++;
						}
					}
					
					if (scoringModel.startsWith("buildUp") || scoringModel == "buildKASpider") {
						for (var f = 0; f < wizardDecks*4; f++) {
							if (foundationCheck(solGame.foundationPile[f], solGame.reserveSlot[r])) {
								movesPossible[0]++;
								movesPossible[1]++;
							}
						}
					}
				}
			}

			if (solGame.wasteSize >= 0) {
				for (var w = 0; w < tableauWidth; w++) {
					if (solGame.height[w] >= 0) {
						if (buildCheck(solGame.tableau[w][solGame.height[w]],solGame.stockPile[solGame.wasteSize])) {
							movesPossible[0]++;
							movesPossible[1]++;
						}
					} else if (emptyPileRefills == "finalRank" && solGame.stockPile[solGame.wasteSize].rank == finalRank) {
						movesPossible[0]++;
						movesPossible[1]++;
					}
				}
				
				if (scoringModel.startsWith("buildUp") || scoringModel == "buildKASpider") {
					for (var f = 0; f < wizardDecks*4; f++) {
						if (foundationCheck(solGame.foundationPile[f], solGame.stockPile[solGame.wasteSize])) {
							movesPossible[0]++;
							movesPossible[1]++;
						}
					}
				}
			}

			try {
				for (var x = 0; x < tableauWidth; x++) {
					if (solGame.height[x] >= 0) {
						for (var y = solGame.height[x]; y >= solGame.downturn[x]; y--) {
							if (y == solGame.height[x] || tableauMovement == "yukonStyle" || (buildCheck(solGame.tableau[x][y],solGame.tableau[x][y+1],checkAux) && Math.abs(solGame.height[x] - y) < moveCap)) {
								for (var dx = 0; dx < tableauWidth; dx++) {
									if (x != dx) {
										if (solGame.height[dx] >= 0) {
											if (buildCheck(solGame.tableau[dx][solGame.height[dx]],solGame.tableau[x][y])) {
												movesPossible[0]++;
												
												if ((solGame.height[x] == 0 && emptyPileRefills != "anyCard") || (y > 0 && (!buildCheck(solGame.tableau[x][y-1],solGame.tableau[x][y])) || y == solGame.downturn[x])) {
													movesPossible[1]++;
												}
											}
										} else if (emptyPileRefills == "finalRank" && solGame.tableau[x][y].rank == finalRank) {
											if (y > 0) {
												movesPossible[0]++;
												movesPossible[1]++;
											}
										}
									}
								}
								
								if (validateKAcombo(x,y)) {
									movesPossible[0]++;
									movesPossible[1]++;
								}
							} else {
								break;
							}
						}
						
						if (scoringModel.startsWith("buildUp") || scoringModel == "buildKASpider") {
							for (var f = 0; f < wizardDecks*4; f++) {
								if (foundationCheck(solGame.foundationPile[f], solGame.tableau[x][solGame.height[x]])) {
									movesPossible[0]++;
									movesPossible[1]++;
								}
							}
						}
					}
				}
			} catch(err) {
				console.error("Error found at ("+x+","+y+"): "+err);
			}
		}
		
		if (movesPossible[0] <= 0) {
			noMovesLeft();
		} else if (movesPossible[1] <= 0) {
			updateStatus("Warning! There appears to be no unique moves...");
		}
	}
}

// Validates the selected (or theoretical) stack for a potential King-Ace combo
function validateKAcombo(a, b) {
	var kaBuildCombo = 0;
	
	if (scoringModel != "buildKASpider") {
		return false;
	}
	
	for (var c = solGame.height[a]; c >= b; c--) {
		if (kaBuildCombo >= 0) {
			if ((kaBuildCombo == 0 || cardsConnected(solGame.tableau[a][c+1],solGame.tableau[a][c])) && rankValue[getRank(solGame.tableau[a][c])] == kaBuildCombo + 1) {
				kaBuildCombo++;
			} else {
				kaBuildCombo = -1;
			}
		}
	}
	
	return (kaBuildCombo == 13);
}

// Play a card
function playCard(event) {
	// event.preventDefault();
	
	var divRef, selectionRef, yRef;
	var baseID, x, y;

	baseID = this.id;
	if (baseID.substring(0,4) == "open") {
		x = parseInt(baseID.substring(4,6));
		y = -1;
	} else {
		x = parseInt(baseID.substring(1,3));
		if (x < 10) {
			y = parseInt(baseID.substring(3,5));
		} else {
			y = parseInt(baseID.substring(4,6));
		}
	}

	divRef = document.getElementById(baseID);
	if (selectX >= 0 && selectX < 49) {
		selectionRef = document.getElementById("x" + selectX + "y" + solGame.height[selectX]);
	} else if (selectX >= reserveStart && selectX < 99) {
		selectionRef = document.getElementById("open" + (selectX - reserveStart));
	} else if (selectX == 99) {
		selectionRef = document.getElementById("waste" + solGame.wasteSize);
	}
	
	if (solGame.gameActive == false) {
		if (baseStatFile != "seriesPlay") {
			updateStatus("The game has already ended!");
		}
	} else if (y >= 0 && solGame.height[x] == -1) {
		if (selectX == -1) {
			updateStatus("There are no cards in the empty tableau pile to interact.");
			event.preventDefault();
			event.stopPropagation();
		} else if (selectX == 99)  {
			if ((solGame.stockPile[solGame.wasteSize].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard") {
				recordMove();
				solGame.tableau[x][0] = solGame.stockPile[solGame.wasteSize];
				solGame.height[x] = 0;
				
				playSound(cardDown);
				deleteEntry();
				renderPlayarea();
				endingCheck();
			} else {
				if (emptyPileRefills == "none") {
					updateStatus("Invalid move. Empty tableau piles may not be filled");
				} else if (finalRank == "") {
					updateStatus("Invalid move. Empty tableau piles may not be filled, while foundation piles are empty");
				} else {
					updateStatus("Invalid move. Empty tableau piles may be filled only by a " + finalRank);
				}
				deselectCard(selectionRef);
			}

		} else if (selectX >= reserveStart) {
			if ((solGame.reserveSlot[selectX-reserveStart].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard") {
				recordMove();
				solGame.height[x]++;
				solGame.tableau[x][0] = solGame.reserveSlot[selectX-reserveStart];
				solGame.reserveSlot[selectX-reserveStart] = null;
				
				playSound(cardDown);
				renderPlayarea();
				endingCheck();
			} else {
				if (emptyPileRefills == "none") {
					updateStatus("Invalid move. Empty tableau piles may not be filled");
				} else if (finalRank == "") {
					updateStatus("Invalid move. Empty tableau piles may not be filled, while foundation piles are empty");
				} else {
					updateStatus("Invalid move. Empty tableau piles may be filled only by a " + finalRank);
				}
				deselectCard(selectionRef);
			}
			
		} else if (canFillColumn && ((solGame.tableau[selectX][solGame.height[selectX]-selectDepth].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard")) {
			recordMove();
			for (var z = 0; z <= selectDepth; z++) {
				yRef = solGame.height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
			
				solGame.height[x]++;
				solGame.tableau[x][solGame.height[x]] = solGame.tableau[selectX][yRef];
				solGame.tableau[selectX][yRef] = null;
			}

			playSound(cardDown);
			renderPlayarea();
			endingCheck();
		} else {
			if (emptyPileRefills == "none") {
				updateStatus("Invalid move. Empty tableau piles may not be filled");
			} else if (finalRank == "") {
				updateStatus("Invalid move. Empty tableau piles may not be filled, while foundation piles are empty");
			} else if (!canFillColumn) {
				updateStatus("Invalid move. Movement capacity insufficient to fill an empty tableau pile");
			} else {
				updateStatus("Invalid move. Empty tableau piles may be filled only by a " + finalRank);
			}
			for (var z = 0; z <= selectDepth; z++) {
				yRef = solGame.height[selectX] - selectDepth + z;
				selectionRef = document.getElementById("x" + selectX + "y" + yRef);
				deselectCard(selectionRef);
			}
			selectDepth = 0;
		}
		
		selectX = -1;
	} else if (selectX == -1) {
		if (golfGame) {
			if (solGame.gameActive == false) {
				if (baseStatFile != "seriesPlay") {
					updateStatus("The game has already ended!");
				}
			} else if (y >= 0) {
				if (y < solGame.height[x]) {
					updateStatus("Only fully exposed cards are playable.");
				} else if (buildCheck(solGame.tableau[x][y],solGame.stockPile[solGame.wasteSize])) {
					recordMove();
					solGame.wasteSize++;
					solGame.stockPile[solGame.wasteSize] = solGame.tableau[x][y];
					solGame.tableau[x][y] = null;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					endingCheck();
				} else {
					updateStatus("Invalid move. " + buildTxt);
				}
			} else {
				if (buildCheck(solGame.reserveSlot[x],solGame.stockPile[solGame.wasteSize])) {
					recordMove();
					solGame.wasteSize++;
					solGame.stockPile[solGame.wasteSize] = solGame.reserveSlot[x];
					solGame.reserveSlot[x] = null;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					endingCheck();
				} else {
					updateStatus("Invalid move. " + buildTxt);
				}
			}
		} else {
			var freeSpace, spaceNeeded;
			selectDepth = solGame.height[x] - y;
			spaceNeeded = selectDepth + 1;
			freeSpace = (tableauMovement == "oneCard" ? 1 : Infinity);
			selectX = x;
			
			for (var k = 0; k < reserveReusable; k++) {
				if (!solGame.reserveSlot[k]) {
					freeSpace++;
				}
			}
			
			if (emptyPileRefills == "anyCard") {
				for (var m = 0; m < tableauWidth; m++) {
					if (solGame.height[m] < 0) {
						freeSpace = freeSpace * 2;
					}
				}
			}
			
			if (selectX >= 0 && spaceNeeded > freeSpace) {
				if (tableauMovement == "oneCard" && emptyPileRefills != "anyCard" && reserveReusable == 0) {
					updateStatus("Multiple cards may not be moved at once.");
				} else {
					updateStatus("That selection requires moving " + spaceNeeded + " cards. You only have enough space to move " + freeSpace + ".");
				}

				selectDepth = 0;
				selectX = -1;
				event.preventDefault();
				event.stopPropagation();
			} else if (solGame.tableau[x][y].rank == "King" && scoringModel == "pairAdd13") {
				recordMove();
				solGame.tableau[x][y] = null;
				solGame.height[x]--;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
				endingCheck();
			} else if (solGame.tableau[x][y].rank == "Ace" && scoringModel == "pairAdd15") {
				recordMove();
				solGame.tableau[x][y] = null;
				solGame.height[x]--;
				solGame.casualScore++;
				
				playSound(scoreCard);
				renderPlayarea();
				endingCheck();
			}
			
			canFillColumn = (spaceNeeded * 2 <= freeSpace || emptyPileRefills != "anyCard");
			
			switch(tableauMovement) {
				case "yukonStyle":
					for (var j = solGame.height[x]; j > y; j--) {
						if (j <= solGame.downturn[x]) {
							updateStatus("You can select multiple cards, as long as no face-down cards are involved.");
							
							selectDepth = 0;
							selectX = -1;
							event.preventDefault();
							event.stopPropagation();
							break;
						}
					}
					break;
				case "spiderStyle":
					for (var j = solGame.height[x]; j > y; j--) {
						if (j <= solGame.downturn[x] || !buildCheck(solGame.tableau[x][j-1],solGame.tableau[x][j],"suit")) {
							updateStatus("You can select multiple cards, but only if they form a single-suit build.");
							
							selectDepth = 0;
							selectX = -1;
							event.preventDefault();
							event.stopPropagation();
							break;
						}
					}
					break;
				case "taranStyle":
					for (var j = solGame.height[x]; j > y; j--) {
						if (j <= solGame.downturn[x] || !buildCheck(solGame.tableau[x][j-1],solGame.tableau[x][j],"color")) {
							updateStatus("You can select multiple cards, but only if they form a single-color build.");
							
							selectDepth = 0;
							selectX = -1;
							event.preventDefault();
							event.stopPropagation();
							break;
						}
					}
					break;
				default:
					for (var j = solGame.height[x]; j > y; j--) {
						if (j <= solGame.downturn[x] || !buildCheck(solGame.tableau[x][j-1],solGame.tableau[x][j],null)) {
							if ((tableauMovement == "oneCard" && emptyPileRefills != "anyCard" && reserveReusable == 0) || tableauBuilding == "none") {
								updateStatus("Multiple cards may not be moved at once.");
							} else {
								updateStatus("You can select multiple cards, but only if they form a build.");
							}
							
							selectDepth = 0;
							selectX = -1;
							event.preventDefault();
							event.stopPropagation();
							break;
						}
					}
					break;
			}
			
			if (selectX >= 0) {
				for (var j = solGame.height[x]; j >= y; j--) {
					divRef = document.getElementById("x" + x + "y" + j);
					selectCard(divRef);
				}
				
				KAbuild = validateKAcombo(x,y);
			}
		}
	} else if (x == selectX) {
		for (var z = 0; z <= selectDepth; z++) {
			yRef = solGame.height[selectX] - selectDepth + z;
			selectionRef = document.getElementById("x" + selectX + "y" + yRef);
			deselectCard(selectionRef);
		}

		selectDepth = 0;
		selectX = -1;
	} else if (selectX >= 99) {
		if (pairingGame && pairCheck(solGame.tableau[x][solGame.height[x]],solGame.stockPile[solGame.wasteSize])) {
			recordMove();
			solGame.tableau[x][solGame.height[x]] = null;
			solGame.height[x]--;
			solGame.casualScore++;
			
			deleteEntry();
			if (scoreStockCards) {
				solGame.casualScore++;
			}
			
			playSound(cardDown);
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else if (buildCheck(solGame.tableau[x][solGame.height[x]],solGame.stockPile[solGame.wasteSize])) {
			recordMove();
			solGame.height[x]++;
			solGame.tableau[x][solGame.height[x]] = solGame.stockPile[solGame.wasteSize];
			deleteEntry();
			
			playSound(cardDown);
			renderPlayarea();
			endingCheck();
		} else {
			updateStatus("Invalid move. " + buildTxt);
			deselectCard(selectionRef);
		}
	
		selectDepth = 0;
		selectX = -1;
	} else if (selectX >= reserveStart) {
		if (pairingGame && pairCheck(solGame.tableau[x][solGame.height[x]],solGame.reserveSlot[selectX-reserveStart])) {
			recordMove();
			solGame.tableau[x][solGame.height[x]] = null;
			solGame.height[x]--;
			solGame.casualScore++;
			solGame.reserveSlot[selectX-reserveStart] = null;
			solGame.casualScore++;
			
			playSound(cardDown);
			playSound(scoreCard);
			renderPlayarea();
			endingCheck();
		} else if (buildCheck(solGame.tableau[x][solGame.height[x]],solGame.reserveSlot[selectX-reserveStart])) {
			recordMove();
			solGame.height[x]++;
			solGame.tableau[x][solGame.height[x]] = solGame.reserveSlot[selectX-reserveStart];
			solGame.reserveSlot[selectX-reserveStart] = null;
			
			playSound(cardDown);
			renderPlayarea();
			endingCheck();
		} else {
			updateStatus("Invalid move. " + buildTxt);
			deselectCard(selectionRef);
		}
	
		selectDepth = 0;
		selectX = -1;
	} else if (pairingGame && pairCheck(solGame.tableau[x][solGame.height[x]],solGame.tableau[selectX][solGame.height[selectX]])) {
		recordMove();
		solGame.tableau[x][solGame.height[x]] = null;
		solGame.height[x]--;
		solGame.casualScore++;
		solGame.tableau[selectX][solGame.height[selectX]] = null;
		solGame.height[selectX]--;
		solGame.casualScore++;
		
		playSound(cardDown);
		playSound(scoreCard);
		renderPlayarea();
		endingCheck();
	} else if (buildCheck(solGame.tableau[x][solGame.height[x]],solGame.tableau[selectX][solGame.height[selectX]-selectDepth])) {
		recordMove();
		for (var z = 0; z <= selectDepth; z++) {
			yRef = solGame.height[selectX] - selectDepth + z;
			selectionRef = document.getElementById("x" + selectX + "y" + yRef);
		
			solGame.height[x]++;
			solGame.tableau[x][solGame.height[x]] = solGame.tableau[selectX][yRef];
			solGame.tableau[selectX][yRef] = null;
		}
		
		playSound(cardDown);
		renderPlayarea();
		endingCheck();
	} else {
		updateStatus("Invalid move. " + buildTxt);
		for (var z = 0; z <= selectDepth; z++) {
			yRef = solGame.height[selectX] - selectDepth + z;
			selectionRef = document.getElementById("x" + selectX + "y" + yRef);
			deselectCard(selectionRef);
		}
		selectDepth = 0;
		selectX = -1;
	}
}

function newGame(greetings, newSeed) {
	var imgRef, passInvalid, message, newCard, acesFound, downturnPattern;
	
	if (newSeed) {
		message = "Abort this game and start a new game?";
	} else {
		message = "Inputting in a password will end this game. Confirm?";
	}
	
	passInvalid = false;
	oldPassword = seedPassword;
	
	if (selectX != -1) {
		updateStatus("A new game may not be started while there is a card selected.");
	} else if (solGame.totalMoves == 0) {
		solGame.gameActive = false;
	} else if (solGame.gameActive && confirm(message)) {
		playSound(gameLostSnd);
		solGame.gameActive = false;
	}
	
	passField = document.getElementById("password");

	if (maxScore <= 0) {
		updateStatus("Impossible scenario detected. Deal sequence aborted.");
		
		document.getElementById("newGame").disabled = true;
		document.getElementById("restartGame").disabled = true;
	} else if (solGame.gameActive) {
		seedPassword = oldPassword;
		passField.value = seedPassword;
	} else {
		cardsDealt = 0;
		acesFound = 0;
		resetInternals();
		
		if (baseStatFile == "seriesPlay" && !newSeed) {
			passField.value = seriesPassword;
		}
		
		playDeck = new solDeck(wizardDecks);
		if (newSeed) {
			shuffleDeck(wizardDecks);
		} else if (!readPass(wizardDecks)) {
			passInvalid = true;
			shuffleDeck(wizardDecks);
		}

		// Reset tableau
		for (var y = 0; y < 52*wizardDecks; y++) {
			for (var x = 0; x < tableauWidth; x++) {
				solGame.tableau[x][y] = null;
				solGame.downturn[x] = 0;
			}
		}
		
		//Empties out the foundation piles
		for (var i = 0; i < wizardDecks * 4; i++) {
			solGame.foundationPile[i] = null;
		}
		
		//If configured, sends the first card to the foundation pile, and sets the base rank.
		if (allowAnyBaseRank) {
			if (startingCards > 0) {
				solGame.foundationPile[0] = assignSeedCard();
				setBaseRank(solGame.foundationPile[0].rank);
				solGame.casualScore++;
				acesFound++;
			} else {
				setBaseRank("");
			}
		}
		
		// Sets up the reserve pool
		reserveFound = Math.max(maxReserve,prefilledReserve,reserveFound);
		for (var i = 0; i < reserveFound; i++) {
			if (stockDealTo == 5) {
				solGame.reserveSlot[i] = null;
				
				for (var j = 0; j < reserveStacked.length; j++) {
					if (i == reserveStacked[j]) {
						newCard = assignSeedCard();
						while (startingCards >= 4 && newCard.rank == baseRank) {
							solGame.foundationPile[acesFound] = newCard;
							solGame.casualScore++;

							acesFound++;
							newCard = assignSeedCard();
						}
							
						solGame.reserveSlot[i] = newCard;
					}
				}
			} else {
				if (cardsDealt < wizardDecks*52 && i < prefilledReserve) {
					newCard = assignSeedCard();
					while (startingCards >= 4 && newCard.rank == baseRank) {
						solGame.foundationPile[acesFound] = newCard;
						solGame.casualScore++;

						acesFound++;
						newCard = assignSeedCard();
					}
						
					solGame.reserveSlot[i] = newCard;
				} else {
					solGame.reserveSlot[i] = null;
				}
			}
		}
		
		downturnPattern = downturnDepth.length;

		// Sets up the tableau
		if (tableauStructure) {
			//Custom tableau (the Override field was valid)
			for (var y = 0; y < tableauDepth; y++) {
				for (var x = 0; x < tableauWidth; x++) {
					if (cardsDealt < wizardDecks*52 && y < tableauStructure[x]) {
						newCard = assignSeedCard();
						while (startingCards >= 4 && newCard && newCard.rank == baseRank) {
							solGame.foundationPile[acesFound] = newCard;
							solGame.casualScore++;

							acesFound++;
							newCard = assignSeedCard();
						}
					
						solGame.tableau[x][y] = newCard;
						solGame.downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
					}
				}
			}
		} else if (tableauShape == 0) {
			//Rectangular tableau
			if (challengeDealing) {
				// Challenge FreeCell-like dealing
				var handicap = 0, testCard;

				for (var y = 1; y < 7; y++) {
					for (var x = 0; x < 8; x++) {
						if (cardsDealt < wizardDecks*52) {
							testCard = assignSeedCard();
							while (testCard && (getRank(testCard) < Math.ceil(tableauWidth/4) - 1 || getRank(testCard) == 12) && cardsDealt <= wizardDecks*52) {
								solGame.tableau[handicap][0] = testCard;
								testCard = assignSeedCard();
								handicap++;
							}
							
							if (testCard && cardsDealt <= wizardDecks*52) {
								solGame.tableau[x][y] = testCard;
								solGame.downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
							}
						}
					}
				}
			} else {
				// Regular dealing
				for (var y = 0; y < tableauDepth; y++) {
					for (var x = 0; x < tableauWidth; x++) {
						if (cardsDealt < wizardDecks*52) {
							newCard = assignSeedCard();
							while (startingCards >= 4 && newCard && newCard.rank == baseRank) {
								solGame.foundationPile[acesFound] = newCard;
								solGame.casualScore++;

								acesFound++;
								newCard = assignSeedCard();
							}
						
							solGame.tableau[x][y] = newCard;
							solGame.downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
						}
					}
				}
			}
		} else {
			//Triangular/Trapazoidal tableau
			for (var y = 0; y < tableauWidth+tableauDepth; y++) {
				for (var x = 0; x < tableauWidth; x++) {
					if (cardsDealt < wizardDecks*52 && y <= x + tableauDepth) {
						newCard = assignSeedCard();
						while (startingCards >= 4 && newCard && newCard.rank == baseRank) {
							solGame.foundationPile[acesFound] = newCard;
							solGame.casualScore++;

							acesFound++;
							newCard = assignSeedCard();
						}
					
						solGame.tableau[x][y] = newCard;
						solGame.downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
					}
				}
			}
		}
		
		if (forceFinalBottom) {
			//Re-arranges the tableau so that the final ranks are on the bottom, if activated
			for (var x = 0; x < tableauWidth; x++) {
				affPile = new Array();
				affCount = 0;

				// Stage 1: Tally the Final Rank cards, preserving order in the process.
				for (var y = 0; y < tableauWidth+tableauDepth; y++) {
					if (solGame.tableau[x][y]) {
						if (solGame.tableau[x][y].rank == finalRank) {
							affPile[affCount] = solGame.tableau[x][y];
							affCount++;
						}
					}
				}
				
				//Stage 2: Tally the rest of the cards, preserving order as before.
				for (var y = 0; y < tableauWidth+tableauDepth; y++) {
					if (solGame.tableau[x][y]) {
						if (solGame.tableau[x][y].rank != finalRank) {
							affPile[affCount] = solGame.tableau[x][y];
							affCount++;
						}
					}
				}
				
				//Stage 3: Apply the updated stack of cards
				for (var y = 0; y < 4; y++) {
					if (solGame.tableau[x][y]) {
						solGame.tableau[x][y] = affPile[y];
					}
				}
			}
		}
		
		//Empties out the waste pile and create a stock pile
		solGame.stockRemain = wizardDecks * 52 - cardsDealt;
		solGame.wasteSize = -1;
		if (golfGame) {
			if (solGame.stockRemain > 0) {
				solGame.wasteSize++;
				solGame.stockPile[0] = assignSeedCard();
				solGame.stockRemain--;
			}
		} else if (stockDealTo >= 0 && stockDealTo < 2) {
			if (maxRedeals < 0) {
				solGame.redeals = Infinity;
			} else {
				solGame.redeals = maxRedeals;
			}
			for (var i = 0; i < solGame.stockRemain; i++) {
				newCard = assignSeedCard();
				while (startingCards >= 4 && newCard && newCard.rank == baseRank) {
					solGame.foundationPile[acesFound] = newCard;
					solGame.casualScore++;
					solGame.stockRemain--;

					acesFound++;
					newCard = assignSeedCard();
				}
				solGame.stockPile[i] = newCard;
			}
		} else if (startingCards >= 4) {
			var modifyCount = 0;
			
			while (cardsDealt < wizardDecks*52 && acesFound < wizardDecks*4) {
				newCard = assignSeedCard();
				if (newCard.rank == baseRank) {
					solGame.foundationPile[acesFound] = newCard;
					solGame.casualScore++;
					solGame.stockRemain--;
					
					acesFound++;
					modifyCount++;
				}
			}
			
			cardsDealt = wizardDecks * 52 - solGame.stockRemain - modifyCount;
		}
		
		renderPlayarea();
		
		if (greetings) {
			var title = "";
			
			switch (baseStatFile) {
				case "seriesPlay":
					title = seriesName;
					if (seriesName.search(" ") < 0) { 
						title = title + " Solitaire";
					}
					break;
				case "8off":
					title = "Eight Off Solitaire";
					break;
				case "10across":
					title = "Ten Across Solitaire";
					break;
				case "40thieves":
					title = "Forty Thieves Solitaire";
					break;
				case "agnesBernauer":
					title = "Agnes Bernauer";
					break;
				case "agnesSorel":
					title = "Agnes Sorel";
					break;
				case "ausPat":
					title = "Australian Patience";
					break;
				case "bakers13":
					title = "Baker's Dozen Solitaire";
					break;
				case "bakersGame":
					title = "Baker's Game Solitaire";
					break;
				case "beleaguered":
					title = "Beleaguered Castle";
					break;
				case "challengeFC":
					title = "Challenge FreeCell";
					break;
				case "deadKing":
					title = "Dead King Golf";
					break;
				case "forecell":
					title = "ForeCell Solitaire";
					break;
				case "fourteen":
					title = "Fourteen Out";
					break;
				case "freecell":
					title = "FreeCell Solitaire";
					break;
				case "garden":
					title = "the Flower Garden";
					break;
				case "goldRush":
					title = "Gold Rush Solitaire";
					break;
				case "kingcell":
					title = "KingCell Solitaire";
					break;
				case "kingAlbert":
					title = "King Albert Solitaire";
					break;
				case "klondike3s":
					title = "Klondike by Threes";
					break;
				case "napoleonExile":
					title = "Napoleon's Exile";
					break;
				case "napoleonSquare":
					title = "Napoleon's Square";
					break;
				case "nwTerritory":
					title = "Northwest Territory";
					break;
				case "number12":
					title = "Number Twelve Solitaire";
					break;
				case "relaxedGolf":
					title = "Relaxed Golf Solitaire";
					break;
				case "russianSol":
					title = "Russian Solitaire";
					break;
				case "seahaven":
					title = "Seahaven Towers";
					break;
				case "spider1":
					title = "Black Widow Solitaire";
					break;
				case "spider2":
					title = "Tarantula Solitaire";
					break;
				case "simonJester":
					title = "Simon Jester";
					break;
				case "skyscraper":
					title = "Skyscraper Tower";
					break;
				case "streetsAlleys":
					title = "Streets and Alleys";
					break;
				case "superFC":
					title = "Super Challenge FreeCell";
					break;
				case "thievesEgypt":
					title = "Thieves of Egypt";
					break;
				case "wizard":
					title = "Solitaire Wizard";
					break;
				default:
					title = baseStatFile.charAt(0).toUpperCase()+baseStatFile.substring(1)+" Solitaire";
					break;
			}
			
			updateStatus("Welcome to "+title+".");
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
		
		endingCheck();
		if (baseStatFile == "seriesPlay") {
			saveSeriesFile(false);
		}
	}
}
