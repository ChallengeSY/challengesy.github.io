baseStatFile = "thievesEgypt";
// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildUpSuit";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [1,3,5,7,9,10,8,6,4,2];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downColorAlt";
tableauMovement = "builds";
emptyPileRefills = "finalRank";
emptyAutoRefills = 0;
downturnDepth = [0];

stockDealTo = 0;
wasteDealBy = 1;
maxRedeals = 1;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 55;
