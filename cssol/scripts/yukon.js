// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [1,6,7,8,9,10,11];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downColorAlt";
tableauMovement = "yukonStyle";
emptyPileRefills = "finalRank";
emptyAutoRefills = 0;
downturnDepth = [0,1,2,3,4,5,6];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 52;

function changeDiff(firstTime) {
	var diffSel = document.getElementById("gameDiff");
	var index = diffSel.selectedIndex;
	var selected = diffSel.options;
	
	if (firstTime) {
		solGame.difficulty = selected[index].index + 2;
	} else {
		newGame(false,true);
		
		if (solGame.totalMoves == 0) {
			solGame.difficulty = selected[index].index + 2;
			updateStatus("Difficulty successfully changed.")
		} else {
			diffSel.selectedIndex = solGame.difficulty - 2;
		}
	}

	switch (solGame.difficulty) {
		case 2:
			baseStatFile = "yukon";
			tableauBuilding = "downColorAlt";
			break;
		case 3:
			baseStatFile = "russianSol";
			tableauBuilding = "downSuit";
			break;
	}
}
