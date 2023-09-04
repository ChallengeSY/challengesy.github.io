function setupDesign() {
	keywordifyDocument();
	calcCost();
}

function calcCost() {
	var totalCost = 0;
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
	
	// Priority class
	atkClass = document.getElementById("atkClass").selectedIndex;
	subCost = atkClass + 1;
	if (subCost >= 5) {
		subCost++;
	}
	
	document.getElementById("cost0").innerHTML = subCost;
	totalCost += subCost;
	
	// Attack rating
	subCost = atkStrCosts[document.getElementById("atkStr").value-1];
	document.getElementById("cost1").innerHTML = subCost;
	totalCost += subCost;
	
	// Defense rating
	subCost = defStrCosts[document.getElementById("defStr").value];
	document.getElementById("cost2").innerHTML = subCost;
	totalCost += subCost;
	
	// Hull Size
	subCost = hullSizeCosts[document.getElementById("hullSize").value-1];
	document.getElementById("cost3").innerHTML = subCost;
	totalCost += subCost;
	
	// Total up the skills
	for (h = 0; h < skillCosts.length; h++) {
		if (document.getElementById("skill"+h) && document.getElementById("skill"+h).checked) {
			totalCost += skillCosts[h];
			
			if (skillCosts[h] < 0) {
				weakness = true;
			}
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
	document.getElementById("shipSizeLv").className = isIllegal(!isFinite(shipSizeReq));

	for (j = 0; j < atkClassThresh.length; j++) {
		if (totalCost <= atkClassThresh[j].maxCost) {
			atkClassReq = j;
			break;
		}
	}
	document.getElementById("minAtkClass").innerHTML = atkClassThresh[atkClassReq].priority;
	document.getElementById("minAtkClass").className = isIllegal(atkClass < atkClassReq);
}

function isIllegal(condition) {
	if (condition) {
		return "numeric error";
	} else {
		return "numeric";
	}
}