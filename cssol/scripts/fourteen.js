baseStatFile = "fourteen";
// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "pairAdd14";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 12;
tableauShape = 0;
tableauDepth = 5;

tableauBuilding = "none";
tableauMovement = "oneCard";
emptyPileRefills = "none";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 60;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		for (b = 0; b < 5; b++) {
			for (a = 6; a < 12; a++) {
				reposElement("x"+a+"y"+b,(a-6)*COLUMN_WIDTH,320+b*FANNING_Y);
			}
		}
		
		setupApplied = true;
	}
}

function endingCheck() {
	var movesPossible = false;
	
	if (solGame.casualScore == 52) {
		gameWon();
	} else {
		for (var x = 0; x < 12; x++) {
			for (var dx = 0; dx < 12; dx++) {
				if (x != dx && solGame.height[x] >= 0 && solGame.height[dx] >= 0) {
					if (pairCheck(solGame.tableau[x][solGame.height[x]],solGame.tableau[dx][solGame.height[dx]])) {
						movesPossible = true;
					}
				}
			}
		}
	
		if (!movesPossible) {
			noMovesLeft();
		}
	}
}
