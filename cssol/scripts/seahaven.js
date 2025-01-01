var baseStatFile = "seahaven";
// Wizard Engine Settings
wizardDecks = 1;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = null;
tableauWidth = 10;
tableauShape = 0;
tableauDepth = 5;

tableauBuilding = "downSuit";
tableauMovement = "oneCard";
emptyPileRefills = "finalRank";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 4;
prefilledReserve = 2;
deckCost = 52;

reverseRender = true;
setupApplied = false;

function reposElement(objId, newX, newY) {
	document.getElementById(objId).style.left = newX+"px";
	document.getElementById(objId).style.top = newY+"px";
}

function customRender() {
	if (!setupApplied) {
		reposElement("home0",0,0);
		reposElement("home1",COLUMN_WIDTH,0);
		
		reposElement("open0",COLUMN_WIDTH*4,0);
		reposElement("open1",COLUMN_WIDTH*5,0);
		reposElement("open2",COLUMN_WIDTH*6,0);
	}
}
