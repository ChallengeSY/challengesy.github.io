var totals = new shipPart("Total",0,0,0,0);
var workObj = new shipPart("Working Object",0,0,0,0);

function init() {
	for (var e = 1; e <= 9; e++) {
		createTableRow("eng"+e);
	}

	for (var b = 1; b <= 10; b++) {
		createTableRow("beam"+b);
	}

	for (var t = 1; t <= 10; t++) {
		createTableRow("tube"+t);
	}
	
	refreshTable();
}

// Quickly create an object
function quickPart(internalRef) {
	switch (internalRef) {
		case "eng1":
			return new shipPart("Stardrive 1",1,5,0,1);
		case "eng2":
			return new shipPart("Stardrive 2",2,5,1,2);
		case "eng3":
			return new shipPart("Stardrive 3",2,3,5,3);
		case "eng4":
			return new shipPart("SuperStarDrive 4",3,3,7,10);
		case "eng5":
			return new shipPart("Nova Drive 5",3,3,7,25);
		case "eng6":
			return new shipPart("HeavyNova Drive 6",3,3,15,53);
		case "eng7":
			return new shipPart("Quantum Drive 7",3,3,15,170);
		case "eng8":
			return new shipPart("Hyper Drive 8",13,3,25,200);
		case "eng9":
			return new shipPart("Transwarp Drive",16,3,35,300);
			
		case "beam1":
			return new shipPart("Laser",0,1,0,1);
		case "beam2":
			return new shipPart("X-Ray Laser",0,1,0,2);
		case "beam3":
			return new shipPart("Plasma Bolt",2,1,0,5);
		case "beam4":
			return new shipPart("Blaster",12,1,1,10);
		case "beam5":
			return new shipPart("Positron Beam",12,1,5,12);
		case "beam6":
			return new shipPart("Disruptor",12,1,1,13);
		case "beam7":
			return new shipPart("Heavy Blaster",12,1,14,31);
		case "beam8":
			return new shipPart("Phaser",12,1,30,35);
		case "beam9":
			return new shipPart("Heavy Disruptor",17,1,37,36);
		case "beam10":
			return new shipPart("Heavy Phaser",12,1,55,54);
			
		case "tube1":
			return new shipPart("Mark 1 Photon",1,1,0,1);
		case "tube2":
			return new shipPart("Proton torp",0,1,0,4);
		case "tube3":
			return new shipPart("Mark 2 Photon",4,1,0,4);
		case "tube4":
			return new shipPart("Gamma Bomb",3,1,1,10);
		case "tube5":
			return new shipPart("Mark 3 Photon",1,1,5,12);
		case "tube6":
			return new shipPart("Mark 4 Photon",4,1,1,20);
		case "tube7":
			return new shipPart("Mark 5 Photon",7,1,14,57);
		case "tube8":
			return new shipPart("Mark 6 Photon",2,1,7,100);
		case "tube9":
			return new shipPart("Mark 7 Photon",3,1,8,120);
		case "tube10":
			return new shipPart("Mark 8 Photon",1,1,9,190);
			
		default:
			return null;
	}
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

function createTableRow(rowId) {
	tableBody = document.getElementById("components");
	partObj = quickPart(rowId);
	
	trFrag = document.createElement("tr");
	trFrag.id = rowId;
	
	// Component Name
	tdFrag = document.createElement("td");
	tdFrag.innerHTML = partObj.partName;
	trFrag.appendChild(tdFrag);

	tdFrag = document.createElement("td");
	if (rowId.substr(0,3) == "eng") {
		tdFrag.innerHTML = "Engine";
	} else if (rowId.substr(0,4) == "beam") {
		tdFrag.innerHTML = "Beam Bank";
	} else if (rowId.substr(0,4) == "tube") {
		tdFrag.innerHTML = "Torpedo Tube";
	}
	trFrag.appendChild(tdFrag);
	
	tdFrag = document.createElement("td");
	inputFrag = document.createElement("input");
	inputFrag.id = rowId + "amt";
	inputFrag.className = "text";
	inputFrag.type = "text";
	inputFrag.size = "6";
	inputFrag.value = "0";
	
	addEvent(inputFrag,"blur",refreshTable,false);
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
	
	tableBody.appendChild(trFrag);
}

/* ------------------------------------------------------------------------ */

function addPart() {
	adjustFragId = document.getElementById("newParts").value + "amt";
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
	
	for (var e = 1; e <= 9; e++) {
		refreshRow("eng"+e);
	}

	for (var b = 1; b <= 10; b++) {
		refreshRow("beam"+b);
	}

	for (var t = 1; t <= 10; t++) {
		refreshRow("tube"+t);
	}
	
	document.getElementById("totalDur").innerHTML = totals.duranium;
	document.getElementById("totalTri").innerHTML = totals.tritanium;
	document.getElementById("totalMol").innerHTML = totals.molybdenum;
	document.getElementById("totalMcr").innerHTML = totals.megacredits;
}

function refreshRow(rowId) {
	rowFrag = document.getElementById(rowId);
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

function setNoPartsStyle(newStyle) {
	noPartsRow = document.getElementById("noParts");
	
	if (noPartsRow.style.display != newStyle) {
		noPartsRow.style.display = newStyle;
	}
}

/* ------------------------------------------------------------------------ */

//Register events
function addEvent(object, evName, fnName, cap) {
	try {
		if (object.addEventListener) {
			 object.addEventListener(evName, fnName, cap);
			 /*
		} else if (object.attachEvent) {
			 object.attachEvent("on" + evName, fnName);
			 */
		} else {
			if (evName = "click") {
				object.onclick = fnName;
			} else if (evName = "change") {
				object.onchange = fnName;
			} else if (evName = "blur") {
				object.onblur = fnName;
			}
		}
	} catch(err) {
		throwError(err);
	}
}


/*

// Ajax components - May merge into ../common.js
var nuStaticData;

function connectNuAPI() {
	var apiConnect = new XMLHttpRequest();
	apiConnect.open("GET", "http://api.planets.nu/static/all", true);
	
	
}

*/