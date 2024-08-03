var rawJson;
var stageTotal;
var stageNum = 0;
var multiStages = true;
var expansionHWs = false;
var boardCreated = false;
var alienHWs = 0;
const letterRows = "LKJIHGFEDCBA";
const deepSpace = "unexploredW";
const markerCounter = "marker";

const alienIncLetters = "EFTDPH";
const alienDecLetters = alienIncLetters.toLowerCase();
const dieRollsRow = "(Rolls)";

window.onkeydown = readKeyInput;

function initReplay() {
	getJsonFile();
}

function makeHexes(talonMap) {
	if (!boardCreated) {
		var hexBoard = document.getElementById("gameBoard");
		var ctrlPanel = document.getElementById("controls");
		var maxCols = 13;
		
		if (talonMap) {
			maxCols = 16;
		}
			
		for (y = 0; y < 12; y++) {
			var newRow = document.createElement("div");
			if (y % 2 == 1) {
				newRow.className = "hexRow even";
			} else {
				newRow.className = "hexRow";
			}
			for (x = 0; x < maxCols - (y % 2); x++) {
				var newHex = document.createElement("div");
				newHex.className = "hexSlot";
				newHex.id = "hex"+letterRows.charAt(y)+(x+1);
				
				var newHexBack = document.createElement("img");
				newHexBack.className = "hexBack";
				newHexBack.src = "gfx/tiles/borderX.png";
				newHexBack.id = "back"+letterRows.charAt(y)+(x+1);
				newHexBack.title = "Sector "+newHex.id.substr(3);
				newHex.appendChild(newHexBack);
				
				var newHexLabel = document.createElement("div");
				newHexLabel.className = "hexLabel"
				newHexLabel.innerHTML = letterRows.charAt(y)+(x+1);
				newHex.appendChild(newHexLabel);
				
				newRow.appendChild(newHex);
			}
			hexBoard.appendChild(newRow);
		}
		
		if (talonMap) {
			ctrlPanel.className = "talonBoard";
			dispRow("L", false);
		}
		
		boardCreated = true;
	}
}

function dispRow(b, newDisp) {
	var hexBoard = document.getElementById("gameBoard");

	for (x = 0; x < 16; x++) {
		var findObj = document.getElementById("hex"+b+(x+1));
		
		if (findObj) {
			if (newDisp) {
				findObj.style.display = "";
			} else {
				findObj.style.display = "none";
			}
		}
	}
}

function dispCol(a, newDisp) {
	var ctrlPanel = document.getElementById("controls");
	var affectCol = Math.floor(a);
	
	for (y = 0; y < 12; y++) {
		var findObj = document.getElementById("hex"+letterRows.charAt(y)+affectCol);
		
		if (findObj && (a % 1 == 0 || y % 2 == 1)) {
			if (a > 7 || ctrlPanel.className == "dmBoard") {
				if (newDisp) {
					findObj.style.display = "";
				} else {
					findObj.style.display = "none";
				}
			} else {
				if (newDisp) {
					findObj.style.visibility = "";
				} else {
					findObj.style.visibility = "hidden";
				}
			}
		}
	}
}

function irandom(mini, maxi) {
	return Math.floor((Math.random() * (maxi - mini + 1)) + mini);
}

function readKeyInput(e) {
	e = e || event;
	
	var keyPressed = e.key.toLowerCase();
	
	switch (keyPressed) {
		case "<":
			// Fall thru
		case ",":
			if (!document.getElementById("stageL").disabled) {
				changeStage(-1);
			}
			break;
		case ">":
			// Fall thru
		case ".":
			if (!document.getElementById("stageR").disabled) {
				changeStage(1);
			}
			break;
	}
}

function autoNameCounter(localObj) {
	var stackSize = parseInt(readValue(localObj.style.borderLeftWidth,1));
	var stackable = false;
	
	if (localObj.src.indexOf("gfx/home30") >= 0) {
		localObj.title = "Homeworld (Size 30)"
	} else if (localObj.src.indexOf("gfx/home20") >= 0) {
		localObj.title = "Homeworld (Size 20)"
	} else if (localObj.src.indexOf("gfx/home15") >= 0) {
		localObj.title = "Homeworld (Size 15)"
	} else if (localObj.src.indexOf("gfx/home10") >= 0) {
		localObj.title = "Homeworld (Size 10)"
	} else if (localObj.src.indexOf("gfx/home5") >= 0) {
		localObj.title = "Homeworld (Size 5)"
	} else if (localObj.src.indexOf("gfx/colony5") >= 0) {
		localObj.title = "Colony (Size 5)"
	} else if (localObj.src.indexOf("gfx/colony3") >= 0) {
		localObj.title = "Colony (Size 3)"
	} else if (localObj.src.indexOf("gfx/colony1") >= 0) {
		localObj.title = "Colony (Size 1)"
	} else if (localObj.src.indexOf("gfx/colony0") >= 0) {
		localObj.title = "Colony (Size 0)"
	} else if (localObj.src.indexOf("gfx/planet") >= 0) {
		localObj.title = "Empty planet"
	} else if (localObj.src.indexOf("gfx/unexplored") >= 0) {
		localObj.title = "Unexplored system"
	} else if (localObj.src.indexOf("gfx/fold") >= 0) {
		localObj.title = "Fold in space"
	} else if (localObj.src.indexOf("gfx/pirate") >= 0) {
		localObj.title = "Space Pirate"
	} else if (localObj.src.indexOf("gfx/amoeba") >= 0) {
		localObj.title = "Space Amoeba"
	} else if (localObj.src.indexOf("gfx/doomsday") >= 0) {
		localObj.title = "Doomsday Machine"
	} else if (localObj.src.indexOf("gfx/capitol") >= 0) {
		localObj.title = "Galactic Capitol"
	} else if (localObj.src.indexOf("gfx/marker") >= 0) {
		localObj.title = "Marker"
	} else if (localObj.src.indexOf("gfx/minerals10") >= 0) {
		localObj.title = "Dense Minerals (10)"
	} else if (localObj.src.indexOf("gfx/minerals5") >= 0) {
		localObj.title = "Minerals (5)"
	} else if (localObj.src.indexOf("gfx/spaceWreck") >= 0) {
		localObj.title = "Space Wreck"
	} else if (localObj.src.indexOf("gfx/supernova") >= 0) {
		localObj.title = "Supernova"
	} else if (localObj.src.indexOf("gfx/lost") >= 0) {
		localObj.title = "Lost in space"
	} else if (localObj.src.indexOf("gfx/danger") >= 0) {
		localObj.title = "Danger!"
	} else if (localObj.src.indexOf("gfx/asteroids") >= 0) {
		localObj.title = "Asteroids"
	} else if (localObj.src.indexOf("gfx/blackHole") >= 0) {
		localObj.title = "Black Hole"
	} else if (localObj.src.indexOf("gfx/nebula") >= 0) {
		localObj.title = "Nebula"
	} else if (localObj.src.indexOf("gfx/hidden") >= 0) {
		localObj.title = "Unrevealed Group"
	} else if (localObj.src.indexOf("gfx/MSa") >= 0) {
		localObj.title = "Pipeline (Active)"
	} else if (localObj.src.indexOf("gfx/MSm") >= 0) {
		localObj.title = "Pipeline (Moved)"
	} else if (localObj.src.indexOf("gfx/Miner") >= 0) {
		localObj.title = "Miner"
		
		switch (stackSize) {
			case 2:
				localObj.title = "Miner (with Minerals 5 towed)"
				break;
			case 3:
				localObj.title = "Miner (with Minerals 10 towed)"
				break;
			case 4:
				localObj.title = "Miner (with Space Wreck towed)"
				break;
		}
	} else if (localObj.src.indexOf("gfx/CO") >= 0) {
		localObj.title = "Colony Ship"
	} else if (localObj.src.indexOf("gfx/SY") >= 0) {
		localObj.title = "Ship Yard";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/base") >= 0) {
		localObj.title = "Base";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/SC") >= 0) {
		localObj.title = "Scout";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/DD") >= 0) {
		localObj.title = "Destroyer";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/CA") >= 0) {
		localObj.title = "Cruiser";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/BC") >= 0) {
		localObj.title = "Battlecruiser";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/BB") >= 0) {
		localObj.title = "Battleship";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/DN") >= 0) {
		localObj.title = "Dreadnought";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/Flag") >= 0) {
		localObj.title = "Flagship";
		stackable = (stackSize > 1);
	} else if (localObj.src.indexOf("gfx/R") >= 0) {
		localObj.title = "Raider";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/Ftr") >= 0) {
		localObj.title = "Fighter";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/CV") >= 0) {
		localObj.title = "Carrier";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/mines") >= 0) {
		localObj.title = "Minelayer";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/SW") >= 0) {
		localObj.title = "Minesweeper";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/alienD") >= 0) {
		localObj.title = "NPA Destroyer";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/alienC") >= 0) {
		localObj.title = "NPA Cruiser";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/alienB") >= 0) {
		localObj.title = "NPA Battlecruiser";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/militia") >= 0) {
		localObj.title = "Militia";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/Inf") >= 0) {
		localObj.title = "Light Infantry";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/HI") >= 0) {
		localObj.title = "Heavy Infantry";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/Mar") >= 0) {
		localObj.title = "Space Marines";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/Tran") >= 0) {
		localObj.title = "Troop Transport";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/fleet1") >= 0) {
		localObj.title = "Fleet One";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/fleet2") >= 0) {
		localObj.title = "Fleet Two";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/fleet3") >= 0) {
		localObj.title = "Fleet Three";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type0") >= 0) {
		localObj.title = "Type 0";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type2") >= 0) {
		localObj.title = "Type II";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type4") >= 0) {
		localObj.title = "Type IV";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type5") >= 0) {
		localObj.title = "Type V";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type7") >= 0) {
		localObj.title = "Type VII";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type9") >= 0) {
		localObj.title = "Type IX";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type11") >= 0) {
		localObj.title = "Type XI";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type13") >= 0) {
		localObj.title = "Type XIII";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/type15") >= 0) {
		localObj.title = "Type XV";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/typeExp") >= 0) {
		localObj.title = "Type Explorer";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/typePD") >= 0) {
		localObj.title = "Type Point-Def";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/typeScan") >= 0) {
		localObj.title = "Type Scanner";
		stackable = true;
	} else if (localObj.src.indexOf("gfx/typeSW") >= 0) {
		localObj.title = "Type Sweeper";
		stackable = true;
	}

	if (stackable) {
		if (localObj.title.startsWith("Fleet")) {
			localObj.title = localObj.title + " (Size "+stackSize+")";
		} else {
			localObj.title = localObj.title + " Group (Size "+stackSize+")";
		}
	}
	
	if (stackSize > 12) {
		localObj.style.borderLeftWidth = "12px";
		localObj.style.borderTopWidth = "12px";
	}
}

function placeCounter(curId, newX, newY, newPic, newSize) {
	var calcX = 50;
	var calcY = 50;
	var workObj, applySize = 0;

	var workSlot = document.getElementById("hex"+letterRows.charAt(newY)+newX);
	if (typeof newSize !== "undefined") {
		applySize = newSize;
	} else {
		applySize = 0;
	}
	
	findObj = document.getElementById(curId);
	if (findObj && applySize >= 0) {
		workObj = findObj;
	} else {
		workObj = document.createElement("img");
		workObj.src = "gfx/" + curId + ".png";
		if (applySize >= 0) {
			workObj.id = curId;
			workObj.className = "counter";
		} else {
			workObj.className = "counter ghost";
		}
		workObj.style.position = "absolute";
		if (workObj.id.startsWith("system")) {
			workObj.style.zIndex = 2;
		} else {
			workObj.style.zIndex = 3;
		}

		autoNameCounter(workObj);
	}
	if (workSlot) {
		workSlot.appendChild(workObj);
	}
	
	if (!curId.startsWith("system")) {
		var checkSystem = document.getElementById("system"+letterRows.charAt(newY)+newX);
		var randX, randY;
		
		do {
			randX = irandom(-32,32);
			randY = irandom(-28,28);
		} while (checkSystem && Math.abs(randX) < 25 && Math.abs(randY) < 25)
		
		calcX = calcX + randX;
		calcY = calcY + randY;
	} else {
		applySize = 0;
	}
	
	if (newPic) {
		workObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			workObj.style.zIndex = 1;
		} else if (workObj.id.startsWith("system")) {
			paintTile(workObj, newPic);
		}

		autoNameCounter(workObj);
	}

	if (applySize > 0) {
		workObj.style.borderLeftWidth = applySize+"px";
		workObj.style.borderTopWidth = applySize+"px";

		autoNameCounter(workObj);
	} else if (newPic && newPic.indexOf("marker") >= 0) {
		workObj.style.borderLeftWidth = "0px";
		workObj.style.borderTopWidth = "0px";
	}

	workObj.style.left = calcX + "%";
	workObj.style.top = calcY + "%";
}

function paintTile(baseObj, paintPic) {
	/*
	 * WIP... maybe
	 *
	 * Thanks to embedded coordinates, the current system has advantages that wouldn't be available if we went with full tiles
	 */
	var applyPic = null;
	var remCounter = false;
	var hexId = "back";
	
	if (typeof baseObj === "object") {
		hexId = hexId+baseObj.id.substr(6);
	} else {
		hexId = hexId+baseObj;
	}
	
	workObj = document.getElementById(hexId);
	if (workObj) {
		switch (paintPic) {
			case "home30B":
				// Fall thru
			case "home20B":
				// Fall thru
			case "unexploredB":
				applyPic = "borderB";
				break;
			case "home30G":
				// Fall thru
			case "home20G":
				// Fall thru
			case "unexploredG":
				applyPic = "borderG";
				break;
			case "home30R":
				// Fall thru
			case "home20R":
				// Fall thru
			case "unexploredR":
				applyPic = "borderR";
				break;
			case "home30V":
				// Fall thru
			case "unexploredV":
				applyPic = "borderV";
				break;
			case "home30Y":
				// Fall thru
			case "home20Y":
				// Fall thru
			case "unexploredY":
				applyPic = "borderY";
				break;
			case "amoeba1":
				// Fall thru
			case "amoeba2":
				// Fall thru
			case "amoeba3":
				// Fall thru
			case "capitol":
				// Fall thru
			case "warp1":
				// Fall thru
			case "warp2":
				// Fall thru
			case "unexploredW":
				applyPic = "borderW";
				break;
			case "empty":
				applyPic = "borderX";
				break;
		}
		
		if (applyPic) {
			workObj.src = "gfx/tiles/"+applyPic+".png"
			
			if (remCounter && baseObj) {
				baseObj.remove();
			}
		}
	}
}

function placeSystemMarker(newX, newY, newPic) {
	placeCounter("system"+letterRows.charAt(newY)+newX, newX, newY, newPic, 1);
}

function placeHomeworld(newX, newY, color) {
	var initCP = 20;
	if (expansionHWs || color == "V") {
		initCP = 30;
	}
	
	placeSystemMarker(newX,newY,"home"+initCP+color);
	
	if (color == "V") {
		for (var i = 1; i <= 5; i++) {
			placeCounter("type0"+color+i,newX,newY,"type0V",1);
		}

		placeCounter("Flag"+color,newX,newY,null,1);
	} else {
		for (var i = 1; i <= 3; i++) {
			placeCounter("SC"+i+color,newX,newY,null,1);
			placeCounter("CO"+i+color,newX,newY,"CO"+color,1);
		}

		placeCounter("SY1"+color,newX,newY,null,4);
		placeCounter("Miner1"+color,newX,newY,null,1);
		if (expansionHWs) {
			placeCounter("Flag"+color,newX,newY,null,1);
		}
	}
}

function place3plrHomeMarkers(color, orient) {
	var homeMarker = "unexplored"+color;
	
	if (orient == "top") {
		for (var a = 4; a <= 10; a++) {
			if (a < 10) {
				if (a == 7) {
					placeHomeworld(a,0,color);
				} else {
					placeSystemMarker(a,0,homeMarker);
				}
				placeSystemMarker(a,1,homeMarker);
			}
			placeSystemMarker(a,2,homeMarker);
			if (a >= 5 && a < 9) {
				placeSystemMarker(a,3,homeMarker);
				if (a >= 6) {
					placeSystemMarker(a,4,homeMarker);
				}
			}
		}
	} else if (orient == "left") {
		for (var a = 1; a <= 5; a++) {
			if (a < 5) {
				if (a > 1) {
					placeSystemMarker(a,6,homeMarker);
				}
				placeSystemMarker(a,7,homeMarker);
			}
			placeSystemMarker(a,8,homeMarker);
			placeSystemMarker(a,9,homeMarker);
			if (a > 1) {
				if (a == 2) {
					placeHomeworld(a,10,color);
				} else {
					placeSystemMarker(a,10,homeMarker);
				}
				placeSystemMarker(a,11,homeMarker);
			}
		}
		placeSystemMarker(2,5,homeMarker);
	} else if (orient == "right") {
		for (var a = 9; a <= 13; a++) {
			if (a > 9) {
				if (a < 13) {
					placeSystemMarker(a,6,homeMarker);
				}
				placeSystemMarker(a-1,7,homeMarker);
			}
			placeSystemMarker(a,8,homeMarker);
			placeSystemMarker(a-1,9,homeMarker);
			if (a < 13) {
				if (a == 12) {
					placeHomeworld(a,10,color);
				} else {
					placeSystemMarker(a,10,homeMarker);
				}
				placeSystemMarker(a-1,11,homeMarker);
			}
		}
		placeSystemMarker(11,5,homeMarker);
	}
}

function placeAlienHomeworld(newX, newY, color) {
	placeSystemMarker(newX,newY,"home20"+color);
	placeCounter("base1"+color,newX,newY,null,1);
}

function renderCounter(curId, newPic) {
	findObj = document.getElementById(curId);
	if (findObj) {
		findObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			findObj.style.zIndex = 1;
		}
	
		autoNameCounter(findObj);
	}
}

function resizeStack(curId, newSize) {
	findObj = document.getElementById(curId);
	if (findObj) {
		findObj.style.borderLeftWidth = newSize+"px";
		findObj.style.borderTopWidth = newSize+"px";
		
		autoNameCounter(findObj);
	}
}

function readValue(jsonValue, defaultValue) {
	if (typeof jsonValue == "number" && isFinite(jsonValue)) {
		return parseInt(jsonValue);
	} else if (jsonValue) {
		return jsonValue;
	}
	
	return defaultValue;
}

function readJson() {
	curStage = rawJson.stages[stageNum];
	var heading = document.getElementById("heading");
	var commentary = document.getElementById("commentary");
	var seekObj, readX, readY, seekTag;
	
	if (stageNum == 0 || !multiStages || stageNum >= stageMem) {
		commentary.innerHTML = curStage.commentary;
		keywordifyCollection(document.getElementsByTagName("p"));
		keywordifyCollection(document.getElementsByTagName("li"));
		
		if (curStage.heading) {
			commentary.innerHTML = "<h2>" + curStage.heading + "</h2>" + commentary.innerHTML;
		}
		
		if (curStage.prodTable) {
			var constructTable = "<table><caption>Player Economics</caption> \
				<tr><th>Player</th><th>Initial</th><th>Colonies</th><th>Minerals</th><th>Pipelines</th> \
				<th>Maint</th><th>Available</th><th>Bid</th><th>Tech</th><th>Units</th><th>Leftover</th></tr>";
				
			for (var a = 0; a < curStage.prodTable.length; a++) {
				var activePlayer = curStage.prodTable[a];
				
				if (readValue(activePlayer.isDead,false)) {
					// Player is dead
					constructTable = constructTable + "<tr class=\"deadPlr\">";
				} else {
					constructTable = constructTable + "<tr>";
				}
				
				var availCP = readValue(activePlayer.initCP,0) + readValue(activePlayer.colonyCP,0) + 
					readValue(activePlayer.mineralCP,0) + readValue(activePlayer.pipeCP,0) - readValue(activePlayer.maint,0);
				var leftoverCP = availCP - readValue(activePlayer.bidCP,0) - readValue(activePlayer.techBuy,0) - readValue(activePlayer.unitBuy,0);
				
				constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.initCP,0)+"</td> \
					<td class=\"numeric increase\">+"+readValue(activePlayer.colonyCP,0)+"</td> \
					<td class=\"numeric increase\">+"+readValue(activePlayer.mineralCP,0)+"</td> \
					<td class=\"numeric increase\">+"+readValue(activePlayer.pipeCP,0)+"</td> \
					<td class=\"numeric decrease\">-"+readValue(activePlayer.maint,0)+"</td> \
					<td class=\"numeric\">"+availCP+"</td> \
					<td class=\"numeric\">-"+readValue(activePlayer.bidCP,0)+"</td> \
					<td class=\"numeric\">-"+readValue(activePlayer.techBuy,0)+"</td> \
					<td class=\"numeric\">-"+readValue(activePlayer.unitBuy,0)+"</td> \
					<td class=\"numeric\">"+leftoverCP+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{prodTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		}
		
		if (curStage.alienTable || curStage.alienTableX) {
			// Alien Player economics
			var constructTable = "<table><caption>Alien Economics</caption> \
				<tr><th>Player</th><th>Eco</th><th>Fleet</th><th>Tech</th><th>Def</th><th>Expo</th><th>Hidden</th></tr>";
				
			var workTable;
			
			if (curStage.alienTableX) {
				workTable = curStage.alienTableX;
			} else {
				workTable = curStage.alienTable;
			}

			for (var a = 0; a < workTable.length; a++) {
				var activePlayer = workTable[a];
				
				if (activePlayer.name == dieRollsRow) {
					var ecoRange = "&mdash;", fleetRange, techRange, defRange = "&mdash;", launchRange = "Launch &le;3";
					
					// Auto-compute Economic Roll ranges
					if (activePlayer.ecoPhase >= 13) {
						maxFleet = Math.min(9,Math.ceil(activePlayer.ecoPhase/2)-1);
						minTech = maxFleet + 1;
					
						fleetRange = "1-"+maxFleet;
						if (minTech < 10) {
							techRange = minTech+"-10";
						} else {
							techRange = "10";
						}
						if (activePlayer.ecoPhase % 2 == 0) {
							launchRange = "Launch Auto";
						}
					} else if (curStage.alienTableX) {
						switch (activePlayer.ecoPhase) {
							case 1:
								fleetRange = "1";
								techRange = "2-10";
								defRange = "&ndash;";
								launchRange = "Launch N/A";
								break;
							case 2:
								fleetRange = "1-3";
								techRange = "4-10";
								defRange = "&ndash;";
								launchRange = "Launch Auto";
								break;
							case 3:
								fleetRange = "1-3";
								techRange = "4-8";
								defRange = "9-10";
								launchRange = "Launch Auto";
								break;
							case 4:
								fleetRange = "1-4";
								techRange = "5-8";
								defRange = "9-10";
								launchRange = "Launch &le;5";
								break;
							case 5:
								fleetRange = "1-6";
								techRange = "7-9";
								defRange = "10";
								launchRange = "Launch Auto";
								break;
							case 6:
								fleetRange = "1-4";
								techRange = "5-9";
								defRange = "10";
								launchRange = "Launch &le;4";
								break;
							case 7:
								// Fall thru
							case 8:
								// Fall thru
							case 9:
								var thresh = activePlayer.ecoPhase - 4;
							
								fleetRange = "1-5";
								techRange = "6-9";
								defRange = "10";
								if (thresh < 4) {
									launchRange = "Launch Auto";
								} else {
									launchRange = "Launch &le;"+thresh;
								}
								break;
							case 10:
								// Fall thru
							case 12:
								fleetRange = "1-7";
								techRange = "8-9";
								defRange = "10";
								launchRange = "Launch &le;6";
								break;
							case 11:
								fleetRange = "1-7";
								techRange = "8-9";
								defRange = "10";
								launchRange = "Launch &le;4";
								break;
						}
					} else {
						switch (activePlayer.ecoPhase) {
							case 1:
								ecoRange = "1-2";
								fleetRange = "&ndash;";
								techRange = "3-10";
								defRange = "&ndash;";
								launchRange = "Launch N/A";
								break;
							case 2:
								ecoRange = "1";
								fleetRange = "2-3";
								techRange = "4-10";
								defRange = "&ndash;";
								launchRange = "Launch Auto";
								break;
							case 3:
								ecoRange = "1";
								fleetRange = "2-4";
								techRange = "5-8";
								defRange = "9-10";
								launchRange = "Launch Auto";
								break;
							case 4:
								ecoRange = "1";
								fleetRange = "2-5";
								techRange = "6-8";
								defRange = "9-10";
								launchRange = "Launch &le;5";
								break;
							case 5:
								ecoRange = "1";
								fleetRange = "2-5";
								techRange = "6-9";
								defRange = "10";
								break;
							case 6:
								ecoRange = "1";
								fleetRange = "2-6";
								techRange = "7-9";
								defRange = "10";
								launchRange = "Launch &le;4";
								break;
							case 7:
								// Fall thru
							case 8:
								fleetRange = "1-5";
								techRange = "6-9";
								defRange = "10";
								launchRange = "Launch &le;4";
								break;
							case 9:
								fleetRange = "1-5";
								techRange = "6-9";
								defRange = "10";
								launchRange = "Launch &le;5";
								break;
							case 10:
								fleetRange = "1-6";
								techRange = "7-9";
								defRange = "10";
								launchRange = "Launch &le;5";
								break;
							case 11:
								// Fall thru
							case 12:
								fleetRange = "1-6";
								techRange = "7-9";
								defRange = "10";
								break;
						}
					}
					
					constructTable = constructTable + "<tr><td>"+activePlayer.name+"</td> \
						<td class=\"numeric\">"+ecoRange+"</td> \
						<td class=\"numeric\">"+fleetRange+"</td> \
						<td class=\"numeric\">"+techRange+"</td> \
						<td class=\"numeric\">"+defRange+"</td> \
						<td class=\"numeric\">&mdash;</td> \
						<td class=\"numeric\">"+launchRange+"</td></tr>"
				} else {
					var classMods = ["","","","","",""];
					var baseDelta = activePlayer.delta;
					
					if (baseDelta.indexOf("---") >= 0) {
						// Alien Player is dead. They get no more economic rolls for the rest of the playthrough
						constructTable = constructTable + "<tr class=\"deadPlr\">";
					} else {
						constructTable = constructTable + "<tr>";
					
						for (var b = 0; b < classMods.length; b++) {
							if (baseDelta.indexOf(alienIncLetters.charAt(b)) >= 0) {
								classMods[b] = " increase";
							} else if (baseDelta.indexOf(alienDecLetters.charAt(b)) >= 0) {
								classMods[b] = " decrease";
							}
						}
					}
					
					constructTable = constructTable + "<td>"+activePlayer.name+"</td>";
					if (readValue(activePlayer.queue,-1) >= 0) {
						constructTable = constructTable + "<td class=\"numeric"+classMods[0]+"\">"+readValue(activePlayer.eco,2)+" \
							+"+activePlayer.queue+"</td>";
					} else {
						constructTable = constructTable + "<td class=\"numeric"+classMods[0]+"\">"+readValue(activePlayer.eco,2)+"</td>";
					}
						
					constructTable = constructTable + "<td class=\"numeric"+classMods[1]+"\">"+readValue(activePlayer.fleet,0)+"</td> \
						<td class=\"numeric"+classMods[2]+"\">"+readValue(activePlayer.tech,0)+"</td> \
						<td class=\"numeric"+classMods[3]+"\">"+readValue(activePlayer.def,0)+"</td> \
						<td class=\"numeric"+classMods[4]+"\">"+readValue(activePlayer.expo,0)+"</td> \
						<td class=\"numeric"+classMods[5]+"\">"+readValue(activePlayer.hidden,"&mdash;")+"</td></tr>";
				}
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{alienTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}
		}
		
		if (curStage.techTable || curStage.techTableX) {
			var constructTable = "<table><caption>Player Technologies</caption><tr><th>Player</th> \
				<th><a href=\"javascript:showBox('Ship Size')\">Size</a></th> \
				<th><a href=\"javascript:showBox('Attack')\">Atk</a></th> \
				<th><a href=\"javascript:showBox('Defense')\">Def</a></th> \
				<th><a href=\"javascript:showBox('Tactics')\">Tac</a></th> \
				<th><a href=\"javascript:showBox('Movement')\">Move</a></th> \
				<th><a href=\"javascript:showBox('Terraforming')\">Terraform</a></th> \
				<th><a href=\"javascript:showBox('Exploration')\">Explore</a></th> \
				<th><a href=\"javascript:showBox('Ship Yard')\">SY</a></th> \
				<th>"+conceptLink("Fighter")+"</th> \
				<th><a href=\"javascript:showBox('Point-Defense')\">PD</a></th> \
				<th><a href=\"javascript:showBox('Cloaking')\">Cloak</a></th> \
				<th><a href=\"javascript:showBox('Scanning')\">Scan</a></th> \
				<th><a href=\"javascript:showBox('Minelaying')\">Minelay</a></th> \
				<th><a href=\"javascript:showBox('Minesweeping')\">Minesweep</a></th></tr>";
				
			var workTable, expansionTechs = false;
			
			if (curStage.techTableX) {
				workTable = curStage.techTableX;
				expansionTechs = true;
			} else {
				workTable = curStage.techTable;
			}
			
			for (var b = 0; b < 2; b++) {
				if (b > 0) {
					if (expansionTechs) {
						constructTable = constructTable + "<tr><th>Player</th> \
							<th colspan=\"2\"><a href=\"javascript:showBox('Military Academy')\">Academy</a></th> \
							<th colspan=\"2\">"+conceptLink("Boarding")+"</th> \
							<th><a href=\"javascript:showBox('Security Forces')\">Security</a></th> \
							<th>"+conceptLink("Troops")+"</th><th>"+conceptLink("Fastmove")+"</th> \
							<th><a href=\"javascript:showBox('Black Hole Jumping')\">BHJ</a></th> \
							<th><a href=\"javascript:showBox('Advanced Construction')\">AdvCon</a></th> \
							<th colspan=\"2\"><a href=\"javascript:showBox('Tractor Beam')\">BB Tractor</a></th> \
							<th colspan=\"2\"><a href=\"javascript:showBox('Shield Projector')\">DN Shield Proj</a></th> \
							<th>"+conceptLink("Anti-Replicator")+"</th></tr>";
					} else {
						break;
					}
				}
				
				for (var a = 0; a < workTable.length; a++) {
					var activePlayer = workTable[a];
					
					if (readValue(activePlayer.isDead,false)) {
						// Player is dead
						constructTable = constructTable + "<tr class=\"deadPlr\">";
					} else {
						constructTable = constructTable + "<tr>";
					}
					constructTable = constructTable + "<td>"+activePlayer.name+"</td>";
						
					if (b == 0) {
						constructTable = constructTable + "\
							<td class=\"numeric\">"+readValue(activePlayer.size,1)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.atk,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.def,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.tac,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.move,1)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.terraform,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.explore,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.SY,1)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.fighter,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.PD,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.cloak,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.scan,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.minelay,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.minesweep,0)+"</td></tr>";
					} else {
						constructTable = constructTable + "\
							<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.academy,0)+"</td> \
							<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.boarding,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.security,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.troops,1)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.fastMove,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.BHJ,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.advCon,0)+"</td> \
							<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.tractor,0)+"</td> \
							<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.shieldProj,0)+"</td> \
							<td class=\"numeric\">"+readValue(activePlayer.antiRep,0)+"</td></tr>";
					}
				}
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{techTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		}
		
		if (curStage.victoryTable) {
			var constructTable = "<table><caption>Victory Point Chart</caption> \
				<tr><th>Player</th><th>VP</th></tr>";
				
			for (var a = 0; a < curStage.victoryTable.length; a++) {
				var activePlayer = curStage.victoryTable[a];
				
				if (readValue(activePlayer.isDead,false)) {
					// Player is dead
					constructTable = constructTable + "<tr class=\"deadPlr\">";
				} else {
					constructTable = constructTable + "<tr>";
				}
				constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.VP,0)+" / "+readValue(activePlayer.quota,"&infin;")+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{vpTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		}
		
		if (curStage.amoebaTable) {
			var constructTable = "<table><caption>Amoeba Database</caption> \
				<tr><th>Amoeba</th><th>Research</th><th>Strength</th><th>Mine Immune?</th></tr>";
				
			for (var a = 0; a < curStage.amoebaTable.length; a++) {
				var activeAmoeba = curStage.amoebaTable[a];
				var classMods = ["","",""];
				
				if (readValue(activeAmoeba.isDead, false)) {
					constructTable = constructTable + "<tr class=\"deadPlr\"><td>"+activeAmoeba.name+"</td> \
						<td class=\"numeric\">"+readValue(activeAmoeba.RP, 0)+" / 10</td> \
						<td class=\"numeric\">"+readValue(activeAmoeba.strength, "?")+"</td> \
						<td class=\"center\">"+readValue(activeAmoeba.mineImmune, false)+"</td></tr>";
				} else {
					if (readValue(activeAmoeba.RP, 0) >= 10) {
						classMods[0] = " increase";
					}
					if (readValue(activeAmoeba.mineImmune, false)) {
						classMods[2] = " decrease";
					}
					
					constructTable = constructTable + "<tr><td>"+activeAmoeba.name+"</td> \
						<td class=\"numeric"+classMods[0]+"\">"+readValue(activeAmoeba.RP, 0)+" / 10</td> \
						<td class=\"numeric\"><a href=\"javascript:showBox('sa"+readValue(activeAmoeba.strength, "?")+"')\">"+readValue(activeAmoeba.strength, "?")+"</a></td> \
						<td class=\"center"+classMods[2]+"\">"+readValue(activeAmoeba.mineImmune, false)+"</td></tr>";
				}
				
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{amoebaTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}
		}
		
		if (curStage.replicatorTable) {
			var activePlayer = curStage.replicatorTable[0];
			var constructTable = "<table><caption>Replicator Empire Development ("+activePlayer.name+")</caption> \
				<tr><th>Hull Size</th><th>Attack</th><th>Defense</th><th>Tactics</th><th>Adv Ships</th><th>Fleet Size</th> \
				<th>Purchased</th><th>Trait</th><th>NPA</th><th>DM</th><th>Wrecks</th></tr>";
			
			var RPtotal = readValue(activePlayer.hullSize, 0) + readValue(activePlayer.atkSeen, 0) +
				readValue(activePlayer.defSeen, 0) + Math.max(readValue(activePlayer.tacSeen, 0) - 1,0) + 
				readValue(activePlayer.advShips, 0) + Math.min(Math.floor(readValue(activePlayer.fleetSize, 0) / 5),3) +
				readValue(activePlayer.purchased, 0) + readValue(activePlayer.advBonus, 0) + 
				Math.min(readValue(activePlayer.NPA, 0) + readValue(activePlayer.DM, 0) + readValue(activePlayer.wrecks, 0), 3);

			constructTable = constructTable + "<tr><td class=\"numeric\">"+readValue(activePlayer.hullSize, 0)+" / 8</td> \
				<td class=\"numeric\">"+readValue(activePlayer.atkSeen, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.defSeen, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.tacSeen, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.advShips, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.fleetSize/5, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.purchased, 0)+" / 5</td> \
				<td class=\"numeric\">"+readValue(activePlayer.advBonus, 0)+" / 1</td> \
				<td class=\"numeric\">"+readValue(activePlayer.NPA, 0)+" / 1</td> \
				<td class=\"numeric\">"+readValue(activePlayer.DM, 0)+" / 1</td> \
				<td class=\"numeric\">"+readValue(activePlayer.wrecks, 0)+" / 3</td></tr>";

			constructTable = constructTable + "<tr><th>RP Total</th><th>PD Tech</th><th>Ftr Kills</th><th colspan=\"2\">Sweep Tech</th> \
				<th>Sweep Count</th><th>Scan Tech</th><th colspan=\"2\">Explore Tech</th><th colspan=\"2\">Move Tech</th></tr>";

			constructTable = constructTable + "<tr><td class=\"numeric\">"+RPtotal+" / 15</td> \
				<td class=\"numeric\">"+readValue(activePlayer.pdTech, 0)+" / 1</td> \
				<td class=\"numeric\">"+readValue(activePlayer.ftrKills, 0)+" / 3</td> \
				<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.sweepTech, 0)+" / 1</td> \
				<td class=\"numeric\">"+readValue(activePlayer.sweepCt, 0)+" / 3</td> \
				<td class=\"numeric\">"+readValue(activePlayer.scanTech, 0)+" / 1</td> \
				<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.explore, 0)+" / 1</td> \
				<td class=\"numeric\" colspan=\"2\">"+readValue(activePlayer.moveTech, 1)+" / 7</td></tr>";
				
			constructTable = constructTable + "</table>";
			seekTag = "{replicatorTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}
		}
	}
	
	// Ditch all "ghost" counters
	var ghostCollection = document.getElementsByClassName("ghost");
	for (var g = 0; g < ghostCollection.length; g++) {
		if (ghostCollection[g].className && ghostCollection[g].className.indexOf("ghost") >= 0) {
			ghostCollection[g--].remove();
		}
	}
	
	// Parse the many actions
	actionPool = curStage.actions;
	for (i in actionPool) {
		// console.log(actionPool[i]);
		var inferLocation;
		
		if (actionPool[i].location) {
			inferLocation = actionPool[i].location;
		} else if (actionPool[i].placeCounter && actionPool[i].placeCounter.startsWith("system")) {
			inferLocation = actionPool[i].placeCounter.substring(6);
		}
		
		if (inferLocation) {
			for (y = 0; y < 12; y++) {
				if (letterRows.charAt(y) == inferLocation.substring(0,1)) {
					readY = y;
					break;
				}
			}
			
			readX = inferLocation.substring(1);
		}
		
		if (actionPool[i].rollDice) {
			for (var r = 0; r < actionPool[i].rollDice; r++) {
				console.log("Rolled a "+irandom(1,10)+".")
			}
		}
		
		if (actionPool[i].placeCounter) {
			// Place a counter. Permanent until deleted
			workId = actionPool[i].placeCounter;
			if (actionPool[i].name) {
				placeCounter(workId, readX, readY, actionPool[i].name, readValue(actionPool[i].size,0));
			} else {
				var convertName = null;
				
				placeCounter(workId, readX, readY, convertName, readValue(actionPool[i].size,0));
			}
		} else if (actionPool[i].placeHullsV) {
			// Places a series of Replicator hulls
			var startNum = actionPool[i].startId;
			var hullsColl = actionPool[i].placeHullsV.split(",");
			
			for (var h = 0; h < hullsColl.length; h++) {
				for (y = 0; y < 12; y++) {
					if (letterRows.charAt(y) == hullsColl[h].substring(0,1)) {
						readY = y;
						break;
					}
				}
				
				readX = hullsColl[h].substring(1);

				var workNum = startNum + h;
				placeCounter("hullV"+workNum, readX, readY, "hiddenV", 1);
			}
		} else if (actionPool[i].placeGhost) {
			// Places a transparent counter. Valid for one stage
			workId = actionPool[i].placeGhost;
			placeCounter(workId, readX, readY, workId, -1);
		}
		
		if (actionPool[i].revealCounter) {
			workId = actionPool[i].revealCounter;
			renderCounter(workId, actionPool[i].name);
		}
		
		if (actionPool[i].resizeCounter) {
			workId = actionPool[i].resizeCounter;
			resizeStack(workId, actionPool[i].size);
		}
		
		if (actionPool[i].removeCounter) {
			workId = actionPool[i].removeCounter;
			
			workObj = document.getElementById(workId);
			if (workObj) {
				workObj.remove();
			}
		}
		
		if (actionPool[i].removeAllCounters) {
			imgCollection = document.getElementsByTagName("img")
			
			for (var h = 0; h < imgCollection.length; h++) {
				if (imgCollection[h] && imgCollection[h].src.indexOf(actionPool[i].removeAllCounters) >= 0) {
					imgCollection[h--].remove();
				}
			}
		}
		
		/* 
		 * Presets are usually game setups. They perform a bunch of smaller actions,
		 * making it extremely easy to do multiple playthroughs of the same setup.
		 */
		if (actionPool[i].createPreset) {
			var ctrlPanel = document.getElementById("controls");
			var hexBoard = document.getElementById("gameBoard");
			
			makeHexes(actionPool[i].createPreset.indexOf("belt") >= 0);
			
			if (actionPool[i].createPreset == "alienEmpiresSolo") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");
				
				for (var l = 1; l <= 12; l++) {
					if (l <= 3 || l >= 10) {
						placeSystemMarker(l,0,deepSpace);
						placeSystemMarker(l,1,deepSpace);
					}

					if (l <= 4 || l >= 9) {
						placeSystemMarker(l,3,deepSpace);
					}
				}
				
				for (var j = 1; j <= 13; j++) {
					if (j <= 3 || j >= 11) {
						placeSystemMarker(j,2,deepSpace);
					}
				}
				
				for (var h = 2; h <= 12; h++) {
					if (h <= 5 || h >= 9) {
						placeSystemMarker(h,4,deepSpace);
					}

					if (h <= 11) {
						placeSystemMarker(h,5,deepSpace);
					}
				}

				for (var f = 4; f <= 10; f++) {
					placeSystemMarker(f,6,deepSpace);
					
					if (f < 10) {
						placeSystemMarker(f,7,deepSpace);
					}
				}
				
				if (actionPool[i].alienColors) {
					var alienHWs = [[1,4], [13,4], [7,8]];
					
					for (var a = 0; a < actionPool[i].alienColors.length; a++) {
						placeAlienHomeworld(alienHWs[a][0], alienHWs[a][1], actionPool[i].alienColors.charAt(a));
					}
				}
				
				for (var z = 6+actionPool[i].alienColors.length; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			} else if (actionPool[i].createPreset == "alienEmpiresSoloLg") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrColor = actionPool[i].playerColor;
				
				for (var y = 0; y < 9; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (y < 2) {
								placeSystemMarker(x,y,"unexplored"+plrColor);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}

				placeHomeworld(7,0,plrColor);

				for (var z = 9; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
				
				if (actionPool[i].alienColors) {
					var alienHWs = [[1,6], [13,6], [7,8]];
					
					for (var a = 0; a < 3; a++) {
						if (a < actionPool[i].alienColors.length) {
							placeAlienHomeworld(alienHWs[a][0], alienHWs[a][1], actionPool[i].alienColors.charAt(a));
						}
					}
				}
			} else if (actionPool[i].createPreset == "alienEmpiresSoloVP") {
				expansionHWs = true;
				var plrColor = actionPool[i].playerColor;
				
				for (var y = 0; y <= 11; y++) {
					for (var x = 1; x <= 13 - y % 2; x++) {
						if ((x == 3 || x == 10) && y == 0) {
							placeSystemMarker(x,y,"warp1");
						} else if (x == 7 && y == 6) {
							placeSystemMarker(x,y,"capitol");
							placeCounter("galMin",x,y,"minerals10",1);
						} else if (x >= 6 && x <= 8 - y % 2 && y >= 5 && y <= 7) {
							placeSystemMarker(x,y,"nebula");
						} else if (y <= 9) {
							placeSystemMarker(x,y,deepSpace);
						} else {
							paintTile(letterRows.charAt(y)+x,"unexploredW");
						}
					}
				}

				place3plrHomeMarkers(plrColor, "top");

				paintTile("G6","unexploredW");
				paintTile("G7","unexploredW");
				paintTile("F6","unexploredW");
				paintTile("F8","unexploredW");
				paintTile("E6","unexploredW");
				paintTile("E7","unexploredW");
				
				if (actionPool[i].alienColors) {
					var alienHWs = [[4,11], [9,11]];
					
					for (var a = 0; a < actionPool[i].alienColors.length; a++) {
						placeAlienHomeworld(alienHWs[a][0], alienHWs[a][1], actionPool[i].alienColors.charAt(a));
					}
				}
			} else if (actionPool[i].createPreset == "doomsdaySoloSm") {
				ctrlPanel.className = "dmBoard";
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");
				
				placeSystemMarker(3,0,deepSpace);
				placeSystemMarker(10,0,deepSpace);
				
				for (var k = 2; k <= 11; k++) {
					if (k <= 3 || k >= 10) {
						placeSystemMarker(k,1,deepSpace);
					}

					if (k <= 4 || k >= 9) {
						placeSystemMarker(k,3,deepSpace);
					}
				}
				
				for (var j = 2; j <= 12; j++) {
					if (j <= 3 || j >= 11) {
						placeSystemMarker(j,2,deepSpace);
					}
				}
				
				placeSystemMarker(3,4,deepSpace);
				placeSystemMarker(5,4,deepSpace);
				placeSystemMarker(9,4,deepSpace);
				placeSystemMarker(11,4,deepSpace);
				
				for (var g = 4; g <= 9; g++) {
					placeSystemMarker(g,5,deepSpace);
					
					if (g > 4 && g != 7) {
						placeSystemMarker(g,6,deepSpace);
					}
				}
				
				for (var w = 1; w <= 13; w = w + 0.5) {
					if (w < 2 || w > 12) {
						dispCol(w, false);
					}
				}

				placeSystemMarker(2,0,markerCounter+plrColor);
				placeSystemMarker(11,0,markerCounter+plrColor);
				placeSystemMarker(4,4,markerCounter+plrColor);
				placeSystemMarker(10,4,markerCounter+plrColor);
				placeSystemMarker(7,6,markerCounter+plrColor);
				
				for (var z = 7; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			} else if (actionPool[i].createPreset == "doomsdaySoloLg") {
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");

				for (var l = 1; l <= 13; l++) {
					if (l <= 3 || l >= 10) {
						placeSystemMarker(l,0,deepSpace);
						
						if (l < 13) {
							placeSystemMarker(l,1,deepSpace);
						}
						if (l != 10) {
							placeSystemMarker(l,2,deepSpace);
						}
					}

					if (l <= 4 || (l >= 9 && l < 13)) {
						placeSystemMarker(l,3,deepSpace);
					}
				}

				for (var h = 2; h <= 12; h++) {
					if (h <= 5 || h >= 9) {
						placeSystemMarker(h,4,deepSpace);
					}
					placeSystemMarker(h,5,deepSpace);
					if (h >= 3) {
						placeSystemMarker(h,6,deepSpace);
						if (h <= 10) {
							placeSystemMarker(h,7,deepSpace);
							if (h >= 4) {
								placeSystemMarker(h,8,deepSpace);
							}
						}
					}
				}

				placeSystemMarker(1,4,markerCounter+plrColor);
				placeSystemMarker(13,4,markerCounter+plrColor);
				placeSystemMarker(2,7,markerCounter+plrColor);
				placeSystemMarker(11,7,markerCounter+plrColor);
				placeSystemMarker(7,9,markerCounter+plrColor);
				
				for (var z = 10; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
				
			} else if (actionPool[i].createPreset == "doomsdayCoop2P" || actionPool[i].createPreset == "alienEmpiresCoop2P") {
				expansionHWs = true;
				var plrColors = actionPool[i].playerColors;
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (y < 5 && x <= 5 || (x == 6 && y == 2)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(0));
							} else if (y < 5 && x >= 9 || (x == 8 && y != 2 && y <= 3)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(1));
							} else if (x == 7 && y == 2) {
								placeSystemMarker(x,y,"warp1");
							} else if (x == 7 && y == 6) {
								placeSystemMarker(x,y,"capitol");
								placeCounter("galMin",x,y,"minerals10",1);
							} else if (x >= 6 && x <= 8 - y % 2 && y >= 5 && y <= 7) {
								placeSystemMarker(x,y,"nebula");
							} else if (y <= 9) {
								placeSystemMarker(x,y,deepSpace);
							} else {
								paintTile(letterRows.charAt(y)+x,"unexploredW");
							}
						}
					}
				}
				
				placeHomeworld(6,2,plrColors.charAt(0));
				placeHomeworld(9,2,plrColors.charAt(1));

				if (actionPool[i].createPreset.startsWith("doomsday")) {
					placeSystemMarker(3,11,markerCounter+plrColors.charAt(0));
					paintTile("A3","empty");
					placeSystemMarker(7,11,markerCounter+"W");
					paintTile("A7","empty");
					placeSystemMarker(11,11,markerCounter+plrColors.charAt(1));
					paintTile("A11","empty");
				} else {
					placeAlienHomeworld(4, 11, actionPool[i].alienColors.charAt(0));
					placeAlienHomeworld(9, 11, actionPool[i].alienColors.charAt(1));
				}
				
				paintTile("G6","unexploredW");
				paintTile("G7","unexploredW");
				paintTile("F6","unexploredW");
				paintTile("F8","unexploredW");
				paintTile("E6","unexploredW");
				paintTile("E7","unexploredW");
				
			} else if (actionPool[i].createPreset == "amoebaSolo") {
				ctrlPanel.className = "dmBoard";
				expansionHWs = true;
				var plrColor = actionPool[i].playerColor;
				var aomeba = ["amoeba1", "amoeba2", "amoeba3"]
				
				place3plrHomeMarkers(plrColor, "top");
				
				placeSystemMarker(3,0,deepSpace);
				placeSystemMarker(10,0,deepSpace);

				placeSystemMarker(3,1,deepSpace);
				placeSystemMarker(10,1,deepSpace);

				placeSystemMarker(3,2,deepSpace);
				placeSystemMarker(11,2,deepSpace);
				
				for (var k = 3; k <= 10; k++) {
					if (k <= 4 || k >= 9) {
						placeSystemMarker(k,3,deepSpace);
					}
				}
				
				placeSystemMarker(5,4,deepSpace);
				placeSystemMarker(9,4,deepSpace);
				
				placeSystemMarker(6,5,deepSpace);
				placeSystemMarker(7,5,deepSpace);
				
				placeSystemMarker(2,2,aomeba[0]);
				placeSystemMarker(12,2,aomeba[1]);
				placeSystemMarker(7,6,aomeba[2]);
				
				paintTile("K2","unexploredW");
				paintTile("I2","unexploredW");
				paintTile("H3","unexploredW");
				paintTile("H4","unexploredW");
				
				paintTile("L11","unexploredW");
				paintTile("K11","unexploredW");
				paintTile("I11","unexploredW");
				paintTile("H10","unexploredW");
				paintTile("H11","unexploredW");
				
				for (var w = 1; w <= 13; w = w + 0.5) {
					if (w < 2 || w > 12) {
						dispCol(w, false);
					}
				}
				
				for (var z = 7; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			} else if (actionPool[i].createPreset == "versus2Pknife") {
				var plrColors = actionPool[i].playerColors;
				
				for (var y = 0; y < 5; y++) {
					for (var x = 1; x <= 11; x++) {
						if (x < 6 || (y == 2 && x == 6)) {
							placeSystemMarker(x,y,"unexplored"+plrColors.charAt(0));
						} else if (x < 12 - (y % 2) && (y < 4 || x < 11)) {
							placeSystemMarker(x,y,"unexplored"+plrColors.charAt(1));
						}
					}
				}
				
				placeHomeworld(1,2,plrColors.charAt(0));
				placeHomeworld(11,2,plrColors.charAt(1));

				for (var z = 5; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
				
				for (var w = 13; w > 11; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Psm") {
				ctrlPanel.className = "versusBoard";
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 2; y < 10; y++) {
					for (var x = 1; x <= 9; x++) {
						if (x < 9 || y % 2 == 0) {
							if (y < 5) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (y >= 7) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				if (actionPool[i].extraHexAway) {
					placeSystemMarker(9,7,"unexplored"+plrColors[1]);
				} else {
					placeSystemMarker(9,9,"unexplored"+plrColors[1]);
				}

				placeHomeworld(plrCols[0],2,plrColors[0]);
				placeHomeworld(plrCols[1],9,plrColors[1]);

				for (var z = 0; z < 2; z++) {
					dispRow(letterRows.charAt(z), false);
					dispRow(letterRows.charAt(z+10), false);
				}
				
				for (var w = 13; w >= 10; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Pmed" || actionPool[i].createPreset == "replicatorSolo") {
				ctrlPanel.className = "versusBoard";
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var difficulty = 0;
				var repEdition = 1;
				
				if (actionPool[i].createPreset == "replicatorSolo") {
					expansionHWs = true;
					plrColors[0] = "V";
					difficulty = actionPool[i].difficulty;
					repEdition = actionPool[i].edition;
				}
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 1; y < 11; y++) {
					for (var x = 1; x <= 9; x++) {
						if (x < 9 || y % 2 == 0) {
							if (y < 4) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (y >= 8) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				if (actionPool[i].extraHexAway) {
					placeSystemMarker(9,3,"unexplored"+plrColors[0]);
				} else {
					placeSystemMarker(9,1,"unexplored"+plrColors[0]);
				}

				placeHomeworld(plrCols[0],1,plrColors[0]);
				placeHomeworld(plrCols[1],10,plrColors[1]);
				
				switch (difficulty) {
					case 1:
						// Easy: Player gets 2 extra Colony Ships
						placeCounter("CO4"+plrColors[1],plrCols[1],10,"CO"+plrColors[1],1);
						placeCounter("CO5"+plrColors[1],plrCols[1],10,"CO"+plrColors[1],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"6",plrCols[0],1,"type0"+plrColors[0],1);
							placeCounter("CO6"+plrColors[1],plrCols[1],10,"CO"+plrColors[1],1);
						}
						break;
					case 2:
						// Normal: Player gets 1 extra Colony Ship. Replicator gets 1 extra hull
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],1,"type0"+plrColors[0],1);
						placeCounter("CO4"+plrColors[1],plrCols[1],10,"CO"+plrColors[1],1);
						break;
					case 3:
						// Hard: Replicator gets 2 extra hulls and 1 RP
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],1,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"7",plrCols[0],1,"type0"+plrColors[0],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"8",plrCols[0],1,"type0"+plrColors[0],1);
						}
						break;
					case 4:
						// Impossible: Replicator gets 3 extra hulls and 2 RP
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],1,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"7",plrCols[0],1,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"8",plrCols[0],1,"type0"+plrColors[0],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"9",plrCols[0],1,"type0"+plrColors[0],1);
						}
						break;
				}
				
				if (actionPool[i].createPreset == "replicatorSolo") {
					for (var h = 1; h <= 8; h++) {
						renderCounter("type0"+plrColors[0]+h,"hidden"+plrColors[0]);
					}
				}

				dispRow(letterRows.charAt(0), false);
				dispRow(letterRows.charAt(11), false);
				
				for (var w = 13; w >= 10; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Plg" || actionPool[i].createPreset == "replicatorSoloLg") {
				ctrlPanel.className = "versusBoard";
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var difficulty = 0;
				var repEdition = 1;
				
				if (actionPool[i].createPreset == "replicatorSoloLg") {
					expansionHWs = true;
					plrColors[0] = "V";
					difficulty = actionPool[i].difficulty;
					repEdition = actionPool[i].edition;
				}
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 9; x++) {
						if (x < 9 || y % 2 == 0) {
							if (y < 3) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (y >= 9) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				if (actionPool[i].extraHexAway) {
					placeSystemMarker(9,9,"unexplored"+plrColors[1]);
				} else {
					placeSystemMarker(9,11,"unexplored"+plrColors[1]);
				}

				placeHomeworld(plrCols[0],0,plrColors[0]);
				placeHomeworld(plrCols[1],11,plrColors[1]);
				
				switch (difficulty) {
					case 1:
						// Easy: Player gets 2 extra Colony Ships
						placeCounter("CO4"+plrColors[1],plrCols[1],11,"CO"+plrColors[1],1);
						placeCounter("CO5"+plrColors[1],plrCols[1],11,"CO"+plrColors[1],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"6",plrCols[0],0,"type0"+plrColors[0],1);
							placeCounter("CO6"+plrColors[1],plrCols[1],11,"CO"+plrColors[1],1);
						}
						break;
					case 2:
						// Normal: Player gets 1 extra Colony Ship. Replicator gets 1 extra hull
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],0,"type0"+plrColors[0],1);
						placeCounter("CO4"+plrColors[1],plrCols[1],11,"CO"+plrColors[1],1);
						break;
					case 3:
						// Hard: Replicator gets 2 extra hulls and 1 RP
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],0,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"7",plrCols[0],0,"type0"+plrColors[0],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"8",plrCols[0],0,"type0"+plrColors[0],1);
						}
						break;
					case 4:
						// Impossible: Replicator gets 3 extra hulls and 2 RP
						placeCounter("type0"+plrColors[0]+"6",plrCols[0],0,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"7",plrCols[0],0,"type0"+plrColors[0],1);
						placeCounter("type0"+plrColors[0]+"8",plrCols[0],0,"type0"+plrColors[0],1);
						if (repEdition == 2) {
							placeCounter("type0"+plrColors[0]+"9",plrCols[0],0,"type0"+plrColors[0],1);
						}
						break;
				}
				
				if (actionPool[i].createPreset == "replicatorSoloLg") {
					for (var h = 1; h <= 8; h++) {
						renderCounter("type0"+plrColors[0]+h,"hidden"+plrColors[0]);
					}
				}
				
				for (var w = 13; w >= 10; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Pxl" || actionPool[i].createPreset == "versus2P3D") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (y < 5 && x <= 5 || (x == 6 && y == 2)) {
								if (actionPool[i].createPreset == "versus2Pxl") {
									placeSystemMarker(x,y,deepSpace);
								}
							} else if (y < 5 && x >= 9 || (x == 8 && y != 2 && y <= 3)) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (y > 6 && x <= 5 || (x == 6 && y == 10)) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else if (y > 6 && x >= 8 && (y != 10 || x > 8)) {
								if (actionPool[i].createPreset == "versus2Pxl") {
									placeSystemMarker(x,y,deepSpace);
								}
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				placeHomeworld(plrCols[0],0,plrColors[0]);
				placeHomeworld(plrCols[1],11,plrColors[1]);
			} else if (actionPool[i].createPreset == "versus2Pmassive") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (x >= 9 + Math.floor(y/2)) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (x <= -1 + Math.floor(y/2)) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				for (var z = 0; z < actionPool[i].extraHexes.length; z++) {
					seekHex = actionPool[i].extraHexes[z];
					
					if (z == 0) {
						placeSystemMarker(seekHex.substr(1),letterRows.indexOf(seekHex.charAt(0)),"unexplored"+plrColors[0]);
					} else {
						placeSystemMarker(seekHex.substr(1),letterRows.indexOf(seekHex.charAt(0)),"unexplored"+plrColors[1]);
					}
				}
				
				placeHomeworld(plrCols[0],0,plrColors[0]);
				placeHomeworld(plrCols[1],11,plrColors[1]);
			} else if (actionPool[i].createPreset == "versus2Pdare") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
				var plrCols = [plrSlots[0].substr(1), plrSlots[1].substr(1)];
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (y < 2) {
								placeSystemMarker(x,y,"unexplored"+plrColors[0]);
							} else if (y >= 10) {
								placeSystemMarker(x,y,"unexplored"+plrColors[1]);
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				for (var z = 0; z < actionPool[i].extraHexes.length; z++) {
					seekHex = actionPool[i].extraHexes[z];
					
					if (z == 0) {
						placeSystemMarker(seekHex.substr(1),letterRows.indexOf(seekHex.charAt(0)),"unexplored"+plrColors[0]);
					} else {
						placeSystemMarker(seekHex.substr(1),letterRows.indexOf(seekHex.charAt(0)),"unexplored"+plrColors[1]);
					}
				}
				
				placeHomeworld(plrCols[0],0,plrColors[0]);
				placeHomeworld(plrCols[1],11,plrColors[1]);
			} else if (actionPool[i].createPreset == "versus2Pbelt") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrColors = actionPool[i].playerColors;
				
				for (var y = 1; y < 12; y++) {
					for (var x = 1; x <= 16; x++) {
						if (x < 16 || y % 2 == 0) {
							if (x < 4 - y % 2 && (y != 10 || x < 3)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(0));
							} else if (x > 13 && (y != 2 || x > 14)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(1));
							} else if (x >= 11 - Math.ceil(y/2) && x < 13 - Math.ceil(y/2)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(2));
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				placeHomeworld(1,1,plrColors.charAt(0));
				placeHomeworld(15,11,plrColors.charAt(1));
			} else if (actionPool[i].createPreset == "versus3P" || actionPool[i].createPreset == "doomsdayCoop3P" ||
				actionPool[i].createPreset == "alienEmpiresCoop3P") {
				var plrColors = actionPool[i].playerColors;
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							placeSystemMarker(x,y,deepSpace);
						}
					}
				}
				
				if (!actionPool[i].createPreset.startsWith("versus")) {
					expansionHWs = true;
					placeSystemMarker(1,10,"warp1");
					placeSystemMarker(13,10,"warp1");
					
					placeSystemMarker(7,6,"capitol");
					placeCounter("galMin",7,6,"minerals10",1);
					
					placeSystemMarker(6,5,"nebula");
					placeSystemMarker(7,5,"nebula");
					placeSystemMarker(6,6,"nebula");
					placeSystemMarker(8,6,"nebula");
					placeSystemMarker(6,7,"nebula");
					placeSystemMarker(7,7,"nebula");

					if (actionPool[i].createPreset.startsWith("doomsday")) {
						placeSystemMarker(7,11,markerCounter+plrColors.charAt(0));
						placeSystemMarker(1,0,markerCounter+plrColors.charAt(1));
						placeSystemMarker(13,0,markerCounter+plrColors.charAt(2));
					
						paintTile("L1","empty");
						paintTile("L13","empty");
						paintTile("A7","empty");
					} else {
						placeAlienHomeworld(1,0,actionPool[i].alienColor);
						placeAlienHomeworld(13,0,actionPool[i].alienColor);
						placeCounter("base2"+actionPool[i].alienColor,1,0,null,1);
					}
				}

				place3plrHomeMarkers(plrColors.charAt(0), "top");
				place3plrHomeMarkers(plrColors.charAt(1), "left");
				place3plrHomeMarkers(plrColors.charAt(2), "right");
			} else if (actionPool[i].createPreset == "versus4P" || actionPool[i].createPreset == "doomsdayCoop4P") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrColors = "GYRB";
				
				if (actionPool[i].playerColors) {
					plrColors = actionPool[i].playerColors;
				}
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (y < 5 && x <= 5 || (x == 6 && y == 2)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(0));
							} else if (y < 5 && x >= 9 || (x == 8 && y != 2 && y <= 3)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(1));
							} else if (y > 6 && x <= 5 || (x == 6 && y == 10)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(2));
							} else if (y > 6 && x >= 8 && (y != 10 || x > 8)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(3));
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				if (actionPool[i].createPreset.startsWith("doomsday")) {
					expansionHWs = true;
					placeSystemMarker(7,11,"warp1");
					
					placeSystemMarker(7,0,"capitol");
					placeCounter("galMin",7,0,"minerals10",1);
					
					placeSystemMarker(6,0,"nebula");
					placeSystemMarker(6,1,"nebula");
					placeSystemMarker(7,1,"nebula");

					placeSystemMarker(1,6,markerCounter+"W");
					placeSystemMarker(7,6,markerCounter+"W");
					placeSystemMarker(13,6,markerCounter+"W");
					
					paintTile("F1","empty");
					paintTile("F7","empty");
					paintTile("F13","empty");
				}
				
				placeHomeworld(1,0,plrColors.charAt(0));
				placeHomeworld(13,0,plrColors.charAt(1));
				placeHomeworld(1,11,plrColors.charAt(2));
				placeHomeworld(12,11,plrColors.charAt(3));
			} else if (actionPool[i].createPreset == "versus5P") {
				expansionHWs = true;
				plrColors = actionPool[i].playerColors;
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							if (x >= 5 + Math.floor(y/2) && x <= 9 - Math.ceil(y/2) && y <= 2) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(0));
							} else if (x <= 2 && y >= 2 && y <= 6 || (x == 3 && y == 4)) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(1));
							} else if (x >= 11 && y >= 2 && y <= 6 && (x >= 12 || (y != 2 && y != 6))) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(2));
							} else if (x >= 7 - Math.ceil(y/2) && x <= Math.floor(y/2) && y >= 9) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(3));
							} else if (x >= 14 - Math.ceil(y/2) && x <= Math.floor(y/2) + 7 && y >= 9) {
								placeSystemMarker(x,y,"unexplored"+plrColors.charAt(4));
							} else {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				placeHomeworld(7,0,plrColors.charAt(0));
				placeHomeworld(1,4,plrColors.charAt(1));
				placeHomeworld(13,4,plrColors.charAt(2));
				placeHomeworld(3,11,plrColors.charAt(3));
				placeHomeworld(10,11,plrColors.charAt(4));
				
				extraDShexes = actionPool[i].dsHexes.split(",");
				
				for (var z = 0; z < extraDShexes.length; z++) {
					var x = extraDShexes[z].substr(1);
					var y = letterRows.indexOf(extraDShexes[z].charAt(0));
					
					console.log({y,x});
					placeSystemMarker(x,y,deepSpace);
				}
			}
		}
	}

	document.getElementById("stageL").disabled = (stageNum <= 0);
	document.getElementById("stageR").disabled = (stageNum >= stageTotal);

	document.getElementById("ecoL").disabled = document.getElementById("stageL").disabled;
	document.getElementById("ecoR").disabled = document.getElementById("stageR").disabled;
	
	if (!multiStages) {
		setStorage("se4xReplay", getParam("replay")+"~"+stageNum);
	}
}

function jumpToEcoPhase(direction) {
	do {
		changeStage(direction);
	} while (stageNum > 0 && stageNum < stageTotal && typeof curStage.prodTable === "undefined")
}

function changeStage(direction) {
	stageNum += direction;
	readJson();
}

function getJsonFile() {
	readFile = "games/"+getParam("replay")+".json";
	var jsonReplay = document.getElementById("replayJson");
	
	stageMem = 0;
	
	// AJAX this
	if (window.XMLHttpRequest) {
		//Code for modern browsers
		fileRequest = new XMLHttpRequest();
	} else {
		//Legacy code, for ancient IE versions 5 and 6
		fileRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	fileRequest.open("GET",readFile,true);
	fileRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	fileRequest.send();
	
	fileRequest.onreadystatechange = function() {
		if (fileRequest.readyState === 4) {
			if (fileRequest.status==200) {
				rawJson = JSON.parse(fileRequest.responseText);
				setupBox();
				stageTotal = rawJson.stages.length - 1;
				
				if (getStorage("se4xReplay") && getStorage("se4xReplay").startsWith(getParam("replay"))) {
					stageMem = getStorage("se4xReplay").split("~")[1];
				}
				
				readJson();
				while (stageNum < stageMem) {
					changeStage(1);
				}
				multiStages = false;
			} else {
				if (fileRequest.status == 404) {
					makeHexes(false);
					document.getElementById("commentary").innerHTML = "<p>No file detected.</p>"
				}
				console.error("Error "+fileRequest.status);
			}
		}
	}
}

//Storage
function setStorage(sName, sValue) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(sName, sValue);
	} else {
		var targetDate = new Date();
		targetDate.setTime(targetDate.getTime() + (360*24*60*60*1000));
		
		setCookie(sName, sValue, targetDate, "/");
	}
}

function getStorage(sName) {
	if (typeof(Storage) !== "undefined") {
		return localStorage.getItem(sName);
	} else {
		return getCookie(sName);
	}
}

//Fallback Cookies
function setCookie(cName, cValue, expDate, cPath, cDomain, cSecure) {
	if (cName && cValue != "") {
		var cString = cName + "=" + encodeURI(cValue) + ";samesite=lax";
		cString += (expDate ? ";expires=" + expDate.toUTCString(): "");
		cString += (cPath ? ";path=" + cPath : "");
		cString += (cDomain ? ";domain=" + cDomain : "");
		cString += (cSecure ? ";secure" : "");
		document.cookie = cString;
	}
}

function getCookie(cName) {
	if (document.cookie) {
		var cookies = document.cookie.split("; ");
		for (var i = 0; i < cookies.length; i++) {
			if (cookies[i].split("=")[0] == cName) {
				return decodeURI(cookies[i].split("=")[1]);
			}
		}
	}
}
