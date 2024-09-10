function compute() {
	baseNclans = document.getElementById("clans").value;
	taxRate = document.getElementById("tax").value;
	govLevel = document.getElementById("gov").selectedIndex;
	
	planBuildings = parseInt(document.getElementById("mines").value) +
		parseInt(document.getElementById("fact").value);
		
	happyBonuses = 0;
	if (document.getElementById("avian").checked) {
		happyBonuses += 10;
	}
	if (document.getElementById("nebula").checked) {
		happyBonuses += 5;
	}
	var maxTaxes = getMaximumTaxes();

	output = "Assuming other variables are stable...<ul>\
		<li>The optimal native count to keep happy +1 is "+getOptimalClans(1)+" clans\
		<br />(To avoid happy -1 is "+getOptimalClans(0)+" clans)</li>\
		<li>The maximum structure count to keep happy +1 is "+getMaximumBldgs(1)+" mines and factories\
		<br />(To avoid happy -1 is "+getMaximumBldgs(0)+" buildings)</li><li>";
	
	if (maxTaxes >= 0) {
		output = output + "The maximum tax to avoid happy -1 is "+maxTaxes+"%";
	} else {
		output = output + "It is impossible to gain happiness given the previous conditions";
	}
	output = output + "</li></ul>";
	
	document.getElementById("results").innerHTML = output;
}

function getOptimalClans(target) {
	var workClans = 0;
	var prevClans = 0;
	var happyDelta;
	
	do {
		prevClans = workClans
		workClans = (Math.sqrt(workClans) + 1) ** 2;
		
		happyDelta = getHappyDelta(workClans, taxRate, planBuildings);
	} while (happyDelta >= target);
	
	if (target <= 0) {
		return workClans - 1;
	}
	return prevClans;
}

function getMaximumBldgs(target) {
	var workBldgs = 0;
	var happyDelta;
	
	do {
		workBldgs++;
		
		happyDelta = getHappyDelta(baseNclans, taxRate, workBldgs);
	} while (happyDelta >= target);
	
	return workBldgs - 1;
}

function getMaximumTaxes() {
	var workTaxes = -1;
	var happyDelta;
	
	do {
		workTaxes++;
		
		happyDelta = getHappyDelta(baseNclans, workTaxes, planBuildings);
	} while (happyDelta >= 0);
	
	return workTaxes - 1;
}

function getHappyDelta(nClans, nTaxes, pBldgs) {
	return Math.trunc((1000 - Math.sqrt(nClans) - (nTaxes * 85) - Math.trunc(pBldgs/2) - (50 * (10 - govLevel))) / 100) + happyBonuses;
}
