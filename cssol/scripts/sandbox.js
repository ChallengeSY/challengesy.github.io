window.onload = setupCards;
window.onresize = resizeHeight;

wizardDecks = 1;
useJokers = [1, 1];

function setupCards() {
	var tableauPanel = document.getElementById("tableau");

	solGame.wasteSize = -1;

	for (var c = 0; c < 54; c++) {
		createDivFrag("waste"+c,(c % 13) * COLUMN_WIDTH,Math.floor(c / 13) * 140,c);
		
		divFrag.style.cursor = "default";
		// divFrag.style.translate	= "-50% -50%";
		tableauPanel.appendChild(divFrag);
	}

	for (var b = 0; b < 6; b++) {
		createDivFrag("back"+b,(7 + b) * COLUMN_WIDTH,4 * 140,0);
		divFrag.style.cursor = "default";
		divFrag.className = "card";
		innerFrag = document.createElement("div");
		innerFrag.className = "card back"+b;
		innerFrag.style.left = "0px";
		innerFrag.style.top = "0px";
		divFrag.appendChild(innerFrag);
		tableauPanel.appendChild(divFrag);
	}
	
	wasteFanned = true;
	resizeHeight();
	newGame(true, true);
}

function irandom(mini, maxi) {
	return Math.floor((Math.random() * (maxi - mini + 1)) + mini);
}

function newGame(greetings, newSeed) {
	playDeck = new solDeck(1);
	// shuffleDeck(1);
	cardsDealt = 0;

	solGame.wasteSize = -1;
	for (var w = 0; w < 54; w++) {
		solGame.stockPile[++solGame.wasteSize] = playDeck.dealCard();
	}
	
	solGame.stockRemain = 0;
	renderPlayarea();
}
