// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [9,8,7,6,5,4,3,2,1];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downColorAlt";
tableauMovement = "oneCard";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 2;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 7;
deckCost = 52;

function changeDiff(firstTime) {
	var diffSel = document.getElementById("gameDiff");
	var index = diffSel.selectedIndex;
	var selected = diffSel.options;
	
	var oldDiff;

	if (firstTime) {
		solGame.difficulty = selected[index].index + 2;
	} else {
		oldDiff = solGame.difficulty - 2;
		solGame.difficulty = selected[index].index + 2;
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
	switch (solGame.difficulty) {
		case 2:
			tableauStructure = [1,2,3,4,5,6,7,7,7];
			startingCards = 4;
			prefilledReserve = 6;

			baseStatFile = "raglan";
			break;
		case 3:
			tableauStructure = [9,8,7,6,5,4,3,2,1];
			startingCards = 0;
			prefilledReserve = 7;
			
			baseStatFile = "kingAlbert";
			break;
	}
}
