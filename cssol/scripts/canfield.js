var baseStatFile = "canfield";
// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("");
allowAnyBaseRank = true;
startingCards = 1;

tableauStructure = null;
tableauWidth = 4;
tableauShape = 0;
tableauDepth = 1;

tableauBuilding = "downColorAlt";
tableauMovement = "allOrNothing";
emptyPileRefills = "anyCard";
emptyAutoRefills = -1;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 3;
maxRedeals = -1;
maxReserve = 0;
reserveStacked = [0];
prefilledReserve = 13;
reserveFacedown = true;
deckCost = 17;

function mutateSetup() {
	for (var h = 0; h < 4; h++) {
		reposElement("home"+h,(3+h)*COLUMN_WIDTH,0);
	}
	
	for (var r = 0; r < 13; r++) {
		reposElement("open"+r,0.5*COLUMN_WIDTH,150+22*r);
	}
	
	for (var y = 0; y < 52; y++) {
		for (var x = 0; x < 4; x++) {
			if (y >= 13) {
				reposElement("x"+x+"y"+y,-1,-1);
			} else {
				reposElement("x"+x+"y"+y,COLUMN_WIDTH*(x+2.5),150+FANNING_Y*y);
			}
		}
	}
}
