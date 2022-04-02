function compute() {
	density = document.getElementById("density").value;
	harvestTarget = document.getElementById("harvest").value;
	reptilians = document.getElementById("reptilian").checked;
	
	minesNeeded = new Array(0, 0, 0);
	
	minesNeeded[0] = (harvestTarget - 0.5) / (density / 100) / 0.7; // Fed
	minesNeeded[1] = (harvestTarget - 0.5) / (density / 100) / 2;  // Lizard
	minesNeeded[2] = (harvestTarget - 0.5) / (density / 100);     // Others
	
	if (reptilians) {
		for (var i = 0; i < 3; i++) {
			minesNeeded[i] = minesNeeded[i] / 2;
		}
	}
	
	output = "Mines needed under these conditions:<br /><ul>";;
	output += "<li>" + Math.ceil(minesNeeded[0]) + " (" + minesNeeded[0].toFixed(3) + ") mines for Fed colonies</li>";;
	output += "<li>" + Math.ceil(minesNeeded[1]) + " (" + minesNeeded[1].toFixed(3) + ") mines for Lizard colonies</li>";;
	output += "<li>" + Math.ceil(minesNeeded[2]) + " (" + minesNeeded[2].toFixed(3) + ") mines for other colonies</li>";;
	output += "</ul>";

	document.getElementById("results").innerHTML = output;

}
