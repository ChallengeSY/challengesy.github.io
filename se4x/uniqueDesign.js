function setupDesign() {
	keywordifyDocument();
	readCode();
	calcCost();
}

function getParam(param) { 
	var query = window.location.search.substring(1); 
	var vars = query.split("&"); 
	for (var i=0;i<vars.length;i++) { 
		var pair = vars[i].split("="); 
		if (pair[0] == param) { 
			return pair[1]; 
		} 
	}
	return -1; //not found 
}

function readCode() {
	if (getParam("code") != -1) {
		var readCode = getParam("code");
		
		document.getElementById("atkClass").selectedIndex = parseInt(readCode.charAt(0));
		document.getElementById("atkStr").value = parseInt(readCode.charAt(1));
		document.getElementById("defStr").value = parseInt(readCode.charAt(2));
		document.getElementById("hullSize").value = parseInt(readCode.charAt(3));
		
		for (g = 0; g < 13; g++) {
			if (document.getElementById("skill"+g)) {
				document.getElementById("skill"+g).checked = (readCode.charAt(g+5) == "1");
			}
		}
	}
}

function calcCost() {
	var totalCost = 0;
	var numAbilities = 0;
	var subCost = 0;
	var atkClass = 0;
	var atkStrCosts = [1,2,3,5,6,8,11,14];
	var defStrCosts = [0,1,3,5];
	var hullSizeCosts = [2,4,7];
	var skillCosts = [1,1,1,2,2,3,3,-1,4,2,5,4,2];
	var weakness = false;
	var shipSizeThresh = [6,9,12,15,20,24,32];
	var shipSizeReq = 1;
	var atkClassThresh = [
		{priority: "E", maxCost: 9},
		{priority: "D", maxCost: 19},
		{priority: "C", maxCost: 29},
		{priority: "B", maxCost: Infinity}
		]
	var atkClassReq = 0;
	buildLegal = true;
	buildCode = "";
	
	// Priority class
	atkClass = document.getElementById("atkClass");
	subCost = parseInt(atkClass.value);
	document.getElementById("cost0").innerHTML = subCost;
	totalCost += subCost;
	buildCode += atkClass.selectedIndex;
	
	// Attack rating
	subCost = atkStrCosts[document.getElementById("atkStr").value-1];
	document.getElementById("cost1").innerHTML = subCost;
	totalCost += subCost;
	buildCode += document.getElementById("atkStr").value;
	
	// Defense rating
	subCost = defStrCosts[document.getElementById("defStr").value];
	document.getElementById("cost2").innerHTML = subCost;
	totalCost += subCost;
	buildCode += document.getElementById("defStr").value;
	
	// Hull Size
	subCost = hullSizeCosts[document.getElementById("hullSize").value-1];
	document.getElementById("cost3").innerHTML = subCost;
	totalCost += subCost;
	buildCode += document.getElementById("hullSize").value+"-";
	
	// Total up the skills
	for (h = 0; h < skillCosts.length; h++) {
		if (document.getElementById("skill"+h) && document.getElementById("skill"+h).checked) {
			totalCost += skillCosts[h];
			numAbilities++;
			
			if (skillCosts[h] < 0) {
				weakness = true;
			}
			
			buildCode += "1";
		} else {
			buildCode += "0";
		}
	}
	
	//Subtract an extra CP for more expensive designs with Design Weakness
	if (weakness && totalCost >= 16) {
		totalCost--;
	}
	
	// Total 'em up
	
	document.getElementById("costTotal").innerHTML = totalCost;
	shipSizeReq = Infinity;
	for (i = 0; i < shipSizeThresh.length; i++) {
		if (totalCost <= shipSizeThresh[i]) {
			shipSizeReq = i + 1;
			break;
		}
	}
	document.getElementById("shipSizeLv").innerHTML = shipSizeReq;
	document.getElementById("shipSizeLv").className = isLegal(isFinite(shipSizeReq));

	for (j = 0; j < atkClassThresh.length; j++) {
		if (totalCost <= atkClassThresh[j].maxCost) {
			atkClassReq = j;
			break;
		}
	}
	document.getElementById("minAtkClass").innerHTML = atkClassThresh[atkClassReq].priority;
	document.getElementById("minAtkClass").className = isLegal(atkClass.selectedIndex >= atkClassReq);

	document.getElementById("abilCount").innerHTML = numAbilities;
	document.getElementById("abilCount").className = isLegal(numAbilities <= 2);
	
	var sendButton = document.getElementById("sendButton");
	
	sendButton.value = "Send Code";
	sendButton.disabled = false;
}

async function sendCode() {
	try {
		if (buildLegal || confirm("Design is not legal. Share it anyway?")) {
			await navigator.clipboard.writeText(window.location.href+"?code="+buildCode);
			var sendButton = document.getElementById("sendButton");

			sendButton.value = "Sent to clipboard";
			sendButton.disabled = true;
		}
	} catch (error) {
		console.error(error.message);
	}
}

function isLegal(condition) {
	if (condition) {
		return "numeric";
	} else {
		buildLegal = false;
		return "numeric error";
	}
}