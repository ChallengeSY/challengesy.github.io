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

function reposElement(objId, newX, newY) {
	var workObj = document.getElementById(objId);
	if (workObj) {
		workObj.style.left = newX+"px";
		workObj.style.top = newY+"px";
	}
}

function customRender() {
	if (!setupApplied) {
		for (var z = 0; z < 27; z++) {
			reposElement("stock"+z,COLUMN_WIDTH*8+z,z);
		}
		
		reposElement("home7",0,0);
		
		setupApplied = true;
	}
}
