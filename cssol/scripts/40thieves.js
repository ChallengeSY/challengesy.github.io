// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 10;
tableauShape = 0;
tableauDepth = 4;

tableauBuilding = "downSuit";
tableauMovement = "oneCard";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 1;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 40;

function changeDiff(firstTime) {
	var diffSel = document.getElementById("gameDiff");
	var index = diffSel.selectedIndex;
	var selected = diffSel.options;
	
	if (firstTime) {
		solGame.difficulty = selected[index].index + 1;
	} else {
		newGame(false,true);
		
		if (solGame.totalMoves == 0) {
			solGame.difficulty = selected[index].index + 1;
			updateStatus("Difficulty successfully changed.")
		} else {
			diffSel.selectedIndex = solGame.difficulty - 1;
		}
	}

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "napoleonExile";
			tableauBuilding = "downAnySuit";
			break;
		case 2:
			baseStatFile = "40thieves";
			tableauBuilding = "downSuit";
			break;
	}
}
