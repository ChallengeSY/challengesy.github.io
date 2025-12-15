// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 7;
tableauShape = 1;
tableauDepth = 0;

tableauBuilding = "downColorAlt";
tableauMovement = "builds";
emptyPileRefills = "finalRank";
emptyAutoRefills = 0;
downturnDepth = [6];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = Infinity;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 28;

function changeDiff(firstTime) {
	var diffSel = document.getElementById("gameDiff");
	var index = diffSel.selectedIndex;
	var selected = diffSel.options;
	
	var oldDiff;

	if (firstTime) {
		solGame.difficulty = selected[index].index + 1;
	} else {
		oldDiff = solGame.difficulty - 1;
		solGame.difficulty = selected[index].index + 1;
		applyDiffSpecs();
		newGame(false,true);
		
		if (solGame.totalMoves == 0) {
			updateStatus("Difficulty successfully changed.");
		} else {
			document.getElementById("gameDiff").selectedIndex = oldDiff;
		}
	}

	applyDiffSpecs();
}

function applyDiffSpecs() {
	wasteDealBy = 3;
	downturnDepth = [6];
	dynamicDealCt = false;
	maxRedeals = Infinity;
	
	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "klondike";
			wasteDealBy = 1;
			break;
		case 2:
			baseStatFile = "goldRush";
			maxRedeals = 2;
			dynamicDealCt = true;
			break;
		case 3:
			baseStatFile = "klondike3s";
			break;
		case 4:
			baseStatFile = "saratoga";
			downturnDepth = [0];
			break;
	}
}
