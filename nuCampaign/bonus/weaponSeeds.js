const seedTableTwenty =
	[9, 8, 11, 8, 5, 5, 9, 10, 15, 2, 10, 4, 14, 18, 1, 14, 15, 17, 2, 4, 10, 13, 16, 17, 11, 10, 14,
	7, 2, 8, 13, 13, 18, 6, 13, 12, 6, 12, 6, 14, 4, 1, 20, 16, 16, 2, 8, 10, 18,
	4, 20, 16, 17, 15, 6, 19, 16, 14, 2, 15, 11, 6, 9, 17, 15, 4, 3, 12, 16,
	19, 12, 18, 11, 13, 13, 8, 3, 2, 15, 5, 12, 6, 10, 6, 9, 16, 20, 19, 18, 17,
	11, 1, 4, 12, 7, 13, 15, 5, 7, 12, 3, 3, 7, 14, 10, 18, 13, 3, 16, 14, 4, 13, 9, 14, 2, 9, 7, 4, 15];

function makeInfoBox() {
	var bodyPanel = document.getElementsByTagName("body")[0];
	
	infoFrag = document.createElement("div");
	infoFrag.id = "infobox";
	infoFrag.style.position = "fixed";
	infoFrag.style.left = "0px";
	infoFrag.style.right = "0px";
	infoFrag.style.top = "200px";
	infoFrag.style.marginLeft = "auto";
	infoFrag.style.marginRight = "auto";
	// infoFrag.style.maxWidth = "1350px";
	infoFrag.style.zIndex = "3";
	infoFrag.style.background = "#200020";
	infoFrag.style.border = "1px #CCC solid";
	infoFrag.style.borderRadius = "10px";
	infoFrag.style.textAlign = "center";
	infoFrag.style.display = "none";
	bodyPanel.appendChild(infoFrag);
}

function buildDieCell(result, maxRoll) {
	if (maxRoll == 0) {
		return "<td class=\"waste\">"+result+"</td>";
	} else if (result <= maxRoll) {
		return "<td class=\"success\">"+result+"</td>";
	}
	
	return "<td>"+result+"</td>";
}

function buildSeedVisualizer(seedInit, baysL, beamsL, baysR, beamsR, shootShips) {
	var infoPanel = document.getElementById("infobox");
	var workSeed = seedInit;
	var rowsDone = 0;
	
	displayTxt = "<table><thead><tr>";
	displayTxt += "<th title=\"Seed at tick start\">Seed</th>";
	if (shootShips) {
		for (var a = 0; a < beamsL; a++) {
			displayTxt += "<th title=\"Left Combatant Beam "+a+"R\">oL"+a+"</th>";
		}
	}
	for (var b = 0; b < beamsL; b++) {
		displayTxt += "<th title=\"Left Combatant Beam "+b+"F\">bL"+b+"</th>";
	}
	for (var c = 0; c < beamsR; c++) {
		displayTxt += "<th title=\"Right Combatant Beam "+c+"F\">bR"+c+"</th>";
	}
	if (shootShips) {
		for (var d = 0; d < beamsR; d++) {
			displayTxt += "<th title=\"Right Combatant Beam "+d+"R\">oR"+d+"</th>";
		}
	}
	if (baysL > 0) {
		displayTxt += "<th title=\"Left Combatant Fighter Bay\">fL</th>";
	}
	if (baysR > 0) {
		displayTxt += "<th title=\"Left Combatant Fighter Bay\">fR</th>";
	}
	for (var e = 0; e < beamsL; e++) {
		displayTxt += "<th title=\"Left Combatant Recharge "+e+"\">eL"+e+"</th>";
	}
	for (var f = 0; f < beamsR; f++) {
		displayTxt += "<th title=\"Right Combatant Recharge "+f+"\">eR"+f+"</th>";
	}
	displayTxt += "</tr></thead><tbody>";
	do {
		displayTxt += "<tr>";
		displayTxt += "<td>"+workSeed+"</td>";
		if (shootShips) {
			for (var a = 0; a < beamsL; a++) {
				displayTxt += buildDieCell(seedTableTwenty[workSeed],6);
				workSeed = (workSeed + 1) % 119;
			}
		}
		for (var b = 0; b < beamsL; b++) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],4);
			workSeed = (workSeed + 1) % 119;
		}
		for (var c = 0; c < beamsR; c++) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],4);
			workSeed = (workSeed + 1) % 119;
		}
		if (shootShips) {
			for (var d = 0; d < beamsR; d++) {
				displayTxt += buildDieCell(seedTableTwenty[workSeed],6);
				workSeed = (workSeed + 1) % 119;
			}
		}
		if (baysL > 0) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],baysL);
			workSeed = (workSeed + 1) % 119;
		}
		if (baysR > 0) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],baysR);
			workSeed = (workSeed + 1) % 119;
		}
		for (var e = 0; e < beamsL; e++) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],0);
			workSeed = (workSeed + 1) % 119;
		}
		for (var f = 0; f < beamsR; f++) {
			displayTxt += buildDieCell(seedTableTwenty[workSeed],0);
			workSeed = (workSeed + 1) % 119;
		}
		displayTxt += "</tr>";
		rowsDone++;
		
		if (rowsDone >= 18) {
			break;
		}
	} while (workSeed != seedInit)
	displayTxt += "</tbody></table>";
	if (rowsDone >= 18) {
		displayTxt += "(Weapon composition does not cycle a prime number of seeds.)";
	}

	headerTxt = "Seed Data ("+beamsL+"-beam ";
	if (baysL > 0) {
		headerTxt += "carrier";
	} else {
		headerTxt += "torp ship";
	}
	headerTxt += " vs "+beamsR+"-beam ";
	if (baysR > 0) {
		headerTxt += "carrier)";
	} else {
		headerTxt += "torp ship)";
	}
	
	prevSeed = (seedInit + 118) % 119;
	nextSeed = (seedInit + 1) % 119;

	displayTxt = "<b>"+headerTxt+"</b><br />" + displayTxt + "<br /><br />\
		<a class=\"interact\" href=\"javascript:buildSeedVisualizer("+prevSeed+","+baysL+","+beamsL+","+baysR+","+beamsR+","+shootShips+");\">&lArr;</a>\
		<a class=\"interact\" href=\"javascript:closeBox();\">Close</a>\
		<a class=\"interact\" href=\"javascript:buildSeedVisualizer("+nextSeed+","+baysL+","+beamsL+","+baysR+","+beamsR+","+shootShips+");\">&rArr;</a>";
	
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "initial";
}

function buildCustomTable(shootShips) {
	var beamBanks = [document.getElementById("beamsL").value, document.getElementById("beamsR").value];
	var fighterBays = [document.getElementById("baysL").value, document.getElementById("baysR").value];
	
	buildSeedVisualizer(Math.floor(Math.random()*119),fighterBays[0],beamBanks[0],fighterBays[1],beamBanks[1],shootShips);
}

function closeBox() {
	document.getElementById("infobox").style.display = "none";
}
