var replaceAllFailed = false;

function setupBox() {
	var bodyPanel = document.getElementsByTagName("body")[0];
	var infoFrag;
	var targetDate = new Date;
	
	infoFrag = document.createElement("div");
	infoFrag.id = "infobox";
	infoFrag.style.position = "fixed";
	infoFrag.style.left = "0px";
	infoFrag.style.right = "0px";
	infoFrag.style.top = "150px";
	infoFrag.style.marginLeft = "auto";
	infoFrag.style.marginRight = "auto";
	infoFrag.style.maxWidth = "1000px";
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

function stats(buildCost, atk, def, hullSize, tac) {
	var fragTxt = "<br /><br />";
	if (buildCost > 0) {
		fragTxt = fragTxt + "<b>Build Cost</b>: "+buildCost+" "+conceptLink("CP")+"<br />";
	}
	if (atk != "0") {
		fragTxt = fragTxt + "<b>"+conceptLink("Attack")+"</b>: "+atk+"<br /><b>"+conceptLink("Defense")+"</b>: "+def+"<br /><b>"+conceptLink("Hull Size")+"</b>: "+hullSize;
		
		if (typeof tac !== "undefined") {
			fragTxt = fragTxt + "<br /><b>"+conceptLink("Tactics")+"</b>: Level "+tac;
		}
	} else {
		fragTxt = fragTxt + conceptLink("Non-combat ship");
	}
	
	return fragTxt;
}

function dmBase(strength) {
	const dmCommonA = "Non-player <q>boss</q> ship that will instantly destroy any undefended "+conceptLink("planet")+" it contests.";
	const dmCommonB = "<br />Equipped with "+conceptLink("Scanning")+" level 2. \
		Immune to "+conceptLink("boarding")+", "+conceptLink("fighter")+"s, "+conceptLink("mines")+", and non-"+conceptLink("amoeba")+" terrain.\
		<br />Prevents the benefits of "+conceptLink("Fleet Size Bonus")+"es and "+conceptLink("combat ship")+" "+conceptLink("screen")+"ing.";
	
	if (strength == "MP") {
		return "<b>Doomsday Machine (Competitive variant)</b><br />"+dmCommonA+dmCommonB+" <span class=\"bindTxt\">Repairs damage in between "+conceptLink("battle")+"s.</span>";
	} else if (strength) {
		return "<b>Doomsday Machine (Strength "+strength+")</b><br />"+dmCommonA+dmCommonB+" <span class=\"bindTxt\">May have a "+conceptLink("weakness")+".</span>";
	}
	
	return "<b>Doomsday Machine</b><br />"+dmCommonA+"<br /><br />As a scenario, the objective is for the human player(s) to \
		defend their "+conceptLink("homeworld")+"(s) and (if present) "+conceptLink("galactic capitol")+" against 3 DMs \
		<span class=\"bindTxt\">(more in a co-op scenario)</span>, each usually stronger than the previous.";
}

function amoebaBase(strength) {
	const amoebaCommon = "Hazardous species that will multiply themselves and attempt to destroy human player(s).";
	
	if (strength == "?") {
		return "<b>Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Automatically destroys <b>all</b> ships (except "+conceptLink("Minesweeper")+"s and "+conceptLink("Minelayer")+"s), until fully researched.";
	} else if (parseInt(strength) > 7) {
		return "<b>Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Vulnerable only from inside detonations.<br /><br />\
			Detonating "+conceptLink("Scout")+"s cleanse the "+conceptLink("hex")+" on a &le;4. "+conceptLink("Destroyer")+"s on a &le;8. \
			"+conceptLink("Cruiser")+"s through "+conceptLink("Titan")+"s cleanse the hex without fail.";
	} else if (strength) {
		return "<b>Space Amoeba (Strength "+strength+")</b><br />"+amoebaCommon+"<br />\
			Immune to "+conceptLink("Cloaking")+" and "+conceptLink("Fighter")+"s unless specified otherwise.\
			<br />Prevents the benefits of "+conceptLink("Fleet Size Bonus")+"es and non-"+conceptLink("Minesweeper")+" "+conceptLink("screen")+"ing. \
			Successful hits "+conceptLink("swallow")+" the victim whole.";
	}
	
	return "<b>Space Amoeba</b><br />"+amoebaCommon+"<br /><br />As a solo scenario, researching and eliminating them are the "+conceptLink("primary objective")+" before the "+conceptLink("homeworld")+" is consumed.<br />Also available in competitive scenarios as an obstacle.";
}

function showBox(concept) {
	var infoPanel = document.getElementById("infobox");
	var displayTxt = "";
	var provideSimLinks = false;
	
	switch (concept.toLowerCase()) {
		// Base Concepts
		case "attack":
			displayTxt = "<b>Attack</b><br />Determines the "+conceptLink("Weapon Class")+" this "+conceptLink("ship")+" has in "+conceptLink("battle")+" (A-F), \
				followed by the maximum d10 roll allowed to score a hit.<br />(Assuming no enemy "+conceptLink("Defense")+" modifiers.)<br /><br />\
				Attack "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+".<br />\
				Attack level 4 is available only to "+conceptLink("Titan")+"s, if "+conceptLink("Advanced Construction")+" level 1 is developed.";
			break;
		case "battle":
			displayTxt = "<b>Battle</b><br />Whenever "+conceptLink("combat ship")+"s from two opposing sides meet in a single "+conceptLink("hex")+", a battle will start, \
				ceasing movement of the invading "+conceptLink("ship")+"s.<br />\
				(Exception: If one side has only "+conceptLink("non-combat ship")+"s, those ships get destroyed instead; without impeding movement.)<br /><br />\
				Battles are dividied into "+conceptLink("round")+"s, lasting until only one side still has combat ships.";
			break;
		case "bid":
			displayTxt = "<b>Bid</b><br />During each "+conceptLink("economic phase")+", players secretly bid any "+conceptLink("CP")+" they wish to set aside\
				to try to steal the "+conceptLink("initiative")+" for the next 3 "+conceptLink("turn")+"s.<br />\
				Bids are revealed after "+conceptLink("colonies")+" have grown. CP spent this way is consumed whether or not a given player wins the bid.<br /><br />\
				The player that wins the bid determines <b>who</b> gains initiative.";
			break;
		case "blockade":
			displayTxt = "<b>Blockade</b><br />A "+conceptLink("colony")+" is blockaded if there are enemy "+conceptLink("combat ship")+"(s) in orbit.\
				Produces no "+conceptLink("CP")+" until the "+conceptLink("hex")+" is clear.";
			break;
		case "blood brothers":
			displayTxt = "<b>Blood Brothers</b><br />Teams with this setting take their "+conceptLink("turn")+"s together. \
				Can stack/attack together, and can use each others' "+conceptLink("Pipeline")+"s for "+conceptLink("movement")+". \
				They still share neither "+conceptLink("CP")+" or "+conceptLink("technology")+".";
			break;
		case "bombard":
			displayTxt = "<b>Bombardment</b><br />A process in which "+conceptLink("combat ship")+"s can damage an enemy "+conceptLink("colony")+", using its "+conceptLink("Attack")+" rating and tech.<br />\
				Each hit scored reduces colony growth by one stage until its production reaches 0 "+conceptLink("CP")+". Limit 1 roll per "+conceptLink("ship")+" per "+conceptLink("turn");
			break;
		case "combat ship":
			displayTxt = "<b>Combat ship</b><br />A "+conceptLink("ship")+" (or group thereof) able to conduct "+conceptLink("battle")+"s and enter "+conceptLink("unexplored")+" systems unassisted. \
				Has at least an "+conceptLink("Attack")+" rating. Can "+conceptLink("blockade")+" and "+conceptLink("bombard")+" "+conceptLink("colonies")+".";
			break;
		case "competitive":
			displayTxt = "<b>Competitive scenario</b><br />A scenario that pits two or more human players against each other. Can be a Free For All, or a Team Game.<br /><br />\
				The default "+conceptLink("primary objective")+" is to be the first player to destroy a hostile "+conceptLink("homeworld")+".";
			break;
		case "cp":
			displayTxt = "<b>Construction Points</b><br />Monetary currency. Earned by developing "+conceptLink("colonies")+", towing "+conceptLink("minerals")+", and connecting "+conceptLink("pipeline")+"s. Used to buy "+conceptLink("technology")+" and build "+conceptLink("ship")+"s.";
			break;
		case "defense":
			displayTxt = "<b>Defense</b><br />Decreases the maximum d10 roll allowed by an attacker to score a hit on this "+conceptLink("ship")+", to a minimum "+conceptLink("Attack")+" rating of 1.<br />\
				(Exception: Minimum Attack versus a "+conceptLink("Titan")+" or a non-competitive "+conceptLink("DM")+" is instead 0.)\
				<br /><br />Defense "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+".\
				<br /><br />As an "+conceptLink("Alien Player")+" bank; this is used whenever one of their "+conceptLink("colonies")+" is being contested,\
				and is built with twice the standard effectiveness.";
			break;
		case "economic phase":
			displayTxt = "<b>Economic Phase</b><br />A simultaneous phase in which all production and spending takes place. There are 3 regular "+conceptLink("turn")+"s in between each economic phase.";
			break;
		case "fleet":
			displayTxt = "<b>Fleet</b><br />A fleet is a collection of "+conceptLink("starship")+"s, usually with a specific purpose.<br /><br />\
				As an "+conceptLink("Alien Player")+" bank, this is spent whenever they launch ships from their "+conceptLink("homeworld")+".";
			break;
		case "fleet size bonus":
			displayTxt = "<b>Fleet Size Bonus</b><br />If one player has at least twice as many un"+conceptLink("screen")+"ed "+conceptLink("combat ship")+"s as their opponent \
				at the start of a battle "+conceptLink("round")+", all their "+conceptLink("ship")+"s get an additional "+conceptLink("Attack")+" +1 for that round.";
			break;
		case "hex":
			displayTxt = "<b>Hex</b><br />A hexagonal-shaped space on a board where pieces (example: counters) can move/be placed to.<br />\
				"+conceptLink("Space Empires 4X")+" + expansions use these to denote systems where "+conceptLink("starship")+"s can move; and where terrain can perform their abilities.";
			break;
		case "hull size":
			displayTxt = "<b>Hull Size</b><br />Determines the amount of damage a "+conceptLink("combat ship")+" can take before being destroyed.<br />\
				Also determines the "+conceptLink("maintenance")+" cost and maximum effective levels for "+conceptLink("Attack")+" and "+conceptLink("Defense")+" "+conceptLink("tech")+"s.";
			break;
		case "initiative":
			displayTxt = "<b>Initiative</b><br />The concept used to determine <i>who</i> goes first each "+conceptLink("turn")+". \
				Can be wrestled by "+conceptLink("bid")+"ding each "+conceptLink("economic phase")+".<br /><br />\
				In solo / co-op scenarios, the environment can impose a fixed quota that applies each economic phase.";
			break;
		case "maintenance":
			displayTxt = "<b>Maintenance</b><br />The upkeep cost ("+conceptLink("CP")+") that must be paid each "+conceptLink("economic phase")+" \
				to maintain existing "+conceptLink("combat ship")+"s. Based on "+conceptLink("Hull Size")+".\
				<br />(Exception: "+conceptLink("Base")+"s, "+conceptLink("Ship Yard")+"s, \
				"+conceptLink("ground unit")+"s, and "+conceptLink("Flagship")+"s require no maintenance.)";
			break;
		case "movement":
			displayTxt = "<b>Movement</b><br />The process of moving "+conceptLink("ship")+"s through space.<br />\
				As a "+conceptLink("technology")+", improving this increases the number of total "+conceptLink("hex")+"es that most "+conceptLink("ship")+"s can move per "+conceptLink("economic phase")+".\
				<br />"+conceptLink("Decoy")+"s aside, "+conceptLink("non-combat ship")+"s have a fixed "+conceptLink("Movement")+" 1.\
				<br /><br />At level 1 (default), ships can move 3 hexes per economic phase (divided into 1 + 1 + 1, for the respective "+conceptLink("turn")+"s.)<br />\
				Each subsequent level adds another hex, favoring the later turns, but keeping it as even as possible. <span class=\"bindTxt\">(1 + 1 + 2 for level 2; 1 + 2 + 2 for level 3)</span>.";
			break;
		case "non-combat ship":
			displayTxt = "<b>Non-combat ship</b><br />A "+conceptLink("ship")+" designed to support the empire, but has no weapons to conduct "+conceptLink("battle")+"s or defend itself.";
			break;
		case "npa":
			// Fall thru
		case "non-player alien":
			displayTxt = "<b>Non-Player Alien</b><br />Non-aligned faction that can guard their local "+conceptLink("barren planet")+". \
				If any "+conceptLink("ship")+"s are found, they must be defeated before the planet can be "+conceptLink("subdue")+"d.";
			break;
		case "primary objective":
			displayTxt = "<b>Primary Objective</b><br />A scenario objective that must be completed in order to achieve victory.";
			break;
		case "retreat":
			displayTxt = "<b>Retreat</b><br />After the first "+conceptLink("battle")+" round, a mobile "+conceptLink("combat ship")+" may choose to retreat instead of fire upon an enemy ship.<br />\
				If it does, it must retreat to an unguarded "+conceptLink("hex")+" that puts it equal to, or closer to the nearest "+conceptLink("colony")+"\
				<span class=\"bindTxt\">(not counting any colony in the battle hex)</span>.";
			break;
		case "round":
			displayTxt = "<b>Battle Round</b><br />At the beginning of each "+conceptLink("battle")+" round, players "+conceptLink("screen")+" (if available) and check for "+conceptLink("Fleet Size Bonus")+" eligibility.\
				<br />Afterwards, "+conceptLink("ship")+"s are organized according to "+conceptLink("Weapon Class")+". Each ship chooses a target, and fires <span class=\"bindTxt\">(rolling a d10)</span>.\
				<br />If the required "+conceptLink("Attack")+" (or less) has been rolled <span class=\"bindTxt\">(minus any target's "+conceptLink("Defense")+" rating)</span>, a hit has been scored.\
				<br />After the first round, whenever a mobile "+conceptLink("combat ship")+" would have its turn to fire, it may instead choose to "+conceptLink("retreat")+".";
			break;
		case "screen":
			displayTxt = "<b>Screening</b><br />If one side has more "+conceptLink("combat ship")+"s than the opposite side each "+conceptLink("battle")+" "+conceptLink("round")+", \
				the larger fleet can screen "+conceptLink("ship")+"s up to the difference.<br />\
				Screened ships may not fire, nor be fired upon, nor do they contribute towads "+conceptLink("Fleet Size Bonus")+". Screen choices last for a full battle round.<br /><br />\
				"+conceptLink("Non-combat ship")+"s are automatically screened for the entire battle, and are eliminated if their protection has been destroyed and/or "+conceptLink("retreat")+"ed.";
			break;
		case "scuttle":
			displayTxt = "<b>Scuttling</b><br />A player may choose to voluntarily remove "+conceptLink("ship")+"s from the board without refund, referred to as scuttling.<br />\
				This process is useful for freeing up counters for reconstruction, and/or to reduce "+conceptLink("maintenance")+" costs.";
			break;
		case "starship":
			// Fall through
		case "ship":
			displayTxt = "<b>Starship</b><br />Spacefaring vessel, able to travel in space. Can be built at a "+conceptLink("Ship Yard")+".";
			break;
		case "subduing":
			// Fall through
		case "subdue":
			displayTxt = "<b>Subdue</b><br />Automatic process that occurs when a "+conceptLink("barren planet")+" loses its last "+conceptLink("NPA")+" defenders.<br /><br />\
				The victor has one chance to conduct a ground "+conceptLink("battle")+". \
				If unsuccessful, the planet is considered uncolonized; no longer able to be "+conceptLink("capture")+"d.";
			break;
		case "space empires 4x":
			displayTxt = "<b>Space Empires 4X</b><br />The base board game. Includes a variety of system counters, "+conceptLink("ship")+" counters, numeric counters.\
				Also includes "+conceptLink("competitive")+" scenarios <span class=\"bindTxt\">(2 - 4 players)</span>, plus two solo scenarios ("+conceptLink("Doomsday Machine")+"s / "+conceptLink("Alien Empires")+").";
			break;
		case "movement turn":
			// Fall through
		case "turn":
			displayTxt = "<b>Turn</b><br />Technically a regular turn. A phase in which each player moves their "+conceptLink("ship")+"s, conducts "+conceptLink("battle")+"s, and explores systems;\
				one player at a time.<br />3 turns occur in between each "+conceptLink("economic phase")+".";
			break;
		case "uneasy alliance":
			displayTxt = "<b>Uneasy Alliance</b><br />Teams with this setting take their "+conceptLink("turn")+"s separately. \
				Can neither stack together, nor can they use each others' "+conceptLink("Pipeline")+"s.";
			break;
		case "vp":
			// Fall through
		case "victory point":
			displayTxt = "<b>Victory Point</b><br />Unique resource acquired by "+conceptLink("competitive")+" players/teams and the <q>environment</q> team.\
				<br />If an eligible player/team reaches the required VP quota, then they achieve victory and the scenario will end.";
			break;
		case "weakness":
			displayTxt = "<b>Weakness</b><br />In the corresponding solo/co-op scenarios, a "+conceptLink("Doomsday Machine")+" may have a weakness, depending on a d10 roll:\
				<br /><br />1-2: Allows "+conceptLink("Fighter")+"s to damage a DM normally\
				<br />3-4: Detonating "+conceptLink("Mines")+" each can deal 1 damage to a DM, via rolling a 5 or less\
				<br />5-6: "+conceptLink("Scanning")+" is jammed. "+conceptLink("Raider")+"s benefit from "+conceptLink("Cloaking")+"\
					and have "+conceptLink("Defense")+" +2\
				<br />7-8: Allows the player to benefit from "+conceptLink("Fleet Size Bonus")+", if they have at least 10 ships able to hit the DM\
				<br />9-10: No weakness was found on this DM";
			break;
		case "priority class":
			// Fall thru; was the previous term
		case "weapon class":
			displayTxt = "<b>Weapon Class</b><br />First factor that determines who can attack first (A &gt; B &gt; C &gt; D &gt; E &gt; F) each "+conceptLink("battle")+" "+conceptLink("round")+". "+conceptLink("Tactics")+" "+conceptLink("technology")+" can break ties.";
			break;
			
		// Technologies
		case "cloaking":
			displayTxt = "<b>Cloaking Technology</b><br />Allows building "+conceptLink("Raider")+"s, \
				which cloak by default, but can be detected or otherwise nullified.<br />\
				If a surprise is achieved, Raiders get Attack +1 on their first turn only.<br />\
				Level 2 upgrades "+conceptLink("Attack")+" to A5/D5 and negates "+conceptLink("Scanning")+" 1.";
			break;
		case "exploration":
			displayTxt = "<b>Exploration Technology</b><br />Level 1 allows "+conceptLink("Cruiser")+"s / "+conceptLink("Flagship")+"s / "+conceptLink("Type Exp")+"s to \
				remotely explore an adjacent "+conceptLink("unexplored")+" "+conceptLink("hex")+" during movement.<br />\
				Level 2 allows "+conceptLink("Base")+"s / "+conceptLink("Ship Yard")+"s / Cruisers / Flagships to \
				respond to an adjacent "+conceptLink("battle")+" hex by sending in reinforcements with the "+conceptLink("React Move")+" ability ("+conceptLink("Close Encounters")+" only).";
			break;
		case "minelaying":
			displayTxt = "<b>Minelaying Technology</b><br />Allows building "+conceptLink("mines")+".";
			break;
		case "minesweeping":
			displayTxt = "<b>Minesweeping Technology</b><br />Allows building "+conceptLink("minesweeper")+"s. "+conceptLink("Tech")+" levels 2/3 improves the number of "+conceptLink("mines")+" swept per ship.\
				<br />"+conceptLink("Alien Player")+" "+conceptLink("Scout")+"s also benefit from this technology.\
				<br /><br />Also doubles as Science Technology versus "+conceptLink("space amoeba")+". Level 2 allows each vessel to roll 2 dice, keeping the best result.\
				<br /><br />"+conceptLink("Replicators")+" instead can build "+conceptLink("Type SW")+" ships. They acquire it for free if they encounter mines.";
			break;
		case "point-defense":
			displayTxt = "<b>Point-Defense Technology</b><br />"+conceptLink("Scout")+"s equipped with this "+conceptLink("technology")+" gain an improved "+conceptLink("Attack")+" rating versus "+conceptLink("Fighter")+"s.\
				<br />At level 1, Scouts attack Fighters at A6. Level 2 at A7. Level 3 at A8. (Assuming no "+conceptLink("asteroids")+" / "+conceptLink("nebula")+" interference.)\
				<br /><br />"+conceptLink("Replicators")+" instead can build "+conceptLink("Type PD")+" ships. They acquire it for free if they encounter fighters.";
			break;
		case "scanning":
			displayTxt = "<b>Scanning Technology</b><br />"+conceptLink("Destroyer")+"s equipped with this "+conceptLink("technology")+" will \
				detect "+conceptLink("Raider")+"s with an equal or lower "+conceptLink("cloaking")+" level.<br /><br />\
				"+conceptLink("Replicators")+" instead can build "+conceptLink("Type Scan")+" ships. They acquire it for free if they encounter raiders.";
			break;
		case "ship size":
			displayTxt = "<b>Ship Size Technology</b><br />Higher "+conceptLink("tech")+" levels allow larger and more powerful "+conceptLink("ship")+"s to be built. The starting tech level is 1.<br /><br />\
				Tech level 2 allows the construction of "+conceptLink("Destroyer")+"s and "+conceptLink("Base")+"s.<br />\
				Tech level 3 allows the construction of "+conceptLink("Cruiser")+"s.<br />\
				Tech level 4 allows the construction of "+conceptLink("Battlecruiser")+"s.<br />\
				Tech level 5 allows the construction of "+conceptLink("Battleship")+"s.<br />\
				Tech level 6 allows the construction of "+conceptLink("Dreadnought")+"s.<br />\
				Tech level 7 allows the construction of "+conceptLink("Titan")+"s. ("+conceptLink("Close Encounters")+" only)";
			break;
		case "tactics":
			displayTxt = "<b>Tactics Technology</b><br />Used to break ties in case two opposing "+conceptLink("combat ship")+"s share the same "+conceptLink("Weapon Class")+". \
				If even this is the same level, then the defender wins the tie.";
			break;
		case "tech":
			// Fall through
		case "technologies":
			// Fall through
		case "technology":
			displayTxt = "<b>Technology</b><br />Developing technologies and levels allow unlocking more powerful "+conceptLink("ship")+"s, weapons, to name a few.\
				Any tech levels purchased affect any ships built in the same "+conceptLink("economic phase")+" (including unlocking new ships).\
				Existing ships are unaffected, but can be "+conceptLink("upgrade")+"d.<br /><br />\
				As an "+conceptLink("Alien Player")+" bank, this is used exclusively for developing technology together with other spending.";
			break;
		case "terraforming":
			displayTxt = "<b>Terraforming Technology</b><br />Level 1 allows colonizing "+conceptLink("barren planet")+"s.<br />\
				Level 2 allows upgraded "+conceptLink("Mining Ship")+"s to harvest from "+conceptLink("nebula")+"e connected to a "+conceptLink("colony")+", \
				at a rate of 5 "+conceptLink("CP")+" per turn. ("+conceptLink("Close Encounters")+" only)";
			break;
		case "upgrade":
			displayTxt = "<b>Upgrade</b><br />If a "+conceptLink("ship")+" has any outdated "+conceptLink("technology")+" as a result of being built prior to any developments, it can be upgraded at a "+conceptLink("Ship Yard")+", at a cost of "+conceptLink("CP")+" equal to its "+conceptLink("Hull Size")+". The ship group must not move for an entire "+conceptLink("turn")+" to perform their upgrades.<br />(Exception: "+conceptLink("Base")+"s, "+conceptLink("Decoy")+"s, and "+conceptLink("Ship Yard")+"s are automatically upgraded at no cost; effective immediately after the tech level purchase.)";
			break;
			
		// Terrain
		case "asteroid belt":
			// Fall through
		case "asteroids":
			displayTxt = "<b>Asteroid Belt</b><br />Inhibits movement of "+conceptLink("ship")+"s, unless following a "+conceptLink("Pipeline")+" network. \
				Nullifies "+conceptLink("Attack")+" "+conceptLink("technology")+" and reduces "+conceptLink("Weapon Class")+" to <b>E</b>.";
			break;
		case "barren":
			// Fall through
		case "barren planet":
			displayTxt = "<b>Barren Planet</b><br />A less hospitable "+conceptLink("planet")+". Not colonizable, unless "+conceptLink("Terraforming")+" "+conceptLink("technology")+" has been developed." +
				"<br />Barren Planets in "+conceptLink("deep space")+" may have "+conceptLink("non-player alien")+"s ambushing any stragglers that explore it, \
				and/or have "+conceptLink("alien technology")+".";
			break;
		case "black hole":
			displayTxt = "<b>Black Hole</b><br />Forces <em>each</em> "+conceptLink("ship")+" that enters to roll a survival d10 roll, unless they follow a "+conceptLink("Pipeline")+" network." +
				"<br />A roll of 6 or less allows the ship to remain. Otherwise, the ship is destroyed.";
			break;
		case "colonies":
			// Fall through
		case "colony":
			displayTxt = "<b>Colony</b><br />A "+conceptLink("planet")+" that has been colonized. Grows in production until it reaches 5 "+conceptLink("CP")+" in income.\
				<br /><br />"+conceptLink("Replicator")+" colonies do not produce CP. Instead, they build "+conceptLink("hull")+"s locally once at full strength.";
			break;
		case "danger":
			displayTxt = "<b>Danger!</b><br />If discovered, this system <em>instantly</em> destroys any "+conceptLink("ship")+"s in the same "+conceptLink("hex")+"! The counter is then removed afterwards.";
			break;
		case "deep space":
			displayTxt = "<b>Deep Space</b><br />A set of "+conceptLink("hex")+"es that spread beyond the players' "+conceptLink("home system")+"s." +
				"<br />These systems have a much higher risk <span class=\"bindTxt\">(several "+conceptLink("Danger")+"! counters, and less predictability)</span>, but higher reward <span class=\"bindTxt\">("+conceptLink("minerals")+" pay better, and there can be "+conceptLink("space wreck")+"s)</span>.";
			break;
		case "fold":
			// Fall through
		case "fold in space":
			displayTxt = "<b>Fold in Space</b><br />Terrain that allows "+conceptLink("ship")+"s to move/explore through it, as if no "+conceptLink("hex")+" existed at all.";
			break;
		case "galactic capitol":
			displayTxt = "<b>Galactic Capitol</b><br />Ancient homeworld. Sanctuary "+conceptLink("hex")+" in "+conceptLink("competitive")+" scenarios that \
				prohibits "+conceptLink("battle")+"s and provides 5 "+conceptLink("CP")+" to each "+conceptLink("Pipeline")+"-connected player.\
				<br /><br />In solo and co-op scenarios (if present), it creates a respawnable 10-"+conceptLink("minerals")+" counter and \
				allows human player(s) to research "+conceptLink("Black Hole Jumping")+". \
				It must also be kept alive. Otherwise, the <q>environment</q> wins the scenario.";
			break;
		case "homeworld":
			displayTxt = "<b>Homeworld</b><br />Starting "+conceptLink("colony")+" for an empire; being the most powerful <span class=\"bindTxt\">(produces &le;30 "+conceptLink("CP")+")</span> and most important colony <span class=\"bindTxt\">(usually a "+conceptLink("primary objective")+")</span>.";
			break;
		case "home system":
			displayTxt = "<b>Home System</b><br />A set of "+conceptLink("hex")+"es that surround a "+conceptLink("homeworld")+". These systems are relatively safe, \
				with usually only a single dangerous "+conceptLink("black hole")+" counter shuffled among these 25 "+conceptLink("unexplored")+" systems.";
			break;
		case "lost":
			// Fall through
		case "lost in space":
			displayTxt = "<b>Lost in Space</b><br />If discovered, this system sends "+conceptLink("ship")+"s in a different, involuntary direction. \
				A die roll is used in a solo or co-op game. In a "+conceptLink("competitive")+" game, an enemy player directs these ships. \
				The counter is then removed afterwards.";
			break;
		case "planet":
			displayTxt = "<b>Planet</b><br />A potentially habitable world. Becomes a "+conceptLink("colony")+" when colonized. Some planets are "+conceptLink("barren")+".";
			break;
		case "regional map":
			displayTxt = "<b>Regional Map</b><br />Terrain allows peeking/exploring adjacent "+conceptLink("hex")+"es, \
				as if the "+conceptLink("ship")+" had "+conceptLink("Exploration")+" "+conceptLink("technology")+". \
				The counter is removed once effects are resolved.";
			break;
		case "minerals":
			displayTxt = "<b>Minerals</b><br />Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to generate a one-time boost in "+conceptLink("CP")+" as shown on the counter(s) unloaded.\
				<br /><br />"+conceptLink("Replicator")+" "+conceptLink("ship")+"s automatically cash them in, gaining the indicated amount directly.";
			break;
		case "nebula":
			displayTxt = "<b>Nebula</b><br />Inhibits movement of "+conceptLink("ship")+"s, unless following a "+conceptLink("Pipeline")+" network. \
				Nullifies "+conceptLink("Defense")+" and "+conceptLink("Cloaking")+" "+conceptLink("technology")+" and reduces "+conceptLink("Weapon Class")+" to <b>E</b>.";
			break;
		case "space wreck":
			displayTxt = "<b>Space Wreck</b><br />Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to develop a free random "+conceptLink("technology")+".\
				<br /><br />"+conceptLink("Replicator")+" "+conceptLink("ship")+"s automatically cash them in, gaining 1 "+conceptLink("RP")+" in the process.";
			break;
		case "supernova":
			displayTxt = "<b>Super Nova</b><br />If discovered, the "+conceptLink("ship")+"s that just explored it must immediately turn back. Serves as an impassable "+conceptLink("hex")+" for the rest of the game.";
			break;
		case "unexplored":
			displayTxt = "<b>Unexplored System</b><br />This system is shrouded in complete mystery. \
				Can be explored by any "+conceptLink("combat ship")+" entering the "+conceptLink("hex")+", or via "+conceptLink("Exploration")+" "+conceptLink("technology")+".\
				<br />"+conceptLink("Non-combat ship")+"s may not enter this system, unless escorted. \
				No player "+conceptLink("ship")+" may enter this system, while occupied by a "+conceptLink("Doomsday Machine")+" or an "+conceptLink("Alien Player")+" ship.";
			break;
		case "warp point":
			displayTxt = "<b>Warp Point</b><br />If two linked warp points are found, they can be traveled directly to each other, as if they were 1 "+conceptLink("hex")+" away from each other.";
			break;
			
		// Ships
		case "decoy":
			displayTxt = "<b>Decoy</b><br />Support ship designed to fool enemies. Can be built at any "+conceptLink("colony")+". Automatically eliminated at the start of a "+conceptLink("battle");
			displayTxt = displayTxt + stats(1, 0, 0, 0);
			break;
		case "ship yard":
			// Fall through
		case "sy":
			displayTxt = "<b>Ship Yard</b><br />Space station able to build more "+conceptLink("ship")+"s. Can not move. Can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase")+
				"<br />Has a dedicated "+conceptLink("technology")+" that determines how many "+conceptLink("hull size")+"s (1 / 1.5 / 2) can be built per SY per "+conceptLink("economic phase")+
				" in a given hex.";
			displayTxt = displayTxt + stats(6, "C3", 0, 1);
			break;
		case "scout":
			// Fall through
		case "sc":
			displayTxt = "<b>Scout</b><br />Light "+conceptLink("combat ship")+" suited for early exploration. Also benefits from "+conceptLink("Point-Defense")+" technology";
			displayTxt = displayTxt + stats(6, "E3", 0, 1);
			break;
		case "colony ship":
			// Fall through
		case "co":
			displayTxt = "<b>Colony Ship</b><br />Support ship designed to colonize new "+conceptLink("planet")+"s, scrapping themselves in the process";
			displayTxt = displayTxt + stats(8, 0, 0, 0);
			break;
		case "mining ship":
			// Fall through
		case "miner":
			displayTxt = "<b>Miner</b><br />Support ship designed to tow "+conceptLink("minerals")+" and "+conceptLink("space wreck")+"s to "+conceptLink("colonies");
			displayTxt = displayTxt + stats(5, 0, 0, 0);
			break;
		case "destroyer":
			// Fall through
		case "dd":
			displayTxt = "<b>Destroyer</b> (DD)<br />Medium-Light "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Scanning")+" technology";
			displayTxt = displayTxt + stats(9, "D4", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 2";
			break;
		case "base":
			displayTxt = "<b>Base</b><br />Starbase with powerful long range weaponry. Can not move. \
				One can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase")+"<br />\
				Automatically "+conceptLink("upgrade")+"s to <b>Advanced Base</b> at "+conceptLink("Advanced Construction")+" 1; \
				those can be built in any hex connected to a "+conceptLink("colony")+" via "+conceptLink("Pipeline");
			displayTxt = displayTxt + stats(12, "A7", 2, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 2";
			break;
		case "cruiser":
			// Fall through
		case "ca":
			displayTxt = "<b>Cruiser</b><br />Medium "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Exploration")+" technology";
			displayTxt = displayTxt + stats(12, "C4", 1, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 3";
			break;
		case "battlecruiser":
			// Fall through
		case "bc":
			displayTxt = "<b>Battlecruiser</b><br />Medium-Heavy "+conceptLink("combat ship")+", theoretically equippable with "+conceptLink("Fastmove")+" technology";
			displayTxt = displayTxt + stats(15, "B5", 1, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 4";
			break;
		case "battleship":
			// Fall through
		case "bb":
			displayTxt = "<b>Battleship</b><br />Heavy "+conceptLink("combat ship")+", theoretically equippable with "+conceptLink("Tractor Beam")+" technology";
			displayTxt = displayTxt + stats(20, "A5", 2, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 5";
			break;
		case "dreadnought":
			// Fall through
		case "dn":
			displayTxt = "<b>Dreadnought</b><br />Huge "+conceptLink("combat ship")+", theoretically equippable with "+conceptLink("Shield Projector")+" technology";
			displayTxt = displayTxt + stats(24, "A6", 3, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 6";
			break;
		
		// Advanced Ships
		case "carrier":
			// Fall through
		case "cv":
			displayTxt = "<b>Carrier</b><br />Combat transport craft, able to carry up to 3 "+conceptLink("Fighter")+"s into space";
			displayTxt = displayTxt + stats(12, "E3", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Fighter")+" tech 1";
			break;
		case "fighter":
			// Fall through
		case "f":
			displayTxt = "<b>Fighter</b><br />Small craft, requires a "+conceptLink("Carrier")+" or "+conceptLink("Titan")+" to move into space. Gains Attack +1 versus Titans.<br />\
				As a technology, each level unlocks a progressively stronger fighter craft. The first level also unlocks Carriers.";
			displayTxt = displayTxt + stats(5, "B5 / B6 / B7 / B8", "0 / 0 / 1 / 2", 1) + "<br />\
				<b>Required Tech</b>: Fighter tech 1-4 + "+conceptLink("Advanced Construction")+" 2 (B8 variant only)";
			break;
		case "minelayer":
			// Fall through
		case "mines":
			displayTxt = "<b>Mines</b><br />Small craft that detonates upon contact with enemy "+conceptLink("ship")+"s, destroying them instantly unless "+conceptLink("sw")+"ept.\
				<br />Also inhibits spreading of "+conceptLink("space amoeba")+" for one "+conceptLink("economic phase")+", though immunity can be acquired.\
				<br />Has fixed "+conceptLink("Movement")+" 1; and may not enter enemy occupied "+conceptLink("hex")+"es, except versus amoeba";
			displayTxt = displayTxt + stats(5, 1, 0, 0) + "<br /><b>Required Tech</b>: "+conceptLink("Minelaying");
			break;
		case "pipeline":
			displayTxt = "<b>Merchant Pipeline</b><br />Support ship able to connect to Pipeline ships in adjacent hexes to assist in movement along a <q>road</q> <span class=\"bindTxt\">(+1 "+conceptLink("hex")+" per "+conceptLink("turn")+" and ignores terrain)</span> and income <span class=\"bindTxt\">(+1 "+conceptLink("CP")+" if it connects a "+conceptLink("colony")+" to the "+conceptLink("homeworld")+")</span>";
			displayTxt = displayTxt + stats(3, 0, 0, 0);
			break;
		case "raider":
			// Fall through
		case "r":
			displayTxt = "<b>Raider</b><br />Sneaky "+conceptLink("combat ship")+", comes cloaked (A) unless detected or nullified (D)";
			displayTxt = displayTxt + stats(12, "A/D4", 0, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Cloaking")+" 1";
			break;
		case "minesweeper":
			// Fall through
		case "sw":
			displayTxt = "<b>Minesweeper</b><br />Utility "+conceptLink("combat ship")+" that sweeps "+conceptLink("mines")+" and researches "+conceptLink("space amoeba");
			displayTxt = displayTxt + stats(6, "E1", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Minesweeping")+" 1";
			break;
			
		// Non-Player Alien ships
		case "alien-d":
			displayTxt = "<b>Alien Destroyer</b><br />Light "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats(0, "D4", 1, 1, 1);
			break;
		case "alien-c":
			displayTxt = "<b>Alien Cruiser</b><br />Medium "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats(0, "C5", 2, 1, 1);
			break;
		case "alien-b":
			displayTxt = "<b>Alien Battlecruiser</b><br />Heavy "+conceptLink("non-player alien")+" ship";
			displayTxt = displayTxt + stats(0, "B6", 2, 1, 1);
			break;
			
		// Optional Rules
		case "quick start":
			displayTxt = "<b>Quick Start</b><br />Optional setup variant that greatly speeds up play, only available in "+conceptLink("competitive")+" scenarios.<br /><br />\
				"+conceptLink("Home system")+"s are pre-explored, and non-"+conceptLink("barren")+" "+conceptLink("planet")+"s are pre-colonized and fully grown;\
				at the expense of starting with no "+conceptLink("colony ship")+"s.";
			break;
		case "low maintenance":
			displayTxt = "<b>Low Maintenance</b><br />A benefit that can be active from an optional rule, Elite "+conceptLink("experience")+", and/or "+conceptLink("alien technology")+".\
				<br />"+conceptLink("Ship")+"s benefiting from one source pay half as much "+conceptLink("maintenance")+" (round down total). \
				Ships benefiting from two or more sources pay no maintenance instead.";
			break;
		case "slingshot":
			displayTxt = "<b>Slingshot</b><br />Optional rule that enables daring "+conceptLink("ship")+"s to attempt to \
				use the "+conceptLink("black hole")+"'s acceleration to sling their way an extra hex.\
				<br />If they do, the threshold to destroy ship(s) decrease (6 &rarr; 4). Does not stack with "+conceptLink("Pipeline")+" bonus.";
			break;
		case "gearing limits":
			displayTxt = "<b>Gearing Limits</b><br />Optional rule that limits a player's ability to invest in "+conceptLink("technology")+".<br />\
				A player can spend as much "+conceptLink("CP")+" as they did in the previous "+conceptLink("economic phase")+", plus 10 more.\
				<br /><br />If combined with "+conceptLink("Unpredictable Research")+", this limit instead applies to "+conceptLink("research grant")+"s.";
			break;
		case "unpredictable research":
			displayTxt = "<b>Unpredictable Research</b><br />Optional rule that requires players to buy "+conceptLink("research grant")+" rolls, \
				instead of buying "+conceptLink("technology")+" directly.";
			break;
		case "research grant":
			displayTxt = "<b>Research Grant</b><br />"+conceptLink("Unpredictable Research")+" roll that is allocated \
				to a given "+conceptLink("technology")+" level, adding 1-10 "+conceptLink("RP")+" while spending 5 "+conceptLink("CP")+".";
			break;
		case "heavy terrain":
			displayTxt = "<b>Heavy Terrain</b><br />Optional rule that causes "+conceptLink("Lost in Space")+" and "+conceptLink("Danger")+" markers \
				to be replaced with another "+conceptLink("deep space")+" system, until stock is exhausted.";
			break;
		case "safer space":
			displayTxt = "<b>Safer Space</b><br />Optional rule that weakens "+conceptLink("Danger")+" markers, \
				allowing a fleet to roll 1 die (8 or less is a success).";
			break;
		case "rich minerals":
			displayTxt = "<b>Rich Minerals</b><br />Optional rule that doubles "+conceptLink("minerals")+" output when cashed in.";
			break;
		case "slow scientists":
			displayTxt = "<b>Slow Scientists</b><br />Optional rule that makes "+conceptLink("technologies")+" 5 "+conceptLink("CP")+" more expensive.";
			break;
		case "smart scientists":
			displayTxt = "<b>Smart Scientists</b><br />Optional rule that makes "+conceptLink("technologies")+" 5 "+conceptLink("CP")+" less expensive.";
			break;
		case "bloody combat":
			displayTxt = "<b>Bloody Combat</b><br />Optional rule that adds an extra "+conceptLink("Attack")+" +1 to all "+conceptLink("combat ship")+"s.";
			break;
		case "rich colonies":
			displayTxt = "<b>Rich Colonies</b><br />Optional rule that improves income \
				of each existing "+conceptLink("colony")+" by 3 "+conceptLink("CP")+" per "+conceptLink("economic phase")+".";
			break;
		case "galactic situation":
			displayTxt = "<b>Galactic Situation</b><br />A more random game that adds up to 3 random optional rules.";
			break;
		case "head start":
			displayTxt = "<b>Head Start</b><br />Optional setup variant that speeds up play, only available in "+conceptLink("competitive")+" scenarios.<br /><br />\
				Players start a "+conceptLink("competitive")+" scenario with any agreed amount of "+conceptLink("CP")+" \
				(usually 75) that can be spent <i>only</i> on "+conceptLink("technology")+".<br />\
				"+conceptLink("Ship Size")+" or "+conceptLink("Movement")+" technology are capped at level 3 during setup. \
				Other technologies can only be bought once this way. A maximum of 10 CP can be taken into the first "+conceptLink("economic phase")+".";
			break;
		
		// Doomsday Machines
		case "doomsday machine":
			// Fall through
		case "dm":
			displayTxt = dmBase(null)
			break;
		case "dmmp":
			displayTxt = dmBase("MP") + stats(0, "C9", 2, 3, 2) + "<br /><b>Attacks per round</b>: 2";
			break;
		case "dm1":
			displayTxt = dmBase(1) + stats(0, "D7", 1, 6, 2) + "<br /><b>Attacks per round</b>: 3";
			break;
		case "dm2":
			displayTxt = dmBase(2) + stats(0, "C7", 1, 7, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm3":
			displayTxt = dmBase(3) + stats(0, "C8", 2, 7, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm4":
			displayTxt = dmBase(4) + stats(0, "C8", 2, 8, 2) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm5":
			displayTxt = dmBase(5) + stats(0, "B9", 2, 8, 2) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm6":
			displayTxt = dmBase(6) + stats(0, "B9", 3, 9, 2) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm7":
			displayTxt = dmBase(7) + stats(0, "B10", 3, 9, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm8":
			displayTxt = dmBase(8) + stats(0, "A10", 3, 10, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm9":
			displayTxt = dmBase(9) + stats(0, "A11", 4, 10, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm10":
			displayTxt = dmBase(10) + stats(0, "A11", 4, 11, 2) + "<br /><b>Attacks per round</b>: 6";
			break;
			
		// Alien Empires
		case "alien empires":
			displayTxt =  "<b>Alien Empires</b><br />Solo or co-op scenario that pits 1-3 human player(s) against 2-3 "+conceptLink("Alien Player")+"s.<br />\
				The human players' objective is to destroy all AP "+conceptLink("homeworld")+"s,\
				while protecting their own and (if present) the "+conceptLink("galactic capitol")+" from destruction.";
			break;
		case "alien player":
			displayTxt =  "<b>Alien Player</b><br />Hostile empire that generates "+conceptLink("CP")+" from \
				1 or more unique "+conceptLink("economic roll")+"s per "+conceptLink("economic phase")+".<br />\
				Available when playing an "+conceptLink("Alien Empires")+" scenario. \
				Starts with "+conceptLink("Minelaying")+" / "+conceptLink("Nanomachine")+" tech, \
				and with a single "+conceptLink("base")+".<br /><br />\
				In "+conceptLink("Victory Point")+" variants, also starts with "+conceptLink("Terraforming")+" 1 and "+conceptLink("Exploration")+" 1.";
			break;
		case "economic roll":
			displayTxt =  "<b>Economic Roll</b><br />Determines where an "+conceptLink("Alien Player")+" should allocate its "+conceptLink("CP")+" \
				("+conceptLink("Fleet")+"s, "+conceptLink("Technology")+", or "+conceptLink("Defense")+"),<br />\
				or if it permanently gains an <em>extra</em> economic roll 3 "+conceptLink("economic phase")+"s from the current phase.<br />\
				CP allocated into Defense are applied with twice the standard effectiveness.";
			break;
		case "expansion bank":
			displayTxt =  "<b>Expansion Bank</b><br />"+conceptLink("Alien Player")+" bank that is usually used to aid in launching bigger "+conceptLink("expansion fleet")+"s.\
				<span class=\"bindTxt\">Can also be used to defend "+conceptLink("colonies")+".</span><br />\
				Can be accumulated only via converting excess "+conceptLink("CP")+" over the "+conceptLink("Defense")+" bank cap. (If any)";
			break;
		case "expansion fleet":
			displayTxt =  "<b>Expansion Fleet</b><br />"+conceptLink("Alien Player")+" "+conceptLink("fleet")+" that focuses on assaulting "+conceptLink("planet")+"s, \
				usually in an effort to "+conceptLink("capture")+" (if able).";
			break;
		case "extermination fleet":
			displayTxt =  "<b>Extermination Fleet</b><br />"+conceptLink("Alien Player")+" "+conceptLink("fleet")+" that focuses on taking a "+conceptLink("homeworld")+" \
				or the "+conceptLink("galactic capitol")+". If these fleets achieve their objective, their team wins the scenario.";
			break;
		case "hidden fleet":
			displayTxt =  "<b>Hidden Fleet</b><br />"+conceptLink("Alien Player")+" "+conceptLink("fleet")+" whose composition is unidentified.\
				Once it enters "+conceptLink("battle")+", it uses its "+conceptLink("nanomachine")+"s to build the ships remotely.";
			break;
		case "nanomachine":
			displayTxt = "<b>Nanomachine Technology</b><br />"+conceptLink("Alien Player")+"-exclusive technology that allows building ships remotely; whenever a\
				given "+conceptLink("fleet")+" first enters a "+conceptLink("battle")+". Rarely used by "+conceptLink("Raider fleet")+"s.<br /><br />\
				A fleet can use only the "+conceptLink("CP")+" that was assigned at the time it was launched. Leftover CP post-construction is returned to the AP's Fleet bank.";
			break;
		case "raider fleet":
			displayTxt =  "<b>Raider Fleet</b><br />"+conceptLink("Alien Player")+" "+conceptLink("fleet")+" that contains <i>only</i> cloaked "+conceptLink("Raider")+"s. \
				They strive to be sneaky, and avoid combat with superior fleets (in terms of "+conceptLink("CP")+" cost).";
			break;
			
		// Close Encounters concepts
		case "close encounters":
			displayTxt =  "<b>Close Encounters</b><br />First expansion to the base "+conceptLink("Space Empires 4X")+" board game. \
				Adds more tech, "+conceptLink("ground unit")+"s, co-op scenarios, and "+conceptLink("space amoeba");
			break;
		case "boarding":
			displayTxt = "<b>Boarding Technology</b><br />"+conceptLink("Close Encounters")+" technology that allows building "+conceptLink("Boarding Ship")+"s. Level 2 improves boarding odds by 1 point.";
			break;
		case "black hole jumping":
			displayTxt = "<b>Black Hole Jumping Technology</b><br />Available only in non-competitive scenarios involving a "+conceptLink("galactic capitol")+", and only to their allies.\
				<br />Equipped "+conceptLink("ship")+"s become immune to "+conceptLink("black hole")+"s, instead treating them as "+conceptLink("warp point")+"s.\
				Requires "+conceptLink("Movement")+" 3, or below Hard difficulty.";
			break;
		case "bo":
			// Fall through
		case "boarding ship":
			displayTxt = "<b>Boarding Ship</b><br />Specialist ship designed to "+conceptLink("capture")+" enemy ships. Reduced to F1 versus immune targets. No benefit from "+conceptLink("Attack")+" tech";
			displayTxt = displayTxt + stats(12, "F5", 0, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Boarding")+" 1";
			break;
		case "capture":
			displayTxt =  "<b>Capture</b><br />"+conceptLink("Combat Ship")+"s and "+conceptLink("planet")+"s can be captured in the respective "+conceptLink("battle")+"s. \
				Whenever a compatible object gets captured, the victor is the new owner of said object";
			break;
		case "experience":
			displayTxt =  "<b>Experience</b><br />"+conceptLink("Combat Ship")+" groups can gain experience from destroying enemy ships in a "+conceptLink("battle")+".\
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
			displayTxt =  "<b>Facility</b><br />Ground structure that provide permanent benefits. "+conceptLink("Research Center")+"s and \
				"+conceptLink("Industrial Center")+"s can be built on "+conceptLink("colonies")+". Available only with "+conceptLink("Close Encounters")+".";
			break;
		case "fastmove":
			displayTxt = "<b>Fastmove Technology</b><br />"+conceptLink("Close Encounters")+" technology that allows equipped compatible "+conceptLink("ship")+"s to move an extra hex,\
				on the first "+conceptLink("turn")+" of each "+conceptLink("economic phase")+";<br />\
				in addition to any "+conceptLink("movement")+" that would otherwise be normally allowed<br /><br />\
				Level 1: Compatible with "+conceptLink("Battlecruiser")+"s / "+conceptLink("Flagship")+"s / "+conceptLink("Unique Ship")+"s<br />\
				Level 2: Also compatible with "+conceptLink("DestroyerX")+"s / "+conceptLink("Battle Carrier")+"s / "+conceptLink("RaiderX")+"s \
				(requires "+conceptLink("Advanced Construction")+" 1)";
			break;
		case "flagship":
			displayTxt = "<b>Flagship</b><br />"+conceptLink("Close Encounters")+" exclusive ship. \
				Players sometimes start the game with one, but can <i>never</i> build more.<br />\
				Can be upgraded to "+conceptLink("Advanced Flagship")+" at "+conceptLink("Advanced Construction")+" 3.\
				" + stats(0, "B4", 1, 3);
			break;
		case "industrial center":
			displayTxt =  "<b>Industrial Center</b><br />"+conceptLink("Facility")+" that generates 5 "+conceptLink("CP")+". Points generated this way are usable similiar to other sources of CP.";
			break;
		case "military academy":
			displayTxt =  "<b>Military Academy</b><br />"+conceptLink("Close Encounters")+" technology that improves the "+conceptLink("experience")+" system for "+conceptLink("ship")+"s.<br />\
				Level 1 causes newly built ships to start at Skilled. Level 2 makes <i>all</i> ships 10% easier to gain experience.";
			break;
		case "react move":
			displayTxt =  "<b>React Move</b><br />Ships equipped with "+conceptLink("Exploration")+" level 2 can send in ships that have this ability to battle.\
				<br /><br />"+conceptLink("Movement")+" level 3 also grants this ability to \
					"+conceptLink("Scout")+"s, "+conceptLink("Destroyer")+"s, "+conceptLink("Cruiser")+"s, and "+conceptLink("Raider")+"s\
				<br />"+conceptLink("Movement")+" level 4 also affects \
					"+conceptLink("Flagship")+"s, "+conceptLink("Battlecruiser")+"s, and "+conceptLink("Boarding Ship")+"s\
				<br />"+conceptLink("Movement")+" level 5 also affects \
					"+conceptLink("Battleships")+"s, "+conceptLink("Carrier")+"s, "+conceptLink("Battle Carrier")+"s, "+conceptLink("Unique Ship")+"s, and "+conceptLink("Transport")+"s\
				<br />"+conceptLink("Movement")+" level 6 also affects "+conceptLink("Dreadnought")+"s and "+conceptLink("Minesweeper")+"s";
			break;
		case "research center":
			displayTxt =  "<b>Research Center</b><br />"+conceptLink("Facility")+" that generates 5 "+conceptLink("RP")+" each "+conceptLink("economic phase")+". These points are used exclusively to develop new "+conceptLink("technology")+".";
			break;
		case "rp":
			displayTxt = "<b>Research Points</b><br />Specialist monetary currency. \
				"+conceptLink("Research Center")+" currency is spent exclusively to develop new "+conceptLink("technology")+".<br />\
				Resources spent on "+conceptLink("Unpredictable Research")+" rolls also contribute 1-10 RP to given tech level(s).\
				<br /><br />"+conceptLink("Space Amoeba")+" RP is a unique permanent resource. \
				Teams earn this resource by sending "+conceptLink("Minesweeper")+"s into their hexes. \
				<span class=\"bindTxt\">Specifications are learned at 10 RP.</span>\
				<br /><br />"+conceptLink("Replicator")+" RP is also a permanent resource, earned by completing objectives and encountering foreign technology.<br />\
				Whenever the required RP threshold is reached, a new design is simply unlocked.";
			break;
		case "security forces":
			displayTxt = "<b>Security Forces</b><br />"+conceptLink("Close Encounters")+" technology that makes "+conceptLink("ship")+"s resistant to boarding, \
				as if they were 1-2 "+conceptLink("Hull Size")+"s larger (depending on level). Applied instantly to <i>all</i> ships once developed.";
			break;
		case "tn":
			// Fall through
		case "titan":
			displayTxt = "<b>Titan</b><br />Extremely potent <q>baseship</q>. Can carry 3 "+conceptLink("Fighter")+"s if upgraded.\
				Deals <b>2</b> damage per hit. Can instantly destroy "+conceptLink("planet")+"s.<br />Immune to "+conceptLink("Boarding Ship")+"s. \
				Resistant to "+conceptLink("Mines")+" and "+conceptLink("Fleet Size Bonus")+". \
				Weak to "+conceptLink("Fighter")+"s. Unable to "+conceptLink("retreat")+" or be "+conceptLink("screen")+"ed.\
				" + stats(32, "A7", 3, 5) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" 7";
			break;
			
		// Troops concepts
		case "tran":
			// Fall through
		case "transport":
			displayTxt = "<b>Troop Transport</b><br />Utility "+conceptLink("combat ship")+", able to pick up 6 "+conceptLink("ground unit")+"s from friendly "+conceptLink("colonies")+" and use them to invade enemy colonies";
			displayTxt = displayTxt + stats(6, "E1", 1, 1)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 1";
			break;
		case "drop ships":
			displayTxt = "<b>Drop ships</b><br />Upgraded "+conceptLink("Transport")+"s with this ability have "+conceptLink("Defense")+" +1. \
				Additionally, "+conceptLink("ground unit")+"s dropped in order to invade a planet can shoot right away.";
			break;
		case "ground unit":
			displayTxt = "<b>Ground unit</b><br />Small ground-borne craft used by "+conceptLink("Transport")+"s to \
				invade enemy "+conceptLink("colonies")+" in a ground "+conceptLink("battle")+" \
				<span class=\"bindTxt\">(and attempt to "+conceptLink("capture")+" them)</span>; or to defend friendly colonies.<br />\
				1-3 non-"+conceptLink("militia")+" ground units grant the planet a Defense of 1 in a "+conceptLink("bombard")+"ment round. \
				4 or more units Defense 2.";
			break;
		case "troops":
			displayTxt = "<b>Troops</b><br />"+conceptLink("Close Encounters")+" technology that allows building "+conceptLink("ground unit")+"s.<br />\
				Level 1: Allows "+conceptLink("Light Infantry")+" and "+conceptLink("Transport")+"s (researched at start)<br />\
				Level 2: Allows "+conceptLink("Space Marines")+" and "+conceptLink("Heavy Infantry")+"<br /> \
				Level 3: Allows "+conceptLink("Grav Armor")+". \
					Also allows building/upgrading "+conceptLink("Transport")+"s with the "+conceptLink("Drop Ships")+" ability.";
			break;
		case "militia":
			displayTxt = "<b>Militia</b><br />Temporary "+conceptLink("ground unit")+"; granted whenever a colony is in a ground "+conceptLink("battle")+", \
				at a rate of 1 militia per 1 CP income.\
					" + stats(0, "E5", 0, 1);
			break;
		case "inf":
			// Fall through
		case "light infantry":
			displayTxt = "<b>Light Infantry</b><br />Basic "+conceptLink("ground unit")+"\
				" + stats(2, "D5", 1, 1)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 1";
			break;
		case "mar":
			// Fall through
		case "space marines":
			displayTxt = "<b>Space Marines</b><br />Offensive oriented "+conceptLink("ground unit")+". \
				Gains boosted "+conceptLink("Attack")+" rating when used to invade a "+conceptLink("colony")+"\
				"+stats(3, "C6 / D5", 1, 2)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 2";
			break;
		case "hi":
			// Fall through
		case "heavy infantry":
			displayTxt = "<b>Heavy Infantry</b><br />Defensive oriented "+conceptLink("ground unit")+". \
				Gains boosted "+conceptLink("Attack")+" rating when used to defend a "+conceptLink("colony")+"\
				"+stats(3, "D4 / C6", 2, 2)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 2";
			break;
		case "grav":
			// Fall through
		case "grav armor":
			displayTxt = "<b>Grav Armor</b><br />Powerful support "+conceptLink("ground unit")+". \
				At the start of each "+conceptLink("round")+", each uncontested Grav Armor is able to support another ground unit with +1/+1.\
				"+stats(4, "C6", 2, 2)+"<br /><b>Required Tech</b>: "+conceptLink("Troops")+" 3";
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
			displayTxt = amoebaBase(1) + stats(0, "C7", 1, 1, 2);
			break;
		case "sa2":
			displayTxt = amoebaBase(2) + stats(0, "D6", 2, 2, 2);
			break;
		case "sa3":
			displayTxt = amoebaBase(3) + stats(0, "A7", 2, 2, 2)+"<br /><b>Special</b>: Immunity to "+conceptLink("Fighter")+"s nullified";
			break;
		case "sa4":
			displayTxt = amoebaBase(4) + stats(0, "A7 / A5", "2 / 1", 2, 2)+"<br /><b>Special</b>: Strength is reduced when in "+conceptLink("battle")+" with only "+conceptLink("Raider")+"s";
			break;
		case "sa5":
			displayTxt = amoebaBase(5) + stats(0, "B5", 1, 2, 2)+"<br /><b>Special</b>: Starts with <i>2</i> "+conceptLink("swallow")+" rolls per "+conceptLink("round");
			break;
		case "sa6":
			// Fall through
		case "sa7":
			displayTxt = amoebaBase(concept.substr(2)) + stats(0, "A7", 2, 2, 2)+"<br /><b>Special</b>: If in battle with three different types of ships, those ships gain "+conceptLink("Attack")+" +1 each "+conceptLink("round")+" while true";
			break;
		case "sa8":
			// Fall through
		case "sa9":
			// Fall through
		case "sa10":
			displayTxt = amoebaBase(concept.substr(2));
			break;
		case "swallow":
			displayTxt = "<b>Swallowing</b><br />"+conceptLink("Space Amoeba")+" will swallow ships whole whenever they would otherwise damage a ship, \
				at the expense of their "+conceptLink("Attack")+" being further reduced for each "+conceptLink("Hull Size")+" beyond 1.\
				<br /><br />In addition, for each successful swallow that is achieved by 2 or more under the threshold, it gains a chained swallow roll for the "+conceptLink("round")+".";
			break;
			
		// Alien Technologies
		case "alien technology":
			displayTxt = "<b>Alien Technology</b><br />Smaller empire-wide traits that affect an entire empire. \
				Acquired when a "+conceptLink("barren")+" "+conceptLink("planet")+" had their "+conceptLink("non-player alien")+"s eliminated \
				<span class=\"bindTxt\">(assuming no "+conceptLink("Amazing Diplomats")+")</span>, and then colonized or "+conceptLink("capture")+"d.<br /><br />\
				If playing without NPAs, then this technology can be bought when first colonizing a "+conceptLink("deep space")+" barren planet, \
				at the cost of 10 "+conceptLink("CP")+".";
			break;
		case "soylent purple":
			displayTxt = "<b>Soylent Purple</b><br />"+conceptLink("Scout")+"s and "+conceptLink("Destroyer")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "anti-matter warhead":
			displayTxt = "<b>Anti-Matter Warhead</b><br />"+conceptLink("Destroyer")+"s have "+conceptLink("Attack")+" +1, \
				on top of any installed "+conceptLink("technology")+".";
			break;
		case "interlinked targeting computer":
			displayTxt = "<b>Interlinked Targeting Computer</b><br />"+conceptLink("Destroyer")+"s' "+conceptLink("Attack")+" bonus from \
				"+conceptLink("technology")+" is not limited by "+conceptLink("Hull Size")+".";
			break;
		case "polytitanium alloy":
			displayTxt = "<b>Polytitanium Alloy</b><br />"+conceptLink("Destroyer")+"s cost 2 less "+conceptLink("CP")+" to build.";
			break;
		case "long lance torpedo":
			displayTxt = "<b>Long Lance Torpedo</b><br />"+conceptLink("Destroyer")+"s fight at "+conceptLink("Weapon Class")+" B, \
				while outside "+conceptLink("asteroids")+" and "+conceptLink("nebula")+"e. Overrides "+conceptLink("Longbowmen");
			break;
		case "central computer":
			displayTxt = "<b>Central Computer</b><br />"+conceptLink("Cruiser")+"s and "+conceptLink("Battlecruiser")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "resupply depot":
			displayTxt = "<b>Resupply Depot</b><br />"+conceptLink("Battleship")+"s and "+conceptLink("Dreadnought")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "holodeck":
			displayTxt = "<b>Holodeck</b><br />"+conceptLink("Carrier")+"s and "+conceptLink("Fighter")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "cold fusion drive":
			displayTxt = "<b>Cold Fusion Drive</b><br />"+conceptLink("Raider")+"s and "+conceptLink("Minesweeper")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "emissive armor":
			displayTxt = "<b>Emissive Armor</b><br />"+conceptLink("Cruiser")+"s require 1 more damage to be destroyed.";
			break;
		case "electronic warfare module":
			displayTxt = "<b>Electronic Warfare Module</b><br />"+conceptLink("Cruiser")+"s have "+conceptLink("Attack")+" +1, \
				on top of any installed "+conceptLink("technology")+".";
			break;
		case "microwarp drive":
			displayTxt = "<b>Microwarp Drive</b><br />"+conceptLink("Battlecruiser")+"s have "+conceptLink("Attack")+" +1, \
				on top of any installed "+conceptLink("technology")+".";
			break;
		case "combat sensors":
			displayTxt = "<b>Combat Sensors</b><br />"+conceptLink("Battleship")+"s have "+conceptLink("Attack")+" +1, \
				on top of any installed "+conceptLink("technology")+".";
			break;
		case "afterburners":
			displayTxt = "<b>Afterburners</b><br />"+conceptLink("Fighter")+"s have "+conceptLink("Attack")+" +1 \
				whenever they shoot at a ship with "+conceptLink("Hull Size")+" 1 or less \
				(after applying "+conceptLink("Giant Race")+" / "+conceptLink("Insectoids")+" modifiers).";
			break;
		case "photon bomb":
			displayTxt = "<b>Photon Bomb</b><br />"+conceptLink("Fighter")+"s have "+conceptLink("Attack")+" +1 \
				whenever they shoot at a ship with "+conceptLink("Hull Size")+" 2 or more \
				(after applying "+conceptLink("Giant Race")+" / "+conceptLink("Insectoids")+" modifiers).";
			break;
		case "stim packs":
			displayTxt = "<b>Stim Packs</b><br />"+conceptLink("Ground Unit")+"s have "+conceptLink("Attack")+" +1.";
			break;
		case "improved crew quarters":
			displayTxt = "<b>Improved Crew Quarters</b><br />"+conceptLink("Cruiser")+"s cost 3 less "+conceptLink("CP")+" to build.";
			break;
		case "phased warp coil":
			displayTxt = "<b>Phased Warp Coil</b><br />"+conceptLink("Battlecruiser")+"s cost 3 less "+conceptLink("CP")+" to build.";
			break;
		case "phased warp coil":
			displayTxt = "<b>Improved Crew Quarters</b><br />"+conceptLink("Battleship")+"s cost 4 less "+conceptLink("CP")+" to build.";
			break;
		case "the captain's chair":
			displayTxt = "<b>The Captain's Chair</b><br />"+conceptLink("Dreadnought")+"s cost 4 less "+conceptLink("CP")+" to build.";
			break;
		case "efficient factories":
			displayTxt = "<b>Efficient Factories</b><br />"+conceptLink("Colonies")+" that have a natural production of 5 "+conceptLink("CP")+" \
				instead produce 6 CP per "+conceptLink("economic phase")+".";
			break;
		case "omega crystals":
			displayTxt = "<b>Omega Crystals</b><br />Equipped on "+conceptLink("CA")+"s/"+conceptLink("BC")+"s/"+conceptLink("BB")+"s/\
				"+conceptLink("DN")+"s/"+conceptLink("Titan")+"s. Usable once per "+conceptLink("battle")+", \
				this ability forces an <i>entire</i> group to reroll all of their dice.";
			break;
		case "cryogenic stasis pods":
			displayTxt = "<b>Cryogenic Stasis Pods</b><br />"+conceptLink("Boarding Ship")+"s and "+conceptLink("Transport")+"s \
				benefit from "+conceptLink("low maintenance")+".";
			break;
		case "minesweeper jammer":
			displayTxt = "<b>Minesweeper Jammer</b><br />"+conceptLink("Minesweeper")+"s used against the holder are \
				one level less in effectiveness. Reducible to level 0 (0 mines per sweeper).";
			break;
		case "air support":
			displayTxt = "<b>Air Support</b><br />"+conceptLink("Transport")+"s are usable in ground "+conceptLink("battle")+"s, \
				but are unable to be used to "+conceptLink("capture")+" a "+conceptLink("planet")+".\
				"+stats(0, "B6", 2, 2);
			break;
		case "hidden turret":
			displayTxt = "<b>Hidden Turret</b><br />"+conceptLink("Minesweeper")+"s have natural "+conceptLink("Attack")+" E3.";
			break;
		case "stealth field emitter":
			displayTxt = "<b>Stealth Field Emitter</b><br />Victorious ships are immediately un-revealed after "+conceptLink("battle")+".";
			break;
		case "advanced comm array":
			displayTxt = "<b>Advanced Comm Array</b><br />Ships can "+conceptLink("React Move")+" into a hex an opponent moved ships into, \
				as if it was a "+conceptLink("battle")+" hex, \
				at the expense of the reacting player being considered the attacker if there would otherwise be no battle.";
			break;
		case "mobile analysis bay":
			displayTxt = "<b>Mobile Analysis Bay</b><br />New "+conceptLink("technology")+" can be acquired from any captured ship \
				in any "+conceptLink("economic phase")+" without having to scrap them. Usable once per captured ship.";
			break;
		case "adaptive cloaking device":
			displayTxt = "<b>Adaptive Cloaking Device</b><br />"+conceptLink("Raider")+"s gain "+conceptLink("Attack")+" +2 \
				<span class=\"bindTxt\">(instead of +1)</span> in the first round if not detected.<br />\
				Even if detected, Raiders fire at "+conceptLink("Weapon Class")+" A during "+conceptLink("round")+" 1; \
				Class B during round 2; C during round 3; D afterwards.";
			break;
		case "on board workshop":
			displayTxt = "<b>On Board Workshop</b><br />"+conceptLink("Carrier")+"s, "+conceptLink("Battle Carrier")+"s, and "+conceptLink("Titan")+"s \
				can build one "+conceptLink("Fighter")+" per "+conceptLink("economic phase")+", \
				and "+conceptLink("upgrade")+" one Fighter per "+conceptLink("turn")+".";
			break;
		case "superhighway":
			displayTxt = "<b>Superhighway</b><br />Each ship that spends its entire "+conceptLink("movement")+" capacity following a \
				"+conceptLink("Pipeline")+" network can move 2 additional hexes, instead of just 1.";
			break;
			
		// Empire Advantages
		case "empire advantage":
			displayTxt = "<b>Empire Advantage</b><br />Powerful asymmetrical trait that affects an entire empire. \
				Acquired during scenario setup.";
			break;
		case "fearless race":
			displayTxt = "<b>Fearless Race</b><br />For the first "+conceptLink("round")+" of each "+conceptLink("battle")+", \
				this empire's "+conceptLink("combat ship")+"s (excluding "+conceptLink("boarding ship")+"s) shoot at "+conceptLink("Weapon Class")+" A;\
				<br />at the expense of being prohibited from "+conceptLink("retreat")+"ing until after round 3.";
			break;
		case "warrior race":
			displayTxt = "<b>Warrior Race</b><br />"+conceptLink("Attack")+" +1 to non-boarding "+conceptLink("combat ship")+"s in each "+conceptLink("battle")+", \
				where this empire is the attacker. Attack -1 for each battle as the defender.";
			break;
		case "celestial knights":
			displayTxt = "<b>Celestial Knights</b><br />Once per space "+conceptLink("battle")+", at the start of any "+conceptLink("round")+" after the first; \
				this empire may declare a <q>charge</q>, giving <i>each</i> mobile "+conceptLink("combat ship")+" 2 rolls.<br />\
				In return; enemy ships get "+conceptLink("Attack")+" +1 <i>each</i> round after the charge, \
				and the charging empire may not "+conceptLink("retreat")+" until 2 rounds after the charge";
			break;
		case "giant race":
			displayTxt = "<b>Giant Race</b><br />All non-"+conceptLink("Decoy")+" ships are built and managed \
				as if they were one "+conceptLink("Hull Size")+" more. \
				<span class=\"bindTxt\">May never develop "+conceptLink("Fighter")+" tech</span>";
			break;
		case "industrious race":
			displayTxt = "<b>Industrious Race</b><br />"+conceptLink("Terraforming")+" 1 also allows colonizing "+conceptLink("Asteroids")+". \
				Such "+conceptLink("colonies")+" are immune to "+conceptLink("Titan")+"s and invading "+conceptLink("ground unit")+"s,<br />\
				but grant neither Colony "+conceptLink("VP")+"s nor "+conceptLink("alien technology")+".";
			break;
		case "ancient race":
			displayTxt = "<b>Ancient Race</b><br />A limited subset of the systems near the "+conceptLink("homeworld")+" (all adjacent hexes, plus 6 more) \
				are explored at scenario start. Up to 3 non-"+conceptLink("barren")+" "+conceptLink("planet")+"s are pre-colonized (at 0 income), \
				and up to 3 "+conceptLink("minerals")+" are automatically relocated to the "+conceptLink("homeworld")+".";
			break;
		case "space pilgrims":
			displayTxt = "<b>Space Pilgrims</b><br />Empire's ships are unaffected by "+conceptLink("Asteroids")+", "+conceptLink("Nebula")+", \
				"+conceptLink("Black Hole")+"s, and "+conceptLink("Lost in Space")+" markers when moving";
			break;
		case "hive mind":
			displayTxt = "<b>Hive Mind</b><br />Empire adapts to their opponents. Starting at "+conceptLink("round")+" 2 of each "+conceptLink("battle")+", \
				all ships get "+conceptLink("Defense")+" +1. Round 4 "+conceptLink("Attack")+" +1. Round 6 "+conceptLink("Hull Size")+" +1.";
			break;
		case "nano-technology":
			displayTxt = "<b>Nano-Technology</b><br />Ships can choose to "+conceptLink("upgrade")+" anywhere for free. \
				Must still not move for a "+conceptLink("turn")+" to carry out the upgrades.";
			break;
		case "quick learners":
			displayTxt = "<b>Quick Learners</b><br />Empire starts with "+conceptLink("Military Academy")+" 1. \
				2 dice are rolled instead of 1 (taking the best result) when determining whether a ship gains "+conceptLink("experience")+".";
			break;
		case "gifted scientists":
			displayTxt = "<b>Gifted Scientists</b><br />Technologies cost 33% less "+conceptLink("CP")+", \
				at the expense of <i>all</i> ships costing 1 more CP to build.";
			break;
		case "master engineers":
			displayTxt = "<b>Master Engineers</b><br />Ships may choose to move 1 more hex than normally possible, \
				but must roll to overcome their engine instability. On a roll of 9-10, the ship is immobilized for that "+conceptLink("turn")+".";
			break;
		case "insectoids":
			displayTxt = "<b>Insectoids</b><br />All non-"+conceptLink("Decoy")+" ships are built and managed \
				as if they were one "+conceptLink("Hull Size")+" less; \
				except that Size 0 ships require 0.5 "+conceptLink("Ship Yard")+" capacity.<br />\
				May never develop "+conceptLink("Fighter")+" or "+conceptLink("Military Academy")+" tech.";
			break;
		case "immortals":
			displayTxt = "<b>Immortals</b><br />Once per "+conceptLink("round")+", 1 point of damage can be ignored; \
				at the expense of "+conceptLink("Colony Ship")+"s requiring 2 "+conceptLink("CP")+" more to build.<br />\
				May never develop "+conceptLink("Boarding")+" tech. \
				Starts with 0 CP regardless of "+conceptLink("Head Start")+" or "+conceptLink("Empire Advantage")+" bidding. \
				<span class=\"bindTxt\">(before applying bonus from "+conceptLink("replicators")+")</span>";
			break;
		case "expert tacticians":
			displayTxt = "<b>Expert Tacticians</b><br />Empire gains "+conceptLink("Fleet Size Bonus")+" if they outnumber \
				their opponent at all. Opponents do not gain FSB until they outnumber this empire 3:1.";
			break;
		case "horsemen of the plains":
			displayTxt = "<b>Horsemen of the Plains</b><br />Empire's "+conceptLink("combat ships")+" can also choose to "+conceptLink("retreat")+" \
				in between "+conceptLink("round")+"s. Also "+conceptLink("bombard")+"s "+conceptLink("colonies")+" with "+conceptLink("Attack")+" +2.";
			break;
		case "and we still carry swords":
			displayTxt = "<b>And We Still Carry Swords</b><br />Empire starts with "+conceptLink("Troops")+" 2. \
				Their boarding attacks gain +1. Boarding attacks against them get -1.<br />\
				All "+conceptLink("ground unit")+"s gain "+conceptLink("Attack")+" +1 "+conceptLink("Defense")+" +1.";
			break;
		case "amazing diplomats":
			displayTxt = "<b>Amazing Diplomats</b><br />"+conceptLink("Non-Player Alien")+"s and the empire are friendly, \
				as if playing with "+conceptLink("Blood Brothers")+".";
			break;
		case "traders":
			displayTxt = "<b>Traders</b><br />"+conceptLink("Pipeline")+"-connected "+conceptLink("colonies")+" produce an extra +1 "+conceptLink("CP");
			break;
		case "cloaking geniuses":
			displayTxt = "<b>Cloaking Geniuses</b><br />"+conceptLink("Scout")+"s and "+conceptLink("Destroyer")+"s benefit \
				from "+conceptLink("Cloaking")+" 1+. "+conceptLink("Cruiser")+"s benefit from "+conceptLink("Cloaking")+" 2.";
			break;
		case "star wolves":
			displayTxt = "<b>Star Wolves</b><br />Empire's "+conceptLink("Scout")+"s, "+conceptLink("Destroyer")+"s, and "+conceptLink("Fighter")+"s \
				have "+conceptLink("Attack")+" +1 whenever they shoot at a ship with at least "+conceptLink("Hull Size")+" 2.<br />\
				"+conceptLink("Destroyer")+"s also cost 1 less CP.";
			break;
		case "power to the people":
			displayTxt = "<b>Power to the People</b><br />Empire's "+conceptLink("Minelayer")+"s, "+conceptLink("Colony Ship")+"s, \
				"+conceptLink("Miner")+"s, and "+conceptLink("Pipelines")+"s instantly "+conceptLink("upgrade")+" their \
				"+conceptLink("Movement")+" "+conceptLink("technology")+".";
			break;
		case "house of speed":
			displayTxt = "<b>House of Speed</b><br />Empire starts with "+conceptLink("Movement")+" 7, \
				at the expense of their mobile ships getting "+conceptLink("Defense")+" -2.<br />\
				May never develop "+conceptLink("Cloaking")+" tech. \
				Captured "+conceptLink("Raider")+"s are usable, but their "+conceptLink("Movement")+" equipment may not be upgraded.";
			break;
		case "powerful psychics":
			displayTxt = "<b>House of Speed</b><br />Empire starts with "+conceptLink("Exploration")+" level 1. \
				Additionally, they can remotely reveal enemy stacks (but not tech) in an adjacent hex, \
				as if those enemies were sent to "+conceptLink("battle")+".";
			break;
		case "shape shifters":
			displayTxt = "<b>Shape Shifters</b><br />Empire can use any "+conceptLink("combat ship")+" group as if they were "+conceptLink("Decoy")+"s. \
				Such groups can even enter a battle, but are eliminated if they take or deal any damage.";
			break;
		case "on the move":
			displayTxt = "<b>On the Move</b><br />"+conceptLink("Ship Yard")+"s and "+conceptLink("Base")+"s have fixed "+conceptLink("Movement")+" 1. \
				These ships still may never "+conceptLink("retreat")+". "+conceptLink("Ship")+" construction still can only take place at a "+conceptLink("colony")+".";
			break;
		case "longbowmen":
			displayTxt = "<b>Longbowmen</b><br />Empire's ships (except for "+conceptLink("Fighter")+"s) fight as if \
				they were one "+conceptLink("Weapon Class")+" greater, while outside of "+conceptLink("asteroids")+" and "+conceptLink("nebula")+".";
			break;
		// Replicator Advantages
		case "fast replicators":
			displayTxt = "<b>Fast Replicators</b><br />"+conceptLink("Replicators")+" start with an extra "+conceptLink("Movement")+" level. \
				Subsequent levels cost 15 CP (down from 20 CP).";
			break;
		case "green replicators":
			displayTxt = "<b>Green Replicators</b><br />"+conceptLink("Replicator")+" "+conceptLink("colonies")+" \
				last 3 "+conceptLink("economic phase")+"s longer before they begin to "+conceptLink("deplete")+".";
			break;
		case "improved gunnery":
			displayTxt = "<b>Improved Gunnery</b><br />"+conceptLink("Type Flag")+" + "+conceptLink("Type XIII")+" + "+conceptLink("Type XV")+" ships \
				are equipped with "+conceptLink("Second Salvo")+". "+conceptLink("Type V")+" ships gain "+conceptLink("Attack")+" +1.<br />\
				Additionally, upon collecting 4 "+conceptLink("RP")+", all ships gain 1 additional "+conceptLink("Tactics")+".";
			break;
		case "advanced research":
			displayTxt = "<b>Advanced Research</b><br />Replicators begin the game with one [additional] "+conceptLink("RP")+". \
				Additionally, subsequent "+conceptLink("RP")+" require 25 "+conceptLink("CP")+" (down from 30 CP).";
			break;
		case "replicator capitol":
			displayTxt = "<b>Replicator Capitol</b><br />The Replicator homeworld produces 2 Hulls each odd "+conceptLink("economic phase")+".\
				Player also starts with 10 extra "+conceptLink("CP")+".";
			break;
			
		// Unique ship-exclusive concepts
		case "unique ship":
			displayTxt = "<b>Unique Ship</b><br />Fully customizable "+conceptLink("combat ship")+" whose specifications are completely up to the designer";
			break;
		case "mini-fighter bay":
			displayTxt = "<b>Mini-Fighter Bay</b><br />Allows the "+conceptLink("Unique Ship")+" to carry 1 "+conceptLink("Fighter")+"s with it";
			break;
		case "anti-sensor hull":
			displayTxt = "<b>Anti-Sensor Hull</b><br />Allows the "+conceptLink("Unique Ship")+" to be optionally immune to "+conceptLink("mines")+"<br />\
				"+conceptLink("Battle Carrier")+"s are also equipped with this perk ("+conceptLink("Replicators")+" only).";
			break;
		case "shield projector":
			displayTxt = "<b>Shield Projector</b><br />Allows the "+conceptLink("Unique Ship")+" to protect a friendly "+conceptLink("combat ship")+",\
			allowing its mate to fire without fear of being targeted<br />\
				"+conceptLink("Dreadnought")+"s can also research this perk (requires "+conceptLink("Advanced Construction")+" 1).";
			break;
		case "design weakness":
			displayTxt = "<b>Design Weakness</b><br />The "+conceptLink("Unique Ship")+" is weak to one of three types ("+conceptLink("SC")+" / "+conceptLink("DD")+" / "+conceptLink("CA")+"),\
				partially chosen at random. That type gets Attack +2 against this ship.<br />\
				In return, build cost is reduced by 1-2 CP, depending on build cost before applying this ability";
			break;
		case "construction bay":
			displayTxt = "<b>Construction Bay</b><br />Allows the "+conceptLink("Unique Ship")+" to contribute to "+conceptLink("Ship Yard")+" capacity while stationed at a "+conceptLink("colony")+". Counts as a SY for construction purposes by colonies";
			break;
		case "tractor beam":
			displayTxt = "<b>Tractor Beam</b><br />Allows the "+conceptLink("Unique Ship")+" to pull an enemy "+conceptLink("combat ship")+" to it each "+conceptLink("round")+",\
				prohibiting the victim from "+conceptLink("retreat")+"ing.<br />\
				"+conceptLink("Battleship")+"s can also research this perk (requires "+conceptLink("Advanced Construction")+" 1).";
			break;
		case "warp gates":
			displayTxt = "<b>Warp Gates</b><br />Two "+conceptLink("Unique Ship")+"s within 3 "+conceptLink("hex")+"es of each other are considered connected (1 hex apart). \
				Supporting craft may use only one warp gate per "+conceptLink("turn")+".<br /><br />\
				"+conceptLink("Type Exp")+"s and the "+conceptLink("Type Flag")+" gain this perk if \
				the "+conceptLink("Replicators")+" have the matching "+conceptLink("Empire Advantage")+"; \
				and their Type Exps count as one "+conceptLink("hull")+" for construction/conversion purposes.";
			break;
		case "second salvo":
			displayTxt = "<b>Second Salvo</b><br />The first time a "+conceptLink("Unique Ship")+" hits its victim in a "+conceptLink("round")+", it gets to shoot again towards the same hull type.\
				<br />Also available to the largest "+conceptLink("Improved Gunnery")+" "+conceptLink("Replicator")+" ships.";
			break;
		case "heavy warheads":
			displayTxt = "<b>Heavy Warheads</b><br />"+conceptLink("Unique Ship")+"s' minimum "+conceptLink("Attack")+" rating increased to 2, after "+conceptLink("Defense")+" modifiers.\
				(Against a "+conceptLink("Titan")+", the minimum Attack is instead 1)<br />\
				"+conceptLink("DestroyerX")+"es are also equipped with this perk ("+conceptLink("Replicators")+" only).";
			break;
			
		// Replicators concepts (and goodies for regular players)
		case "replicator":
			// Fall through
		case "replicators":
			displayTxt =  "<b>Replicators</b><br />Second expansion to the base "+conceptLink("Space Empires 4X")+" board game.<br />\
				Unique faction; playable by a human, or as the antagonists in "+conceptLink("Replicator Solitaire")+".";
			break;
		case "replicator solitaire":
			displayTxt =  "<b>Replicator Solitaire</b><br />Solo scenario that pits the human player against \
				the "+conceptLink("Replicator")+" <q>environment</q> on a 2-player versus map. \
				<span class=\"bindTxt\">Last "+conceptLink("homeworld")+" standing wins.</span>";
			break;
		case "pirate":
			displayTxt = "<b>Space Pirate</b><br />Non-aligned ship that can be fought or hired by any ships that encounter them.<br />\
				Has fixed "+conceptLink("Movement")+" 4 and "+conceptLink("Fastmove")+" 1. Automatically self-destructs when "+conceptLink("capture")+"d. \
				" + stats(10, "A5", 0, 1, 0);
			break;
		case "resource card":
			displayTxt = "<b>Resource Card</b><br />Card that has unique effects when played, generates "+conceptLink("CP")+" when discarded, \
				or can be used to cancel other resource cards.";
			break;
		case "anti-replicator":
			displayTxt =  "<b>Anti-Replicator Technology</b><br />Allows equipped "+conceptLink("Transports")+" to finish off a \
				"+conceptLink("Replicator")+" "+conceptLink("colony")+" that is already at minimal strength.";
			break;
		case "advanced construction":
			displayTxt =  "<b>Advanced Construction</b><br />"+conceptLink("Replicators")+"-exclusive technology that adds a variety of design variants and upgrades.\
				Requires building a "+conceptLink("ship")+" with at least "+conceptLink("Ship Size")+" 4.\
				<br /><br />Level 1: Allows building "+conceptLink("DestroyerX")+"es, developing "+conceptLink("Attack")+" 4, and upgrading \
					"+conceptLink("Base")+"s/"+conceptLink("Battleship")+"s/"+conceptLink("Dreadnought")+"s\
				<br />Level 2: Allows building "+conceptLink("Fighter")+"s Lv 4, "+conceptLink("Battle Carrier")+"s, and "+conceptLink("MinerX")+"es\
				<br />Level 3: Allows building "+conceptLink("RaiderX")+"es and "+conceptLink("ScoutX")+"es, and upgrading "+conceptLink("Flagship")+"s";
			break;
		case "destroyerx":
			// Fall through
		case "ddx":
			displayTxt = "<b>DestroyerX</b> (DDX)<br />"+conceptLink("Destroyer")+" variant, equipped with "+conceptLink("Heavy Warheads")+", \
				and able to benefit from "+conceptLink("Fastmove")+" 2 technology, and also equip +2/+2\
				" + stats(9, "D4", 0, 1) + "<br /><b>Required Techs</b>: "+conceptLink("Ship Size")+" 2 and "+conceptLink("Advanced Construction")+" 1";
			break;
		case "battle carrier":
			// Fall through
		case "bv":
			displayTxt = "<b>Battle Carrier</b> (BV)<br />Heavy "+conceptLink("Carrier")+" variant, equipped with "+conceptLink("Anti-Sensor Hull")+"s, \
				and able to carry 6 "+conceptLink("Fighter")+"s and benefit from "+conceptLink("Fastmove")+" 2 technology\
				"+ stats(20, "B5", 1, 3) + "<br /><b>Required Techs</b>: "+conceptLink("Fighter")+" 1 and "+conceptLink("Advanced Construction")+" 2";
			break;
		case "minerx":
			displayTxt = "<b>MinerX</b><br />"+conceptLink("Miner")+" variant that benefits from "+conceptLink("Movement")+" technology \
				and automatically "+conceptLink("upgrade")+"s its equipment\
				" + stats(5, 0, 0, 0) + "<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 2";
			break;
		case "raiderx":
			// Fall through
		case "rx":
			displayTxt = "<b>RaiderX</b><br />"+conceptLink("Raider")+"/"+conceptLink("Transport")+" hybrid that can carry 1 "+conceptLink("ground unit")+" \
				and able to benefit from "+conceptLink("Fastmove")+" 2 technology, and also equip +3/+3\
				" + stats(12, "A/D4", 0, 2) + "<br /><b>Required Techs</b>: "+conceptLink("Cloaking")+" 1 + "+conceptLink("Advanced Construction")+" 3";
			break;
		case "scoutx":
			// Fall through
		case "scx":
			displayTxt = "<b>ScoutX</b><br />"+conceptLink("Scout")+" variant that is equipped with "+conceptLink("Movement")+" level + 3 (max level 7) \
				" + stats(6, "E3", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 3";
			break;
		case "advanced flagship":
			displayTxt = "<b>Advanced Flagship</b><br />Upgraded "+conceptLink("Flagship")+" that can use any single "+conceptLink("Unique Ship")+" ability, \
				in addition to standard equipment.\
				" + stats(0, "A5", 3, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Advanced Construction")+" 3";
			break;
			
		// Replicator faction concepts
		case "deplete":
			// Fall through
		case "depletion":
			displayTxt = "<b>Depletion</b><br />"+conceptLink("Replicator")+" "+conceptLink("colonies")+" grow quickly, but also quickly consume their resources.\
				<br />Starting on "+conceptLink("Economic Phase")+" 10 (default), one colony is depleted; \
				rendering its "+conceptLink("planet")+" no longer usable for the rest of the scenario.\
				<br /><br />The "+conceptLink("homeworld")+" is immune to depletion, ensuring the Replicators are always able to produce hulls.";
			break;
		case "self-preservation":
			displayTxt = "<b>Self-Preservation</b><br />In "+conceptLink("Replicator Solitaire")+", "+conceptLink("Replicator")+" "+conceptLink("fleet")+"s will try to avoid \
				"+conceptLink("battle")+"s with Player fleets if the latter has a "+conceptLink("Hull Size")+" advantage of 25% or more.";
			break;
		
			
		// Replicator Ships
		case "hull":
			displayTxt = "<b>Hull</b><br />Unidentified/unspecified "+conceptLink("Replicator")+" hull, worth 1 "+conceptLink("Hull Size");
			break;
		case "type 0":
			displayTxt = "<b>Type 0</b><br />Starter "+conceptLink("Replicator")+" ship" + stats(0, "E2", 0, 1, 0);
			break;
		case "type ii":
			displayTxt = "<b>Type II</b><br />Basic "+conceptLink("Replicator")+" ship\
				" + stats(0, "E4", 1, 1, 0)+"<br /><b>Required "+conceptLink("RP")+"</b>: 2";
			break;
		case "type iv":
			displayTxt = "<b>Type IV</b><br />Light "+conceptLink("Replicator")+" ship\
				" + stats(0, "E5", 1, 1, 0)+"<br /><b>Required "+conceptLink("RP")+"</b>: 4";
			break;
		case "type v":
			displayTxt = "<b>Type V</b><br />Medium-Light "+conceptLink("Replicator")+" ship\
				" + stats(0, "D6", 2, 2, 0)+"<br /><b>Required "+conceptLink("RP")+"</b>: 5";
			break;
		case "type vii":
			displayTxt = "<b>Type VII</b><br />Medium "+conceptLink("Replicator")+" ship\
				" + stats(0, "C6", 2, 2, 1)+"<br /><b>Required "+conceptLink("RP")+"</b>: 7";
			break;
		case "type ix":
			displayTxt = "<b>Type IX</b><br />Advanced Light "+conceptLink("Replicator")+" ship\
				" + stats(0, "D6", 1, 1, 1)+"<br /><b>Required "+conceptLink("RP")+"</b>: 9";
			break;
		case "type xi":
			displayTxt = "<b>Type XI</b><br />Medium-Heavy "+conceptLink("Replicator")+" ship\
				" + stats(0, "B8", 3, 2, 1)+"<br /><b>Required "+conceptLink("RP")+"</b>: 11";
			break;
		case "type xiii":
			displayTxt = "<b>Type XIII</b><br />Heavy "+conceptLink("Replicator")+" ship\
				" + stats(0, "A10", 4, 4, 1)+"<br /><b>Required "+conceptLink("RP")+"</b>: 13\
				<br /><br />Counts as 3 "+conceptLink("hull")+"s for combining/breaking purposes";
			break;
		case "type xv":
			displayTxt = "<b>Type XV</b><br />Huge "+conceptLink("Replicator")+" ship\
				" + stats(0, "A11", 5, 4, 1)+"<br /><b>Required "+conceptLink("RP")+"</b>: 15\
				<br /><br />Counts as 3 "+conceptLink("hull")+"s for combining/breaking purposes";
			break;
		case "type pd":
			displayTxt = "<b>Type PD</b><br />Specialist "+conceptLink("Replicator")+" ship, \
				gains a massive "+conceptLink("Attack")+" bonus versus "+conceptLink("Fighter")+"s<br />\
				Upgrades to A7 versus Fighters once 3 have been shot down in previous "+conceptLink("turn")+"s\
				" + stats(0, "E1 / A6", 0, 1, 0)+"<br /><b>Required Tech</b>: "+conceptLink("Point-Defense");
			break;
		case "type scan":
			displayTxt = "<b>Type Scan</b><br />Specialist "+conceptLink("Replicator")+" ship, \
				equipped with "+conceptLink("Scanning")+" 2 and gains an "+conceptLink("Attack")+" bonus versus cloaked ships\
				" + stats(0, "E1 / C6", 0, 2, 0)+"<br /><b>Required Tech</b>: "+conceptLink("Scanning");
			break;
		case "type sw":
			displayTxt = "<b>Type SW</b><br />Specialist "+conceptLink("Replicator")+" ship, sweeps "+conceptLink("mines")+"<br />\
				Minesweeping effieincy increases (1 &rarr; 2) once 3 mines have been swept in previous "+conceptLink("turn")+"s\
				" + stats(0, "E1", 0, 1, 0)+"<br /><b>Required Tech</b>: "+conceptLink("Minesweeping")+"";
			break;
		case "type exp":
			displayTxt = "<b>Type Exp</b><br />Specialist "+conceptLink("Replicator")+" ship, equipped with "+conceptLink("Exploration")+" 1\
				" + stats(0, "E1", 0, 2, 0)+"<br /><b>Required Tech</b>: "+conceptLink("Exploration");
			break;
		case "type flag":
			displayTxt = "<b>Type Flag</b><br />"+conceptLink("Replicator")+" "+conceptLink("Flagship")+", \
				automatically upgrades as "+conceptLink("RP")+" is acquired" + stats(0, "B1-15", "1-4", 3, 1);
			break;
			
		// All Good Things concepts
		case "all good things":
			displayTxt = "<b>All Good Things</b><br />Third expansion to the base "+conceptLink("Space Empires 4X")+" board game. \
				Currently in development";
			break;
			
		// Site exclusive concepts
		case "battle simulator":
			displayTxt = "<b>Battle Simulator</b><br />Program that simulates "+conceptLink("battle")+"s using its internal dice rolling and targeting systems.<br />\
				"+conceptLink("Doomsday Machine")+" and "+conceptLink("Replicator Solitaire")+" simulations are supported.";
			provideSimLinks = true;
			break;
		case "replay center":
			displayTxt = "<b>Replay Center</b><br />Program that plays back a playthrough's <q>recording</q>. \
				Can go forwards or backwards, one stage or "+conceptLink("economic phase")+"'s worth at a time.\
				<br /><br />Has the ability to remember where a given playthrough was left at, but will forget it if a different playthrough is navigated.";
			break;
		case "numsims":
			displayTxt = "<b>Number of simulations</b><br />Number of battles to simulate at once. \
				Battles simulated as a series give a short summary of success rate,<br />\
				followed by detailed ships survived and HP remaining (if against a "+conceptLink("DM")+") on each side.";
			break;
		case "retreatthresh":
			displayTxt = "<b>Retreat Threshold</b><br />At how many ships (or less) will the simulator cause surviving player ships to "+conceptLink("retreat")+"?\
				<br />Ships engaged against a "+conceptLink("DM")+" that are unable to damage it will attempt to retreat regardless of this setting.\
				<br />"+conceptLink("Replicator")+" ships will attempt to retreat if player hulls outnumber their hulls at 3:1 or more.";
			break;
		case "threat":
			displayTxt = "<b>Threat</b><br />Numeric value that determines how threatening this ship group is to a "+conceptLink("Doomsday Machine")+". \
				The highest threat gets focused down by the DM.<br /><br />\
				Generally (assuming no "+conceptLink("weakness")+"es or inability to damage a DM), the threat is calculated as follows: \
				<span style=\"font-family: monospace;\" class=\"bindTxt\">10 - {hullSize} + (1 + {atkToHitDM})^(3-({hullSize}-1)/2) + {DMtoHitGroup}^2.2</span><br />\
				Where {hullSize} is the group "+conceptLink("Hull Size")+", {atkToHitDM} and {DMtoHitGroup} represents the respective final Attack ratings.";
			break;
		case "titantarget":
			displayTxt = "<b>Titan Targeting</b><br />"+conceptLink("Titan")+"s that score hits against targets with one "+conceptLink("Hull Size")+" (remaining) effectively waste excess damage.\
				<br />They can be instructed to shoot at bigger targets to attempt to improve the odds.";
			break;
		case "flagpreserve":
			displayTxt = "<b>Flagship Preservation</b><br />Because it is impossible to build [more] "+conceptLink("Flagship")+"s, this setting causes the player Flagship to "+conceptLink("retreat")+" at 1 HP remaining.\
				<br /><br />The "+conceptLink("Replicator")+" "+conceptLink("Type Flag")+" will always retreat at 1 HP, if able.";
			break;
		case "raiderprox":
			displayTxt = "<b>Raider Proximity</b><br />"+conceptLink("Replicator Solitaire")+"'s environment uses "+conceptLink("Raider")+"s within 3 hexes of the "+conceptLink("battle")+", \
				and whether Raiders have been previously encountered, to determine how many "+conceptLink("Type Scan")+"s to build.";
			break;
		case "minepresence":
			displayTxt = "<b>Mine Presence</b><br />"+conceptLink("Replicator Solitaire")+"'s environment uses the presence of "+conceptLink("Mines")+" on the board, \
				whether they are in "+conceptLink("battle")+", and whether Mines have been previously encountered, to determine how many "+conceptLink("Type SW")+"s to build.";
			break;
		case "ftrpresence":
			displayTxt = "<b>Fighter Presence</b><br />"+conceptLink("Replicator Solitaire")+"'s environment uses the presence of "+conceptLink("Fighter")+"s on the board, \
				whether they are in "+conceptLink("battle")+", and whether Fighters have been previously encountered, to determine how many "+conceptLink("Type PD")+"s to build.";
			break;
		
	}
	
	displayTxt = displayTxt + "<br /><br />";
	if (provideSimLinks) {
		displayTxt = displayTxt + "<a class=\"interact\" href=\"/se4x/dmBatSim.htm\" target=\"_blank\">Doomsday Machine simulator</a>\
			<a class=\"interact\" href=\"/se4x/repBatSim.htm\" target=\"_blank\">Replicator Solitaire simulator</a>";
	}
	displayTxt = displayTxt + "<a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

function keywordifyDocument() {
	setupBox();
	keywordifyCollection(document.getElementsByTagName("p"));
	keywordifyCollection(document.getElementsByTagName("li"));
}

function keywordifyCollection(collObj) {
	const keyTerms = ["Space Empires 4X", "Close Encounters", "Replicator", "All Good Things", "Replay Center",
		"Barren", "Colony", "Colonies", "Combat Ship", "CP", "Economic Phase", "Homeworld", "Maintenance", "Planet", "Starship", "Scuttle", "Turn",
		"Bid", "Competitive", "Galactic Capitol", "Initiative", "Primary Objective", "Uneasy Alliance", "Victory Point", "VP", "Blood Brothers",
		"Battle", "Blockade", "Bombard", "Fleet", "Non-Player Alien", "NPA", "Subdue", "Subduing", "Priority Class", "Retreat", "Round", "Screen", "Weakness", "Weapon Class",
		"Alien-D", "Alien-C", "Alien-B", "Doomsday Machine", "Amoeba", "Alien Empires", "Alien Player", "Economic Roll",
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
		"Empire Advantage", "And We Still Carry Swords", "Industrious Race", "Horsemen of the Plains", "Space Pilgrims", "Traders", "Warrior Race",
		"Advanced Comm Array", "Air Support", "The Captain's Chair", "Cold Fusion Drive", "Mobile Analysis Bay", "Soylent Purple",
		"Resource Card",
		"Depletion", "Deplete", "Advanced Research", "Self-Preservation",
		"Hull", "Type 0", "Type II", "Type IV", "Type V", "Type IX", "Type XI", "Type XV",
		"Type Exp", "Type Flag", "Type PD", "Type Scan", "Type SW"];
		
	const keyExpressions = [
		{regex: "non-"+conceptLink("combat ship"), newTxt: conceptLink("non-combat ship")},
		{regex: "Non-"+conceptLink("Combat Ship"), newTxt: conceptLink("Non-combat Ship")},
		{regex: conceptLink("battle")+conceptLink("cruiser"), newTxt: conceptLink("battlecruiser")},
		{regex: conceptLink("Battle")+conceptLink("cruiser"), newTxt: conceptLink("Battlecruiser")},
		{regex: conceptLink("battle")+"ship", newTxt: conceptLink("battleship")},
		{regex: conceptLink("Battle")+"ship", newTxt: conceptLink("Battleship")},
		{regex: conceptLink("battle")+" simulator", newTxt: conceptLink("battle simulator")},
		{regex: conceptLink("Battle")+" Simulator", newTxt: conceptLink("Battle Simulator")},
		{regex: conceptLink("colony")+" "+conceptLink("ship"), newTxt: conceptLink("colony ship")},
		{regex: conceptLink("Colony")+" "+conceptLink("Ship"), newTxt: conceptLink("Colony Ship")},
		{regex: conceptLink("miner")+"als", newTxt: conceptLink("minerals")},
		{regex: conceptLink("Miner")+"als", newTxt: conceptLink("Minerals")},
		{regex: conceptLink("fleet")+" size bonus", newTxt: conceptLink("fleet size bonus")},
		{regex: conceptLink("Fleet")+" Size Bonus", newTxt: conceptLink("Fleet Size Bonus")},
		{regex: conceptLink("hull")+" size", newTxt: conceptLink("hull size")},
		{regex: conceptLink("Hull")+" Size", newTxt: conceptLink("Hull Size")},
		{regex: "hidden "+conceptLink("fleet"), newTxt: conceptLink("hidden fleet")},
		{regex: "Hidden "+conceptLink("Fleet"), newTxt: conceptLink("Hidden Fleet")},
		{regex: "raider "+conceptLink("fleet"), newTxt: conceptLink("raider fleet")},
		{regex: "Raider "+conceptLink("Fleet"), newTxt: conceptLink("Raider Fleet")},
		{regex: "expansion "+conceptLink("fleet"), newTxt: conceptLink("expansion fleet")},
		{regex: "Expansion "+conceptLink("Fleet"), newTxt: conceptLink("Expansion Fleet")},
		{regex: "extermination "+conceptLink("fleet"), newTxt: conceptLink("extermination fleet")},
		{regex: "Extermination "+conceptLink("Fleet"), newTxt: conceptLink("Extermination Fleet")},
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
		{regex: "Sa"+conceptLink("turn"), newTxt: "Saturn"},
		{regex: "low "+conceptLink("maintenance"), newTxt: conceptLink("low maintenance")},
		{regex: "Low "+conceptLink("Maintenance"), newTxt: conceptLink("Low Maintenance")},
		{regex: "rich "+conceptLink("minerals"), newTxt: conceptLink("rich minerals")},
		{regex: "Rich "+conceptLink("Minerals"), newTxt: conceptLink("Rich Minerals")},
		{regex: "rich "+conceptLink("colonies"), newTxt: conceptLink("rich colonies")},
		{regex: "Rich "+conceptLink("Colonies"), newTxt: conceptLink("Rich Colonies")},
		{regex: "Point-"+conceptLink("Defense"), newTxt: conceptLink("Point-Defense")},
		{regex: "point-"+conceptLink("pefense"), newTxt: conceptLink("point-defense")},
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
		{regex: "green "+conceptLink("replicator")+"s", newTxt: conceptLink("green replicators")},
		{regex: "Green "+conceptLink("Replicator")+"s", newTxt: conceptLink("Green Replicators")},
		{regex: "Alien "+conceptLink("Technology"), newTxt: conceptLink("Alien Technology")},
		{regex: "alien "+conceptLink("technology"), newTxt: conceptLink("alien technology")},
		{regex: "Adaptive "+conceptLink("Cloaking")+" Device", newTxt: conceptLink("Adaptive Cloaking Device")},
		{regex: "adaptive "+conceptLink("cloaking")+" device", newTxt: conceptLink("adaptive cloaking device")},
		{regex: conceptLink("Minesweeper")+" Jammer", newTxt: conceptLink("Minesweeper Jammer")},
		{regex: conceptLink("minesweeper")+" jammer", newTxt: conceptLink("minesweeper jammer")},
		{regex: conceptLink("replicator")+" solitaire", newTxt: conceptLink("replicator solitaire")},
		{regex: conceptLink("Replicator")+" Solitaire", newTxt: conceptLink("Replicator Solitaire")},
		{regex: "Anti-"+conceptLink("Replicator"), newTxt: conceptLink("Anti-Replicator")},
		{regex: "anti-"+conceptLink("replicator"), newTxt: conceptLink("anti-replicator")},
		{regex: conceptLink("Type V")+"II", newTxt: conceptLink("Type VII")},
		{regex: conceptLink("type v")+"ii", newTxt: conceptLink("type vii")},
		{regex: conceptLink("Type XI")+"II", newTxt: conceptLink("Type XIII")},
		{regex: conceptLink("type xi")+"ii", newTxt: conceptLink("type xiii")},
		{regex: "Fast "+conceptLink("Replicator")+"s", newTxt: conceptLink("Fast Replicators")},
		{regex: "</a>ment", newTxt: "ment</a>"},
		{regex: "</a>ing", newTxt: "ing</a>"},
		{regex: "</a>s", newTxt: "s</a>"},
		{regex: "</a>es", newTxt: "es</a>"},
		{regex: "</a>ed", newTxt: "ed</a>"},
		{regex: "</a>d", newTxt: "d</a>"}
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
