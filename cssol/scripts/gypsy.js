baseStatFile = "gypsy";
// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 8;
tableauShape = 0;
tableauDepth = 3;

tableauBuilding = "downColorAlt";
tableauMovement = "builds";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [2];

stockDealTo = 2;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 24;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		for (var z = 0; z < 27; z++) {
			reposElement("stock"+z,COLUMN_WIDTH*8+z,z);
		}
		
		for (var h = 0; h < 8; h++) {
			reposElement("home"+h,COLUMN_WIDTH*h,0);
		}
		
		setupApplied = true;
	}
}
