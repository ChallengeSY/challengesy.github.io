// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 4;

tableauStructure = null;
tableauWidth = 8;
tableauShape = 0;
tableauDepth = 7;

tableauBuilding = "downAnySuit";
tableauMovement = "oneCard";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 52;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		for (var b = 0; b < 52; b++) {
			for (var a = 0; a < tableauWidth; a++) {
				if (b >= 19) {
					reposElement("x"+a+"y"+b,-1,-1);
				} else if (a % 2 == 0) {
					reposElement("x"+a+"y"+b,(18-b)*FANNING_X,Math.floor(a/2)*140);
				} else {
					reposElement("x"+a+"y"+b,18*FANNING_X+COLUMN_WIDTH*2+b*FANNING_X,Math.floor(a/2)*140);
				}
			}
		}
		
		for (var c = 0; c < 4; c++) {
			reposElement("home"+c,18*FANNING_X+COLUMN_WIDTH,c*140);
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
	switch (solGame.difficulty) {
		case 1:
			startingCards = 4;
			baseStatFile = "beleaguered";
			break;
		case 2:
			startingCards = 0;
			baseStatFile = "streetsAlleys";
			break;
	}
}
