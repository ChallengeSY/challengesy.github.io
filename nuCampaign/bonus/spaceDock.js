var totals = new shipPart("Total",0,0,0,0);
var workObj = new shipPart("Working Object",0,0,0,0);

function init() {
	connectNuAPI();
}

function startProgram() {
	var hullsObj = nuStaticData.hulls;
	var enginesObj = nuStaticData.engines;
	var beamsObj = nuStaticData.beams;
	var tubesObj = nuStaticData.torpedosall;
	
	for (var h in hullsObj) {
		createTableRow("Hull", hullsObj[h]);
	}
	
	for (var e in enginesObj) {
		createTableRow("Engine", enginesObj[e]);
	}

	for (var b in beamsObj) {
		createTableRow("Beam", beamsObj[b]);
	}

	for (var t in tubesObj) {
		createTableRow("Tube", tubesObj[t]);
	}
	
	document.getElementById("noPtsTxt").innerHTML = "You have no components registered right now.";
	refreshTable();
}

// Component object
function shipPart(newName, dur, trit, moly, mc) {
	this.partName = newName;
	this.duranium = dur;
	this.tritanium = trit;
	this.molybdenum = moly;
	this.megacredits = mc;
	
	// Totals object
	this.reset = function() {
		this.duranium = 0;
		this.tritanium = 0;
		this.molybdenum = 0;
		this.megacredits = 0;
	}
}

function createTableRow(categ, activeObj) {
	tableBody = document.getElementById("components");
	var rowId, megacreditCost;
	
	if (categ == "Tube") {
		megacreditCost = activeObj.launchercost;
	} else {
		megacreditCost = activeObj.cost;
	}
	partObj = new shipPart(activeObj.name, activeObj.duranium, activeObj.tritanium, activeObj.molybdenum, megacreditCost);
	
	
	trFrag = document.createElement("tr");
	rowId = categ.toLowerCase() + activeObj.id;
	trFrag.id = rowId;
	
	// Component Name
	tdFrag = document.createElement("td");
	tdFrag.innerHTML = partObj.partName;
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	tdFrag.innerHTML = categ;
	if (categ == "Beam") {
		tdFrag.innerHTML = "Beam Bank";
	} else if (categ == "Tube") {
		tdFrag.innerHTML = "Torpedo Tube";
	}
	trFrag.appendChild(tdFrag);
	
	tdFrag = document.createElement("td");
	inputFrag = document.createElement("input");
	inputFrag.id = rowId + "amt";
	inputFrag.className = "text numeric";
	inputFrag.type = "number";
	inputFrag.size = "6";
	inputFrag.value = "0";
	
	addEvent(inputFrag,"blur",refreshTable,false);
	addEvent(inputFrag,"change",refreshTable,false);
	tdFrag.appendChild(inputFrag);
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	tdFrag.id = rowId + "dur";
	tdFrag.innerHTML = partObj.duranium;
	tdFrag.className = "numeric";
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	tdFrag.id = rowId + "tri";
	tdFrag.innerHTML = partObj.tritanium;
	tdFrag.className = "numeric";
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	tdFrag.id = rowId + "mol";
	tdFrag.innerHTML = partObj.molybdenum;
	tdFrag.className = "numeric";
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	tdFrag.id = rowId + "mcr";
	tdFrag.innerHTML = partObj.megacredits;
	tdFrag.className = "numeric";
	trFrag.appendChild(tdFrag);
	
	if (megacreditCost < 1e6) {
		tableBody.appendChild(trFrag);
		createPulldownRow(categ, activeObj, rowId);
	}
}

function createPulldownRow(categ, partObj, refId) {
	var useId = "new"+categ+"s";
	if (categ == "Hull") {
		useId = useId + findRace(partObj.id);
	}
	
	pulldownBody = document.getElementById(useId);
	optionFrag = document.createElement("option");
	optionFrag.value = refId;
	optionFrag.innerHTML = partObj.name;
	pulldownBody.appendChild(optionFrag);
}

function findRace(internalId) {
	var racesObj = nuStaticData.races;
	for (var r in racesObj) {
		for (var h in racesObj[r].hullids) {
			if (racesObj[r].hullids[h] == internalId) {
				return racesObj[r].id;
			}
		}
	}
	
	return "";
}

/* ------------------------------------------------------------------------ */

function addPart(readId) {
	adjustFragId = document.getElementById(readId).value + "amt";
	adjustFrag = document.getElementById(adjustFragId);
	
	if (!isFinite(adjustFrag.value) || adjustFrag.value <= 0) {
		adjustFrag.value = 1;
	} else {
		adjustFrag.value++;
	}
	
	refreshTable();
}

function refreshTable() {
	totals.reset();
	setNoPartsStyle("");
	
	for (var i = 1; i <= 9999; i++) {
		refreshRow("hull"+i);
		refreshRow("engine"+i);
		refreshRow("beam"+i);
		refreshRow("tube"+i);
	}
	
	document.getElementById("totalDur").innerHTML = totals.duranium;
	document.getElementById("totalTri").innerHTML = totals.tritanium;
	document.getElementById("totalMol").innerHTML = totals.molybdenum;
	document.getElementById("totalMcr").innerHTML = totals.megacredits;
}

function refreshRow(rowId) {
	rowFrag = document.getElementById(rowId);
	if (rowFrag) {
		rowFragInput = document.getElementById(rowId + "amt");
		partQuantity = rowFragInput.value;
		
		workObj.duranium = document.getElementById(rowId + "dur").innerHTML;
		workObj.tritanium = document.getElementById(rowId + "tri").innerHTML;
		workObj.molybdenum = document.getElementById(rowId + "mol").innerHTML;
		workObj.megacredits = document.getElementById(rowId + "mcr").innerHTML;
		
		if (isFinite(partQuantity) && partQuantity > 0) {
			setNoPartsStyle("none");
			rowFrag.style.display = "";
			
			totals.duranium += workObj.duranium * partQuantity;
			totals.tritanium += workObj.tritanium * partQuantity;
			totals.molybdenum += workObj.molybdenum * partQuantity;
			totals.megacredits += workObj.megacredits * partQuantity;
		} else {
			rowFrag.style.display = "none";
		}
	}
}

function setNoPartsStyle(newStyle) {
	noPartsRow = document.getElementById("noParts");
	
	if (noPartsRow.style.display != newStyle) {
		noPartsRow.style.display = newStyle;
	}
}
