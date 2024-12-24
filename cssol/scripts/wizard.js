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
					leftPos = i * FANNING_X;
					topPos = topPadding;

					createDivFrag("waste"+i,leftPos,topPos,i);
					autoAddEvents(divFrag);
					tableauPanel.appendChild(divFrag);
				}
				
				topPadding = topPadding + 140;
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
		// Avoid Trapdoor-related bugs in case there is no stock available
		if (stockDealTo == 3) {
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
	
	if (stockDealTo == 3 && deckCost >= maxScore) {
		stockDealTo = 0; // Invalidate Trapdoor concept; useless with no stock pile
	}
	
	if (stockDealTo == 3) {
		reserveMultiplier = 0;
		calcedReserveWidth = 0;
	} else {
		calcedReserveWidth = Math.ceil((1 - reserveMultiplier) + Math.max(maxReserve,prefilledReserve) * reserveMultiplier);
	}
	
	
	calcWidthNeeded = calcedReserveWidth + leftPadding;
	if (scoringModel != "noneScoreSpider" && !pairingGame) {
		calcWidthNeeded = calcWidthNeeded + wizardDecks*4;
	}
	
	if (Math.max(maxReserve,prefilledReserve) > 0) {
		// Create reserve slots
		for (var i = 0; i < Math.max(maxReserve,prefilledReserve); i++) {
			if (stockDealTo < 3) {
				leftPos = leftPadding * COLUMN_WIDTH + (i * reserveMultiplier * COLUMN_WIDTH);
				topPos = 0;
			} else {
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
			if (stockDealTo != 3 && (wizardDecks*4 + calcedReserveWidth > Math.max(tableauWidth + 1,screenColumns) ||
				(Math.max(maxReserve,prefilledReserve) == 0 && (calcWidthNeeded > Math.max(tableauWidth + 1,screenColumns) || deckCost >= maxScore)))) {
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
	
	if (stockDealTo == 3) {
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
	resizeHeight();
	loadSoundEffects();
	newGame(true,seriesPassword == "");
}

function dealStock() {
	var newCard;
	
	if (solGame.gameActive && selectX != 99) {
		updateStatus("&emsp;");
		if (golfGame) {
			if (solGame.stockRemain) {
				solGame.wasteSize++;
				stockPile[solGame.wasteSize] = assignSeedCard();
				solGame.stockRemain--;
				incrementMove();
				
				playSound(cardDown);
			}
			renderPlayarea();
		} else if (stockDealTo < 0) {
			updateStatus("Manual stock dealing is disabled.");
		} else if (stockDealTo < 2) {
			// Deal to waste
			if (solGame.stockRemain) {
				for (var i = 1; i <= wasteDealBy; i++) {
					if (solGame.stockRemain > 0) {
						solGame.wasteSize++;
						solGame.stockRemain--;
						incrementMove();
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
		} else {
			for (var j = 0; j < wasteDealBy; j++) {
				for (var i = 0; i < tableauWidth; i++) {
					if (solGame.stockRemain) {
						solGame.stockRemain--;
						do {
							newCard = assignSeedCard();
						} while (startingCards >= 4 && newCard.rank == baseRank);
						if (stockDealTo == 2) {
							// Deal row(s) to tableau
							tableau[i][++height[i]] = newCard;
						} else if (stockDealTo == 3) {
							// Push row(s) through the "trapdoor"
							if (reserveSlot[i]) {
								tableau[i][++height[i]] = reserveSlot[i];
							}
							reserveSlot[i] = newCard;
						}
						
						if (i == 0) {
							playSound(redealSnd);
							incrementMove();
						}
					} else if (i > 0 && stockDealTo == 3) {
						// Finish pushing the reserve once stock is exhausted
						if (reserveSlot[i]) {
							tableau[i][++height[i]] = reserveSlot[i];
						}
						reserveSlot[i] = null;
					} else {
						break;
					}
				}
			}
			renderPlayarea();
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
		stockPile[i] = stockPile[i+1];
	}
	stockPile[312] = null;
	solGame.wasteSize--;
}

function playWaste(event) {
	var divRef = document.getElementById("waste" + solGame.wasteSize);
	var selectionRef;
	if (selectX >= 0 && selectX < 49) {
		selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
	} else if (selectX >= reserveStart && selectX < 99) {
		selectionRef = document.getElementById("open" + (selectX - reserveStart));
	}

	if (solGame.gameActive == false) {
		updateStatus("The game has already ended!");
	} else if (selectX == -1) {
		if (stockPile[solGame.wasteSize].rank == "King" && scoringModel == "pairAdd13") {
			deleteEntry();
			if (scoreStockCards) {
				solGame.casualScore++;
			}
			
			playSound(scoreCard);
			renderPlayarea();
			incrementMove();
			endingCheck();
		} else if (stockPile[solGame.wasteSize].rank == "Ace" && scoringModel == "pairAdd15") {
			deleteEntry();
			if (scoreStockCards) {
				solGame.casualScore++;
			}
			
			playSound(scoreCard);
			renderPlayarea();
			incrementMove();
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
			if (pairCheck(stockPile[solGame.wasteSize],reserveSlot[selectX-reserveStart])) {
				reserveSlot[selectX-reserveStart] = null;
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
				deselectCard(selectionRef);
			}
		
			selectDepth = 0;
			selectX = -1;
		} else if (pairCheck(stockPile[solGame.wasteSize],tableau[selectX][height[selectX]])) {
			tableau[selectX][height[selectX]] = null;
			height[selectX]--;
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
			deselectCard(selectionRef);
		
			selectDepth = 0;
			selectX = -1;
		}
	} else {
		updateStatus("You may not interact with the waste pile while you have a selection")
	}
}

// Do these two cards build, according to the configuration?

function buildCheck(objA, objB, singleSuitOnly) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
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
	} else if (singleSuitOnly) {
		if ((rankValue[getRank(objA)] == rankValue[getRank(objB)] + 1 ||
			objB.rank == "King" && objA.rank == "Ace") &&
			objA.suit == objB.suit && (objB.rank != finalRank && objA.rank != baseRank)) {
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

function pairCheck(objA, objB, singleSuitOnly) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
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

// Play a card

function playCard(event) {
	// event.preventDefault();
	
	var divRef, selectionRef, yRef;
	var baseID, x, y;
	var kaBuildCombo = 0, aceSelected = false, kingSelected = false;
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);

	try {
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
			selectionRef = document.getElementById("x" + selectX + "y" + height[selectX]);
		} else if (selectX >= reserveStart && selectX < 99) {
			selectionRef = document.getElementById("open" + (selectX - reserveStart));
		} else if (selectX == 99) {
			selectionRef = document.getElementById("waste" + solGame.wasteSize);
		}
		
		if (solGame.gameActive == false) {
			updateStatus("The game has already ended!");
		} else if (y >= 0 && height[x] == -1) {
			if (selectX == -1) {
				updateStatus("There are no cards in the empty tableau pile to interact.");
				if (!golfGame) {
					skipSounds = 2;
				}
			} else if (selectX == 99)  {
				if ((stockPile[solGame.wasteSize].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard") {
					tableau[x][0] = stockPile[solGame.wasteSize];
					height[x] = 0;
					
					playSound(cardDown);
					deleteEntry();
					incrementMove();
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
				if ((reserveSlot[selectX-reserveStart].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard") {
					height[x]++;
					tableau[x][0] = reserveSlot[selectX-reserveStart];
					reserveSlot[selectX-reserveStart] = null;
					
					playSound(cardDown);
					renderPlayarea();
					incrementMove();
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
				
			} else if (canFillColumn && ((tableau[selectX][height[selectX]-selectDepth].rank == finalRank && emptyPileRefills == "finalRank") || emptyPileRefills == "anyCard")) {
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
					yRef = height[selectX] - selectDepth + z;
					selectionRef = document.getElementById("x" + selectX + "y" + yRef);
					deselectCard(selectionRef);
				}
				selectDepth = 0;
			}
			
			selectX = -1;
		} else if (selectX == -1) {
			if (golfGame) {
				if (solGame.gameActive == false) {
					updateStatus("The game has already ended!");
				} else if (y >= 0) {
					if (y < height[x]) {
						updateStatus("Only fully exposed cards are playable.");
					} else if (buildCheck(tableau[x][y],stockPile[solGame.wasteSize])) {
						solGame.wasteSize++;
						stockPile[solGame.wasteSize] = tableau[x][y];
						tableau[x][y] = null;
						solGame.casualScore++;
						incrementMove();
						
						playSound(scoreCard);
						renderPlayarea();
						endingCheck();
					} else {
						updateStatus("Invalid move. " + buildTxt);
					}
				} else {
					if (buildCheck(reserveSlot[x],stockPile[solGame.wasteSize])) {
						solGame.wasteSize++;
						stockPile[solGame.wasteSize] = reserveSlot[x];
						reserveSlot[x] = null;
						solGame.casualScore++;
						incrementMove();
						
						playSound(scoreCard);
						renderPlayarea();
						endingCheck();
					} else {
						updateStatus("Invalid move. " + buildTxt);
					}
				}
			} else {
				var freeSpace, spaceNeeded;
				selectDepth = height[x] - y;
				spaceNeeded = selectDepth + 1;
				freeSpace = (tableauMovement == "oneCard" ? 1 : Infinity);
				selectX = x;
				
				for (var k = 0; k < reserveReusable; k++) {
					if (!reserveSlot[k]) {
						freeSpace++;
					}
				}
				
				if (emptyPileRefills == "anyCard") {
					for (var m = 0; m < tableauWidth; m++) {
						if (height[m] < 0) {
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
					skipSounds = 2;
					selectDepth = 0;
					selectX = -1;
				} else if (tableau[x][y].rank == "King" && scoringModel == "pairAdd13") {
					tableau[x][y] = null;
					height[x]--;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					incrementMove();
					endingCheck();
				} else if (tableau[x][y].rank == "Ace" && scoringModel == "pairAdd15") {
					tableau[x][y] = null;
					height[x]--;
					solGame.casualScore++;
					
					playSound(scoreCard);
					renderPlayarea();
					incrementMove();
					endingCheck();
				}
				
				canFillColumn = (spaceNeeded * 2 <= freeSpace || emptyPileRefills != "anyCard");
				
				switch(tableauMovement) {
					case "yukonStyle":
						for (var j = height[x]; j > y; j--) {
							if (j <= downturn[x]) {
								updateStatus("You can select multiple cards, as long as no face-down cards are involved.");
								
								skipSounds = 2;
								selectDepth = 0;
								selectX = -1;
								break;
							}
						}
						break;
					case "spiderStyle":
						for (var j = height[x]; j > y; j--) {
							if (j <= downturn[x] || !buildCheck(tableau[x][j-1],tableau[x][j],true)) {
								updateStatus("You can select multiple cards, but only if they form a single-suit build, and that no face-down cards are involved.");
								
								skipSounds = 2;
								selectDepth = 0;
								selectX = -1;
								break;
							}
						}
						break;
					default:
						for (var j = height[x]; j > y; j--) {
							if (j <= downturn[x] || !buildCheck(tableau[x][j-1],tableau[x][j],false)) {
								if ((tableauMovement == "oneCard" && emptyPileRefills != "anyCard" && reserveReusable == 0) || tableauBuilding == "none") {
									updateStatus("Multiple cards may not be moved at once.");
								} else {
									updateStatus("You can select multiple cards, but only if they form a build, and that no face-down cards are involved.");
								}
								
								skipSounds = 2;
								selectDepth = 0;
								selectX = -1;
								break;
							}
						}
						break;
				}
				
				if (selectX >= 0) {
					for (var j = height[x]; j >= y; j--) {
						if (kaBuildCombo >= 0) {
							if ((kaBuildCombo == 0 || cardsConnected(tableau[x][j+1],tableau[x][j])) && rankValue[getRank(tableau[x][j])] == kaBuildCombo + 1) {
								kaBuildCombo++;
							} else {
								kaBuildCombo = -1;
							}
						}

						divRef = document.getElementById("x" + x + "y" + j)
						selectCard(divRef);
					}
					
					KAbuild = (kaBuildCombo == 13);
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
		} else if (selectX >= 99) {
			if (pairingGame && pairCheck(tableau[x][height[x]],stockPile[solGame.wasteSize])) {
				tableau[x][height[x]] = null;
				height[x]--;
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
			} else if (buildCheck(tableau[x][height[x]],stockPile[solGame.wasteSize])) {
				height[x]++;
				tableau[x][height[x]] = stockPile[solGame.wasteSize];
				deleteEntry();
				playSound(cardDown);
				renderPlayarea();
				incrementMove();
				endingCheck();
			} else {
				updateStatus("Invalid move. " + buildTxt);
				deselectCard(selectionRef);
			}
		
			selectDepth = 0;
			selectX = -1;
		} else if (selectX >= reserveStart) {
			if (pairingGame && pairCheck(tableau[x][height[x]],reserveSlot[selectX-reserveStart])) {
				tableau[x][height[x]] = null;
				height[x]--;
				solGame.casualScore++;
				reserveSlot[selectX-reserveStart] = null;
				solGame.casualScore++;
				
				playSound(cardDown);
				playSound(scoreCard);
				renderPlayarea();
				incrementMove();
				endingCheck();
			} else if (buildCheck(tableau[x][height[x]],reserveSlot[selectX-reserveStart])) {
				height[x]++;
				tableau[x][height[x]] = reserveSlot[selectX-reserveStart];
				reserveSlot[selectX-reserveStart] = null;
				
				playSound(cardDown);
				renderPlayarea();
				incrementMove();
				endingCheck();
			} else {
				updateStatus("Invalid move. " + buildTxt);
				deselectCard(selectionRef);
			}
		
			selectDepth = 0;
			selectX = -1;
		} else if (pairingGame && pairCheck(tableau[x][height[x]],tableau[selectX][height[selectX]])) {
			tableau[x][height[x]] = null;
			height[x]--;
			solGame.casualScore++;
			tableau[selectX][height[selectX]] = null;
			height[selectX]--;
			solGame.casualScore++;
			
			playSound(cardDown);
			playSound(scoreCard);
			renderPlayarea();
			incrementMove();
			endingCheck();
		} else if (buildCheck(tableau[x][height[x]],tableau[selectX][height[selectX]-selectDepth])) {
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
			endingCheck();
		} else {
			updateStatus("Invalid move. " + buildTxt);
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

function newGame(greetings, newSeed) {
	var imgRef, passInvalid, message, newCard, acesFound, downturnPattern;
	
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
					tableau[x][y] = null;
					downturn[x] = 0;
				}
			}
			
			//Empties out the foundation piles
			for (var i = 0; i < wizardDecks * 4; i++) {
				foundationPile[i] = null;
			}
			
			//If configured, sends the first card to the foundation pile, and sets the base rank.
			if (allowAnyBaseRank) {
				if (startingCards > 0) {
					foundationPile[0] = assignSeedCard();
					setBaseRank(foundationPile[0].rank);
					solGame.casualScore++;
					acesFound++;
				} else {
					setBaseRank("");
				}
			}
			
			// Sets up the reserve pool
			for (var i = 0; i < Math.max(maxReserve,prefilledReserve); i++) {
				if (cardsDealt < wizardDecks*52 && i < prefilledReserve) {
					newCard = assignSeedCard();
					while (startingCards >= 4 && newCard.rank == baseRank) {
						foundationPile[acesFound] = newCard;
						solGame.casualScore++;

						acesFound++;
						newCard = assignSeedCard();
					}
						
					reserveSlot[i] = newCard;
				} else {
					reserveSlot[i] = null;
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
								foundationPile[acesFound] = newCard;
								solGame.casualScore++;

								acesFound++;
								newCard = assignSeedCard();
							}
						
							tableau[x][y] = newCard;
							downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
						}
					}
				}
			} else if (tableauShape == 0) {
				//Rectangular tableau
				for (var y = 0; y < tableauDepth; y++) {
					for (var x = 0; x < tableauWidth; x++) {
						if (cardsDealt < wizardDecks*52) {
							newCard = assignSeedCard();
							while (startingCards >= 4 && newCard && newCard.rank == baseRank) {
								foundationPile[acesFound] = newCard;
								solGame.casualScore++;

								acesFound++;
								newCard = assignSeedCard();
							}
						
							tableau[x][y] = newCard;
							downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
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
								foundationPile[acesFound] = newCard;
								solGame.casualScore++;

								acesFound++;
								newCard = assignSeedCard();
							}
						
							tableau[x][y] = newCard;
							downturn[x] = Math.min(y,downturnDepth[x % downturnPattern]);
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
					stockPile[0] = assignSeedCard();
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
						foundationPile[acesFound] = newCard;
						solGame.casualScore++;
						solGame.stockRemain--;

						acesFound++;
						newCard = assignSeedCard();
					}
					stockPile[i] = newCard;
				}
			} else if (startingCards >= 4) {
				var modifyCount = 0;
				
				while (cardsDealt < wizardDecks*52 && acesFound < wizardDecks*4) {
					newCard = assignSeedCard();
					if (newCard.rank == baseRank) {
						foundationPile[acesFound] = newCard;
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
				switch (baseStatFile) {
					case "seriesPlay":
						updateStatus("Welcome to the Solitaire Series!");
						break;
					default:
						break;
				}
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
			
			if (baseStatFile == "seriesPlay") {
				saveSeriesFile(false);
			}
		}
	} catch(err) {
		throwError(err);
	}
}
