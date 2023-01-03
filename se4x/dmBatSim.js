var simRound = 0;

function setupSim() {
	setupBox();
	
	addPlayerRow("Scout",3,"E",0,1);
	addPlayerRow("Destroyer",4,"D",0,1);
	addPlayerRow("Cruiser",4,"C",1,2);
	addPlayerRow("Battlecruiser",5,"B",1,2);
	addPlayerRow("Battleship",5,"A",2,3);
	addPlayerRow("Dreadnought",6,"A",3,3);
	addPlayerRow("Ship Yard",3,"C",0,1);
	addPlayerRow("Base",7,"A",2,3);
	addPlayerRow("Carrier",3,"E",0,1);
	addPlayerRow("Fighters",5,"B",0,1);
	addPlayerRow("Mines",0,"A",0,0);
	addPlayerRow("Raider",4,"D",0,2);
	addPlayerRow("Minesweeper",1,"E",0,1);
	
	document.getElementById("FightersAtk").max = 8;
	document.getElementById("RaiderAtk").max = 7;
	computeHitChances(true);
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
		inputFrag.max = baseAtk + sizee;
		makeFieldSensitive(inputFrag);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Hit chance field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
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
		inputFrag.max = baseDef + sizee;
		makeFieldSensitive(inputFrag);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
		
		//Miss chance field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		tdFrag.id = namee+"Miss";
		trFrag.appendChild(tdFrag);
		
		//Threat field
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		tdFrag.id = namee+"Aggro";
		trFrag.appendChild(tdFrag);
	} else {
		//Attack/Defense/Threat fields empty
		tdFrag = document.createElement("td");
		trFrag.appendChild(tdFrag);
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		tdFrag.id = namee + "Hit";
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

function getDMspecs() {
	dmStr = document.getElementById("dmStr").selectedIndex;
	dmWeak = document.getElementById("dmWek").selectedIndex;
	dmAtk = Math.ceil(dmStr/2) + 6;
	dmDef = Math.ceil((dmStr+1)/3);
	dmSize = Math.floor(dmStr/2) + 6;
	dmSameAdv = document.getElementById("dmSame").checked;
	
	switch (dmStr) {
		case 0:
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
			break;
	}
	
	document.getElementById("dmAtk").innerHTML = dmClass + dmAtk;
	document.getElementById("dmDef").innerHTML = dmDef;
	document.getElementById("dmSize").innerHTML = dmSize;
	document.getElementById("dmRoll").innerHTML = dmRolls;
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

					hitChance = (dmWeak == 2 ? 50 : 0);
					bonus = (dmWeak == 2);
					hitCells[h].innerHTML = hitChance + "%";
					hitCells[h].className = "numeric" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-3,3) == "Hit") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 3) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Atk";
					readAtk = document.getElementById(readId).value;
					
					hitChance = Math.max((readAtk - dmDef),0) * 10;
					if (hitChance < 10 && dmStr == 0) {
						hitChance = 10;
					}
					
					if (readId == "FightersAtk") {
						if (dmWeak != 1) {
							hitChance = 0;
						} else {
							bonus = true;
						}
					} else if (readId == "RaiderAtk") {
						bonus = (dmWeak == 3);
					}
					
					hitCells[h].innerHTML = hitChance + "%";
					hitCells[h].className = "numeric" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-4,4) == "Miss") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 4) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Def";
					readDef = document.getElementById(readId).value;
					
					evaChance = Math.max(100 - (dmAtk - readDef) * 10,0);

					if (readId == "RaiderDef" && dmWeak == 3) {
						evaChance = Math.min(evaChance + 20,90);
						bonus = true;
					}

					if (evaChance < 10) {
						evaChance = 10;
					}
					
					hitCells[h].innerHTML = evaChance + "%";
					hitCells[h].className = "numeric" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
				} else if (hitCells[h].id.substr(-5,5) == "Aggro") {
					readId = hitCells[h].id.substr(0, hitCells[h].id.length - 5) + "Qty";
					readQty = document.getElementById(readId).value;
					readId = readId.substr(0, readId.length - 3) + "Hit";
					hitChance = parseInt(document.getElementById(readId).innerHTML);
					readId = readId.substr(0, readId.length - 3) + "Def";
					hullSize = parseInt(document.getElementById(readId).max) - parseInt(document.getElementById(readId).min);
					readId = readId.substr(0, readId.length - 3) + "Miss";
					evaChance = parseInt(document.getElementById(readId).innerHTML);
					
					dmThreat = 10 - hullSize;
					if (hitChance > 0) {
						dmThreat = dmThreat + Math.pow(1+Math.floor(hitChance/10),3-(hullSize-1)/2) + Math.pow(10-(evaChance/10),2.2);
					
						if (dmWeak == 4) {
							dmThreat = dmThreat * Math.max(Math.pow(3.5-hullSize,2),1);
							bonus = (hullSize < 3);
						}
					}
					
					hitCells[h].innerHTML = Math.round(dmThreat);
					hitCells[h].className = "numeric" + (bonus ? " bonus" : (readQty > 0 ? "" : " reference"));
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
	ftrBonus = parseInt(document.getElementById("techFtr").value) - 1;
	clkBonus = parseInt(document.getElementById("techClk").value) - 1;
	
	for (t in techCells) {
		try {
			if (techCells[t].id) {
				if (techCells[t].id == "FightersAtk") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,1) + Math.min(ftrBonus,2);
				} else if (techCells[t].id == "RaiderAtk") {
					techCells[t].value = parseInt(techCells[t].min) + Math.min(atkBonus,2) + Math.min(clkBonus,1);
				} else if (techCells[t].id.substr(-3,3) == "Atk") {
					techCells[t].value = Math.min(parseInt(techCells[t].min) + atkBonus,techCells[t].max);
				} else if (techCells[t].id.substr(-3,3) == "Def") {
					techCells[t].value = Math.min(parseInt(techCells[t].min) + defBonus,techCells[t].max);
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
	if (baseID == "Mines") {
		this.hullSize = 0;
	} else {
		this.attackRating = parseInt(document.getElementById(baseID + "Atk").value);
		this.defenseRating = parseInt(document.getElementById(baseID + "Def").value);
		this.threat = (this.quantity > 0 ? parseInt(document.getElementById(baseID + "Aggro").innerHTML) : 0);
		this.hullSize = parseInt(document.getElementById(baseID + "Def").max) - parseInt(document.getElementById(baseID + "Def").min);
	}
	this.damage = 0;
	this.destroyed = false;
	
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
}

function playerFleet() {
	var baseID;
	
	this.scouts = new playerShip("Scout");
	this.destroyers = new playerShip("Destroyer");
	this.cruisers = new playerShip("Cruiser");
	this.battlecruisers = new playerShip("Battlecruiser");
	this.battleships = new playerShip("Battleship");
	this.dreadnoughts = new playerShip("Dreadnought");
	this.shipYards = new playerShip("Ship Yard");
	this.starbases = new playerShip("Base");
	this.carriers = new playerShip("Carrier");
	this.fighters = new playerShip("Fighters");
	this.mines = new playerShip("Mines");
	this.raiders = new playerShip("Raider");
	this.minesweepers = new playerShip("Minesweeper");
	
	this.totalShips = function() {
		return this.scouts.quantity + this.destroyers.quantity + this.cruisers.quantity + this.battlecruisers.quantity +
			this.battleships.quantity + this.dreadnoughts.quantity + this.shipYards.quantity + this.starbases.quantity +
			this.carriers.quantity + this.fighters.quantity + this.mines.quantity + this.raiders.quantity + this.minesweepers.quantity;
	}
	
	this.highestAggro = function() {
		return Math.max(this.scouts.threat, this.destroyers.threat, this.cruisers.threat, this.battlecruisers.threat, 
			this.battleships.threat, this.dreadnoughts.threat, this.shipYards.threat, this.starbases.threat, 
			this.carriers.threat, this.fighters.threat, this.raiders.threat, this.minesweepers.threat);
	}
	
	this.targetHighest = function() {
		let highestThreat = this.highestAggro();
		
		if (this.shipYards.threat == highestThreat) {
			return this.shipYards;
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

		if (this.starbases.threat == highestThreat) {
			return this.starbases;
		}

		if (this.carriers.threat == highestThreat) {
			return this.carriers;
		}

		if (this.fighters.threat == highestThreat) {
			return this.fighters;
		}

		return this.minesweepers;
	}
}

//Object
function doomsdayMachine() {
	this.hitPoints = dmSize;
	if (dmRolls > 2) {
		this.weakness = dmWeak;
	} else {
		this.weakness = 5;
	}
}

function rollD10() {
	return 1 + Math.floor(Math.random()*10);
}

function clearResults() {
	roundsCollected = document.getElementsByTagName("div");
	for (i = 0; i < roundsCollected.length; i++) {
		if (roundsCollected[i].id != "infobox") {
			roundsCollected[i--].remove();
		}
	}
}

function fireDMweps() {
	var targetNamee = null;
	var dieRoll = 0;
	
	while (simDM.hitPoints > 0 && numDmAttacks > 0) {
		if (simFleet.totalShips() > 0) {
			targetShip = simFleet.targetHighest();
		}
		if (targetShip.namee != targetNamee) {
			if (targetNamee) {
				divFrag.appendChild(pFrag);
			}
			
			targetNamee = targetShip.namee;
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Doomsday Machine (" + simDM.hitPoints + " HP) rolls against " + targetNamee + " group:";
		}
		
		dieRoll = rollD10();
		
		if (dieRoll == 1 || (dieRoll <= dmAtk - targetShip.defenseRating && dieRoll < 10)) {
			pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
			targetShip.hitShip();
		} else {
			pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
		}
	
		if (targetShip.destroyed && simFleet.totalShips() > 0) {
			targetShip.destroyed = false;
			
			divFrag.appendChild(pFrag);
			pFrag = document.createElement("p");
			pFrag.innerHTML = targetNamee + " group has been destroyed!";
		}
		
		numDmAttacks--;
	}
	
	if (targetShip.destroyed && simFleet.totalShips() <= 0) {
		targetShip.destroyed = false;
		
		divFrag.appendChild(pFrag);
		pFrag = document.createElement("p");
		pFrag.innerHTML = targetNamee + " group has been destroyed!";
	}
	
	if (targetNamee) {
		divFrag.appendChild(pFrag);
	}
}

function firePlrWeps(shipObj) {
	if (shipObj.quantity > 0 && simDM.hitPoints > 0) {
		hpTotal = shipObj.quantity * shipObj.hullSize - shipObj.damage;
		
		pFrag = document.createElement("p");
		pFrag.innerHTML = shipObj.namee + " group (" + hpTotal + " HP total) rolls against Doomsday Machine:";
		
		for (i = 0; i < shipObj.quantity; i++) {
			dieRoll = rollD10();
			
			if (dieRoll <= shipObj.attackRating - dmDef + (largeFleetBonus ? 1 : 0)) {
				pFrag.innerHTML = pFrag.innerHTML + " <span class=\"hit\">" + dieRoll + "</span>";
				simDM.hitPoints--;
			} else {
				pFrag.innerHTML = pFrag.innerHTML + " " + dieRoll + "</span>";
			}
		}
		
		divFrag.appendChild(pFrag);
	
		if (simDM.hitPoints <= 0) {
			pFrag = document.createElement("p");
			pFrag.innerHTML = "Doomsday Machine has been destroyed!";
			divFrag.appendChild(pFrag);
		}
	}
}

function runSimRound() {
	numDmAttacks = dmRolls;
	simRound++;
	grandBody = document.getElementsByTagName("body")[0];
	
	divFrag = document.createElement("div");
	
	if (simDM.weakness == 0) {
		pFrag = document.createElement("p");
		dieRoll = rollD10();
		simDM.weakness = Math.ceil(dieRoll/2);
		
		pFrag.innerHTML = "Doomsday Machine rolls for weakness: " + dieRoll + " (";
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
		
		computeHitChances(false);
		divFrag.appendChild(pFrag);
	}

	largeFleetBonus = (simFleet.totalShips >= 10 && simDM.weakness == 4);

	if (simDM.weakness == 2) {
		firePlrWeps(simFleet.mines);
	}
	simFleet.mines.quantity = 0;
	
	if (simDM.weakness == 3 && simRound == 1) {
		simFleet.raiders.defenseRating = simFleet.raiders.defenseRating + 2;
	}

	if (dmClass == "A" && dmSameAdv) {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.starbases);
	firePlrWeps(simFleet.dreadnoughts);
	firePlrWeps(simFleet.battleships);
	if (simDM.weakness == 3) {
		if (simRound == 1) {
			simFleet.raiders.attackRating++;
			firePlrWeps(simFleet.raiders);
			simFleet.raiders.attackRating--;
		} else {
			firePlrWeps(simFleet.raiders);
		}
	}
	
	if ((dmClass == "B" && dmSameAdv) || dmClass == "A") {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.battlecruisers);
	if (simDM.weakness == 1) {
		firePlrWeps(simFleet.fighters);
	}
	
	if ((dmClass == "C" && dmSameAdv) || dmClass == "B") {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.cruisers);
	firePlrWeps(simFleet.shipYards);
	
	if ((dmClass == "D" && dmSameAdv) || dmClass == "C") {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.destroyers);
	if (simDM.weakness != 3) {
		firePlrWeps(simFleet.raiders);
	}
	
	if (dmClass == "D") {
		fireDMweps();
	}
	
	firePlrWeps(simFleet.carriers);
	firePlrWeps(simFleet.minesweepers);
	firePlrWeps(simFleet.scouts);
	
	grandBody.appendChild(divFrag);
}

function runSimBattle() {
	getDMspecs();
	simFleet = new playerFleet();
	simDM = new doomsdayMachine();
	
	clearResults();
	
	if (simFleet.totalShips() == 0) {
		console.warn("No player ships detected. Sequence aborted.");
	}
	while (simFleet.totalShips() > 0 && simDM.hitPoints > 0) {
		runSimRound();
	}
}