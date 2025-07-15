baseStatFile = "bakers13";
// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 13;
tableauShape = 0;
tableauDepth = 4;

tableauBuilding = "downAnySuit";
tableauMovement = "oneCard";
emptyPileRefills = "none";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 52;

forceFinalBottom = true;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		for (var h = 0; h < 4; h++) {
			reposElement("home"+h,COLUMN_WIDTH*(h+4.5),0);
		}
		
		setupApplied = true;
	}
}
