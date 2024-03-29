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

function conceptLink(keyterm) {
	return "<a href=\"javascript:showBox('"+keyterm+"')\">"+keyterm+"</a>";
}

function stats(buildCost, atk, def, hullSize) {
	var fragTxt = "<br /><br />";
	if (buildCost > 0) {
		fragTxt = fragTxt + "<b>Build Cost</b>: "+buildCost+" "+conceptLink("CP")+"<br />";
	}
	if (atk != "0") {
		fragTxt = fragTxt + "<b>"+conceptLink("Attack")+"</b>: "+atk+"<br /><b>"+conceptLink("Defense")+"</b>: "+def+"<br /><b>"+conceptLink("Hull Size")+"</b>: "+hullSize;
	} else {
		fragTxt = fragTxt + conceptLink("Non-combat ship");
	}
	
	return fragTxt;
}

function dmBase(strength) {
	const dmCommon = "Non-player <q>boss</q> ship that will instantly destroy any undefended "+conceptLink("planet")+" it comes into contact with." +
		"<br />Equipped with "+conceptLink("Tactics")+" level 2 and "+conceptLink("Scanning")+" level 2. Immune to "+conceptLink("asteroids")+", "+conceptLink("black hole")+"s, "+conceptLink("boarding")+", "+conceptLink("fighters")+", "+conceptLink("mines")+", and "+conceptLink("supernova")+"s." +
		"<br />Prevents the benefits of "+conceptLink("Fleet Size Bonus")+"es and "+conceptLink("combat ship")+" "+conceptLink("screen")+"ing.";
	
	if (strength == "MP") {
		return "<b>Doomsday Machine (Competitive variant)</b><br />"+dmCommon+" <span class=\"bindTxt\">Repairs damage in between "+conceptLink("battle")+"s.</span>";
	} else if (strength) {
		return "<b>Doomsday Machine (Strength "+strength+")</b><br />"+dmCommon+" <span class=\"bindTxt\">May have a "+conceptLink("weakness")+".</span>";
	}
	
	return "<b>Doomsday Machine</b><br />"+dmCommon+"<br /><br />As a scenario, the objective is for the human player(s) to defend their "+conceptLink("homeworld")+"(s) and "+conceptLink("galactic capitol")+" against 3 DMs (sometimes more), each usually stronger than the previous.";
}

function showBox(concept) {
	var infoPanel = document.getElementById("infobox");
	var displayTxt = "";
	
	switch (concept.toLowerCase()) {
		// Base Concepts
		case "alien ship":
			displayTxt = "<b>Alien Ship</b><br />Non-aligned ship that guards a "+conceptLink("barren planet")+". If any are found, they must be defeated before the planet can be colonized.";
			break;
		case "attack":
			displayTxt = "<b>Attack</b><br />Determines the "+conceptLink("Priority Class")+" this ship has in "+conceptLink("battle")+" (A-F), followed by the maximum d10 roll allowed to score a hit.<br />\
				(Assuming no enemy "+conceptLink("Defense")+" modifiers.)<br /><br />\
				Attack "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+".";
			break;
		case "battle":
			displayTxt = "<b>Battle</b><br />Whenever "+conceptLink("combat ship")+"s from two opposing sides meet in a single hex, a battle will start, ceasing movement of the invading ships.<br />\
				(Exception: If one side has only "+conceptLink("non-combat ship")+"s, those ships get destroyed instead; without impeding movement.)<br /><br />\
				Battles are dividied into "+conceptLink("round")+"s, lasting until only one side still has combat ships.";
			break;
		case "bid":
			displayTxt = "<b>Bid</b><br />During each "+conceptLink("economic phase")+", players secretly bid any "+conceptLink("CP")+" they wish to set aside\
				to try to steal the initative for the next 3 "+conceptLink("turn")+"s.<br />\
				Bids are revealed after "+conceptLink("colonies")+" have grown. CP spent this way is consumed whether or not a given player wins the bid.<br /><br />\
				The player that wins the initative determines <b>who</b> goes first.";
			break;
		case "blockade":
			displayTxt = "<b>Blockade</b><br />A "+conceptLink("colony")+" is blockaded if there are enemy "+conceptLink("combat ship")+"(s) in orbit.\
				Produces no "+conceptLink("CP")+" until the hex is clear.";
			break;
		case "bombard":
			displayTxt = "<b>Bombardment</b><br />A process in which "+conceptLink("combat ship")+"s can damage an enemy "+conceptLink("colony")+", using its "+conceptLink("Attack")+" rating and tech.<br />\
				Each hit scored reduces colony growth by one stage until its production reaches 0 "+conceptLink("CP")+". Limit 1 roll per ship per "+conceptLink("turn");
			break;
		case "combat ship":
			displayTxt = "<b>Combat ship</b><br />A ship able to conduct "+conceptLink("battle")+"s and enter "+conceptLink("unexplored")+" systems unassisted. Has at least an "+conceptLink("Attack")+" rating. Can "+conceptLink("blockade")+" and "+conceptLink("bombard")+" "+conceptLink("colonies")+".";
			break;
		case "competitive":
			displayTxt = "<b>Competitive scenario</b><br />A scenario that pits two or more human players against each other. Can be a Free For All, or a Team Game.<br /><br />\
				Unless overridden by the scenario and/or variant(s), the first player to destroy a hostile "+conceptLink("homeworld")+" is the winner.";
			break;
		case "cp":
			displayTxt = "<b>Construction Points</b><br />Monetary currency. Earned by developing "+conceptLink("colonies")+", towing "+conceptLink("minerals")+", and connecting "+conceptLink("pipeline")+"s. Used to buy "+conceptLink("technology")+" and build ships.";
			break;
		case "defense":
			displayTxt = "<b>Defense</b><br />Decreases the maximum d10 roll allowed by an attacker to score a hit on this ship, to a minimum "+conceptLink("Attack")+" rating of 1.<br />(Exception: Minimum Attack versus a "+conceptLink("DM")+" or a "+conceptLink("Titan")+" is instead 0.)" +
				"<br /><br />Defense "+conceptLink("technology")+" adds directly to this rating, up to the maximum "+conceptLink("Hull Size")+".";
			break;
		case "economic phase":
			displayTxt = "<b>Economic Phase</b><br />A simultaneous phase in which all production and spending takes place. There are 3 regular "+conceptLink("turn")+"s in between each economic phase.";
			break;
		case "fleet size bonus":
			displayTxt = "<b>Fleet Size Bonus</b><br />If one player has at least twice as many un"+conceptLink("screen")+"ed ships as their opponent at the start of a battle "+conceptLink("round")+", all their ships get an additional "+conceptLink("Attack")+" +1 for that round.";
			break;
		case "hull size":
			displayTxt = "<b>Hull Size</b><br />Determines the amount of damage a ship can take before being destroyed.<br />\
				Also determines the "+conceptLink("maintenance")+" cost and maximum effective levels for "+conceptLink("Attack")+" and "+conceptLink("Defense")+" "+conceptLink("tech")+"s.";
			break;
		case "maintenance":
			displayTxt = "<b>Maintenance</b><br />The upkeep cost ("+conceptLink("CP")+") that must be paid each "+conceptLink("economic phase")+" to maintain existing "+conceptLink("combat ship")+"s. Based on "+conceptLink("Hull Size")+"." +
				"<br />(Exception: "+conceptLink("Base")+"s, "+conceptLink("Ship Yard")+"s, and "+conceptLink("Flagship")+"s require no maintenance.)";
			break;
		case "movement":
			displayTxt = "<b>Movement</b><br />The process of moving ships through space.<br /><br />\
				As a "+conceptLink("technology")+", improving this increases the number of total hexes that "+conceptLink("combat ship")+"s and "+conceptLink("Decoy")+"s can move per "+conceptLink("economic phase")+".<br />\
				At level 1 (default), ships can move 3 hexes per economic phase (divided into 1 + 1 + 1, for the respective "+conceptLink("turn")+"s.)<br />\
				Each subsequent level adds another hex, favoring the later turns, but keeping it as even as possible. <span class=\"bindTxt\">(1 + 1 + 2 for level 2; 1 + 2 + 2 for level 3)</span>.";
			break;
		case "non-combat ship":
			displayTxt = "<b>Non-combat ship</b><br />A ship designed to support the empire, but has no weapons to conduct "+conceptLink("battle")+"s or defend itself.";
			break;
		case "priority class":
			displayTxt = "<b>Priority Class</b><br />First factor that determines who can attack first (A &gt; B &gt; C &gt; D &gt; E &gt; F) each "+conceptLink("battle")+" "+conceptLink("round")+". "+conceptLink("Tactics")+" "+conceptLink("technology")+" can break ties.";
			break;
		case "quick start":
			displayTxt = "<b>Quick Start</b><br />Optional setup variant that greatly speeds up play, usually only available in "+conceptLink("competitive")+" scenarios.<br /><br />\
				"+conceptLink("Home system")+"s are pre-explored, and non-"+conceptLink("barren")+" "+conceptLink("planet")+"s are pre-colonized and fully grown;\
				at the expense of starting with no "+conceptLink("colony ship")+"s.";
			break;
		case "retreat":
			displayTxt = "<b>Retreat</b><br />After the first "+conceptLink("battle")+" round, a mobile "+conceptLink("combat ship")+" may choose to retreat instead of fire upon an enemy ship." +
				"<br />If it does, it must retreat to an unguarded hex that puts it equal to, or closer to the nearest "+conceptLink("colony")+" <span class=\"bindTxt\">(not counting any colony in the battle hex)</span>.";
			break;
		case "round":
			displayTxt = "<b>Battle Round</b><br />At the beginning of each "+conceptLink("battle")+" round, players "+conceptLink("screen")+" (if available) and check for "+conceptLink("Fleet Size Bonus")+" eligibility." +
				"<br />Afterwards, ships are organized according to "+conceptLink("Priority Class")+". Each ship chooses a target, and fires <span class=\"bindTxt\">(rolling a d10)</span>. " +
				"<br />If the required "+conceptLink("Attack")+" (or less) has been rolled <span class=\"bindTxt\">(minus any target's "+conceptLink("Defense")+" rating)</span>, a hit has been scored." +
				"<br />After the first round, whenever a mobile "+conceptLink("combat ship")+" would have its turn to fire, it may instead choose to "+conceptLink("retreat")+".";
			break;
		case "screen":
			displayTxt = "<b>Screening</b><br />If one side has more "+conceptLink("combat ship")+"s than the opposite side each "+conceptLink("battle")+" "+conceptLink("round")+", the larger fleet can screen ships up to the difference." +
				"<br />Screened ships may neither fire, nor be fired upon. Screen choices last for a full battle round." +
				"<br /><br />"+conceptLink("Non-combat ship")+"s are automatically screened for the entire battle, and are eliminated if their protection has been destroyed and/or "+conceptLink("retreat")+"ed.";
			break;
		case "scuttle":
			displayTxt = "<b>Scuttling</b><br />A player may choose to voluntarily remove ships from the board without refund, referred to as scuttling.<br />\
				This process is useful for freeing up counters for reconstruction, and/or to reduce "+conceptLink("maintenance")+" costs.";
			break;
		case "space empires 4x":
			displayTxt = "<b>Space Empires 4X</b><br />The base board game. Includes a variety of system counters, ship counters, numeric counters.\
				Also includes "+conceptLink("competitive")+" scenarios <span class=\"bindTxt\">(2 - 4 players)</span>, plus two solo scenarios ("+conceptLink("Doomsday Machine")+"s / "+conceptLink("Alien Empires")+").";
			break;
		case "movement turn":
			// Fall through
		case "turn":
			displayTxt = "<b>Turn</b><br />Technically a regular turn. A phase in which each player moves their ships, conducts "+conceptLink("battle")+"s, and explores systems;\
				one player at a time.<br />3 turns occur in between each "+conceptLink("economic phase")+".<br /><br />\
				The total number of hexes a "+conceptLink("combat ship")+" or "+conceptLink("Decoy")+" may move per economic phase is determined by their "+conceptLink("Movement")+" technology level.<br />\
				(Other "+conceptLink("non-combat ship")+"s are limited to 1 hex per turn, regardless of technology.)";
			break;
		case "weakness":
			displayTxt = "<b>Weakness</b><br />In the corresponding solitaire scenario, a "+conceptLink("Doomsday Machine")+" may have a weakness, depending on a d10 roll:" +
				"<br /><br />1-2: Allows "+conceptLink("Fighters")+" to damage a DM normally" +
				"<br />3-4: Detonating "+conceptLink("Mines")+" each can deal 1 damage to a DM, via rolling a 5 or less" +
				"<br />5-6: "+conceptLink("Scanning")+" is jammed, allowing "+conceptLink("Raider")+"s to benefit from their "+conceptLink("Cloaking") +
				"<br />7-8: Allows the player to benefit from "+conceptLink("Fleet Size Bonus")+", if they have at least 10 ships able to hit the DM" +
				"<br />9-10: No weakness was found on this DM";
			break;
			
		// Technologies
		case "cloaking":
			displayTxt = "<b>Cloaking Technology</b><br />Allows building "+conceptLink("Raider")+"s, which cloak by default, but can be detected or otherwise nullified.<br />If a surprise is achieved, Raiders get Attack +1 on their first turn only.<br />" +
				"Tech Level 2 upgrades "+conceptLink("Attack")+" to A5/D5 and negates "+conceptLink("Scanning")+" tech level 1.";
			break;
		case "exploration":
			displayTxt = "<b>Exploration Technology</b><br />Level 1 allows "+conceptLink("Cruiser")+"s to safely explore an adjacent "+conceptLink("unexplored")+" hex during movement.<br />\
				Level 2 allows "+conceptLink("Base")+"s, "+conceptLink("Ship Yard")+"s, Cruisers, and "+conceptLink("Flagship")+"s to respond to an adjacent "+conceptLink("battle")+" hex by sending in reinforcements ("+conceptLink("Close Encounters")+" only).";
			break;
		case "fighter":
			displayTxt = "<b>Fighter Technology</b><br />Allows building "+conceptLink("Carrier")+"s and "+conceptLink("Fighters")+". Subsequent levels increase "+conceptLink("Fighters")+" "+conceptLink("Attack")+" rating";
			break;
		case "minelaying":
			displayTxt = "<b>Minelaying Technology</b><br />Allows building "+conceptLink("mines")+".";
			break;
		case "minesweeping":
			displayTxt = "<b>Minesweeping Technology</b><br />Allows building "+conceptLink("minesweeper")+"s. "+conceptLink("Tech")+" levels 2/3 improves the number of mines swept per ship. \
				<br />"+conceptLink("Alien Player")+" "+conceptLink("Scout")+"s also benefit from this technology.";
			break;
		case "point-defense":
			displayTxt = "<b>Point-Defense Technology</b><br />"+conceptLink("Scout")+"s equipped with this "+conceptLink("technology")+" gain an improved "+conceptLink("Attack")+" rating versus "+conceptLink("Fighters")+"." +
				"<br />At level 1, Scouts attack Fighters at A6. Level 2 at A7. Level 3 at A8. (Assuming no "+conceptLink("asteroids")+" / "+conceptLink("nebula")+" interference.)";
			break;
		case "scanning":
			displayTxt = "<b>Scanning Technology</b><br />"+conceptLink("Destroyer")+"s equipped with this "+conceptLink("technology")+" will detect "+conceptLink("Raider")+"s with an equal or lower "+conceptLink("cloaking")+" level.";
			break;
		case "ship size":
			displayTxt = "<b>Ship Size Technology</b><br />Higher "+conceptLink("tech")+" levels allow larger and more powerful ships to be built. The starting tech level is 1.<br /><br />\
				Tech level 2 allows the construction of "+conceptLink("Destroyer")+"s and "+conceptLink("Base")+"s.<br />\
				Tech level 3 allows the construction of "+conceptLink("Cruiser")+"s.<br />\
				Tech level 4 allows the construction of "+conceptLink("Battlecruiser")+"s.<br />\
				Tech level 5 allows the construction of "+conceptLink("Battleship")+"s.<br />\
				Tech level 6 allows the construction of "+conceptLink("Dreadnought")+"s.<br />\
				Tech level 7 allows the construction of "+conceptLink("Titan")+"s. ("+conceptLink("Close Encounters")+" only)";
			break;
		case "tactics":
			displayTxt = "<b>Tactics Technology</b><br />Used to break ties in case two opposing ships share the same "+conceptLink("Priority Class")+". If even this is the same level, then the defender wins the tie.";
			break;
		case "tech":
			// Fall through
		case "technology":
			displayTxt = "<b>Technology</b><br />Developing technologies and levels allow unlocking more powerful ships, weapons, to name a few. Any tech levels purchased affect any ships built in the same "+conceptLink("economic phase")+" (including unlocking new ships). Existing ships are unaffected, but can be "+conceptLink("upgrade")+"d.";
			break;
		case "terraforming":
			displayTxt = "<b>Terraforming Technology</b><br />Level 1 allows colonizing "+conceptLink("barren planet")+"s.<br />\
				Level 2 allows upgraded "+conceptLink("Mining Ship")+"s to harvest from "+conceptLink("nebula")+"e, at a rate of 5 "+conceptLink("CP")+" per turn.\
				("+conceptLink("Close Encounters")+" only)";
			break;
		case "upgrade":
			displayTxt = "<b>Upgrade</b><br />If a ship has any outdated "+conceptLink("technology")+" as a result of being built prior to any developments, it can be upgraded at a "+conceptLink("Ship Yard")+", at a cost of "+conceptLink("CP")+" equal to its "+conceptLink("Hull Size")+". The ship/group must not move for an entire "+conceptLink("movement turn")+" to perform their upgrades.<br />(Exception: "+conceptLink("Base")+"s, "+conceptLink("Decoy")+"s, and "+conceptLink("Ship Yard")+"s are automatically upgraded at no cost; effective immediately after the tech level purchase.)";
			break;
			
		// Terrain
		case "asteroid belt":
			// Fall through
		case "asteroids":
			displayTxt = "<b>Asteroid Belt</b><br />Inhibits movement of ships, unless following a "+conceptLink("Pipeline")+" network. Nullifies "+conceptLink("Attack")+" "+conceptLink("technology")+" and reduces "+conceptLink("Priority Class")+" to <b>E</b>.";
			break;
		case "barren":
			// Fall through
		case "barren planet":
			displayTxt = "<b>Barren Planet</b><br />A less hospitable "+conceptLink("planet")+". Not colonizable, unless "+conceptLink("Terraforming")+" "+conceptLink("technology")+" has been developed." +
				"<br />Barren Planets in "+conceptLink("deep space")+" may have "+conceptLink("alien ship")+"s ambushing any stragglers that explore it.";
			break;
		case "black hole":
			displayTxt = "<b>Black Hole</b><br />Forces <em>each</em> ship that enters to roll a survival d10 roll, unless they follow a "+conceptLink("Pipeline")+" network." +
				"<br />A roll of 6 or less allows the ship to remain. Otherwise, the ship is destroyed.";
			break;
		case "colonies":
			// Fall through
		case "colony":
			displayTxt = "<b>Colony</b><br />A "+conceptLink("planet")+" that has been colonized. Grows in production until it reaches 5 "+conceptLink("CP")+" in income.";
			break;
		case "danger":
			displayTxt = "<b>Danger!</b><br />If discovered, this system <em>instantly</em> destroys any ships in the same hex! The counter is then removed afterwards.";
			break;
		case "deep space":
			displayTxt = "<b>Deep Space</b><br />A set of hexes that spread beyond the players' "+conceptLink("home system")+"s." +
				"<br />These systems have a much higher risk <span class=\"bindTxt\">(several "+conceptLink("Danger")+"! counters, and less predictability)</span>, but higher reward <span class=\"bindTxt\">("+conceptLink("minerals")+" pay better, and there can be "+conceptLink("space wreck")+"s)</span>.";
			break;
		case "homeworld":
			displayTxt = "<b>Homeworld</b><br />Starting "+conceptLink("colony")+" for an empire. It is the most powerful <span class=\"bindTxt\">(produces 20 "+conceptLink("CP")+" while intact)</span> and most important colony <span class=\"bindTxt\">(destruction ends a game)</span>.";
			break;
		case "home system":
			displayTxt = "<b>Home System</b><br />A set of hexes that surround a "+conceptLink("homeworld")+". These systems are relatively safe, with only a single dangerous counter <span class=\"bindTxt\">(a "+conceptLink("black hole")+")</apan> shuffled among these 25 "+conceptLink("unexplored")+" systems.";
			break;
		case "lost":
			// Fall through
		case "lost in space":
			displayTxt = "<b>Lost in Space</b><br />If discovered, this system sends ships in a different, involuntary direction. A die roll is used in a solo or co-op game.\
				In a "+conceptLink("competitive")+" game, an enemy player directs these ships. The counter is then removed afterwards.";
			break;
		case "planet":
			displayTxt = "<b>Planet</b><br />A potentially habitable world. Becomes a "+conceptLink("colony")+" when colonized. Some planets are "+conceptLink("barren")+".";
			break;
		case "minerals":
			displayTxt = "<b>Minerals</b><br />Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to generate a one-time boost in "+conceptLink("CP")+" as shown on the counter(s) unloaded.";
			break;
		case "nebula":
			displayTxt = "<b>Nebula</b><br />Inhibits movement of ships, unless following a "+conceptLink("Pipeline")+" network. Nullifies "+conceptLink("Defense")+" and "+conceptLink("Cloaking")+" "+conceptLink("technology")+" and reduces "+conceptLink("Priority Class")+" to <b>E</b>.";
			break;
		case "space wreck":
			displayTxt = "<b>Space Wreck</b><br />Can be picked up by a "+conceptLink("miner")+" and towed to a "+conceptLink("colony")+" to develop a free random "+conceptLink("technology")+".";
			break;
		case "supernova":
			displayTxt = "<b>Super Nova</b><br />If discovered, the ships that just explored it must immediately turn back. Serves as an impassable hex for the rest of the game.";
			break;
		case "unexplored":
			displayTxt = "<b>Unexplored System</b><br />This system is shrouded in complete mystery. Can be explored by any "+conceptLink("combat ship")+" entering the hex, or via "+conceptLink("Exploration")+" "+conceptLink("technology")+"." +
				"<br />"+conceptLink("Non-combat ship")+"s may not enter this system, unless escorted. No player ship may enter this system, while occupied by a "+conceptLink("Doomsday Machine")+" or an "+conceptLink("Alien Player")+" ship.";
			break;
		case "warp point":
			displayTxt = "<b>Warp Point</b><br />If two linked warp points are found, they can be traveled directly to each other, as if they were 1 hex away from each other.";
			break;
			
		// Ships
		case "decoy":
			displayTxt = "<b>Decoy</b><br />Support ship designed to fool enemies. Can be built at any "+conceptLink("colony")+". Automatically eliminated at the start of a "+conceptLink("battle");
			displayTxt = displayTxt + stats(1, 0, 0, 0);
			break;
		case "ship yard":
			// Fall through
		case "sy":
			displayTxt = "<b>Ship Yard</b><br />Space station able to build more ships. Can not move. Can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase")+
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
			displayTxt = "<b>Mining Ship</b> (miner)<br />Support ship designed to tow "+conceptLink("minerals")+" and "+conceptLink("space wreck")+"s to "+conceptLink("colonies");
			displayTxt = displayTxt + stats(5, 0, 0, 0);
			break;
		case "destroyer":
			// Fall through
		case "dd":
			displayTxt = "<b>Destroyer</b> (DD)<br />Medium-Light "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Scanning")+" technology";
			displayTxt = displayTxt + stats(9, "D4", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 2";
			break;
		case "base":
			displayTxt = "<b>Base</b><br />Starbase with powerful long range weaponry. Can not move. One can be built at any "+conceptLink("colony")+" that has produced CP this "+conceptLink("economic phase");
			displayTxt = displayTxt + stats(12, "A7", 2, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 2";
			break;
		case "cruiser":
			// Fall through
		case "ca":
			displayTxt = "<b>Cruiser</b><br />Medium "+conceptLink("combat ship")+", able to benefit from "+conceptLink("Exploration")+" technology";
			displayTxt = displayTxt + stats(12, "C4", 1, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 3";
			break;
		case "battlecruiser":
			// Fall through
		case "bc":
			displayTxt = "<b>Battlecruiser</b><br />Medium-Heavy "+conceptLink("combat ship")+", theoretically equippable with "+conceptLink("Fastmove")+" technology";
			displayTxt = displayTxt + stats(15, "B5", 1, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 4";
			break;
		case "battleship":
			// Fall through
		case "bb":
			displayTxt = "<b>Battleship</b><br />Heavy "+conceptLink("combat ship");
			displayTxt = displayTxt + stats(20, "A5", 2, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 5";
			break;
		case "dreadnought":
			// Fall through
		case "dn":
			displayTxt = "<b>Dreadnought</b><br />Huge "+conceptLink("combat ship");
			displayTxt = displayTxt + stats(24, "A6", 3, 3) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 6";
			break;
		
		// Advanced Ships
		case "carrier":
			// Fall through
		case "cv":
			displayTxt = "<b>Carrier</b><br />Combat transport craft, able to carry up to 3 "+conceptLink("Fighters")+" into space";
			displayTxt = displayTxt + stats(12, "E3", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Fighter")+" level 1";
			break;
		case "fighters":
			// Fall through
		case "f":
			displayTxt = "<b>Fighters</b><br />Small craft, requires a "+conceptLink("Carrier")+" to move into space. Comes in three levels, each subsequent level allows an improved craft";
			displayTxt = displayTxt + stats(5, "B5 / B6 / B7", "0 / 0 / 1", 1) + "<br /><b>Required Tech</b>: "+conceptLink("Fighter")+" level 1";
			break;
		case "minelayer":
			// Fall through
		case "mines":
			displayTxt = "<b>Mines</b><br />Small craft that detonates upon contact with enemy ships, destroying them instantly unless "+conceptLink("sw")+"ept<br />Limited to 1 hex per "+conceptLink("movement turn")+", and may not enter enemy occupied hexes";
			displayTxt = displayTxt + stats(5, 1, 0, 0) + "<br /><b>Required Tech</b>: "+conceptLink("Minelaying");
			break;
		case "pipeline":
			displayTxt = "<b>Merchant Pipeline</b><br />Support ship able to connect to Pipeline ships in adjacent hexes to assist in movement along a <q>road</q> <span class=\"bindTxt\">(+1 hex per "+conceptLink("movement turn")+" and ignores terrain)</span> and income <span class=\"bindTxt\">(+1 "+conceptLink("CP")+" if it connects a "+conceptLink("colony")+" to the "+conceptLink("homeworld")+")</span>";
			displayTxt = displayTxt + stats(3, 0, 0, 0);
			break;
		case "raider":
			// Fall through
		case "r":
			displayTxt = "<b>Raider</b><br />Sneaky "+conceptLink("combat ship")+", comes cloaked (A) unless detected or nullified (D)";
			displayTxt = displayTxt + stats(12, "A/D4", 0, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Cloaking")+" level 1";
			break;
		case "minesweeper":
			// Fall through
		case "sw":
			displayTxt = "<b>Minesweeper</b><br />Utility "+conceptLink("combat ship")+" that sweeps "+conceptLink("mines")+" and researches "+conceptLink("space amoeba");
			displayTxt = displayTxt + stats(6, "E1", 0, 1) + "<br /><b>Required Tech</b>: "+conceptLink("Minesweeping")+" level 1";
			break;
		
			
		// Doomsday Machines
		case "doomsday machine":
			// Fall through
		case "dm":
			displayTxt = dmBase(null)
			break;
		case "dmmp":
			displayTxt = dmBase("MP") + stats(0, "C9", 2, 3) + "<br /><b>Attacks per round</b>: 2";
			break;
		case "dm1":
			displayTxt = dmBase(1) + stats(0, "D7", 1, 6) + "<br /><b>Attacks per round</b>: 3";
			break;
		case "dm2":
			displayTxt = dmBase(2) + stats(0, "C7", 1, 7) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm3":
			displayTxt = dmBase(3) + stats(0, "C8", 2, 7) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm4":
			displayTxt = dmBase(4) + stats(0, "C8", 2, 8) + "<br /><b>Attacks per round</b>: 4";
			break;
		case "dm5":
			displayTxt = dmBase(5) + stats(0, "B9", 2, 8) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm6":
			displayTxt = dmBase(6) + stats(0, "B9", 3, 9) + "<br /><b>Attacks per round</b>: 5";
			break;
		case "dm7":
			displayTxt = dmBase(7) + stats(0, "B10", 3, 9) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm8":
			displayTxt = dmBase(8) + stats(0, "A10", 3, 10) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm9":
			displayTxt = dmBase(9) + stats(0, "A11", 4, 10) + "<br /><b>Attacks per round</b>: 6";
			break;
		case "dm10":
			displayTxt = dmBase(10) + stats(0, "A11", 4, 11) + "<br /><b>Attacks per round</b>: 6";
			break;
			
		// Alien Empires
		case "alien empires":
			displayTxt =  "<b>Alien Empires</b><br />Solo or co-op scenario that pits 1-3 human player(s) against 2-3 "+conceptLink("Alien Player")+"s.<br />\
				The human players' objective is to destroy all AP "+conceptLink("homeworld")+"s,\
				while protecting their own and (if present) the "+conceptLink("galactic capitol")+" from destruction.";
			break;
		case "alien player":
			displayTxt =  "<b>Alien Player</b><br />Hostile empire that generates "+conceptLink("CP")+" from 1 or more unique "+conceptLink("economic roll")+"s per "+conceptLink("economic phase")+".<br />\
				Available when playing an "+conceptLink("Alien Empires")+" scenario. Starts with "+conceptLink("Minelaying")+" and "+conceptLink("Nanomachine")+" "+conceptLink("technology")+", and with a single "+conceptLink("base")+".";
			break;
		case "economic roll":
			displayTxt =  "<b>Economic Roll</b><br />Determines where an "+conceptLink("Alien Player")+" should allocate its "+conceptLink("CP")+" \
				(Fleets, "+conceptLink("Technology")+", or "+conceptLink("Homeworld")+" Defense),<br />\
				or if it permanently gains an <em>extra</em> economic roll 3 "+conceptLink("economic phase")+"s from the current phase.<br />\
				CP allocated into Defense are applied with twice the standard effectiveness.";
			break;
		case "nanomachine":
			displayTxt = "<b>Nanomachine Technology</b><br />"+conceptLink("Alien Player")+"-exclusive technology that allows building ships remotely; whenever a\
				given fleet first enters a "+conceptLink("battle")+". Rarely used by <span class=\"bindTxt\">"+conceptLink("Raider")+" fleets.</span><br /><br />\
				A fleet can use only the "+conceptLink("CP")+" that was assigned at the time it was launched. Leftover CP post-construction is returned to the AP's Fleet bank.";
			break;
			
		// Close Encounters concepts
		case "close encounters":
			displayTxt =  "<b>Close Encounters</b><br />First expansion to the base "+conceptLink("Space Empires 4X")+" board game. Adds new ships, new tech, co-op scenarios, and "+conceptLink("space amoeba");
			break;
		case "tn":
			// Fall through
		case "titan":
			displayTxt = "<b>Titan</b><br />Extremely potent <q>baseship</q>. Can carry "+conceptLink("Fighters")+" if upgraded. Deals <b>2</b> damage per hit. Weak to "+conceptLink("Fighters");
			displayTxt = displayTxt + stats(32, "A7", 3, 5) + "<br /><b>Required Tech</b>: "+conceptLink("Ship Size")+" level 7";
			break;
		case "boarding":
			displayTxt = "<b>Boarding Technology</b><br />Allows building "+conceptLink("Boarding Ship")+"s. Level 2 improves boarding odds by 1 point.";
			break;
		case "black hole jumping":
			displayTxt = "<b>Black Hole Jumping Technology</b><br />Available only in solo or co-op scenarios involving a "+conceptLink("galactic capitol")+".\
				Human player(s) can buy the tech for 40 "+conceptLink("CP")+"; provided they also have develoepd "+conceptLink("Movement")+" level 3, or are playing on a sufficiently low difficulty.\
				<br /><br />Once purchased and equipped, player ships become immune to "+conceptLink("black hole")+"s, instead treating them as if they were "+conceptLink("warp point")+"s.";
			break;
		case "bo":
			// Fall through
		case "boarding ship":
			displayTxt = "<b>Boarding Ship</b><br />Specialist ship designed to capture enemy ships. Reduced to F1 versus immune targets. No benefit from "+conceptLink("Attack")+" tech";
			displayTxt = displayTxt + stats(12, "F5", 0, 2) + "<br /><b>Required Tech</b>: "+conceptLink("Boarding")+" level 1";
			break;
		case "fastmove":
			displayTxt = "<b>Fastmove Technology</b><br />"+conceptLink("Close Encounters")+" exclusive technology that allows "+conceptLink("Battlecruiser")+"s to move an extra hex,\
				on the first "+conceptLink("turn")+" of each "+conceptLink("economic phase");
			break;
		case "flagship":
			displayTxt = "<b>Flagship</b><br />"+conceptLink("Close Encounters")+" exclusive ship. Players sometimes start the game with one, but can <i>never</i> build more\
				" + stats(0, "B4", 1, 3);
			break;
		case "galactic capitol":
			displayTxt = "<b>Galactic Capitol</b><br />Ancient homeworld. Sanctuary hex in "+conceptLink("competitive")+" scenarios that prohibits "+conceptLink("battle")+"s\
				and provides 5 "+conceptLink("CP")+" to each "+conceptLink("Pipeline")+"-connected player.<br /><br />\
				In solo and co-op scenarios (if present), it creates a respawnable 10-"+conceptLink("minerals")+" counter and\
				allows human player(s) to research "+conceptLink("Black Hole Jumping")+". It must also be kept alive. Otherwise, the <q>environment</q> wins the scenario.";
			break;
		case "space amoeba":
			displayTxt = "<b>Space Amoeba</b><br />Hazardous species that will multiply themselves and attempt to destroy human player(s).<br />\
				Automatically destroys <b>all</b> ships (except "+conceptLink("Minesweeper")+"s), until fully researched<br /><br />\
				Also both a solitaire scenario and competitive scenario, where researching and eliminating them are the objective in the former.";
			break;
		case "tran":
			// Fall through
		case "transport":
			displayTxt = "<b>Troop Transport</b><br />Utility "+conceptLink("combat ship")+", able to pick up "+conceptLink("Troops")+" from friendly "+conceptLink("colonies")+" and use them to invade enemy colonies";
			displayTxt = displayTxt + stats(6, "E1", 1, 1);
			break;
		case "troops":
			displayTxt = "<b>Troops</b><br />Small ground-borne craft that is used to invade enemy "+conceptLink("colonies")+" in a ground "+conceptLink("battle")+"; or to defend friendly colonies";
			break;
			
		// Unique ship-exclusive concepts
		case "unique ship":
			displayTxt = "<b>Unique Ship</b><br />Fully customizable "+conceptLink("combat ship")+" whose specifications are completely up to the designer";
			break;
		case "mini-fighter bay":
			displayTxt = "<b>Mini-Fighter Bay</b><br />Allows the "+conceptLink("Unique Ship")+" to carry 1 "+conceptLink("Fighters")+" with it";
			break;
		case "anti-sensor hull":
			displayTxt = "<b>Anti-Sensor Hull</b><br />Allows the "+conceptLink("Unique Ship")+" to be optionally immune to "+conceptLink("mines");
			break;
		case "shield projector":
			displayTxt = "<b>Shield Projector</b><br />Allows the "+conceptLink("Unique Ship")+" to protect another ship, allowing its mate to fire without fear of being targeted";
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
			displayTxt = "<b>Tractor Beam</b><br />Allows the "+conceptLink("Unique Ship")+" to pull an enemy ship to it each "+conceptLink("round")+", prohibiting the victim from "+conceptLink("retreat")+"ing";
			break;
		case "warp gates":
			displayTxt = "<b>Warp Gates</b><br />Two "+conceptLink("Unique Ship")+"s within 3 hexes of each other are considered connected (1 hex apart). Supporting craft may use only one warp gate per "+conceptLink("turn");
			break;
		case "second salvo":
			displayTxt = "<b>Second Salvo</b><br />The first time a "+conceptLink("Unique Ship")+" hits its victim in a "+conceptLink("round")+", it gets to shoot again towards the same hull type.";
			break;
		case "heavy warheads":
			displayTxt = "<b>Heavy Warheads</b><br />"+conceptLink("Unique Ship")+"s' minimum "+conceptLink("Attack")+" rating increased to 2, after "+conceptLink("Defense")+" modifiers.\
				(Against a "+conceptLink("Titan")+", the minimum Attack is instead 1)";
			break;
			
		// Replicators concepts
		case "replicators":
			displayTxt =  "<b>Replicators</b><br />Second expansion to the base "+conceptLink("Space Empires 4X")+" board game.<br />\
				Adds the titular replicators as a new faction, playable by a human, or as the antagonists in a unique solitaire scenario.";
			break;
			
		// Site exclusive concepts
		case "numsims":
			displayTxt = "<b>Number of simulations</b><br />Number of battles to simulate at once. Battles simulated as a series give a short summary of success rate, followed by detailed ships survived and HP remaining on each side.";
			break;
		
		
	}
	
	displayTxt = displayTxt + "<br /><br /><a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

function keywordifyDocument() {
	setupBox();
	keywordifyCollection(document.getElementsByTagName("p"));
	keywordifyCollection(document.getElementsByTagName("li"));
}

function keywordifyCollection(collObj) {
	const keyTerms = ["Space Empires 4X", "Close Encounters", "Replicators",
		"Barren", "Bid", "Colonies", "Competitive", "CP", "Economic Phase", "Homeworld", "Hull Size", "Maintenance", "Planet", "Quick Start", "Scuttle", "Turn",
		"Battle", "Blockade", "Bombard", "Fleet Size Bonus", "Priority Class", "Retreat", "Screen", "Weakness",
		"Alien Empires", "Alien Player", "Doomsday Machine", "Economic Roll",
		"Scout", "Destroyer", "Cruiser", "Ship Yard", "Base", "Minelayer", "Minesweeper", "Colony Ship", "Mining Ship", "Pipeline", "Unique Ship",
		"Asteroid Belt", "Asteroids", "Black Hole", "Danger", "Deep Space", "Home System", "Lost in Space", "Minerals", "Nebula", "Space Wreck", "Supernova", "Unexplored",
		"Technology", "Attack", "Defense", "Exploration", "Minelaying", "Minesweeping", "Movement", "Nanomachine", "Scanning", "Ship Size", "Tactics", "Terraforming", "Upgrade"];
		
	const keyExpressions = [
		{regex: conceptLink("battle")+conceptLink("cruiser"), newTxt: conceptLink("battlecruiser")},
		{regex: conceptLink("Battle")+conceptLink("cruiser"), newTxt: conceptLink("Battlecruiser")},
		{regex: conceptLink("battle")+"ship", newTxt: conceptLink("battleship")},
		{regex: conceptLink("Battle")+"ship", newTxt: conceptLink("Battleship")},
		{regex: "re"+conceptLink("turn"), newTxt: "return"},
		{regex: conceptLink("turn")+"ed", newTxt: "turned"}
		];
	
	for (var e of collObj) {
		if (!e.innerHTML.startsWith("<a") && !e.className.startsWith("noKeywords")) {
			for (var h = 0; h < keyTerms.length; h++) {
				if (keyTerms[h].toLowerCase() != keyTerms[h]) {
					e.innerHTML = e.innerHTML.replaceAll(keyTerms[h].toLowerCase(), conceptLink(keyTerms[h].toLowerCase()));
				}
				e.innerHTML = e.innerHTML.replaceAll(keyTerms[h], conceptLink(keyTerms[h]));
			}
			
			for (var g = 0; g < keyExpressions.length; g++) {
				e.innerHTML = e.innerHTML.replaceAll(keyExpressions[g].regex, keyExpressions[g].newTxt);
			}
		}
	}
}
