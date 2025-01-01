// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 8;
tableauShape = 0;
tableauDepth = 7;

tableauBuilding = "downColorAlt";
tableauMovement = "oneCard";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 4;
prefilledReserve = 0;
deckCost = 52;

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
	tableauBuilding = "downColorAlt";
	emptyPileRefills = "anyCard";
	prefilledReserve = 0;
	challengeDealing = false;
	
	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "kingcell";
			tableauBuilding = "downAnySuit";
			emptyPileRefills = "finalRank";
			break;
		case 2:
			baseStatFile = "freecell";
			break;
		case 3:
			baseStatFile = "challengeFC";
			challengeDealing = true;
			break;
		case 4:
			baseStatFile = "forecell";
			emptyPileRefills = "finalRank";
			prefilledReserve = 4;
			break;
		case 5:
			baseStatFile = "bakersGame";
			tableauBuilding = "downSuit";
			break;
		case 6:
			baseStatFile = "superFC";
			emptyPileRefills = "finalRank";
			challengeDealing = true;
			break;
	}
}
