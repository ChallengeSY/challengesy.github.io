var rawJson;
var stageTotal;
var stageNum = 0;
var saveCookieDate = new Date;
var recallingStages = true;
const letterRows = "LKJIHGFEDCBA";
const deepSpace = "unexploredW";
const markerCounter = "marker";

const alienIncLetters = "EFTDH";
const alienDecLetters = alienIncLetters.toLowerCase();
const dieRollsRow = "(Rolls)";
const prodTableTag = "{prodTable}";

window.onkeydown = readKeyInput;

function initReplay() {
	makeHexes();
	getJsonFile();
}

function makeHexes() {
	var hexBoard = document.getElementById("gameBoard");
	
	for (y = 0; y < 12; y++) {
		var newRow = document.createElement("div");
		if (y % 2 == 1) {
			newRow.className = "hexRow even";
		} else {
			newRow.className = "hexRow";
		}
		for (x = 0; x < 13 - (y % 2); x++) {
			var newHex = document.createElement("div");
			newHex.className = "hex";
			newHex.id = letterRows.charAt(y)+(x+1);
			newHex.title = "Sector "+newHex.id;
			newRow.appendChild(newHex);
		}
		hexBoard.appendChild(newRow);
	}
}

function dispRow(b, newDisp) {
	for (x = 0; x < 13; x++) {
		var findObj = document.getElementById(b+(x+1));
		
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
	var affectCol = Math.floor(a);
	
	for (y = 0; y < 12; y++) {
		var findObj = document.getElementById(letterRows.charAt(y)+affectCol);
		
		if (findObj && (a % 1 == 0 || y % 2 == 1)) {
			if (newDisp) {
				findObj.style.visibility = "";
			} else {
				findObj.style.visibility = "hidden";
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


function placeCounter(curId, newX, newY, newPic, newAlpha) {
	var calcX = newX * 54 - 39;
	var calcY = newY * 47 + 20;
	var workObj;

	var hexBoard = document.getElementById("gameBoard");
	
	findObj = document.getElementById(curId);
	if (findObj && newAlpha >= 100) {
		workObj = findObj;
	} else {
		workObj = document.createElement("img");
		workObj.src = "gfx/" + curId + ".png";
		if (newAlpha >= 100) {
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
		var randX, randY
		
		do {
			randX = irandom(-20,20);
			randY = irandom(-12,12);
		} while (Math.abs(randX) < 17 && Math.abs(randY) < 9)
		
		calcX = calcX + randX;
		calcY = calcY + randY;
	}
	
	if (newY % 2 == 1) {
		calcX = calcX + 26;
	}
	
	if (newPic) {
		workObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			workObj.style.zIndex = 1;
		}
	}
	workObj.style.left = calcX + "px";
	workObj.style.top = calcY + "px";
}

function placeSystemMarker(newX, newY, newPic) {
	placeCounter("system"+letterRows.charAt(newY)+newX, newX, newY, newPic, 100);
}

function placeHomeworld(newX, newY, color) {
	placeSystemMarker(newX,newY,"home20"+color);
	
	for (var i = 1; i <= 3; i++) {
		placeCounter("SC"+i+color,newX,newY,null,100);
		placeCounter("CO"+i+color,newX,newY,"CO"+color,100);
	}

	placeCounter("SY1"+color,newX,newY,null,100);
	placeCounter("Miner1"+color,newX,newY,"Miner"+color,100);
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
	placeCounter("base1"+color,newX,newY,null,100);
}

function renderCounter(curId, newPic) {
	findObj = document.getElementById(curId);
	if (findObj) {
		findObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			findObj.style.zIndex = 1;
		}
	}
}

function readJson() {
	var curStage = rawJson.stages[stageNum];
	var heading = document.getElementById("heading");
	var commentary = document.getElementById("commentary");
	var seekObj, readX, readY;
	
	if (stageNum == 0 || !recallingStages || stageNum >= stageMem) {
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
				
				if (curStage.prodTable[a].colonyCP <= 0) {
					// Player is dead
					constructTable = constructTable + "<tr class=\"deadPlr;\">";
				} else {
					constructTable = constructTable + "<tr>";
				}
				
				var availCP = activePlayer.initCP + activePlayer.colonyCP + activePlayer.mineralCP + activePlayer.pipeCP - activePlayer.maint;
				var leftoverCP = availCP - activePlayer.bidCP - activePlayer.techBuy - activePlayer.unitBuy;
				
				constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
					<td class=\"numeric\">"+activePlayer.initCP+"</td> \
					<td class=\"numeric increase\">+"+activePlayer.colonyCP+"</td> \
					<td class=\"numeric increase\">+"+activePlayer.mineralCP+"</td> \
					<td class=\"numeric increase\">+"+activePlayer.pipeCP+"</td> \
					<td class=\"numeric decrease\">-"+activePlayer.maint+"</td> \
					<td class=\"numeric\">"+availCP+"</td> \
					<td class=\"numeric\">-"+activePlayer.bidCP+"</td> \
					<td class=\"numeric\">-"+activePlayer.techBuy+"</td> \
					<td class=\"numeric\">-"+activePlayer.unitBuy+"</td> \
					<td class=\"numeric\">"+leftoverCP+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			
			if (commentary.innerHTML.indexOf(prodTableTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(prodTableTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}

		} else if (curStage.alienTable) {
			// Base game economics
			var constructTable = "<table><caption>Alien Economics</caption> \
				<tr><th>Player</th><th>Eco</th><th>Fleet</th><th>Tech</th><th>Def</th><th>Hidden</th></tr>";
				
			for (var a = 0; a < curStage.alienTable.length; a++) {
				var activePlayer = curStage.alienTable[a];
				
				if (activePlayer.name == dieRollsRow) {
					var ecoRange = "&mdash;", fleetRange, techRange, defRange = "&mdash;", launchRange = "Launch &le;3";
					
					// Auto-compute Economic Roll ranges
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
						default:
							maxFleet = Math.min(9,Math.ceil(activePlayer.ecoPhase/2)-1);
							minTech = maxFleet + 1;
						
							fleetRange = "1-"+maxFleet;
							techRange = minTech+"-10";
							if (activePlayer.ecoPhase % 2 == 0) {
								launchRange = "Launch Auto";
							}
							break;
					}
					
					constructTable = constructTable + "<tr><td>"+activePlayer.name+"</td> \
						<td class=\"numeric\">"+ecoRange+"</td> \
						<td class=\"numeric\">"+fleetRange+"</td> \
						<td class=\"numeric\">"+techRange+"</td> \
						<td class=\"numeric\">"+defRange+"</td> \
						<td class=\"numeric\">"+launchRange+"</td></tr>"
				} else {
					var classMods = ["","","","",""];
					var baseDelta = activePlayer.delta;
					
					if (baseDelta.indexOf("---") >= 0) {
						// Alien Player is dead. They get no more economic rolls for the rest of the playthrough
						constructTable = constructTable + "<tr style=\"color: #808080;\">";
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
					
					constructTable = constructTable + "<td>"+activePlayer.name+"</td> \
						<td class=\"numeric"+classMods[0]+"\">"+activePlayer.eco+" +"+activePlayer.queue+"</td> \
						<td class=\"numeric"+classMods[1]+"\">"+activePlayer.fleet+"</td> \
						<td class=\"numeric"+classMods[2]+"\">"+activePlayer.tech+"</td> \
						<td class=\"numeric"+classMods[3]+"\">"+activePlayer.def+"</td> \
						<td class=\"numeric"+classMods[4]+"\">"+activePlayer.hidden+"</td></tr>"
				}
			}
				
			constructTable = constructTable + "</table>";
			
			if (commentary.innerHTML.indexOf(prodTableTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(prodTableTag,constructTable);
			} else {
				commentary.innerHTML = commentary.innerHTML + constructTable;
			}
		} else if (curStage.amoebaTable) {
			var constructTable = "<table><caption>Amoeba Database</caption> \
				<tr><th>Amoeba</th><th>Research</th><th>Type</th><th>Mine Immune?</th></tr>";
				
			for (var a = 0; a < curStage.amoebaTable.length; a++) {
				var activeAmoeba = curStage.amoebaTable[a];
				
				constructTable = constructTable + "<td>"+activeAmoeba.name+"</td> \
					<td class=\"numeric\">"+activeAmoeba.research+" / 10</td> \
					<td class=\"numeric\">"+activeAmoeba.type+"</td> \
					<td class=\"center\">"+activeAmoeba.mineImmune+"</td></tr>"
			}
				
			constructTable = constructTable + "</table>";
			
			if (commentary.innerHTML.indexOf(prodTableTag) >= 0) {
				commentary.innerHTML = commentary.innerHTML.replace(prodTableTag,constructTable);
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
				placeCounter(workId, readX, readY, actionPool[i].name, 100);
			} else {
				var convertName = null;
				
				placeCounter(workId, readX, readY, convertName, 100);
			}
		} else if (actionPool[i].placeGhost) {
			workId = actionPool[i].placeGhost;
			placeCounter(workId, readX, readY, workId, 50);
		}
		
		if (actionPool[i].revealCounter) {
			workId = actionPool[i].revealCounter;
			renderCounter(workId, actionPool[i].name);
		}
		
		if (actionPool[i].removeCounter) {
			workId = actionPool[i].removeCounter;
			
			workObj = document.getElementById(workId);
			if (workObj) {
				workObj.remove();
			}
		}
		
		// Presets are usually game setups. They perform a bunch of smaller actions, greatly reducing redundency in the process.
		if (actionPool[i].createPreset) {
			ctrlPanel = document.getElementById("controls");
			
			if (actionPool[i].createPreset == "alienEmpiresSolo") {
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
				
				for (var z = 9; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
				
				if (actionPool[i].alienColors) {
					var alienHWs = [[1,4], [13,4], [7,8]];
					
					for (var a = 0; a < actionPool[i].alienColors.length; a++) {
						placeAlienHomeworld(alienHWs[a][0], alienHWs[a][1], actionPool[i].alienColors.charAt(a));
					}
				}
			} else if (actionPool[i].createPreset == "alienEmpiresSoloLg") {
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
				
			} else if (actionPool[i].createPreset == "removeMarkers") {
				// One of the few presets that is not a scenario. This one removes all markers from the board
				imgCollection = document.getElementsByTagName("img")
				
				for (var h = 0; h < imgCollection.length; h++) {
					if (imgCollection[h] && imgCollection[h].src.indexOf(markerCounter) >= 0) {
						imgCollection[h--].remove();
					}
				}
				
			} else if (actionPool[i].createPreset == "amoebaSolo") {
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
			} else if (actionPool[i].createPreset == "versus3P") {
				var plrColors = actionPool[i].playerColors;
				
				for (var y = 0; y < 12; y++) {
					for (var x = 1; x <= 13; x++) {
						if (x < 13 || y % 2 == 0) {
							placeSystemMarker(x,y,deepSpace);
						}
					}
				}

				place3plrHomeMarkers(plrColors.charAt(0), "top");
				place3plrHomeMarkers(plrColors.charAt(1), "left");
				place3plrHomeMarkers(plrColors.charAt(2), "right");
			} else if (actionPool[i].createPreset == "versus4P") {
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
				
				placeHomeworld(1,0,plrColors.charAt(0));
				placeHomeworld(13,0,plrColors.charAt(1));
				placeHomeworld(1,11,plrColors.charAt(2));
				placeHomeworld(12,11,plrColors.charAt(3));
			}
		}
	}

	document.getElementById("stageL").disabled = (stageNum <= 0);
	document.getElementById("stageR").disabled = (stageNum >= stageTotal);

	saveCookieDate.setTime(saveCookieDate.getTime() + (7*24*60*60*1000))

	if (!recallingStages) {
		setCookie("se4xReplay", getParam("replay")+"~"+stageNum,saveCookieDate,"/",null,false);
	}
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
				recallingStages = false;
			} else {
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
