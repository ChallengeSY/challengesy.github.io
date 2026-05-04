const shuffModules = ["HomeSystem", "DeepSpace", "NPA", "Empire", "Alien", "Resource", "Scenario", "Aux", "Crew", "DSPA", "TalonAI"];

function checkShufflerData() {
	var elementsFound = 0;
	var resetObj = document.getElementById("resetShufflers");
	
	for (var i = 0; i < shuffModules.length; i++) {
		if (getStorage("se4x"+shuffModules[i]+"Shuff")) {
			var readStr = getStorage("se4x"+shuffModules[i]+"Shuff");
			var readArray = readStr.split("~");
			
			for (var j = 0; j < readArray.length; j++) {
				if (isFinite(readArray[j])) {
					elementsFound += parseInt(readArray[j]);
				}
			}
		}
	}
	
	if (resetObj) {
		resetObj.disabled = (elementsFound <= 0);
	}
}

function clearShufflerData() {
	var resetObj = document.getElementById("resetShufflers");

	if (confirm("This process will irreversibly empty ALL shuffler banks. Proceed?")) {
		for (var k = 0; k < shuffModules.length; k++) {
			setStorage("se4x"+shuffModules[k]+"Shuff", null);
		}

		if (resetObj) {
			resetObj.disabled = true;
		}
	}
}
