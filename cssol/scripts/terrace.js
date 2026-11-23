var baseStatFile = "terrace";
// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildUpColorAlt";
setBaseRank("");
allowAnyBaseRank = true;
startingCards = 0;

tableauStructure = [1,1,1,1,0,0,0,0,0];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downColorAlt";
tableauMovement = "oneCard";
emptyPileRefills = "none";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
reserveStacked = [0];
prefilledReserve = 11;
reserveTerrace = true;
deckCost = 15;

wizardDecks = 2;
maxScore = 104;

reverseRender = true;

function customRender() {
	if (solGame.casualScore > 0) {
		tableauBuilding = "downColorAlt";
		emptyAutoRefills = 1;
		stockDealTo = 0;
	} else {
		tableauBuilding = "none";
		emptyAutoRefills = 0;

		setBaseRank("");
		allowAnyBaseRank = true;
	}
}
