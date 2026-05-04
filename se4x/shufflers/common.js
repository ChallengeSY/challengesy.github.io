// Common functions shared across ALL shufflers

window.onload = startApp;

function startApp() {
	setupBox();
	keywordifyDocument();
	
	for (var t = 0; t < itemCollection.length; t++) {
		addItemRow(itemCollection[t]);
	}
	
	loadDeck();
}

function addItemRow(itemObj) {
	var inventoryBody = document.getElementById("inventory");
	
	var trFrag = document.createElement("tr");
	var tdFrag = null;
	var inputFrag = null;
	
	trFrag.id = itemObj.nameeS+"Row";
	
	//Label column
	tdFrag = document.createElement("th");
	tdFrag.innerHTML = itemObj.nameeL;
	trFrag.appendChild(tdFrag);
	
	//Help column
	tdFrag = document.createElement("td");
	if (itemObj.nameeS == "Min10" || itemObj.nameeS == "Planet10" || itemObj.nameeS == "PulsarD" || itemObj.nameeS == "PulsarM" || itemObj.nameeS == "Station10" || itemObj.nameeS == "WP2" ||
		itemObj.nameeS == "HeroicCA" || itemObj.nameeS == "HeroicBC" || itemObj.nameeS == "HeroicBB" || itemObj.nameeS.search("VsHull") >= 0) {
		tdFrag.innerHTML = "";
	} else {
		tdFrag.innerHTML = "<a href=\"javascript:showBox('" + itemObj.nameeL.split(" (")[0] + "')\">(?)</a>";
	}
	trFrag.appendChild(tdFrag);
	
	//Stock column
	tdFrag = document.createElement("td");
	tdFrag.id = "avail"+itemObj.nameeS;
	tdFrag.className = "numeric";
	tdFrag.innerHTML = 0;
	trFrag.appendChild(tdFrag);
	
	//Maximum column
	tdFrag = document.createElement("td");
	inputFrag = document.createElement("input");
	inputFrag.id = "max"+itemObj.nameeS;
	inputFrag.className = "text numeric";
	inputFrag.type = "number";
	inputFrag.value = 0;
	inputFrag.size = 5;
	inputFrag.min = 0;
	tdFrag.appendChild(inputFrag);
	trFrag.appendChild(tdFrag);
	
	inventoryBody.appendChild(trFrag);
}

function applyPreset(newVals) {
	for (var t = 0; t < itemCollection.length; t++) {
		if (newVals[t]) {
			document.getElementById("max"+itemCollection[t].nameeS).value = newVals[t];
		} else {
			document.getElementById("max"+itemCollection[t].nameeS).value = 0;
		}
	}
}

function recallStock() {
	var buildArray = [];
	
	for (var t = 0; t < itemCollection.length; t++) {
		var readObj = document.getElementById("avail"+itemCollection[t].nameeS);
		
		buildArray.push(parseInt(readObj.innerHTML));
	}
	
	applyPreset(buildArray);
}

function buildDeck(ct) {
	var readVal = parseInt(document.getElementById("totalStock").innerHTML);
	
	if (readVal <= 0 || confirm("Replace the existing stock with this new deck?")) {
		for (var t = 0; t < itemCollection.length; t++) {
			var readObj = document.getElementById("avail"+itemCollection[t].nameeS);
			
			readObj.innerHTML = parseInt(document.getElementById("max"+itemCollection[t].nameeS).value) * ct;
			readObj.className = "numeric";
		}
		
		saveDeck();
	}
}

function dealItems(ct) {
	var deckSize = 0;
	var sizeLeft, readVal;
	
	for (var t = 0; t < itemCollection.length; t++) {
		var readObj = document.getElementById("avail"+itemCollection[t].nameeS);
		
		if (t < itemCollection.length - 12 && ct == "G" || t >= itemCollection.length - 12 && ct == "P" || isFinite(ct)) {
			deckSize += parseInt(readObj.innerHTML);
		}
		readObj.className = "numeric";
	}
	
	sizeLeft = deckSize;
	if (ct == "G") {
		if (deckSize > 0) {
			var dealId = irandom(1,deckSize);
			
			for (var z = itemCollection.length - 13; z >= 0; z--) {
				var readObj = document.getElementById("avail"+itemCollection[z].nameeS);

				readVal = parseInt(readObj.innerHTML);
				sizeLeft -= readVal;
				
				if (dealId > sizeLeft) {
					readObj.innerHTML = --readVal;
					readObj.className = "numeric hit";

					break;
				}
			}
		}
	} else if (ct == "P") {
		if (deckSize > 0) {
			var dealId = irandom(1,deckSize);
			
			for (var z = itemCollection.length - 1; z >= itemCollection.length - 12; z--) {
				var readObj = document.getElementById("avail"+itemCollection[z].nameeS);

				readVal = parseInt(readObj.innerHTML);
				sizeLeft -= readVal;
				
				if (dealId > sizeLeft) {
					readObj.innerHTML = --readVal;
					readObj.className = "numeric hit";
					
					break;
				}
			}
		}
	} else {
		for (var i = 0; i < ct; i++) {
			if (deckSize > 0) {
				sizeLeft = deckSize;
				var dealId = irandom(1,deckSize);
				
				for (var z = itemCollection.length - 1; z >= 0; z--) {
					var readObj = document.getElementById("avail"+itemCollection[z].nameeS);

					readVal = parseInt(readObj.innerHTML);
					sizeLeft -= readVal;
					
					if (dealId > sizeLeft) {
						readObj.innerHTML = --readVal;
						readObj.className = "numeric hit";
						
						deckSize--;
						break;
					}
				}
			} else {
				break;
			}
		}
	}

	saveDeck();
}

function saveDeck() {
	var exportStr = "deck";
	var totalCount = [0, 0, 0];
	
	for (var t = 0; t < itemCollection.length; t++) {
		var readObj = document.getElementById("avail"+itemCollection[t].nameeS);
		
		exportStr = exportStr + "~" + readObj.innerHTML;
		totalCount[0] += parseInt(readObj.innerHTML);
		if (t < itemCollection.length - 12) {
			totalCount[1] += parseInt(readObj.innerHTML);
		} else {
			totalCount[2] += parseInt(readObj.innerHTML);
		}
	}
	
	applyTotal(totalCount);
	setStorage("se4x"+shuffler+"Shuff",exportStr);
}

function loadDeck() {
	var totalCount = [0, 0, 0];
	
	if (getStorage("se4x"+shuffler+"Shuff")) {
		var readStr = getStorage("se4x"+shuffler+"Shuff");
		var readArray = readStr.split("~");
		
		for (var t = 0; t < itemCollection.length; t++) {
			if (readArray[t+1]) {
				var readObj = document.getElementById("avail"+itemCollection[t].nameeS);

				readObj.innerHTML = readArray[t+1];
				totalCount[0] += parseInt(readObj.innerHTML);
				
				if (t < itemCollection.length - 12) {
					totalCount[1] += parseInt(readObj.innerHTML);
				} else {
					totalCount[2] += parseInt(readObj.innerHTML);
				}
			}
		}
	}
	
	applyTotal(totalCount);
}

function disableObj(findId, flag) {
	var findObj = document.getElementById(findId);
	
	if (findObj) {
		findObj.disabled = flag;
	}
}

function applyTotal(newAmt) {
	document.getElementById("totalStock").innerHTML = newAmt[0];
	
	disableObj("dealOne", (newAmt[0] <= 0));
	disableObj("dealTwo", (newAmt[0] <= 0));
	disableObj("dealReg", (newAmt[1] <= 0));
	disableObj("dealRep", (newAmt[2] <= 0));
}
