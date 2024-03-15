window.onload = setupGame;
window.onresize = resizeHeight;
window.onkeydown = readKeyInput;

var numHands = 1, activeHand = 0, burnCard = 0, moneyMin = 1, scoreThresh = 200, moneyRequired = 0, wagerAmt = 0, moneyRaiseReq = 0, handSplit = 0;
var roundActive = false, dealerAI = 0, opposingHands = 0, shoeExhausted = false;

var handMods = [];

// Daily modifyable variables
var curUTCday = scriptTime.getUTCDay();

var numShoeDecks = ((curUTCday % 2 == 0) ? 6 : 4); // 2 extra decks are added on Tue / Thur / weekends
var dealerSoftSeventeen = (curUTCday == 0 || curUTCday == 2 || curUTCday == 5); // Hits on Soft 17s on Tue / Fri / Sun
var surrenderEnabled = (curUTCday % 3 != 0); // Surrenders are unavailable on Weds and weekends

const maxPlrHands = 20;

function setupGame() {
	var tableauPanel = document.getElementById("tableau");
	var leftPos, topPos;

	// Create tableau
	for (var y = 0; y < 10; y++) {
		for (var x = 0; x < maxPlrHands + 1; x++) {
			leftPos = (y + 2) * COLUMN_WIDTH;
			topPos = (x > 0 ? (x + 0.2) * 140 : 0);
			
			createDivFrag("x"+x+"y"+y,leftPos,topPos,x);
			divFrag.style.cursor = "default";
			tableauPanel.appendChild(divFrag);
		}
	}
	
	// Create stock pile
	for (var i = 0; i < 104; i++) {
		leftPos = i;
		topPos = i;
	
		createDivFrag("stock"+i,leftPos,topPos,i);
		divFrag.style.cursor = "default";
		tableauPanel.appendChild(divFrag);
	}
	
	if (!surrenderEnabled) {
		document.getElementById("surrender").style.display = "none";
	}
	
	solGame.moneyScore = 100;
	solGame.redeals = Infinity;
	resizeHeight();
	loadSoundEffects();
	shuffleShoe();
	customRender(false);
	document.getElementById("d"+curUTCday).style.backgroundColor = "#002000";
	updateStatus("Welcome to Blackjack. You may adjust initial bet and starting hands. Tap the <q>New Round</q> button when ready.");
}

function shuffleShoe() {
	cardsDealt = 0;
	burnCard = Math.ceil(9.75 * numShoeDecks) + Math.floor(Math.random() * 26);
	playDeck = new solDeck(numShoeDecks);
	shuffleDeck(numShoeDecks);
	
	solGame.stockRemain = numShoeDecks * 52;
}


function readKeyInput(e) {
	e = e || event;
	
	var keyPressed = e.key.toLowerCase();
	
	switch (keyPressed) {
		case "n":
			if (document.getElementById("decline")) {
				checkDealerHand(true);
			}
			break;
		case "y":
			if (document.getElementById("accept")) {
				acceptInsurance();
			}
			break;
		case " ":
			// Fall through
		case "enter":
			if (document.getElementById("continue")) {
				checkDealerHand(true);
			} else if (!document.getElementById("newRound").disabled) {
				newRound();
			}
			break;
		case "h":
			if (!document.getElementById("hit").disabled) {
				hitHand();
			}
			break;
		case "s":
			if (!document.getElementById("stand").disabled) {
				standHand();
			}
			break;
		case "d":
			if (!document.getElementById("double").disabled) {
				doubleDown();
			}
			break;
		case "p":
			if (!document.getElementById("split").disabled) {
				splitHand();
			}
			break;
		case "u":
			if (!document.getElementById("surrender").disabled) {
				surrenderHand();
			}
			break;
		case "f1":
			toggleHelp(false);
			break;
	}
}

function validateBets() {
	numHands = parseInt(document.getElementById("numHands").value);
	baseBet = parseInt(document.getElementById("bet").value);
	moneyRequired = baseBet * numHands;
	
	if (!isFinite(numHands) || numHands < 1 || numHands > maxPlrHands) {
		playSound(redealSnd);
		updateStatus("You can start with 1-"+maxPlrHands+" hands.");
		return false;
	}
	
	if (!isFinite(baseBet)) {
		playSound(redealSnd);
		updateStatus("You need to set a valid integer for a wager.");
		return false;
	} else if (baseBet < moneyMin) {
		playSound(redealSnd);
		updateStatus("Your bet must be at least $"+moneyMin+".");
		return false;
	} else if (solGame.moneyScore < moneyRequired) {
		playSound(redealSnd);
		updateStatus("You don't have enough moeny to support your bet(s).");
		return false;
	}
	
	return true;
}

function addToHand(id) {
	if (solGame.stockRemain <= 0) {
		shoeExhausted = true;
		playSound(redealSnd);
		shuffleShoe();
	}

	for (b = 0; b < 10; b++) {
		if (!tableau[id][b]) {
			tableau[id][b] = assignSeedCard();
			break;
		}
	}
	
	playSound(cardDown);
	solGame.stockRemain--;
	customRender(true);
}

function checkDealerHand(skipInsurance) {
	if (tableau[0][0].rank == "Ace" && !skipInsurance && solGame.moneyScore >= moneyRequired * 1.5) {
		offerInsurance();
	} else if (getScore(0) == 21) {
		endRound();
	} else {
		activateHand(1);
	}
}

function offerInsurance() {
	var sideBet = moneyRequired * 0.5;
	
	updateStatus("The dealer has an ace revealed. Buy insurance for $" + sideBet + "? " + addBluButton("acceptInsurance();", "Accept") + " " + addBluButton("checkDealerHand(true);", "Decline"));
}

function acceptInsurance() {
	var sideBet = moneyRequired * 0.5;
	
	if (getScore(0) == 21) {
		playSound(scoreCard);
		solGame.casualScore = solGame.casualScore + moneyRequired;
		solGame.moneyScore = solGame.moneyScore + moneyRequired;
		customRender(false);
		updateStatus("The dealer has a blackjack. You won $"+moneyRequired+" from the side bet. " + addBluButton("checkDealerHand(true);", "Continue"));
	} else {
		playSound(redealSnd);
		solGame.moneyScore = solGame.moneyScore - sideBet;
		customRender(true);
		updateStatus("The dealer does not a blackjack. You lost $"+sideBet+" from the side bet. " + addBluButton("checkDealerHand(true);", "Continue"));
	}
}

function addBluButton(onTap, txt) {
	return "<input id=\""+txt.toLowerCase()+"\" class=\"button\" type=\"button\" onclick=\""+onTap+"\" value=\""+txt+"\" />";
}

function clearHands() {
	for (var y = 0; y < 15; y++) {
		for (var x = 0; x < maxPlrHands + 1; x++) {
			tableau[x][y] = null;
		}
	}
}

function autoDeal() {
	addToHand(activeHand);
	if (activeHand == 0 && handSize(0) >= 2) {
		clearInterval(dealerAI);
		activeHand = -2;
		customRender(true);
		setTimeout(checkDealerHand, 1000, false);
	}
	
	activeHand++;
	if (activeHand > numHands) {
		activeHand = 0;
	}
	customRender(true);
}

function newRound() {
	if (validateBets()) {
		if (solGame.stockRemain < burnCard) {
			shuffleShoe();
		}
		
		shoeExhausted = false;
		
		clearHands();
		wagerAmt = parseInt(document.getElementById("bet").value);
		
		// Start a new round and disable controls
		roundActive = true;
		document.getElementById("newRound").disabled = true;
		document.getElementById("bet").readOnly = true;
		document.getElementById("numHands").readOnly = true;
		opposingHands = numHands;

		// Reset hand modifiers
		handMods = [];
		
		activeHand = 1;
		dealerAI = setInterval(autoDeal, 2250/(numHands+2));
		customRender(true);
	}
}

function activateHand(id) {
	var tableauDiv = document.getElementById("tableau");
	var rowDiv = document.getElementById("x"+id+"y0");
	moneyRaiseReq = moneyRequired + wagerAmt;
	
	activeHand = id;
	if (handSplit > 0) {
		handSplit--;
	}
	
	if (rowDiv) {
		tableauDiv.scrollTop = parseInt(rowDiv.style.top) - parseInt(tableauDiv.style.height)/2;
	}

	if (id > numHands) {
		// Player hands finished. Activate the dealer's hand
		activateHand(0);
	} else if (getScore(id) == 21) {
		// Player has a 21. Check if the hand was a split hand (those don't score Blackjacks).
		if (handSplit == 0) {
			handMods[id] = "blackjack";
			opposingHands--;
		}
		
		activateHand(id + 1);
	} else if (handSplit > 0) {
		addToHand(activeHand);
		
		if (tableau[id][0].rank == "Ace") {
			// Aces were split. Each hand split this way gets exactly two cards.
			activateHand(id + 1);
		} else {
			document.getElementById("hit").disabled = false;
			document.getElementById("stand").disabled = false;
			document.getElementById("double").disabled = (solGame.moneyScore < moneyRaiseReq);
			document.getElementById("split").disabled = (!firstTwoIdentical(id) || numHands >= maxPlrHands || solGame.moneyScore < moneyRaiseReq);
			document.getElementById("surrender").disabled = true;
		}
	} else if (id > 0) {
		document.getElementById("hit").disabled = false;
		document.getElementById("stand").disabled = false;
		document.getElementById("double").disabled = (solGame.moneyScore < moneyRaiseReq);
		document.getElementById("split").disabled = (!firstTwoIdentical(id) || numHands >= maxPlrHands || solGame.moneyScore < moneyRaiseReq);
		document.getElementById("surrender").disabled = (!surrenderEnabled || handSplit > 0);
		customRender(true);
	} else {
		document.getElementById("hit").disabled = true;
		document.getElementById("stand").disabled = true;
		document.getElementById("double").disabled = true;
		document.getElementById("split").disabled = true;
		document.getElementById("surrender").disabled = true;
		processDealerHand();
	}
}

function hitHand() {
	playSound(cardUp);
	addToHand(activeHand);
	
	if (getScore(activeHand) >= 22) {
		playSound(redealSnd);
		opposingHands--;
		activateHand(activeHand + 1);
	} else if (getScore(activeHand) >= 21) {
		playSound(scoreCard);
		standHand();
	} else {
		document.getElementById("double").disabled = true;
		document.getElementById("split").disabled = true;
		document.getElementById("surrender").disabled = true;
	}
}

function standHand() {
	activateHand(activeHand + 1);
}

function doubleDown() {
	addToHand(activeHand);
	
	if (getScore(activeHand) >= 22) {
		playSound(redealSnd);
		opposingHands--;
	}
	
	handMods[activeHand] = "double";
	moneyRequired = moneyRequired + wagerAmt;
	moneyRaiseReq = moneyRaiseReq + wagerAmt;
	activateHand(activeHand + 1);
}

function splitHand() {
	playSound(cardUp);
	moneyRequired = moneyRequired + wagerAmt;
	moneyRaiseReq = moneyRaiseReq + wagerAmt;
	numHands++;
	opposingHands++;
	
	pushHandsDown();
	
	tableau[activeHand+1][0] = tableau[activeHand][1];
	tableau[activeHand][1] = null;
	handSplit = Math.max(handSplit,1) + 1;
	
	addToHand(activeHand);
	document.getElementById("double").disabled = (solGame.moneyScore < moneyRaiseReq);
	document.getElementById("split").disabled = (!firstTwoIdentical(activeHand) || numHands >= maxPlrHands || solGame.moneyScore < moneyRaiseReq);
	document.getElementById("surrender").disabled = true;
	if (tableau[activeHand][0].rank == "Ace" || getScore(activeHand) == 21) {
		standHand();
	}
}

function pushHandsDown() {
	for (d = numHands; d > activeHand + 1; d--) {
		transferHand(d-1,d);
	}
}

function transferHand(fromSlot, toSlot) {
	for (e = 0; e < 15; e++) {
		tableau[toSlot][e] = tableau[fromSlot][e];
		tableau[fromSlot][e] = null;
	}
}

function surrenderHand() {
	handMods[activeHand] = "surrender";
	opposingHands--;
	activateHand(activeHand + 1);
}

function processDealerHand() {
	customRender(false);

	if (opposingHands > 0) {
		dealerAI = setInterval(processDealerAction, 875);
	} else {
		endRound();
	}
}

function processDealerAction() {
	var highestPlrHand = 0;
	for (i = 1; i <= numHands; i++) {
		if (getScore(i) <= 21 && handMods[i] != "blackjack" && handMods[i] != "surrender") {
			highestPlrHand = Math.max(highestPlrHand,getScore(i));
		}
	}
		
	if ((getScore(0) < 17 || (getScore(0) == 17 && handMods[0] == "soft" && dealerSoftSeventeen)) && getScore(0) <= highestPlrHand) {
		addToHand(0);
		customRender(false);
	}
	
	if ((getScore(0) >= 17 && (getScore(0) > 17 || handMods[0] != "soft" || !dealerSoftSeventeen)) || getScore(0) > highestPlrHand) {
		clearInterval(dealerAI);
		endRound();
	}
}

function endRound() {
	var netChange = 0;
	roundActive = false;
	
	for (a = 1; a <= numHands; a++) {
		if (handMods[a] == "blackjack") {
			netChange = netChange + wagerAmt * 1.5;
			solGame.moneyScore = solGame.moneyScore + wagerAmt * 1.5;
			solGame.casualScore = solGame.casualScore + wagerAmt * 1.5;
		} else if (handMods[a] == "surrender") {
			netChange = netChange - wagerAmt * 0.5;
			solGame.moneyScore = solGame.moneyScore - wagerAmt * 0.5;
		} else if ((getScore(a) < getScore(0) && getScore(0) <= 21) || getScore(a) >= 22) {
			if (handMods[a] == "double") {
				netChange = netChange - wagerAmt * 2;
				solGame.moneyScore = solGame.moneyScore - wagerAmt * 2;
			} else {
				netChange = netChange - wagerAmt;
				solGame.moneyScore = solGame.moneyScore - wagerAmt;
			}
		} else if (getScore(a) > getScore(0) || getScore(0) >= 22) {
			if (handMods[a] == "double") {
				netChange = netChange + wagerAmt * 2;
				solGame.moneyScore = solGame.moneyScore + wagerAmt * 2;
				solGame.casualScore = solGame.casualScore + wagerAmt * 2;
			} else {
				netChange = netChange + wagerAmt;
				solGame.moneyScore = solGame.moneyScore + wagerAmt;
				solGame.casualScore = solGame.casualScore + wagerAmt;
			}
		}
	}
	
	
	customRender(false);
	updateStatus("The round has concluded. ");
	appendStatus("You netted ");
	if (netChange >= 0) {
		appendStatus("$"+netChange+".");
		if (netChange > 0) {
			playSound(gameWonSnd);
		}
	} else {
		appendStatus("-$"+Math.abs(netChange)+".");
		playSound(gameLostSnd);
	}
	if (solGame.casualScore >= scoreThresh) {
		if (moneyMin <= 1) {
			moneyMin = 0;
		}
		
		while (solGame.casualScore >= scoreThresh) {
			moneyMin = moneyMin + 10;
			scoreThresh = scoreThresh + 100 * Math.ceil(moneyMin/50);
		}
		
		appendStatus("<br /><b>Warning!</b> The minimum base bet has increased to $" + moneyMin + "!");
	}
	if (solGame.moneyScore < moneyMin) {
		appendStatus("<br /><b>Game over!</b> You have ran out of money. You can tap <q>New Round</q> to restart at $100, but doing so will reset your casual score.");
		moneyMin = 1;
		scoreThresh = 200;
		solGame.moneyScore = 100;
		solGame.casualScore = 0;
	}
	if (solGame.stockRemain < burnCard) {
		appendStatus("<br /><b>Heads up!</b> The stock will be shuffled fresh next round!");
	}

	document.getElementById("newRound").disabled = false;
	document.getElementById("bet").readOnly = false;
	document.getElementById("bet").min = moneyMin;
	document.getElementById("numHands").readOnly = false;
}

function aceFound(id) {
	for (b = 0; b < 10; b++) {
		if (tableau[id][b] && tableau[id][b].rank == "Ace") {
			return true;
		}
	}
	
	return false;
}

function firstTwoIdentical(id) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1);
	
	return (rankValue[getRank(tableau[id][0])] == rankValue[getRank(tableau[id][1])]);
}

function getScore(id) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10, 1);
	var handScore = 0;
	
	for (b = 0; b < 10; b++) {
		if (tableau[id][b]) {
			handScore = handScore + rankValue[getRank(tableau[id][b])];
		}
	}
	
	if (aceFound(id) && handScore <= 11) {
		// Soft hand
		handScore = handScore + 10;
		
		if (id == 0) {
			handMods[0] = "soft";
		}
	} else if (id == 0) {
		handMods[0] = "";
	}
	
	return handScore;
}

function handSize(id) {
	for (b = 0; b < 10; b++) {
		if (!tableau[id][b]) {
			return b;
		}
	}
	
	return 10;
}

function handWon(id) {
	var outcomeSymbol = "<span class=\"red\">&#10006;</span>";
	
	if (handMods[id] != "surrender" && getScore(id) <= 21 && (getScore(id) > getScore(0) || getScore(0) >= 22 || handMods[id] == "blackjack")) {
		outcomeSymbol = "<span style=\"color: lime;\">&#10004;</span>";
	} else if (handMods[id] != "surrender" && getScore(id) <= 21 && getScore(id) == getScore(0)) {
		outcomeSymbol = "<span style=\"color: yellow;\">&#9868;</span>";
	}
	
	return "<div>\n" +
		"<div class=\"ace\" style=\"margin-top: -0.1em;\">" + outcomeSymbol + "</div>\n" + 
		"<div class=\"indexB\">" + getScore(id) + "</div>\n" + 
		"</div>\n"; 
}

function totalIndex(id) {
	return "<div>\n" +
		"<div class=\"indexB\">" + getScore(id) + "</div>\n" + 
		"</div>\n"; 
}

function customRender(hideDealerHole) {
	renderPlayarea();
	for (x = 2; x < maxPlrHands + 1; x++) {
		if (x > numHands) {
			searchElement = document.getElementById("x"+x+"y0");
			
			renderDiv(searchElement,"invis");
		}
	}
	
	for (c = 0; c <= numHands; c++) {
		if (roundActive && activeHand == c) {
			searchElement = document.getElementById("x"+c+"y"+handSize(c));
			renderDiv(searchElement,"empty hilight");
			if (handSize(c) >= 2) {
				searchElement.innerHTML = totalIndex(c);
			}
			searchElement.title = "Empty slot";
		} else if (!roundActive && handSize(c) > 0) {
			searchElement = document.getElementById("x"+c+"y"+handSize(c));
			renderDiv(searchElement,"empty");
			if (c == 0) {
				searchElement.innerHTML = totalIndex(c);
			} else {
				searchElement.innerHTML = handWon(c);

				if (handMods[c] == "surrender") {
					searchElement.title = "Hand surrendered";
				} else if (getScore(c) <= 21 && (getScore(c) > getScore(0) || getScore(0) >= 22 || (handMods[c] == "blackjack"))) {
					if (handMods[c] == "blackjack") {
						searchElement.title = "Hand won. Blackjack"
					} else if (handMods[c] == "double") {
						searchElement.title = "Hand won. Doubled down";
					} else {
						searchElement.title = "Hand won";
					}
				} else if (getScore(c) <= 21 && getScore(c) == getScore(0)) {
					if (handMods[c] == "double") {
						searchElement.title = "Hand pushed. Doubled down";
					} else {				
						searchElement.title = "Hand pushed";
					}
				} else {
					if (handMods[c] == "double") {
						searchElement.title = "Hand lost. Doubled down";
					} else {				
						searchElement.title = "Hand lost";
					}
				}
			}
		}
	}
	
	if (tableau[0][1] && hideDealerHole) {
		searchElement = document.getElementById("x0y1");
		
		renderDiv(searchElement,"play" + (tableau[0][1].deckID % 6));

		searchElement.innerHTML = "";
		searchElement.title = "Face-down card";
	}
	
	if (shoeExhausted) {
		updateStatus("The stock was exhausted in the middle of a round, and has been shuffled fresh.");
	}
}
