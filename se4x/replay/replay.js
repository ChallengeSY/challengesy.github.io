var rawJson;
var stageTotal;
var stageNum = 0;
var saveCookieDate = new Date;
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
				var newHex = document.createElement("img");
				newHex.className = "hex";
				newHex.src = "gfx/tiles/borderX.png";
				newHex.id = "hex"+letterRows.charAt(y)+(x+1);
				newHex.title = "Sector "+newHex.id.substr(3);
				newRow.appendChild(newHex);
			}
			hexBoard.appendChild(newRow);
		}
		
		if (talonMap) {
			ctrlPanel.style.gridTemplateColumns = "auto 50px 50px 870px 50px 50px auto";
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
			if (b == "L") {
				if (newDisp) {
					findObj.style.visibility = "";
				} else {
					findObj.style.visibility = "hidden";
				}
				
				hexBoard.style.marginTop = "-45px";
			} else if (b == "K") {
				if (newDisp) {
					findObj.style.visibility = "";
				} else {
					findObj.style.visibility = "hidden";
				}
				
				hexBoard.style.marginTop = "-90px";
			} else {
				if (newDisp) {
					findObj.style.display = "";
				} else {
					findObj.style.display = "none";
				}
			}
		}
	}
}

function dispCol(a, newDisp) {
	var affectCol = Math.floor(a);
	
	for (y = 0; y < 12; y++) {
		var findObj = document.getElementById("hex"+letterRows.charAt(y)+affectCol);
		
		if (findObj && (a % 1 == 0 || y % 2 == 1)) {
			if (newDisp) {
				findObj.style.visibility = "";
			} else {
				findObj.style.visibility = "hidden";
			}
			
			/*
			if (newDisp) {
				findObj.style.display = "";
			} else {
				findObj.style.display = "none";
			}
			*/
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
	} else if (localObj.src.indexOf("gfx/planet") >= 0) {
		localObj.title = "Empty planet"
	} else if (localObj.src.indexOf("gfx/unexplored") >= 0) {
		localObj.title = "Unexplored system"
	} else if (localObj.src.indexOf("gfx/amoeba") >= 0) {
		localObj.title = "Space Amoeba"
	} else if (localObj.src.indexOf("gfx/doomsday") >= 0) {
		localObj.title = "Doomsday Machine"
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
	}

	if (stackable) {
		localObj.title = localObj.title + " Group (Size "+stackSize+")";
	}
}

function placeCounter(curId, newX, newY, newPic, newSize) {
	var calcX = newX * 54 - 40;
	var calcY = newY * 46 + 18;
	var workObj, applySize = 0;

	var hexBoard = document.getElementById("gameBoard");
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
		
		hexBoard.appendChild(workObj);
	}
	
	if (!curId.startsWith("system")) {
		var randX, randY;
		
		do {
			randX = irandom(-20,20);
			randY = irandom(-12,12);
		} while (Math.abs(randX) < 17 && Math.abs(randY) < 9)
		
		calcX = calcX + randX;
		calcY = calcY + randY;
	} else {
		applySize = 0;
	}
	
	if (newY % 2 == 1) {
		calcX = calcX + 27;
	}
	
	if (newPic) {
		workObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			workObj.style.zIndex = 1;
		} else if (workObj.id.startsWith("system")) {
			paintTile(workObj, newPic);
		}
	}
	if (applySize > 0) {
		workObj.style.borderLeftWidth = applySize+"px";
		workObj.style.borderTopWidth = applySize+"px";
	}
	
	autoNameCounter(workObj);
	workObj.style.left = calcX + "px";
	workObj.style.top = calcY + "px";
}

function paintTile(baseObj, paintPic) {
	// WIP... maybe
	var applyPic = null;
	var remCounter = false;
	var hexId = "hex";
	
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
			case "unexploredW":
				applyPic = "borderW";
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
	if (expansionHWs) {
		initCP = 30;
	}
	placeSystemMarker(newX,newY,"home"+initCP+color);
	
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
				
				if (readValue(activePlayer.colonyCP,0) <= 0) {
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
		
		if (curStage.alienTable) {
			// Base game economics
			var constructTable = "<table><caption>Alien Economics</caption> \
				<tr><th>Player</th><th>Eco</th><th>Fleet</th><th>Tech</th><th>Def</th><th>Expo</th><th>Hidden</th></tr>";
				
			for (var a = 0; a < curStage.alienTable.length; a++) {
				var activePlayer = curStage.alienTable[a];
				
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
					} else if (activePlayer.victoryChart) {
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
								fleetRange = "1-5";
								techRange = "6-9";
								defRange = "10";
								launchRange = "Launch Auto";
								break;
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
		
		if (curStage.techTable) {
			var constructTable = "<table><caption>Player Technologies</caption> \
				<tr><th>Player</th><th>Size</th><th>Atk</th><th>Def</th><th>Tac</th><th>Move</th> \
				<th>Terraform</th><th>Explore</th><th>SY</th><th>Fighter</th><th>PD</th> \
				<th>Cloak</th><th>Scan</th><th>Minelay</th><th>Minesweep</th></tr>";
				
			for (var a = 0; a < curStage.techTable.length; a++) {
				var activePlayer = curStage.techTable[a];
				
				if (readValue(activePlayer.isDead,false)) {
					// Player is dead
					constructTable = constructTable + "<tr class=\"deadPlr\">";
				} else {
					constructTable = constructTable + "<tr>";
				}
				constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
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
					<td class=\"numeric\">"+readValue(activePlayer.minesweep,0)+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{techTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		}
		
		if (curStage.expansionTable) {
			var constructTable = "<table><caption>Expansion Technologies</caption> \
				<tr><th>Player</th><th>Academy</th><th>Boarding</th><th>Security</th><th>Troops</th><th>Fastmove</th> \
				<th>AdvCon</th><th>Tractor Beams</th><th>Shield Projectors</th><th>Anti-Replicator</th></tr>";
				
			for (var a = 0; a < curStage.expansionTable.length; a++) {
				var activePlayer = curStage.expansionTable[a];
				
				constructTable = constructTable + "<tr><td>"+activePlayer.name+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.shipSize,1)+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.minesweeping,0)+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{expoTable}";
			
			if (commentary.innerHTML.indexOf(seekTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(seekTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		}
		
		if (curStage.victoryTable) {
			var constructTable = "<table><caption>VP Chart</caption> \
				<tr><th>Player</th><th>VP</th><th>Quota</th></tr>";
				
			for (var a = 0; a < curStage.victoryTable.length; a++) {
				var activePlayer = curStage.victoryTable[a];
				
				if (readValue(activePlayer.isDead,false)) {
					// Player is dead
					constructTable = constructTable + "<tr class=\"deadPlr\">";
				} else {
					constructTable = constructTable + "<tr>";
				}
				constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.VP,0)+"</td> \
					<td class=\"numeric\">"+readValue(activePlayer.quota,"&infin;")+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			seekTag = "{victoryTable}";
			
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
		
		if (actionPool[i].placeCounter) {
			workId = actionPool[i].placeCounter;
			if (actionPool[i].name) {
				placeCounter(workId, readX, readY, actionPool[i].name, readValue(actionPool[i].size,0));
			} else {
				var convertName = null;
				
				placeCounter(workId, readX, readY, convertName, readValue(actionPool[i].size,0));
			}
		} else if (actionPool[i].placeGhost) {
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
				
				for (var y = 0; y <= 9; y++) {
					for (var x = 1; x <= 13 - y % 2; x++) {
						if ((x == 3 || x == 10) && y == 0) {
							placeSystemMarker(x,y,"warp1");
						} else if (x == 7 && y == 6) {
							placeSystemMarker(x,y,"capitol");
							placeCounter("galMin",x,y,"minerals10",1);
						} else if (x >= 6 && x <= 8 - y % 2 && y >= 5 && y <= 7) {
							placeSystemMarker(x,y,"nebula");
						} else {
							placeSystemMarker(x,y,deepSpace);
						}
					}
				}

				place3plrHomeMarkers(plrColor, "top");
				
				if (actionPool[i].alienColors) {
					var alienHWs = [[4,11], [9,11]];
					
					for (var a = 0; a < actionPool[i].alienColors.length; a++) {
						placeAlienHomeworld(alienHWs[a][0], alienHWs[a][1], actionPool[i].alienColors.charAt(a));
					}
				}
			} else if (actionPool[i].createPreset == "doomsdaySoloSm") {
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
							} else if (y < 10) {
								placeSystemMarker(x,y,deepSpace);
							}
						}
					}
				}
				
				placeHomeworld(6,2,plrColors.charAt(0));
				placeHomeworld(9,2,plrColors.charAt(1));

				if (actionPool[i].createPreset.startsWith("doomsday")) {
					placeSystemMarker(3,11,markerCounter+plrColors.charAt(0));
					placeSystemMarker(7,11,markerCounter+"W");
					placeSystemMarker(11,11,markerCounter+plrColors.charAt(1));
				} else {
					placeAlienHomeworld(4, 11, actionPool[i].alienColors.charAt(0));
					placeAlienHomeworld(9, 11, actionPool[i].alienColors.charAt(1));
				}
				
			} else if (actionPool[i].createPreset == "amoebaSolo") {
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
				
				for (var w = 13; w > 10; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Pmed") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
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

				dispRow(letterRows.charAt(0), false);
				dispRow(letterRows.charAt(11), false);
				
				for (var w = 13; w > 10; w = w - 0.5) {
					dispCol(w, false);
				}
			} else if (actionPool[i].createPreset == "versus2Plg") {
				expansionHWs = readValue(actionPool[i].useExpansion, false);
				var plrSlots = [actionPool[i].playerTop, actionPool[i].playerBottom];
				var plrColors = [plrSlots[0].charAt(0), plrSlots[1].charAt(0)];
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
				
				for (var w = 13; w > 10; w = w - 0.5) {
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
				}
				
				placeHomeworld(1,0,plrColors.charAt(0));
				placeHomeworld(13,0,plrColors.charAt(1));
				placeHomeworld(1,11,plrColors.charAt(2));
				placeHomeworld(12,11,plrColors.charAt(3));
			}
		}
	}

	document.getElementById("stageL").disabled = (stageNum <= 0);
	document.getElementById("stageR").disabled = (stageNum >= stageTotal);

	document.getElementById("ecoL").disabled = document.getElementById("stageL").disabled;
	document.getElementById("ecoR").disabled = document.getElementById("stageR").disabled;
	
	saveCookieDate.setTime(saveCookieDate.getTime() + (7*24*60*60*1000))

	if (!multiStages) {
		setCookie("se4xReplay", getParam("replay")+"~"+stageNum,saveCookieDate,"/",null,false);
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
				
				if (getCookie("se4xReplay") && getCookie("se4xReplay").startsWith(getParam("replay"))) {
					stageMem = getCookie("se4xReplay").split("~")[1];
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

//Cookie management

function writeDateString(dateObj) {
	var monthName = new Array("Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec");
	
	var thisMonth = dateObj.getMonth();
	var thisYear = dateObj.getFullYear();

	return monthName[thisMonth] + " " + dateObj.getDate() + ", " + thisYear;
}

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
