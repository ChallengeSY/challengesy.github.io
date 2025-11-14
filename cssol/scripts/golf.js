// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "golfUpDnAnyNowrap";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 7;
tableauShape = 0;
tableauDepth = 5;

tableauBuilding = "none";
tableauMovement = "oneCard";
emptyPileRefills = "none";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 1;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 36;

function changeDiff(firstTime) {
	if (firstTime) {
		var index = document.getElementById("gameDiff").selectedIndex;
		var selected = document.getElementById("gameDiff").options;
		
		solGame.difficulty = selected[index].index + 1;
	} else {
		newGame(false,true);
		if (solGame.totalMoves == 0) {
			var index = document.getElementById("gameDiff").selectedIndex;
			var selected = document.getElementById("gameDiff").options;
			
			solGame.difficulty = selected[index].index + 1;
			updateStatus("Difficulty successfully changed.");
		} else {
			document.getElementById("gameDiff").selectedIndex = solGame.difficulty - 1;
		}
	}

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "relaxedGolf";
			scoringModel = "golfUpDnAnyWrap";
			break;
		case 2:
			baseStatFile = "golf";
			scoringModel = "golfUpDnAnyNowrap";
			break;
		case 3:
			baseStatFile = "deadKing";
			scoringModel = "golfUpDnAnyNoking";
			break;
	}
}
