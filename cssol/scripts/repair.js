baseStatFile = "repair";
// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 10;
tableauShape = 0;
tableauDepth = 10;

tableauBuilding = "downColorAlt";
tableauMovement = "builds";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 4;
prefilledReserve = 4;
deckCost = 104;

reverseRender = true;
setupApplied = false;

function customRender() {
	if (!setupApplied) {
		firstFoundation = parseInt(document.getElementById("home0").style.top);
		
		for (var y = 0; y < 104; y++) {
			for (var x = 0; x < 10; x++) {
				if (y > 21) {
					reposElement("x"+x+"y"+y,-1,-1);
				} else if (firstFoundation == 0) {
					reposElement("x"+x+"y"+y,(x+1)*COLUMN_WIDTH,140+FANNING_Y*y);
				}
			}
		}
		
		setupApplied = true;
	}
}
