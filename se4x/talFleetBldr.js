function setupBuilder() {
	setupBox();
	
	addShipRow("Scout-E",1,33);
	addShipRow("Scout",1,37);
	addShipRow("Frigate-E",1,37);
	addShipRow("Frigate",1,44);
	addShipRow("Frigate-X",1,47);
	addShipRow("Destroyer-E",1,45);
	addShipRow("Destroyer",1,0);
	addShipRow("Destroyer-D",1,51);
	addShipRow("Destroyer-G",1,69);
	addShipRow("Destroyer-P",1,59);
	addShipRow("Destroyer-X",1,0);
	addShipRow("Light Cruiser-E",2,0);
	addShipRow("Light Cruiser",2,0);
	addShipRow("Light Cruiser-P",2,90);
	addShipRow("Light Cruiser-X",2,0);
	addShipRow("Heavy Cruiser",3,115);
	addShipRow("Heavy Cruiser-X",3,0);
	addShipRow("Battlecruiser",3,0);
	addShipRow("Battlecruiser-H",3,0);
	addShipRow("Battlecruiser-X",3,0);
	addShipRow("Battleship",4,0);
	addShipRow("Carrier",1,70);
	addShipRow("Fighter",1,44);
	addShipRow("Dreadnought",4,218);
	addShipRow("Transport",0,0);
	addShipRow("Base",0,184);
	addShipRow("Starbase",0,0);
	
	useRuleset = "talon";
	showPlrRows();
}

function addShipRow(namee, costLP, costSP) {
	var playerBody = document.getElementById("plrShips");
	
	var trFrag = document.createElement("tr");
	var tdFrag = null;
	var inputFrag = null;
	
	trFrag.id = namee+"Row";
	
	//Label column
	tdFrag = document.createElement("th");
	tdFrag.innerHTML = "<label for=\"" + namee + "Qty0\">" + namee + "</label>";
	trFrag.appendChild(tdFrag);
	
	//Help column
	tdFrag = document.createElement("td");
	tdFrag.innerHTML = "<a href=\"javascript:showBox('" + namee + "')\">(?)</a>";
	trFrag.appendChild(tdFrag);
	
	//Cost column
	tdFrag = document.createElement("td");
	tdFrag.className = "numeric";
	// tdFrag.id = namee+"-SP";
	tdFrag.innerHTML = "<span id=\""+namee+"-SP\">"+costSP+"</span> SP + <span id=\""+namee+"-LP\">"+costLP+"</span> LP";
	trFrag.appendChild(tdFrag);
	
	//Quantity fields
	for (var b = 0; b <= 10; b++) {
		tdFrag = document.createElement("td");
		tdFrag.className = "numeric";
		inputFrag = document.createElement("input");
		if (b < 10) {
			inputFrag.id = namee+"Qty"+b;
		} else {
			inputFrag.id = namee+"QtyR";
		}
		inputFrag.className = "text numeric";
		inputFrag.type = "number";
		inputFrag.value = 0;
		inputFrag.size = 5;
		inputFrag.min = 0;
		inputFrag.onblur = applyTotals;
		inputFrag.onchange = applyTotals;
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
	}
	
	playerBody.appendChild(trFrag);
}

function showPlrRows(rowId, rowVis, newCost) {
	if (rowId) {
		var workRow = document.getElementById(rowId+"Row");
		
		if (workRow) {
			if (rowVis) {
				workRow.style.display = "";
				if (newCost) {
					document.getElementById(rowId+"-SP").innerHTML = newCost[activeFaction];
				}
			} else {
				workRow.style.display = "none";
				document.getElementById(rowId+"Qty0").value = 0;
				document.getElementById(rowId+"Qty1").value = 0;
				document.getElementById(rowId+"Qty2").value = 0;
				document.getElementById(rowId+"Qty3").value = 0;
				document.getElementById(rowId+"Qty4").value = 0;
			}
		}
	} else {
		var workObj;
		
		// Display rows by faction
		activeFaction = document.getElementById("faction").selectedIndex;
		talonGrand = document.getElementById("talon1Kbox").checked;
		
		showPlrRows("Scout", activeFaction == 1);
		showPlrRows("Scout-E", activeFaction == 1 && talonGrand);
		showPlrRows("Frigate", activeFaction == 2);
		showPlrRows("Frigate-E", activeFaction == 2 && talonGrand);
		showPlrRows("Frigate-X", activeFaction == 2 && talonGrand);
		showPlrRows("Destroyer-E", activeFaction == 1 && talonGrand);
		showPlrRows("Destroyer", activeFaction > 0, [0,55,48,50]);
		showPlrRows("Destroyer-D", activeFaction == 2 && talonGrand);
		showPlrRows("Destroyer-G", activeFaction == 2 && talonGrand);
		showPlrRows("Destroyer-P", activeFaction == 1 && talonGrand);
		showPlrRows("Destroyer-X", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 68, 55, 0]);
		
		showPlrRows("Light Cruiser-E", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 79, 77, 0]);
		showPlrRows("Light Cruiser", activeFaction > 0, [0, 88, 88, 100]);
		showPlrRows("Light Cruiser-P", activeFaction == 1 && talonGrand);
		showPlrRows("Light Cruiser-X", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 97, 102, 0]);
		
		showPlrRows("Heavy Cruiser", activeFaction > 0 && activeFaction < 3);
		showPlrRows("Heavy Cruiser-X", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 124, 125, 0]);
		showPlrRows("Battlecruiser", activeFaction > 0 && activeFaction < 3, [0, 134, 142, 0]);
		showPlrRows("Battlecruiser-H", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 147, 133, 0]);
		showPlrRows("Battlecruiser-X", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 156, 161, 0]);
		
		showPlrRows("Battleship", activeFaction > 0, [0, 194, 179, 200]);
		
		showPlrRows("Carrier", activeFaction == 1);
		showPlrRows("Fighter", activeFaction == 1);
		showPlrRows("Dreadnought", activeFaction == 2);

		showPlrRows("Transport", activeFaction > 0 && activeFaction < 3, [0, 32, 36, 0]);
		showPlrRows("Base", activeFaction > 0 && activeFaction < 3);
		showPlrRows("Starbase", activeFaction > 0 && activeFaction < 3 && talonGrand, [0, 281, 278, 0]);
	}
	
	applyTotals();
}

function applyTotals() {
	var costTotal = [0, 0];
	var logTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	
	var warLanes = parseInt(document.getElementById("empireWarCt").value);
	
	for (var h = 1; h < 10; h++) {
		if (h < warLanes) {
			document.getElementById("head"+h).style.display = "";
		} else {
			document.getElementById("head"+h).style.display = "none";
		}
	}
	
	if (warLanes > 0) {
		document.getElementById("headR").style.display = "";
	} else {
		document.getElementById("headR").style.display = "none";
	}
	document.getElementById("footLog").style.display = document.getElementById("headR").style.display;
	
	techCells = document.getElementsByTagName("input");
	for (t in techCells) {
		if (techCells[t].id && techCells[t].id.search("Qty") >= 0) {
			var laneId = techCells[t].id.charAt(techCells[t].id.length-1);
			
			if (laneId == "R" && warLanes == 0 || (parseInt(laneId) >= warLanes && parseInt(laneId) > 0)) {
				techCells[t].value = 0;
				techCells[t].style.display = "none";
			} else {
				var baseId = techCells[t].id.substring(0, techCells[t].id.length-4);
				techCells[t].style.display = "";
				
				var readCost = [document.getElementById(baseId+"-SP"),
					document.getElementById(baseId+"-LP")];
				if (readCost[0]) {
					var shipCost = parseInt(readCost[0].innerHTML);
				}
				if (readCost[1]) {
					var logCost = parseInt(readCost[1].innerHTML);
				}
				
				costTotal[0] = costTotal[0] + shipCost * parseInt(techCells[t].value);
				if (techCells[t].id.endsWith("QtyR")) {
					costTotal[1] = costTotal[1] + shipCost * parseInt(techCells[t].value);
				}
				
				if (laneId == "R") {
					logTotal[10] = logTotal[10] + logCost * parseInt(techCells[t].value);
				} else {
					logTotal[laneId] = logTotal[laneId] + logCost * parseInt(techCells[t].value);
				}
			}
		}
	}
	
	for (var l = 0; l < 11; l++) {
		if (l >= 10) {
			if (warLanes > 0) {
				document.getElementById("footR").innerHTML = logTotal[l];
			} else {
				document.getElementById("footR").innerHTML = "";
			}
		} else if (l < warLanes) {
			document.getElementById("foot"+l).innerHTML = logTotal[l];
			
			logTotal[11] = logTotal[11] + logTotal[l]; 
		} else {
			document.getElementById("foot"+l).innerHTML = "";
		}
	}
	
	totalObj = document.getElementById("fleetCost");
	totalObj.innerHTML = costTotal[0]+" "+conceptLink("SP")
	if (warLanes > 0) {
		totalObj.innerHTML = totalObj.innerHTML + " ("+costTotal[1]+" SP assigned to reserve)"
	}
	
	if (warLanes > 1) {
		console.log(logTotal[11]+2);
		console.log(warLanes+2);
		computeQuota = Math.floor((logTotal[11]+2) / (warLanes+2));
	} else {
		computeQuota = "---";
	}
	
	totalObj = document.getElementById("sectorQuota");
	totalObj.innerHTML = computeQuota;
}
