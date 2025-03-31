window.onload = setupCards;
window.onresize = resizeHeight;

function setupCards() {
	var tableauPanel = document.getElementById("tableau");

	solGame.wasteSize = -1;

	for (var c = 0; c < 52; c++) {
		createDivFrag("waste"+c,0,0,c);
		
		divFrag.style.cursor = "default";
		divFrag.style.translate	= "-50% -50%";
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
	shuffleDeck(1);
	cardsDealt = 0;

	solGame.wasteSize = -1;
	for (var w = 0; w < 52; w++) {
		getDiv = document.getElementById("waste"+w);
		if (getDiv) {
			leftPos = irandom(50,950)/10;
			topPos = irandom(100,900)/10;
			orientation = irandom(0,359);

			getDiv.style.left = leftPos+"%";
			getDiv.style.top = topPos+"%";
			getDiv.style.rotate = orientation+"deg";
		}

		solGame.wasteSize++;
		solGame.stockPile[solGame.wasteSize] = assignSeedCard();
	}
	
	solGame.stockRemain = 0;
	renderPlayarea();
}
