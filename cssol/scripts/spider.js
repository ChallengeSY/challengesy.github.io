// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildKASpider";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [6,6,6,6,5,5,5,5,5,5];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downAnySuit";
tableauMovement = "spiderStyle";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [5];

stockDealTo = 3;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 54;

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
			baseStatFile = "spider1";
			solGame.spiderCon = "downAnySuit";
			tableauMovement = "builds";
			break;
		case 2:
			baseStatFile = "spider2";
			solGame.spiderCon = "downColor";
			tableauMovement = "taranStyle";
			break;
		case 3:
			baseStatFile = "spider";
			solGame.spiderCon = "downSuit";
			tableauMovement = "spiderStyle";
			break;
	}
}
