// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "noneScoreSpider";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [7,7,7,7,7,7,7];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downSuit";
tableauMovement = "yukonStyle";
emptyPileRefills = "finalRank";
emptyAutoRefills = 0;
downturnDepth = [3,3,3,3,0,0,0];

stockDealTo = 2;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 37;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		for (var d = 0; d < 5; d++) {
			reposElement("stock"+d,7*COLUMN_WIDTH+d,d);
		}
		
		for (var y = 0; y < 52; y++) {
			for (var x = 0; x < 7; x++) {
				reposElement("x"+x+"y"+y,x*COLUMN_WIDTH,FANNING_Y*y);
			}
		}
		
		setupApplied = true;
	}
}

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
			tableauStructure = [4,4,4,4,7,7,7];
			downturnDepth = [0];
			emptyAutoRefills = 3;
			stockDealTo = -1;

			baseStatFile = "chelicera";
			break;
		case 3:
			tableauStructure = [7,7,7,7,7,7,7];
			downturnDepth = [3,3,3,3,0,0,0];
			emptyAutoRefills = 0;
			stockDealTo = 2;
			
			baseStatFile = "scorpion";
			break;
	}
}

function endingCheck() {
	if (solGame.casualScore >= maxScore) {
		gameWon();
	}
}
