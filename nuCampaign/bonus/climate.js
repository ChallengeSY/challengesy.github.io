var cdr = 10;

function compute() {
	climate = document.getElementById("temp").value;
	maxGrow = document.getElementById("grow").value;
	
	simRace = document.getElementById("race").selectedIndex;
	selected = document.getElementById("race").options;
	ruleset = selected[simRace].index + 1;

	var output, maxClans, testClans, previousClans, growth, growthStopped, insertOther;
	
	if (climate < 0 || climate > 100 || !isFinite(climate) || climate == "") {
		output = "Please insert a number between 0 and 100";
	} else if (maxGrow <= 0 || !isFinite(maxGrow) || maxGrow == "") {
		output = "Please insert a growth target greater than 0";
	} else {
		output = "Details for temperature "+climate+":<br /><ul>";
		switch (ruleset) {
			case 1:
				insertOther = "";
			
				//Colonists for other races
				if (climate < 15 || climate >= 85) {
					output += "<li>No growth is possible using the classic growth formula</li>";
				} else {
					testClans = 0;
					growthStopped = false;
					output += "<li>Colonists will grow using the classic formula, using the items below as a guide:<ul>";
					for (var i = 1; i <= maxGrow; i++) {
						do {
							testClans += 1
							growth = Math.sin(3.14*(100-climate)/100) * testClans/20;
						
							if (testClans > Math.round(Math.sin(3.14*(100-climate)/100)*100000)) {
								growthStopped = true;
							}
						} while (growth < i - 0.5)
						if (growthStopped) {
							if (i <= 5) {
								output += "<li>No further growth is possible</li>";
							} else if (i > 6) {
								output += "<li>At least "+previousClans+" clans to grow "+(i-1)+" per turn</li>";
							}
							break;
						} else {
							if (i <= 6 || i >= maxGrow - 1) {
								output += "<li>At least "+testClans+" clans to grow "+i+" per turn</li>";
							}
						}
						previousClans = testClans;
					}
					output += "</ul></li>";
				}

				if (climate < 20) {
					insertOther = "generic ";
					output += "<li>Maximum Rebel colonist population is 90000 clans</li>";
				}
				if (climate < 15) {
					maxClans = Math.floor((299.9+200*climate)/cdr);
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				} else if (climate >= 85) {
					maxClans = Math.floor((20099.9-200*climate)/cdr);
					if (maxClans < 60) {
						insertOther = "generic ";
						output += "<li>Maximum Fascist/Robotic/Rebel/Colonial colonist population is 60 clans</li>";
					}
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				} else {
					maxClans = Math.round(Math.sin(3.14*(100-climate)/100)*100000);
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				}
				break;
			case 2:
				//Crystalline colonists without Improved Desert Habitation
				if (climate < 2) {
					output += "<li>No growth is possible using this formula</li>";
				} else {
					if (climate < 15) {
						output += "<li>Crystalline growth is NuHost-exclusive on arctic worlds</li>";
					}
					
					testClans = 0;
					growthStopped = false;
					output += "<li>Crystalline colonists will grow using the items below as a guide:<ul>";
					for (var i = 1; i <= maxGrow; i++) {
						do {
							testClans += 1
							growth = climate/100 * testClans/20;
						
							if (testClans > 1000*climate) {
								growthStopped = true;
							}
						} while (growth < i - 0.5)
						if (growthStopped) {
							if (i <= 5) {
								output += "<li>No further growth is possible</li>";
							} else if (i > 6) {
								output += "<li>At least "+previousClans+" clans to grow "+(i-1)+" per turn</li>";
							}
							break;
						} else {
							if (i <= 6 || i >= maxGrow - 1) {
								output += "<li>At least "+testClans+" clans to grow "+i+" per turn</li>";
							}
						}
						previousClans = testClans;
					}
					output += "</ul></li>";
				}

				maxClans = 1000*climate;
				output += "<li>Maximum colonist population is "+maxClans+" clans<br /><br /></li>";
				break;
			case 3:
				//Crystalline colonists WITH Improved Desert Habitation
				
				if (climate < 4) {
					output += "<li>No growth is possible using this formula</li>";
				} else {
					output += "<li>The <a href='http://planets.nu/#/race/7/advantages/47' class='bold'>Improved Desert Habitation</a> advantage is exclusive to NuHost</li>";
				
					testClans = 0;
					growthStopped = false;
					output += "<li>Crystalline colonists will grow using the items below as a guide:<ul>";
					for (var i = 1; i <= maxGrow; i++) {
						do {
							testClans += 1
							growth = Math.pow(climate,2)/4000 * testClans/20;
						
							if (testClans > 1000*climate) {
								growthStopped = true;
							}
						} while (growth < i - 0.5)
						if (growthStopped) {
							if (i <= 5) {
								output += "<li>No further growth is possible</li>";
							} else if (i > 6) {
								output += "<li>At least "+previousClans+" clans to grow "+(i-1)+" per turn</li>";
							}
							break;
						} else {
							if (i <= 6 || i >= maxGrow - 1) {
								output += "<li>At least "+testClans+" clans to grow "+i+" per turn</li>";
							}
						}
						previousClans = testClans;
					}
					output += "</ul></li>";
				}

				maxClans = 1000*climate;
				output += "<li>Maximum colonist population is "+maxClans+" clans<br /><br /></li>";
				break;
				
			case 4:
				//Academy fixes colonist taxes at 5%, cutting growth in half. Crystals are absent
				insertOther = "";
				
				if (climate < 15 || climate >= 85) {
					output += "<li>No growth is possible using the Academy growth formula</li>";
				} else {
					testClans = 0;
					growthStopped = false;
					output += "<li>Colonists will grow using the Academy formula, using the items below as a guide:<ul>";
					for (var i = 1; i <= maxGrow; i++) {
						do {
							testClans += 1
							growth = Math.sin(3.14*(100-climate)/100) * testClans/20 * 5/10;
						
							if (testClans > Math.round(Math.sin(3.14*(100-climate)/100)*100000)) {
								growthStopped = true;
							}
						} while (growth < i - 0.5)
						if (growthStopped) {
							if (i <= 5) {
								output += "<li>No further growth is possible</li>";
							} else if (i > 6) {
								output += "<li>At least "+previousClans+" clans to grow "+(i-1)+" per turn</li>";
							}
							break;
						} else {
							if (i <= 6 || i >= maxGrow - 1) {
								output += "<li>At least "+testClans+" clans to grow "+i+" per turn</li>";
							}
						}
						previousClans = testClans;
					}
					output += "</ul></li>";
				}

				if (climate < 20) {
					insertOther = "generic ";
					output += "<li>Maximum Rebel colonist population is 90000 clans</li>";
				}
				if (climate < 15) {
					maxClans = Math.floor((299.9+200*climate)/cdr);
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				} else if (climate >= 85) {
					maxClans = Math.floor((20099.9-200*climate)/cdr);
					if (maxClans < 60) {
						insertOther = "generic ";
						output += "<li>Maximum Fascist/Robotic/Rebel/Colonial colonist population is 60 clans</li>";
					}
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				} else {
					maxClans = Math.round(Math.sin(3.14*(100-climate)/100)*100000);
					output += "<li>Maximum "+insertOther+"colonist population is "+maxClans+" clans<br /><br /></li>";
				}
				break;
				
		}
		
		if (ruleset < 5) {
			maxClans = 1000*climate;
			output += "<li>Siliconoid native population will grow until they exceed "+maxClans+" clans</li>";
			maxClans = Math.round(Math.sin(3.14*(100-climate)/100)*150000);
			output += "<li>Generic native population will grow until they exceed "+maxClans+" clans</li>";
		}
		output += "</ul>";
	}
	
	document.getElementById("results").innerHTML = output;
}

function optimizeFactories(baseMax) {
	var maxFactories, optimalClans, optimalFactories, calcMax, newMax, losses;
	
	if (baseMax > 100) {
		maxFactories = 100 + Math.floor(Math.sqrt(baseMax-100));
	} else {
		maxFactories = baseMax;
	}
	optmialClans = baseMax;
	
	do {
		optmialClans++;
		if (baseMax > 100) {
			optimalFactories = 100 + Math.floor(Math.sqrt(optmialClans-100));
		} else {
			optimalFactories = optmialClans;
		}
		
		calcMax = optmialClans - (optmialClans - baseMax)*cdr/100;
		netSupplies = optimalFactories - 1 - Math.floor(calcMax/40);
		newMax = Math.round(calcMax + netSupplies/40);
	} while (optmialClans <= newMax);
	
	return optmialClans - 1;
}