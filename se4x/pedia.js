var replaceAllFailed = false;
var useRuleset = "AGT";

const boxFilling = ["&#9617;","&#9618;","&#9608;"];

function setupBox() {
	var bodyPanel = document.getElementsByTagName("body")[0];
	var infoFrag;
	var targetDate = new Date;
	
	infoFrag = document.createElement("div");
	infoFrag.id = "infobox";
	infoFrag.style.position = "fixed";
	infoFrag.style.left = "0px";
	infoFrag.style.right = "0px";
	infoFrag.style.top = "125px";
	infoFrag.style.marginLeft = "auto";
	infoFrag.style.marginRight = "auto";
	infoFrag.style.zIndex = "3";
	infoFrag.style.background = "#000020";
	infoFrag.style.border = "1px #CCC solid";
	infoFrag.style.borderRadius = "10px";
	infoFrag.style.textAlign = "center";
	infoFrag.style.display = "none";
	bodyPanel.appendChild(infoFrag);
}

function closeBox() {
	document.getElementById("infobox").style.display = "none";
}

function rollD10() {
	return 1 + Math.floor(Math.random()*10);
}

function cloneArray(orgArray) {
	newArray = new Array();
	
	for (var c = 0; c < orgArray.length; c++) {
		newArray[c] = orgArray[c];
	}
	
	return newArray;
}

function conceptLink(keyterm) {
	return "<a href=\"javascript:showBox('"+keyterm.replace("'","\\\'")+"')\">"+keyterm+"</a>";
}

function stats4X(faction, buildCost, atk, def, hullSize, tac, tech) {
	if (faction == "Alternate" && useRuleset != "AGT") {
		return "";
	}
	
	var fragTxt = "<br /><br />";
	fragTxt = fragTxt + "<b class=\"headOx\">"+faction+" Stats</b><br />";
	if (buildCost != 0) {
		var verb = "Build";
		
		if (faction == "Alien") {
			verb = "Hire";
		}
		fragTxt = fragTxt + "<b>"+verb+" Cost</b>: "+buildCost+" "+conceptLink("CP")+"<br />";
	}
	if (atk != "0") {
		fragTxt = fragTxt + "<b>"+conceptLink("Attack")+"</b>: "+atk+"<br /><b>"+conceptLink("Defense")+"</b>: "+def+"<br /><b>"+conceptLink("Hull Size")+"</b>: "+hullSize;
		
		if (typeof tac !== "undefined" && tac >= 0) {
			fragTxt = fragTxt + "<br /><b>"+conceptLink("Tactics")+"</b>: Level "+tac;
		}
	} else {
		fragTxt = fragTxt + conceptLink("Non-combat ship");
	}
	if (tech) {
		fragTxt = fragTxt + "<br /><b>Required "+conceptLink("Tech")+"</b>: "+tech;
	}
	
	return fragTxt;
}

function statsTalon(faction, buildCost, weps, shields, hull) {
	var fragTxt = "<br />";
	fragTxt = fragTxt + "<b class=\"headOx\">"+faction+" Stats</b><br />";
	fragTxt = fragTxt + "<b>Cost</b>: "+buildCost+" "+conceptLink("SP")+"<br />";
	fragTxt = fragTxt + "<b>Armaments</b>: "+weps+"<br />";
	fragTxt = fragTxt + "<b><a href=\"javascript:showBox('shield')\">Shields</a></b>: "+shields+"<br />";
	fragTxt = fragTxt + "<b>" + conceptLink("Hull")+" (points)</b>: "+hull+"<br />";
	
	return fragTxt;
}

function discardVal(baseAmt, repAmt) {
	var fragTxt = "<br /><br />";
	fragTxt = fragTxt + "<b>Base Discard Value</b>: " + baseAmt + " "+conceptLink("CP");
	if (repAmt) {
		fragTxt = fragTxt + "<br /><b>Discard Value w/ "+conceptLink("Replicators")+"</b>: \
			" + repAmt + " "+conceptLink("CP");
	}
	
	return fragTxt;
}

function dmBase(strength) {
	const dmCommonA = "Non-player <q>boss</q> ship that will instantly destroy any undefended "+conceptLink("planet")+" it contests.";
	const dmCommonB = "<br />Equipped with "+conceptLink("Scanning")+" level 2. \
		Immune to "+conceptLink("boarding")+", "+conceptLink("fighter")+"s, "+conceptLink("mines")+", \
		and non-"+conceptLink("amoeba")+" non-"+conceptLink("quasar")+" non-"+conceptLink("ion storm")+" terrain.\
		<br />Prevents the benefits of "+conceptLink("Fleet Size Bonus")+"es and "+conceptLink("combat ship")+" "+conceptLink("screen")+"ing.";
	
	if (strength == "MP") {
		return "<b class=\"headOx\">Doomsday Machine (Competitive variant)</b><br />"+dmCommonA+dmCommonB+" <span class=\"bindTxt\">Repairs damage in between "+conceptLink("battle")+"s.</span>";
	} else if (strength) {
		return "<b class=\"headOx\">Doomsday Machine (Strength "+strength+")</b><br />"+dmCommonA+dmCommonB+" <span class=\"bindTxt\">May have a "+conceptLink("weakness")+".</span>";
	}
	
	return "<b class=\"headOx\">Doomsday Machine</b><br />"+dmCommonA+"<br /><br />As a scenario, the objective is for the human player(s) to \
		defend their "+conceptLink("homeworld")+"(s) and (if present) "+conceptLink("galactic capitol")+" against 3 DMs \
		<span class=\"bindTxt\">(more in a "+conceptLink("co-op")+" scenario)</span>, each usually stronger than the previous.";
}

function amoebaBase(strength) {
	const amoebaCommon = "Hazardous species that will multiply themselves and attempt to destroy human player(s).";
	
	if (strength == "?") {
		return "<b class=\"headOx\">Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Automatically destroys <b>all</b> ships (except "+conceptLink("Minesweeper")+"s and "+conceptLink("Minelayer")+"s), until fully researched.";
	} else if (parseInt(strength) > 7) {
		return "<b class=\"headOx\">Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Vulnerable only from inside detonations.<br /><br />\
			Detonating "+conceptLink("Scout")+"s cleanse the "+conceptLink("hex")+" on a &le;4. "+conceptLink("Destroyer")+"s on a &le;8. \
			"+conceptLink("Cruiser")+"s through "+conceptLink("Titan")+"s cleanse the hex without fail.";
	} else if (strength) {
		return "<b class=\"headOx\">Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Immune to "+conceptLink("Cloaking")+" and "+conceptLink("Fighter")+"s unless specified otherwise.\
			<br />Prevents the benefits of "+conceptLink("Fleet Size Bonus")+"es and non-"+conceptLink("Minesweeper")+" "+conceptLink("screen")+"ing. \
			Successful hits "+conceptLink("swallow")+" the victim whole.";
	}
	
	return "<b class=\"headOx\">Space Amoeba</b><br />"+amoebaCommon+"<br /><br />As a solo scenario, researching and eliminating them are the "+conceptLink("primary objective")+" before the "+conceptLink("homeworld")+" is consumed.<br />Also available in competitive scenarios as an obstacle.";
}

function capitalizeWords(txt) {
	txtColl = txt.split(" ");
	var buildTxt = "";
	
	for (var t = 0; t < txtColl.length; t++) {
		if (t > 0) {
			buildTxt = buildTxt + " ";
		}
		
		buildTxt = buildTxt + txtColl[t].charAt(0).toUpperCase() + txtColl[t].substring(1).toLowerCase();
	}
	
	return buildTxt;
}

function showBox(concept) {
	var infoPanel = document.getElementById("infobox");
	var headingTxt = capitalizeWords(concept);
	var displayTxt = "";
	var provideLinks = 0;

	infoPanel.style.maxWidth = "1000px";
	
	switch (concept.toLowerCase()) {
		// Base Concepts
		case "ai":
			headingTxt = "Artificial Intelligence (AI)";
			if (useRuleset == "talon") {
				displayTxt = "Extremely antagonistic machine faction that operates their ships autonomously, introduced in "+conceptLink("Talon 1000")+".\
					<br />Their ships use "+conceptLink("Laser")+"s and "+conceptLink("Cobalt Cannon")+"s, and have neither utility nor capacity for "+conceptLink("power")+".";
			} else {
				displayTxt = "Extremely antagonistic faction that operates their empire autonomously. Their rules vary wildly from one scenario to another.";
			}
			break;
		case "attack":
			displayTxt = "Determines the "+conceptLink("Weapon Class")+" this "+conceptLink("ship")+" has in "+conceptLink("battle")+" (A-F), \
				followed by the maximum d10 roll allowed to score a hit.<br />(Assuming no enemy "+conceptLink("Defense")+" modifiers.)<br /><br />\
				Attack "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+"";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />Attack level 4 is available only to "+conceptLink("Titan")+"s and "+conceptLink("Starbase")+"s, if "+conceptLink("Advanced Construction")+" 1 is developed.";
			} else if (useRuleset == "rep") {
				displayTxt = displayTxt + "<br />Attack level 4 is available only to "+conceptLink("Titan")+"s, if "+conceptLink("Advanced Construction")+" 1 is developed.";
			}
			break;
		case "battling":
			// Fall thru
		case "battle":
			if (useRuleset == "talon") {
				displayTxt = "Whenever "+conceptLink("ship")+"s from two opposing sides meet, a battle will start.<br /><br />\
					Battles are dividied into "+conceptLink("round")+"s, lasting until no more than one team still has ships, or one team concedes.";
			} else {
				displayTxt = "Whenever "+conceptLink("combat ship")+"s from two opposing sides meet (usually in a "+conceptLink("hex")+"), \
					a battle will start, ceasing movement of the invading "+conceptLink("ship")+"s.<br />\
					(Exception: If one side has only "+conceptLink("non-combat ship")+"s, those ships get destroyed instead; without impeding movement.)<br /><br />\
					Battles are dividied into "+conceptLink("round")+"s, lasting until only one side still has combat ships.";
			}
			break;
		case "bid":
			displayTxt = "During each "+conceptLink("economic phase")+", players secretly bid any "+conceptLink("CP")+" they wish to set aside\
				to try to steal the "+conceptLink("initiative")+" for the next 3 "+conceptLink("turn")+"s.<br />\
				Bids are revealed after "+conceptLink("colonies")+" have grown. CP spent this way is consumed whether or not a given player wins the bid.<br /><br />\
				The player that wins the bid determines <b>who</b> gains initiative.";
			break;
		case "blockade":
			displayTxt = "A "+conceptLink("colony")+" is blockaded if there are enemy "+conceptLink("combat ship")+"(s) in orbit.\
				Produces no "+conceptLink("CP")+" until the "+conceptLink("hex")+" is clear.";
			break;
		case "blood brothers":
			displayTxt = "Teams with this setting take their "+conceptLink("turn")+"s together. \
				Can stack/attack together, and can use each others' "+conceptLink("Pipeline")+"s for "+conceptLink("movement")+". \
				They still share neither "+conceptLink("CP")+" or "+conceptLink("technology")+".";
			break;
		case "bombard":
			headingTxt = "Bombardment";
			displayTxt = "A process in which "+conceptLink("combat ship")+"s can damage an enemy "+conceptLink("colony")+", using its "+conceptLink("Attack")+" rating and tech.<br />\
				Each hit scored reduces colony growth by one stage until its production reaches 0 "+conceptLink("CP")+". Limit 1 roll per "+conceptLink("ship")+" per "+conceptLink("turn");
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator")+" colonies survive being reduced to 0 CP, \
					but are vulnerable to "+conceptLink("Anti-Replicator")+" "+conceptLink("transport")+"s.";
			}
			break;
		case "campaign":
			displayTxt = "A collection of scenarios or playthroughs grouped together.";
			break;
		case "combat ship":
			headingTxt = "Combat ship";
			displayTxt = "A "+conceptLink("ship")+" (or group thereof) able to conduct "+conceptLink("battle")+"s and enter "+conceptLink("unexplored")+" systems unassisted. \
				Has at least an "+conceptLink("Attack")+" rating. Can "+conceptLink("blockade")+" and "+conceptLink("bombard")+" "+conceptLink("colonies")+".";
			break;
		case "competitive":
			headingTxt = "Competitive scenario";
			displayTxt = "A scenario that pits two or more human players against each other on a "+conceptLink("versus map")+". Can be a Free For All, or a Team Game.<br /><br />\
				The default "+conceptLink("primary objective")+" is to be the first player to destroy a hostile "+conceptLink("homeworld")+".";
			break;
		case "cp":
			headingTxt = "Construction Points (CP)";
			displayTxt = "Monetary currency. Earned by developing "+conceptLink("colonies")+", towing "+conceptLink("minerals")+", and connecting "+conceptLink("pipeline")+"s. \
				Used to buy "+conceptLink("technology")+" and build "+conceptLink("ship")+"s.";
			break;
		case "co-op":
			// Fall thru
		case "cooperative":
			headingTxt = "Cooperative scenario";
			displayTxt = "A scenario that pits a "+conceptLink("Blood Brothers")+" team of two or more human players against the environment.\
				<br />"+conceptLink("Doomsday Machine")+"s and "+conceptLink("Alien Empires")+" are officially supported.";
			break;
		case "defense":
			displayTxt = "Decreases the maximum d10 roll allowed by an attacker to score a hit on this "+conceptLink("ship")+", to a minimum "+conceptLink("Attack")+" rating of 1.<br />\
				(Exception: Minimum Attack versus a "+conceptLink("Titan")+" or a non-competitive "+conceptLink("DM")+" is instead 0.)\
				<br /><br />Defense "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+".\
				<br /><br />As an "+conceptLink("Alien Player")+" bank; this is used whenever one of their "+conceptLink("colonies")+" is being contested,\
				and is built with twice the standard effectiveness.";
			break;
		case "economic phase":
			displayTxt = "A simultaneous phase in which all production and spending takes place.";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + " There are 3 regular "+conceptLink("turn")+"s in between each economic phase.";
			}
			break;
		case "explore":
			// Fall thru, twice
		case "exploring":
		case "exploration":
			headingTxt = "Exploration";
			displayTxt = "The concept of exploring new terrain and uncovering their mysteries.";
			if (useRuleset == "talon") {
				displayTxt = displayTxt + " Not available in "+conceptLink("Talon")+" "+conceptLink("battle")+"s.";
			} else {
				displayTxt = displayTxt + "<br /><br />As a "+conceptLink("technology")+", level 1 allows "+conceptLink("Cruiser")+"s";
				if (useRuleset != "SE4X") {
					displayTxt = displayTxt + " / "+conceptLink("Flagship")+"s";
					if (useRuleset != "CE") {
						displayTxt = displayTxt + " / "+conceptLink("Type Exp")+"s";
					}
				}
				displayTxt = displayTxt + " to remotely explore an adjacent "+conceptLink("unexplored")+" "+conceptLink("hex")+" just before movement.";
				
				if (useRuleset != "SE4X") {
					displayTxt = displayTxt + "<br />Level 2 allows "+conceptLink("Base")+"s / "+conceptLink("Ship Yard")+"s / Cruisers / Flagships to respond to \
						an adjacent "+conceptLink("battle")+" hex by sending in reinforcements with the "+conceptLink("React Move")+" ability.";
				}
			}
			break;
		case "fleet":
			displayTxt = "A fleet is a collection of "+conceptLink("starship")+"s, usually with a specific purpose.";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />As an "+conceptLink("Alien Player")+"/Bot bank, this is spent whenever they launch ships from their "+conceptLink("homeworld")+" or from a forward "+conceptLink("ship yard")+".";
			} else if (useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />As an "+conceptLink("Alien Player")+" bank, this is spent whenever they launch ships from their "+conceptLink("homeworld")+".";
			}
				
			break;
		case "fsb":
			// Fall thru
		case "fleet size bonus":
			headingTxt = "Fleet Size Bonus";
			displayTxt = "If one player has at least twice as many un"+conceptLink("screen")+"ed "+conceptLink("combat ship")+"s as their opponent \
				at the start of a battle "+conceptLink("round")+", all their "+conceptLink("ship")+"s get an additional "+conceptLink("Attack")+" +1 for that round.";
			break;
		case "hex":
			displayTxt = "A hexagonal-shaped space on a board where pieces (example: counters) can move/be placed to.";
			if (useRuleset == "talon") {
				displayTxt = displayTxt + "<br />"+conceptLink("Talon")+" uses these to denote small chunks of space";
			} else {
				displayTxt = displayTxt + "<br />"+conceptLink("Space Empires Anthology")+" uses these to denote systems";
			}
			displayTxt = displayTxt + " where "+conceptLink("starship")+"s can move; and where terrain can perform their abilities.";
			break;
		case "hull size":
			displayTxt = "Determines the amount of damage a "+conceptLink("combat ship")+" can take before being destroyed.<br />\
				Also determines the "+conceptLink("maintenance")+" cost and maximum effective levels for "+conceptLink("Attack")+" and "+conceptLink("Defense")+" "+conceptLink("tech")+"s.";
			break;
		case "initiative":
			if (useRuleset == "talon") {
				displayTxt = ">The concept used to determine <i>who</i> goes first each "+conceptLink("impulse")+" and "+conceptLink("power phase")+". \
					Can be wrestled by <q>bidding</q> "+conceptLink("power")+" each "+conceptLink("impulse")+".";
			} else {
				displayTxt = "The concept used to determine <i>who</i> goes first each "+conceptLink("turn")+". \
					Can be wrestled by "+conceptLink("bid")+"ding each "+conceptLink("economic phase")+".<br /><br />\
					In solo / "+conceptLink("co-op")+" scenarios, the environment can impose a fixed quota that applies each economic phase.";
			}
			break;
		case "maintenance":
			displayTxt = "The upkeep cost ("+conceptLink("CP")+") that must be paid each "+conceptLink("economic phase")+" \
				to maintain existing "+conceptLink("combat ship")+"s. Based on "+conceptLink("Hull Size")+".\
				<br />(Exception: Immobile ships";
			if (useRuleset != "SE4X") {
				displayTxt = displayTxt + ", "+conceptLink("ground unit")+"s, "+conceptLink("Flagship")+"s";
				
				if (useRuleset != "CE") {
					displayTxt = displayTxt + ", "+conceptLink("Replicators");
				}
			}
			displayTxt = displayTxt + " require no maintenance.)";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />Since "+conceptLink("AP Bot")+"s use "+conceptLink("economic rolls")+" to generate CP, they instead roll one less HS die \
					per non-<a href=\"javascript:showBox('Shattered Fleet')\">shattered</a> "+conceptLink("fleet")+" in service.";
			}
			break;
		case "movement":
			displayTxt = "The process of moving "+conceptLink("ship")+"s through space.";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + "<br />As a "+conceptLink("technology")+", improving this increases the number of total "+conceptLink("hex")+"es that most "+conceptLink("ship")+"s can move per "+conceptLink("economic phase")+".\
					<br />"+conceptLink("Decoy")+"s aside, "+conceptLink("non-combat ship")+"s have a fixed "+conceptLink("Movement")+" 1.\
					<br /><br />At level 1 (default), ships can move 3 hexes per economic phase (divided into 1 + 1 + 1, for the respective "+conceptLink("turn")+"s.)<br />\
					Each subsequent level adds another hex, favoring the later turns, but keeping it as even as possible. <span class=\"bindTxt\">(1 + 1 + 2 for level 2; 1 + 2 + 2 for level 3)</span>.";
			}
			break;
		case "non-combat ship":
			headingTxt = "Non-combat ship";
			displayTxt = "A "+conceptLink("ship")+" designed to support the empire, but has no weapons to conduct "+conceptLink("battle")+"s or defend itself.";
			break;
		case "npa":
			// Fall thru
		case "non-player alien":
			headingTxt = "Non-Player Alien";
			displayTxt = "Non-aligned faction that can guard their local "+conceptLink("barren planet")+". \
				If any "+conceptLink("ship")+"s are found, they must be defeated before the planet can be "+conceptLink("subdue")+"d.";
			break;
		case "primary objective":
			displayTxt = "A scenario objective that must be completed in order to achieve victory.";
			break;
		case "retreat":
			if (useRuleset == "talon") {
				displayTxt = "Process by which a "+conceptLink("ship")+" removes itself from "+conceptLink("battle")+" alive. Can be performed by entering a "+conceptLink("worm hole")+"; \
					or by punching the FTL drive on the very last step of a "+conceptLink("power phase")+", \
					provided the ship has been in battle for at least the number of "+conceptLink("rounds")+" equal to its max "+conceptLink("hull")+".";
			} else {
				displayTxt = "After the first "+conceptLink("battle")+" round, a mobile "+conceptLink("combat ship")+" may choose to retreat instead of fire upon an enemy ship.<br />\
					If it does, it must retreat to an unguarded "+conceptLink("hex")+" that puts it equal to, or closer to the nearest "+conceptLink("colony")+"\
					<span class=\"bindTxt\">(not counting any colony in the battle hex)</span>.";
			}
			break;
		case "round":
			headingTxt = "Battle Round";
			if (useRuleset == "talon") {
				displayTxt = "A collection of 6 "+conceptLink("impulse")+"s and 1 "+conceptLink("power phase")+".";
			} else {
				displayTxt = "At the beginning of each "+conceptLink("battle")+" round, players "+conceptLink("screen")+" (if available) and check for "+conceptLink("Fleet Size Bonus")+" eligibility.\
					<br />Afterwards, "+conceptLink("ship")+"s are organized according to "+conceptLink("Weapon Class")+". Each ship chooses a target, and fires <span class=\"bindTxt\">(rolling a d10)</span>.\
					<br />If the required "+conceptLink("Attack")+" (or less) has been rolled <span class=\"bindTxt\">(minus any target's "+conceptLink("Defense")+" rating)</span>, a hit has been scored.\
					<br />After the first round, whenever a mobile "+conceptLink("combat ship")+" would have its turn to fire, it may instead choose to "+conceptLink("retreat")+".";
			}
			break;
		case "screen":
			headingTxt = "Screening";
			displayTxt = "If one side has more "+conceptLink("combat ship")+"s than the opposite side at the start of a "+conceptLink("battle")+" "+conceptLink("round")+", \
				the larger fleet can screen "+conceptLink("ship")+"s up to the difference.<br />\
				Screened ships may not fire, nor be fired upon, nor do they contribute towards "+conceptLink("Fleet Size Bonus")+". Effective until end of round.<br /><br />\
				"+conceptLink("Non-combat ship")+"s are automatically screened for the entire battle, and are eliminated if their protection has been destroyed and/or "+conceptLink("retreat")+"ed.";
			break;
		case "scuttle":
			headingTxt = "Scuttling";
			displayTxt = "A player may choose to voluntarily remove "+conceptLink("ship")+"s from the board without refund, referred to as scuttling.<br />\
				This process is useful for freeing up counters for reconstruction, and/or to reduce "+conceptLink("maintenance")+" costs.";
			break;
		case "starship":
			// Fall through
		case "ship":
			headingTxt = "Starship";
			displayTxt = "Spacefaring vessel, able to travel in space.";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + " Can be built at a "+conceptLink("Ship Yard")+".";
			}
			break;
		case "subduing":
			// Fall through
		case "subdue":
			headingTxt = "Subdue";
			displayTxt = "Automatic process that occurs when a "+conceptLink("barren planet")+" loses its last "+conceptLink("NPA")+" defenders.";
			if (useRuleset == "SE4X") {
				displayTxt = displayTxt + " The planet is then considered uncolonized.";
			} else if (useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />The victor has one chance to conduct a ground "+conceptLink("battle")+". \
					If unsuccessful, the planet is considered uncolonized; no longer able to be "+conceptLink("capture")+"d.";
			}
			break;
		case "space empires 4x":
			headingTxt = "Space Empires 4X";
			displayTxt = "The base board game of galactic conquest. Includes a variety of system counters, "+conceptLink("ship")+" counters, numeric counters.\
				<br />Also includes "+conceptLink("competitive")+" scenarios (2 - 4 players), \
				plus two solo scenarios ("+conceptLink("Doomsday Machine")+"s / "+conceptLink("Alien Empires")+").";
			break;
		case "space empires anthology":
			displayTxt = "The base "+conceptLink("Space Empires 4X")+" game, plus the expansions that have been released: "+conceptLink("Close Encounters")+" / "+conceptLink("Replicators")+" / "+conceptLink("All Good Things");
			break;
		case "movement turn":
			// Fall through
		case "turn":
			headingTxt = "Turn";
			if (useRuleset == "talon") {
				displayTxt = "Procedure in which a "+conceptLink("ship")+" or missile adjusts its heading. It then moves afterwards, and its "+conceptLink("turn radius")+" is applied.";
			} else {
				displayTxt = "Technically a regular turn. A phase in which each player moves their "+conceptLink("ship")+"s, conducts "+conceptLink("battle")+"s, and explores systems;\
					one player at a time.<br />3 turns occur in between each "+conceptLink("economic phase")+".";
			}
			break;
		case "uneasy alliance":
			displayTxt = "Teams with this setting take their "+conceptLink("turn")+"s separately. \
				Can neither stack together, nor can they use each others' "+conceptLink("Pipeline")+"s.";
			break;
		case "versus map":
			displayTxt = "A map layout where two or more empires duke it out against each other, usually in a "+conceptLink("competitive")+" scenario.";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator Solitaire")+" also uses these maps, and "+conceptLink("AP Bot")+"(s) can be used in place of human player(s).";
			} else if (useRuleset == "rep") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator Solitaire")+" also uses these maps; usually the Medium or Large 2-player maps.";
			}
			break;
		case "vp":
			// Fall through
		case "victory point":
			headingTxt = "Victory Point (VP)";
			displayTxt = "Unique resource acquired by "+conceptLink("competitive")+" players/teams and the <q>environment</q> team.\
				<br />If an eligible player/team reaches the required VP quota, then they achieve victory and the scenario will end.";
			break;
		case "weakness":
			displayTxt = "In the corresponding solo/"+conceptLink("co-op")+" scenarios, a "+conceptLink("Doomsday Machine")+" may have a weakness, depending on a d10 roll:\
				<br /><br />1-2: Allows "+conceptLink("Fighter")+"s to damage a DM normally\
				<br />3-4: Detonating "+conceptLink("Mines")+" each can deal 1 damage to a DM, via rolling a 5 or less\
				<br />5-6: "+conceptLink("Scanning")+" is partially jammed. "+conceptLink("Raider")+"s benefit from "+conceptLink("Cloaking")+" \
					(sans "+conceptLink("retreat")+"s) and have "+conceptLink("Defense")+" +2\
				<br />7-8: Allows the player to benefit from "+conceptLink("Fleet Size Bonus")+", if they have at least 10 ships able to hit the DM\
				<br />9-10: No weakness was found on this DM";
			break;
		case "priority class":
			// Fall thru; was the previous term
		case "weapon class":
			headingTxt = "Weapon Class";
			displayTxt = "First factor that determines who can attack first (A &gt; B &gt; C &gt; D &gt; E &gt; F) each "+conceptLink("battle")+" "+conceptLink("round")+". \
				"+conceptLink("Tactics")+" "+conceptLink("technology")+" can break ties.";
			break;
			
		// Technologies
		case "cloaking":
			headingTxt = "Cloaking Technology";
			displayTxt = "Allows building "+conceptLink("Raider")+"s, which cloak by default, but can be detected or otherwise nullified.<br />\
				If a surprise is achieved, cloaked ships can choose between "+conceptLink("Attack")+" +1 or an instant "+conceptLink("retreat")+" on their first "+conceptLink("round")+" only.<br />\
				Level 2 equipment adds an additional Attack +1 throughout the "+conceptLink("battle")+" and negates "+conceptLink("Scanning")+" 1.";
			break;
		case "minelaying":
			headingTxt = "Minelaying Technology";
			displayTxt = "Allows building "+conceptLink("mines")+".";
			break;
		case "minesweeping":
			if (useRuleset == "talon") {
				headingTxt = "Minesweeping";
				displayTxt = "The concept of sweeping hostile minefields. Not available in "+conceptLink("Talon")+" "+conceptLink("battle")+"s.";
			} else {
				headingTxt = "Minesweeping Technology";
				displayTxt = "Allows building "+conceptLink("minesweeper")+"s. "+conceptLink("Tech")+" levels 2/3 improves the number of "+conceptLink("mines")+" swept per ship.\
					<br />"+conceptLink("Alien Player")+" "+conceptLink("Scout")+"s also benefit from this technology.";
				if (useRuleset != "SE4X") {
					displayTxt = displayTxt + "<br /><br />Also doubles as Science Technology versus "+conceptLink("space amoeba")+". Level 2 allows each vessel to roll 2 dice, keeping the best result.";
					if (useRuleset != "CE") {
						displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicators")+" instead can build "+conceptLink("Type SW")+" ships. They acquire it for free if they encounter mines.";
					}
				}
			}
			break;
		case "point-defense":
			headingTxt = "Point-Defense Technology";
			displayTxt = conceptLink("Scout")+"s equipped with this "+conceptLink("technology")+" gain an improved "+conceptLink("Attack")+" rating versus "+conceptLink("Fighter")+"s.\
				<br />At level 1, Scouts attack Fighters at A6. Level 2 at A7. Level 3 at A8. (Assuming no "+conceptLink("asteroids")+" / "+conceptLink("nebula")+" interference.)";
			if (useRuleset != "SE4X" && useRuleset != "CE" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicators")+" instead can build "+conceptLink("Type PD")+" ships. They acquire it for free if they encounter fighters.";
			}
			break;
		case "scanning":
			headingTxt = "Scanning Technology";
			displayTxt = conceptLink("Destroyer")+"s equipped with this "+conceptLink("technology")+" will \
				detect "+conceptLink("Raider")+"s with an equal or lower "+conceptLink("cloaking")+" level.";
			if (useRuleset != "SE4X" && useRuleset != "CE" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicators")+" instead can build "+conceptLink("Type Scan")+" ships. They acquire it for free if they encounter any cloaked ships.";
			}
			break;
		case "ship size":
			headingTxt = "Ship Size Technology";
			displayTxt = "Higher "+conceptLink("tech")+" levels allow larger and more powerful "+conceptLink("ship")+"s to be built. The starting tech level is 1.<br /><br />\
				Tech level 2 allows the construction of "+conceptLink("Destroyer")+"s and "+conceptLink("Base")+"s.<br />\
				Tech level 3 allows the construction of "+conceptLink("Cruiser")+"s.<br />\
				Tech level 4 allows the construction of "+conceptLink("Battlecruiser")+"s.<br />\
				Tech level 5 allows the construction of "+conceptLink("Battleship")+"s.<br />\
				Tech level 6 allows the construction of "+conceptLink("Dreadnought")+"s.";
			if (useRuleset != "SE4X" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br />Tech level 7 allows the construction of "+conceptLink("Titan")+"s.";
			}
			break;
		case "tactics":
			headingTxt = "Tactics Technology";
			displayTxt = "Used to break ties in case two opposing "+conceptLink("combat ship")+"s share the same "+conceptLink("Weapon Class")+". \
				If even this is the same level, then the defender wins the tie.";
			break;
		case "tech":
			// Fall through
		case "technologies":
			// Fall through
		case "technology":
			headingTxt = "Technology";
			displayTxt = "Developing technologies and levels allow unlocking more powerful "+conceptLink("ship")+"s, weapons, to name a few.";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + "Any tech levels purchased affect any ships built in the same "+conceptLink("economic phase")+" (including unlocking new ships).\
					Existing ships are unaffected, but can be "+conceptLink("upgrade")+"d.<br /><br />";
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + "As an "+conceptLink("Alien Player")+"/Bot bank, this is used almost exclusively for developing technology together with other spending. \
						<br />(An "+conceptLink("AP Bot")+" could transfer CP from this bank to the "+conceptLink("fleet")+" bank to replace any shortfall for a "+conceptLink("fleet launch")+".)";
				} else {
					displayTxt = displayTxt + "As an "+conceptLink("Alien Player")+" bank, this is used exclusively for developing technology together with other spending.";
				}
			}
			break;
		case "terraforming":
			headingTxt = "Terraforming Technology";
			displayTxt = "Level 1 allows colonizing "+conceptLink("barren planet")+"s.";
			if (useRuleset != "SE4X" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br />Level 2 allows upgraded "+conceptLink("Mining Ship")+"s to \
					harvest from "+conceptLink("nebula")+"e connected to a "+conceptLink("colony")+", at a rate of 5 "+conceptLink("CP")+" per turn.";
			}
			break;
		case "upgrade":
			displayTxt = "If a "+conceptLink("ship")+" has any outdated "+conceptLink("technology")+" as a result of being built prior to any developments, \
				it can be upgraded at a "+conceptLink("Ship Yard")+", at a cost of "+conceptLink("CP")+" equal to its "+conceptLink("Hull Size")+". \
				The ship group must not move for an entire "+conceptLink("turn")+" to perform their upgrades.<br />\
				(Exception: "+conceptLink("Base")+"s, "+conceptLink("Decoy")+"s, and "+conceptLink("Ship Yard")+"s are automatically upgraded at no cost; effective immediately after the tech level purchase.)";
			break;
			
		// Terrain
		case "asteroid belt":
			// Fall through
		case "asteroids":
			headingTxt = "Asteroid Belt";
			if (useRuleset == "talon") {
				displayTxt = "Damages any ship (except "+conceptLink("fighter")+"s) that enters the "+conceptLink("hex")+". \
					Can also reduce accuracy and/or potency of non-missile weapon fire. Can block "+conceptLink("power")+" transmission.";
			} else {
				displayTxt = "Inhibits movement of "+conceptLink("ship")+"s, unless following a "+conceptLink("Pipeline")+" network. \
					Nullifies "+conceptLink("Attack")+" "+conceptLink("technology")+" and reduces "+conceptLink("Weapon Class")+" to <b>E</b>.";
			}
			break;
		case "barren":
			// Fall through
		case "barren planet":
			headingTxt = "Barren Planet";
			displayTxt = "A less hospitable "+conceptLink("planet")+". Not colonizable";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + ", unless "+conceptLink("Terraforming")+" 1 has been developed.<br />Barren planets in "+conceptLink("deep space")+" may have \
					"+conceptLink("non-player alien")+"s ambushing any stragglers that explore it";
				if (useRuleset == "SE4X") {
					displayTxt = displayTxt + ".";
				} else {
					displayTxt = displayTxt + ", and/or have "+conceptLink("alien technology")+".";
				}
			}
			break;
		case "black hole":
			if (useRuleset == "talon") {
				displayTxt = "Sucks in "+conceptLink("ship")+"s in between "+conceptLink("round")+"s, destroying them instantly. \
					Reduces accuracy and/or potency of non-missile weapon fire, based on distance difference.";
			} else {
				displayTxt = "Forces <em>each</em> "+conceptLink("ship")+" that enters to roll a survival d10 roll, \
					unless they follow a "+conceptLink("Pipeline")+" network.<br />A roll of 6 or less allows the ship to remain. Otherwise, the ship is destroyed.";
			}
			break;
		case "colonies":
			// Fall through
		case "colony":
			headingTxt = "Colony";
			displayTxt = "A "+conceptLink("planet")+" that has been colonized.";
			if (useRuleset != "talon") {
				displayTxt = displayTxt + " Grows in production until it reaches 5 "+conceptLink("CP")+" in income.";
				if (useRuleset == "rep" || useRuleset == "AGT") {
					displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator")+" colonies do not produce CP. Instead, they build "+conceptLink("hull")+"s locally once at full strength.";
				}
			}
			break;
		case "danger":
			headingTxt = "Danger!";
			displayTxt = "If discovered, this system <em>instantly</em> destroys any "+conceptLink("ship")+"s in the same "+conceptLink("hex")+"! The counter is then removed afterwards.";
			break;
		case "deep space":
			if (useRuleset == "talon") {
				displayTxt = "Vast sections of space that spreads beyond a local solar system.";
			} else {
				displayTxt = "A set of "+conceptLink("hex")+"es that spread beyond the players' "+conceptLink("home system")+"s.<br />\
					These systems have a much higher risk <span class=\"bindTxt\">(several "+conceptLink("Danger")+"! counters, and less predictability)</span>, \
					but higher reward <span class=\"bindTxt\">("+conceptLink("minerals")+" pay better, and there can be "+conceptLink("space wreck")+"s)</span>.";
			}
			break;
		case "fold":
			// Fall through
		case "fold in space":
			headingTxt = "Fold in Space";
			displayTxt = "Terrain that allows "+conceptLink("ship")+"s to move/explore through it, as if no "+conceptLink("hex")+" existed at all.";
			break;
		case "galactic capitol":
			displayTxt = "Ancient homeworld. Sanctuary "+conceptLink("hex")+" in "+conceptLink("competitive")+" scenarios that \
				prohibits "+conceptLink("battle")+"s and provides 5 "+conceptLink("CP")+" to each "+conceptLink("Pipeline")+"-connected player.\
				<br /><br />In solo and "+conceptLink("co-op")+" scenarios (if present), it usually creates a respawnable 10-"+conceptLink("minerals")+" counter and \
				allows human player(s) to research "+conceptLink("Black Hole Jumping")+". \
				It must also be kept alive. Otherwise, the <q>environment</q> wins the scenario.";
			break;
		case "homeworld":
			if (useRuleset == "talon") {
				displayTxt = conceptLink("Primary Objective")+" "+conceptLink("planet")+" that, if taken by the opposing faction, ends the "+conceptLink("campaign")+" (usually an "+conceptLink("Empire War")+").</span>.";
			} else {
				displayTxt = "Starting "+conceptLink("colony")+" for an empire; being the most powerful <span class=\"bindTxt\">(produces &le;30 "+conceptLink("CP")+")</span> \
					and most important colony <span class=\"bindTxt\">(usually a "+conceptLink("primary objective")+")</span>.";
			}
			break;
		case "home system":
			displayTxt = "A set of "+conceptLink("hex")+"es that surround a "+conceptLink("homeworld")+". These systems are relatively safe, \
				with usually only a single dangerous "+conceptLink("black hole")+" counter shuffled among these 25 "+conceptLink("unexplored")+" systems.";
			break;
		case "lost":
			// Fall through
		case "lost in space":
			headingTxt = "Lost in Space";
			displayTxt = "If discovered, this system sends "+conceptLink("ship")+"s in a different, involuntary direction. A die roll is used in a solo or "+conceptLink("co-op")+" game. \
				In a "+conceptLink("competitive")+" game, an enemy player directs these ships. The counter is then removed afterwards.";
			break;
		case "planet":
			displayTxt = "A potentially habitable world. ";
			if (useRuleset == "talon") {
				displayTxt = displayTxt + "Can block weapon fire and "+conceptLink("power")+" transmission.<br />\
					Instantly destroys any colliding ship. Invulnerable, unless specified by scenario.";
			} else {
				displayTxt = displayTxt + "Becomes a "+conceptLink("colony")+" when colonized. Some planets are "+conceptLink("barren")+".";
			}
			break;
		case "pulsar":
			displayTxt = "Charges "+conceptLink("ship")+"s parked in the "+conceptLink("hex")+" with an extra benefit printed on the counter \
				<span class=\"bindTxt\">(Attack +1 / Defense +1 / +1 extra movement)</span>; \
				at the expense of being unable to "+conceptLink("retreat")+".";
			break;
		case "quantum filament":
			displayTxt = "Costs/requires 2 "+conceptLink("hex")+"es worth of "+conceptLink("movement")+" to enter. \
				Nullifies "+conceptLink("Cloaking")+" and "+conceptLink("Boarding")+" "+conceptLink("technology")+". Prohibits use of "+conceptLink("fighter")+"s. Not a valid "+conceptLink("retreat")+" hex.";
			break;
		case "quasar":
			displayTxt = "Nullifies "+conceptLink("Defense")+" "+conceptLink("technology")+" and natural Defense strength.";
			break;
		case "regional map":
			displayTxt = "Terrain allows peeking/exploring adjacent "+conceptLink("hex")+"es, as if the "+conceptLink("ship")+" had "+conceptLink("Exploration")+" 1. \
				The counter is removed once effects are resolved.";
			break;
		case "mineral":
			headingTxt = "Minerals";
			displayTxt = "Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to generate a one-time boost in "+conceptLink("CP")+" as shown on the counter(s) unloaded.";
			if (useRuleset != "SE4X" && useRuleset != "CE" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator")+" "+conceptLink("ship")+"s automatically cash them in, gaining the indicated amount directly.";
			}
			break;
		case "nebula":
			if (useRuleset == "talon") {
				displayTxt = "Prevents use of "+conceptLink("shield")+"s. Can reduce accuracy and/or potency of non-missile weapon fire. \
					Can block "+conceptLink("power")+" transmission.";
			} else {
				displayTxt = "Inhibits movement of "+conceptLink("ship")+"s, unless following a "+conceptLink("Pipeline")+" network. \
					Nullifies "+conceptLink("Defense")+" and "+conceptLink("Cloaking")+" "+conceptLink("technology")+" and reduces "+conceptLink("Weapon Class")+" to <b>E</b>.";
			}
			break;
		case "slingshot":
			displayTxt = "Allows daring ships to move an extra "+conceptLink("hex")+" through a "+conceptLink("black hole")+", \
				at the expense of being 20% easier to be sucked in. Does not stack with "+conceptLink("Pipeline")+" bonuses.";
			break;
		case "space wreck":
			displayTxt = "Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to develop a free random "+conceptLink("technology")+".";
			if (useRuleset != "SE4X" && useRuleset != "CE" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Replicator")+" "+conceptLink("ship")+"s automatically cash them in, gaining 1 "+conceptLink("RP")+" in the process.";
			}
			break;
		case "supernova":
			displayTxt = "If discovered, the "+conceptLink("ship")+"s that just explored it must immediately turn back. Serves as an impassable "+conceptLink("hex")+" for the rest of the game.";
			break;
		case "unexplored":
			headingTxt = "Unexplored System";
			displayTxt = "This system is shrouded in complete mystery. Can be explored by any "+conceptLink("combat ship")+" entering the "+conceptLink("hex")+", or via "+conceptLink("Exploration")+".\
				<br />"+conceptLink("Non-combat ship")+"s may not enter this system, unless escorted. No player "+conceptLink("ship")+" may enter this system, \
				while occupied by a "+conceptLink("Doomsday Machine")+" or an "+conceptLink("Alien Player")+" ship.";
			break;
		case "worm hole":
			// Fall thru
		case "warp point":
			if (useRuleset == "talon") {
				headingTxt = "Worm Hole";
				displayTxt = "Terrain that is used to "+conceptLink("retreat")+" from a "+conceptLink("Talon")+" "+conceptLink("battle")+", even for ships that suffer from "+conceptLink("FTL Offline")+".";
				break;
			} else {
				headingTxt = "Warp Point";
				displayTxt = "If two linked warp points are found, they can be traveled directly to each other, as if they were 1 "+conceptLink("hex")+" away from each other.";
				break;
			}
			
		// Ships
		case "decoy":
			displayTxt = "Support ship designed to fool enemies. Can be built at any "+conceptLink("colony")+". Automatically eliminated at the start of a "+conceptLink("battle");
			displayTxt = displayTxt + stats4X("Common", 1, 0, 0, 0);
			break;
		case "ship yard":
			displayTxt = "Space station able to build more "+conceptLink("ship")+"s. Can not move. Can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase")+
				"<br />Has a dedicated "+conceptLink("technology")+" that determines how many "+conceptLink("hull size")+"s (1 / 1.5 / 2) can be built per SY per "+conceptLink("economic phase")+
				" in a given hex.";
			displayTxt = displayTxt + stats4X("Common", 6, "C3", 0, 1);
			break;
		case "scout":
			headingTxt = "Scout (SC)";
			if (useRuleset == "talon") {
				displayTxt = "Faction-exclusive light ship<br />";
				displayTxt = displayTxt + statsTalon("Terran", 37, "Phaser", "2/1/1/1", 2);
			} else {
				displayTxt = "Light "+conceptLink("combat ship")+" suited for early exploration. Also benefits from "+conceptLink("Point-Defense")+" technology";
				displayTxt = displayTxt + stats4X("Base", 6, "E3", 0, 1);
				displayTxt = displayTxt + stats4X("Alternate", 6, "D2", 0, 1);
			}
			break;
		case "colony ship":
			displayTxt = "Support ship designed to colonize new "+conceptLink("planet")+"s, scrapping themselves in the process";
			displayTxt = displayTxt + stats4X("Common", 8, 0, 0, 0);
			break;
		case "mining ship":
			// Fall through
		case "miner":
			headingTxt = "Miner";
			displayTxt = "Support ship designed to tow "+conceptLink("minerals")+" and "+conceptLink("space wreck")+"s to "+conceptLink("colonies");
			displayTxt = displayTxt + stats4X("Common", 5, 0, 0, 0);
			break;
		case "destroyer":
			headingTxt = "Destroyer (DD)";
			if (useRuleset == "talon") {
				displayTxt = "Light ship<br />";
				displayTxt = displayTxt + statsTalon("Terran", 55, "Anti-Matter Torpedo", "3/3/3/2", 4);
				displayTxt = displayTxt + statsTalon("Talon", 48, "Missile Launcher x2", "4/2/2/2", 4);
				displayTxt = displayTxt + statsTalon("AI", 50, "Laser x2", "3/3/3/2", 4);
			} else {
				displayTxt = "Medium-Light "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Scanning")+" technology";
				displayTxt = displayTxt + stats4X("Base", 9, "D4", 0, 1, -1, conceptLink("Ship Size")+" 2");
				displayTxt = displayTxt + stats4X("Alternate", 10, "C4", 0, 1, -1, conceptLink("Ship Size")+" 2");
			}
			break;
		case "base":
			if (useRuleset == "talon") {
				displayTxt = "Immobile Battle Station. "+conceptLink("Terran")+" bases can hold up to 4 "+conceptLink("Fighter")+" squadrons<br />";
				displayTxt = displayTxt + statsTalon("Terran", 184, "Dual Phasers x2 + Wave-Motion Gun (R)", "7/7/7/7", 9);
				displayTxt = displayTxt + statsTalon("Talon", 184, "Dual Disruptors x2 + Dual Missiles", "7/7/7/7", 10);
			} else {
				displayTxt = "Battle Station with powerful long range weaponry. Can not move. \
					One can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase");
				if (useRuleset == "rep" || useRuleset == "AGT") {
					displayTxt = displayTxt + "<br />\
						Automatically "+conceptLink("upgrade")+"s to <b>Advanced Base</b> at "+conceptLink("Advanced Construction")+" 1; \
						those can be built in any "+conceptLink("hex")+" connected to a "+conceptLink("colony")+" via "+conceptLink("Pipeline");
				}
				displayTxt = displayTxt + stats4X("Common", 12, "A7", 2, 3, -1, conceptLink("Ship Size")+" 2");
			}
			break;
		case "heavy cruiser":
			// Fall through
		case "cruiser":
			if (useRuleset == "talon") {
				headingTxt = "Heavy Cruiser (CA)";
				displayTxt = "Medium ship<br />";
				displayTxt = displayTxt + statsTalon("Terran", 115, "Phasers x2 + Anti-Matter Torpedo", "6/5/5/4", 6);
				displayTxt = displayTxt + statsTalon("Talon", 115, "Dual Disruptors x2", "7/4/4/3", 7);
			} else {
				headingTxt = "Cruiser (CA)";
				displayTxt = "Medium "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Exploration");
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + " and "+conceptLink("Jammer");
				}
				displayTxt = displayTxt + " technology";
				displayTxt = displayTxt + stats4X("Base", 12, "C4", 1, 2, -1, conceptLink("Ship Size")+" 3");
				displayTxt = displayTxt + stats4X("Alternate", 12, "C5", 0, 2, -1, conceptLink("Ship Size")+" 3");
			}
			break;
		case "battlecruiser":
			headingTxt = "Battlecruiser (BC)";
			if (useRuleset == "talon") {
				displayTxt = "Medium-heavy ship<br />";
				displayTxt = displayTxt + statsTalon("Terran", 134, "Phasers x2 + Dual Anti-Matter Torpedos", "7/5/5/5", 6);
				displayTxt = displayTxt + statsTalon("Talon", 142, "Dual Disruptors + Disruptor + Triple Missiles", "8/4/4/4", 7);
			} else {
				displayTxt = "Medium-Heavy "+conceptLink("combat ship");
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("auxiliary")+" technology";
				} else if (useRuleset != "SE4X") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("Fastmove")+" technology";
				}
				displayTxt = displayTxt + stats4X("Common", 15, "B5", 1, 2, -1, conceptLink("Ship Size")+" 4");
			}
			break;
		case "battleship":
			headingTxt = "Battleship (BB)";
			if (useRuleset == "talon") {
				displayTxt = "Heavy ship<br />";
				displayTxt = displayTxt + statsTalon("Terran", 194, "Dual Phasers x2 + Wave-Motion Gun", "8/7/7/7", 9);
				displayTxt = displayTxt + statsTalon("Talon", 179, "Dual Disruptors x2 + Fusion Cannon", "9/7/7/6", 8);
				displayTxt = displayTxt + statsTalon("AI", 200, "Laser x1 + Cobalt Cannon x2", "9/9/9/9", 9);
			} else {
				displayTxt = "Heavy "+conceptLink("combat ship");
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("auxiliary")+" technology";
				} else if (useRuleset == "rep") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("Tractor Beam")+" technology";
				}
				displayTxt = displayTxt + stats4X("Base", 20, "A5", 2, 3, -1, conceptLink("Ship Size")+" 5");
				displayTxt = displayTxt + stats4X("Alternate", 20, "B6", 2, 3, -1, conceptLink("Ship Size")+" 5");
			}
			break;
		case "dreadnought":
			headingTxt = "Dreadnought (DN)";
			if (useRuleset == "talon") {
				displayTxt = "Faction-exclusive huge ship<br />";
				displayTxt = displayTxt + statsTalon("Talon", 218, "Dual Disruptors x2 + Dual Fusion Cannons", "11/9/9/8", 10);
			} else {
				displayTxt = "Huge "+conceptLink("combat ship");
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("auxiliary")+" technology";
				} else if (useRuleset == "rep") {
					displayTxt = displayTxt + ", able to benefit from "+conceptLink("Shield Projector")+" technology";
				}
				displayTxt = displayTxt + stats4X("Base", 24, "A6", 3, 3, -1, conceptLink("Ship Size")+" 6");
				displayTxt = displayTxt + stats4X("Alternate", 25, "A7", 3, 3, -1, conceptLink("Ship Size")+" 6");
			}
			break;
		
		// Advanced Ships
		case "carrier":
			headingTxt = "Carrier (CV)";
			if (useRuleset == "talon") {
				displayTxt = "Faction-exclusive transport ship, able to carry up to 4 "+conceptLink("Fighter")+" squadrons<br />";
				displayTxt = displayTxt + statsTalon("Terran", 70, "Phasers x2", "4/4/4/4", 6);
			} else {
				displayTxt = "Combat transport craft, able to carry up to 3 "+conceptLink("Fighter")+"s into space";
				displayTxt = displayTxt + stats4X("Base", 12, "E3", 0, 1, -1, conceptLink("Fighter")+" tech 1");
			}
			break;
		case "fighter":
			if (useRuleset == "talon") {
				headingTxt = "Fighter squadron";
				displayTxt = "Faction-exclusive small craft, requires a "+conceptLink("Carrier")+" or "+conceptLink("Base")+" to be deployed. Each squadron has 3 fighters<br />";
				displayTxt = displayTxt + statsTalon("Terran", 44, "1 Phaser per fighter", "None", "2 per fighter");
			} else {
				displayTxt = "Small craft. The base craft requires a "+conceptLink("Carrier")+" or "+conceptLink("Titan")+" to move into space. Gains Attack +1 versus Titans.<br />\
					As a technology, each level unlocks a progressively stronger fighter craft. The first level also unlocks Carriers for the Base faction.";
				displayTxt = displayTxt + stats4X("Base", 5, "B5 / B6 / B7 / B8", "0 / 0 / 1 / 2", 1, -1, "Fighter tech 1-4 + "+conceptLink("Advanced Construction")+" 2 (B8 variant only)");
				
				if (useRuleset == "AGT") {
					displayTxt = displayTxt + "<br /><br />The Alternate craft does not require a carrier, and the B6 / B7 variants get "+conceptLink("Defense")+" +1 versus "+conceptLink("Point-Defense")+".";
				}
				displayTxt = displayTxt + stats4X("Alternate", 7, "B5 / B6 / B7 / B8", "0 / 0 / 1 / 2", 1, -1, "Fighter tech 1-4 + "+conceptLink("Advanced Construction")+" 2 (B8 variant only)");
			}
			break;
		case "minelayer":
			// Fall through
		case "mines":
			headingTxt = "Mines";
			displayTxt = "Small craft that detonates upon contact with enemy "+conceptLink("ship")+"s, destroying them instantly unless "+conceptLink("sw")+"ept.";
			if (useRuleset != "SE4X") {
				displayTxt = displayTxt + "<br />Also inhibits spreading of "+conceptLink("space amoeba")+" for one "+conceptLink("economic phase")+", though immunity can be acquired.";
			}
			displayTxt = displayTxt + "<br />Has fixed "+conceptLink("Movement")+" 1; and may not enter enemy occupied "+conceptLink("hex")+"es";
			if (useRuleset != "SE4X") {
				displayTxt = displayTxt + ", except versus amoeba";
			}
			displayTxt = displayTxt + stats4X("Common", 5, "&infin;", 0, 1, -1, conceptLink("Minelaying"));
			break;
		case "pipeline":
			headingTxt = "Merchant Pipeline";
			displayTxt = "Support ship able to connect to Pipeline "+conceptLink("ship")+"s in adjacent hexes to \
				assist in movement along a <q>road</q> <span class=\"bindTxt\">(+1 "+conceptLink("hex")+" per "+conceptLink("turn")+" and ignores terrain)</span> and \
				income <span class=\"bindTxt\">(+1 "+conceptLink("CP")+" if it connects a "+conceptLink("colony")+" to the "+conceptLink("homeworld")+")</span>";
			displayTxt = displayTxt + stats4X("Common", 3, 0, 0, 0);
			break;
		case "raider":
			displayTxt = "Sneaky "+conceptLink("combat ship")+", comes cloaked (A) unless detected or nullified (D)";
			displayTxt = displayTxt + stats4X("Base", 12, "A/D4", 0, 2, -1, conceptLink("Cloaking")+" 1");
			displayTxt = displayTxt + stats4X("Alternate", 14, "A/D5", 0, 2, -1, conceptLink("Cloaking")+" 1");
			break;
		case "sw":
			// Fall through
		case "science vessel":
			// Fall through
		case "minesweeper":
			headingTxt = "Minesweeper";
			displayTxt = "Utility "+conceptLink("combat ship")+" that sweeps "+conceptLink("mines");
			if (useRuleset != "SE4X" && useRuleset != "talon") {
				headingTxt = headingTxt + " / Science Vessel";
				displayTxt = displayTxt + " and researches "+conceptLink("space amoeba");
			}
			displayTxt = displayTxt + stats4X("Common", 6, "E1", 0, 1, -1, conceptLink("Minesweeping")+" 1");
			break;
			
		// Non-Player Alien ships
		case "alien-d":
			headingTxt = "Alien Destroyer";
			displayTxt = "Light "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats4X("Alien", 0, "D4", 1, 1, 1);
			break;
		case "alien-c":
			headingTxt = "Alien Cruiser";
			displayTxt = "Medium "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats4X("Alien", 0, "C5", 2, 1, 1);
			break;
		case "alien-b":
			headingTxt = "Alien Battlecruiser";
			displayTxt = "Heavy "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats4X("Alien", 0, "B6", 2, 1, 1);
			break;
		
		// Doomsday Machines
		case "doomsday machine":
			// Fall through
		case "dm":
			displayTxt = dmBase(null)
			break;
		case "dmmp":
			displayTxt = dmBase("MP") + stats4X("Boss", 0, "C9", 2, 3, 2) + "<br /><b>Attacks per round</b>: 2";
			break;
		case "dm1":
			displayTxt = dmBase(1) + stats4X("Boss", 0, "D7", 1, 6, 2) + "<br /><b>Attacks per round</b>: 3";
			break;
		case "dm2":
			displayTxt = dmBase(2) + stats4X("Boss", 0, "C7", 1, 7, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm3":
			displayTxt = dmBase(3) + stats4X("Boss", 0, "C8", 2, 7, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm4":
			displayTxt = dmBase(4) + stats4X("Boss", 0, "C8", 2, 8, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm5":
			displayTxt = dmBase(5) + stats4X("Boss", 0, "B9", 2, 8, 2) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm6":
			displayTxt = dmBase(6) + stats4X("Boss", 0, "B9", 3, 9, 2) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm7":
			displayTxt = dmBase(7) + stats4X("Boss", 0, "B10", 3, 9, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm8":
			displayTxt = dmBase(8) + stats4X("Boss", 0, "A10", 3, 10, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm9":
			displayTxt = dmBase(9) + stats4X("Boss", 0, "A11", 4, 10, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm10":
			displayTxt = dmBase(10) + stats4X("Boss", 0, "A11", 4, 11, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "exploration dm":
			headingTxt = "Exploration Doomsday Machine";
			displayTxt = conceptLink("DM")+" that typically goes after the nearest "+conceptLink("colony")+" or \
				"+conceptLink("NPA")+" "+conceptLink("planet")+". Sometimes focuses on the "+conceptLink("galactic capitol")+".";
			break;
		case "extermination dm":
			headingTxt = "Extermination Doomsday Machine";
			displayTxt = conceptLink("DM")+" that focuses on a fixed target, \
				usually a "+conceptLink("homeworld")+" or sometimes the "+conceptLink("galactic capitol")+".\
				<br /><br />If they accomplish their objective, then their team wins the scenario.";
			break;
			
		// Alien Empires
		case "alien empires":
			displayTxt =  "Solo or "+conceptLink("co-op")+" scenario that pits 1-3 human player(s) against 2-3 "+conceptLink("Alien Player")+"s.<br />\
				The human players' objective is to destroy all AP "+conceptLink("homeworld")+"s,\
				while protecting their own and (if present) the "+conceptLink("galactic capitol")+" from destruction.";
			break;
		case "alien player":
			displayTxt = "Hostile empire that generates "+conceptLink("CP")+" from 1 or more unique "+conceptLink("economic roll")+"s per "+conceptLink("economic phase")+".<br />\
				Available when playing an "+conceptLink("Alien Empires")+" scenario. Starts with "+conceptLink("Minelaying")+" / \
				"+conceptLink("Nanomachine")+" tech, and with a single "+conceptLink("base")+".";
			if (useRuleset != "SE4X" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />In "+conceptLink("Victory Point")+" variants, also starts with "+conceptLink("Terraforming")+" 1 and "+conceptLink("Exploration")+" 1.";
			}
			break;
		case "economic roll":
			displayTxt = "Determines where an "+conceptLink("Alien Player")+" should allocate its "+conceptLink("CP")+" \
				("+conceptLink("Fleet")+"s, "+conceptLink("Technology")+", or "+conceptLink("Defense")+"),<br />\
				or if it permanently gains an <em>extra</em> economic roll 3 "+conceptLink("economic phase")+"s from the current phase.<br />\
				CP allocated into Defense are applied with twice the standard effectiveness, but can be capped depending on scenario.";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("AP Bot")+"s' rolls are seperated by source. \
					"+conceptLink("Home System")+" rolls are worth 10 CP each. "+conceptLink("Deep Space")+" rolls whatever a human player would earn at maximum strength each (usually 5 CP).";
			}
			break;
		case "defense composition":
			displayTxt = "Process an "+conceptLink("Alien Player")+" rolls to determine how to protect their "+conceptLink("homeworld")+". \
				<br />1-3: Maximum "+conceptLink("minelayer")+"s\
				<br />4-7: Balanced: Alternate between "+conceptLink("Base")+" and "+conceptLink("Minelayer")+", as "+conceptLink("CP")+" permits\
				<br />8-10: Maximum "+conceptLink("base")+"s. Leftover CP is spent on "+conceptLink("minelayer")+"s";
			break;
		case "fleet launch":
			displayTxt = "Process used to determine whether an "+conceptLink("Alien Player")+" or "+conceptLink("AP Bot")+" should launch a fresh "+conceptLink("fleet")+", using the appropriate "+conceptLink("CP")+".<br />\
				If successful, they can also roll for "+conceptLink("Movement")+" tech.<br /><br />\
				If a launch occurs because an "+conceptLink("Alien Player")+"'s "+conceptLink("homeworld")+" is being beseiged, ships will be built right away. It also will never be a "+conceptLink("raider fleet")+", nor will Movement tech be bought.";
			break;
		case "fleet composition":
			displayTxt = "The "+conceptLink("ship")+"s that make up a given "+conceptLink("fleet")+".<br /><br />\
				As a process, an "+conceptLink("Alien Player")+" rolls to determine how ships are remotely built (after <q>priority builds</q>). \
				<br />&le;3: Largest fleet: Maximum number of ships\
				<br />4-6: Balanced: Maximum number of ships able to use entire "+conceptLink("Attack")+"/"+conceptLink("Defense")+" "+conceptLink("tech")+"\
				<br />7-10: Largest ships";
			break;
		case "expansion bank":
			displayTxt = conceptLink("Alien Player")+" bank that is usually used to aid in launching bigger "+conceptLink("expansion fleet")+"s.\
				<span class=\"bindTxt\">Can also be used to defend "+conceptLink("colonies")+".</span><br />\
				Can be accumulated only via converting excess "+conceptLink("CP")+" over the "+conceptLink("Defense")+" bank cap. (If any)";
			break;
		case "expansion fleet":
			displayTxt = conceptLink("Alien Player")+" "+conceptLink("fleet")+" that focuses on assaulting "+conceptLink("planet")+"s, \
				usually in an effort to "+conceptLink("capture")+" (if able).";
			break;
		case "extermination fleet":
			displayTxt = conceptLink("Alien Player")+" "+conceptLink("fleet")+" that focuses on taking a "+conceptLink("homeworld")+" \
				or the "+conceptLink("galactic capitol")+". If these fleets achieve their objective, their team wins the scenario.";
			break;
		case "hidden fleet":
			displayTxt = conceptLink("Alien Player")+"/"+conceptLink("AP Bot")+" "+conceptLink("fleet")+" whose composition is unidentified.\
				Once it enters "+conceptLink("battle")+", it uses its "+conceptLink("nanomachine")+"s to build the ships remotely.";
			break;
		case "nanomachine":
			headingTxt = "Nanomachine Technology";
			displayTxt = "Environment-exclusive technology that allows building ships remotely; whenever a given "+conceptLink("fleet")+" \
				first enters a "+conceptLink("battle")+". Rarely used by "+conceptLink("Raider fleet")+"s.<br /><br />\
				A fleet can use only the "+conceptLink("CP")+" that was assigned at the time of launch. Leftover CP post-construction is returned to the appropriate Fleet bank.";
			break;
		case "non-raider fleet":
			displayTxt = "Regular "+conceptLink("Alien Player")+" "+conceptLink("fleet")+" that contains uncloaked ships. They usually target the nearest "+conceptLink("colony")+", giving a slight preference to undefended targets.";
			if (useRuleset != "SE4X" && useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Expansion fleet")+"s and "+conceptLink("Extermination fleet")+"s also constitute non-raider fleets, but have unique targeting rules.";
			}
			break;
		case "raider fleet":
			displayTxt = conceptLink("Alien Player")+" "+conceptLink("fleet")+" that contains <i>only</i> cloaked "+conceptLink("Raider")+"s. \
				They strive to be sneaky, and avoid combat with superior fleets (in terms of "+conceptLink("CP")+" cost).";
			break;
			
		// Close Encounters concepts
		case "close encounters":
			displayTxt = "First expansion to "+conceptLink("Space Empires 4X")+".<br />\
				Adds "+conceptLink("titan")+" + "+conceptLink("boarding")+" + "+conceptLink("troops")+" "+conceptLink("tech")+", "+conceptLink("experience")+", \
				"+conceptLink("empire advantage")+"s, "+conceptLink("co-op")+", and "+conceptLink("space amoeba")+".";
			break;
		case "boarding":
			headingTxt = "Boarding Technology";
			displayTxt = conceptLink("Close Encounters")+" technology that allows building "+conceptLink("Boarding Ship")+"s. Level 2 improves boarding odds by 1 point.";
			break;
		case "black hole jumping":
			headingTxt = "Black Hole Jumping Technology";
			displayTxt = "Available only in non-competitive scenarios involving a "+conceptLink("galactic capitol")+", and only to their allies.";
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />Has 2 levels. "+conceptLink("Ship")+"s equipped with BHJ 1+ become immune to "+conceptLink("black hole")+"s. With BHJ 2, they can use them as "+conceptLink("warp point")+"s.";
			} else {
				displayTxt = displayTxt + "<br />Equipped "+conceptLink("ship")+"s become immune to "+conceptLink("black hole")+"s, instead treating them as "+conceptLink("warp point")+"s.";
			}
			displayTxt = displayTxt + "<br />Requires "+conceptLink("Movement")+" 3, or below Hard difficulty.";
			break;
		case "boarding ship":
			displayTxt = "Specialist ship designed to "+conceptLink("capture")+" enemy ships. Reduced to F1 versus immune targets. No benefit from "+conceptLink("Attack")+" tech";
			displayTxt = displayTxt + stats4X("Base", 12, "F5", 0, 2, -1, conceptLink("Boarding")+" 1");
			break;
		case "capturing":
			// Fall through
		case "capture":
			headingTxt = "Capture";
			displayTxt = conceptLink("Combat Ship")+"s and "+conceptLink("planet")+"s can be captured in the respective "+conceptLink("battle")+"s. \
				Whenever a compatible object gets captured, the victor is the new owner of said object";
			break;
		case "experience":
			displayTxt = conceptLink("Combat Ship")+" groups can gain experience from destroying enemy ships in a "+conceptLink("battle")+".\
				<br />The levels are: Green / Skilled / Veteran / Elite / Legendary.<br />\
				"+conceptLink("Ship Yard")+"s / "+conceptLink("Base")+"s / "+conceptLink("ground unit")+"s / "+conceptLink("Doomsday Machine")+"s / "+conceptLink("Space Amoeba")+"s \
				neither have a skill level <span class=\"bindTxt\">(always counts as equal sans "+conceptLink("Hull Size")+" modifiers)</span>, \
				nor do they award experience when destroyed.<br /><br />\
				Ships that have an experience advantage over an opposing group gain "+conceptLink("Attack")+" +1 (1 level advantage),<br />\
				effective "+conceptLink("Defense")+" +1 (2 level advantage), and can be untargetable (3 levels advantage).<br /><br />\
				Elite+ ships benefit from "+conceptLink("low maintenance")+". Legendary ships are one "+conceptLink("Hull Size")+" more durable.";
			break;
		case "facilities":
			// Fall through
		case "facility":
			displayTxt = "Ground structure that provide passive benefits. One can be built on any "+conceptLink("colony")+" that has produced income, costing 5 "+conceptLink("CP")+" to build.\
				<br />"+conceptLink("Close Encounters")+" introduced "+conceptLink("Research Center")+"s and "+conceptLink("Industrial Center")+"s.";
				
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("All Good Things")+" introduced "+conceptLink("Logistic Center")+"s and "+conceptLink("Temporal Center")+"s; \
					and allow "+conceptLink("homworld")+"s to have up to 2 facilities.";
			}
			break;
		case "fastmove":
			headingTxt = "Fastmove Technology";
			displayTxt = conceptLink("Close Encounters")+" technology that allows equipped compatible "+conceptLink("ship")+"s to move an extra hex,\
				on the first "+conceptLink("turn")+" of each "+conceptLink("economic phase")+";<br />\
				in addition to any "+conceptLink("movement")+" that would otherwise be normally allowed<br /><br />\
				Level 1: Compatible with "+conceptLink("Battlecruiser")+"s / "+conceptLink("Flagship")+"s / "+conceptLink("Unique Ship")+"s";
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />Level 2: Also compatible with "+conceptLink("Destroyer-X")+"s / \
					"+conceptLink("Battle Carrier")+"s / "+conceptLink("RaiderX")+"s (requires "+conceptLink("Advanced Construction")+" 1)"
			}
			break;
		case "flagship":
			displayTxt = "Players sometimes start a "+conceptLink("Close Encounters")+" game with one of these ships, but can <i>never</i> build more.";
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />Can be "+conceptLink("upgrade")+"d to "+conceptLink("Advanced Flagship")+" at "+conceptLink("Advanced Construction")+" 3.";
			}
			displayTxt = displayTxt + stats4X("Base", "&infin;", "B4", 1, 3);
			break;
		case "industrial center":
			displayTxt = conceptLink("Facility")+" that generates 5 extra "+conceptLink("CP")+".";
			break;
		case "military academy":
			displayTxt = conceptLink("Close Encounters")+" technology that improves the "+conceptLink("experience")+" system for "+conceptLink("ship")+"s.<br />\
				Level 1 causes newly built ships to start at Skilled. Level 2 makes <i>all</i> ships 10% easier to gain experience.";
			break;
		case "react move":
			displayTxt = "Ships equipped with "+conceptLink("Exploration")+" 2 can send in ships that have this ability to battle.\
				<br /><br />"+conceptLink("Movement")+" 3 grants this ability to \
					"+conceptLink("Scout")+"s, "+conceptLink("Destroyer")+"s, "+conceptLink("Cruiser")+"s, and "+conceptLink("Raider")+"s\
				<br />"+conceptLink("Movement")+" 4 also affects \
					"+conceptLink("Flagship")+"s, "+conceptLink("Battlecruiser")+"s, and "+conceptLink("Boarding Ship")+"s\
				<br />"+conceptLink("Movement")+" 5 also affects \
					"+conceptLink("Battleship")+"s, "+conceptLink("Carrier")+"s, "+conceptLink("Battle Carrier")+"s, "+conceptLink("Unique Ship")+"s, and "+conceptLink("Transport")+"s\
				<br />"+conceptLink("Movement")+" 6 also affects "+conceptLink("Dreadnought")+"s and "+conceptLink("Minesweeper")+"s";
			break;
		case "research center":
			displayTxt = conceptLink("Facility")+" that generates 5 "+conceptLink("RP")+" each "+conceptLink("economic phase")+".";
			break;
		case "rp":
			headingTxt = "Research Points (RP)";
			displayTxt = "Specialist monetary currency. "+conceptLink("Research Center")+" currency is spent exclusively to develop new "+conceptLink("technology")+".<br />\
				Resources spent on "+conceptLink("Unpredictable Research")+" rolls also contribute 1-10 RP to given tech level(s).\
				<br /><br />"+conceptLink("Space Amoeba")+" RP is a unique permanent resource. \
				Teams earn this resource by sending "+conceptLink("Minesweeper")+"s into their hexes. \
				<span class=\"bindTxt\">Specifications are learned at 10 RP.</span>\
				<br /><br />"+conceptLink("Replicator")+" RP is also a permanent resource, earned by completing objectives and encountering foreign technology.<br />\
				Whenever the required RP threshold is reached, a new design is simply unlocked.";
			break;
		case "security forces":
			displayTxt = conceptLink("Close Encounters")+" technology that makes "+conceptLink("ship")+"s resistant to boarding, \
				as if they were 1-2 "+conceptLink("Hull Size")+"s larger (depending on level). Applied instantly to <i>all</i> ships once developed.";
			break;
		case "titan":
			displayTxt = "Extremely potent <q>baseship</q>. Can carry 3 "+conceptLink("Fighter")+"s if upgraded.\
				Deals <b>2</b> damage per hit. Can instantly destroy "+conceptLink("planet")+"s.<br />Immune to "+conceptLink("Boarding Ship")+"s. \
				Resistant to "+conceptLink("Mines")+" and "+conceptLink("Fleet Size Bonus")+". \
				Weak to "+conceptLink("Fighter")+"s. Unable to "+conceptLink("retreat")+" or be "+conceptLink("screen")+"ed.\
				" + stats4X("Base", 32, "A7", 3, 5) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 7";
			break;
			
		// Troops concepts
		case "transport":
			if (useRuleset == "talon") {
				headingTxt = "Transport";
				displayTxt = "Utility ship, able to land on "+conceptLink("planet")+"s whenever a scenario calls for it.<br />";
				displayTxt = displayTxt + statsTalon("Terran", 32, "No weapons", "4/4/4/4", 4);
				displayTxt = displayTxt + statsTalon("Talon", 36, "No weapons", "5/4/4/3", 4);
			} else {
				if (useRuleset == "AGT") {
					headingTxt = "Cargo Transport";
					displayTxt = "Utility "+conceptLink("combat ship")+", able to pick up 6 "+conceptLink("ground unit")+"s and/or "+conceptLink("fighter")+"s; or up to 30 "+conceptLink("LP")+" worth of crates";
				} else {
					headingTxt = "Troop Transport";
					displayTxt = "Utility "+conceptLink("combat ship")+", able to pick up 6 "+conceptLink("ground unit")+"s from friendly "+conceptLink("colonies")+" and use them to invade enemy colonies";
				}
				displayTxt = displayTxt + stats4X("Common", 6, "E1", 1, 1, -1, conceptLink("Troops")+" 1");
			}
			break;
		case "drop ships":
			displayTxt = "Upgraded "+conceptLink("Transport")+"s with this ability have "+conceptLink("Defense")+" +1. \
				Additionally, "+conceptLink("ground unit")+"s dropped in order to invade a "+conceptLink("colony")+" can shoot right away.";
			break;
		case "ground unit":
			headingTxt = "Ground unit";
			displayTxt = "Small ground-borne craft used by "+conceptLink("Transport")+"s to \
				invade enemy "+conceptLink("colonies")+" in a ground "+conceptLink("battle")+" \
				<span class=\"bindTxt\">(and attempt to "+conceptLink("capture")+" them)</span>; or to defend friendly colonies.<br />\
				1-3 non-"+conceptLink("militia")+" ground units grant the planet a Defense of 1 in a "+conceptLink("bombard")+"ment round. \
				4 or more units Defense 2.";
			break;
		case "troops":
			displayTxt = conceptLink("Close Encounters")+" technology that allows building "+conceptLink("ground unit")+"s.<br />\
				Level 1: Allows "+conceptLink("Light Infantry")+" and "+conceptLink("Transport")+"s (researched at start)<br />\
				Level 2: Allows "+conceptLink("Space Marines")+" and "+conceptLink("Heavy Infantry")+"<br /> \
				Level 3: Allows "+conceptLink("Grav Armor")+". \
					Also allows building/upgrading "+conceptLink("Transport")+"s with the "+conceptLink("Drop Ships")+" ability.";
			break;
		case "militia":
			displayTxt = "Temporary "+conceptLink("ground unit")+"; granted whenever a colony is in a ground "+conceptLink("battle")+", \
				at a rate of 1 militia per 1 CP income.\
					" + stats4X("Common", 0, "E5", 0, 1);
			break;
		case "light infantry":
			displayTxt = "Basic "+conceptLink("ground unit") + stats4X("Common", 2, "D5", 1, 1)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 1";
			break;
		case "space marines":
			displayTxt = "Offensive oriented "+conceptLink("ground unit")+". \
				Gains boosted "+conceptLink("Attack")+" rating when used to invade a "+conceptLink("colony")+"\
				"+stats4X("Common", 3, "C6 / D5", 1, 2, -1, conceptLink("Troops")+" 2");
			break;
		case "heavy infantry":
			displayTxt = "Defensive oriented "+conceptLink("ground unit")+". \
				Gains boosted "+conceptLink("Attack")+" rating when used to defend a "+conceptLink("colony")+"\
				"+stats4X("Common", 3, "D4 / C6", 2, 2, -1, conceptLink("Troops")+" 2");
			break;
		case "grav armor":
			displayTxt = "Powerful support "+conceptLink("ground unit")+". \
				At the start of each "+conceptLink("round")+", each uncontested Grav Armor is able to support another ground unit with +1/+1.\
				"+stats4X("Common", 4, "C6", 2, 2, -1, conceptLink("Troops")+" 3");
			break;
			
		// Space Amoebas
		case "amoeba":
			// Fall through
		case "space amoeba":
			displayTxt = amoebaBase(null);
			break;
		case "sa?":
			displayTxt = amoebaBase("?");
			break;
		case "sa1":
			displayTxt = amoebaBase(1) + stats4X("Boss", 0, "C7", 1, 1, 2);
			break;
		case "sa2":
			displayTxt = amoebaBase(2) + stats4X("Boss", 0, "D6", 2, 2, 2);
			break;
		case "sa3":
			displayTxt = amoebaBase(3) + stats4X("Boss", 0, "A7", 2, 2, 2)+"<br /><b>Special</b>: Immunity to "+conceptLink("Fighter")+"s nullified";
			break;
		case "sa4":
			displayTxt = amoebaBase(4) + stats4X("Boss", 0, "A7 / A5", "2 / 1", 2, 2)+"<br /><b>Special</b>: Strength is reduced when in "+conceptLink("battle")+" with only "+conceptLink("Raider")+"s";
			break;
		case "sa5":
			displayTxt = amoebaBase(5) + stats4X("Boss", 0, "B5", 1, 2, 2)+"<br /><b>Special</b>: Starts with <i>2</i> "+conceptLink("swallow")+" rolls per "+conceptLink("round");
			break;
		case "sa6":
			// Fall through
		case "sa7":
			displayTxt = amoebaBase(concept.substr(2)) + stats4X("Boss", 0, "A7", 2, 2, 2)+"<br />\
				<b>Special</b>: If in battle with three different types of ships, those ships gain "+conceptLink("Attack")+" +1 each "+conceptLink("round")+" while true";
			break;
		case "sa8":
			// Fall through
		case "sa9":
			// Fall through
		case "sa10":
			displayTxt = amoebaBase(concept.substr(2));
			break;
		case "swallow":
			headingTxt = "Swallowing";
			displayTxt = conceptLink("Space Amoeba")+" will swallow ships whole whenever they would otherwise damage a ship, \
				at the expense of their "+conceptLink("Attack")+" being further reduced for each "+conceptLink("Hull Size")+" beyond 1. (with the maximum reduction at Hull Size 3.)<br /><br />\
				In addition, for <em>each</em> successful swallow that is achieved by 2 or more under the threshold, it gains a chained swallow roll for the "+conceptLink("round")+".";
			break;
			
		// Alien Technologies
		case "alien technologies":
			// Fall through
		case "alien technology":
			headingTxt = "Alien Technology";
			displayTxt = "Smaller empire-wide traits that affect an entire empire. Acquired when a "+conceptLink("barren planet")+" had their "+conceptLink("non-player alien")+"s eliminated \
				<span class=\"bindTxt\">(assuming no "+conceptLink("Amazing Diplomats")+")</span>, and then colonized or "+conceptLink("capture")+"d. \
				Existing "+conceptLink("colonies")+" and "+conceptLink("ship")+"s benefit instantly.<br /><br />\
				If playing without NPAs, then this technology can be bought when first colonizing a "+conceptLink("deep space")+" barren planet, at the cost of 10 "+conceptLink("CP")+".";
			break;
		case "soylent purple":
			displayTxt = conceptLink("Scout")+"s and "+conceptLink("Destroyer")+"s benefit from "+conceptLink("low maintenance")+".";
			break;
		case "anti-matter warhead":
			headingTxt = "Anti-Matter Warhead";
			displayTxt = conceptLink("Destroyer")+"s have "+conceptLink("Attack")+" +1, on top of any installed "+conceptLink("technology")+".";
			break;
		case "interlinked targeting computer":
			displayTxt = conceptLink("Destroyer")+"s' "+conceptLink("Attack")+" bonus from "+conceptLink("technology")+" is not limited by "+conceptLink("Hull Size")+".";
			break;
		case "polytitanium alloy":
			displayTxt = conceptLink("Destroyer")+"s cost 2 less "+conceptLink("CP")+" to build.";
			break;
		case "long lance torpedo":
			displayTxt = conceptLink("Destroyer")+"s fight at "+conceptLink("Weapon Class")+" B, while outside "+conceptLink("asteroids")+" and "+conceptLink("nebula")+"e. Overrides "+conceptLink("Longbowmen");
			break;
		case "central computer":
			displayTxt = conceptLink("Cruiser")+"s and "+conceptLink("Battlecruiser")+"s benefit from "+conceptLink("low maintenance")+".";
			break;
		case "resupply depot":
			displayTxt = conceptLink("Battleship")+"s and "+conceptLink("Dreadnought")+"s benefit from "+conceptLink("low maintenance")+".";
			break;
		case "holodeck":
			displayTxt = "<b class=\"headOx\">Holodeck</b><br />"+conceptLink("Carrier")+"s and "+conceptLink("Fighter")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "cold fusion drive":
			displayTxt = conceptLink("Raider")+"s and "+conceptLink("Minesweeper")+"s benefit from "+conceptLink("low maintenance")+".";
			break;
		case "emissive armor":
			displayTxt = conceptLink("Cruiser")+"s require 1 more damage to be destroyed.";
			break;
		case "electronic warfare module":
			displayTxt = conceptLink("Cruiser")+"s have "+conceptLink("Attack")+" +1, on top of any installed "+conceptLink("technology")+".";
			break;
		case "microwarp drive":
			displayTxt = conceptLink("Battlecruiser")+"s have "+conceptLink("Attack")+" +1, on top of any installed "+conceptLink("technology")+".";
			break;
		case "combat sensors":
			displayTxt = conceptLink("Battleship")+"s have "+conceptLink("Attack")+" +1, on top of any installed "+conceptLink("technology")+".";
			break;
		case "afterburner":
			headingTxt = "Afterburners";
			if (useRuleset == "talon") {
				displayTxt = "Some "+conceptLink("ship")+"s have this feature, \
					usable at any point whenever they would otherwise not move on a given "+conceptLink("impulse")+". Does not replenish.";
			} else {
				displayTxt = conceptLink("Fighter")+"s have "+conceptLink("Attack")+" +1 whenever they shoot at a ship with "+conceptLink("Hull Size")+" 1 or less \
					(after applying "+conceptLink("Giant Race")+" / "+conceptLink("Insectoids")+" modifiers).";
			}
			break;
		case "photon bomb":
			displayTxt = conceptLink("Fighter")+"s have "+conceptLink("Attack")+" +1 whenever they shoot at a ship with "+conceptLink("Hull Size")+" 2 or more \
				(after applying "+conceptLink("Giant Race")+" / "+conceptLink("Insectoids")+" modifiers).";
			break;
		case "stim packs":
			displayTxt = conceptLink("Ground Unit")+"s have "+conceptLink("Attack")+" +1.";
			break;
		case "improved crew quarters":
			displayTxt = conceptLink("Cruiser")+"s cost 3 less "+conceptLink("CP")+" to build.";
			break;
		case "phased warp coil":
			displayTxt = conceptLink("Battlecruiser")+"s cost 3 less "+conceptLink("CP")+" to build.";
			break;
		case "advanced ordinance storage system":
			// Fall thru. How in Alpha did this get past Q&A?
		case "advanced ordnance storage system":
			displayTxt = conceptLink("Battleship")+"s cost 4 less "+conceptLink("CP")+" to build.";
			break;
		case "the captain's chair":
			displayTxt = conceptLink("Dreadnought")+"s cost 4 less "+conceptLink("CP")+" to build.";
			break;
		case "efficient factories":
			displayTxt = conceptLink("Colonies")+" that have a natural production of 5 "+conceptLink("CP")+" produce 1 additional CP per "+conceptLink("economic phase")+".";
			break;
		case "omega crystals":
			displayTxt = "Equipped on "+conceptLink("CA")+"s/"+conceptLink("BC")+"s/"+conceptLink("BB")+"s/"+conceptLink("DN")+"s/"+conceptLink("Titan")+"s. \
				Usable once per "+conceptLink("battle")+", this ability forces an <i>entire</i> group to reroll all of their dice.";
			break;
		case "cryogenic stasis pods":
			displayTxt = conceptLink("Boarding Ship")+"s and "+conceptLink("Transport")+"s benefit from "+conceptLink("low maintenance")+".";
			break;
		case "minesweep jammer":
			displayTxt = conceptLink("Minesweeper")+"s used against the holder are one level less in effectiveness. Reducible to level 0 (0 mines per sweeper).";
			break;
		case "air support":
			displayTxt = conceptLink("Transport")+"s are usable in ground "+conceptLink("battle")+"s, but are unable to be used to "+conceptLink("capture")+" a "+conceptLink("planet")+".\
				"+stats4X("Base", 0, "B6", 2, 2);
			break;
		case "hidden turret":
			displayTxt = conceptLink("Minesweeper")+"s have natural "+conceptLink("Attack")+" E3.";
			break;
		case "stealth field emitter":
			displayTxt = "Victorious ships are immediately un-revealed after "+conceptLink("battle")+".";
			break;
		case "advanced comm array":
			displayTxt = "Ships can "+conceptLink("React Move")+" into a "+conceptLink("hex")+" an opponent moved ships into, as if it was a "+conceptLink("battle")+" hex, \
				at the expense of the reacting player being considered the attacker if there would otherwise be no battle.";
			break;
		case "mobile analysis bay":
			displayTxt = "New "+conceptLink("technology")+" can be acquired from any captured ship \
				in any "+conceptLink("economic phase")+" without having to scrap them. Usable once per captured ship.";
			break;
		case "adaptive cloaking device":
			displayTxt = conceptLink("Raider")+"s gain "+conceptLink("Attack")+" +2 <span class=\"bindTxt\">(instead of +1)</span> in the first round if not detected.<br />\
				Even if detected, Raiders fire at "+conceptLink("Weapon Class")+" A during "+conceptLink("round")+" 1; \
				Class B during round 2; C during round 3; D afterwards.";
			break;
		case "on board workshop":
			displayTxt = conceptLink("Carrier")+"s, "+conceptLink("Battle Carrier")+"s, and "+conceptLink("Titan")+"s can build one "+conceptLink("Fighter")+" \
				per "+conceptLink("economic phase")+", and "+conceptLink("upgrade")+" one Fighter per "+conceptLink("turn")+".";
			break;
		case "superhighway":
			displayTxt = "Each ship that spends its entire "+conceptLink("movement")+" capacity following a "+conceptLink("Pipeline")+" network can move 2 additional hexes, instead of just 1.";
			break;
			
		// Empire Advantages
		case "empire advantage":
			displayTxt = "Powerful asymmetrical trait that affects an entire empire. Acquired during scenario setup. Introduced in "+conceptLink("Close Encounters")+".";
			break;
		case "fearless race":
			displayTxt = "For the first "+conceptLink("round")+" of each "+conceptLink("battle")+", \
				this empire's "+conceptLink("combat ship")+"s (excluding "+conceptLink("boarding ship")+"s) shoot at "+conceptLink("Weapon Class")+" A;\
				<br />at the expense of being prohibited from "+conceptLink("retreat")+"ing until after round 3.";
			break;
		case "warrior race":
			displayTxt = conceptLink("Attack")+" +1 to non-boarding "+conceptLink("combat ship")+"s in each "+conceptLink("battle")+", \
				where this empire is the attacker. Attack -1 for each battle as the defender.";
			break;
		case "celestial knights":
			displayTxt = "Once per space "+conceptLink("battle")+", at the start of any "+conceptLink("round")+" after the first; \
				this empire may declare a <q>charge</q>, giving <i>each</i> mobile "+conceptLink("combat ship")+" 2 rolls.<br />\
				In return; enemy ships get "+conceptLink("Attack")+" +1 <i>each</i> round after the charge, \
				and the charging empire may not "+conceptLink("retreat")+" until 2 rounds after the charge";
			break;
		case "giant race":
			displayTxt = "All non-"+conceptLink("Decoy")+" ships are built and managed as if they were one "+conceptLink("Hull Size")+" more. \
				<span class=\"bindTxt\">May never develop "+conceptLink("Fighter")+" tech</span>";
			break;
		case "industrious race":
			displayTxt = conceptLink("Terraforming")+" 1 also allows colonizing "+conceptLink("Asteroids")+". \
				Such "+conceptLink("colonies")+" are immune to "+conceptLink("Titan")+"s and invading "+conceptLink("ground unit")+"s,<br />\
				but grant neither Colony "+conceptLink("VP")+"s nor "+conceptLink("alien technology")+".";
			break;
		case "ancient race":
			displayTxt = "A limited subset of the systems near the "+conceptLink("homeworld")+" (all adjacent "+conceptLink("hex")+"es, plus &le;6 more at distance 2) are explored at scenario start. \
				<span class=\"bindTxt\">Up to 3 non-"+conceptLink("barren")+" "+conceptLink("planet")+"s</span> are pre-colonized (at 0 income), \
				and up to 3 "+conceptLink("minerals")+" are automatically relocated to the "+conceptLink("homeworld")+".";
			break;
		case "space pilgrims":
			displayTxt = "Empire's ships are unaffected by "+conceptLink("Asteroids")+", "+conceptLink("Nebula")+", \
				"+conceptLink("Black Hole")+"s, and "+conceptLink("Lost in Space")+" markers when moving; \
				even when using a "+conceptLink("slingshot")+".";
			break;
		case "hive mind":
			displayTxt = "Empire adapts to their opponents. Starting at "+conceptLink("round")+" 2 of each "+conceptLink("battle")+", \
				all ships get "+conceptLink("Defense")+" +1. Round 4 "+conceptLink("Attack")+" +1. Round 6 "+conceptLink("Hull Size")+" +1.";
			break;
		case "nano-technology":
			displayTxt = "Ships can choose to "+conceptLink("upgrade")+" anywhere for free. Must still not move for a "+conceptLink("turn")+" to carry out the upgrades.";
			break;
		case "quick learners":
			displayTxt = "Empire starts with "+conceptLink("Military Academy")+" 1. 2 dice are rolled instead of 1 (taking the best result) when rolling for "+conceptLink("experience")+" gain.";
			break;
		case "gifted scientists":
			displayTxt = "Technologies cost 33% less "+conceptLink("CP")+", at the expense of <i>all</i> ships costing 1 more CP to build.";
			break;
		case "master engineers":
			displayTxt = "Ships may choose to move 1 more "+conceptLink("hex")+" than granted by "+conceptLink("Movement")+" tech for each "+conceptLink("turn")+", \
				but must roll for engine instability if they do so.<br />On a roll of &ge;9, the ship is immobilized from engine failure for the offending turn.";
			break;
		case "insectoids":
			displayTxt = "All non-"+conceptLink("Decoy")+" ships are built and managed as if they were one "+conceptLink("Hull Size")+" less; \
				except that Size 0 ships require 0.5 "+conceptLink("Ship Yard")+" capacity.<br />\
				May never develop "+conceptLink("Fighter")+" or "+conceptLink("Military Academy")+" tech.";
			break;
		case "immortals":
			displayTxt = "Once per "+conceptLink("round")+", 1 point of damage can be ignored; at the expense of "+conceptLink("Colony Ship")+"s requiring 2 "+conceptLink("CP")+" more to build.<br />\
				May never develop "+conceptLink("Boarding")+" tech. Starts with 0 CP regardless of "+conceptLink("Head Start")+" or "+conceptLink("Empire Advantage")+" bidding. \
				<span class=\"bindTxt\">(before applying bonus from "+conceptLink("replicators")+")</span>";
			break;
		case "expert tacticians":
			displayTxt = "Empire gains "+conceptLink("Fleet Size Bonus")+" if they outnumber their opponent at all. Opponents do not gain FSB until they outnumber this empire 3:1.";
			break;
		case "horsemen of the plains":
			displayTxt = "Empire's "+conceptLink("combat ships")+" can also choose to "+conceptLink("retreat")+" in between "+conceptLink("round")+"s. \
				Also "+conceptLink("bombard")+"s "+conceptLink("colonies")+" with "+conceptLink("Attack")+" +2.";
			break;
		case "and we still carry swords":
			displayTxt = "Empire starts with "+conceptLink("Troops")+" 2. Their boarding attacks gain +1. Boarding attacks against them get -1.<br />\
				All "+conceptLink("ground unit")+"s gain "+conceptLink("Attack")+" +1 "+conceptLink("Defense")+" +1.";
			break;
		case "amazing diplomats":
			displayTxt = conceptLink("Non-Player Alien")+"s and the empire are friendly, as if playing with "+conceptLink("Blood Brothers")+".";
			
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt =  displayTxt + "<br /><br />Exists as both an "+conceptLink("empire advantage")+" (affects <i>all</i> NPA "+conceptLink("planet")+"s) \
					and as a "+conceptLink("resource card")+" (affects <b>1</b> NPA planet, playable when first visited).<br />\
					If both effects are combined by one empire, then the NPA planet in question instead grants the user a full "+conceptLink("colony")+".<br />\
					Each planet can be friendly only to one empire; first come first serve." + discardVal(4);
			}
			break;
		case "traders":
			displayTxt = conceptLink("Pipeline")+"-connected "+conceptLink("colonies")+" produce an extra +1 "+conceptLink("CP");
			break;
		case "cloaking geniuses":
			displayTxt = conceptLink("Scout")+"s and "+conceptLink("Destroyer")+"s benefit from "+conceptLink("Cloaking")+" 1+. "+conceptLink("Cruiser")+"s benefit from "+conceptLink("Cloaking")+" 2.";
			break;
		case "star wolves":
			displayTxt = "Empire's "+conceptLink("Scout")+"s, "+conceptLink("Destroyer")+"s, and "+conceptLink("Fighter")+"s \
				have "+conceptLink("Attack")+" +1 whenever they shoot at a ship with at least "+conceptLink("Hull Size")+" 2.<br />\
				"+conceptLink("Destroyer")+"s also cost 1 less CP.";
			break;
		case "power to the people":
			displayTxt = "Empire's "+conceptLink("Minelayer")+"s, "+conceptLink("Colony Ship")+"s, "+conceptLink("Miner")+"s, and "+conceptLink("Pipelines")+"s \
				instantly "+conceptLink("upgrade")+" their "+conceptLink("Movement")+" "+conceptLink("technology")+".";
			break;
		case "house of speed":
			displayTxt = "Empire starts with "+conceptLink("Movement")+" 7, at the expense of their mobile ships getting "+conceptLink("Defense")+" -2.<br />\
				May never develop "+conceptLink("Cloaking")+" tech. Captured "+conceptLink("Raider")+"s are usable, but their "+conceptLink("Movement")+" equipment may not be upgraded.";
			break;
		case "powerful psychics":
			displayTxt = "Empire starts with "+conceptLink("Exploration")+" 1. Additionally, they can remotely reveal enemy stacks (but not tech) \
				in an adjacent "+conceptLink("hex")+", as if those enemies were sent to "+conceptLink("battle")+".";
			break;
		case "shape shifters":
			displayTxt = "Empire can use any "+conceptLink("combat ship")+" group as if they were "+conceptLink("Decoy")+"s. \
				Such groups can even enter a "+conceptLink("battle")+", but are eliminated if they take or deal any damage.";
			break;
		case "on the move":
			displayTxt = conceptLink("Ship Yard")+"s and "+conceptLink("Base")+"s have fixed "+conceptLink("Movement")+" 1. These ships still may never "+conceptLink("retreat")+". \
				"+conceptLink("Ship")+" construction still can only take place at a "+conceptLink("colony")+".";
			break;
		case "longbowmen":
			displayTxt = "Empire's ships (except for "+conceptLink("Fighter")+"s) fight as if they were one "+conceptLink("Weapon Class")+" greater, \
				while outside of "+conceptLink("asteroids")+" and "+conceptLink("nebula")+".";
			break;
		// Replicator Advantages
		case "fast replicators":
			displayTxt = conceptLink("Replicators")+" start with an extra "+conceptLink("Movement")+" level. Subsequent levels cost 15 "+conceptLink("CP")+" (down from 20 CP).";
			break;
		case "green replicators":
			displayTxt = conceptLink("Replicator")+" "+conceptLink("colonies")+" last 3 "+conceptLink("economic phase")+"s longer before they begin to "+conceptLink("deplete")+".";
			break;
		case "improved gunnery":
			displayTxt = conceptLink("Type Flag")+" + "+conceptLink("Type XIII")+" + "+conceptLink("Type XV")+" ships are equipped with "+conceptLink("Second Salvo")+". \
				"+conceptLink("Type V")+" ships gain "+conceptLink("Attack")+" +1.<br />\
				Additionally, upon collecting 4 "+conceptLink("RP")+", all ships gain 1 additional "+conceptLink("Tactics")+".";
			break;
		case "advanced research":
			displayTxt = conceptLink("Replicators")+" begin the game with one [additional] "+conceptLink("RP")+". \
				Additionally, subsequent "+conceptLink("RP")+" require 25 "+conceptLink("CP")+" (down from 30 CP).";
			break;
		case "replicator capitol":
			displayTxt = "The "+conceptLink("Replicator")+" "+conceptLink("homeworld")+" produces an extra "+conceptLink("hull")+" each odd "+conceptLink("economic phase")+". \
				Empire also starts with 10 extra "+conceptLink("CP")+".";
			break;
			
		// Unique ship-exclusive concepts
		case "unique ship":
			displayTxt = "Fully customizable "+conceptLink("combat ship")+" whose specifications are completely up to the designer";
			break;
		case "mini-fighter bay":
			headingTxt = "Mini-Fighter Bay";
			displayTxt = "Allows the "+conceptLink("Unique Ship")+" to carry 1 "+conceptLink("Fighter")+"s with it";
			break;
		case "anti-sensor hull":
			headingTxt = "Anti-Sensor Hull";
			displayTxt = "Allows the "+conceptLink("Unique Ship")+" to be optionally immune to "+conceptLink("mines");
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />"+conceptLink("Battle Carrier")+"s are also equipped with this perk.";
			}
			break;
		case "shield projector":
			displayTxt = "Allows the "+conceptLink("Unique Ship")+" (and other equipped "+conceptLink("ship")+"s) to protect a friendly "+conceptLink("combat ship")+", allowing its mate to fire without fear of being targeted.";
			break;
		case "design weakness":
			displayTxt = "The "+conceptLink("Unique Ship")+" is weak to one of three types ("+conceptLink("Scout")+" / "+conceptLink("Destroyer")+" / "+conceptLink("Cruiser")+"),\
				partially chosen at random.<br />That type gets "+conceptLink("Attack")+" +2 against this ship for the design's lifespan.<br />\
				In return, build cost is reduced by 1-2 "+conceptLink("CP")+", depending on the cost of the rest of the design.";
			break;
		case "construction bay":
			displayTxt = "Allows the "+conceptLink("Unique Ship")+" to contribute to "+conceptLink("Ship Yard")+" capacity while stationed at a "+conceptLink("colony")+".\
				<br />Counts against the 1 new SY per "+conceptLink("colony")+" per "+conceptLink("economic phase")+", while also requiring existing SY capacity.";
			break;
		case "tractor beam":
			displayTxt = "Allows the "+conceptLink("Unique Ship")+" (and other equipped "+conceptLink("ship")+"s) to pull an enemy "+conceptLink("combat ship")+" to it each "+conceptLink("round")+", \
				prohibiting the victim from "+conceptLink("retreat")+"ing.";
			break;
		case "warp gates":
			displayTxt = "Two "+conceptLink("Unique Ship")+"s within 3 "+conceptLink("hex")+"es of each other are considered connected (1 hex apart). \
				Supporting craft may use only one warp gate per "+conceptLink("turn")+".";
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br /><br />"+conceptLink("Type Exp")+"s and the "+conceptLink("Type Flag")+" gain this perk if \
				the "+conceptLink("Replicators")+" have the matching "+conceptLink("Empire Advantage")+"; \
				and their Type Exps count as one "+conceptLink("hull")+" for construction/conversion purposes.";
			}
			break;
		case "second salvo":
			displayTxt = "The first time a "+conceptLink("Unique Ship")+" hits its victim in a "+conceptLink("round")+", it gets to shoot again towards the same hull type.";
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />Also available to the largest "+conceptLink("Improved Gunnery")+" "+conceptLink("Replicator")+" ships.";
			}
			break;
		case "heavy warheads":
			displayTxt = conceptLink("Unique Ship")+"s' minimum "+conceptLink("Attack")+" rating increased to 2, after "+conceptLink("Defense")+" modifiers.\
				<br />(Against a "+conceptLink("Titan")+", the minimum Attack is instead 1. Against a "+conceptLink("DM")+", minimum Attack is still 0.)";
			if (useRuleset == "rep" || useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />"+conceptLink("Destroyer-X")+"es are also equipped with this perk.";
			}
			break;
			
		// Replicators concepts (and goodies for regular players)
		case "replicator":
			// Fall through
		case "replicators":
			headingTxt = "Replicators";
			displayTxt = "Second expansion to "+conceptLink("Space Empires 4X")+". Adds the titular unique faction,<br />\
				"+conceptLink("space pirate")+"s, "+conceptLink("fold in space")+" + "+conceptLink("regional map")+" terrain, "+conceptLink("Advanced Construction")+", and "+conceptLink("resource card")+"s.";
			break;
		case "replicator solitaire":
			displayTxt = "Solo scenario that pits the human player against the "+conceptLink("Replicator")+" <q>environment</q> on a 2-player "+conceptLink("versus map")+". \
				<span class=\"bindTxt\">Last "+conceptLink("homeworld")+" standing wins.</span>";
			break;
		case "space pirate":
			// Fall through
		case "pirate":
			headingTxt = "Space Pirate";
			displayTxt = "Non-aligned ship that can be fought or hired by any ships that encounter them.<br />\
				Has fixed "+conceptLink("Movement")+" 4 and "+conceptLink("Fastmove")+". Automatically "+conceptLink("self-destruct")+"s when "+conceptLink("capture")+"d. \
				" + stats4X("Alien", 10, "A5", 0, 1, 0);
			break;
		case "anti-replicator":
			headingTxt = "Anti-Replicator Technology";
			displayTxt = "Allows equipped "+conceptLink("Transports")+" to finish off a "+conceptLink("Replicator")+" "+conceptLink("colony")+" that is already at minimal strength.";
			break;
		case "advanced construction":
			displayTxt = conceptLink("Replicators")+" technology that adds a variety of design variants and upgrades. \
				Requires building a "+conceptLink("ship")+" with at least "+conceptLink("Ship Size")+" 4.\
				<br /><br />Level 1: Allows building "+conceptLink("Destroyer-X")+"es, developing "+conceptLink("Attack")+" 4, and upgrading \
					"+conceptLink("Base")+"s/"+conceptLink("Battleship")+"s/"+conceptLink("Dreadnought")+"s\
				<br />Level 2: Allows building "+conceptLink("Fighter")+"s Lv 4, "+conceptLink("Battle Carrier")+"s, and "+conceptLink("Miner-X")+"es\
				<br />Level 3: Allows building "+conceptLink("Raider-X")+"es and "+conceptLink("Scout-X")+"es, and upgrading "+conceptLink("Flagship")+"s";
			break;
		case "destroyer-x":
			// Fall through
		case "ddx":
			headingTxt = "Destroyer-X (DDX)";
			if (useRuleset == "talon") {
				displayTxt = "Improved "+conceptLink("Destroyer")+" variant that adds more weapons<br />";
				displayTxt = displayTxt + statsTalon("Terran", 68, "Anti-Matter Torpedo x2", "4/3/3/3", 4);
				displayTxt = displayTxt + statsTalon("Talon", 55, "Disruptor + Missile Launcher x2", "5/2/2/2", 4);
			} else {
				displayTxt = conceptLink("Destroyer")+" variant, equipped with "+conceptLink("Heavy Warheads")+", \
					and able to benefit from "+conceptLink("Fastmove")+" 2 technology, and also equip +2/+2\
					<br /><b>Required Techs</b>: "+conceptLink("Ship Size")+" 2 and "+conceptLink("Advanced Construction")+" 1";
			}
			break;
		case "battle carrier":
			headingTxt = "Battle Carrier";
			displayTxt = "Heavy "+conceptLink("Carrier")+" variant, equipped with "+conceptLink("Anti-Sensor Hull")+"s, \
				and able to carry 6 "+conceptLink("Fighter")+"s and benefit from "+conceptLink("Fastmove")+" 2 technology\
				"+ stats4X("Base", 20, "B5", 1, 3) + "<br /><b>Required Techs</b>: "+conceptLink("Fighter")+" 1 and "+conceptLink("Advanced Construction")+" 2";
			break;
		case "miner-x":
			headingTxt = "Miner-X";
			displayTxt = conceptLink("Miner")+" variant that benefits from "+conceptLink("Movement")+" technology and automatically "+conceptLink("upgrade")+"s its equipment\
				<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 2";
			break;
		case "raider-x":
			headingTxt = "Raider-X";
			displayTxt = conceptLink("Raider")+" hybrid that can carry 1 "+conceptLink("ground unit")+" \
				and able to benefit from "+conceptLink("Fastmove")+" 2 technology, and also equip +3/+3\
				<br /><b>Required Techs</b>: "+conceptLink("Cloaking")+" 1 + "+conceptLink("Advanced Construction")+" 3";
			break;
		case "scout-x":
			headingTxt = "Scout-X";
			displayTxt = conceptLink("Scout")+" variant that is equipped with "+conceptLink("Movement")+" level + 3 (max level 7)\
				<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 3";
			break;
		case "advanced flagship":
			displayTxt = "Upgraded "+conceptLink("Flagship")+" that can use any single "+conceptLink("Unique Ship")+" ability, in addition to standard equipment.\
				" + stats4X("Base", "&infin;", "A5", 3, 3, -1, conceptLink("Advanced Construction")+" 3");
			break;
			
		// Resource cards
		case "resource card":
			displayTxt = "Introduced in "+conceptLink("Replicators")+", these cards have unique effects when played; or can be discarded to gain "+conceptLink("CP")+", or possibly even "+conceptLink("cancel")+" other cards.<br />\
				One card may be optionally drawn each "+conceptLink("economic phase")+" from the empire's own stock. There are no redeals.";
			break;
		case "cancel":
			// Fall thru
		case "cancel card":
			headingTxt = "Cancel Card";
			displayTxt = "Card that can be discarded to negate almost any "+conceptLink("resource card")+" that has been played for its unique effects.<br />\
				"+conceptLink("Replicators")+" introduced "+conceptLink("Red Squadron")+"/"+conceptLink("Sensor Blind Spot")+"/"+conceptLink("Self-Destruct")+"/"+conceptLink("Concealed Minefield")+" as cancel cards.";
			break;
		case "red squadron":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and "+conceptLink("round")+" 1)<br />\
				One "+conceptLink("Fighter")+" group gets "+conceptLink("Attack")+" +1 for the entire battle. Also usable as a "+conceptLink("cancel card")+". " + discardVal(4,2);
			break;
		case "sensor blind spot":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and "+conceptLink("round")+" 1)<br />\
				One cloaking ship that was nullified by "+conceptLink("Scanning")+" may hide in the blind spot of another ship with "+conceptLink("Hull Size 3")+"+,<br />\
				causing an immediate "+conceptLink("retreat")+" to <i>any</i> "+conceptLink("hex")+". Also usable as a "+conceptLink("cancel card")+". " + discardVal(4,2);
			break;
		case "self-destruct":
			headingTxt = "Self-Destruct";
			displayTxt = "(Play when a ship gets "+conceptLink("capture")+"d. "+conceptLink("Pirate")+"s have this as a triggered ability.)<br />\
				The ship immediately detonates, denying the victor knowledge of anything other than rolling for "+conceptLink("experience")+". \
				Also usable as a "+conceptLink("cancel card")+". " + discardVal(4,2);
			break;
		case "concealed minefield":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and mine"+conceptLink("sw")+"eeping)<br />\
				One "+conceptLink("minelayer")+"'s ammo can trigger its detonation early, against <i>any</i> craft. Also usable as a "+conceptLink("cancel card")+". " + discardVal(4,2);
			break;
		case "heroic":
			displayTxt = "Granted by a corresponding "+conceptLink("Heroic Ships")+" card, these ships gain an additional \
				"+conceptLink("Attack")+" +1, "+conceptLink("Defense")+" +1, are durable as if they have "+conceptLink("Hull Size")+" +1, and require no "+conceptLink("maintenance")+".";
			break;
		case "heroic ships":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and "+conceptLink("round")+" 1)<br />\
				One compatible ship is given the "+conceptLink("heroic")+" designation.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Hull")+"." + discardVal(5,3);
			break;
		case "heroic ground unit":
			displayTxt = "(Play before ground "+conceptLink("battle")+" "+conceptLink("round")+" 1)<br />\
				One permanent "+conceptLink("ground unit")+" is given the "+conceptLink("heroic")+" designation.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Hull")+"." + discardVal(4,2);
			break;
		case "defending familiar terrain":
			displayTxt = "(Play before ground "+conceptLink("battle")+" "+conceptLink("round")+" 1)<br />\
				Temporarily upgrades "+conceptLink("militia")+" to "+conceptLink("Heavy Infantry")+".<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(3,1);
			break;
		case "research breakthrough":
			displayTxt = "(Play during an "+conceptLink("economic phase")+")<br />\
				Allows buying 2 levels of a single "+conceptLink("technology")+", at the expense of paying 5 "+conceptLink("CP")+" more. Immune to "+conceptLink("cancel card")+"s.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(2,1);
			break;
		case "quick study":
			displayTxt = "(Play before any group rolls for "+conceptLink("experience")+")<br />\
				Shift the dice rolls for that group by +2 or -2.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(3,1);
			break;
		case "discover member of ancient race":
			headingTxt = "Discover Member of Ancient Race";
			displayTxt = "(Play at start of "+conceptLink("economic phase")+" involving a "+conceptLink("space wreck")+")<br />\
				After rolling to cash in one of their "+conceptLink("space wreck")+"s, the user may shift by up to 2, wrapping around as necessary.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(4,2);
			break;
		case "overload weapons":
			displayTxt = "(Play with one additional discard; before one of the ships with "+conceptLink("Attack")+" "+conceptLink("tech")+" 1+ shoots)<br />\
				Attack bonus from technology is doubled. A hit that is scored deals <b>2</b> additional damage.\
				<br />In return, the ship loses benefit from this technology <i>after</i> it fires its overloaded ammo.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(5,3);
			break;
		case "unconventional boarding":
			displayTxt = "(Play with one additional discard; before one of the ships <q>shoots</q>)<br />\
				Rather than shooting with one ship, that ship conducts a boarding attempt at strength 5, \
				ignoring non-"+conceptLink("Hull Size")+" "+conceptLink("experience")+" and "+conceptLink("Security Forces")+". \
				Each "+conceptLink("Boarding")+" level adds +2. Only usable against non-immune targets. "+conceptLink("Immortals")+" can not play this card. \
				<br />In return, the ship loses benefit from this technology <i>after</i> it fires its overloaded ammo.<br /><br />\
				In a "+conceptLink("Replicator")+" hand, this card is instead "+conceptLink("Extra Move")+"." + discardVal(5,3);
			break;
		case "xeno-archaeology":
			// Fall thru; UK spelling
		case "xeno-archeology":
			headingTxt = "Xeno-Archeology";
			displayTxt = "(Play when "+conceptLink("capturing")+" a "+conceptLink("planet")+" from the "+conceptLink("NPA")+", or when first colonizing a "+conceptLink("barren planet")+" without "+conceptLink("NPA")+"s)<br />\
				Rather than choosing one "+conceptLink("alien technology")+" over the other, the empire can pay an extra 10 "+conceptLink("CP")+" to keep <i>both</i> cards.<br /><br />\
				A "+conceptLink("Replicator")+" empire can choose to play this only when they would draw an alien tech card. If they do, they get 1 "+conceptLink("RP")+" instead of 10 "+conceptLink("CP")+"." + discardVal(2,1);
			break;
		case "missed rendezvous":
			displayTxt = "(Play before ships are revealed by "+conceptLink("battle")+")<br />\
				Whenever a empire brings ships into battle from two sides for any reason, one of those two sides arrives one "+conceptLink("round")+" later than usual." + discardVal(2);
			break;
		case "activate space monstrosity":
			displayTxt = "(Play before a "+conceptLink("Doomsday Machine")+" moves or before "+conceptLink("Space Amoeba")+" spread)<br />\
				Override the standard destination rules in determining where the selected piece can move/spread to, sans that "+conceptLink("home system")+"s are off limits." + discardVal(4,2);
			break;
		case "spawn doomsday machine":
			displayTxt = "(Play with one additional discard; at the start of user's "+conceptLink("turn")+")<br />\
				Place a neutral hostile "+conceptLink("Doomsday Machine")+" in an empty "+conceptLink("deep space")+" "+conceptLink("hex")+" that is adjacent to a \
					"+conceptLink("Scout")+"/"+conceptLink("Scout-X")+"/"+conceptLink("Type 0")+"/"+conceptLink("Type II")+"/"+conceptLink("Type IV")+"." + discardVal(4);
			break;
		case "spy on board":
			headingTxt = "Spy on Board";
			displayTxt = "(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+")<br />\
				Reveals ships in a single "+conceptLink("hex")+" that does not belong to the user." + discardVal(4);
			break;
		case "provide cover":
			displayTxt = "(Play after a friendly ship group is targetted in "+conceptLink("battle")+")<br />\
				Designate a different group (other than "+conceptLink("Titan")+"/"+conceptLink("Base")+"/"+conceptLink("Ship Yard")+"/"+conceptLink("Carrier")+"/"+conceptLink("Battle Carrier")+") for the enemy group.\
				<br />This enemy group gets "+conceptLink("Attack")+" +1 until they destroy their new targets, or the "+conceptLink("round")+" ends; whichever comes first.<br /><br />\
				If the designated group survives and has not already fired, it may shoot only against the target it blocked (but with "+conceptLink("Attack")+" +1), until a condition similar to the above is met." + discardVal(3);
			break;
		case "alien reinforcements":
			displayTxt = "(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+" or "+conceptLink("battle")+" setup)<br />\
				Add 3 "+conceptLink("NPA")+" ships to a "+conceptLink("barren planet")+" that already has at least one." + discardVal(2);
			break;
		case "deep cover operative":
			displayTxt = "(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+")<br />\
				Chosen opponent may have one of their played/discarded "+conceptLink("resource card")+"s taken, and added to the user's hand. This does not mess with existing effects." + discardVal(4);
			break;
		case "forced system shutdown":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and "+conceptLink("round")+" 1)<br />\
				One enemy ship has its "+conceptLink("Attack")+"/"+conceptLink("Defense")+"/"+conceptLink("Tactics")+" reduced to 0 until "+conceptLink("round")+" 4.\
				<br /><br />If used against the "+conceptLink("Replicators")+", they instead get "+conceptLink("Attack")+" -2 and "+conceptLink("Defense")+" -2 to their stats,\
				(but will not go below Attack 1/Defense 0." + discardVal(4,2);
			break;
		case "smuggler's route":
			displayTxt = "Choose One:<br />\
				(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+")<br />\
				Remove one "+conceptLink("unexplored")+" marker or...<br /><br />\
				(Play at start of user's "+conceptLink("turn")+")<br />\
				Choose one "+conceptLink("Asteroid Belt")+"/"+conceptLink("Nebula")+"/"+conceptLink("Black Hole")+". \
				Ships that start adjacent to the "+conceptLink("hex")+" can move through it as if it was not there. \
				<span class=\"bindTxt\">(Sans the need to roll for checks on any ships that stop there.)</span>" + discardVal(2);
			break;
		case "planetary bombardment":
			displayTxt = "(Play at start of "+conceptLink("bombardment")+")<br />\
				All dice rolls are shifted by 2 in favor of the user. \
				(Subtracts 2 from rolls if the attacker / Adds 2 if the defender)" + discardVal(2);
			break;
		case "update your charts":
			displayTxt = "(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+") Choose One:<br />\
				Add one "+conceptLink("unexplored")+" marker to an empty "+conceptLink("deep space")+" "+conceptLink("hex")+" adjacent to another unexplored hex or...<br /><br />\
				Swap two "+conceptLink("unexplored")+" "+conceptLink("deep space")+" markers." + discardVal(3);
			break;
		case "play dead":
			displayTxt = "(Play with one additional discard; after one of the user's non-"+conceptLink("Titan")+" "+conceptLink("combat ship")+"s are destroyed in "+conceptLink("battle")+")<br />\
				Treat this ship as a "+conceptLink("non-combat ship")+" for the rest of the battle. If the user wins, this ship recovers <i>all</i> damage and rejoins the fleet.<br />\
				The opponent keeps any "+conceptLink("experience")+" gained, regardless of outcome." + discardVal(5,3);
			break;
		case "overconfidence":
			displayTxt = "(Play in betweeen "+conceptLink("battle")+" setup and "+conceptLink("round")+" 1)<br />\
				Enemy ships may not retreat until one "+conceptLink("round")+" later than usual. (after applying other modifiers at start)" + discardVal(3);
			break;
		case "hidden power":
			displayTxt = "(Play at start of user's "+conceptLink("turn")+" or "+conceptLink("economic phase")+")<br />\
				Draw up to 3 "+conceptLink("resource card")+"s from the personal stock." + discardVal(3);
			break;
		case "sanctions":
			displayTxt = "(Play at start of user's "+conceptLink("turn")+")<br />\
				Target opponent randomly discards one "+conceptLink("resource card")+" without benefit." + discardVal(3);
			break;
		case "coup":
			displayTxt = "(Play after conclusion of the last "+conceptLink("battle")+" of <i>any</i> "+conceptLink("hex")+")<br />\
				If the chosen empire lost 6 or more natural "+conceptLink("Hull Size")+"s worth of "+conceptLink("combat ship")+"s in the space battle \
				<span class=\"bindTxt\">(excluding "+conceptLink("minelayer")+" usage and losses),</span> then their "+conceptLink("homeworld")+" produces half as much "+conceptLink("CP")+" (round down).\
				<br /><br />If the chosen empire is a "+conceptLink("Replicator")+" empire, then the user's homeworld instead produces 50% more CP (round down)." + discardVal(4,2);
			break;
		case "retreat when engaged":
			displayTxt = "(Play before ships are revealed by "+conceptLink("battle")+")<br />\
				<b>All</b> ships able to move <i>immediately</i> "+conceptLink("retreat")+"s. \
				"+conceptLink("Fighter")+"s and "+conceptLink("ground unit")+"s are permitted to stay behind at the user's "+conceptLink("colony")+"." + discardVal(3);
			break;
		case "collateral damage":
			displayTxt = "(Play when <i>any</i> "+conceptLink("combat ship")+" gets destroyed in "+conceptLink("battle")+" over a "+conceptLink("colony")+")<br />\
				Reduces the growth level by one stage, but is unable to destroy the colony." + discardVal(2);
			break;
		case "minerals +5/-3":
			displayTxt = "(Play at start "+conceptLink("economic phase")+", or when a "+conceptLink("Replicator")+" empire picks up a mineral)<br />\
				Designate one "+conceptLink("mineral")+" being cashed in <i>or</i> one "+conceptLink("Miner")+" harvesting from a "+conceptLink("nebula")+". \
				That transaction is worth 5 more "+conceptLink("CP")+" <i>or</i> 3 less CP (user's choice)." + discardVal(2);
			break;
		case "splash damage":
			displayTxt = "(Play when a "+conceptLink("combat ship")+" gets destroyed in "+conceptLink("battle")+")<br />\
				Deal 1 damage to X non-"+conceptLink("screen")+"ed enemy ships, where X is the "+conceptLink("Hull Size")+" of the destroyed ship.<br />\
				"+conceptLink("Titan")+"s/"+conceptLink("DM")+"s/"+conceptLink("Space Amoeba")+" are immune to this effect; \
				as are "+conceptLink("Carrier")+"s/"+conceptLink("Battle Carrier")+"s if protected by "+conceptLink("fighter")+"s, \
				and ships protected by "+conceptLink("Shield Projector")+"s.<br /><br />\
				Other ships roll for evasion (&ge;6 to avoid damage). Ships destroyed this way award no "+conceptLink("experience")+"." + discardVal(2);
			break;
		
		// Alternate Replicator resource cards
		case "extra hull":
			displayTxt = "(Play at start of "+conceptLink("economic phase")+")<br />\
				The "+conceptLink("Replicator")+" "+conceptLink("homeworld")+" produces an extra "+conceptLink("hull")+".";
			break;
		case "extra move":
			displayTxt = "(Play at start of "+conceptLink("movement")+")<br />\
				One "+conceptLink("Replicator")+" ship moves an extra "+conceptLink("hex")+". Additional cards can be discarded to move additional ships in the same group.";
			break;
			
		// Replicator faction concepts
		case "deplete":
			// Fall through
		case "depletion":
			headingTxt = "Depletion";
			displayTxt = conceptLink("Replicator")+" "+conceptLink("colonies")+" grow quickly, but also quickly consume their resources.\
				<br />Starting on "+conceptLink("Economic Phase")+" 10 (default), one colony is depleted; rendering its "+conceptLink("planet")+" no longer usable for the rest of the scenario.\
				<br /><br />The "+conceptLink("homeworld")+" is immune to depletion, ensuring the Replicators are always able to produce hulls.";
			break;
		case "self-preservation":
			headingTxt = "Self-Preservation";
			displayTxt = "In "+conceptLink("Replicator Solitaire")+", "+conceptLink("Replicator")+" "+conceptLink("fleet")+"s will try to avoid \
				"+conceptLink("battle")+"s with Player fleets if the latter has a "+conceptLink("Hull Size")+" advantage of 25% or more.";
			break;
		
			
		// Replicator Ships
		case "hull":
			if (useRuleset == "talon") {
				displayTxt = "The inner armor that makes up a "+conceptLink("ship")+". If its hull armor gets reduced to 0, the ship "+conceptLink("explode")+"s.";
			} else {
				displayTxt = "Unidentified/unspecified "+conceptLink("Replicator")+" hull, worth 1 "+conceptLink("Hull Size");
			}
			break;
		case "type 0":
			displayTxt = "Starter "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "E2", 0, 1, 0);
			break;
		case "type ii":
			headingTxt = "Type II";
			displayTxt = "Basic "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "E4", 1, 1, 0, "2 "+conceptLink("RP"));
			break;
		case "type iv":
			headingTxt = "Type IV";
			displayTxt = "Light "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "E5", 1, 1, 0, "4 "+conceptLink("RP"));
			break;
		case "type v":
			displayTxt = "Medium-Light "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "D6", 2, 2, 0, "5 "+conceptLink("RP"));
			break;
		case "type vii":
			headingTxt = "Type VII";
			displayTxt = "Medium "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "C6", 2, 2, 1, "7 "+conceptLink("RP"));
			break;
		case "type ix":
			headingTxt = "Type IX";
			displayTxt = "Advanced Light "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "D6", 1, 1, 1, "9 "+conceptLink("RP"));
			break;
		case "type xi":
			headingTxt = "Type XI";
			displayTxt = "Medium-Heavy "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "B8", 3, 2, 1, "11 "+conceptLink("RP"));
			break;
		case "type xiii":
			headingTxt = "Type XIII";
			displayTxt = "Heavy "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "A10", 4, 4, 1, "13 "+conceptLink("RP"))+"\
				<br /><br />Counts as 3 "+conceptLink("hull")+"s for combining/breaking purposes";
			break;
		case "type xv":
			headingTxt = "Type XV";
			displayTxt = "Huge "+conceptLink("Replicator")+" ship" + stats4X("Replicator", 0, "A11", 5, 4, 1, "15 "+conceptLink("RP"))+"\
				<br /><br />Counts as 3 "+conceptLink("hull")+"s for combining/breaking purposes";
			break;
		case "type pd":
			headingTxt = "Type PD";
			displayTxt = "Specialist "+conceptLink("Replicator")+" ship, gains a massive "+conceptLink("Attack")+" bonus versus "+conceptLink("Fighter")+"s\
				<br />Upgrades to A7 versus Fighters once 3 have been shot down in previous "+conceptLink("turn")+"s\
				" + stats4X("Replicator", 0, "E1 / A6", 0, 1, 0, conceptLink("Point-Defense"));
			break;
		case "type scan":
			displayTxt = "Specialist "+conceptLink("Replicator")+" ship, equipped with "+conceptLink("Scanning")+" 2 and gains an "+conceptLink("Attack")+" bonus versus cloaked ships\
				" + stats4X("Replicator", 0, "E1 / C6", 0, 2, 0, conceptLink("Scanning"));
			break;
		case "type sw":
			headingTxt = "Type SW";
			displayTxt = "Specialist "+conceptLink("Replicator")+" ship, sweeps "+conceptLink("mines")+"<br />\
				Minesweeping effieincy increases (1 &rarr; 2) once 3 mines have been swept in previous "+conceptLink("turn")+"s\
				" + stats4X("Replicator", 0, "E1", 0, 1, 0, conceptLink("Minesweeping"));
			break;
		case "type exp":
			displayTxt = "Specialist "+conceptLink("Replicator")+" ship, equipped with "+conceptLink("Exploration")+" 1\
				" + stats4X("Replicator", 0, "E1", 0, 2, 0, conceptLink("Exploration"));
			break;
		case "type flag":
			displayTxt = conceptLink("Replicator")+" "+conceptLink("Flagship")+", automatically upgrades as "+conceptLink("RP")+" is acquired" + stats4X("Replicator", 0, "B1-15", "1-4", 3, 1);
			break;
			
		// All Good Things concepts
		case "agt":
			// Fall thru
		case "all good things":
			headingTxt = "All Good Things";
			displayTxt = "Capstone expansion to "+conceptLink("Space Empires 4X")+". Adds an alternative to the vanilla faction (featuring "+conceptLink("missile boat")+"s), an "+conceptLink("AP Bot")+" system,<br />\
				increased "+conceptLink("home system")+" variety, "+conceptLink("storm movement")+" + other terrain, \
				"+conceptLink("scenario card")+"s, "+conceptLink("mission card")+"s, "+conceptLink("crew card")+"s, and more "+conceptLink("facilities")+".";
			break;
		case "auxiliary":
			headingTxt = "Auxiliary Technology";
			displayTxt = "Additional technology that can be outfitted to a "+conceptLink("Battlecruiser")+", "+conceptLink("Battleship")+", or "+conceptLink("Dreadnought")+".<br />\
				For the base factions, these technologies are fixed to "+conceptLink("Fastmove")+", "+conceptLink("Tractor Beam")+", and "+conceptLink("Shield Projector")+"; respectively.<br />";
				
			if (useRuleset == "AGT") {
				displayTxt = displayTxt + "<br />For the alternate faction, these technologies are randomly assigned as "+conceptLink("Ship Size")+" increases.\
					<br />The latter two augmentations require "+conceptLink("Advanced Construction")+" 1, regardless of faction or outcome.";
			} else {
				displayTxt = displayTxt + "Fastmove aside, these augmentations require "+conceptLink("Advanced Construction")+" 1.";
			}
			break;
		case "jammer":
			headingTxt = "Jammer Technology";
			displayTxt = conceptLink("All Good Things")+" technology that allows "+conceptLink("Cruiser")+"s equipped with this technology \
				to decrease the "+conceptLink("Attack")+" strength of incoming "+conceptLink("missile")+"s.<br />\
				1 Cruiser at Jammer 1+ will apply Attack -1 to missiles. 2 Cruisers at Jammer 2 nullifies their Attack technology.";
			break;
		case "logistic center":
			displayTxt = conceptLink("Facility")+" that generates 5 "+conceptLink("LP")+" each "+conceptLink("economic phase")+".";
			break;
		case "lp":
			headingTxt = "Logistics Points (LP)";
			if (useRuleset == "talon") {
				displayTxt = "The cost to position this ship in a specific "+conceptLink("Empire War")+" sector. The minimum varies, based on the LP total of ships <i>not</i> in "+conceptLink("reserve")+".";
			} else {
				displayTxt = "Currency that is used exclusively to pay for "+conceptLink("maintenance")+" or to "+conceptLink("bid")+". "+conceptLink("Colonies")+" have a limited "+conceptLink("supply range")+", \
					but points can be bundled into crates of 5 LP, which can be loaded onto "+conceptLink("Transport")+"s.";
			}
			break;
		case "missile boat":
			headingTxt = "Missile Boat (MB)";
			displayTxt = "Faction-exclusive specialist ship that is able to fire seeking "+conceptLink("missile")+"s. Can use up to "+conceptLink("Attack")+" 3 tech.\
				<br />Has two tech levels, with the second level adding one natural "+conceptLink("Defense")+".";
			displayTxt = displayTxt + stats4X("Alternate", 10, "A*", 0, 1, conceptLink("Missile Boats")+" 1");
			break;
		case "missile":
			if (useRuleset == "talon") {
				displayTxt = conceptLink("Talon")+" seeker that homes in on its victim. Deals 2 damage when connected, but can be shot down. Has a fixed "+conceptLink("power curve")+" of <u>0-6-0</u>.";
			} else {
				displayTxt = conceptLink("Missile Boat")+" seeker that homes in on its victim. Deals 2 damage if connected, but can be shot down or evaded. Weak to "+conceptLink("Jammer")+" tech.";
				displayTxt = displayTxt + stats4X("Alternate", 0, "E6", 0, 1);
			}
			break;
		case "out of supply":
			headingTxt = "Out of Supply";
			displayTxt = "Most "+conceptLink("combat ship")+"s can be caught out of supply, if they are neither in "+conceptLink("supply range")+" of a friendly "+conceptLink("colony")+", \
				nor do they have "+conceptLink("LP")+"-loaded "+conceptLink("Transport")+"(s) with them.<br /><br />\
				Such ships pay no "+conceptLink("maintenance")+", but suffer "+conceptLink("Attack")+" -3 / "+conceptLink("Defense")+" -3 / fixed "+conceptLink("Movement")+" 1,\
				and can break apart during any "+conceptLink("economic phase")+" while this condition is met.<br /><br />\
				"+conceptLink("Scout")+"s, "+conceptLink("Raider")+"s, and "+conceptLink("Space Pirate")+"s are always in range, making them immune to this limitation.<br />\
				Lone "+conceptLink("Exploration")+"-equipped ships that have not met up with any other combat ships within the past eco phase are also always in range.";
			break;
		case "space station":
			displayTxt = "Non-aligned base that can <i>only</i> be fought by any ships that encounter them.<br />\
				Has fixed "+conceptLink("Point-Defense")+" 2, "+conceptLink("Scanning")+" 1. Immune to "+conceptLink("boarding");
				displayTxt = displayTxt + stats4X("Alien (with Tech / 10 CP)", 0, "A6", 2, 2, 0);
				displayTxt = displayTxt + stats4X("Alien (with 5 CP)", 0, "A5", 1, 1, 0);
			break;
		case "starbase":
			if (useRuleset == "talon") {
				displayTxt = "Immobile Starbase<br />";
				displayTxt = displayTxt + statsTalon("Terran", 281, "Dual Phasers x2 + Side Wave-Motion Gun x2", "10/10/10/10", 12);
				displayTxt = displayTxt + statsTalon("Talon", 278, "Dual Disruptors x2 + Dual Missile Launchers x2", "10/10/10/10", 12);
			} else {
				displayTxt = "Starbase with overpowering weaponry, can shoot twice per "+conceptLink("round")+"! Can not move. \
					Requires upgrading an "+conceptLink("Advanced Base")+" at a "+conceptLink("colony")+" that has naturally produced 5 "+conceptLink("CP")+". \
					Counts as building a "+conceptLink("Ship Yard")+".";
				displayTxt = displayTxt + stats4X("Common", 12, "A7", 3, 4) + "<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 2";
			}
			break;
		case "ion storm":
			displayTxt = "Hits scored in "+conceptLink("battle")+"s taking place in this "+conceptLink("hex")+" deal double damage.<br />\
				Difficult to escape (If a 9+ is rolled, <i>no</i> player "+conceptLink("ship")+"s may move on a given "+conceptLink("turn")+"). Has "+conceptLink("Storm Movement")+".";
			break;
		case "plasma storm":
			displayTxt = "Stops any "+conceptLink("ship")+"s that enter. Slow to escape (fixed "+conceptLink("Movement")+" 1). \
				Has "+conceptLink("Storm Movement")+", and leaves "+conceptLink("mineral")+"s (5 CP worth) in its wake.<br />\
				Instantly destroys ships that cost &le;9 "+conceptLink("CP")+", "+conceptLink("Type 0")+" + "+conceptLink("Type II")+" ships, \
				"+conceptLink("mineral")+"s, and "+conceptLink("space wreck")+"s.<br />\
				("+conceptLink("Fighter")+"s in cargo are only destroyed if in excess of capacity. They may not be launched in "+conceptLink("battle")+".)";
			break;
		case "storm movement":
			displayTxt = conceptLink("Ion storm")+"s and "+conceptLink("plasma storm")+"s can move 1 "+conceptLink("hex")+" in a random direction each "+conceptLink("economic phase")+". \
				Breaks apart if it tries to enter a "+conceptLink("black hole")+". Avoids terrain other than "+conceptLink("nebula")+" and "+conceptLink("asteroids")+".";
			break;
		case "supply range":
			displayTxt = conceptLink("All Good Things")+" technology that determines how many "+conceptLink("hex")+"es a "+conceptLink("combat ship")+" \
				can be from a friendly "+conceptLink("colony")+" to avoid being caught "+conceptLink("Out of Supply")+".<br /><br />\
				Tracing is required; can pass into (but not through) "+conceptLink("supernova")+"s, "+conceptLink("space station")+"s, "+conceptLink("quantum filament")+"s, \
				"+conceptLink("cosmic storm")+"s, un-"+conceptLink("pipeline")+"d "+conceptLink("black hole")+"s, or "+conceptLink("unexplored")+" terrain.";
			break;
		case "temporal center":
			displayTxt = conceptLink("Facility")+" that generates 5 "+conceptLink("TP")+" each "+conceptLink("economic phase")+". \
				These points are used exclusively to empower "+conceptLink("temporal engine")+"s.";
			break;
		case "temporal engine":
			displayTxt = "Experimental engines that can manipulate pockets of time, using "+conceptLink("TP")+". <br />\
				"+conceptLink("Base")+"s (+ their variants) and "+conceptLink("Ship Yard")+"s are equipped with these engines, as is one random ship type.";
			break;
		case "tp":
			headingTxt = "Temporal Points (TP)";
			displayTxt = "Currency that is used exclusively to empower "+conceptLink("temporal engine")+"s.";
			break;
		case "cyber armor":
			displayTxt = "Extremely potent "+conceptLink("grount unit");
			displayTxt = displayTxt + stats4X("Common", 5, "B8", 3, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 3 + "+conceptLink("Advanced Construction")+" 2";
			break;
			
		// AP Bot concepts
		case "ap bot":
			headingTxt = "Alien Player (AP) Bot";
			displayTxt = "A robotic-like entity that is able to interface with a non-"+conceptLink("Replicator")+" empire. Introduced in "+conceptLink("All Good Things")+".<br />\
				Plays similiarly (but not identically) to the "+conceptLink("alien player")+"s, on <i>any</i> "+conceptLink("versus map")+". Starts with "+conceptLink("Nanomachine")+" tech.";
			break;
		case "buffed cruisers":
			displayTxt = conceptLink("Fleet Strategy")+" that prioritizes "+conceptLink("Cruiser")+" tech, but will otherwise build the largest ships available.";
			break;
		case "defense posture":
			displayTxt = "Posture in which the "+conceptLink("AP Bot")+" will move to eliminate threats in/near their "+conceptLink("colonies")+" or "+conceptLink("home system")+"s.";
			break;
		case "ev":
			// Fall thru
		case "exploration vessel":
			headingTxt = "Exploration Vessel";
			displayTxt = conceptLink("AP Bot")+"-exclusive ship that is equipped with "+conceptLink("Exploration")+" 1. Also functions as a "+conceptLink("Miner")+".";
			displayTxt = displayTxt + stats4X("Bot", 5, 0, 0, 0);
			break;
		case "fleet strategy":
			displayTxt = "A strategy that an "+conceptLink("AP Bot")+" uses to determine how to buy "+conceptLink("technology")+" and built "+conceptLink("ship")+"s remotely.";
			break;
		case "fob":
			// Fall thru
		case "forward operating base":
			headingTxt = "Forward Operating Base";
			displayTxt = conceptLink("AP Bot")+"-exclusive base that allows launching "+conceptLink("fleet")+"s at a non-"+conceptLink("homeworld")+" "+conceptLink("hex")+". Appears on the board as a "+conceptLink("Ship Yard")+".";
			displayTxt = displayTxt + stats4X("Bot", 20, 0, 0, 0);
			break;
		case "guard fleet":
			displayTxt = "An "+conceptLink("AP Bot")+" that has been assigned soft guard duty. It can fend off player stragglers <i>or</i> merge with another fleet. If it merges, this fleet is disbanded.";
			break;
		case "morale":
			displayTxt = "A level that an "+conceptLink("AP Bot")+" uses to measure its confidence in "+conceptLink("battle")+", calculated each "+conceptLink("round")+". \
				If any damage/losses were incurred, a 1d100 is rolled at the earliest "+conceptLink("retreat")+" opportunity each "+conceptLink("round")+" \
				until the check fails. A roll that is less than or equal to the threshold fail the check, causing it to retreat as able. ";
			break;
		case "offense posture":
			displayTxt = "Posture in which the "+conceptLink("AP Bot")+" will move in an aggressive fashion.";
			break;
		case "paranoia":
			displayTxt = "A level that an "+conceptLink("AP Bot")+" uses to measure its confidence in its current "+conceptLink("fleet strategy")+". \
				Multiple steps are influenced by this system, and the outcome determines the course of action. A 1d100 that is less than or equal to the threshold will cause its check to fail.";
			break;
		case "shattered fleet":
			displayTxt = "A non-<a href=\"javascript:showBox('Guard Fleet')\">guard</a> "+conceptLink("AP Bot")+" fleet that is worth &lt;30 "+conceptLink("CP")+" in value. These fleets return home to merge with another fleet.";
			break;
			
		// Optional Rules / Scenario Cards
		case "scenario card":
			displayTxt = "Powerful gimmick that affects the entire map. Activated at scenario start. Introduced in "+conceptLink("All Good Things")+"<br /><br />\
				Some optional rules that were previously available in older expansions have become scenario cards in AGT.";
			break;
		case "quick start":
			displayTxt = "Optional setup variant that greatly speeds up play, only available in "+conceptLink("competitive")+" scenarios.<br /><br />\
				"+conceptLink("Home system")+"s are pre-explored, and non-"+conceptLink("barren")+" "+conceptLink("planet")+"s are pre-colonized and fully grown;\
				at the expense of starting with no "+conceptLink("colony ship")+"s.";
			break;
		case "low maintenance":
			if (useRuleset == "SE4X") {
				displayTxt = "Optional rule that causes "+conceptLink("ship")+"s to pay half as much "+conceptLink("maintenance")+" (round down total).";
			} else {
				if (useRuleset == "AGT") {
					displayTxt = "A benefit that can be active from a "+conceptLink("scenario card")+", ";
				} else {
					displayTxt = "A benefit that can be active from an optional rule, ";
				}
					
				displayTxt = displayTxt + "Elite "+conceptLink("experience")+", and/or "+conceptLink("alien technology")+".\
					<br />"+conceptLink("Ship")+"s benefiting from one source pay half as much "+conceptLink("maintenance")+" (round down total). \
					Ships benefiting from two or more sources pay no maintenance instead.";
			}
			break;
		case "slingshot":
			displayTxt = "Optional rule that enables daring "+conceptLink("ship")+"s to attempt to \
				use the "+conceptLink("black hole")+"'s acceleration to sling their way an extra "+conceptLink("hex")+".\
				<br />If they do, the threshold to destroy ship(s) decrease (6 &rarr; 4). Does not stack with "+conceptLink("Pipeline")+" bonus.";
			break;
		case "gearing limits":
			displayTxt = "Optional rule that limits a player's ability to invest in "+conceptLink("technology")+".<br />\
				A player can spend as much "+conceptLink("CP")+" as they did in the previous "+conceptLink("economic phase")+", plus 10 more.\
				<br /><br />If combined with "+conceptLink("Unpredictable Research")+", this limit instead applies to "+conceptLink("research grant")+"s.";
			break;
		case "unpredictable research":
			displayTxt = "Optional rule that requires players to buy "+conceptLink("research grant")+" rolls, instead of buying "+conceptLink("technology")+" directly.";
			break;
		case "research grant":
			displayTxt = conceptLink("Unpredictable Research")+" roll that is allocated to a given "+conceptLink("technology")+" level, \
				adding 1-10 "+conceptLink("RP")+" while spending 5 "+conceptLink("CP")+".";
			break;
		case "heavy terrain":
			displayTxt = "Optional rule that causes unused "+conceptLink("deep space")+" markers to form a <q>deck</q>. Each "+conceptLink("Lost in Space")+" or "+conceptLink("Danger")+" marker \
				that would otherwise be removed from play is replaced with a system from this deck, until stock is exhausted.";
			break;
		case "safer space":
			displayTxt = "Optional rule that weakens "+conceptLink("Danger")+" markers, allowing a "+conceptLink("fleet")+" to roll 1 die (8 or less is a success).";
			break;
		case "rich minerals":
			if (useRuleset == "AGT") {
				displayTxt = conceptLink("Scenario card")+" that doubles "+conceptLink("minerals")+" output when cashed in.";
			} else {
				displayTxt = "Optional rule that doubles "+conceptLink("minerals")+" output when cashed in.";
			}
			
			if (useRuleset == "AGT" || useRuleset == "rep") {
				displayTxt = displayTxt + " Applied after any "+conceptLink("Minerals +5/-3")+" card that may be played.";
			}
			break;
		case "slow scientists":
			displayTxt = "Optional rule that makes "+conceptLink("technologies")+" 5 "+conceptLink("CP")+" more expensive.";
			break;
		case "smart scientists":
			displayTxt = "Optional rule that makes "+conceptLink("technologies")+" 5 "+conceptLink("CP")+" less expensive.";
			break;
		case "bloody combat":
			displayTxt = ">Optional rule that adds an extra "+conceptLink("Attack")+" +1 to all "+conceptLink("combat ship")+"s.";
			break;
		case "rich colonies":
			displayTxt = "Optional rule that improves income of each existing "+conceptLink("colony")+" by 3 "+conceptLink("CP")+" per "+conceptLink("economic phase")+".";
			break;
		case "galactic situation":
			displayTxt = "A more random game that adds up to 3 random optional rules.";
			break;
		case "head start":
			displayTxt = "Optional setup variant that speeds up play, only available in "+conceptLink("competitive")+" scenarios.<br /><br />\
				Players start a "+conceptLink("competitive")+" scenario with any agreed amount of "+conceptLink("CP")+" \
				(usually 75) that can be spent <i>only</i> on "+conceptLink("technology")+".<br />\
				"+conceptLink("Ship Size")+" or "+conceptLink("Movement")+" technology are capped at level 3 during setup. \
				Other technologies can only be bought once this way. A maximum of 10 CP can be taken into the first "+conceptLink("economic phase")+".";
			break;
		case "better homes":
			displayTxt = conceptLink("Homeworld")+"s produce an extra 10 "+conceptLink("CP")+" while at full strength. "+conceptLink("Replicator")+" homeworld(s) produce 2 extra "+conceptLink("hull")+"s.";
			break;
		case "tough shipyards":
			displayTxt = conceptLink("Ship Yard")+"s have natural "+conceptLink("Hull Size")+" 2, regardless of "+conceptLink("empire advantage")+"s. \
				Prohibits "+conceptLink("On The Move")+". "+conceptLink("Replicators")+" start with 1 [extra] "+conceptLink("RP")+" already researched.";
			break;

		// Mission resource cards
		case "mission card":
			displayTxt = conceptLink("Resource card")+" that has a unique requirement, but provides a greater (but random) reward when played.";
			break;

		// Crew cards
		case "crew card":
			displayTxt = "Named individual that provides a unique power to the "+conceptLink("ship")+" it is bound to, sometimes spilling over to a group or even a "+conceptLink("fleet")+".";
			break;


		// Talon concepts
		case "talon":
			displayTxt = "Younger and faster paced sibling to the "+conceptLink("Space Empires 4X")+" board game.<br />\
				Rather than two or more empires duking it out on a galactic scale, two "+conceptLink("fleet")+"s duke it out in a scenario that span an entire "+conceptLink("battle")+".<br /><br />\
				Named after the antagonist faction responsible for invading "+conceptLink("Terran")+" space, and made by several of the very same people.<br />\
				Their ships use "+conceptLink("Disruptor")+"s, "+conceptLink("Missile Launcher")+"s and "+conceptLink("Fusion Cannon")+"s.";
				
			if (useRuleset != "talon") {
				displayTxt = displayTxt + "<br /><br />There are crossover scenarios that use one (170) or <i>both</i> (258) Talon boards on a galactic scale \
					<span class=\"bindTxt\">(versus the original 150 "+conceptLink("hex")+"es)</span>, and that it is possible to mix the strategic aspects of Space Empires and the tactical aspects of Talon.";
			}
			break;
		case "talon 1000":
			displayTxt = "Expansion to "+conceptLink("Talon")+" that adds new ships, a new faction called "+conceptLink("AI")+", and thousands of pre-set skirmish combinations.";
			break;
		case "terran":
			displayTxt = "The humans who explored the vast depths of "+conceptLink("deep space")+". \
				They wisely built a collection of defensive ships when unrecognized FTL signatures were detected, \
				eventually coming into contact with the "+conceptLink("Talon")+" faction.<br />\
				Their ships use "+conceptLink("Phaser")+"s, "+conceptLink("Anti-Matter Torpedo")+"es and "+conceptLink("Wave-Motion Gun")+"s.";
			break;
		case "empire war":
			displayTxt = "Strategic "+conceptLink("Talon")+" "+conceptLink("campaign")+" where \
				the long-term "+conceptLink("primary objective")+" is to win a "+conceptLink("battle")+" over the opposing "+conceptLink("homeworld")+".\
				<br /><br />Pre-packed maps come with 4 sectors (lanes), but it is possible to custom design a map with more or fewer sectors.";
			break;
		case "sp":
			headingTxt = "Ship Points (SP)";
			displayTxt = "The cost to bring this ship to a "+conceptLink("Talon")+" "+conceptLink("battle")+", or to build it in an "+conceptLink("Empire War")+". Also used as the value for scoreboard purposes.";
			break;
		case "deployment zone":
			displayTxt = "Zone in which a given player must set up their "+conceptLink("ship")+"s.";
			break;
		case "reserve":
			displayTxt = "Off-map zone used to contain additional ships that are available to deploy later in a "+conceptLink("battle")+". \
				Ships can enter the map late in a "+conceptLink("power phase")+".";
			break;
		case "last ship standing":
			displayTxt = "Simple "+conceptLink("Talon")+" skirmish scenario where the objective is for one team to destroy the other.";
			break;
		case "base assault":
			displayTxt = "Moderate "+conceptLink("Talon")+" skirmish scenario where a "+conceptLink("Base")+" is the \
				"+conceptLink("primary objective")+", counting double the normal "+conceptLink("SP")+" for scoreboard purposes.\
				<span class=\"bindTxt\">The attacker team</span> needs only to destroy it to win. The defender team must prevent its destruction to win.";
			break;
		case "convoy intercept":
			displayTxt = "Simple "+conceptLink("Talon")+" skirmish scenario (limited to 200 "+conceptLink("SP")+" each) \
				where a "+conceptLink("Transport")+" becomes a soft "+conceptLink("primary objective")+".<br />For scoreboard purposes, its escape or destruction counts <i>double</i> the normal SP.";
			break;
		case "worm hole blockade":
			displayTxt = "Like "+conceptLink("Convoy Intercept")+", but the "+conceptLink("Transport")+" suffers from "+conceptLink("FTL Offline")+", and must use a "+conceptLink("worm hole")+" to escape";
			break;
		case "planetary invasion":
			displayTxt = "Complex "+conceptLink("Talon")+" skirmish scenario where the attacker team gets 2+ "+conceptLink("Transport")+"s. \
				If they land 2 more Transports than the defender on the latter's "+conceptLink("planet")+", the attackers immediately win. \
				Landed or destroyed Transports also count double the normal "+conceptLink("SP")+" for scoreboard purposes.<br /><br />\
				The attacker may not land Transports if the defender has a "+conceptLink("Base")+" in the "+conceptLink("battle")+". \
				<span class=\"bindTxt\">(If the "+conceptLink("AI")+" is defending, <i>all</i> of their ships count as Bases.)</span><br />\
				Since the AI does not use Transports, if they eliminate all defenders, they automatically capture the planet.";
			break;
		case "orbital conquest":
			displayTxt = "Complex "+conceptLink("Talon")+" skirmish scenario where each team gets 2+ "+conceptLink("Transport")+"s. \
				If one team lands 2 Transports on the opposing "+conceptLink("planet")+", they immediately win. \
				Landed or destroyed Transports also count double the normal "+conceptLink("SP")+" for scoreboard purposes.";
			break;
		case "priority target mission":
			displayTxt = "Complex "+conceptLink("Talon")+" skirmish scenario where the most expensive ship on each team is considered the "+conceptLink("primary objective")+". \
			Such ships count double the normal "+conceptLink("SP")+" for scoreboard purposes.<br />\
			If one team retreats their own <i>and</i> destroys the other, they instantly end the scenario.";
			break;
		case "ai solitaire":
			headingTxt = "AI Solitaire";
			displayTxt = "Scenario (usually "+conceptLink("Last Ship Standing")+") against the [literal] "+conceptLink("AI")+" faction. \
				Difficulty settings determine how much extra "+conceptLink("SP")+" the antagonist AI get.";
			break;
		case "priority target":
			headingTxt = "Priority Target (PT)";
			displayTxt = "Concept where a given "+conceptLink("AI")+" ship focuses exclusively on its designated target \
				until it is destroyed, or the next "+conceptLink("power phase")+" is reached; <span class=\"bindTxt\">whichever comes first.</span> \
				If an AI ship does not have a PT, it instead moves towards the closest player ship.";
			break;
		case "potential priority target":
			headingTxt = "Potential Priority Target (PPT)";
			displayTxt = "Candidate to be designated as a "+conceptLink("priority target")+" by one or more "+conceptLink("AI")+" ships.\
				<br />A player "+conceptLink("ship")+" is eligible if it is in the side/rear flank of one AI ship, without being in the front (and within 6 "+conceptLink("hex")+"es) of another AI ship.\
				<br /><br />Random Factor can prevent a given ship from becoming a designated target. \
				If this happens, the AI stops designating targets altogether until the next "+conceptLink("power phase")+".";
			break;
		case "efv":
			// Fall thru
		case "estimated fleet value":
			headingTxt = "Estimated Fleet Value (EFV)";
			displayTxt = "Used by the "+conceptLink("AI")+" to compare the strength of the two fleets.\
				<br />"+conceptLink("Destroyer")+"s and smaller are worth 1 EFV point.\
				"+conceptLink("Light Crtuiser")+"s are worth 2 EFV points.<br />\
				"+conceptLink("Cruiser")+"s and "+conceptLink("Battlecruiser")+"s are worth 3 EFV points.\
				"+conceptLink("Battleship")+"s and beyond are worth 4 EFV points.";
			break;
		case "center hex row":
			displayTxt = "The "+conceptLink("hex")+"es directly in front of, and directly behind, the "+conceptLink("ship")+" constitute that ship's <q>center hex row</q>.\
				<br />This row changes whenever a ship "+conceptLink("turn")+"s or "+conceptLink("side slip")+"s.";
			break;
		case "impulse":
			displayTxt = "A small segment of time. The actions a given "+conceptLink("ship")+" can do is based on how much time has passed in a given "+conceptLink("round")+".<br />\
				A ship can generate "+conceptLink("power")+" and/or be required to move, depending on its "+conceptLink("power curve")+".<br />\
				It can use its "+conceptLink("battery")+" or "+conceptLink("afterburners")+" to gain the respective resources whenever it would otherwise get none.<br />\
				A ship with one or more fully charged weapon banks can also shoot them, even if it did none of the previous actions.";
			break;
		case "collide":
			// Fall thru
		case "collision":
			headingTxt = "Collisions";
			displayTxt = "Whenever two mobile "+conceptLink("ship")+"s from the same faction enter the very same "+conceptLink("hex")+", \
				distortions caused by their NFTL drives cause them to collide, dealing 3 damage to each ship.<br /><br />\
				Due to differing signatures, two ships from opposing factions will not damage each other. \
				"+conceptLink("AI")+" ships are immune, though they will try to avoid it.";
			break;
		case "power":
			displayTxt = "Energy that is not spent to move a "+conceptLink("ship")+".<br />\
				Whenever some becomes available to spend on a given "+conceptLink("impulse")+", it can be spent as the owner sees fit.<br /><br />\
				Available actions:<ul style=\"max-width: 600px; margin-top: 0px; margin-left: auto; margin-right: auto; text-align: left;\">\
				<li class=\"noKeywords\">Preparing a "+conceptLink("side slip")+"</li>\
				<li class=\"noKeywords\">Powering through a "+conceptLink("turn")+" (reduces cooldown by one forward  "+conceptLink("hex")+")</li>\
				<li class=\"noKeywords\">Actively charging a weapon (1 <q>yellow</q> box)</li>\
				<li class=\"noKeywords\">Charging a "+conceptLink("battery")+" (if any)</li>\
				<li class=\"noKeywords\">Reinforcing 1 "+conceptLink("shield")+" arc (lasts 6 "+conceptLink("impulse")+"s / limit 2 extra shields)</li>\
				<li class=\"noKeywords\">Changing the "+conceptLink("initiative")+" (can only flip once in "+conceptLink("AI Solitaire")+")</li>\
				<li class=\"noKeywords\">Defending the "+conceptLink("initiative")+" (unavailable in "+conceptLink("AI Solitaire")+")</li>\
				<li class=\"noKeywords\">Transfer power to a "+conceptLink("Fighter")+" squad (only available to "+conceptLink("Base")+"s and "+conceptLink("Carrier")+"s)</li>\
				<li class=\"noKeywords\">Selecting a new target for <i>1</i> "+conceptLink("missile")+" (only available to ships with "+conceptLink("Missile Launcher")+"s)</li></ul>";
			break;
		case "batteries":
			// Fall thru
		case "battery":
			headingTxt = "Battery";
			displayTxt = "Rechargable source of "+conceptLink("power")+". A compatible "+conceptLink("ship")+" can use power to charge this for a later "+conceptLink("impulse")+" whenever there would otherwise be none.";
			break;
		case "energy nebula":
			displayTxt = "Has all the properties of a regular "+conceptLink("nebula")+", but grants "+conceptLink("power")+" \
				to non-"+conceptLink("AI")+" "+conceptLink("ship")+"s in "+conceptLink("impulse")+"s where the ship would otherwise get none.";
			break;
		case "power curve":
			displayTxt = "Specifications that denotes the amount of "+conceptLink("power")+" and movement "+conceptLink("hex")+"es a ship gets \
				each "+conceptLink("round")+", followed by the "+conceptLink("turn radius")+".<br /><br />\
				Some ships (example: "+conceptLink("Base")+"s) are immobile. Their curve instead denotes power and number of clockwise rotations per round.<br /><br />\
				Hull and Critical damage can decrease the power available. If power drops below zero at the end of a "+conceptLink("power phase")+", the ship's FTL core suffers a meltdown, and "+conceptLink("explode")+"s.";
			break;
		case "turn radius":
			displayTxt = "Denotes how sharply a "+conceptLink("ship")+" can "+conceptLink("turn")+". The number is measured in the number of "+conceptLink("hex")+"es a ship must move forward in between "+conceptLink("turn")+"s, \
				assuming no acceleration via "+conceptLink("power")+" usage. Can be aggrevated via "+conceptLink("Manuevering Thruster Damage")+" (+X).";
			break;
		case "power phase":
			displayTxt = "A regrouping phase after each 6 "+conceptLink("impulse")+"s where "+conceptLink("ship")+"s can recharge their weapon banks and adjust their "+conceptLink("power curve")+" by one stage.\
				<br /><br />Afterwards, reinforcements can be brought out of "+conceptLink("reserve")+" (scenario permitting), or ships can "+conceptLink("retreat")+" (if able).";
			break;
		case "side slip":
			displayTxt = "A "+conceptLink("ship")+" can spend "+conceptLink("power")+" to prepare this procedure. The next move they do, they can choose to <q>strafe</q> instead of move straight. \
				<span class=\"bindTxt\">"+conceptLink("AI")+" ships can conduct this procedure</span> without power (as they have none).";
			break;
		case "brake":
			headingTxt = "Brakes";
			displayTxt = "An "+conceptLink("AI")+" "+conceptLink("ship")+" can spend this ability to remain stationary on an "+conceptLink("impulse")+" where it would otherwise move. Does not replenish.";
			break;
		case "shield":
			headingTxt = "Shields";
			displayTxt = "A layer of protection that "+conceptLink("ship")+"s use to absorb damage. Once shields are unusable, then the "+conceptLink("hull")+" starts taking damage.";
			break;
		
		
		// Talon weapons
		case "phaser":
			displayTxt = "Basic "+conceptLink("Terran")+" weapon that deals low damage, but recharges fairly fast (1R1Y).\
				"+talWepDmgChart([[1,2,2,2,2,2], [1,1,1,2,2,2], [0,0,0,0,1,1]]);
			break;
		case "anti-matter torpedo":
			headingTxt = "Anti-Matter Torpedo";
			displayTxt = "Advanced "+conceptLink("Terran")+" weapon that deals a fixed 4 damage, but has a slower recharge (2R2Y).\
				"+talWepHitChart(["N/A", "&ge;2", "&ge;3", "&ge;5"]);
			break;
		case "wave-motion gun":
			headingTxt = "Wave-Motion Gun";
			displayTxt = "Expert "+conceptLink("Terran")+" weapon that deals 10 damage <i>and</i> displaces the victim 1 "+conceptLink("hex")+", but is very power intensive (2R5Y).\
				"+talWepHitChart(["N/A", "&ge;2", "&ge;3", "&ge;3"]);
			break;
		case "disruptor":
			displayTxt = "Basic "+conceptLink("Talon")+" weapon that deals a fixed 2 damage, and has a fairly fast recharge (1R2Y).\
				"+talWepHitChart(["&ge;5", "&ge;2", "&ge;3", "&ge;5"]);
			break;
		case "missile launcher":
			displayTxt = "Advanced "+conceptLink("Talon")+" weapon that launches seeking "+conceptLink("missile")+"s, but has a fixed recharge rate (2R0Y). Range 4";
			break;
		case "fusion cannon":
			displayTxt = "Expert "+conceptLink("Talon")+" weapon that damages ALL targets within the firing arc, but reloads extremely slowly (3R3Y). "+conceptLink("Fighter")+"s are immune.\
				"+talWepDmgChart([[7,7,9,9,11,11], [4,4,6,6,8,8], [0,0,2,2,4,4]]);
			break;
		case "laser":
			displayTxt = "Basic "+conceptLink("AI")+" weapon that deals low damage, but recharges very quickly (1R0Y).\
				"+talWepDmgChart([[1,1,1,1,2,2], [1,1,1,1,2,2]]);
			break;
		case "cobalt cannon":
			displayTxt = "Advanced "+conceptLink("AI")+" weapon that deals considerable damage, but recharges slowly (3R0Y).\
				"+talWepDmgChart([[3,3,3,5,5,5], [3,3,3,5,5,5], [3,3,3,5,5,5]]);
			break;
			
		// Talon Critical Rolls
		case "secondary explosion": // 2
			displayTxt = conceptLink("Ship")+"s that suffer this condition instantly take an additional 3 "+conceptLink("hull")+" damage.";
			break;
		case "shields down": // 3
			displayTxt = conceptLink("Ship")+"s that have this condition are unable to use their "+conceptLink("shield")+"s, \
			until repaired with a 6 at the end of an "+conceptLink("impulse")+" following the damage";
			break;
		case "helm down": // 4
			displayTxt = conceptLink("Ship")+"s that have this condition are unable to "+conceptLink("turn")+" or "+conceptLink("side slip")+", \
				until repaired with a 6 at the end of an "+conceptLink("impulse")+" following the damage.\
				<br />No effect on "+conceptLink("base")+"s and "+conceptLink("starbase")+"s";
			break;
		case "random weapon group destroyed": // 5 or 9
			displayTxt = "Each time a "+conceptLink("ship")+" sustains this condition, one of their weapon groups has been permanently destroyed.";
			break;
		case "manuevering thruster damage": // 6
			headingTxt = "Manuevering Thruster Damage +X";
			displayTxt = conceptLink("Ship")+"s that have this condition have a permanently increased "+conceptLink("turn radius")+" corresponding to the indicated amount. Maxes out at +2. \
				No effect on "+conceptLink("base")+"s and "+conceptLink("starbase")+"s";
			break;
		case "power relay damage": // 8
			displayTxt = conceptLink("Ship")+"s that have this condition have a permanently reduced "+conceptLink("power")+" output, starting with the next "+conceptLink("power phase")+". \
				Maxes out at -2.<br/>"+conceptLink("AI")+" ships that roll this condition instead take 1 additional "+conceptLink("hull")+" damage.";
			break;
		case "ftl offline": // 10. Also adds 1 hull dmg
			headingTxt = "FTL Offline";
			displayTxt = conceptLink("Ship")+"s that have this condition are unable to use FTL to "+conceptLink("retreat")+". Repaired at the end of the "+conceptLink("battle")+".";
			break;
		case "power loss": // 11
			displayTxt = conceptLink("Ship")+"s that have this condition are unable to receive "+conceptLink("power")+" from any source, \
				nor adjust their "+conceptLink("power curve")+" or recharge weapons, until repaired with a 6 at the end of an "+conceptLink("impulse")+" following the damage.\
				<br />"+conceptLink("AI")+" ships that roll this condition instead take 1 additional "+conceptLink("hull")+" damage.";
			break;
		case "ftl core breach": // 12
			headingTxt = "FTL Core Breach";
			displayTxt = "Unfortunate "+conceptLink("ship")+"s that have this condition "+conceptLink("explode")+" instantly!";
			break;
		case "explode":
			// Double fall thru
		case "exploding":
		case "explosion":
			headingTxt = "Explosion";
			displayTxt = "A "+conceptLink("ship")+" that loses all of its "+conceptLink("hull")+" points <i>or</i> suffers a meltdown with their FTL core explodes, \
				causing damage to other ships in the same "+conceptLink("hex")+" <i>and</i> in adjacent hexes. The ship is then removed from play.\
				<br /><br />"+conceptLink("Fighter")+"s and "+conceptLink("missile")+"s do not explode when their hull strength is reduced to 0. \
				Once the last unit in the group is destroyed the counter is simply removed from play.";
			break;
			
		// Ships only in Talon
		case "scout-e":
			headingTxt = "Scout-E (SCE)";
			displayTxt = "Slightly cheaper variant that has reduced "+conceptLink("shield")+"ing and only a front weapon arc<br />";
			displayTxt = displayTxt + statsTalon("Terran", 33, "Phaser", "1/1/1/1", 2);
			break;
		case "frigate":
			headingTxt = "Frigate (FF)";
			displayTxt = "Faction-exclusive light ship<br />";
			displayTxt = displayTxt + statsTalon("Talon", 44, "Disruptor x2", "3/2/2/2", 3);
			break;
		case "frigate-e":
			headingTxt = "Frigate-E (FFE)";
			displayTxt = "Cheaper variant that carries half the firepower<br />";
			displayTxt = displayTxt + statsTalon("Talon", 37, "Disruptor", "3/2/2/2", 3);
			break;
		case "destroyer-d":
			headingTxt = "Destroyer-D (DDD)";
			displayTxt = "Faction-exclusive variant that uses only "+conceptLink("Disruptor")+"s. Rivals with the "+conceptLink("Destroyer-P")+"<br />";
			displayTxt = displayTxt + statsTalon("Talon", 51, "Disruptor x3", "4/2/2/2", 4);
			break;
		case "destroyer-e":
			headingTxt = "Destroyer-E (DDE)";
			displayTxt = "Faction-exclusive variant that forgoes "+conceptLink("batteries")+" and side weapons, but less expensive to bring to battle<br />";
			displayTxt = displayTxt + statsTalon("Terran", 45, "Anti-Matter Torpedo", "3/3/3/2", 4);
			break;
		case "destroyer-g":
			headingTxt = "Destroyer-G (DDG)";
			displayTxt = "<b class=\"headOx\">Destroyer-G</b> (DDG)<br />Faction-exclusive variant that carries extra firepower<br />";
			displayTxt = displayTxt + statsTalon("Talon", 69, "Missile Launcher x3", "5/4/4/3", 4);
			break;
		case "destroyer-p":
			headingTxt = "Destroyer-P (DDP)";
			displayTxt = "<b class=\"headOx\">Destroyer-P</b> (DDP)<br />Faction-exclusive variant that uses only "+conceptLink("Phaser")+"s. Rivals with the "+conceptLink("Destroyer-D")+"<br />";
			displayTxt = displayTxt + statsTalon("Terran", 59, "Phaser x2", "3/3/3/2", 4);
			break;
		case "light cruiser-e":
			headingTxt = "Light Cruiser-E (CLE)";
			displayTxt = "Cheaper variant that omits side weapon arcs<br />";
			displayTxt = displayTxt + statsTalon("Terran", 79, "Phaser + Anti-Matter Torpedo", "5/4/4/3", 5);
			displayTxt = displayTxt + statsTalon("Talon", 77, "Disruptor x2", "5/3/3/3", 5);
			break;
		case "light cruiser":
			headingTxt = "Light Cruiser (CL)";
			displayTxt = "Medium-Light ship<br />";
			displayTxt = displayTxt + statsTalon("Terran", 88, "Phaser + Anti-Matter Torpedo", "5/4/4/3", 5);
			displayTxt = displayTxt + statsTalon("Talon", 88, "Dual Disruptors + Disruptor", "6/3/3/3", 5);
			displayTxt = displayTxt + statsTalon("AI", 100, "Laser x2 + Cobalt Cannon", "5/5/5/3", 5);
			break;
		case "light cruiser-p":
			headingTxt = "Light Cruiser-P (CLP)";
			displayTxt = "Faction-exclusive variant that uses only "+conceptLink("Phaser")+"s<br />";
			displayTxt = displayTxt + statsTalon("Terran", 90, "Phaser x2 + Dual Phasers", "5/4/4/3", 5);
			break;
		case "light cruiser-x":
			headingTxt = "Light Cruiser-X (CLX)";
			displayTxt = "Improved variant that features 270 degree coverage<br />";
			displayTxt = displayTxt + statsTalon("Terran", 97, "Anti-Matter Torpedo x2", "5/5/5/4", 5);
			displayTxt = displayTxt + statsTalon("Talon", 102, "Dual Disruptors + Disruptor", "6/5/5/4", 5);
			break;
		case "heavy cruiser-x":
			headingTxt = "Heav Cruiser-X (CAX)";
			displayTxt = "Improved variant that increases firepower<br />";
			displayTxt = displayTxt + statsTalon("Terran", 124, "Phasers x2 + Dual Anti-Matter Torpedos", "6/5/5/4", 6);
			displayTxt = displayTxt + statsTalon("Talon", 125, "Dual Disruptors x2 + Missile Launcher", "7/4/4/3", 7);
			break;
		case "battlecruiser-h":
			headingTxt = "Battlecruiser-H (BCH)";
			displayTxt = "Alternate variant that uses the respective faction's heavy (expert) weapons<br />";
			displayTxt = displayTxt + statsTalon("Terran", 147, "Phaser x2 + Wave-Motion Gun", "7/6/6/5", 6);
			displayTxt = displayTxt + statsTalon("Talon", 133, "Dual Disruptors + Missile Launcher + Fusion Cannon", "8/5/5/4", 7);
			break;
		case "battlecruiser-x":
			headingTxt = "Battlecruiser-X (BCX)";
			displayTxt = "Improved variant of the "+conceptLink('Battlecruiser')+"<br />";
			displayTxt = displayTxt + statsTalon("Terran", 156, "Phaser + Dual Anti-Matter Torpedos x2", "7/6/6/6", 6);
			displayTxt = displayTxt + statsTalon("Talon", 161, "Dual Disruptors + Disruptor + Dual Missile Launchers x2", "8/5/5/4", 7);
			break;
		

		// Site exclusive concepts
		case "replay center":
			displayTxt = "Program that plays back a playthrough's <q>recording</q>. Can go forwards or backwards, one stage or one <q>key stage</q> at a time.\
				<br />(Usually "+conceptLink("economic phase")+"s or "+conceptLink("power phase")+"s are considered key stages.)\
				<br /><br />Has the ability to remember where a given playthrough was left at, but will forget it if a different playthrough is navigated.";
			break;
		case "game setup":
			// Fall thru
		case "scenario setup":
			headingTxt = "Scenario Setup";
			displayTxt = "Setup layout that shows how the systems and starting forces are laid down at scenario start.";
			break;
		case "battle simulator":
			displayTxt = "Program that simulates "+conceptLink("battle")+"s using its internal dice rolling and targeting systems.<br />\
				"+conceptLink("Doomsday Machine")+" and "+conceptLink("Replicator Solitaire")+" simulations are supported.";
			provideLinks = 1;
			break;
		case "unique designer":
			displayTxt = "Program that allows building/sharing "+conceptLink("Unique Ship")+" configurations.";
			provideLinks = 2;
			break;
		case "zen solitaire":
			displayTxt = "Custom solo scenario that lacks a specific antagonist. The primary objective instead is to explore the entire map, \
				and eliminate any local threats that may be encountered.";
			break;
		case "numsims":
			headingTxt = "Number of Simulations";
			displayTxt = "Number of battles to simulate at once. Battles simulated as a series give a short summary of success rate,\
				<br />followed by detailed ships survived and HP remaining (if against a "+conceptLink("DM")+") on each side.";
			break;
		case "retreatthresh":
			headingTxt = "Retreat Threshold";
			displayTxt = "At how many ships (or less) will the simulator cause surviving player ships to "+conceptLink("retreat")+"?\
				<br />Ships engaged against a "+conceptLink("DM")+" that are unable to damage it will attempt to retreat regardless of this setting.\
				<br />"+conceptLink("Replicator")+" ships will attempt to retreat if player hulls outnumber their hulls at 3:1 or more.";
			break;
		case "threat":
			displayTxt = "Numeric value that determines how threatening this ship group is to a "+conceptLink("Doomsday Machine")+". \
				The highest threat gets focused down by the DM.<br /><br />\
				Generally (assuming no "+conceptLink("weakness")+"es or inability to damage a DM), the threat is calculated as follows: \
				<span style=\"font-family: monospace;\" class=\"bindTxt\">10 - {hullSize} + (1 + {atkToHitDM})^(3-({hullSize}-1)/2) + {DMtoHitGroup}^2.2</span><br />\
				Where {hullSize} is the group "+conceptLink("Hull Size")+", {atkToHitDM} and {DMtoHitGroup} represents the respective final Attack ratings.";
			break;
		case "titantarget":
			headingTxt = "Titan Targeting";
			displayTxt = conceptLink("Titan")+"s that score hits against targets with one "+conceptLink("Hull Size")+" (remaining) effectively waste excess damage.\
				<br />They can be instructed to shoot at bigger targets to attempt to improve the odds.";
			break;
		case "flagpreserve":
			headingTxt = "Flagship Preservation";
			displayTxt = "Because it is impossible to build [more] "+conceptLink("Flagship")+"s, this setting causes the player Flagship to "+conceptLink("retreat")+" at 1 HP remaining.\
				<br /><br />The "+conceptLink("Replicator")+" "+conceptLink("Type Flag")+" will always retreat at 1 HP, if able.";
			break;
		case "raiderprox":
			headingTxt = "Raider Proximity";
			displayTxt = conceptLink("Replicator Solitaire")+"'s environment uses "+conceptLink("Raider")+"s within 3 hexes of the "+conceptLink("battle")+", \
				and whether they have been previously encountered, to determine how many "+conceptLink("Type Scan")+"s to build.";
			break;
		case "minepresence":
			headingTxt = "Mine Presence";
			displayTxt = conceptLink("Replicator Solitaire")+"'s environment uses the presence of "+conceptLink("Mines")+" on the board, \
				whether they are in "+conceptLink("battle")+", and whether they have been previously encountered, to determine how many "+conceptLink("Type SW")+"s to build.";
			break;
		case "ftrpresence":
			headingTxt = "Fighter Presence";
			displayTxt = conceptLink("Replicator Solitaire")+"'s environment uses the presence of "+conceptLink("Fighter")+"s on the board, \
				whether they are in "+conceptLink("battle")+", and whether they have been previously encountered, to determine how many "+conceptLink("Type PD")+"s to build.";
			break;
		
	}
	
	if (!displayTxt.startsWith("<b")) {
		displayTxt = "<b class=\"headOx\">" + headingTxt + "</b><br />" + displayTxt;
	}
	if (!displayTxt.endsWith("</table>")) {
		displayTxt = displayTxt + "<br /><br />";
	}
	switch (provideLinks) {
		case 1:
			displayTxt = displayTxt + "<a class=\"interact\" href=\"/se4x/dmBatSim.htm\" target=\"_blank\">Doomsday Machine simulator</a>\
				<a class=\"interact\" href=\"/se4x/repBatSim.htm\" target=\"_blank\">Replicator Solitaire simulator</a>";
			break;
		
		case 2:
			displayTxt = displayTxt + "<a class=\"interact\" href=\"/se4x/uniqueDesign.htm\" target=\"_blank\">Open Unique Designer</a>";
			break;
	}
	displayTxt = displayTxt + "<a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

function showSpecs4X(namee, XP, autoEquip, atkEquip, defEquip, moveEquip, aux) {
	var infoPanel = document.getElementById("infobox");
	var displayTxt = "";
	var xpLevs = ["Green", "Skilled", "Veteran", "Elite", "Legendary"];
	
	infoPanel.style.maxWidth = "500px";
	
	displayTxt = "<b class=\"headOx\">" + namee + "</b><br />";
	if (autoEquip) {
		displayTxt = displayTxt + "<a href=\"javascript:showBox('upgrade')\">Upgrades</a>: Automatic<br />";
	} else {
		displayTxt = displayTxt + "<a href=\"javascript:showBox('attack')\">Attack</a>: +"+atkEquip+"<br />\
			<a href=\"javascript:showBox('defense')\">Defense</a>: +"+defEquip+"<br />\
			<a href=\"javascript:showBox('movement')\">Movement</a>: "+moveEquip+"<br />";
	}
	
	if (XP >= 0) {
		displayTxt = displayTxt + "<a href=\"javascript:showBox('experience')\">Experience</a>: "+xpLevs[Math.min(XP, xpLevs.length-1)]+"<br />";
	}
	if (aux != null) {
		displayTxt = displayTxt + "Extra <a href=\"javascript:showBox('technology')\">Tech</a>: " + aux + "<br />";
	}
	
	displayTxt = displayTxt + "<br /><a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

function showSpecsTalon(namee, pwrCurve, shields, wepDetails, hullDmg, critDmg, auxFeat) {
	var infoPanel = document.getElementById("infobox");
	var displayTxt = "";
	
	infoPanel.style.maxWidth = "500px";
	
	displayTxt = "<b class=\"headOx\">" + namee + "</b><br />\
		<b><a href=\"javascript:showBox('power curve')\">Power Curve</a></b>: "+pwrCurve+"<br />";
	
	if (shields.length > 0) {
		displayTxt = displayTxt + "<b><a href=\"javascript:showBox('shield')\">Shields</a></b>: ";
		
		for (var s = 0; s < shields.length; s++) {
			displayTxt = displayTxt + shields[s];
			
			if (s + 1 < shields.length) {
				displayTxt = displayTxt + " / ";
			} else {
				displayTxt = displayTxt + "<br />";
			}
		}
	}

	displayTxt = displayTxt + "<b><a href=\"javascript:showBox('hull')\">Hull Damage</a></b>: "+hullDmg+"<br />";
	if (critDmg.length > 0) {
		displayTxt = displayTxt + "<b>Critical Dmg</b>: ";
		
		for (var c = 0; c < critDmg.length; c++) {
			displayTxt = displayTxt + critDmg[c];
			
			if (c + 1 < critDmg.length) {
				displayTxt = displayTxt + " / ";
			} else {
				displayTxt = displayTxt + "<br />";
			}
		}
	}
	
	if (auxFeat.length > 0) {
		displayTxt = displayTxt + "<b>Aux Functions</b>: ";
		
		for (var x = 0; x < auxFeat.length; x++) {
			displayTxt = displayTxt + auxFeat[x];
			
			if (x + 1 < auxFeat.length) {
				displayTxt = displayTxt + " + ";
			} else {
				displayTxt = displayTxt + "<br />";
			}
		}
	}

	
	if (wepDetails.length > 0) {
		displayTxt = displayTxt + "<br /><b>Weapon Banks</b>:";
		
		for (var w = 0; w < wepDetails.length; w++) {
			var quota = [0,0];
			var wepLink = null;

			// Terran weapons
			if (wepDetails[w].name.search("Phaser") >= 0) {
				quota[0] = 1;
				quota[1] = 1;
				wepLink = "Phaser";
			}
			if (wepDetails[w].name.search("Anti-Matter Torpedo") >= 0) {
				quota[0] = 2;
				quota[1] = 2;
				wepLink = "Anti-Matter Torpedo";
			}
			if (wepDetails[w].name.search("Wave-Motion Gun") >= 0) {
				quota[0] = 2;
				quota[1] = 5;
				wepLink = "Wave-Motion Gun";
			}
			
			// Talon weapons
			if (wepDetails[w].name.search("Disruptor") >= 0) {
				quota[0] = 1;
				quota[1] = 2;
				wepLink = "Disruptor";
			}
			if (wepDetails[w].name.search("Missile Launcher") >= 0) {
				quota[0] = 2;
				quota[1] = 0;
				wepLink = "Missile Launcher";
			}
			if (wepDetails[w].name.search("Fusion Cannon") >= 0) {
				quota[0] = 3;
				quota[1] = 3;
				wepLink = "Fusion Cannon";
			}
			
			// AI weapons
			if (wepDetails[w].name.search("Laser") >= 0) {
				quota[0] = 1;
				quota[1] = 0;
				wepLink = "Laser";
			}
			if (wepDetails[w].name.search("Cobalt Cannon") >= 0) {
				quota[0] = 3;
				quota[1] = 0;
				wepLink = "Cobalt Cannon";
			}

			if (wepLink) {
				displayTxt = displayTxt + "<br /><a href=\"javascript:showBox('" + wepLink + "')\">\
					" + wepDetails[w].name + "</a>: ";
			} else {
				displayTxt = displayTxt + "<br />" + wepDetails[w].name + ": ";
			}
			
			// Quantity modifiers
			if (wepDetails[w].name.search("Dual") >= 0) {
				quota[1] *= 2;
			}
			if (wepDetails[w].name.search("Triple") >= 0) {
				quota[1] *= 3;
			}
			
			displayTxt = displayTxt + "<span class=\"chargeR\">";
			for (var r = 0; r < quota[0]; r++) {
				if (wepDetails[w].chargeR < 0) {
					displayTxt = displayTxt + boxFilling[0];
				} else if (wepDetails[w].chargeR > r) {
					displayTxt = displayTxt + boxFilling[2];
				} else {
					displayTxt = displayTxt + boxFilling[1];
				}
			}
			displayTxt = displayTxt + "</span><span class=\"chargeY\">";
			for (var y = 0; y < quota[1]; y++) {
				if (wepDetails[w].chargeR < 0) {
					displayTxt = displayTxt + boxFilling[0];
				} else if (wepDetails[w].chargeY > y) {
					displayTxt = displayTxt + boxFilling[2];
				} else {
					displayTxt = displayTxt + boxFilling[1];
				}
			}
			displayTxt = displayTxt + "</span>";
		}
	}
	
	displayTxt = displayTxt + "<br /><a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

function talWepDmgChart(dmgTable) {
	var buildTable = "<table style=\"margin-bottom: 0px;\"><caption>Damage at Range</caption>";
	var maxDmg = 0;
	
	for (var x = 0; x <= 6; x++) {
		buildTable = buildTable + "<tr>";
		
		for (var y = 0; y <= dmgTable.length; y++) {
			if (x == 0) {
				if (y == 0) {
					buildTable = buildTable + "<th>Roll</th>";
				} else {
					buildTable = buildTable + "<th>&emsp;" + y + "&emsp;</th>";
					
					maxDmg = Math.max(maxDmg, ...dmgTable[y-1])
				}
			} else {
				if (y == 0) {
					buildTable = buildTable + "<th>"+x+"</th>";
				} else {
					var dmgVal = dmgTable[y-1][x-1];
					
					if (dmgVal == 0) {
						buildTable = buildTable + "<td class=\"decrease\">" + dmgVal + "</td>";
					} else if (dmgVal >= maxDmg) {
						buildTable = buildTable + "<td class=\"increase\">" + dmgVal + "</td>";
					} else {
						buildTable = buildTable + "<td>" + dmgVal + "</td>";
					}
				}
			}
		}
		
		buildTable = buildTable + "</tr>";
	}
	
	return buildTable + "</table>";
}

function talWepHitChart(hitTable) {
	var buildTable = "<table style=\"margin-bottom: 0px;\"><caption>Odds chart at range</caption>";
	
	for (var x = 0; x <= 1; x++) {
		buildTable = buildTable + "<tr>";
		
		for (var y = 0; y <= hitTable.length; y++) {
			if (x == 0) {
				if (y == 0) {
					buildTable = buildTable + "<td></td>";
				} else {
					buildTable = buildTable + "<th>" + y + "</th>";
				}
			} else {
				if (y == 0) {
					buildTable = buildTable + "<th>Roll to hit</th>";
				} else {
					buildTable = buildTable + "<td>" + hitTable[y-1] + "</td>";
				}
			}
		}
		
		buildTable = buildTable + "</tr>";
	}
	
	return buildTable + "</table>";
}

function keywordifyDocument() {
	setupBox();
	keywordifyCollection(document.getElementsByTagName("p"));
	keywordifyCollection(document.getElementsByTagName("li"));
}

function keywordifyCollection(collObj) {
	const keyTerms = ["Space Empires 4X", "Close Encounters", "Replicator", "All Good Things", "AGT", "Space Empires Anthology",
		"Replay Center", "Unique Designer", "Zen Solitaire",
		"AI", "Barren", "Campaign", "Colony", "Colonies", "Combat Ship", "CP", "Economic Phase", "Homeworld", "Maintenance", "Planet", "Starship", "Scuttle", "Turn",
		"Bid", "Competitive", "Cooperative", "Galactic Capitol", "Initiative", "Primary Objective", "Uneasy Alliance", "Versus Map", "Victory Point", "VP", "Blood Brothers",
		"Battle", "Battling", "Blockade", "Bombard", "Fleet", "FSB", "Non-Player Alien", "NPA", "Subdue", "Subduing", "Priority Class", "Retreat", "Round", "Screen", "Weakness", "Weapon Class",
		"Alien-D", "Alien-C", "Alien-B", "Doomsday Machine", "DM", "Amoeba", "Alien Empires", "Alien Player", "Economic Roll",
		"Decoy", "Scout", "Destroyer", "Cruiser", "Dreadnought", "Titan", "Ship Yard", "Base", "Mining Ship", "Miner",
		"Minelayer", "Minesweeper", "Carrier", "Raider", "Pipeline", "Unique Ship",
		"Asteroid Belt", "Asteroids", "Black Hole", "Danger", "Deep Space", "Hex", "Home System", "Lost in Space", "Nebula", "Space Wreck", "Supernova", "Unexplored",
		"Warp Point", "Regional Map", "Fold in Space", "Pirate",
		"Technology", "Technologies", "Attack", "Defense", "Exploration", "Movement", "Ship Size", "Tactics", "Terraforming", "Upgrade",
		"Cloaking", "Fighter", "Minelaying", "Minesweeping", "Nanomachine", "Scanning",
		"Quick Start", "Slingshot", "Gearing Limits", "Unpredictable Research", "Research Grant", "Heavy Terrain",
		"Safer Space", "Slow Scientists", "Smart Scientists", "Bloody Combat", "Head Start", "Galactic Situation",
		"Transport", "Troops", "Capture", "Militia", "Light Infantry", "Space Marines", "Heavy Infantry", "Grav Armor", "Drop Ships",
		"Experience", "Facility", "Facilities", "RP", "Boarding", "Security Forces", "Military Academy", "Flagship", "Swallow",
		"Advanced Construction",
		"Empire Advantage", "And We Still Carry Swords", "Industrious Race", "Horsemen of the Plains", "Space Pilgrims", "Traders",
		"Warrior Race", "Ancient Race", "Giant Race", "Master Engineers", "House of Speed", "On the Move", "Longbowmen", "Amazing Diplomats",
		"Advanced Comm Array", "Afterburner", "Air Support", "The Captain's Chair", "Cold Fusion Drive", "Combat Sensors", "Efficient Factories",
		"Electronic Warfare Module", "Holodeck", "Mobile Analysis Bay", "Photon Bomb", "Soylent Purple",
		"Resource Card",
		"Depletion", "Deplete", "Advanced Research", "Self-Preservation",
		"Hull", "Type 0", "Type II", "Type IV", "Type V", "Type IX", "Type XI", "Type XV",
		"Type Exp", "Type Flag", "Type PD", "Type Scan", "Type SW",
		"AP Bot", "AP bot", "EV", "FOB", "Jammer", "Missile", "Morale", "Offense Posture", "Paranoia",
		"Talon", "Terran", "Empire War", "EFV", "SP", "LP", "Deployment Zone", "Reserve",
		"Impulse", "Collide", "Collision", "Power", "Battery", "Batteries", "Side Slip", "Brake", "Shield",
		"Last Ship Standing", "Convoy Intercept", "Orbital Conquest", "Priority Target",
		"Phaser", "Anti-Matter Torpedo", "Wave-Motion Gun", "Disruptor", "Fusion Cannon", "Laser", "Cobalt Cannon",
		"Helm Down", "Random Weapon Group Destroyed", "Manuevering Thruster Damage", "FTL Offline", "FTL Core Breach", "Explode", "Exploding", "Explosion"];
		
	const keyExpressions = [
		{regex: "non-"+conceptLink("combat ship"), newTxt: conceptLink("non-combat ship")},
		{regex: "Non-combat Ship", newTxt: conceptLink("Non-combat Ship")},
		{regex: conceptLink("barren")+" "+conceptLink("planet"), newTxt: conceptLink("barren planet")},
		{regex: conceptLink("Barren")+" "+conceptLink("Planet"), newTxt: conceptLink("Barren Planet")},
		{regex: conceptLink("battle")+conceptLink("cruiser"), newTxt: conceptLink("battlecruiser")},
		{regex: conceptLink("Battle")+conceptLink("cruiser"), newTxt: conceptLink("Battlecruiser")},
		{regex: conceptLink("battle")+"ship", newTxt: conceptLink("battleship")},
		{regex: conceptLink("Battle")+"ship", newTxt: conceptLink("Battleship")},
		{regex: conceptLink("battle")+" simulator", newTxt: conceptLink("battle simulator")},
		{regex: conceptLink("Battle")+" Simulator", newTxt: conceptLink("Battle Simulator")},
		{regex: conceptLink("colony")+" ship", newTxt: conceptLink("colony ship")},
		{regex: conceptLink("Colony")+" Ship", newTxt: conceptLink("Colony Ship")},
		{regex: conceptLink("miner")+"al", newTxt: conceptLink("mineral")},
		{regex: conceptLink("Miner")+"al", newTxt: conceptLink("Mineral")},
		{regex: conceptLink("fleet")+" size bonus", newTxt: conceptLink("fleet size bonus")},
		{regex: conceptLink("Fleet")+" Size Bonus", newTxt: conceptLink("Fleet Size Bonus")},
		{regex: conceptLink("hull")+" size", newTxt: conceptLink("hull size")},
		{regex: conceptLink("Hull")+" Size", newTxt: conceptLink("Hull Size")},
		{regex: conceptLink("fleet")+" launch", newTxt: conceptLink("fleet launch")},
		{regex: conceptLink("Fleet")+" Launch", newTxt: conceptLink("Fleet Launch")},
		{regex: conceptLink("fleet")+" composition", newTxt: conceptLink("fleet composition")},
		{regex: conceptLink("Fleet")+" Composition", newTxt: conceptLink("Fleet Composition")},
		{regex: conceptLink("defense")+" composition", newTxt: conceptLink("defense composition")},
		{regex: conceptLink("Defense")+" Composition", newTxt: conceptLink("Defense Composition")},
		{regex: "hidden "+conceptLink("fleet"), newTxt: conceptLink("hidden fleet")},
		{regex: "Hidden "+conceptLink("Fleet"), newTxt: conceptLink("Hidden Fleet")},
		{regex: conceptLink("raider")+" "+conceptLink("fleet"), newTxt: conceptLink("raider fleet")},
		{regex: conceptLink("Raider")+" "+conceptLink("Fleet"), newTxt: conceptLink("Raider Fleet")},
		{regex: "non-"+conceptLink("raider fleet"), newTxt: conceptLink("non-raider fleet")},
		{regex: "Non-"+conceptLink("raider")+" "+conceptLink("Fleet"), newTxt: conceptLink("Non-raider Fleet")},
		{regex: "expansion "+conceptLink("fleet"), newTxt: conceptLink("expansion fleet")},
		{regex: "Expansion "+conceptLink("Fleet"), newTxt: conceptLink("Expansion Fleet")},
		{regex: "extermination "+conceptLink("fleet"), newTxt: conceptLink("extermination fleet")},
		{regex: "Extermination "+conceptLink("Fleet"), newTxt: conceptLink("Extermination Fleet")},
		{regex: conceptLink("exploration")+" "+conceptLink("DM"), newTxt: conceptLink("exploration DM")},
		{regex: conceptLink("Exploration")+" "+conceptLink("DM"), newTxt: conceptLink("Exploration DM")},
		{regex: "extermination "+conceptLink("DM"), newTxt: conceptLink("extermination DM")},
		{regex: "Extermination "+conceptLink("DM"), newTxt: conceptLink("Extermination DM")},
		{regex: conceptLink("DM")+"1", newTxt: "DM1"},
		{regex: conceptLink("DM")+"2", newTxt: "DM2"},
		{regex: conceptLink("DM")+"3", newTxt: "DM3"},
		{regex: conceptLink("DM")+"4", newTxt: "DM4"},
		{regex: conceptLink("DM")+"5", newTxt: "DM5"},
		{regex: conceptLink("DM")+"6", newTxt: "DM6"},
		{regex: conceptLink("DM")+"7", newTxt: "DM7"},
		{regex: conceptLink("DM")+"8", newTxt: "DM8"},
		{regex: conceptLink("DM")+"9", newTxt: "DM9"},
		{regex: conceptLink("attack")+"er", newTxt: "attacker"},
		{regex: conceptLink("Attack")+"er", newTxt: "Attacker"},
		{regex: conceptLink("danger")+"ous", newTxt: "dangerous"},
		{regex: "re"+conceptLink("turn"), newTxt: "return"},
		{regex: "Data"+conceptLink("base"), newTxt: "Database"},
		{regex: "data"+conceptLink("base"), newTxt: "database"},
		{regex: conceptLink("Base")+"d", newTxt: "Based"},
		{regex: conceptLink("base")+"d", newTxt: "based"},
		{regex: conceptLink("Turn")+"ed", newTxt: "Turned"},
		{regex: conceptLink("turn")+"ed", newTxt: "turned"},
		{regex: "For"+conceptLink("bid"), newTxt: "Forbid"},
		{regex: "for"+conceptLink("bid"), newTxt: "forbid"},
		{regex: "Sa"+conceptLink("turn"), newTxt: "Saturn"},
		{regex: "low "+conceptLink("maintenance"), newTxt: conceptLink("low maintenance")},
		{regex: "Low "+conceptLink("Maintenance"), newTxt: conceptLink("Low Maintenance")},
		{regex: "rich "+conceptLink("minerals"), newTxt: conceptLink("rich minerals")},
		{regex: "Rich "+conceptLink("Minerals"), newTxt: conceptLink("Rich Minerals")},
		{regex: "rich "+conceptLink("colonies"), newTxt: conceptLink("rich colonies")},
		{regex: "Rich "+conceptLink("Colonies"), newTxt: conceptLink("Rich Colonies")},
		{regex: "Point-"+conceptLink("Defense"), newTxt: conceptLink("Point-Defense")},
		{regex: "point-"+conceptLink("pefense"), newTxt: conceptLink("point-defense")},
		{regex: "Space "+conceptLink("Amoeba"), newTxt: conceptLink("Space Amoeba")},
		{regex: "space "+conceptLink("amoeba"), newTxt: conceptLink("space amoeba")},
		{regex: "A"+conceptLink("round"), newTxt: "Around"},
		{regex: "a"+conceptLink("round"), newTxt: "around"},
		{regex: "G"+conceptLink("round"), newTxt: "Ground"},
		{regex: "g"+conceptLink("round"), newTxt: "ground"},
		{regex: "Sur"+conceptLink("round"), newTxt: "Surround"},
		{regex: "sur"+conceptLink("round"), newTxt: "surround"},
		{regex: "Ground Unit", newTxt: conceptLink("Ground Unit")},
		{regex: "ground unit", newTxt: conceptLink("ground unit")},
		{regex: conceptLink("Boarding")+" Ship", newTxt: conceptLink("Boarding Ship")},
		{regex: conceptLink("boarding")+" ship", newTxt: conceptLink("boarding ship")},
		{regex: conceptLink("Black Hole")+" Jumping", newTxt: conceptLink("Black Hole Jumping")},
		{regex: conceptLink("black hole")+" jumping", newTxt: conceptLink("black hole jumping")},
		{regex: "Minesweep "+conceptLink("Jammer"), newTxt: conceptLink("Minesweep Jammer")},
		{regex: "minesweep "+conceptLink("jammer"), newTxt: conceptLink("minesweep jammer")},
		{regex: "Space "+conceptLink("Pirate"), newTxt: conceptLink("Space Pirate")},
		{regex: "space "+conceptLink("pirate"), newTxt: conceptLink("space pirate")},
		{regex: "Green "+conceptLink("Replicator")+"s", newTxt: conceptLink("Green Replicators")},
		{regex: "green "+conceptLink("replicator")+"s", newTxt: conceptLink("green replicators")},
		{regex: "Alien "+conceptLink("Technology"), newTxt: conceptLink("Alien Technology")},
		{regex: "alien "+conceptLink("technology"), newTxt: conceptLink("alien technology")},
		{regex: "Alien "+conceptLink("Technologies"), newTxt: conceptLink("Alien Technologies")},
		{regex: "alien "+conceptLink("technologies"), newTxt: conceptLink("alien technologies")},
		{regex: "Adaptive "+conceptLink("Cloaking")+" Device", newTxt: conceptLink("Adaptive Cloaking Device")},
		{regex: "adaptive "+conceptLink("cloaking")+" device", newTxt: conceptLink("adaptive cloaking device")},
		{regex: conceptLink("replicator")+" solitaire", newTxt: conceptLink("replicator solitaire")},
		{regex: conceptLink("Replicator")+" Solitaire", newTxt: conceptLink("Replicator Solitaire")},
		{regex: "Anti-"+conceptLink("Replicator"), newTxt: conceptLink("Anti-Replicator")},
		{regex: "anti-"+conceptLink("replicator"), newTxt: conceptLink("anti-replicator")},
		{regex: conceptLink("Type V")+"II", newTxt: conceptLink("Type VII")},
		{regex: conceptLink("type v")+"ii", newTxt: conceptLink("type vii")},
		{regex: conceptLink("Type XI")+"II", newTxt: conceptLink("Type XIII")},
		{regex: conceptLink("type xi")+"ii", newTxt: conceptLink("type xiii")},
		{regex: "Fast "+conceptLink("Replicator")+"s", newTxt: conceptLink("Fast Replicators")},
		{regex: conceptLink("Replicator")+" Capitol", newTxt: conceptLink("Replicator Capitol")},
		{regex: "Star"+conceptLink("base"), newTxt: conceptLink("Starbase")},
		{regex: "star"+conceptLink("base"), newTxt: conceptLink("Starbase")},
		{regex: "Buffed "+conceptLink("Cruiser")+"s", newTxt: conceptLink("Buffed Cruisers")},
		{regex: "buffed "+conceptLink("cruiser")+"s", newTxt: conceptLink("buffed cruisers")},
		{regex: conceptLink("Defense")+" Posture", newTxt: conceptLink("Defense Posture")},
		{regex: conceptLink("defense")+" posture", newTxt: conceptLink("defense posture")},
		{regex: conceptLink("Fleet")+" Strategy", newTxt: conceptLink("Fleet Strategy")},
		{regex: conceptLink("fleet")+" strategy", newTxt: conceptLink("fleet strategy")},
		{regex: "Forward Operating "+conceptLink("Base"), newTxt: conceptLink("Forward Operating Base")},
		{regex: "forward operating "+conceptLink("base"), newTxt: conceptLink("forward operating base")},
		{regex: "Shattered "+conceptLink("Fleet"), newTxt: conceptLink("Shattered Fleet")},
		{regex: "shattered "+conceptLink("fleet"), newTxt: conceptLink("shattered fleet")},
		{regex: conceptLink("Exploration")+" Vessel", newTxt: conceptLink("Exploration Vessel")},
		{regex: conceptLink("exploration")+" vessel", newTxt: conceptLink("exploration vessel")},
		{regex: conceptLink("Missile")+" Boat", newTxt: conceptLink("Missile Boat")},
		{regex: conceptLink("missile")+" boat", newTxt: conceptLink("missile boat")},
		{regex: "Light "+conceptLink("Cruiser"), newTxt: conceptLink("Light Cruiser")},
		{regex: "light "+conceptLink("cruiser"), newTxt: conceptLink("light cruiser")},
		{regex: "Heavy "+conceptLink("Cruiser"), newTxt: conceptLink("Heavy Cruiser")},
		{regex: "heavy "+conceptLink("cruiser"), newTxt: conceptLink("heavy cruiser")},
		{regex: conceptLink("Turn")+" Radius", newTxt: conceptLink("Turn Radius")},
		{regex: conceptLink("turn")+" radius", newTxt: conceptLink("turn radius")},
		{regex: conceptLink("Power")+" Curve", newTxt: conceptLink("Power Curve")},
		{regex: conceptLink("power")+" curve", newTxt: conceptLink("power curve")},
		{regex: conceptLink("Power")+" Phase", newTxt: conceptLink("Power Phase")},
		{regex: conceptLink("power")+" phase", newTxt: conceptLink("power phase")},
		{regex: "Over"+conceptLink("power"), newTxt: "Overpower"},
		{regex: "over"+conceptLink("power"), newTxt: "overpower"},
		{regex: "Center "+conceptLink("Hex")+" Row", newTxt: conceptLink("Center Hex Row")},
		{regex: "center "+conceptLink("hex")+" row", newTxt: conceptLink("center hex row")},
		{regex: conceptLink("Base")+" Assault", newTxt: conceptLink("Base Assault")},
		{regex: conceptLink("base")+" assault", newTxt: conceptLink("base assault")},
		{regex: conceptLink("Planet")+"ary Invasion", newTxt: conceptLink("Planetary Invasion")},
		{regex: conceptLink("planet")+"ary invasion", newTxt: conceptLink("planetary invasion")},
		{regex: conceptLink("Priority Target")+" Mission", newTxt: conceptLink("Priority Target Mission")},
		{regex: conceptLink("priority target")+" mission", newTxt: conceptLink("priority target mission")},
		{regex: conceptLink("AI")+" Solitaire", newTxt: conceptLink("AI Solitaire")},
		{regex: conceptLink("AI")+" solitaire", newTxt: conceptLink("AI solitaire")},
		{regex: "Potential "+conceptLink("Priority Target"), newTxt: conceptLink("Potential Priority Target")},
		{regex: "potential "+conceptLink("priority target"), newTxt: conceptLink("potential priority target")},
		{regex: "Estimated "+conceptLink("Fleet")+" Value", newTxt: conceptLink("Estimated Fleet Value")},
		{regex: "estimated "+conceptLink("fleet")+" value", newTxt: conceptLink("estimated fleet value")},
		{regex: conceptLink("Missile")+" Launcher", newTxt: conceptLink("Missile Launcher")},
		{regex: conceptLink("missile")+" launcher", newTxt: conceptLink("missile launcher")},
		{regex: "Secondary "+conceptLink("Explosion"), newTxt: conceptLink("Secondary Explosion")},
		{regex: "secondary "+conceptLink("explosion"), newTxt: conceptLink("secondary explosion")},
		{regex: conceptLink("Shield")+"s Down", newTxt: conceptLink("Shields Down")},
		{regex: conceptLink("shield")+"s down", newTxt: conceptLink("shields down")},
		{regex: conceptLink("Power")+" Relay Damage", newTxt: conceptLink("Power Relay Damage")},
		{regex: conceptLink("power")+" relay damage", newTxt: conceptLink("power relay damage")},
		{regex: conceptLink("Power")+" Loss", newTxt: conceptLink("Power Loss")},
		{regex: conceptLink("power")+" loss", newTxt: conceptLink("power loss")},
		{regex: conceptLink("Talon")+" 1000", newTxt: conceptLink("Talon 1000")},
		{regex: "Energy "+conceptLink("Nebula"), newTxt: conceptLink("Energy Nebula")},
		{regex: "energy "+conceptLink("nebula"), newTxt: conceptLink("energy nebula")},
		{regex: conceptLink("Destroyer")+"-E", newTxt: conceptLink("Destroyer-E")},
		{regex: conceptLink("destroyer")+"-e", newTxt: conceptLink("destroyer-e")},
		{regex: conceptLink("Destroyer")+"-P", newTxt: conceptLink("Destroyer-P")},
		{regex: conceptLink("destroyer")+"-p", newTxt: conceptLink("destroyer-p")},
		{regex: conceptLink("Destroyer")+"-X", newTxt: conceptLink("Destroyer-X")},
		{regex: conceptLink("destroyer")+"-x", newTxt: conceptLink("destroyer-x")},
		{regex: conceptLink("Battlecruiser")+"-X", newTxt: conceptLink("Battlecruiser-X")},
		{regex: conceptLink("battlecruiser")+"-x", newTxt: conceptLink("battlecruiser-x")},
		{regex: "</a>ment", newTxt: "ment</a>"},
		{regex: "</a>ing", newTxt: "ing</a>"},
		{regex: "</a>s", newTxt: "s</a>"},
		{regex: "</a>es", newTxt: "es</a>"},
		{regex: "</a>ed", newTxt: "ed</a>"},
		{regex: "lip</a>ping", newTxt: "lipping</a>"},
		{regex: "lanet</a>ary", newTxt: "lanetary</a>"},
		{regex: "ebula</a>e", newTxt: "ebulae</a>"},
		{regex: "id</a>ding", newTxt: "idding</a>"},
		{regex: "</a>d", newTxt: "d</a>"},
		{regex: "</a>ly", newTxt: "ly</a>"}
		];
	
	if (!replaceAllFailed) {
		try {
			for (var e of collObj) {
				if (!e.innerHTML.startsWith("<a") && !e.className.startsWith("noKeywords")) {
					for (var h = 0; h < keyTerms.length; h++) {
						if (keyTerms[h].toUpperCase() != keyTerms[h] && keyTerms[h].toLowerCase() != keyTerms[h]) {
							e.innerHTML = e.innerHTML.replaceAll(keyTerms[h].toLowerCase(), conceptLink(keyTerms[h].toLowerCase()));
						}
						e.innerHTML = e.innerHTML.replaceAll(keyTerms[h], conceptLink(keyTerms[h]));
					}
					
					for (var g = 0; g < keyExpressions.length; g++) {
						e.innerHTML = e.innerHTML.replaceAll(keyExpressions[g].regex, keyExpressions[g].newTxt);
					}
				}
			}
		} catch(err) {
			console.warn("Unable to use 'innerHTML.replaceAll'. Some words may not be 'keywordified'.");
			replaceAllFailed = true;
		}
	}
	
	if (replaceAllFailed) {
		// Fall back code for older browsers
		for (var e of collObj) {
			if (!e.innerHTML.startsWith("<a") && !e.className.startsWith("noKeywords")) {
				for (var h = 0; h < keyTerms.length; h++) {
					if (keyTerms[h].toUpperCase() != keyTerms[h] && keyTerms[h].toLowerCase() != keyTerms[h]) {
						e.innerHTML = e.innerHTML.replace(keyTerms[h].toLowerCase(), conceptLink(keyTerms[h].toLowerCase()));
					}
					e.innerHTML = e.innerHTML.replace(keyTerms[h], conceptLink(keyTerms[h]));
				}
				
				for (var g = 0; g < keyExpressions.length; g++) {
					e.innerHTML = e.innerHTML.replace(keyExpressions[g].regex, keyExpressions[g].newTxt);
				}
			}
		}
	}
}
