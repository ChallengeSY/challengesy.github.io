var gameDifficulty = 5;

// Object
function alienPlayer(newName) {
	this.apName = newName;
	this.ecoRolls = 1;
	this.queuedEcoRolls = [0, 0];
	this.fleetCPs = [0, 0];
	this.techCPs = [0, 0];
	this.defCPs = [0, 0];
	this.hiddenFleets = new Array();
	this.hiddenFleetState = "numeric";
	this.techsDeveloped = ["Minelaying"]; //Starting tech
	this.apAlive = true;
	
	this.addEcoRoll = function() {
		this.ecoRolls++;
	}
	
	this.addQueuedRoll =  function() {
		this.queuedEcoRolls[1]++;
	}
	
	this.applyQueuedRoll = function() {
		this.ecoRolls++;
		this.queuedEcoRolls[0]--;
		this.queuedEcoRolls[1]--;
	}
	
	this.addFleetCPs = function(cnt) {
		this.fleetCPs[1] += gameDifficulty * cnt;
	}
	
	this.launchRegFleet = function() {
		if (this.apAlive) {
			this.hiddenFleets.push(this.fleetCPs[1]);
			this.fleetCPs[1] = 0;
			this.hiddenFleetState = "numeric increase";
		}
	}
	
	this.buildRegFleet = function(pos, spendCP) {
		// Spend CP, then credit the remainder back to the bank
		this.fleetCPs[1] += this.hiddenFleets[pos] - spendCP;
		this.hiddenFleets.splice(pos, 1);
		this.hiddenFleetState = "numeric decrease";
	}
	
	this.launchDefFleet = function(spendCP) {
		this.fleetCPs[1] -= spendCP;
	}
	
	// Only Raiders are built in this fleet. Also built/known right away
	this.launchRaiderFleet = function() {
		this.fleetCPs[1] = this.fleetCPs[1] % 12;
	}
	
	this.addTechCPs = function(cnt) {
		this.techCPs[1] += gameDifficulty * cnt;
	}
	
	this.spendTechCPs = function(amt) {
		this.techCPs[1] -= amt;
	}
	
	// Defense allocation is twice as effective
	this.addDefCPs = function(cnt) {
		this.defCPs[1] += gameDifficulty * cnt * 2;
	}
	
	this.buildDefenses = function(dieRoll) {
		if (dieRoll <= 3) {
			// Build only Mines
			console.log(Math.floor(this.defCPs[1]/5) + " mines");
			this.defCPs[1] = this.defCPs[1] % 5;
		} else if (dieRoll <= 7) {
			// Base and Mine combo first
			console.log(Math.floor(this.defCPs[1]/17) + " bases + mines together");
			this.defCPs[1] = this.defCPs[1] % 17;
			// Build a Base next, if able
			console.log(Math.floor(this.defCPs[1]/12) + " more bases");
			this.defCPs[1] = this.defCPs[1] % 12;
			// Spend leftovers (if any) on mines
			console.log(Math.floor(this.defCPs[1]/5) + " more mines");
			this.defCPs[1] = this.defCPs[1] % 5;
		} else {
			// Max out on Bases
			console.log(Math.floor(this.defCPs[1]/12) + " bases");
			this.defCPs[1] = this.defCPs[1] % 12;
			// Spend leftovers (if any) on mines
			console.log(Math.floor(this.defCPs[1]/5) + " mines");
			this.defCPs[1] = this.defCPs[1] % 5;
		}
	}
	
	this.normalizeValues = function() {
		this.queuedEcoRolls[0] = this.queuedEcoRolls[1];
		this.fleetCPs[0] = this.fleetCPs[1];
		this.techCPs[0] = this.techCPs[1];
		this.defCPs[0] = this.defCPs[1];
		this.hiddenFleetState = "numeric";
	}
	
	this.comparePair = function(arrayObj) {
		if (arrayObj[1] > arrayObj[0]) {
			return "numeric increase";
		} else if (arrayObj[1] < arrayObj[0]) {
			return "numeric decrease";
		}
		
		return "numeric";
	}
	
	this.printHiddenFleets = function() {
		var collection = "";
		if (this.hiddenFleets.length > 0) {
			for (j = 0; j < this.hiddenFleets.length; j++) {
				collection = collection + this.hiddenFleets[j] + " / ";
			}
			
			return collection.slice(0,-3);
		}
		
		return "&mdash;";
	}
	
	this.toRow = function() {
		var rowStyle = ""
		if (!this.apAlive) {
			this.normalizeValues();
			rowStyle = " style=\"color: #808080;\"";
		}
		
		return "<tr"+ rowStyle + "><th>" + this.apName + "</th>\
			<td class=\"" + this.comparePair(this.queuedEcoRolls) + "\">" + this.ecoRolls + " +" + this.queuedEcoRolls[1] + "</td>\
			<td class=\"" + this.comparePair(this.fleetCPs) + "\">" + this.fleetCPs[1] + "</td>\
			<td class=\"" + this.comparePair(this.techCPs) + "\">" + this.techCPs[1] + "</td>\
			<td class=\"" + this.comparePair(this.defCPs) + "\">" + this.defCPs[1] + "</td>\
			<td class=\"" + this.hiddenFleetState + "\">" + this.printHiddenFleets() + "</td></tr>";
	}
	
}

function drawRows(arrayObj) {
	for (i = 0; i < arrayObj.length; i++) {
		document.write(arrayObj[i].toRow());
		arrayObj[i].normalizeValues();
	}
	
}

function addRegEcoRoll(arrayObj) {
	for (i = 0; i < arrayObj.length; i++) {
		if (arrayObj[i].apAlive) {
			arrayObj[i].addEcoRoll();
		}
	}
}