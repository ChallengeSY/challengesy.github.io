function setupSim() {
	setupBox();
	
	//Basic ships
	addShipRow("plrShips", "Scout",3,"E",0,1);
	addShipRow("plrShips", "Destroyer",4,"D",0,1);
	addShipRow("plrShips", "Cruiser",4,"C",1,2);
	addShipRow("plrShips", "Battlecruiser",5,"B",1,2);
	addShipRow("plrShips", "Battleship",5,"A",2,3);
	addShipRow("plrShips", "Dreadnought",6,"A",3,3);
	addShipRow("plrShips", "Ship Yard",3,"C",0,1);
	addShipRow("plrShips", "Base",7,"A",2,3);
	
	//Advanced ships
	addShipRow("plrShips", "Carrier",3,"E",0,1);
	addShipRow("plrShips", "Fighter",5,"B",0,1);
	addShipRow("plrShips", "Mines",0,"A",0,0);
	addShipRow("plrShips", "Raider",4,"D",0,2);
	addShipRow("plrShips", "Minesweeper",1,"E",0,1);
	
	//Close Encounters ships
	addShipRow("plrShips", "Flagship",4,"B",1,3);
	addShipRow("plrShips", "Boarding Ship",1,"F",0,1);
	addShipRow("plrShips", "Transport",1,"E",1,1);
	addShipRow("plrShips", "Titan",7,"A",3,5);
	
	//Replicators ships, for normal players
	addShipRow("plrShips", "DestroyerX",4,"D",0,2);
	addShipRow("plrShips", "Battle Carrier",5,"B",1,3);
	addShipRow("plrShips", "Advanced Flagship",5,"A",3,3);
	addShipRow("plrShips", "RaiderX",4,"D",0,3);
	
	//Replicator-unique ships
	addShipRow("repShips", "Hull",0,"E",0,0);
	addShipRow("repShips", "Type 0",2,"E",0,1);
	addShipRow("repShips", "Type II",4,"E",1,1);
	addShipRow("repShips", "Type IV",5,"E",1,1);
	addShipRow("repShips", "Type V",6,"D",2,2);
	addShipRow("repShips", "Type VII",6,"C",2,2);
	addShipRow("repShips", "Type IX",6,"D",1,1);
	addShipRow("repShips", "Type XI",8,"B",3,2);
	addShipRow("repShips", "Type XIII",10,"A",4,4);
	addShipRow("repShips", "Type XV",11,"A",5,4);
	addShipRow("repShips", "Type Scan",6,"C",0,1);
	addShipRow("repShips", "Type SW",1,"E",0,2);
	addShipRow("repShips", "Type PD",6,"A",0,1);
	addShipRow("repShips", "Type Exp",1,"E",0,2);
	addShipRow("repShips", "Type Flag",1,"B",1,3);
	
	document.getElementById("FighterAtk").max = 9;
	document.getElementById("FighterDef").max = 3;
	document.getElementById("RaiderAtk").max = 7;

	document.getElementById("Boarding ShipAtk").max = 1;
	document.getElementById("Boarding ShipAtk").disabled = true;
	document.getElementById("TransportDef").max = 3;
	document.getElementById("DestroyerXSize").innerHTML = 1;
	document.getElementById("RaiderXAtk").max = 8;
	document.getElementById("RaiderXSize").innerHTML = 2;
	
	disableCustomization("Type 0");
	disableCustomization("Type II");
	disableCustomization("Type IV");
	disableCustomization("Type V");
	disableCustomization("Type VII");
	disableCustomization("Type IX");
	disableCustomization("Type XI");
	disableCustomization("Type XIII");
	disableCustomization("Type XV");
	disableCustomization("Type Scan");
	disableCustomization("Type SW");
	disableCustomization("Type PD");
	disableCustomization("Type Exp");
	disableCustomization("Type Flag");
	showPlrRows();
}

function disableCustomization(dsgnName) {
	var minTactics = 1;
	if (dsgnName == "Type 0" || dsgnName == "Type II" || dsgnName == "Type IV" || dsgnName == "Type V" ||
		dsgnName == "Type PD" || dsgnName == "Type Scan" || dsgnName == "Type SW" || dsgnName == "Type Exp") {
		minTactics = 0;
	}
	
	document.getElementById(dsgnName+"Atk").max = document.getElementById(dsgnName+"Atk").min;
	document.getElementById(dsgnName+"Atk").disabled = true;
	document.getElementById(dsgnName+"Def").disabled = true;
	document.getElementById(dsgnName+"Tac").min = minTactics;
	document.getElementById(dsgnName+"Tac").max = document.getElementById(dsgnName+"Tac").min;
	document.getElementById(dsgnName+"Tac").value = document.getElementById(dsgnName+"Tac").min;
	document.getElementById(dsgnName+"Tac").disabled = true;
}

function addShipRow(useTable, namee, baseAtk, atkClass, baseDef, sizee) {
	var playerBody = document.getElementById(useTable);
	
	var trFrag = document.createElement("tr");
	var tdFrag = null;
	var inputFrag = null;
	
	trFrag.id = namee+"Row";
	
	//Label column
	tdFrag = document.createElement("th");
	tdFrag.className = atkClass;
	tdFrag.innerHTML = "<label for=\"" + namee + "Qty\">" + namee + "</label>";
	trFrag.appendChild(tdFrag);
	
	//Help column
	tdFrag = document.createElement("td");
	tdFrag.innerHTML = "<a href=\"javascript:showBox('" + namee + "')\">(?)</a>";
	trFrag.appendChild(tdFrag);
	
	//Quantity field
	tdFrag = document.createElement("td");
	tdFrag.className = "numeric";
	inputFrag = document.createElement("input");
	inputFrag.id = namee+"Qty";
	inputFrag.className = "text numeric";
	inputFrag.type = "number";
	inputFrag.value = 0;
	inputFrag.size = 5;
	inputFrag.min = 0;
	inputFrag.onblur = applyTotals;
	inputFrag.onchange = applyTotals;
	tdFrag.appendChild(inputFrag);
	trFrag.appendChild(tdFrag);
	
	if (sizee > 0) {
		//Attack field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		inputFrag = document.createElement("input");
		inputFrag.id = namee+"Atk";
		inputFrag.className = "text numeric";
		inputFrag.type = "number";
		inputFrag.size = 3;
		inputFrag.min = baseAtk;
		inputFrag.value = baseAtk;
		inputFrag.max = baseAtk + Math.min(sizee,4);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Defense Tech field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		inputFrag = document.createElement("input");
		inputFrag.id = namee+"Def";
		inputFrag.className = "text numeric";
		inputFrag.type = "number";
		inputFrag.size = 3;
		inputFrag.min = baseDef;
		inputFrag.value = baseDef;
		inputFrag.max = baseDef + Math.min(sizee,3);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Tactics Tech field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		inputFrag = document.createElement("input");
		inputFrag.id = namee+"Tac";
		inputFrag.className = "text numeric";
		inputFrag.type = "number";
		inputFrag.size = 3;
		inputFrag.min = 0;
		inputFrag.value = 0;
		inputFrag.max = 3;
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Hidden Hull Size field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric invisible";
		tdFrag.id = namee+"Size";
		tdFrag.innerHTML = sizee;
		trFrag.appendChild(tdFrag);
	} else {
		// Attack/Defense/Tactics/Size/Threat fields empty
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
	}
	
	playerBody.appendChild(trFrag);
}

function showPlrRows(rowId, rowVis) {
	if (rowId) {
		var workRow = document.getElementById(rowId+"Row");
		
		if (workRow) {
			if (rowVis) {
				workRow.style.display = "";
			} else {
				workRow.style.display = "none";
				document.getElementById(rowId+"Qty").value = 0;
			}
			
			if (rowId == "Type Flag") {
				document.getElementById(rowId+"Atk").value = Math.max(replicatorRP,1);
				document.getElementById(rowId+"Def").value = 1 + Math.floor(replicatorRP/5);
			}
		}
	} else {
		var sizeTech, ftrTech, cloakTech, auxTech, advConTech;
		
		sizeTech = parseInt(document.getElementById("techSize").value);
		ftrTech = parseInt(document.getElementById("techFtr").value);
		cloakTech = parseInt(document.getElementById("techClk").value);
		mineTech = document.getElementById("techMines").checked;
		auxTech = document.getElementById("techAux").checked;
		advConTech = parseInt(document.getElementById("techAC").value);
		replicatorRP = parseInt(document.getElementById("repRP").value);
		alienTech = document.getElementById("techAlien").checked;
		
		showPlrRows("Scout", sizeTech >= 1);
		showPlrRows("Ship Yard", sizeTech >= 1);
		
		showPlrRows("Destroyer", sizeTech >= 2);
		showPlrRows("Base", sizeTech >= 2);
		showPlrRows("Cruiser", sizeTech >= 3);
		showPlrRows("Battlecruiser", sizeTech >= 4);
		showPlrRows("Battleship", sizeTech >= 5);
		showPlrRows("Dreadnought", sizeTech >= 6);
		showPlrRows("Titan", sizeTech >= 7);
		
		showPlrRows("Carrier", ftrTech > 0);
		showPlrRows("Fighter", ftrTech > 0);
		
		showPlrRows("Raider", cloakTech > 0);
		showPlrRows("Flagship", true);

		showPlrRows("Mines", mineTech);
		showPlrRows("Minesweeper", auxTech);
		showPlrRows("Boarding Ship", auxTech);
		showPlrRows("Transport", sizeTech >= 1);

		showPlrRows("DestroyerX", sizeTech >= 2 && advConTech >= 1);
		showPlrRows("Battle Carrier", ftrTech > 0 && advConTech >= 2);
		showPlrRows("RaiderX", cloakTech > 0 && advConTech >= 3);
		showPlrRows("Advanced Flagship", advConTech >= 3);
		
		showPlrRows("Hull", replicatorRP >= 0);
		showPlrRows("Type 0", replicatorRP >= 0);
		showPlrRows("Type II", replicatorRP >= 2);
		showPlrRows("Type IV", replicatorRP >= 4);
		showPlrRows("Type V", replicatorRP >= 5);
		showPlrRows("Type VII", replicatorRP >= 7);
		showPlrRows("Type IX", replicatorRP >= 9);
		showPlrRows("Type XI", replicatorRP >= 11);
		showPlrRows("Type XIII", replicatorRP >= 13);
		showPlrRows("Type XV", replicatorRP >= 15);
		showPlrRows("Type SW", replicatorRP >= 0);
		showPlrRows("Type Scan", replicatorRP >= 0);
		showPlrRows("Type PD", replicatorRP >= 0);
		showPlrRows("Type Exp", replicatorRP >= 0);
		showPlrRows("Type Flag", true);
		
		repSweeps = parseInt(document.getElementById("repMineKills").value);
		document.getElementById("repMinesSeen").disabled = (repSweeps > 0);
		if (repSweeps > 0) {
			document.getElementById("repMinesSeen").checked = true;
		}
		
		repFtrs = parseInt(document.getElementById("repFtrKills").value);
		document.getElementById("repFtrsSeen").disabled = (repFtrs > 0);
		if (repFtrs > 0) {
			document.getElementById("repFtrsSeen").checked = true;
		}

		document.getElementById("titanTarget").disabled = (sizeTech < 7);
		
		if (alienTech) {
			document.getElementById("atChart").style.display = "";
		} else {
			document.getElementById("atChart").style.display = "none";
		}
	}
}

function applyTotals() {
	var plrTotal = [0,0];
	var repTotal = [0,0];
	var sizeMulti = 1;
	
	techCells = document.getElementsByTagName("input");
	for (t in techCells) {
		if (techCells[t].id && techCells[t].id.endsWith("Qty")) {
			if (techCells[t].id.startsWith("Type") || techCells[t].id.startsWith("Hull")) {
				sizeMulti = 1;
				if (techCells[t].id == "Type FlagQty" || techCells[t].id == "Type XVQty" || techCells[t].id == "Type XIIIQty") {
					sizeMulti = 3;
				} else if (techCells[t].id == "Type VQty" || techCells[t].id == "Type VIIQty" || techCells[t].id == "Type XIQty" ||
					techCells[t].id == "Type ScanQty" || techCells[t].id == "Type ExpQty") {
					sizeMulti = 2;
				}
				
				repTotal[0] = repTotal[0] + parseInt(techCells[t].value);
				repTotal[1] = repTotal[1] + parseInt(techCells[t].value) * sizeMulti;
			} else {
				sizeMulti = 1;
				if (techCells[t].id == "BaseQty") {
					sizeMulti = 6;
				} else if (techCells[t].id == "TitanQty") {
					sizeMulti = 5;
				} else if (techCells[t].id == "BattleshipQty" || techCells[t].id == "DreadnoughtQty" || techCells[t].id == "FlagshipQty" ||
					techCells[t].id == "Battle CarrierQty" || techCells[t].id == "Advanced FlagshipQty") {
					sizeMulti = 3;
				} else if (techCells[t].id == "CruiserQty" || techCells[t].id == "BattlecruiserQty" || techCells[t].id == "RaiderQty" ||
					techCells[t].id == "RaiderXQty" || techCells[t].id == "Boarding ShipQty") {
					sizeMulti = 2;
				} else if (techCells[t].id == "MinesQty") {
					sizeMulti = 1.5;
				}
				
				plrTotal[0] = plrTotal[0] + parseInt(techCells[t].value);
				plrTotal[1] = plrTotal[1] + parseInt(techCells[t].value) * sizeMulti;
			}
		}
	}
	
	totalObjs = [document.getElementById("totalPlrShips"), document.getElementById("totalPlrHulls"),
		document.getElementById("totalRepShips"), document.getElementById("totalRepHulls")];
	totalObjs[0].innerHTML = plrTotal[0];
	totalObjs[1].innerHTML = plrTotal[1];
	totalObjs[2].innerHTML = repTotal[0];
	totalObjs[3].innerHTML = repTotal[1];
	
	if (plrTotal[1] > 0 && plrTotal[1] >= repTotal[1] * 1.25) {
		totalObjs[1].className = "numeric bonus"
	} else {
		totalObjs[1].className = "numeric"
	}
	
	if (repTotal[1] > 0 && repTotal[1] >= plrTotal[1] * 1.25) {
		totalObjs[3].className = "numeric bonus"
	} else {
		totalObjs[3].className = "numeric"
	}
}

function applyAllTech() {
	techCells = document.getElementsByTagName("input");
	atkBonus = parseInt(document.getElementById("techAtk").value);
	defBonus = parseInt(document.getElementById("techDef").value);
	tacBonus = parseInt(document.getElementById("techTac").value);
	ftrBonus = Math.max(parseInt(document.getElementById("techFtr").value) - 1, 0);
	clkBonus = Math.max(parseInt(document.getElementById("techClk").value) - 1, 0);
	
	for (t in techCells) {
		try {
			if (techCells[t].id && !techCells[t].id.startsWith("Type") && !techCells[t].disabled) {
				if (techCells[t].id == "Fighterstk") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,1) + Math.min(ftrBonus,3);
				} else if (techCells[t].id == "FighterDef") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(defBonus,1) + Math.max(ftrBonus-2,0);
				} else if (techCells[t].id == "RaiderAtk") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,2) + Math.min(clkBonus,1);
				} else if (techCells[t].id.endsWith("Atk")) {
					techCells[t].value = Math.min(parseInt(techCells[t].min) + atkBonus,techCells[t].max);
				} else if (techCells[t].id.endsWith("Def")) {
					techCells[t].value = Math.min(parseInt(techCells[t].min) + defBonus,techCells[t].max);
				} else if (techCells[t].id.endsWith("Tac")) {
					techCells[t].value = tacBonus;
				}
			}
		} catch(err) {
			if (techCells[t].id) {
				console.error("Error reading ID " + techCells[t].id);
			} else {
				console.error("Error reading: " + techCells[t]);
			}
		}
	}
}

function emptyFleet(repShips) {
	techCells = document.getElementsByTagName("input");
	
	for (t in techCells) {
		try {
			if (techCells[t].id && !techCells[t].disabled) {
				if (techCells[t].id.endsWith("Qty")) {
					if ((techCells[t].id.startsWith("Type") || techCells[t].id.startsWith("Hull")) == repShips) {
						techCells[t].value = 0;
					}
				}
			}
		} catch(err) {
			if (techCells[t].id) {
				console.error("Error reading ID " + techCells[t].id);
			} else {
				console.error("Error reading: " + techCells[t]);
			}
		}
	}
	
	applyTotals();
}

/* ------------------------------------------------------------------------- */

//Object
function simShip(baseID) {
	this.namee = baseID;
	this.quantity = parseInt(document.getElementById(baseID + "Qty").value);
	this.damage = 0;
	
	this.updateSpecs = function(ignoreStats) {
		if (this.namee != "Mines" && this.namee != "Hull") {
			if (!ignoreStats) {
				this.attackRating = parseInt(document.getElementById(baseID + "Atk").value);
				this.defenseRating = parseInt(document.getElementById(baseID + "Def").value);
				this.tactics = parseInt(document.getElementById(baseID + "Tac").value);
			}
			this.hullSize = parseInt(document.getElementById(baseID + "Size").innerHTML);
			this.threat = (this.quantity > 0 ? (9 - this.hullSize) * 1000 + (39 - this.defenseRating) * 25 + this.attackRating : 0);
		}
	}
	
	this.updateSpecs(false);
	
	this.hitShip = function() {
		this.damage++;
		if (this.damage >= this.hullSize) {
			this.damage = 0;
			this.quantity--;
			
			if (this.quantity <= 0) {
				this.threat = 0;
			}
		}	
	}
	
	this.buildShip = function() {
		this.quantity++;
		this.updateSpecs(false);
	}
	
	this.toString = function() {
		let totalHP = this.hullSize * this.quantity - this.damage;
		
		if (totalHP > 0) {
			return this.namee + " group (count " + this.quantity + " / HP total " + totalHP + ")";
		}
		
		return this.namee + " group";
	}
}

function playerFleet() {
	var baseID;
	
	//Basic
	this.scouts = new simShip("Scout");
	this.destroyers = new simShip("Destroyer");
	this.cruisers = new simShip("Cruiser");
	this.battlecruisers = new simShip("Battlecruiser");
	this.battleships = new simShip("Battleship");
	this.dreadnoughts = new simShip("Dreadnought");
	this.shipYards = new simShip("Ship Yard");
	this.starbases = new simShip("Base");
	//Advanced tech
	this.carriers = new simShip("Carrier");
	this.fighters = new simShip("Fighter");
	this.mines = new simShip("Mines");
	this.raiders = new simShip("Raider");
	this.minesweepers = new simShip("Minesweeper");
	//Close Encounters tech
	this.flagships = new simShip("Flagship");
	this.boardingShips = new simShip("Boarding Ship");
	this.transports = new simShip("Transport");
	this.titans = new simShip("Titan");
	//Replicators tech
	this.destroyerXes = new simShip("DestroyerX");
	this.battleCarriers = new simShip("Battle Carrier");
	this.advancedFlagships = new simShip("Advanced Flagship");
	this.raiderXes = new simShip("RaiderX");
	
	this.totalShips = function() {
		return this.scouts.quantity + this.destroyers.quantity + this.cruisers.quantity + this.battlecruisers.quantity +
			this.battleships.quantity + this.dreadnoughts.quantity + this.shipYards.quantity + this.starbases.quantity +
			this.carriers.quantity + this.fighters.quantity + this.mines.quantity + this.raiders.quantity + this.minesweepers.quantity +
			this.flagships.quantity + this.boardingShips.quantity + this.transports.quantity + this.titans.quantity +
			this.destroyerXes.quantity + this.battleCarriers.quantity + this.advancedFlagships.quantity + this.raiderXes.quantity;
	}
	
	this.totalHulls = function() {
		return this.scouts.quantity + this.destroyers.quantity + this.shipYards.quantity +
			this.carriers.quantity + this.fighters.quantity + this.minesweepers.quantity + this.transports.quantity + this.destroyerXes.quantity + 
			1.5 * this.mines.quantity + 
			2 * (this.cruisers.quantity + this.battlecruisers.quantity + this.raiders.quantity + this.boardingShips.quantity + this.raiderXes.quantity) +
			3 * (this.battleships.quantity + this.dreadnoughts.quantity + this.flagships.quantity + this.battleCarriers.quantity + this.advancedFlagships.quantity) +
			5 * this.titans.quantity +
			6 * this.starbases.quantity;
	}
	
	this.highestAggro = function() {
		return Math.max(this.scouts.threat, this.destroyers.threat, this.cruisers.threat, this.battlecruisers.threat, 
			this.battleships.threat, this.dreadnoughts.threat, this.shipYards.threat, this.starbases.threat, 
			this.carriers.threat, this.fighters.threat, this.raiders.threat, this.minesweepers.threat,
			this.flagships.threat, this.boardingShips.threat, this.transports.threat, this.titans.threat,
			this.destroyerXes.threat, this.battleCarriers.threat, this.advancedFlagships.threat, this.raiderXes.threat);
	}
	
	this.targetOptimal = function() {
		this.fighters.updateSpecs(true);
		if (this.fighters.quantity > 0) {
			this.fighters.threat = Math.max(this.fighters.threat, this.carriers.threat, this.battleCarriers.threat);
		}
		
		let highestThreat = this.highestAggro();
		
		if (this.advancedFlagships.threat == highestThreat) {
			return this.advancedFlagships;
		}

		if (this.flagships.threat == highestThreat) {
			return this.flagships;
		}

		if (this.shipYards.threat == highestThreat) {
			return this.shipYards;
		}

		if (this.destroyerXes.threat == highestThreat) {
			return this.destroyerXes;
		}

		if (this.destroyers.threat == highestThreat) {
			return this.destroyers;
		}

		if (this.scouts.threat == highestThreat) {
			return this.scouts;
		}

		if (this.battlecruisers.threat == highestThreat) {
			return this.battlecruisers;
		}

		if (this.raiderXes.threat == highestThreat) {
			return this.raiderXes;
		}

		if (this.raiders.threat == highestThreat) {
			return this.raiders;
		}

		if (this.cruisers.threat == highestThreat) {
			return this.cruisers;
		}

		if (this.dreadnoughts.threat == highestThreat) {
			return this.dreadnoughts;
		}

		if (this.battleships.threat == highestThreat) {
			return this.battleships;
		}

		if (this.titans.threat == highestThreat) {
			return this.titans;
		}

		if (this.starbases.threat == highestThreat) {
			return this.starbases;
		}

		if (this.fighters.threat == highestThreat) {
			return this.fighters;
		}

		if (this.battleCarriers.threat == highestThreat) {
			return this.battleCarriers;
		}

		if (this.carriers.threat == highestThreat) {
			return this.carriers;
		}

		if (this.transports.threat == highestThreat) {
			return this.transports;
		}

		if (this.boardingShips.threat == highestThreat) {
			return this.boardingShips;
		}

		return this.minesweepers;
	}
}

function replicatorFleet() {
	var baseID;
	
	this.repHulls = new simShip("Hull");
	this.type0 = new simShip("Type 0");
	this.type2 = new simShip("Type II");
	this.type4 = new simShip("Type IV");
	this.type5 = new simShip("Type V");
	this.type7 = new simShip("Type VII");
	this.type9 = new simShip("Type IX");
	this.type11 = new simShip("Type XI");
	this.type13 = new simShip("Type XIII");
	this.type15 = new simShip("Type XV");
	this.typePDs = new simShip("Type PD");
	this.typeScans = new simShip("Type Scan");
	this.typeSWs = new simShip("Type SW");
	this.typeExps = new simShip("Type Exp");
	this.typeFlags = new simShip("Type Flag");
	
	this.totalShips = function() {
		return this.type0.quantity + this.type2.quantity + this.type4.quantity + this.type5.quantity +
			this.type7.quantity + this.type9.quantity + this.type11.quantity + this.type13.quantity +
			this.type15.quantity + this.typePDs.quantity + this.typeScans.quantity + this.typeSWs.quantity +
			this.typeExps.quantity + this.typeFlags.quantity + this.repHulls.quantity;
	}
	
	this.totalHulls = function() {
		return this.repHulls.quantity + this.type0.quantity + this.type2.quantity + this.type4.quantity + this.type9.quantity +
			this.typePDs.quantity + this.typeSWs.quantity + 
			2 * (this.type5.quantity + this.type7.quantity + this.type11.quantity + this.typeScans.quantity) +
			3 * (this.typeFlags.quantity + this.type13.quantity + this.type15.quantity);
	}
	
	this.highestAggro = function(screenUtil) {
		if (screenUtil) {
			return Math.max(this.type0.threat, this.type2.threat, this.type4.threat, this.type5.threat, 
				this.type7.threat, this.type9.threat, this.type11.threat, this.type13.threat, 
				this.type15.threat, this.typePDs.threat, this.typeExps.threat, this.typeFlags.threat);
		}
		
		return Math.max(this.type0.threat, this.type2.threat, this.type4.threat, this.type5.threat, 
			this.type7.threat, this.type9.threat, this.type11.threat, this.type13.threat, 
			this.type15.threat, this.typePDs.threat, this.typeSWs.threat, this.typeScans.threat,
			this.typeExps.threat, this.typeFlags.threat);
	}
	
	this.targetOptimal = function(bigTargsFirst, screenUtil) {
		let highestThreat = this.highestAggro(screenUtil);
		
		if (this.typeFlags.quantity > 0 && this.typeFlags.damage > 0) {
			return this.typeFlags;
		}
		
		if (this.type15.quantity > 0 && this.type15.damage > 2) {
			return this.type15;
		}
		
		if (this.type13.quantity > 0 && this.type13.damage > 2) {
			return this.type13;
		}
		
		if (this.type11.quantity > 0 && this.type11.damage > 0) {
			return this.type11;
		}
		
		if (this.type7.quantity > 0 && this.type7.damage > 0) {
			return this.type7;
		}
		
		if (this.type5.quantity > 0 && this.type5.damage > 0) {
			return this.type5;
		}
		
		if (this.typeScans.quantity > 0 && this.typeScans.damage > 0 && !screenUtil) {
			return this.typeScans;
		}
		
		if (this.type0.threat == highestThreat) {
			return this.type0;
		}
		
		if (this.type2.threat == highestThreat) {
			return this.type2;
		}
		
		if (this.type4.threat == highestThreat) {
			return this.type4;
		}
		
		if (this.type5.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.type5;
		}
		
		if (this.type7.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.type7;
		}
		
		if (this.type11.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.type11;
		}
		
		if (this.typeFlags.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.typeFlags;
		}

		if (this.type13.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.type13;
		}
		
		if (this.type15.threat * (bigTargsFirst + 1) >= highestThreat) {
			return this.type15;
		}
		
		if (this.type9.threat == highestThreat) {
			return this.type9;
		}
		
		if (this.typePDs.threat == highestThreat) {
			return this.typePDs;
		}
		
		if (this.typeSWs.threat == highestThreat && !screenUtil) {
			return this.typeSWs;
		}
		
		if (this.typeScans.threat == highestThreat && !screenUtil) {
			return this.typeSWs;
		}
		
		return this.typeExps;
	}
}

//Object
function clearResults(removeDivs) {
	simRound = 0;
	largeFleetBonus = [0, 0];
	largeFleetMemory = [0, 0];
	repShipBonus = [false, false];
	repShipMemory = [false, false];
	
	if (removeDivs) {
		roundsCollected = document.getElementsByTagName("div");
		for (i = 0; i < roundsCollected.length; i++) {
			if (roundsCollected[i].id != "infobox") {
				roundsCollected[i--].remove();
			}
		}
	}
}

function fireWepClass(letter) {
	// Fires all weapons belonging to the class
	
	for (var t = 3; t >= 0; t--) {
		switch (letter) {
			case "A":
				if (!repAggresor) {
					if (repShipBonus[1]) {
						fireRepWeps(simRepFleet.typePDs, t);
					}
					fireRepWeps(simRepFleet.type13, t);
					fireRepWeps(simRepFleet.type15, t);
				}
				
				firePlrWeps(simPlrFleet.titans, t);
				firePlrWeps(simPlrFleet.starbases, t);
				firePlrWeps(simPlrFleet.dreadnoughts, t);
				firePlrWeps(simPlrFleet.battleships, t);
				firePlrWeps(simPlrFleet.advancedFlagships, t);
				if (combatHex != "hexNebula" && !repShipBonus[0]) {
					firePlrWeps(simPlrFleet.raiders, t);
					firePlrWeps(simPlrFleet.raiderXes, t);
				}

				if (repAggresor) {
					if (repShipBonus[1]) {
						fireRepWeps(simRepFleet.typePDs, t);
					}
					fireRepWeps(simRepFleet.type13, t);
					fireRepWeps(simRepFleet.type15, t);
				}
				break;

			case "B":
				if (!repAggresor) {
					fireRepWeps(simRepFleet.type11, t);
					fireRepWeps(simRepFleet.typeFlags, t);
				}
				
				firePlrWeps(simPlrFleet.flagships, t);
				firePlrWeps(simPlrFleet.battlecruisers, t);
				firePlrWeps(simPlrFleet.fighters, t);
				firePlrWeps(simPlrFleet.battleCarriers, t);

				if (repAggresor) {
					fireRepWeps(simRepFleet.type11, t);
					fireRepWeps(simRepFleet.typeFlags, t);
				}
				break;

			case "C":
				if (repAggresor) {
					firePlrWeps(simPlrFleet.cruisers, t);
					firePlrWeps(simPlrFleet.shipYards, t);
				}
				
				if (repShipBonus[0]) {
					fireRepWeps(simRepFleet.typeScans, t);
				}
				fireRepWeps(simRepFleet.type7, t);

				if (!repAggresor) {
					firePlrWeps(simPlrFleet.cruisers, t);
					firePlrWeps(simPlrFleet.shipYards, t);
				}
				break;

			case "D":
				if (!repAggresor) {
					fireRepWeps(simRepFleet.type5, t);
					fireRepWeps(simRepFleet.type9, t);
				}

				firePlrWeps(simPlrFleet.destroyers, t);
				firePlrWeps(simPlrFleet.destroyerXes, t);
				if (combatHex == "hexNebula" || repShipBonus[0]) {
					firePlrWeps(simPlrFleet.raiders, t);
					firePlrWeps(simPlrFleet.raiderXes, t);
				}

				if (repAggresor) {
					fireRepWeps(simRepFleet.type5, t);
					fireRepWeps(simRepFleet.type9, t);
				}
				break;

			case "E":
				if (repAggresor) {
					firePlrWeps(simPlrFleet.carriers, t);
					firePlrWeps(simPlrFleet.minesweepers, t);
					firePlrWeps(simPlrFleet.scouts, t);
					firePlrWeps(simPlrFleet.transports, t);
				}

				fireRepWeps(simRepFleet.type0, t);
				fireRepWeps(simRepFleet.type2, t);
				fireRepWeps(simRepFleet.type4, t);
				fireRepWeps(simRepFleet.typeSWs, t);
				fireRepWeps(simRepFleet.typeExps, t);
				if (!repShipBonus[0] && !repBonusUsed[0]) {
					fireRepWeps(simRepFleet.typeScans, t);
				}
				if (!repShipBonus[1] && !repBonusUsed[1]) {
					fireRepWeps(simRepFleet.typePDs, t);
				}

				if (!repAggresor) {
					firePlrWeps(simPlrFleet.carriers, t);
					firePlrWeps(simPlrFleet.minesweepers, t);
					firePlrWeps(simPlrFleet.scouts, t);
					firePlrWeps(simPlrFleet.transports, t);
				}
				break;

			case "F":
				firePlrWeps(simPlrFleet.boardingShips, t);
				break;
		}
	}
}

function fireTacticsLv(tacLv) {
	// Fires all weapons belonging to the Tactics Lv
	if (!repAggresor) {
		fireRepWeps(simRepFleet.typeScans, tacLv);
		fireRepWeps(simRepFleet.typePDs, tacLv);
		fireRepWeps(simRepFleet.typeFlags, tacLv);
		fireRepWeps(simRepFleet.type15, tacLv);
		fireRepWeps(simRepFleet.type13, tacLv);
		fireRepWeps(simRepFleet.type11, tacLv);
		fireRepWeps(simRepFleet.type9, tacLv);
		fireRepWeps(simRepFleet.type7, tacLv);
		fireRepWeps(simRepFleet.type5, tacLv);
		fireRepWeps(simRepFleet.type4, tacLv);
		fireRepWeps(simRepFleet.type2, tacLv);
		fireRepWeps(simRepFleet.type0, tacLv);
		fireRepWeps(simRepFleet.typeSWs, tacLv);
		fireRepWeps(simRepFleet.typeExps, tacLv);
	}
	
	firePlrWeps(simPlrFleet.titans, tacLv);
	firePlrWeps(simPlrFleet.starbases, tacLv);
	firePlrWeps(simPlrFleet.dreadnoughts, tacLv);
	firePlrWeps(simPlrFleet.battleships, tacLv);
	firePlrWeps(simPlrFleet.advancedFlagships, tacLv);

	firePlrWeps(simPlrFleet.flagships, tacLv);
	firePlrWeps(simPlrFleet.battlecruisers, tacLv);
	firePlrWeps(simPlrFleet.fighters, tacLv);
	firePlrWeps(simPlrFleet.battleCarriers, tacLv);
	
	firePlrWeps(simPlrFleet.cruisers, tacLv);
	firePlrWeps(simPlrFleet.shipYards, tacLv);
	
	firePlrWeps(simPlrFleet.destroyers, tacLv);
	firePlrWeps(simPlrFleet.destroyerXes, tacLv);
	firePlrWeps(simPlrFleet.raiders, tacLv);
	firePlrWeps(simPlrFleet.raiderXes, tacLv);
	
	firePlrWeps(simPlrFleet.carriers, tacLv);
	firePlrWeps(simPlrFleet.minesweepers, tacLv);
	firePlrWeps(simPlrFleet.scouts, tacLv);
	firePlrWeps(simPlrFleet.transports, tacLv);
	
	if (repAggresor) {
		fireRepWeps(simRepFleet.typeScans, tacLv);
		fireRepWeps(simRepFleet.typePDs, tacLv);
		fireRepWeps(simRepFleet.typeFlags, tacLv);
		fireRepWeps(simRepFleet.type15, tacLv);
		fireRepWeps(simRepFleet.type13, tacLv);
		fireRepWeps(simRepFleet.type11, tacLv);
		fireRepWeps(simRepFleet.type9, tacLv);
		fireRepWeps(simRepFleet.type7, tacLv);
		fireRepWeps(simRepFleet.type5, tacLv);
		fireRepWeps(simRepFleet.type4, tacLv);
		fireRepWeps(simRepFleet.type2, tacLv);
		fireRepWeps(simRepFleet.type0, tacLv);
		fireRepWeps(simRepFleet.typeSWs, tacLv);
		fireRepWeps(simRepFleet.typeExps, tacLv);
	}
	
	firePlrWeps(simPlrFleet.boardingShips, tacLv);
}

function firePlrWeps(shipObj, tacLvReq) {
	if (shipObj.quantity > 0 && (shipObj.tactics == tacLvReq || tacLvReq < 0)) {
		shipObj.updateSpecs(true);
		if (simRound == 1 && shipObj.namee == "Raider" && simRepFleet.typeScans.quantity <= 0 && combatHex != "hexNebula") {
			shipObj.attackRating++;
		}
		
		if (simRound > 1 && shipObj.namee != "Titan" && shipObj.namee != "Ship Yard" && shipObj.namee != "Base" &&
			(simPlrFleet.totalShips() < retreatThresh || (shipObj.namee == "Flagship" && shipObj.damage >= 2 && plrFlagPreserve))) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = shipObj.toString() + " has retreated.";
			shipObj.quantity = 0;
			shipObj.threat = 0;

			if (!simMulti) {
				divFrag.appendChild(pFrag);
			}
		} else {
			var rollsAvail = shipObj.quantity;
			do {
				var activeTarget = simRepFleet.targetOptimal((shipObj.namee == "Titan" && titanTarget > 0 && (simRound < 2 || titanTarget > 1)) ? 1 : 0,
					simPlrFleet.totalShips() <= simRepFleet.totalShips());
				
				pFrag = document.createElement("p");
				if (simRepFleet.totalShips() <= 0) {
					break;
				} else if (shipObj.namee == "Mines") {
					simRepFleet.typeFlags.threat = simRepFleet.typeFlags.threat * 1000;
					activeTarget = simRepFleet.targetOptimal(2, true);
					var destruct = Math.min(shipObj.quantity, activeTarget.quantity);
					
					pFrag.innerHTML = shipObj.toString() + " detonates against " + activeTarget.toString() + ". "+destruct+" ships destroyed";
					simRepFleet.typeFlags.updateSpecs(false);
					
					shipObj.quantity = shipObj.quantity - destruct;
					activeTarget.quantity = activeTarget.quantity - destruct;
					rollsAvail = rollsAvail - destruct;
					activeTarget.threat = activeTarget.threat * Math.min(activeTarget.quantity, 1); 
				} else {
					var hitThresh = Math.max(shipObj.attackRating + largeFleetBonus[0] - activeTarget.defenseRating, 1);
					pFrag.innerHTML = shipObj.toString() + " rolls (at &le;"+hitThresh+") against " + activeTarget.toString() + ":";
					
					while ((activeTarget.quantity > 0 || simRepFleet.totalShips() <= 0) && rollsAvail > 0) {
						dieRoll = rollD10();
						
						if (dieRoll <= hitThresh) {
							pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
							if (shipObj.namee == "Titan") {
								activeTarget.damage++;
							}
							activeTarget.hitShip();
						} else {
							pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
						}
						
						rollsAvail--;
					}
				}
				
				if (!simMulti) {
					divFrag.appendChild(pFrag);
				
					if (activeTarget.quantity <= 0) {
						pFrag = document.createElement("p");
						pFrag.innerHTML = activeTarget.toString() + " has been destroyed!";
						divFrag.appendChild(pFrag);
					}
				}
			} while (rollsAvail > 0);
		}
	}
}

function fireRepWeps(shipObj, tacLvReq) {
	if (shipObj.quantity > 0 && (shipObj.tactics == tacLvReq || tacLvReq < 0)) {
		shipObj.updateSpecs(true);
		
		if ((simRepFleet.totalHulls() * 3 <= simPlrFleet.totalHulls() || shipObj.namee == "Type Exp" || (shipObj.namee == "Type Flag" && shipObj.damage >= 2)) && 
			simRound > 1 && !repsTrapped) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = shipObj.toString() + " has retreated.";
			shipObj.quantity = 0;
			shipObj.threat = 0;

			if (!simMulti) {
				divFrag.appendChild(pFrag);
			}
		} else {
			var rollsAvail = shipObj.quantity;
			do {
				var activeTarget = simPlrFleet.targetOptimal();
				if (shipObj.namee == "Type Scan" && simPlrFleet.raiders.quantity > 0) {
					activeTarget = simPlrFleet.raiders;
					repBonusUsed[0] = true;
				}
				if (shipObj.namee == "Type PD" && simPlrFleet.fighters.quantity > 0) {
					activeTarget = simPlrFleet.fighters;
					repBonusUsed[1] = true;
				}
				
				var hitThresh = shipObj.attackRating - activeTarget.defenseRating;
				if (activeTarget.namee == "Titan") {
					// Bigger ships do not benefit from Fleet Size Bonus against Titans; and may be unable to damage it at all
					
					if (shipObj.hullSize < 2) {
						// Hull Size 1 ships count as fighters, giving them Attack +1 *and* is always able to hit on a 1
						hitThresh = Math.max(hitThresh + largeFleetBonus[1] + 1, 1);
					}
				} else {
					hitThresh = Math.max(hitThresh + largeFleetBonus[1], 1);
				}
				
				if (simPlrFleet.totalShips() <= 0) {
					break;
				} else if (hitThresh > 0) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = shipObj.toString() + " rolls (at &le;"+hitThresh+") against " + activeTarget.toString() + ":";
					
					while ((activeTarget.quantity > 0 || simPlrFleet.totalShips() <= 0) && rollsAvail > 0) {
						dieRoll = rollD10();
						
						if (dieRoll <= hitThresh) {
							pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
							activeTarget.hitShip();
						} else {
							pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
						}
						
						rollsAvail--;
					}
				} else {
					pFrag = document.createElement("p");
					pFrag.innerHTML = shipObj.toString() + " unable to damage " + activeTarget.toString() + ". Rolls skipped";
					
					rollsAvail = 0;
				}
				
				if (activeTarget.quantity <= 0) {
					if (activeTarget.namee == "Fighter") {
						repShipBonus[1] = 0;
						simRepFleet.typePDs.attackRating = 1;
					}
					
					if (activeTarget.namee == "Raider") {
						repShipBonus[0] = 0;
						simRepFleet.typeScans.attackRating = 1;
					}
				}
				
				if (!simMulti) {
					divFrag.appendChild(pFrag);
				
					if (activeTarget.quantity <= 0) {
						pFrag = document.createElement("p");
						pFrag.innerHTML = activeTarget.toString() + " has been destroyed!";
						divFrag.appendChild(pFrag);
					}
				}
			} while (rollsAvail > 0);
		}
	}
}

function rollBHsurvival(shipObj) {
	if (shipObj.quantity > 0) {
		pFrag = document.createElement("p");
		pFrag.innerHTML = shipObj.toString() + " rolls for Black Hole survival:";
		
		for (i = shipObj.quantity; i > 0; i--) {
			dieRoll = rollD10();
			
			if (dieRoll > 6) {
				pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
				shipObj.quantity--;
				
				if (shipObj.quantity <= 0) {
					shipObj.threat = 0;
				}
			} else {
				pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
			}
		}
		
		if (!simMulti) {
			divFrag.appendChild(pFrag);
	
			if (shipObj.quantity <= 0) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = shipObj.namee + " has been destroyed!";
				divFrag.appendChild(pFrag);
			}
		}
	}
}

function excludeGroup(shipObj) {
	if (shipObj.quantity > 0) {
		pFrag = document.createElement("p");
		pFrag.innerHTML = shipObj.toString() + " unable to move, and has been excluded from this battle.";
		shipObj.quantity = 0;
		shipObj.threat = 0;

		if (!simMulti) {
			divFrag.appendChild(pFrag);
		}
	}
}

function runSimRound() {
	simRound++;
	grandBody = document.getElementsByTagName("body")[0];
	
	divFrag = document.createElement("div");
	
	repBonusUsed = [false, false];
	
	if (simRound == 1) {
		var combatChoices = document.getElementsByName("combatHex");
		for (var c in combatChoices) {
			if (combatChoices[c].checked) {
				combatHex = combatChoices[c].id;
			}
		}

		retreatThresh = parseInt(document.getElementById("retreatThresh").value);
		var raidersProx = document.getElementById("repRprox").checked;
		var raidersSeen = document.getElementById("repRseen").checked;
		var minesPres = document.getElementById("repMinesBoard").checked;
		var minesSeen = document.getElementById("repMinesSeen").checked;
		sweepRate = (parseInt(document.getElementById("repMineKills").value) >= 3 ? 2 : 1);
		var ftrsPres = document.getElementById("repFtrsBoard").checked;
		var ftrsSeen = document.getElementById("repFtrsSeen").checked;
		pdBonus = (parseInt(document.getElementById("repFtrKills").value) >= 3 ? 1 : 0);
		var RPtotal = parseInt(document.getElementById("repRP").value);
	
		if (!repAggresor) {
			excludeGroup(simPlrFleet.mines); //Mines can never be an aggressor
			
			if (false) {
				// Advantage support not currently available. (Applicable?)
				excludeGroup(simPlrFleet.starbases);
				excludeGroup(simPlrFleet.shipYards);
			}
			
			if (combatHex == "hexBlackHole") {
				rollBHsurvival(simPlrFleet.starbases);
				rollBHsurvival(simPlrFleet.titans);
				rollBHsurvival(simPlrFleet.dreadnoughts);
				rollBHsurvival(simPlrFleet.battleships);
				rollBHsurvival(simPlrFleet.pirates);
				rollBHsurvival(simPlrFleet.raiders);
				rollBHsurvival(simPlrFleet.raiderXes);
				rollBHsurvival(simPlrFleet.advancedFlagships);
				
				rollBHsurvival(simPlrFleet.flagships);
				rollBHsurvival(simPlrFleet.battlecruisers);
				rollBHsurvival(simPlrFleet.battleCarriers);

				rollBHsurvival(simPlrFleet.shipYards);
				rollBHsurvival(simPlrFleet.cruisers);
				
				rollBHsurvival(simPlrFleet.destroyers);
				rollBHsurvival(simPlrFleet.destroyerXes);
				
				rollBHsurvival(simPlrFleet.carriers);
				rollBHsurvival(simPlrFleet.minesweepers);
				rollBHsurvival(simPlrFleet.scouts);
				
				rollBHsurvival(simPlrFleet.transports);
				rollBHsurvival(simPlrFleet.boardingShips);
				
				simPlrFleet.fighters.quantity = Math.min(simPlrFleet.fighters.quantity, (simPlrFleet.carriers.quantity + simPlrFleet.titans.quantity + simPlrFleet.battleCarriers*2) * 3);
			}
		}
		
		if (simRepFleet.repHulls.quantity > 0) {
			var compRoll, shipQuota, hullsSpent;
			
			pFrag = document.createElement("p");
			pFrag.innerHTML = simRepFleet.repHulls.quantity+" hulls available in the Replicator fleet. Beginning assembly...";
			divFrag.appendChild(pFrag);
			
			if (simPlrFleet.raiders.quantity > 0 || raidersProx) {
				hullsSpent = 0;
				compRoll = rollD10();
				if (raidersSeen) {
					if (compRoll < 2) {
						shipQuota = 0;
					} else if (compRoll < 1) {
						shipQuota = 1;
					} else {
						shipQuota = 2;
					}
				} else {
					if (compRoll < 9) {
						shipQuota = 0;
					} else {
						shipQuota = 1;
					}
				}
				
				while (simRepFleet.typeScans.quantity < shipQuota && simRepFleet.repHulls.quantity >= 2) {
					simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity - 2;
					simRepFleet.typeScans.buildShip();
					hullsSpent = hullsSpent + 2;
				}
				
				if (!simMulti) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = "Raiders detected! Die roll of "+compRoll+" causes the quota to be "+shipQuota+" Type Scan ships. This process spends "+hullsSpent+" hulls";
					divFrag.appendChild(pFrag);
				}
			}
			
			if (simRepFleet.repHulls.quantity > 0 && (simPlrFleet.mines.quantity > 0 || minesPres)) {
				hullsSpent = 0;
				compRoll = rollD10();
				if (minesSeen) {
					if (simPlrFleet.mines.quantity > 0) {
						// Mines in battle AND have been previously seen
						
						if (compRoll < 2) {
							shipQuota = 1;
						} else if (compRoll < 3) {
							shipQuota = Math.ceil(simPlrFleet.mines.quantity/sweepRate/2);
						} else {
							shipQuota = Math.ceil(simPlrFleet.mines.quantity/sweepRate);
						}
					} else {
						// Mines on the board and have been previously seen
						
						if (compRoll < 5) {
							shipQuota = 0;
						} else {
							shipQuota = 1;
						}
					}
				} else {
					if (simPlrFleet.mines.quantity > 0) {
						// Mines in battle BUT have not been previously seen
						
						if (compRoll < 6) {
							shipQuota = 0;
						} else if (compRoll < 9) {
							shipQuota = 1;
						} else {
							shipQuota = Math.ceil(simPlrFleet.mines.quantity/sweepRate/2);
						}
					} else {
						// Mines on the board but have not been previously seen
						
						if (compRoll < 10) {
							shipQuota = 0;
						} else {
							shipQuota = 1;
						}
					}
				}
				
				while (simRepFleet.typeSWs.quantity < shipQuota && simRepFleet.repHulls.quantity >= 1) {
					simRepFleet.repHulls.quantity--;
					simRepFleet.typeSWs.buildShip();
					hullsSpent++;
				}
				
				if (!simMulti) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = "Mines detected! Die roll of "+compRoll+" causes the quota to be "+shipQuota+" Type SW ships. This process spends "+hullsSpent+" hulls";
					divFrag.appendChild(pFrag);
				}
			}
			
			if (simRepFleet.repHulls.quantity > 0 && (simPlrFleet.fighters.quantity > 0 || ftrsPres)) {
				hullsSpent = 0;
				compRoll = rollD10();
				if (ftrsSeen) {
					if (simPlrFleet.fighters.quantity > 0) {
						// Fighters in battle AND have been previously seen
						
						if (compRoll < 2) {
							shipQuota = 1;
						} else if (compRoll < 6) {
							shipQuota = Math.ceil(simPlrFleet.fighters.quantity/2);
						} else {
							shipQuota = simPlrFleet.fighters.quantity;
						}
					} else {
						// Fighters on the board and have been previously seen
						
						if (compRoll < 5) {
							shipQuota = 0;
						} else {
							shipQuota = 1;
						}
					}
				} else {
					if (simPlrFleet.fighters.quantity > 0) {
						// Fighters in battle BUT have not been previously seen
						
						if (compRoll < 8) {
							shipQuota = 0;
						} else if (compRoll < 10) {
							shipQuota = 1;
						} else {
							shipQuota = Math.ceil(simPlrFleet.fighters.quantity/2);
						}
					} else {
						// Fighters on the board but have not been previously seen
						
						if (compRoll < 10) {
							shipQuota = 0;
						} else {
							shipQuota = 1;
						}
					}
				}
				
				while (simRepFleet.typePDs.quantity < shipQuota && simRepFleet.repHulls.quantity >= 1) {
					simRepFleet.repHulls.quantity--;
					simRepFleet.typePDs.buildShip();
					hullsSpent++;
				}
				
				if (!simMulti) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = "Fighters detected! Die roll of "+compRoll+" causes the quota to be "+shipQuota+" Type PD ships. This process spends "+hullsSpent+" hulls";
					divFrag.appendChild(pFrag);
				}
			}
			
			if (simRepFleet.repHulls.quantity > 0) {
				var leftovers = [simRepFleet.repHulls.quantity,""];
				
				switch (RPtotal) {
					case 0:
						// Fall thru
					case 1:
						simRepFleet.type0.quantity = simRepFleet.type0.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type0.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type 0 ships x"+simRepFleet.type0.quantity;
						break;
						
					case 2:
						// Fall thru
					case 3:
						simRepFleet.type2.quantity = simRepFleet.type2.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type2.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type II ships x"+simRepFleet.type2.quantity;
						break;
						
					case 4:
						simRepFleet.type4.quantity = simRepFleet.type4.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type4.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type IV ships x"+simRepFleet.type4.quantity;
						break;
						
					case 5:
						// Fall thru
					case 6:
						simRepFleet.type5.quantity = simRepFleet.type5.quantity + Math.floor(simRepFleet.repHulls.quantity/2);
						simRepFleet.type5.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 2;
						
						simRepFleet.type4.quantity = simRepFleet.repHulls.quantity;
						simRepFleet.type4.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type V ships x"+simRepFleet.type5.quantity+" + Type IV ships x"+simRepFleet.type4.quantity;
						break;
						
					case 7:
						// Fall thru
					case 8:
						simRepFleet.type7.quantity = simRepFleet.type7.quantity + Math.floor(simRepFleet.repHulls.quantity/2);
						simRepFleet.type7.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 2;
						
						simRepFleet.type4.quantity = simRepFleet.type4.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type4.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type VII ships x"+simRepFleet.type7.quantity+" + Type IV ships x"+simRepFleet.type4.quantity;
						break;
						
					case 9:
						// Fall thru
					case 10:
						simRepFleet.type9.quantity = simRepFleet.type9.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type9.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type IX ships x"+simRepFleet.type9.quantity;
						break;
						
					case 11:
						// Fall thru
					case 12:
						simRepFleet.type11.quantity = simRepFleet.type11.quantity + Math.floor(simRepFleet.repHulls.quantity/2);
						simRepFleet.type11.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 2;
						
						simRepFleet.type9.quantity = simRepFleet.type9.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type9.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type XI ships x"+simRepFleet.type11.quantity+" + Type IX ships x"+simRepFleet.type9.quantity;
						break;
						
					case 13:
						// Fall thru
					case 14:
						simRepFleet.type13.quantity = simRepFleet.type13.quantity + Math.floor(simRepFleet.repHulls.quantity/3);
						simRepFleet.type13.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 3;
						
						simRepFleet.type11.quantity = simRepFleet.type11.quantity + Math.floor(simRepFleet.repHulls.quantity/2);
						simRepFleet.type11.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 2;
						
						simRepFleet.type9.quantity = simRepFleet.type9.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type9.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type XIII ships x"+simRepFleet.type13.quantity+" + Type XI ships x"+simRepFleet.type11.quantity+" + Type IX ships x"+simRepFleet.type9.quantity;
						break;
						
					default:
						simRepFleet.type15.quantity = simRepFleet.type15.quantity + Math.floor(simRepFleet.repHulls.quantity/3);
						simRepFleet.type15.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 3;
						
						simRepFleet.type11.quantity = simRepFleet.type11.quantity + Math.floor(simRepFleet.repHulls.quantity/2);
						simRepFleet.type11.updateSpecs(false);
						simRepFleet.repHulls.quantity = simRepFleet.repHulls.quantity % 2;
						
						simRepFleet.type9.quantity = simRepFleet.type9.quantity + simRepFleet.repHulls.quantity;
						simRepFleet.type9.updateSpecs(false);
						simRepFleet.repHulls.quantity = 0;
						
						leftovers[1] = "Type XV ships x"+simRepFleet.type15.quantity+" + Type XI ships x"+simRepFleet.type11.quantity+" + Type IX ships x"+simRepFleet.type9.quantity;
						break;
						
				}
				
				if (!simMulti) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = "Leftover "+leftovers[0]+" hulls cause the rest of the fleet composition to be "+leftovers[1];
					divFrag.appendChild(pFrag);
				}
			}
		}
		
		if (repAggresor) {
			if (combatHex == "hexBlackHole") {
				rollBHsurvival(simRepFleet.type15);
				rollBHsurvival(simRepFleet.type13);
				rollBHsurvival(simRepFleet.type11);
				rollBHsurvival(simRepFleet.typeFlags);
				rollBHsurvival(simRepFleet.type9);
				rollBHsurvival(simRepFleet.type7);
				rollBHsurvival(simRepFleet.type5);
				rollBHsurvival(simRepFleet.type4);
				rollBHsurvival(simRepFleet.type2);
				rollBHsurvival(simRepFleet.type0);
				rollBHsurvival(simRepFleet.typeScans);
				rollBHsurvival(simRepFleet.typeSWs);
				rollBHsurvival(simRepFleet.typePDs);
				rollBHsurvival(simRepFleet.typeExps);
			}
		}
		
		if (combatHex != "nebula" && simPlrFleet.raiders.quantity > 0 && simRepFleet.typeScans.quantity <= 0) {
			simPlrFleet.raiders.attackRating++;

			if (!simMulti) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player Raiders successfully ambush the Replicator fleet. Attack Rating boost for Round 1!";
				divFrag.appendChild(pFrag);
			}
		}
	} else {
		simPlrFleet.raiders.updateSpecs(true);
	}

	largeFleetBonus[0] = (simPlrFleet.totalShips() >= simRepFleet.totalShips() * 2 ? 1 : 0);
	largeFleetBonus[1] = (simRepFleet.totalShips() >= simPlrFleet.totalShips() * 2 ? 1 : 0);
	repShipBonus[0] = (simRepFleet.typeScans.quantity > 0 && simPlrFleet.raiders.quantity > 0);
	repShipBonus[1] = (simRepFleet.typePDs.quantity > 0 && simPlrFleet.fighters.quantity > 0);
	
	if (!simMulti) {
		if (largeFleetBonus[0] != largeFleetMemory[0]) {
			if (largeFleetBonus[0] > 0) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player fleet outnumbers the Replicator fleet. Attack Bonus +1 active!";
				divFrag.appendChild(pFrag);
			} else {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player fleet no longer outnumbers the Replicator fleet. Attack Bonus +1 lost";
				divFrag.appendChild(pFrag);
			}
		}
		if (largeFleetBonus[1] != largeFleetMemory[1]) {
			if (largeFleetBonus[1] > 0) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Replicator fleet outnumbers the Player fleet. Attack Bonus +1 active!";
				divFrag.appendChild(pFrag);
			} else {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Replicator fleet no longer outnumbers the Player fleet. Attack Bonus +1 negated";
				divFrag.appendChild(pFrag);
			}
		}
		
		if (repShipBonus[0] != repShipMemory[0] && simRepFleet.typeScans.quantity > 0) {
			if (repShipBonus[0]) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player Raiders have been countered! Type Scans have boosted Attack Rating!";
				divFrag.appendChild(pFrag);
			} else {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player Raiders have been eliminated! Type Scans no longer have boosted Attack Rating";
				divFrag.appendChild(pFrag);
			}
		}
		if (repShipBonus[1] != repShipMemory[1] && simRepFleet.typePDs.quantity > 0) {
			if (repShipBonus[1]) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player Fighters have been countered! Type PDs have boosted Attack Rating!";
				divFrag.appendChild(pFrag);
			} else {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Player Fighters have been eliminated! Type PDs no longer have boosted Attack Rating";
				divFrag.appendChild(pFrag);
			}
		}
		
		largeFleetMemory = cloneArray(largeFleetBonus);
		repShipMemory = cloneArray(repShipBonus);
	}
	
	if (repShipBonus[0]) {
		simRepFleet.typeScans.attackRating = 6;
	} else {
		simRepFleet.typeScans.attackRating = 1;
	}
	if (repShipBonus[1]) {
		simRepFleet.typePDs.attackRating = 6 + pdBonus;
	} else {
		simRepFleet.typePDs.attackRating = 1;
	}

	if (simRepFleet.typeSWs.quantity > 0 && simPlrFleet.mines.quantity > 0) {
		var sweepCount = Math.min(simRepFleet.typeSWs.quantity * sweepRate, simPlrFleet.mines.quantity);
		
		simPlrFleet.mines.quantity = simPlrFleet.mines.quantity - sweepCount;

		if (!simMulti) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Type SWs have swept "+sweepCount+" mines";
			divFrag.appendChild(pFrag);
		}
	}
	firePlrWeps(simPlrFleet.mines, -1);
		
	if (combatHex == "hexAsteroids" || combatHex == "hexNebula") {
		for (var u = 3; u >= 0; u--) {
			fireTacticsLv(u);
		}
	} else {
		fireWepClass("A");
		fireWepClass("B");
		fireWepClass("C");
		fireWepClass("D");
		fireWepClass("E");
		fireWepClass("F");
	}
	
	if (simPlrFleet.totalShips() <= 0 && simRepFleet.totalShips() <= 0) {
		if (simMulti) {
			multiDraws++;
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Both sides have been destroyed!";

			divFrag.appendChild(pFrag);
		}
	} else if (simPlrFleet.totalShips() <= 0) {
		if (simMulti) {
			multiLosses++;
			multiRepShips = multiRepShips + simRepFleet.totalHulls();
			repHullCount.push(simRepFleet.totalHulls());
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Replicator fleet has won the battle.";

			divFrag.appendChild(pFrag);
		}
	} else if (simRepFleet.totalShips() <= 0) {
		if (simMulti) {
			multiWins++;
			multiPlrShips = multiPlrShips + simPlrFleet.totalShips();
			plrShipCount.push(simPlrFleet.totalShips());
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Player fleet has won the battle.";

			divFrag.appendChild(pFrag);
		}
	}
	
	if (!simMulti) {
		grandBody.appendChild(divFrag);
	}
}

function getPhrase(word, count) {
	if (Math.abs(count) > 1 || count == 0) {
		return count + " " + word + "s"; 
	}
	
	return count + " " + word;
}

//Battle controls
function startSimSeries() {
	multiWins = 0;
	multiPlrShips = 0;
	multiLosses = 0;
	multiRepShips = 0;
	multiDraws = 0;
	
	plrShipCount = new Array();
	repHullCount = new Array();
	
	simPlrFleet = new playerFleet();
	simRepFleet = new replicatorFleet();
	
	multiHighPlr = simPlrFleet.totalShips();
	multiHighRep = simRepFleet.totalHulls();
	
	simsDone = 0;
	totalQuota = parseInt(document.getElementById("numSims").value);
	
	lockControls(true);
	
	simHandle = setInterval(performSimCycle, 125);
}

function getOneValue(arrObj, ct) {
	return arrObj.filter( function(value) {return value == ct} );
}

function stopSeriesEarly() {
	if (totalQuota > simsDone) {
		totalQuota = Math.min(simsDone + 50,totalQuota); 
	}
}

function lockControls(flag) {
	var inputsCollection = document.getElementsByTagName("input");
	for (a in inputsCollection) {
		if (inputsCollection[a].id && (inputsCollection[a].id != "Boarding ShipAtk" &&
			inputsCollection[a].id != "techAlien" && inputsCollection[a].id != "repGunnery" &&
			(!inputsCollection[a].id.startsWith("Type") || inputsCollection[a].id.endsWith("Qty")))) {
			inputsCollection[a].disabled = flag;
		}
	}

	inputsCollection = document.getElementsByTagName("button");
	for (b in inputsCollection) {
		if (inputsCollection[b].id == "stopSeries") {
			inputsCollection[b].disabled = !flag;
		} else {
			inputsCollection[b].disabled = flag;
		}
	}

	inputsCollection = document.getElementsByTagName("select");
	for (c in inputsCollection) {
		if (inputsCollection[c].id && inputsCollection[c].id != "plrAdvantage") {
			inputsCollection[c].disabled = flag;
		}
	}
	
	if (!flag) {
		showPlrRows();
	}
}

function performSimCycle() {
	var simsPerCycle = Math.max(135 - multiHighPlr - multiHighRep, 15);
	
	if (simsDone + simsPerCycle + 2 <= totalQuota) {
		simsDone = simsDone + simsPerCycle;
		runSimBattles(simsPerCycle);
	} else {
		if (simsDone < totalQuota) {
			runSimBattles(totalQuota - simsDone);
		}
		simsDone = totalQuota;
		clearInterval(simHandle);
	
		lockControls(false);
	}

	var midPoint = Math.ceil(simsDone/2);
	gamesLeft = 0;
	clearResults(true);

	divFrag = document.createElement("div");
	var successRate = (multiWins / simsDone * 100).toFixed(2);
	
	pFrag = document.createElement("p");
	pFrag.innerHTML = "<label for=\"simProg\">"+simsDone+" battles complete.</label> Summary: "+multiWins+ " wins / "+multiLosses+" losses / "+multiDraws+" draws. Success Rate: "+successRate+"% <br />\
		<progress style=\"width: 100%;\" id=\"simProg\" value=\""+simsDone+"\" max=\""+totalQuota+"\"></progress>";
	divFrag.appendChild(pFrag);
	
	if (multiWins > 0) {
		var avgShips = (multiPlrShips / multiWins).toFixed(2);
		
		if (multiWins > midPoint) {
			gamesLeft = midPoint - (multiLosses + multiDraws);
		}
		
		pFrag = document.createElement("p");
		pFrag.innerHTML = avgShips + " player ships survive a win on average.";
		ulFrag = document.createElement("ul");
		for (w = 1; w <= multiHighPlr; w++) {
			var outcomeCount = getOneValue(plrShipCount, w).length;
			
			if (outcomeCount > 0) {
				liFrag = document.createElement("li");
				if (gamesLeft > 0) {
					if (gamesLeft > outcomeCount) {
						gamesLeft = gamesLeft - outcomeCount;
					} else {
						liFrag.className = "median";
						gamesLeft = 0;
					}
				}
				liFrag.innerHTML = getPhrase("ship", w)+" left: "+getPhrase("time", outcomeCount)
				ulFrag.appendChild(liFrag);
			}
		}
		pFrag.appendChild(ulFrag);
		divFrag.appendChild(pFrag);
	}
	
	if (multiLosses > 0) {
		var avgHulls = (multiRepShips / multiLosses).toFixed(2);
		
		if (multiLosses > midPoint) {
			gamesLeft = midPoint - (multiWins + multiDraws);
		}
		
		pFrag = document.createElement("p");
		pFrag.innerHTML = avgHulls + " replicator hulls survive a loss on average.";
		
		ulFrag = document.createElement("ul");
		for (l = 1; l <= multiHighRep; l++) {
			var outcomeCount = getOneValue(repHullCount, l).length;
			
			if (outcomeCount > 0) {
				liFrag = document.createElement("li");
				if (gamesLeft > 0) {
					if (gamesLeft >= outcomeCount) {
						gamesLeft = gamesLeft - outcomeCount;
					} else {
						liFrag.className = "median";
						gamesLeft = 0;
					}
				}
				liFrag.innerHTML = getPhrase("hull", l)+" left: "+getPhrase("time", outcomeCount)
				ulFrag.appendChild(liFrag);
			}
		}
		pFrag.appendChild(ulFrag);
		divFrag.appendChild(pFrag);
	}
	
	grandBody.appendChild(divFrag);
}

function runSimBattles(simCount) {
	simMulti = (simCount > 1);
	grandBody = document.getElementsByTagName("body")[0];

	// Settings
	repAggresor = (document.getElementById("aggressor").selectedIndex == 1);
	titanTarget = document.getElementById("titanTarget").selectedIndex;
	plrFlagPreserve = document.getElementById("plrFlagPreserve").selectedIndex;
	repsTrapped = (!document.getElementById("repRetreat").checked);
	
	clearResults(true);

	for (var x = 0; x < simCount; x++) {
		simPlrFleet = new playerFleet();
		simRepFleet = new replicatorFleet();
		
		clearResults(false);
		
		if (simPlrFleet.totalShips() == 0) {
			divFrag = document.createElement("div");
			pFrag = document.createElement("p");
			pFrag.innerHTML = "No player ships detected. Sequence aborted.";
			
			if (simMulti) {
				simsDone = totalQuota;
				multiDraws = totalQuota;
			}

			divFrag.appendChild(pFrag);
			grandBody.appendChild(divFrag);
			break;
		} else if (simRepFleet.totalShips() == 0) {
			divFrag = document.createElement("div");
			pFrag = document.createElement("p");
			pFrag.innerHTML = "No replicator ships detected. Sequence aborted.";
			
			if (simMulti) {
				simsDone = totalQuota;
				multiDraws = totalQuota;
			}

			divFrag.appendChild(pFrag);
			grandBody.appendChild(divFrag);
			break;
		}
		
		while (simPlrFleet.totalShips() > 0 && simRepFleet.totalShips() > 0) {
			runSimRound();
		}
	}
}

