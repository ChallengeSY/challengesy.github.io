// Wizard Engine Settings
wizardDecks = 2;
scoringModel = "buildKASpider";
setBaseRank("Ace");
startingCards = 0;

tableauStructure = [6,6,6,6,5,5,5,5,5,5];
tableauWidth = tableauStructure.length;
tableauShape = -1;
tableauDepth = Math.max(...tableauStructure);

tableauBuilding = "downAnySuit";
tableauMovement = "spiderStyle";
emptyPileRefills = "anyCard";
emptyAutoRefills = 0;
downturnDepth = [5];

stockDealTo = 3;
wasteDealBy = 1;
maxRedeals = 0;
maxReserve = 0;
prefilledReserve = 0;
deckCost = 54;

reverseRender = true;

function customRender() {
	var useSuits = [null, null];
	
	if (solGame.totalMoves <= 0) {
		changeDiff(true);
	}
	
	if (solGame.difficulty < 3) {
		for (var h = 0; h < 8; h++) {
			if (solGame.foundationPile[h]) {
				if (solGame.difficulty == 1) {
					useSuits[0] = solGame.foundationPile[h].suit;
				} else if (useSuits[getColor(solGame.foundationPile[h])] == null) {
					useSuits[getColor(solGame.foundationPile[h])] = solGame.foundationPile[h].suit;
				}

			}
		}
		
		tableauBlock: {
			for (var y = 0; y < 104; y++) {
				var emptyRow = true;
				
				for (var x = 0; x < 10; x++) {
					if (solGame.tableau[x][y]) {
						emptyRow = false;
						
						if (solGame.difficulty == 1) {
							if (useSuits[0] == null) {
								useSuits[0] = solGame.tableau[x][y].suit;
							} else {
								solGame.tableau[x][y].suit = useSuits[0];
							}
						} else if (solGame.difficulty == 2) {
							if (useSuits[getColor(solGame.tableau[x][y])] == null) {
								useSuits[getColor(solGame.tableau[x][y])] = solGame.tableau[x][y].suit;
							} else {
								solGame.tableau[x][y].suit = useSuits[getColor(solGame.tableau[x][y])];
							}
						}
					} else if (emptyRow && x == 9) {
						break tableauBlock;
					}
				}
			}
		}
	}
}

function changeDiff(firstTime) {
	var diffSel = document.getElementById("gameDiff");
	var index = diffSel.selectedIndex;
	var selected = diffSel.options;
	
	if (firstTime) {
		solGame.difficulty = selected[index].index + 1;
	} else {
		newGame(false,true);
		
		if (solGame.totalMoves == 0) {
			solGame.difficulty = selected[index].index + 1;
			updateStatus("Difficulty successfully changed.")
		} else {
			diffSel.selectedIndex = solGame.difficulty - 1;
		}
	}
	
	tableauMovement = "spiderStyle";

	switch (solGame.difficulty) {
		case 1:
			baseStatFile = "spider1";
			tableauMovement = "builds";
			break;
		case 2:
			baseStatFile = "spider2";
			break;
		case 3:
			baseStatFile = "spider";
			break;
	}
}
