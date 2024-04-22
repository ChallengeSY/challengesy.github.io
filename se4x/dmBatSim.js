function setupSim() {
	setupBox();
	
	//Basic ships
	addPlayerRow("Scout",3,"E",0,1);
	addPlayerRow("Destroyer",4,"D",0,1);
	addPlayerRow("Cruiser",4,"C",1,2);
	addPlayerRow("Battlecruiser",5,"B",1,2);
	addPlayerRow("Battleship",5,"A",2,3);
	addPlayerRow("Dreadnought",6,"A",3,3);
	addPlayerRow("Ship Yard",3,"C",0,1);
	addPlayerRow("Base",7,"A",2,3);
	
	//Advanced ships
	addPlayerRow("Carrier",3,"E",0,1);
	addPlayerRow("Battle Carrier",5,"B",1,3); //Replicators ship added out of order for threat reasons
	addPlayerRow("Fighters",5,"B",0,1);
	addPlayerRow("Mines",0,"A",0,0);
	addPlayerRow("Raider",4,"D",0,2);
	addPlayerRow("Minesweeper",1,"E",0,1);
	
	//NPA ships
	addPlayerRow("Alien-D",4,"D",1,1);
	addPlayerRow("Alien-C",5,"C",2,1);
	addPlayerRow("Alien-B",6,"B",2,1);
	
	//Close Encounters ships
	addPlayerRow("Flagship",4,"B",1,3);
	addPlayerRow("Boarding Ship",1,"F",0,1);
	addPlayerRow("Transport",1,"E",1,1);
	addPlayerRow("Titan",7,"A",3,5);
	
	//Replicators ships
	addPlayerRow("DestroyerX",4,"D",0,2);
	addPlayerRow("Advanced Flagship",5,"A",3,3);
	addPlayerRow("RaiderX",4,"D",0,3);
	
	document.getElementById("FightersAtk").max = 9;
	document.getElementById("FightersDef").max = 3;
	document.getElementById("RaiderAtk").max = 7;
	disableCustomization("Alien-D");
	disableCustomization("Alien-C");
	disableCustomization("Alien-B");
	document.getElementById("Boarding ShipAtk").max = 1;
	document.getElementById("Boarding ShipAtk").disabled = true;
	document.getElementById("TransportDef").max = 3;
	document.getElementById("DestroyerXSize").innerHTML = 1;
	document.getElementById("RaiderXAtk").max = 8;
	document.getElementById("RaiderXSize").innerHTML = 2;
	showPlrRows();
	computeHitChances(true);
}

function disableCustomization(dsgnName) {
	document.getElementById(dsgnName+"Atk").max = document.getElementById(dsgnName+"Atk").min;
	document.getElementById(dsgnName+"Atk").disabled = true;
	document.getElementById(dsgnName+"Def").disabled = true;
	document.getElementById(dsgnName+"Tac").min = 1;
	document.getElementById(dsgnName+"Tac").max = document.getElementById(dsgnName+"Tac").min;
	document.getElementById(dsgnName+"Tac").value = document.getElementById(dsgnName+"Tac").min;
	document.getElementById(dsgnName+"Tac").disabled = true;
}

function makeFieldSensitive(obj) {
	obj.addEventListener("blur", computeHitChances);
	obj.addEventListener("change", computeHitChances);
}

function addPlayerRow(namee, baseAtk, atkClass, baseDef, sizee) {
	var playerBody = document.getElementById("plrShips");
	
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
	makeFieldSensitive(inputFrag);
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
		makeFieldSensitive(inputFrag);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Hit chance field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric bigScreen";
		tdFrag.id = namee+"Hit";
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
		makeFieldSensitive(inputFrag);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Miss chance field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric bigScreen";
		tdFrag.id = namee+"Miss";
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
		makeFieldSensitive(inputFrag);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Hidden Hull Size field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric invisible";
		tdFrag.id = namee+"Size";
		tdFrag.innerHTML = sizee;
		trFrag.appendChild(tdFrag);
		
		//Threat field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric bigScreen";
		tdFrag.id = namee+"Aggro";
		trFrag.appendChild(tdFrag);
	} else {
		// Attack/Defense/Tactics/Size/Threat fields empty
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric bigScreen";
		tdFrag.id = namee + "Hit";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		tdFrag = document.createElement("td");
		tdFrag.className = "bigScreen";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "bigScreen";
		trFrag.appendChild(tdFrag);
	}
	
	playerBody.appendChild(trFrag);
}

function showPlrRows(rowId, rowVis) {
	if (rowId) {
		var workRow = document.getElementById(rowId);
		
		if (workRow) {
			if (rowVis) {
				workRow.style.display = "";
			} else {
				workRow.style.display = "none";
			}
		}
	} else {
		var sizeTech, ftrTech, cloakTech;
		
		sizeTech = parseInt(document.getElementById("techSize").value);
		ftrTech = parseInt(document.getElementById("techFtr").value);
		cloakTech = parseInt(document.getElementById("techClk").value);
		CEtech = document.getElementById("techCE").checked;
		advConTech = parseInt(document.getElementById("techAC").value);
		
		showPlrRows("DestroyerRow", sizeTech >= 2);
		showPlrRows("BaseRow", sizeTech >= 2);
		showPlrRows("CruiserRow", sizeTech >= 3);
		showPlrRows("BattlecruiserRow", sizeTech >= 4);
		showPlrRows("BattleshipRow", sizeTech >= 5);
		showPlrRows("DreadnoughtRow", sizeTech >= 6);
		
		showPlrRows("CarrierRow", ftrTech > 0);
		showPlrRows("FightersRow", ftrTech > 0);
		
		showPlrRows("RaiderRow", cloakTech > 0);

		showPlrRows("FlagshipRow", CEtech);
		showPlrRows("Boarding ShipRow", CEtech);
		showPlrRows("TransportRow", CEtech);
		showPlrRows("TitanRow", sizeTech >= 7 && CEtech);

		showPlrRows("DestroyerXRow", sizeTech >= 2 && advConTech >= 1);
		showPlrRows("Battle CarrierRow", ftrTech > 0 && advConTech >= 2);
		showPlrRows("RaiderXRow", cloakTech > 0 && advConTech >= 3);
		showPlrRows("Advanced FlagshipRow", CEtech && advConTech >= 3);
	}
}

function getDMspecs() {
	dmStr = parseInt(document.getElementById("dmStr").value);
	dmWeak = document.getElementById("dmWek").selectedIndex;
	dmAtk = Math.ceil(dmStr/2) + 6;
	dmDef = Math.min(Math.ceil((dmStr+1)/3),4);
	dmSize = Math.floor(dmStr/2) + 6;
	dmAggressor = document.getElementById("dmAggro").checked;
	dmThresh = [15,11];
	dmDmgInit = document.getElementById("dmDmg").value;
	var combatChoices = document.getElementsByName("combatHex");
	for (c in combatChoices) {
		if (combatChoices[c].checked) {
			combatHex = combatChoices[c].id;
		}
	}

	switch (dmStr) {
		case 0:
			// Multiplayer specs
			dmAtk = 9;
			dmClass = "C";
			dmDef = 2;
			dmSize = 3;
			dmRolls = 2;
			break;
		case 1:
			dmClass = "D";
			dmRolls = 3;
			break;
		case 2:
			// Fall through until 4
		case 3:
		case 4:
			dmClass = "C";
			dmRolls = 4;
			break;
		case 5:
			// Fall through
		case 6:
			dmClass = "B";
			dmRolls = 5;
			break;
		case 7:
			dmClass = "B";
			dmRolls = 6;
			break;
		default:
			dmClass = "A";
			dmRolls = 6;
			
			// Diminishing returns on Def and number of rolls
			while (dmDef < 6 && dmStr >= dmThresh[0]) {
				dmThresh[0] = dmThresh[0] + (dmDef++ * 2);
				dmAtk--;
			}
			while (dmStr >= dmThresh[1]) {
				dmThresh[1] = dmThresh[1] + dmRolls++;
				dmAtk--;
			}
			
			break;
	}
	
	// Made the DM undo its Atk loss for a size
	if (dmStr == 24) {
		dmAtk++;
		dmSize--;
	}
	
	// Beyond Attack 14 is virtually pointless; a DM that rolls a 10 automatically misses, no matter how high its Atk
	if (dmAtk > 14) {
		dmSize = dmSize + dmAtk - 14;
		dmAtk = 14;
	}
	
	if (combatHex == "hexNebula") {
		dmClass = "E";
	}
	
	document.getElementById("dmAtk").innerHTML = dmClass + dmAtk;
	document.getElementById("dmDef").innerHTML = dmDef;
	document.getElementById("dmSize").innerHTML = dmSize;
	document.getElementById("dmRoll").innerHTML = dmRolls;
	document.getElementById("dmDmg").max = dmSize - 1;
	dmDmgInit = Math.min(dmDmgInit, dmSize - 1);
	document.getElementById("dmDmg").value = dmDmgInit;
}

function computeHitChances(refreshDM) {
	var preserveWeak = 0;
	
	if (refreshDM) {
		getDMspecs();
	} else {
		preserveWeak = dmWeak;
		dmWeak = simDM.weakness;
	}
	
	var readId = "", fleetSize = 0, readQty = 0, readAtk = 0, hitChance = 0, readDef = 0, evaChance = 0, hullSize, dmThreat = 0, bonus = false;
	
	hitCells = document.getElementsByTagName("td");
	for (h in hitCells) {
		try {
			if (hitCells[h].id) {
				bonus = false;
				if (hitCells[h].id == "MinesHit") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 3) + "Qty";
					readQty = document.getElementById(readId).value;

					hitChance = (dmWeak == 2 ? 50 : -10);
					bonus = (dmWeak == 2);
					hitCells[h].innerHTML = hitChance + "%";
					hitCells[h].className = "numeric bigScreen" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id == "FightersAggro") {
					dmThreat = Math.max(parseInt(document.getElementById("CarrierAggro").innerHTML), parseInt(document.getElementById("Battle CarrierAggro").innerHTML));
					if (hitChance > 0) {
						dmThreat = dmThreat + Math.pow(1+Math.floor(hitChance/10),3-(hullSize-1)/2) + Math.pow(10-(Math.max(evaChance,10)/10),2.2);
						bonus = true;
					}
					
					hitCells[h].innerHTML = Math.round(dmThreat);
					hitCells[h].className = "numeric bigScreen" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-3,3) == "Hit") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 3) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Atk";
					if (combatHex == "hexAsteroids") {
						if (readId == "FightersAtk") {
							readAtk = Math.min(parseInt(document.getElementById(readId).value),parseInt(document.getElementById(readId).max)-1);
						} else if (readId == "RaiderAtk") {
							readAtk = Math.min(parseInt(document.getElementById(readId).value),parseInt(document.getElementById(readId).max)-2);
						} else {
							readAtk = document.getElementById(readId).min;
						}
					} else {
						readAtk = document.getElementById(readId).value;
					}
					
					hitChance = (readAtk - dmDef) * 10;
					
					if (readId == "FightersAtk") {
						if (dmWeak != 1) {
							hitChance = -10;
						} else {
							bonus = true;
						}
					} else if (readId == "RaiderAtk") {
						bonus = (dmWeak == 3 && combatHex != "hexNebula");
					}
					
					hitCells[h].innerHTML = hitChance + "%";
					hitCells[h].className = "numeric bigScreen" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-4,4) == "Miss") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 4) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Def";
					if (combatHex == "hexNebula") {
						if (readId == "FightersDef") {
							readAtk = Math.min(parseInt(document.getElementById(readId).value),parseInt(document.getElementById(readId).max)-1);
						} else {
							readDef = document.getElementById(readId).min;
						}
					} else {
						readDef = document.getElementById(readId).value;
					}
					
					evaChance = (10 - (dmAtk - readDef)) * 10;

					if (readId == "RaiderDef" && dmWeak == 3) {
						evaChance = Math.min(evaChance + 20,90);
						bonus = true;
					}
					
					hitCells[h].innerHTML = evaChance + "%";
					hitCells[h].className = "numeric bigScreen" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-5,5) == "Aggro") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 5) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Hit";
					hitChance = parseInt(document.getElementById(readId).innerHTML);
					readId = readId.substr(0, readId.length - 3) + "Size";
					hullSize = parseInt(document.getElementById(readId).innerHTML);
					readId = readId.substr(0, readId.length - 4) + "Miss";
					evaChance = parseInt(document.getElementById(readId).innerHTML);
					
					dmThreat = 10 - hullSize;
					if (hitChance > 0) {
						dmThreat = dmThreat + Math.pow(1+Math.floor(hitChance/10),3-(hullSize-1)/2) + Math.pow(10-(Math.max(evaChance,10)/10),2.2);
					
						if (dmWeak == 4) {
							dmThreat = dmThreat * Math.max(Math.pow(3.5-hullSize,2),1);
							bonus = (hullSize < 3);
						}
					}
					
					hitCells[h].innerHTML = Math.round(dmThreat);
					hitCells[h].className = "numeric bigScreen" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				}
			}
		} catch(err) {
			if (hitCells[h].id) {
				console.error("Error reading ID " + hitCells[h].id);
				console.log(err);
			} else {
				console.error("Error reading: " + hitCells[h]);
			}
		}
	}
	
	if (!refreshDM) {
		dmWeak = preserveWeak;
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
			if (techCells[t].id && !techCells[t].disabled) {
				if (techCells[t].id == "FightersAtk") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,1) + Math.min(ftrBonus,3);
				} else if (techCells[t].id == "FightersDef") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,1) + Math.max(ftrBonus-2,0);
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
	
	computeHitChances(true);
}

function emptyPlrFleet() {
	techCells = document.getElementsByTagName("input");
	
	for (t in techCells) {
		try {
			if (techCells[t].id && !techCells[t].disabled) {
				if (techCells[t].id.endsWith("Qty")) {
					techCells[t].value = 0;
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
	
	computeHitChances(true);
}

/* ------------------------------------------------------------------------- */

//Object
function playerShip(baseID) {
	this.namee = baseID;
	this.quantity = parseInt(document.getElementById(baseID + "Qty").value);
	this.damage = 0;
	this.destroyed = false;
	
	this.updateSpecs = function() {
		this.attackRating = parseInt(document.getElementById(baseID + "Hit").innerHTML) / 10;
		if (baseID == "Mines") {
			this.hullSize = 0;
			this.defenseRating = 0;
			this.tactics = 0;
		} else {
			this.defenseRating = parseInt(document.getElementById(baseID + "Miss").innerHTML) / 10;
			this.tactics = parseInt(document.getElementById(baseID + "Tac").value);
			this.threat = (this.quantity > 0 ? parseInt(document.getElementById(baseID + "Aggro").innerHTML) : 0);
			this.hullSize = parseInt(document.getElementById(baseID + "Size").innerHTML);
		}
	}

	this.updateSpecs();
	
	this.hitShip = function() {
		this.damage++;
		while (this.damage >= this.hullSize) {
			this.damage = this.damage - this.hullSize;
			this.quantity--;
			
			if (this.quantity <= 0) {
				this.destroyed = true;
				this.threat = 0;
				break;
			}
		}	
	}
	
	this.getEligibleCount = function() {
		return (this.attackRating > 0 ? this.quantity : 0);
	}
	
	this.toString = function() {
		let totalHP = this.hullSize * this.quantity - this.damage;
		
		return this.namee + " group (count " + this.quantity + " / HP total " + totalHP + ")";
	}
}

function playerFleet() {
	var baseID;
	
	//Basic
	this.scouts = new playerShip("Scout");
	this.destroyers = new playerShip("Destroyer");
	this.cruisers = new playerShip("Cruiser");
	this.battlecruisers = new playerShip("Battlecruiser");
	this.battleships = new playerShip("Battleship");
	this.dreadnoughts = new playerShip("Dreadnought");
	this.shipYards = new playerShip("Ship Yard");
	this.starbases = new playerShip("Base");
	//Advanced
	this.carriers = new playerShip("Carrier");
	this.fighters = new playerShip("Fighters");
	this.mines = new playerShip("Mines");
	this.raiders = new playerShip("Raider");
	this.minesweepers = new playerShip("Minesweeper");
	//NPA
	this.alienD = new playerShip("Alien-D");
	this.alienC = new playerShip("Alien-C");
	this.alienB = new playerShip("Alien-B");
	//Close Encounters
	this.flagships = new playerShip("Flagship");
	this.boardingShips = new playerShip("Boarding Ship");
	this.transports = new playerShip("Transport");
	this.titans = new playerShip("Titan");
	//Replicators
	this.destroyerXes = new playerShip("DestroyerX");
	this.battleCarriers = new playerShip("Battle Carrier");
	this.advancedFlagships = new playerShip("Advanced Flagship");
	this.raiderXes = new playerShip("RaiderX");
	
	this.totalShips = function() {
		return this.scouts.quantity + this.destroyers.quantity + this.cruisers.quantity + this.battlecruisers.quantity +
			this.battleships.quantity + this.dreadnoughts.quantity + this.shipYards.quantity + this.starbases.quantity +
			this.carriers.quantity + this.fighters.quantity + this.mines.quantity + this.raiders.quantity + this.minesweepers.quantity +
			this.alienD.quantity + this.alienC.quantity + this.alienB.quantity +
			this.flagships.quantity + this.boardingShips.quantity + this.transports.quantity + this.titans.quantity +
			this.destroyerXes.quantity + this.battleCarriers.quantity + this.advancedFlagships.quantity + this.raiderXes.quantity;
	}
	
	this.totalAtkShips = function() {
		return this.scouts.getEligibleCount() + this.destroyers.getEligibleCount() + this.cruisers.getEligibleCount() + this.battlecruisers.getEligibleCount() +
			this.battleships.getEligibleCount() + this.dreadnoughts.getEligibleCount() + this.shipYards.getEligibleCount() + this.starbases.getEligibleCount() +
			this.carriers.getEligibleCount() + this.fighters.getEligibleCount() + this.raiders.getEligibleCount() + this.minesweepers.getEligibleCount() +
			this.alienD.getEligibleCount() + this.alienC.getEligibleCount() + this.alienB.getEligibleCount() +
			this.flagships.getEligibleCount() + this.boardingShips.getEligibleCount() + this.transports.getEligibleCount() + this.titans.getEligibleCount() +
			this.destroyerXes.getEligibleCount() + this.battleCarriers.getEligibleCount() + this.advancedFlagships.getEligibleCount() + this.raiderXes.getEligibleCount();
	}
	
	this.highestAggro = function() {
		return Math.max(this.scouts.threat, this.destroyers.threat, this.cruisers.threat, this.battlecruisers.threat, 
			this.battleships.threat, this.dreadnoughts.threat, this.shipYards.threat, this.starbases.threat, 
			this.carriers.threat, this.fighters.threat, this.raiders.threat, this.minesweepers.threat,
			this.alienB.threat, this.alienC.threat, this.alienD.threat,
			this.flagships.threat, this.boardingShips.threat, this.transports.threat, this.titans.threat,
			this.destroyerXes.threat, this.battleCarriers.threat, this.advancedFlagships.threat, this.raiderXes.threat);
	}
	
	this.targetHighest = function() {
		let highestThreat = this.highestAggro();
		
		if (this.flagships.threat == highestThreat) {
			return this.flagships;
		}

		if (this.advancedFlagships.threat == highestThreat) {
			return this.advancedFlagships;
		}

		if (this.shipYards.threat == highestThreat) {
			return this.shipYards;
		}

		if (this.alienB.threat == highestThreat) {
			return this.alienB;
		}

		if (this.alienC.threat == highestThreat) {
			return this.alienC;
		}

		if (this.alienD.threat == highestThreat) {
			return this.alienD;
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

//Object
function doomsdayMachine() {
	this.hitPoints = dmSize - dmDmgInit;
	if (dmRolls > 2) {
		this.weakness = dmWeak;
	} else {
		this.weakness = 5;
	}
	
	this.toString = function() {
		return "Doomsday Machine (" + this.hitPoints + " HP)";
	}
}

function rollD10() {
	return 1 + Math.floor(Math.random()*10);
}

function clearResults(removeDivs) {
	simRound = 0;
	largeFleetBonus = 0;
	largeFleetMemory = 0;
	
	if (removeDivs) {
		roundsCollected = document.getElementsByTagName("div");
		for (i = 0; i < roundsCollected.length; i++) {
			if (roundsCollected[i].id != "infobox") {
				roundsCollected[i--].remove();
			}
		}
	}
}

function fireDMweps() {
	var targetNamee = null;
	var dieRoll = 0;
	
	if (simDM.hitPoints > 0 && simFleet.totalShips() > 0) {
		while (numDmAttacks > 0) {
			if (simFleet.totalShips() > 0) {
				targetShip = simFleet.targetHighest();
			}
			if (targetShip.namee != targetNamee) {
				if (targetNamee) {
					divFrag.appendChild(pFrag);
				}
				
				targetNamee = targetShip.namee;
				pFrag = document.createElement("p");
				pFrag.innerHTML = simDM.toString() + " rolls against " + targetShip.toString() + ":";
			}
			
			dieRoll = rollD10();
			
			if (dieRoll < 10 && dieRoll <= 10 - targetShip.defenseRating) {
				pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
				targetShip.hitShip();
			} else {
				pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
			}
		
			if (targetShip.destroyed && simFleet.totalShips() > 0) {
				targetShip.destroyed = false;
				
				if (!simMulti) {
					divFrag.appendChild(pFrag);
					pFrag = document.createElement("p");
					pFrag.innerHTML = targetNamee + " group has been destroyed!";
				}
			}
			
			numDmAttacks--;
		}
		
		if (targetShip.destroyed && simFleet.totalShips() <= 0) {
			targetShip.destroyed = false;
			
			if (!simMulti) {
				divFrag.appendChild(pFrag);
				pFrag = document.createElement("p");
				pFrag.innerHTML = targetNamee + " group has been destroyed!";
			}
		}
		
		if (!simMulti && targetNamee) {
			divFrag.appendChild(pFrag);
		}
	}
}

function fireWepClass(letter) {
	// Fires all weapons belonging to the class
	
	for (var t = 3; t >= 0; t--) {
		if (dmClass == letter && t == 2 && !dmAggressor) {
			fireDMweps();
		}
		
		switch (letter) {
			case "A":
				firePlrWeps(simFleet.starbases, t);
				firePlrWeps(simFleet.titans, t);
				firePlrWeps(simFleet.dreadnoughts, t);
				firePlrWeps(simFleet.battleships, t);
				firePlrWeps(simFleet.advancedFlagships, t);
				if (simDM.weakness == 3 && combatHex != "hexNebula") {
					firePlrWeps(simFleet.raiders, t);
					firePlrWeps(simFleet.raiderXes, t);
				}
				break;

			case "B":
				firePlrWeps(simFleet.flagships, t);
				firePlrWeps(simFleet.battlecruisers, t);
				firePlrWeps(simFleet.fighters, t);
				firePlrWeps(simFleet.alienB, t);
				firePlrWeps(simFleet.battleCarriers, t);
				break;

			case "C":
				firePlrWeps(simFleet.cruisers, t);
				firePlrWeps(simFleet.shipYards, t);
				firePlrWeps(simFleet.alienC, t);
				break;

			case "D":
				firePlrWeps(simFleet.destroyers, t);
				firePlrWeps(simFleet.destroyerXes, t);
				firePlrWeps(simFleet.alienD, t);
				if (simDM.weakness != 3 || combatHex == "hexNebula") {
					firePlrWeps(simFleet.raiders, t);
					firePlrWeps(simFleet.raiderXes, t);
				}
				break;

			case "E":
				firePlrWeps(simFleet.carriers, t);
				firePlrWeps(simFleet.minesweepers, t);
				firePlrWeps(simFleet.scouts, t);
				firePlrWeps(simFleet.transports, t);
				break;

			case "F":
				firePlrWeps(simFleet.boardingShips, t);
				break;
		}
		
		if (dmClass == letter && t == 2) {
			fireDMweps();
		}
	}
}

function fireTacticsLv(tacLv) {
	// Fires all weapons belonging to the Tactics Lv. (DM is Tactics Lv 2.)
	
	if (tacLv == 2 && !dmAggressor) {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.starbases, tacLv);
	firePlrWeps(simFleet.titans, tacLv);
	firePlrWeps(simFleet.dreadnoughts, tacLv);
	firePlrWeps(simFleet.battleships, tacLv);
	firePlrWeps(simFleet.advancedFlagships, tacLv);

	firePlrWeps(simFleet.flagships, tacLv);
	firePlrWeps(simFleet.battlecruisers, tacLv);
	firePlrWeps(simFleet.fighters, tacLv);
	firePlrWeps(simFleet.alienB, tacLv);
	firePlrWeps(simFleet.battleCarriers, tacLv);
	
	firePlrWeps(simFleet.cruisers, tacLv);
	firePlrWeps(simFleet.shipYards, tacLv);
	firePlrWeps(simFleet.destroyers, tacLv);
	firePlrWeps(simFleet.destroyerXes, tacLv);
	firePlrWeps(simFleet.raiders, tacLv);
	firePlrWeps(simFleet.raiderXes, tacLv);
	firePlrWeps(simFleet.alienC, tacLv);
	firePlrWeps(simFleet.alienD, tacLv);
	
	firePlrWeps(simFleet.carriers, tacLv);
	firePlrWeps(simFleet.minesweepers, tacLv);
	firePlrWeps(simFleet.scouts, tacLv);
	firePlrWeps(simFleet.transports, tacLv);
	
	if (tacLv == 2) {
		fireDMweps();
	}
	
	if (tacLv == 0) {
		firePlrWeps(simFleet.boardingShips, -1);
	}
}

function firePlrWeps(shipObj, tacLvReq) {
	if (shipObj.quantity > 0 && (shipObj.tactics == tacLvReq || tacLvReq < 0) && simDM.hitPoints > 0) {
		shipObj.updateSpecs();
		if (simRound == 1 && shipObj.namee == "Raider" && simDM.weakness == 3 && combatHex != "hexNebula") {
			shipObj.attackRating++;
		}
		
		if (simRound > 1 && simFleet.totalAtkShips() < retreatThresh && shipObj.namee != "Titan" && shipObj.namee != "Ship Yard" && shipObj.namee != "Base") {
			pFrag = document.createElement("p");
			pFrag.innerHTML = shipObj.toString() + " has retreated.";
			shipObj.quantity = 0;
			shipObj.threat = 0;

			if (!simMulti) {
				divFrag.appendChild(pFrag);
			}
		} else if (shipObj.attackRating + largeFleetBonus > 0 || simDM.weakness == 0) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = shipObj.toString() + " rolls against " + simDM.toString() + ":";
			
			for (i = shipObj.quantity; i > 0; i--) {
				dieRoll = rollD10();
				
				if (dieRoll <= 1 || dieRoll <= shipObj.attackRating + largeFleetBonus) {
					pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
					if (shipObj.namee == "Titan") {
						simDM.hitPoints--;
					}
					simDM.hitPoints--;
				} else {
					pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
				}
				
				if (shipObj.namee == "Mines") {
					shipObj.quantity--;
					
					if (simDM.hitPoints <= 0) {
						break;
					}
				}
			}
			
			if (!simMulti) {
				divFrag.appendChild(pFrag);
			
				if (simDM.hitPoints <= 0) {
					pFrag = document.createElement("p");
					pFrag.innerHTML = "Doomsday Machine has been destroyed!";
					divFrag.appendChild(pFrag);
				}
			}
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = shipObj.toString() + " unable to damage " + simDM.toString() + ".";
			if (simRound > 1 && shipObj.namee != "Titan" && shipObj.namee != "Ship Yard" && shipObj.namee != "Base" && shipObj.namee != "Fighters" && (shipObj.namee != "Carrier" || simDM.weakness != 1)) {
				pFrag.innerHTML = pFrag.innerHTML + " Group has retreated";
				shipObj.quantity = 0;
				shipObj.threat = 0;
				
				if (shipObj.namee == "Carrier") {
					simFleet.fighters.quantity = 0;
					simFleet.fighters.threat = 0;
				}
			} else {
				pFrag.innerHTML = pFrag.innerHTML + " Rolls skipped";
				if (shipObj.namee == "Mines") {
					shipObj.quantity = 0;
				}
			}

			if (!simMulti) {
				divFrag.appendChild(pFrag);
			}
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
				pFrag.innerHTML = shipObj.toString() + " has been destroyed!";
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
	numDmAttacks = dmRolls;
	simRound++;
	grandBody = document.getElementsByTagName("body")[0];
	
	divFrag = document.createElement("div");
	
	if (simRound == 1) {
		retreatThresh = parseInt(document.getElementById("retreatThresh").value);
	
		if (!dmAggressor) {
			excludeGroup(simFleet.mines);
			excludeGroup(simFleet.starbases);
			excludeGroup(simFleet.shipYards);
			
			if (combatHex == "hexBlackHole") {
				rollBHsurvival(simFleet.titans);
				rollBHsurvival(simFleet.dreadnoughts);
				rollBHsurvival(simFleet.battleships);
				rollBHsurvival(simFleet.raiders);
				
				rollBHsurvival(simFleet.flagships);
				rollBHsurvival(simFleet.battlecruisers);
				rollBHsurvival(simFleet.alienB);

				rollBHsurvival(simFleet.alienC);
				rollBHsurvival(simFleet.cruisers);
				
				rollBHsurvival(simFleet.alienD);
				rollBHsurvival(simFleet.destroyers);
				
				rollBHsurvival(simFleet.carriers);
				rollBHsurvival(simFleet.minesweepers);
				rollBHsurvival(simFleet.scouts);
				
				rollBHsurvival(simFleet.transports);
				rollBHsurvival(simFleet.boardingShips);
				
				simFleet.fighters.quantity = Math.min(simFleet.fighters.quantity, simFleet.carriers.quantity * 3);
			}
		}
	}
	
	if (simDM.weakness == 0 && simFleet.totalShips() > 0) {
		dieRoll = rollD10();
		simDM.weakness = Math.ceil(dieRoll/2);
		
		if (!simMulti) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = simDM.toString() + " rolls for weakness: " + dieRoll + " (";
			switch (simDM.weakness) {
				case 1:
					pFrag.innerHTML = pFrag.innerHTML + "Weak to Fighters)";
					break;
				case 2:
					pFrag.innerHTML = pFrag.innerHTML + "Weak to Mines)";
					break;
				case 3:
					pFrag.innerHTML = pFrag.innerHTML + "Weak to Cloaking)";
					break;
				case 4:
					pFrag.innerHTML = pFrag.innerHTML + "Weak to Large Fleets)";
					break;
				case 5:
					pFrag.innerHTML = pFrag.innerHTML + "No weakness found)";
					break;
			}
			
			divFrag.appendChild(pFrag);
		}
		computeHitChances(false);
	}

	largeFleetBonus = (simFleet.totalAtkShips() >= 10 && simDM.weakness == 4 ? 1 : 0);
	if (!simMulti) {
		if (largeFleetBonus != largeFleetMemory) {
			if (largeFleetBonus > 0) {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Large fleet detected. Attack Bonus +1 active!";
				divFrag.appendChild(pFrag);
			} else {
				pFrag = document.createElement("p");
				pFrag.innerHTML = "Fleet has shrunk below the required threshold. Attack Bonus +1 lost";
				divFrag.appendChild(pFrag);
			}
			
			largeFleetMemory = largeFleetBonus;
		}
	}
	
	if (!simMulti && simDM.weakness == 3 && simFleet.raiders.quantity > 0 && simRound == 1) {
		pFrag = document.createElement("p");
		pFrag.innerHTML = simFleet.raiders.toString() + " successfully ambushes " + simDM.toString() + ": Attack Bonus +1 for the first round! Defense Bonus +2 for the battle!";
		divFrag.appendChild(pFrag);
	}

	simFleet.raiders.updateSpecs();

	firePlrWeps(simFleet.mines, false);
	
		
	if (combatHex == "hexNebula") {
		// DM is just as affected by this penalty as the Player fleet.
		for (var h = 3; h >= 0; h--) {
			fireTacticsLv(h);
		}
	} else {
		if (combatHex == "hexAsteroids") {
			// DM is immune to this penalty. It always goes first.
			fireDMweps();
		}
		
		fireWepClass("A");
		fireWepClass("B");
		fireWepClass("C");
		fireWepClass("D");
		fireWepClass("E");
		fireWepClass("F");
	}
	
	if (simFleet.totalShips() <= 0 && simDM.hitPoints <= 0) {
		if (simMulti) {
			multiDraws++;
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Both sides have been destroyed!";

			divFrag.appendChild(pFrag);
		}
	} else if (simFleet.totalShips() <= 0) {
		if (simMulti) {
			multiLosses++;
			multiDMhp = multiDMhp + simDM.hitPoints;
			dmHPcount.push(simDM.hitPoints);
		} else {
			pFrag = document.createElement("p");
			pFrag.innerHTML = simDM.toString() + " has won the battle.";

			divFrag.appendChild(pFrag);
		}
	} else if (simDM.hitPoints <= 0) {
		if (simMulti) {
			multiWins++;
			multiPlrShips = multiPlrShips + simFleet.totalShips();
			plrShipCount.push(simFleet.totalShips());
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
	multiDMhp = 0;
	multiDraws = 0;
	
	plrShipCount = new Array();
	dmHPcount = new Array();
	
	simFleet = new playerFleet();
	simDM = new doomsdayMachine();
	
	multiHighShips = simFleet.totalShips();
	multiHighDMhp = simDM.hitPoints;	
	
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
		totalQuota = Math.min(simsDone + 101,totalQuota); 
	}
}

function lockControls(flag) {
	var inputsCollection = document.getElementsByTagName("input");
	for (a in inputsCollection) {
		if (inputsCollection[a].id && ((!inputsCollection[a].id.startsWith("Alien") || inputsCollection[a].id.endsWith("Qty")) &&
			inputsCollection[a].id != "Boarding ShipAtk")) {
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
		inputsCollection[c].disabled = flag;
	}
}

function performSimCycle() {
	// Slightly reduce the number of sims per cycle with bigger DMs; make it more responsive
	var simsPerCycle = Math.max(130 - Math.floor(Math.pow(dmSize,0.85)),4);
	
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
	var successRate = ((multiWins + multiDraws) / simsDone * 100).toFixed(2);
	
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
		for (w = 1; w <= multiHighShips; w++) {
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
		var avgHP = (multiDMhp / multiLosses).toFixed(2);
		
		if (multiLosses > midPoint) {
			gamesLeft = midPoint - (multiWins + multiDraws);
		}
		
		pFrag = document.createElement("p");
		pFrag.innerHTML = "The Doomsday Machine has " + avgHP + " HP on average for each of its wins.";
		
		ulFrag = document.createElement("ul");
		for (l = 1; l <= multiHighDMhp; l++) {
			var outcomeCount = getOneValue(dmHPcount, l).length;
			
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
				liFrag.innerHTML = l+" HP: "+getPhrase("time", outcomeCount)
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
	
	clearResults(true);

	for (var x = 0; x < simCount; x++) {
		getDMspecs();
		simFleet = new playerFleet();
		simDM = new doomsdayMachine();
		
		clearResults(false);
		
		if (simFleet.totalShips() == 0) {
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
		} else if (simDM.hitPoints <= 0) {
			divFrag = document.createElement("div");
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Doomsday Machine has no HP. Sequence aborted.";
			
			if (simMulti) {
				simsDone = totalQuota;
				multiDraws = totalQuota;
			}

			divFrag.appendChild(pFrag);
			grandBody.appendChild(divFrag);
			break;
		}
		while (simFleet.totalShips() > 0 && simDM.hitPoints > 0) {
			runSimRound();
		}
	}
}

