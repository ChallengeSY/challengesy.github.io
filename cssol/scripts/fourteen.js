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
maxScore = 52;

function mutateSetup() {
	for (b = 0; b < 5; b++) {
		for (a = 6; a < 12; a++) {
			reposElement("x"+a+"y"+b,(a-6)*COLUMN_WIDTH,320+b*FANNING_Y);
		}
	}
}
