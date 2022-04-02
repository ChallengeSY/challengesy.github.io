var designIter = 0;
var elementObj = new Array();
var maxAdvantage = 500;
var checkFighters = false;
window.onload = setupSim;

//Campaign technology object
function upgrade(name, ship, mc, adv, padlock) {
	this.eleName = name;
    this.shipFlag = ship;
	this.money = mc;
	this.advCost = adv;
    this.lockDesign = padlock;
}

//Register events
function addEvent(object, evName, fnName, cap) {
	try {
		if (object.addEventListener) {
            object.addEventListener(evName, fnName, cap);
		} else if (object.attachEvent) {
            object.attachEvent("on" + evName, fnName);
		} else {
			if (evName == "click") {
				object.onclick = fnName;
			}
		}
	} catch(err) {
		alert(err);
	}
}

function dispInfo(techItem) {
	var displayTxt;
	var abilityAmt;
	var infoPanel = document.getElementById("infobox");
	
	switch(techItem) {
		//Starship abilities
		case "Alchemy":
			displayTxt = "Converts supplies to minerals at a ratio of 9 to 3";
			break;
		case "Advanced Bioscanning":
			abilityAmt = 100;
			//Fall through
		case "Bioscanning":
			if (!abilityAmt) {
				abilityAmt = 20;
			}
			displayTxt = "Bioscanner analyzes native life and climate of "+abilityAmt+"% of the unowned or foreign planets";
			if (abilityAmt == 100) {
				displayTxt = displayTxt + ", even in nebulas";
			} else {
				displayTxt = displayTxt + " outside of nebulas";
			}
			displayTxt = displayTxt + ". Does not reveal ownership";
			break;
		case "Cloak":
			displayTxt = "Allows an undamaged starship the ability to cloak, consuming fuel in the process while also reducing radiation damage to 1/2. <span class=\"bindTxt\">Allows " + shipAbility("Priority Intercept Attack") + "s</span>";
			break;
		case "Advanced Cloak":
			displayTxt = "Upgraded <a href=\"javascript:dispInfo('Cloak')\">Cloaking Device</a> that does not consume fuel and can overcome nebulas. While cloaked, radiation damage is reduced to 1/3, and the ship is protected from ion storms";
			break;
		case "Chameleon Device":
			displayTxt = "Compatible ships can use this device to appear as any other ship, consuming 10kT of neutronium fuel per turn while active";
			break;
		case "Chunnel Self":
			displayTxt = "Can chunnel itself to any " + shipAbility("Chunnel Target") + ".";
			break;
		case "Chunnel Self (B200)":
			displayTxt = "Can chunnel itself to a B200 probe, or to any " + shipAbility("Chunnel Target") + ".";
			break;
		case "Chunnel Initiator":
			displayTxt = "Can chunnel itself and its fleet to any " + shipAbility("Chunnel Target") + ".";
			break;
		case "Chunnel Immunity":
			displayTxt = "Can not participate in any chunnels.";
			break;
		case "Chunnel Stabilizer":
			displayTxt = "Allows " + shipAbility("Chunnel Initiator") + "s within a radius to initiate chunnels while moving.";
			break;
		case "Chunnel Target":
			displayTxt = "Ship which can accept chunnels initiated by other ships.";
			break;
		case "Cloaked Fighter Bay":
			displayTxt = "While cloaked, this ship will support other ships with its fighter bays and ammunition (max 1).";
			break;
		case "Command Ship":
			displayTxt = "Non-intercepting ships at the location of a fueled Command Ship will move before mine laying and other ships' movement.";
			break;
		case "Cools to 50":
			abilityAmt = 50;
			displayTxt = "Ship will terraform the planet, reducing its temperature by 1 degree after movement per turn, to a minimum of " + abilityAmt;
			break;
		case "Educator":
			displayTxt = "Raises Native government level by 5% per turn, to a maximum level of Representative (140%)";
			break;
		case "Elusive":
			displayTxt = "Torpedoes targeting this ship have their accuracy reduced to 10% (from 35%)";
			break;
		case "Emork's Spirit Bonus":
			displayTxt = "Complex hull function adds the following abilities and restrictions:<ul style=\"text-align: left;\">" + 
				"<li>This ship can only be built at a homeworld, with a fixed name assigned to the ship</li>" +
				"<li>This ship is unclonable, but can still be traded or captured</li>" +
				"<li>Gains one fighter bay for each homeworld under control. Applies only to the building player</li>" +
				"<li>Destruction, capture, or trading away decreases the happiness of the homeworld responsible by 100%</li>" +
				"<li>If the homeworld responsible falls to foreign hands, this ship will self-destruct with a force of a " + shipAbility("Glory Device (100-100)") + "</li>" +
				"</ul>";
			break;
		case "Gambling":
			displayTxt = "Ship will generate megacredits per turn on board at a rate of 1 mc per colonist clan in its cargo hold.";
			break;
		case "Glory Device (100-10)":
			abilityAmt = 10;
			//Fall through
		case "Glory Device (100-20)":
			if (!abilityAmt) {
				abilityAmt = 20;
			}
			displayTxt = "When detonated, this device will deal roughly 100kT worth of damage to all ships. Fascist ships and ships belonging to the owner of the detonator receive "+abilityAmt+"% of the full damage dealt";
			break;
		case "Glory Device (100-100)":
			displayTxt = "When detonated, this device will deal roughly 100kT worth of damage to ALL ships, regardless of owner";
			break;
		case "Glory Device (50-20)":
			displayTxt = "When detonated, this device will deal roughly 50kT worth of damage to all ships. Fascist ships and ships belonging to the owner of the detonator receive 20% of the full damage dealt";
			break;
		case "Gravitonic Acceleration":
			displayTxt = "Ship will move at twice the normal LY per turn while consuming half the normal fuel per LY";
			break;
		case "Heats to 50":
			abilityAmt = 50;
			//Fall through
		case "Heats to 100":
			if (!abilityAmt) {
				abilityAmt = 100;
			}
			displayTxt = "Ship will terraform the planet, raising its temperature by 1 degree after movement per turn, to a maximum of " + abilityAmt;
			break;
		case "Heavy Armor":
			displayTxt = "Heavy Armor grants a 75% chance at deflecting fighter hits.";
			break;
		case "Hyperdrive":
			displayTxt = "Ship can use its Hyperdrive to cross 340-360 LY, ignoring minefields, but not star clusters. Consumes 50kT fuel per use";
			break;
		case "Imperial Assault":
			displayTxt = "Ship can capture ANY planet with ease by simply dropping 10 or more clans. Requires fuel and no damage";
			break;
		case "Intercept Interference":
			displayTxt = "Prevents the use of " + shipAbility("Cloak and Intercept") + ", and the benefits of " + shipAbility("Priority Intercept Attack") + "s, against starships at the same point as the ability.";
			break;
		case "Move Minefields":
			displayTxt = "Can move minefields using the <q>Push minefield</q> and <q>Pull minefield</q> missions.";
			break;
		case "Neb Scanner":
			displayTxt = "Neb Scanner can detect planets shrouded by a nebula 100 LY away";
			break;
		case "Ore Condenser":
			displayTxt = "Increases mineral density by 5% for each mineral per turn, up to 50%.";
			break;
 		case "Radiation Shielding":
			displayTxt = "Radiation Shielding passively protects the ship's crew and colonists from star cluster radiation, regardless of fuel levels";
			break;
		case "Ramscooping":
			displayTxt = "Ship generates 2 fuel per LY after movement. No fuel necessary, but does not work if ship ends its turn in a nebula";
			break;
		case "Recharge Station (5)":
			abilityAmt = 5;
			//Fall through
		case "Recharge Station (25)":
			if (!abilityAmt) {
				abilityAmt = 25;
			}
			displayTxt = "Recharges other ships at a rate of " + abilityAmt + "kT per turn.";
			break;
		case "Recloak Intercept":
			displayTxt = "If the ship successfully engages its victim with a " + shipAbility("Priority Intercept Attack") + ", then it will attempt to cloak after combat and become passive";
			break;
		case "Advanced Refinery":
			abilityAmt = "1 mineral";
			//Fall through
		case "Refinery":
			if (!abilityAmt) {
				abilityAmt = "1 mineral and 1 supply";
			}
			displayTxt = "Converts cargo to neutronium at a rate of " + abilityAmt + " to create 1 fuel";
			break;
		case "Repair Ship":
			displayTxt =  "Can repair hull damage and removes proto-infection toward any ship using the <q>Repair Ship</q> mission.";
			break;
		case "Shield Generator":
			displayTxt = "Adds 25% to the maximum shield strength, provides 25% shield generation in between battles, and adds 50% Engine Shield Bonus worth of combat mass. <span class=\"bindTxt\">(max 2 ships)</span>";
			break;
		case "Squadron":
			displayTxt = "Squadrons are comprised of multiple <q>fighters</q> and are immune to crew loss during combat. If one fighter is destroyed, the survivors escape and return to battle with one <em>less</em> beam";
			break;
		case "Stargate":
			displayTxt = "Allows ANY ship to chunnel to another stargate or any other " + shipAbility("Chunnel Target");
			break;
		case "Stealth Armor":
			displayTxt = "Visibility of this vessel to normal scanners is reduced based on its warp factor and environment. Functional only when fueled, undamaged during movement, and outside of radiation.";
			break;
		case "Sunburst Device":
			displayTxt = "Can raise the temperature of a targeted planet or their warp well (within 200 LY) by up to 2 degrees. Multiple Sunbursts can work together to increase the heating power.";
			break;
		case "Tachyon Device":
			displayTxt = "Tachyon Device decloaks victims within 10LY of the source starship. Source starship's damage level must be 19% or less to function.";
			break;
		case "Tantrum Device":
			displayTxt = "Charges in Ion Storms to release a kinetic blast, pushing ALL other ships within 3LY from the ship.";
			break;
		case "Temporal Lance":
			displayTxt = "With a " + shipAbility("Chunnel Target") + " as a guide, can create a wormhole through time and space, allowing it and ships accompanying it to disappear from the map and the ship list. They will reappear at a location beyond the " + shipAbility("Chunnel Target") + "'s initial position several turns into the future.";
			break;
		case "Tow Immunity (>5000)":
			abilityAmt = 5000;
			// Fall through
		case "Tow Immunity":
			if (abilityAmt) {
				displayTxt = "Can not be towed, if over " + abilityAmt + "kT in total mass.";
			} else {
				displayTxt = "Can not be towed.";
			}
			break;
		case "Tidal Force Shield":
			displayTxt = "Allows the ship to end a combat versus a planet with up to 149% without being destroyed";
			break;
		case "Trailer":
			displayTxt = "This ship is immobile. It can neither move nor interecept";
			break;
		case "Web Cloak":
			displayTxt = "Ship is passively stealthed if it begins and ends its movement step inside "+shipAbility("Web Mines")+".";
			break;
			
		// Fed bonuses
		case "Fed Crew Bonus":
			displayTxt = "Increases combat strength by 50kT. Carriers gain three additional fighter bays. Damage does not affects weapons in combat. Shields recharge AFTER each combat";
			break;
		case "200% Taxing":
			displayTxt = "Increases ALL taxes collected to 200% of the normal rate. Planets are still capped at 5,000 mc from taxes combined per turn";
			break;
		case "Super Refit":
			displayTxt = "Allows starships to exchange components at a starbase";
			break;
		case "70% Mining":
			displayTxt = "Decreases mining efficiency to 70% of the normal rate for a given amount of mines";
			break;
		case "Enhanced Recycle":
			displayTxt = "Recycles grant 75% of a ship's <abbr title=\"Priority Point\">PP</abbr> cost (round up), instead of a single PP";
			break;
		case "Quantum Torpedos":
			displayTxt = "Unique Torpedo Technology. These torpedoes are outfitted for higher damage and longer firing range <span class=\"bindTxt\">(30,000 --&gt; 34,000 units)</span>, at the expense of being unobtainable from mine scooping.";
			break;
		// Lizard bonuses
		case "Lizard Crew Bonus":
			displayTxt = "Starships get destroyed at 151% or more damage. Increases damage tolerance to ALL other components by 50%";
			break;
		case "30X Ground Combat":
			displayTxt = "Lizard clans dropped onto a foreign planet kill 30 times as many foreign colonists as normal clans";
			break;
		case "15X Ground Defense":
			displayTxt = "Lizard clans defend 15 times better against clans dropped from foreign ships";
			break;
		case "Hisssss!":
			displayTxt = "Allows native starships to hiss a planet, raising colonist and native happiness levels by 5. Applies before taxes are applied. Requires beam(s) to use";
			break;
		case "200% Mining":
			displayTxt = "Increases mining efficiency to 200% of the normal rate for a given amount of mines";
			break;
		// Bird Man bonuses
		case "Super Spy":
			displayTxt = "Allows starships to learn a planet's friendly code and economics (minerals, money, structures). Carries a 20% risk of being spotted";
			break;
		case "Super Spy Deluxe":
			displayTxt = "Allows starships to CHANGE a planet's friendly code and manipulate minefields. Planets with 31+ defenses may set off an ion pulse to decloak ALL ships";
			break;
		case "Diplomatic Spies":
			displayTxt = "Allows a player to detect relationship changes between any players simply by sending ambassadors. Other players wishing to prevent this MUST block communication with the offending bird player(s)!";
			break;
		case "Super Spy Command": // Retired
			displayTxt = "Allows starships to disable a planet/base's secondary weapons by changing the planetary code to NTP. Only effective with Super Spy Deluxe";
			break;
		case "Super Spy Advanced":
			displayTxt = "Allows starships to gather starbase information (fighters, defenses, damage, tech, ship under construction) and additional planetary information (happiness and tax)";
			break;
		case "Cloak and Intercept":
			displayTxt = "Allows native starships to cloak (if possible), THEN intercept their targets. If aggressive, interceptor will attempt combat ONLY with their victim";
			break;
		case "Super Spy Infiltration":
			displayTxt = "When super spying at a starbase, specificiations (weapons, cargo, friendly code, true hull) for each orbiting starship that matches ownership are revealed to the spying player. Requires " + shipAbility("Super Spy Advanced") + ".";
			break;
		case "Harmonic Weapon Modulation":
			displayTxt = "Allows a Bird starship to initiate combat with other ships even with friendly codes matched. Bird weapons will pierce shields if matched.";
			break;
		case "Covert Data Link":
			displayTxt = "Allows a Bird starship on "+shipAbility("Super Spy")+" and Friendly Code `spy` to match the friendly code of a planet (even if changed).";
			break;
		case "Super Spy Infiltration":
			displayTxt = "When super spying at a starbase, specificiations (weapons, cargo, friendly code, true hull) for each orbiting starship that matches ownership are revealed to the spying player. Requires " + shipAbility("Super Spy Advanced") + ".";
			break;
		case "Red Storm Cloud": // Dummied out. Kept here as a reference
			displayTxt = "Allows TWO <a href=\"javascript:dispInfo('Red Wind Storm-Carrier')\">Red Wind Storm Carriers</a> to support other carriers with their fighter bays and ammunition.";
			break;
		// Fascist bonuses
		case "Pillage Planet":
			displayTxt = "Allows a starship to pillage a planet to generate and scavenge money and supplies, killing 20% of the population(s) in the process. Requires beam(s) to use";
			break;
		case "15X Ground Combat":
			displayTxt = "Fascist clans dropped onto a foreign planet kill 15 times as many foreign colonists as normal clans";
			break;
		case "5X Ground Defense":
			displayTxt = "Fascist clans defend 5 times better against clans dropped from foreign ships";
			break;
		case "Plunder Planet":
			displayTxt = "Upgrades Pillage Planet to generate 2.5X more money and supplies than a normal pillage";
			break;
		case "2X Faster Beams":
			displayTxt = "Beam weapons on native starships recharge twice as quickly in combat";
			break;
		// Privateer bonuses
		case "Rob Ship":
			displayTxt = "Allows a starship to steal the fuel contents of enemy ships. Requires beam(s) to use";
			break;
		case "3X Beam Crew Kill":
			displayTxt = "Beams deal three times as much crew kill once the shields are gone";
			break;
		case "Pleasure Planets":
			displayTxt = "50&deg;W planets can become a Pleasure Planet by landing and disassembling a Lady Royale, providing a massive boost in colonist happiness and doubling "+shipAbility("Gambling")+" effects, at the expense of being exposed to foreign races within 250LY, reducing native happiness, and halving mining/factory efficiency.<br /><br />Non-cyborg, non-crystalline, non-robotic, non-horwasp colonists within 250LY will migrate to the planet each turn <span class=\"bindTxt\">(4% if within 100LY; otherwise 2%)</span>";
			break;
		case "Rob Fighters":
			displayTxt = "When using Rob Ship, carriers have a 10% chance to steal each fighter. Stolen fighters each have a 50% of being lost.";
			break;
		case "Hidden Minefields": //Where is this?
			displayTxt = "When using Rob Ship, carriers have a 10% chance to steal each fighter. Stolen fighters each have a 50% of being lost.";
			break;
		// Cyborg bonuses
		case "Assimilation":
			displayTxt = "Cyborg colonists will assimilate any non-amorphous natives on the planets they colonize, often resulting in huge outposts";
			break;
		case "Recover Minerals":
			displayTxt = "Victorious starships can scavenge the mineral costs of the ships they destroy in combat, in this order: Neutronium (from the tanks), Molybdenum, Duranium, Tritanium";
			break;
		case "Repair Self":
			displayTxt = "Damaged starships may repair themselves 10% per turn, but must not move under their own power";
			break;
		// Crystalline bonuses
		case "Web Mines":
			displayTxt = "Deadly minefields that drain ALL foreign starships that are caught in its webs. No Friendly Code system. Can not be layed in other identities";
			break;
		case "Desert Worlds":
			displayTxt = "Crystalline colonists grow faster on hotter worlds, but slower on temperate and colder worlds. Can grow on nearly any planet";
			break;
		case "Improved Desert Habitation":
			displayTxt = "Crystalline colonists grow even faster on hotter worlds, but even slower on colder worlds";
			break;
		// Empire bonuses
		case "Dark Sense":
			displayTxt = "Starships set to this mission will detect any foreign planets within 200LY. Picks up minerals, money, and whether there is a starbase present";
			break;
		case "Destroy Planet":
			displayTxt = "Allows an undamaged Gorbie, with weapons (except ammo) and fuel fully maxed out, to charge up a planet buster. Requires a full turn of concentration to succeed";
			break;
		case "Debris Disk Defense":
			displayTxt = "Allows otherwise illegal starships to navigate through debris disks, at the expense of risking collisions with asteroids";
			break;
		case "Starbase Fighter Transfer":
			displayTxt = "Allows starbases and Gorbies to exchange fighters amongst themselves, in an intelligent, ID-neutral, order.";
			break;
		case "Dark Detection":
			displayTxt = "Upgrades Dark Sense to allow starships to sense foreign ships from 10LY away. Includes cloaked ships, but only gives away ship counts by race";
			break;
		case "Galactic Power":
			displayTxt = "Gorbie Battlecarriers will fight on the left side of combat, regardless of battle value";
			break;
		case "Fighter Patrol Routes": // NYI
			displayTxt = "Starbases &lt;200 LY apart can form blockades networks. Any intruders (even cloaked) that pass through are attacked by patrolling fighters. Requires primary order and 10kT fuel per network per turn. Can be detected by Sensor Sweep";
			break;
		// Robotic bonuses
		case "4X Mine Laying":
			displayTxt = "Torpedo ships will lay 4X as many mines compared to normal ships when laid in their own identity";
			break;
		case "Star Cluster Radiation Immunity":
			displayTxt = "Robotic starships are unaffected by the radiation emitted by star clusters. They still can not enter star clusters.<br />Robotic colonies inside radiation can build normal starbases, instead of Radiation Shielded starbases.";
			break;
		case "Hardened Mines":
			displayTxt = "Minefields are immune to <a href=\"javascript:dispInfo('Fighter Mine Sweep')\">fighter sweeping</a>";
			break;
		case "Dense Minefields":
			displayTxt = "Minefields can go beyond 22,500 units in quantity, increasing mine detonation and decay rates. Radius is still capped at 150 LY. Requires Lay Large Minefields";
			break;
		case "Build Clans":
			displayTxt = "Starships can make new colonists at a rate of 1 clan per 1 mineral and 1 supply. Requires a mission";
			break;
		case "Internal Temp Regulation":
			displayTxt = "Robotic colonists can grow on every planet as if they were 50°W";
			break;
		// Rebel bonuses
		case "Rebel Ground Attack":
			displayTxt = "Allows starships to land saboteurs, dealing MASSIVE economic damage to the planet they contend with";
			break;
		case "Dark Sense Defense":
			displayTxt = "Planets can not be picked up by Dark Sense missions";
			break;
		case "Arctic Planet Colonies":
			displayTxt = "Allows rebel planets to maintain 9,000,000 colonist outposts on planets whose climates are below 20. Does not affect growth";
			break;
		case "Energy Defense Field":
			displayTxt = "Planets with 20+ defenses and no base can use the code EDF to prevent orbital combat (but not other interference) with hostile ships. Cloaks Falcons and burns 50kT fuel per turn while it is active";
			break;
		// Colonial bonuses
		case "Fighter Mine Sweep":
			displayTxt = "Allows carriers to use their fighters to sweep NORMAL mines from 100LY away. Stacks with beams";
			break;
		// Horwasp bonuses
		case "Ship Building Planets":
			displayTxt = "Horwasp planets can create ships and <a href=\"javascript:dispInfo('Pod')\">pods</a> without the necessity to develop technology";
			break;
		case "Swarming":
			displayTxt = "Horwasp ships will scatter 10% of their clans within 100 LY if they are destroyed";
			break;
		case "Rock Attacks":
			displayTxt = "Horwasp planets have the ability to launch rocks towards other planets. Rocks cause damage to hostile lifeforms, but minable minerals will be added to the planet's core";
			break;
		case "Reduced Diplomacy":
			displayTxt = "Horwasps are permitted to create relationships beyond Safe Passages only with another Horwasp player";
			break;
		case "Psychic Scanning":
			displayTxt = "Horwasps can detect enemy ships regardless of environment or cloaking status. Psychic scanning range is half the normal scanning range <span class=\"bindTxt\">(default: 150 LY)</span>. Cloaked ships still can not be attacked. Robotic ships are resistant to Psychic Scanning, and can only be detected normally within further reduced distance <span class=\"bindTxt\">(default: 75 LY)</span>";
			break;
		case "Pod":
			displayTxt = "A pod is a tiny space object that moves autonomously once it leaves planetary orbit. They have a fixed trajectory, and do not count towards the ship limit. <span class=\"bindTxt\">They can still usually be towed.</span><br /><br />If a pod reaches a planet, it will land and is removed from play. Visibility is limited to 50 LY for pods with weapons, and otherwise 25 LY";
			break;
		case "Call to Hive":
			displayTxt = "Exclusive mission that allows a Hive to remotely take 1% of clans from each owned planet within 100 LY";
			break;
		// Common bonuses
		case "Lay Minefields":
			displayTxt = "Allows starships to lay mines up to 100LY (10,000 mine units)";
			break;
		case "Lay Large Minefields":
			displayTxt = "Increases maximum minefield size to 150LY (22,500 mine units)";
			break;
		case "Ion Starbase Shield":
			displayTxt = "Starships docked at a starbase are safe from the dragging and damaging effects of ion storms. Does not prevent decloak";
			break;
		case "Clone Ships":
			displayTxt = "Allows a starbase to clone a foreign design before the ship limit";
			break;
		case "Advanced Cloning":
			displayTxt = "Allows a starbase to clone a foreign design as part of the normal build queue, even after the ship limit. Requires Clone Ships";
			break;
		// Uncommon bonuses
		case "Build Fighters":
			displayTxt = "Allows carriers to build fighters in space by loading minerals, at a cost of the usual minerals, and 5 Supplies each. No starbase required";
			break;
		case "Fortress":
			displayTxt = "Multiplies ground combat defense by 5.";
			break;
		case "Hide In Warp Well":
			displayTxt = "Starships under 60kT hull mass can hide in warp wells, reducing visibility to 1LY. Requires a mission";
			break;
		case "Ion Starbase Shield":
			displayTxt = "Starships docked at a starbase are safe from the dragging and damaging effects of ion storms. Does not prevent decloak";
			break;
		case "Loki Immunity":
			displayTxt = "ALL starships under the control of a Loki Immune player are unaffected by the "+shipAbility("Tachyon Device")+" ability";
			break;
		case "Planet Immunity":
			displayTxt = "Planets can NOT attack Planet Immune starships";
			break;
		case "Priority Intercept Attack":
			displayTxt = "Also known as a Cloak Intercept (Host 3.22) and simply Intercept Attack (PHost), ships can initiate a priority intercept by choosing a victim and setting the correct aggression setting. Requires a " + shipAbility("Cloak") + " to be installed on the ship, but usable regardless of damage level";
			break;
		case "Minefields Save Fuel":
			displayTxt = "Starships travelling through own mine fields spend 20% less neutronium fuel";
			break;
		case "Shock Troops":
			displayTxt = "Multiplies ground combat attack by 5.";
			break;
		case "Starbase Fighter Sweeping":
			displayTxt = "Allows the starbase to use its fighters to sweep NORMAL mines from 100LY away. Requires a primary order";
			break;
		case "Starbase Mine Laying":
			displayTxt = "Allows the starbase to use its torpedo stock to lay mines. Requires a primary order";
			break;
		case "Starbase Mine Sweeping":
			displayTxt = "Allows the starbase to use its beams to sweep nearby mines. Requires a primary order";
			break;
		case "Starbase Money Transfer":
			displayTxt = "Allows starbases to transfer funds, via primary orders";
			break;
		case "Tow Capture":
			displayTxt = "Allows usage of a boarding party to capture a starship that has no fuel";
			break;
			
		default:
			// Ship Design
			displayTxt = detailedReport(techItem);
			break;
	}
	
	if (checkFighters) {
		var reqName;
		
		for (var j = 1; j <= 5; j++) {
			reqName = j + " Free Starbase Fighters";
			if (techItem == reqName)
				displayTxt = "Starbases automatically build " + j + " fighter(s) per turn, minerals and space permitting";
		}
	}


	displayTxt = "<b>" + techItem + "</b><br />" + displayTxt
	
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
}

//Calculate costs
function calcCosts() {
    var resL = new Array("Money", "Adv");
    var totalRes = new Array(2);
    var userRes = new Array(2);
    var remRes = new Array(2);
    
    for (var j = 0; j < totalRes.length; j++) {
        totalRes[j] = 0;
    }

    for (var i = 0; i < elementObj.length; i++) {
        if (document.getElementById("tech"+i+"Buy").checked) {
            totalRes[0] += elementObj[i].money;
        }
        if (document.getElementById("tech"+i+"Use").checked) {
            totalRes[1] += elementObj[i].advCost;
        }
    }
       
    for (var k = 0; k < 2; k++) {
        document.getElementById("tot"+resL[k]).innerHTML = totalRes[k];
        userRes[k] = document.getElementById("user"+resL[k]).value;
        remRes[k] = userRes[k] - totalRes[k];
		if (remRes[k] < 0) {
			document.getElementById("tot"+resL[k]).style.color = "#FF0";
			document.getElementById("tot"+resL[k]).style.fontWeight = "bold";
		} else {
			document.getElementById("tot"+resL[k]).style.color = "";
			document.getElementById("tot"+resL[k]).style.fontWeight = "";
		}
        document.getElementById("rem"+resL[k]).innerHTML = remRes[k];
    }
	
	//Todo - Check the clone options
}

//Setup Simulator
function setupSim() {
	var techPanel = document.getElementById("techItems");
	var shipPanel = document.getElementById("shipDesigns");
	
	var buttonPanel = document.getElementById("buttonPanel");
    var trFrag, tdFrag, inputFrag, buttonFrag;
	var techName, popular;
	var bodyPanel = document.getElementsByTagName("body")[0];
	var infoFrag;

	var targetDate = new Date;
	initShips();
	
	infoFrag = document.createElement("div");
	infoFrag.id = "infobox";
	infoFrag.style.position = "fixed";
	infoFrag.style.left = "0px";
	infoFrag.style.right = "0px";
	infoFrag.style.top = "200px";
	infoFrag.style.marginLeft = "auto";
	infoFrag.style.marginRight = "auto";
	infoFrag.style.maxWidth = "1000px";
	infoFrag.style.zIndex = "3";
	infoFrag.style.background = "#200020";
	infoFrag.style.border = "1px #CCC solid";
	infoFrag.style.borderRadius = "10px";
	infoFrag.style.textAlign = "center";
	infoFrag.style.cursor = "crosshair";
	if (getCookie("techVisit") >= 1) {
		infoFrag.style.display = "none";
	} else {
		infoFrag.innerHTML = "<b>Welcome to the Campaign Tech Simulator!</b><br />Click on a tick box to simulate a purchase or activation of a ship design or tech item.<br /><br />This bubble will pop up when you click on an item for more info. Tap anywhere on this bubble to close it.";
	}
	infoFrag.onclick = function() {
		document.getElementById("infobox").style.display = "none"
	};
	bodyPanel.appendChild(infoFrag);

	targetDate.setTime(targetDate.getTime() + (30*24*60*60*1000))
	setCookie("techVisit","1",targetDate,"/",null,false);
    
    buttonFrag = document.createElement("button");
	buttonFrag.className = "interact";
	buttonFrag.innerHTML = "Buy all";
	buttonFrag.title = "Purchase all techs";
	addEvent(buttonFrag,"click",buyAll,false);
	buttonPanel.appendChild(buttonFrag);
	
    buttonFrag = document.createElement("button");
	buttonFrag.className = "interact";
	buttonFrag.innerHTML = "Reset to default";
	buttonFrag.title = "Resets race to default specs";
	addEvent(buttonFrag,"click",resetFactory,false);
	buttonPanel.appendChild(buttonFrag);
	
    buttonFrag = document.createElement("button");
	buttonFrag.className = "interact";
	buttonFrag.innerHTML = "Clear all";
	buttonFrag.title = "Clears the entire board (including starting tech)";
	addEvent(buttonFrag,"click",clearAll,false);
	buttonPanel.appendChild(buttonFrag);
	
	shipCount = 0;
	techCount = 0;
	trueCount = 0;
    
    for (var i = 0; i < elementObj.length; i++) {
		popular = false;
		extraFlag = null;
        trFrag = document.createElement("tr");
        trFrag.id = "adv"+i;
		if (elementObj[i].shipFlag) {
			trueCount = shipCount++;
		} else {
			trueCount = techCount++;
		}
		
        if (trueCount % 2 == 1) {
            trFrag.className = "rowLight";
        }
        
		techName = elementObj[i].eleName;
		altName = techName.replace("'","\\'");

		switch (techName) {
			case "Red Storm Cloud":
				// Fall through... twice
			case "Minefields Save Fuel":
			case "Fighter Patrol Routes":
				extraFlag = "Preview";
				break;
			case "Advanced Cloning":
				popular = 1967;
				break;
			case "Saurian Class Heavy Frigate":
				popular = 2;
				break;
			case "Super Spy Command":
				popular = 4;
				break;
			case "Armored Ore Condenser":
				popular = 8;
				break;
			case "Red Wind Storm-Carrier":
				popular = 16;
				break;
			case "B41b Explorer":
				popular = 32;
				break;
			case "Imperial Topaz Class Gunboats":
				popular = 64;
				break;
			case "5 Free Starbase Fighters":
				checkFighters = true;
				break;
			case "Ru30 Gunboats":
				popular = 128;
				break;
			case "Ion Starbase Shield":
				popular = 256;
				break;
			case "Heavy Armored Transport":
				popular = 512;
				break;
			case "Tantrum Liner":
				popular = 1024;
				break;
			case "Iron Lady Class Command Ship":
				popular = 1536;
				break;
		}
		
        tdFrag = document.createElement("td");
		tdFrag.className = "center";
        inputFrag = document.createElement("input");
        inputFrag.type = "checkbox";
        inputFrag.id = "tech"+i+"Buy";
        if (extraFlag == "Preview") {
            inputFrag.style.display = "none";
            inputFrag.disabled = true;
        } else if (elementObj[i].money == 0) {
            inputFrag.defaultChecked = true;
            inputFrag.style.display = "none";
            inputFrag.disabled = true;
		}
        addEvent(inputFrag, "click", calcCosts, false);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
        
        tdFrag = document.createElement("td");
		tdFrag.className = "center";
        inputFrag = document.createElement("input");
        inputFrag.type = "checkbox";
        inputFrag.id = "tech"+i+"Use";
        if (elementObj[i].money == 0) {
            inputFrag.defaultChecked = true;
        }
        if (elementObj[i].lockDesign || elementObj[i].advCost == 0 || extraFlag == "Preview") {
            inputFrag.style.display = "none";
            inputFrag.disabled = true;
        }
        addEvent(inputFrag, "click", calcCosts, false);
		tdFrag.appendChild(inputFrag);
		trFrag.appendChild(tdFrag);
        
        tdFrag = document.createElement("td");
		tdFrag.innerHTML = "<a href=\"javascript:dispInfo('"+altName+"')\">"+techName+"</a>";

		if (extraFlag == "Preview") {
			tdFrag.innerHTML += " <span style='background: #400; font-weight: bold;'>Preview!</span>";
		} else if (extraFlag == "New") {
			tdFrag.innerHTML += " <span style='background: #440; font-weight: bold;'>New!</span>";
		} else if (false && (popular & Math.pow(2,simRace-1))) {
			//Bitwise AND operation: determine whatever 'bits' are common
			tdFrag.innerHTML += " <span style='background: #440; font-weight: bold;'>Popular!</span>";
		}
		trFrag.appendChild(tdFrag);
        
        if (elementObj[i].money > 0) {
            tdFrag = document.createElement("td");
            tdFrag.className = "numeric colLight";
            tdFrag.innerHTML = elementObj[i].money;
            trFrag.appendChild(tdFrag);
        } else {
            tdFrag = document.createElement("td");
            tdFrag.className = "center colLight";
            tdFrag.style.visibility = "hidden";
            tdFrag.innerHTML = "Standard";
            trFrag.appendChild(tdFrag);
        }
        tdFrag = document.createElement("td");
        tdFrag.className = "numeric";
		tdFrag.innerHTML = elementObj[i].advCost;
		trFrag.appendChild(tdFrag);
        
		trFrag.appendChild(tdFrag);
        
		if (elementObj[i].shipFlag) {
			shipPanel.appendChild(trFrag);
		} else {
			techPanel.appendChild(trFrag);
		}
    }
    
    calcCosts();
    if (document.getElementById("userAdv").value == "") {
        var advUsed = document.getElementById("totAdv").innerHTML;
        var advRem = maxAdvantage - advUsed;
        var startMC = 0;
		
		if (getCookie("megacredits")) {
			startMC = getCookie("megacredits");
		}
        
        document.getElementById("userMoney").value = startMC;
        document.getElementById("userAdv").value = maxAdvantage;
    }
    calcCosts();
}

//Register new design
function addDesign(name, ship, mc, adv, locked) {
    elementObj[designIter] = new upgrade(name, ship, mc, adv, locked);
    designIter++;
}

//Register common designs
function commonTech(expanded) {
	if (expanded) {
		addDesign("Large Deep Space Freighter",true,0,15,false);
		addDesign("Neutronic Refinery Ship",true,0,10,false);
		addDesign("Merlin Class Alchemy Ship",true,0,25,false);
	}
	addDesign("Lay Minefields",false,0,70,true);
	addDesign("Lay Large Minefields",false,0,30,false);
	if (expanded) {
		addDesign("Ion Starbase Shield",false,1780,5,false);
	}
}

//Add functionality for races that can clone
function cloneShips() {
    addDesign("Clone Ships",false,0,10,false);
    addDesign("Advanced Cloning",false,1115,55,false);
}

//Buys all tech
function buyAll() {
	var boxFrag;
    for (var i = 0; i < elementObj.length; i++) {
        boxFrag = document.getElementById("tech"+i+"Buy")
		if (boxFrag) {
			boxFrag.checked = true;
		}
    }
	calcCosts();
}

//Resets race to default state, except for resources
function resetFactory() {
	var boxFrag;
    for (var i = 0; i < elementObj.length; i++) {
		if (elementObj[i].money > 0) {
	        boxFrag = document.getElementById("tech"+i+"Buy")
			if (boxFrag) {
				boxFrag.checked = false;
			}
			boxFrag = document.getElementById("tech"+i+"Use")
			if (boxFrag) {
				boxFrag.checked = false;
			}
		} else {
			boxFrag = document.getElementById("tech"+i+"Use")
			if (boxFrag) {
				boxFrag.checked = true;
			}
		}
    }
	calcCosts();
}

//Clears all tickboxes
function clearAll() {
	var boxFrag;
    for (var i = 0; i < elementObj.length; i++) {
		if (elementObj[i].money > 0) {
	        boxFrag = document.getElementById("tech"+i+"Buy")
			if (boxFrag) {
				boxFrag.checked = false;
			}
			boxFrag = document.getElementById("tech"+i+"Use")
			if (boxFrag) {
				boxFrag.checked = false;
			}
		} else if (!elementObj[i].lockDesign) {
			boxFrag = document.getElementById("tech"+i+"Use")
			if (boxFrag) {
				boxFrag.checked = false;
			}
		}
    }
	calcCosts();
}

//Cookie management

function writeDateString(dateObj) {
	var monthName = new Array("Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sep",
  "Oct", "Nov", "Dec");
	
	var thisMonth = dateObj.getMonth();
	var thisYear = dateObj.getFullYear();

	return monthName[thisMonth] + " " + dateObj.getDate() + ", " + thisYear;
}

function setCookie(cName, cValue, expDate, cPath, cDomain, cSecure) {
	if (cName && cValue != "") {
		var cString = cName + "=" + encodeURI(cValue);
		cString += (expDate ? ";expires=" + expDate.toUTCString(): "");
		cString += (cPath ? ";path=" + cPath : "");
		cString += (cDomain ? ";domain=" + cDomain : "");
		cString += (cSecure ? ";secure" : "");
		document.cookie = cString;
	}
}

function getCookie(cName) {
	if (document.cookie) {
		var cookies = document.cookie.split("; ");
		for (var i = 0; i < cookies.length; i++) {
			if (cookies[i].split("=")[0] == cName) {
				return decodeURI(cookies[i].split("=")[1]);
			}
		}
	}
}

/* ------------------------------------------------------------------------ */

//Shiplist related assets
var shipDb = new Array();

function initShips() {
	//Common ships
	shipDb.push(new shipDesign("Large Deep Space Freighter",6,130,2,102,0,0,0,600,1200,85,7,8,160,null));
	shipDb.push(new shipDesign("Neutronic Refinery Ship",9,712,10,190,6,0,0,800,1050,125,150,527,970,shipAbility("Refinery")));
	shipDb.push(new shipDesign("Merlin Class Alchemy Ship",10,920,10,120,8,0,0,450,2700,625,250,134,840,shipAbility("Alchemy")));

	//Fed ships
	shipDb.push(new shipDesign("Bohemian Class Survey Ship",3,32,2,70,2,0,0,180,30,10,20,3,40,shipAbility("Heats to 50")));
	shipDb.push(new shipDesign("Vendetta C Class Frigate",5,100,1,99,4,4,0,140,30,9,17,29,90,null));
	shipDb.push(new shipDesign("Nebula Class Cruiser",6,170,2,430,4,4,0,470,350,42,61,73,390,null));
	shipDb.push(new shipDesign("Banshee Class Destroyer",6,120,2,336,4,2,0,140,80,22,47,53,110,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Banshee B Class Destroyer",6,120,2,336,7,1,0,140,70,22,47,53,110,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Wild Banshee Class Destroyer",6,120,2,336,10,1,0,140,60,22,47,53,110,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Brynhild Class Escort",7,90,1,162,4,0,0,140,30,5,45,35,100,shipAbility("Bioscanning")));
	shipDb.push(new shipDesign("Missouri Class Battleship",8,395,2,265,8,6,0,260,170,143,150,510,140,null));
	shipDb.push(new shipDesign("Arkham Class Frigate",8,150,2,328,6,3,0,120,90,12,43,67,70,null));
	shipDb.push(new shipDesign("Arkham Class Destroyer",8,155,2,328,6,3,0,180,140,12,43,67,70,null));
	shipDb.push(new shipDesign("Arkham Class Cruiser",8,160,2,328,6,3,0,250,270,12,43,67,70,null));
	shipDb.push(new shipDesign("Kittyhawk Class Carrier",9,173,2,370,4,0,6,280,65,25,45,49,195,null));
	shipDb.push(new shipDesign("Thor Class Frigate",9,173,2,370,1,8,0,160,95,35,89,99,130,null));
	shipDb.push(new shipDesign("Thor B Class Frigate",9,233,2,380,1,8,0,210,95,40,60,99,130,null));
	shipDb.push(new shipDesign("Thor Class Heavy Frigate",9,293,2,390,1,8,0,260,95,45,65,109,130,null));
	shipDb.push(new shipDesign("Diplomacy Class Cruiser",9,180,2,328,6,6,0,350,95,35,53,79,410,null));
	shipDb.push(new shipDesign("Diplomacy B Class Cruiser",9,220,2,328,6,6,0,350,125,35,63,89,410,null));
	shipDb.push(new shipDesign("Nova Class Super-dreadnought",10,650,4,1810,10,10,0,560,320,240,343,350,810,null));
	
	//Lizard ships
	shipDb.push(new shipDesign("Reptile Class Destroyer",3,60,2,45,4,0,0,120,50,22,33,15,50,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Reptile Class Escort",3,60,1,45,4,0,0,120,50,22,33,15,50,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Lizard Class Cruiser",4,160,2,430,4,3,0,330,290,42,81,30,190,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Vendetta Stealth Class Frigate",5,100,1,99,4,4,0,140,30,12,23,37,90,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Saurian Class Light Cruiser",7,120,2,336,4,2,0,260,150,32,67,23,85,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Saurian Class Frigate",7,130,2,336,7,2,0,260,120,32,67,23,85,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Saurian Class Heavy Frigate",7,190,2,336,9,3,0,260,90,32,67,43,105,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Chameleon Class Freighter",8,121,2,85,0,0,0,510,960,23,21,65,260,shipAbility("Chameleon Device")));
	shipDb.push(new shipDesign("Madonnzila Class Carrier",9,331,2,910,4,0,5,290,150,110,123,90,420,null));
	shipDb.push(new shipDesign("Madonnzila Class Carrier (C)",9,331,2,910,4,0,5,290,150,140,133,130,720,shipAbility("Chameleon Device")));
	shipDb.push(new shipDesign("T-Rex Class Battleship",10,421,2,810,10,5,0,490,190,140,153,100,350,null));
	shipDb.push(new shipDesign("T-Rex Class Battleship (C)",10,421,2,810,10,5,0,490,190,162,173,149,650,shipAbility("Chameleon Device")));
	shipDb.push(new shipDesign("Zilla Class Battlecarrier",10,500,4,500,10,0,5,500,250,250,250,250,2500,shipAbility("Emork's Spirit Bonus") + " and " + shipAbility("Tidal Force Shield")));

	//Bird man ships
	shipDb.push(new shipDesign("Swift Heart Class Scout",1,45,2,126,2,0,0,120,50,6,20,5,60,shipAbility("Cloak") + " and " + shipAbility("Neb Scanner")));
	shipDb.push(new shipDesign("White Falcon Class Cruiser",3,120,2,150,4,1,0,430,140,32,61,33,110,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Bright Heart Class Destroyer",3,80,2,122,2,4,0,90,40,22,43,15,140,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Bright Heart Light Destroyer",3,80,1,122,2,4,0,90,40,22,43,15,100,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Fearless Wing Cruiser",5,150,2,300,6,1,0,360,240,52,81,63,180,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Valiant Wind Class Carrier",6,180,2,322,7,0,3,190,80,52,61,123,380,null));
	shipDb.push(new shipDesign("Valiant Wind Storm-Carrier",6,180,2,322,7,0,6,190,80,22,31,53,160,null));
	shipDb.push(new shipDesign("Deth Specula Heavy Frigate",6,183,2,240,4,6,0,205,50,30,50,89,180,shipAbility("Advanced Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Resolute Class Battlecruiser",7,180,2,348,8,3,0,480,280,52,71,93,380,shipAbility("Advanced Cloak")));
	shipDb.push(new shipDesign("Enlighten Class Research Vessel",9,160,2,520,5,1,0,180,40,40,62,88,340,shipAbility("Educator")));
	shipDb.push(new shipDesign("Dark Wing Class Battleship",10,491,2,910,10,8,0,290,150,170,183,110,450,shipAbility("Advanced Cloak")));
	
	//Fascist ships
	shipDb.push(new shipDesign("D7a Painmaker Class Cruiser",2,170,2,352,4,0,0,230,120,42,81,43,90,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("D7b Painmaker Class Cruiser",2,170,2,352,4,0,0,230,120,42,81,43,90,shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (50-20)")));
	shipDb.push(new shipDesign("D7 Coldpain Class Cruiser",4,175,2,373,4,2,0,430,100,42,71,63,120,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Armored Ore Condenser",4,85,2,64,2,0,0,210,170,12,45,16,90,shipAbility("Ore Condenser")));
	shipDb.push(new shipDesign("Ill Wind Class Battlecruiser",5,275,2,525,10,2,0,480,260,82,91,93,320,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("D3 Thorn Class Destroyer",5,90,2,222,2,4,0,120,40,32,43,25,110,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("D3 Thorn Class Frigate",5,110,1,222,3,5,0,180,40,32,43,25,110,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("D3 Thorn Class Cruiser",5,130,1,222,3,5,0,250,130,64,51,63,175,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("D19b Nefarious Class Destroyer",6,96,2,265,7,0,0,160,40,32,53,65,180,shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (100-20)")));
	shipDb.push(new shipDesign("D19c Nefarious Class Destroyer",6,46,1,265,7,0,0,160,40,32,53,65,180,shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (100-20)")));
	shipDb.push(new shipDesign("Deth Specula Stealth",6,153,2,240,6,4,0,205,50,30,50,89,280,shipAbility("Cloak") + ", " + shipAbility("Radiation Shielding") + ", and " + shipAbility("Recloak Intercept")));
	shipDb.push(new shipDesign("Saber Class Frigate",8,153,2,420,10,0,0,150,25,25,35,95,280,shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (100-10)")));
	shipDb.push(new shipDesign("Saber Class Shield Generator",8,173,2,420,10,0,0,150,25,50,77,95,330,shipAbility("Radiation Shielding") + ", " + shipAbility("Glory Device (100-10)") + ", and " + shipAbility("Shield Generator")));
	shipDb.push(new shipDesign("D9 Usva Class Stealth Raider",9,347,2,489,10,3,0,550,320,98,102,148,600,shipAbility("Radiation Shielding") + " and " + shipAbility("Stealth Armor")));
	shipDb.push(new shipDesign("Victorious Class Battleship",10,451,2,810,10,6,0,290,130,170,193,90,410,shipAbility("Radiation Shielding")));
	
	//Privateer ships
	shipDb.push(new shipDesign("Br4 Class Gunship",1,55,2,55,5,0,0,80,20,12,17,35,60,shipAbility("Cloak") + " and " + shipAbility("Gravitonic Acceleration")));
	shipDb.push(new shipDesign("Dwarfstar Class Transport",3,100,2,122,6,0,0,180,220,62,43,15,280,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Dwarfstar II Class Transport",3,110,2,122,6,0,0,270,320,32,43,15,180,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Br5 Kaye Class Torpedo Boat",3,57,2,40,4,1,0,80,20,22,17,15,70,shipAbility("Cloak") + " and " + shipAbility("Gravitonic Acceleration")));
	shipDb.push(new shipDesign("Meteor Class Blockade Runner",5,90,2,102,4,4,0,285,120,22,17,55,250,shipAbility("Cloak") + " and " + shipAbility("Gravitonic Acceleration")));
	shipDb.push(new shipDesign("Hikos Armored Trailer",8,195,0,400,8,2,0,20,20,50,60,25,175,shipAbility("Trailer")));
	shipDb.push(new shipDesign("Bloodfang Class Carrier",10,220,2,222,7,0,4,220,190,42,61,133,480,null));
	shipDb.push(new shipDesign("Bloodfang Stealth Class Carrier",10,220,2,222,7,0,5,220,190,42,61,133,480,shipAbility("Stealth Armor")));

	//Cyborg ships
	shipDb.push(new shipDesign("B200 Class Probe",1,30,1,6,1,0,0,80,15,12,17,7,30,shipAbility("Hyperdrive")));
	shipDb.push(new shipDesign("B41 Explorer",2,35,1,8,4,0,0,270,70,6,20,15,40,shipAbility("Neb Scanner")));
	shipDb.push(new shipDesign("B41b Explorer",2,35,1,8,4,0,0,270,70,6,20,15,40,shipAbility("Chunnel Target") + " and " + shipAbility("Neb Scanner")));
	shipDb.push(new shipDesign("B222 Destroyer",5,86,2,165,7,0,0,160,40,32,43,65,130,null));
	shipDb.push(new shipDesign("B222b Destroyer",5,86,2,165,7,0,0,160,40,32,43,65,130,shipAbility("Chunnel Self (B200)")));
	shipDb.push(new shipDesign("Firecloud Class Cruiser",6,120,2,236,6,2,0,440,290,32,47,84,290,shipAbility("Chunnel Initiator") + " and " + shipAbility("Chunnel Target")));
	shipDb.push(new shipDesign("Lorean Class Temporal Lance",7,325,2,489,8,6,0,360,200,184,20,590,1280,shipAbility("Temporal Lance") + " and " + shipAbility("Chunnel Target")));
	shipDb.push(new shipDesign("Biocide Class Carrier",9,860,6,2810,10,0,10,1260,320,340,343,550,910,null));
	shipDb.push(new shipDesign("Annihilation Class Battleship",10,960,6,2910,10,10,0,1260,320,340,343,550,910,null));
	shipDb.push(new shipDesign("Dungeon Class Stargate",10,1970,10,100,0,0,0,440,3900,1250,510,840,1440,shipAbility("Stargate") + " and " + shipAbility("Chunnel Stabilizer")));

	//Crystalline ships
	shipDb.push(new shipDesign("Opal Class Torpedo Boat",2,67,1,25,1,1,0,55,19,12,29,20,60,null));
	shipDb.push(new shipDesign("Opal--T Class Torpedo Boat",2,67,1,25,1,1,0,55,19,12,29,20,60,shipAbility("Web Cloak")));
	shipDb.push(new shipDesign("Ruby Class Light Cruiser",3,120,2,136,4,2,0,390,370,32,47,43,95,null));
	shipDb.push(new shipDesign("Topez Class Gunboat",3,65,1,20,4,0,0,60,15,12,27,25,60,null));
	shipDb.push(new shipDesign("Topaz Class Gunboats",3,65,1,20,4,0,0,60,15,12,27,25,60,shipAbility("Squadron") + ", " + shipAbility("Elusive") + ", and " + shipAbility("Planet Immunity")));
	shipDb.push(new shipDesign("Imperial Topaz Class Gunboats",3,65,1,20,5,0,0,60,15,15,35,31,75,shipAbility("Squadron") + ", " + shipAbility("Elusive") + ", and " + shipAbility("Planet Immunity")));
	shipDb.push(new shipDesign("Sky Garnet Class Destroyer",5,90,2,80,7,1,0,120,30,32,43,25,110,null));
	shipDb.push(new shipDesign("Sky Garnet Class Frigate",5,90,1,80,7,1,0,120,50,15,33,22,75,null));
	shipDb.push(new shipDesign("Sapphire Class Space Ship",5,57,1,20,1,1,0,120,30,15,33,39,390,shipAbility("Hyperdrive")));
	shipDb.push(new shipDesign("Emerald Class Battlecruiser",6,180,2,258,8,3,0,480,510,52,71,93,390,null));
	shipDb.push(new shipDesign("Onyx Class Frigate",8,153,2,320,8,1,0,150,10,25,35,95,280,shipAbility("Heats to 100")));
	shipDb.push(new shipDesign("Pyrite Class Frigate",8,173,2,350,8,1,0,150,10,65,85,170,290,shipAbility("Sunburst Device")));
	shipDb.push(new shipDesign("Selenite Class Battlecruiser",8,240,2,426,10,4,0,440,380,64,80,160,400,shipAbility("Move Minefields")));
	shipDb.push(new shipDesign("Diamond Flame Class Battleship",9,451,2,510,10,6,0,400,90,70,93,390,410,null));
	shipDb.push(new shipDesign("Crystal Thunder Class Carrier",10,320,4,422,6,0,8,290,80,42,61,233,480,null));

	//Empire ships
	shipDb.push(new shipDesign("Pl21 Probe",1,24,1,1,1,0,0,180,20,1,1,25,30,shipAbility("Hyperdrive")));
	shipDb.push(new shipDesign("Ru25 Gunboat",1,65,1,10,4,0,0,90,1,12,27,25,60,null));
	shipDb.push(new shipDesign("Ru25 Gunboats",1,65,1,8,4,0,0,90,1,12,27,25,60,shipAbility("Squadron") + ", " + shipAbility("Elusive") + ", and " + shipAbility("Planet Immunity")));
	shipDb.push(new shipDesign("Ru30 Gunboats",1,65,1,10,5,0,0,90,1,15,35,31,75,shipAbility("Squadron") + ", " + shipAbility("Elusive") + ", and " + shipAbility("Planet Immunity")));
	shipDb.push(new shipDesign("Mig Class Scout",1,37,1,10,2,0,0,270,20,6,25,5,50,null));
	shipDb.push(new shipDesign("Mig Class Transport",1,37,1,10,2,0,0,270,140,6,25,5,50,null));
	shipDb.push(new shipDesign("Moscow Class Star Escort",3,173,2,370,4,0,2,140,65,25,55,89,285,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Moscow Class Star Destroyer",3,173,1,370,4,0,5,140,65,25,55,69,185,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Super Star Carrier",5,250,2,352,6,0,4,240,180,42,91,143,320,null));
	shipDb.push(new shipDesign("Super Star Carrier II",5,250,2,352,6,0,4,350,220,42,91,113,320,null));
	shipDb.push(new shipDesign("Super Star Destroyer",6,250,2,458,8,0,3,180,80,42,71,92,390,shipAbility("Planet Immunity") + " and " + shipAbility("Imperial Assault")));
	shipDb.push(new shipDesign("Super Star Cruiser",9,270,2,578,8,0,4,450,110,42,71,122,490,shipAbility("Intercept Interference")));
	shipDb.push(new shipDesign("Super Star Cruiser II",9,325,3,578,8,0,5,450,110,42,71,122,490,shipAbility("Intercept Interference")));
	shipDb.push(new shipDesign("Gorbie Class Battlecarrier",10,980,6,2287,10,0,10,1760,250,142,471,442,790,null));

	//Robotic ships
	shipDb.push(new shipDesign("Cat's Paw Class Destroyer",2,120,2,258,4,2,0,300,300,32,61,5,120,null));
	shipDb.push(new shipDesign("Pawn Class Baseship",3,260,2,358,2,0,2,720,40,342,23,10,130,shipAbility("Advanced Bioscanning")));
	shipDb.push(new shipDesign("Pawn B Class Baseship",3,260,2,358,2,0,2,720,40,142,23,10,130,shipAbility("Advanced Bioscanning")));
	shipDb.push(new shipDesign("Cybernaut Class Baseship",4,340,4,558,3,0,5,980,50,292,163,5,150,null));
	shipDb.push(new shipDesign("Cybernaut B Class Baseship",4,340,3,558,3,0,5,980,70,192,61,5,190,null));
	shipDb.push(new shipDesign("Instrumentality Class Baseship",6,350,4,958,4,0,7,980,80,242,71,12,390,null));
	shipDb.push(new shipDesign("Automa Class Baseship",9,560,6,1258,4,0,8,1480,200,242,131,45,690,null));
	shipDb.push(new shipDesign("Golem Class Baseship",10,850,8,1958,6,0,10,2000,300,442,171,32,990,null));

	//Rebel ships
	shipDb.push(new shipDesign("Falcon Class Escort",2,30,1,27,2,0,0,150,120,5,5,12,50,shipAbility("Hyperdrive")));
	shipDb.push(new shipDesign("Gaurdian Class Destroyer",4,80,1,275,3,6,0,120,20,10,60,11,180,null));
	shipDb.push(new shipDesign("Gaurdian B Class Destroyer",4,80,1,275,3,6,0,120,40,10,60,11,130,null));
	shipDb.push(new shipDesign("Gaurdian C Class Destroyer",4,130,1,275,3,6,0,120,40,10,60,11,130,null));
	shipDb.push(new shipDesign("Armored Transport",4,68,2,126,1,0,0,250,200,14,12,16,35,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Heavy Armored Transport",4,68,2,126,1,0,0,250,520,17,20,23,35,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Rush Class Heavy Carrier",10,645,6,1858,5,0,10,1550,390,242,171,242,987,null));

	//Colonial ships
	shipDb.push(new shipDesign("Little Joe Class Escort",2,65,1,175,6,0,0,85,20,42,26,15,50,null));
	shipDb.push(new shipDesign("Little Joe Light Escort",2,65,1,175,6,0,0,95,30,21,13,7,50,null));
	shipDb.push(new shipDesign("Aries Class Transport",5,69,2,226,2,0,0,260,260,14,12,25,65,shipAbility("Advanced Refinery")));
	shipDb.push(new shipDesign("Cobol Class Research Cruiser",4,115,2,286,4,2,0,450,250,32,37,23,150,shipAbility("Bioscanning") + " and " + shipAbility("Ramscooping")));
	shipDb.push(new shipDesign("Scorpius Class Light Carrier",6,315,4,958,4,0,2,250,90,92,231,82,287,null));
	shipDb.push(new shipDesign("Scorpius Class Carrier",6,330,3,958,5,0,4,250,90,72,131,62,287,null));
	shipDb.push(new shipDesign("Scorpius Class Heavy Carrier",6,360,4,958,6,0,5,250,130,72,151,92,387,null));
	shipDb.push(new shipDesign("Tantrum Liner",7,25,1,2,1,0,0,50,10,6,3,16,120,shipAbility("Tantrum Device")));
	shipDb.push(new shipDesign("Virgo Class Battlestar",10,625,8,1858,10,0,8,1550,290,142,371,142,887,null));

	// Horwasp ships
	shipDb.push(new shipDesign("Hive",0,475,8,0,9,6,6,2800,24000,285,245,155,6561,"Hives affect happiness of planets within 100 LY. Can scatter their clans to planets within 100 LY, destroying the Hive in the process.<br />These ships do not count against the ship limit, and destruction in battle will cause PP to be stolen (if able) instead of generated.<br />" + shipAbility("Tow Immunity (>5000)") + " and " + shipAbility("Chunnel Immunity")));
	shipDb.push(new shipDesign("Brood",0,145,1,0,6,3,6,350,900,35,125,155,729,null));
	shipDb.push(new shipDesign("Jacker",0,200,2,0,0,0,3,400,300,105,45,90,2187,shipAbility("Heavy Armor")));
	shipDb.push(new shipDesign("Soldier",0,185,2,0,3,6,3,650,300,115,135,30,2187,null));
	shipDb.push(new shipDesign("Sentry",0,56,2,0,6,0,0,0,600,30,55,37,81,"Reconnaissance pod will relay information and sweep mines while stationary in space. " + shipAbility("Recharge Station (5)")));
	shipDb.push(new shipDesign("Armored Nest",0,101,2,1,3,0,0,0,1800,25,14,18,81,null));
	shipDb.push(new shipDesign("Accelerator",0,365,2,0,3,0,0,0,300,375,195,380,6561,"Support pod that will boost the distance of pods travelling through it by 50% while stationary in space while changing direction. Increased speed lasts until negated. " + shipAbility("Recharge Station (25)") + " and " + shipAbility("Tow Immunity")));
	shipDb.push(new shipDesign("Protofield",0,31,2,0,0,0,0,0,2500,5,5,5,27,"When it arrives at its destination or is <q>destroyed</q> in combat, it will explode and create a proto-minefield at a rate of 1 proto-unit per clan"));

	//Uncommon ships
	shipDb.push(new shipDesign("Outrider Class Scout",1,75,1,180,1,0,0,260,40,20,40,5,50,null));
	shipDb.push(new shipDesign("Outrider Class Transport",1,75,1,180,1,0,0,260,130,20,40,5,50,null));
	shipDb.push(new shipDesign("Taurus Class Scout",1,95,2,180,2,0,0,590,140,20,40,5,50,null));
	shipDb.push(new shipDesign("Taurus Class Transport",1,50,1,180,2,0,0,590,120,20,20,5,50,null));
	shipDb.push(new shipDesign("Iron Slave Class Baseship",2,60,1,258,1,0,2,320,70,22,23,10,80,null));
	shipDb.push(new shipDesign("Iron Slave Class Tug",2,60,2,258,1,0,2,320,70,22,23,10,80,null));
	shipDb.push(new shipDesign("Eros Class Research Vessel",4,35,2,78,2,0,0,110,30,4,3,13,30,shipAbility("Cools to 50")));
	shipDb.push(new shipDesign("Small Transport",4,30,1,15,2,0,0,180,50,2,2,20,25,null));
	shipDb.push(new shipDesign("Medium Transport",4,30,1,15,2,0,0,180,180,2,2,20,25,null));
	shipDb.push(new shipDesign("Little Pest Class Escort",2,75,2,175,6,0,0,180,20,12,27,45,60,shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Little Pest Light Escort",2,55,1,115,6,0,0,180,30,6,14,22,50,"None"));
	shipDb.push(new shipDesign("Lady Royale Class Cruiser",5,130,2,270,4,1,0,670,160,52,61,83,250,shipAbility("Gambling")));
	shipDb.push(new shipDesign("Sage Class Frigate",5,100,2,79,4,2,0,150,50,12,63,27,170,null));
	shipDb.push(new shipDesign("Sage Class Repair Ship",5,100,2,79,4,2,0,150,50,12,63,27,170,shipAbility("Repair Ship")));
	shipDb.push(new shipDesign("Skyfire Class Cruiser",5,150,2,270,4,2,0,370,250,52,61,83,250,null));
	shipDb.push(new shipDesign("Skyfire Class Transport",5,150,2,270,4,2,0,370,750,72,61,83,250,null));
	shipDb.push(new shipDesign("Vendetta Class Frigate",5,100,2,99,4,4,0,140,30,12,23,57,170,null));
	shipDb.push(new shipDesign("Vendetta B Class Frigate",5,100,1,99,4,4,0,140,30,12,23,47,140,null));
	shipDb.push(new shipDesign("Deth Specula Class Frigate",6,113,2,240,6,4,0,140,35,25,45,89,280,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Deth Specula Armoured Frigate",6,153,2,240,6,4,0,180,50,30,50,89,180,shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding")));
	shipDb.push(new shipDesign("Tranquility Class Cruiser",6,160,2,330,4,2,0,460,380,42,71,43,140,null));
	shipDb.push(new shipDesign("Loki Class Destroyer",8,101,2,265,2,4,0,140,80,10,20,43,170,shipAbility("Tachyon Device")));
	shipDb.push(new shipDesign("Red Wind Class Carrier",8,70,2,40,2,0,2,85,60,22,37,15,150,shipAbility("Cloak")));
	shipDb.push(new shipDesign("Red Wind Storm-Carrier",8,70,2,40,2,0,2,85,60,22,37,15,150,shipAbility("Advanced Cloak") + " and " + shipAbility("Cloaked Fighter Bay")));
	shipDb.push(new shipDesign("Iron Lady Class Frigate",9,150,2,99,8,2,0,210,60,22,23,47,290,null));
	shipDb.push(new shipDesign("Iron Lady Class Command Ship",9,150,2,99,8,2,0,210,60,22,23,47,290,shipAbility("Command Ship")));
}

//Ship Design Object
function shipDesign(namee,tlevel,mass,engines,crew,beams,tubes,bays,fuel,cargo,du,tr,mo,mc,special) {
	this.shipName = namee;
	this.techLevel = tlevel;
	this.mass = mass;
	this.engines = engines;
	this.crew = crew;
	this.beamBanks = beams;
	this.torpTubes = tubes;
	this.ftrBays = bays;
	this.fuelMax = fuel;
	this.cargoMax = cargo;
	this.costDu = du;
	this.costTr = tr;
	this.costMo = mo;
	this.costMc = mc;
	this.special = special;
	
	this.details = function() {
		var weaponDesc;
		var grandDesc;
		
		if (this.techLevel > 0) {
			grandDesc = "Tech "+this.techLevel+" ship with "+this.mass+" kT hull mass, "+this.engines+" engine";
			if (this.engines != 1) {
				grandDesc = grandDesc + "s";
			}
			
			grandDesc = grandDesc + " and "+this.crew+" crew<br />";
		} else {
			if (this.fuelMax > 0) {
				grandDesc = "Horwasp ship with "+this.mass+" kT hull mass and "+this.engines+" engines<br />";
			} else {
				grandDesc = "Horwasp <a href=\"javascript:dispInfo('Pod')\">pod</a> with "+this.mass+" kT hull mass and "+this.engines+" engines<br />";
			}
		}
		
		if (this.beamBanks + this.torpTubes + this.ftrBays == 0) {
			weaponDesc = "No weapons";
		} else {
			weaponDesc = "Weapons: " + this.beamBanks +" beam bank";
			if (this.beamBanks != 1) {
				weaponDesc = weaponDesc + "s";
			}
			
			if (this.torpTubes > 0) {
				weaponDesc = weaponDesc + ", " + this.torpTubes + " torpedo tube";
				if (this.torpTubes > 1) {
					weaponDesc = weaponDesc + "s";
				}
			}
			
			if (this.ftrBays > 0) {
				weaponDesc = weaponDesc + ", " + this.ftrBays + " fighter bay";
				if (this.ftrBays > 1) {
					weaponDesc = weaponDesc + "s";
				}
			}
		}
		
		if (this.fuelMax > 0) {
			grandDesc = grandDesc + weaponDesc + "<br />Capacity: " + this.fuelMax + " kT neutronium fuel, " + this.cargoMax + " kT cargo<br /><br />";
		} else {
			grandDesc = grandDesc + weaponDesc + "<br />Capacity: " + this.cargoMax + " kT cargo<br /><br />";
		}
		
		grandDesc = grandDesc + "Construction cost: " + this.costDu + " du " + this.costTr + " tr " + this.costMo + " mo ";
		if (this.techLevel > 0) {
			grandDesc = grandDesc + this.costMc + " mc";
		} else {
			grandDesc = grandDesc + this.costMc + " clans";
		}
		
		if (this.special) {
			grandDesc = grandDesc + "<br /><b>Special</b>: " + this.special;
		}
		
		return grandDesc;
	}
}

function detailedReport(targetDesign) {
	var similiarDesign = null;
	
	switch (targetDesign) {
		// Fed designs
		case "Outrider Class Transport":
			similiarDesign = "Outrider Class Scout";
			break;
		case "Vendetta B Class Frigate":
			// Fall through
		case "Vendetta C Class Frigate":
			// Fall through
		case "Vendetta Stealth Class Frigate":
			similiarDesign = "Vendetta Class Frigate";
			break;
		case "Banshee B Class Destroyer":
			// Fall through
		case "Wild Banshee Class Destroyer":
			similiarDesign = "Banshee Class Destroyer";
			break;
		case "Arkham Class Destroyer":
			// Fall through
		case "Arkham Class Cruiser":
			similiarDesign = "Arkham Class Frigate";
			break;
		case "Thor B Class Frigate":
			// Fall through
		case "Thor Class Heavy Frigate":
			similiarDesign = "Thor Class Frigate";
			break;
		case "Diplomacy B Class Cruiser":
			similiarDesign = "Diplomacy Class Cruiser";
			break;
			
		// Lizard designs
		case "Reptile Class Escort":
			similiarDesign = "Reptile Class Destroyer";
			break;
		case "Saurian Class Frigate":
			// Fall through
		case "Saurian Class Heavy Frigate":
			similiarDesign = "Saurian Class Light Cruiser";
			break;
		case "Chameleon Class Freighter":
			similiarDesign = "Large Deep Space Freighter";
			break;
		case "Madonnzila Class Carrier (C)":
			similiarDesign = "Madonnzila Class Carrier";
			break;
		case "T-Rex Class Battleship (C)":
			similiarDesign = "T-Rex Class Battleship";
			break;
			
		// Bird designs
		case "Bright Heart Light Destroyer":
			similiarDesign = "Bright Heart Class Destroyer";
			break;
		case "Medium Transport":
			similiarDesign = "Small Transport";
			break;
		case "Skyfire Class Transport":
			similiarDesign = "Skyfire Class Cruiser";
			break;
		case "Valiant Wind Storm-Carrier":
			similiarDesign = "Valiant Wind Class Carrier";
			break;
		case "Deth Specula Armoured Frigate":
			// Fall through
		case "Deth Specula Heavy Frigate":
			// Fall through
		case "Deth Specula Stealth":
			similiarDesign = "Deth Specula Class Frigate";
			break;
		case "Red Wind Storm-Carrier":
			similiarDesign = "Red Wind Class Carrier";
			break;
			
		// Fascist designs
		case "D7b Painmaker Class Cruiser":
			similiarDesign = "D7a Painmaker Class Cruiser";
			break;
		case "Little Pest Light Escort":
			similiarDesign = "Little Pest Class Escort";
			break;
		case "D3 Thorn Class Frigate":
			// Fall through
		case "D3 Thorn Class Cruiser":
			similiarDesign = "D3 Thorn Class Destroyer";
			break;
		case "D19c Nefarious Class Destroyer":
			similiarDesign = "D19b Nefarious Class Destroyer";
			break;
		case "Saber Class Shield Generator":
			similiarDesign = "Saber Class Frigate";
			break;
			
		// Privateer design
		case "Dwarfstar II Class Transport":
			similiarDesign = "Dwarfstar Class Transport";
			break;
		case "Bloodfang Stealth Class Carrier":
			similiarDesign = "Bloodfang Class Carrier";
			break;
			
		// Cyborg designs
		case "B41b Explorer":
			similiarDesign = "B41 Explorer";
			break;
		case "Iron Slave Class Tug":
			similiarDesign = "Iron Slave Class Baseship";
			break;
		case "B222b Destroyer":
			similiarDesign = "B222 Destroyer";
			break;
			
		// Crystalline designs
		case "Opal--T Class Torpedo Boat":
			similiarDesign = "Opal Class Torpedo Boat";
			break;
		case "Topaz Class Gunboats":
			// Fall through
		case "Imperial Topaz Class Gunboats":
			similiarDesign = "Topez Class Gunboat";
			break;
		case "Sky Garnet Class Frigate":
			similiarDesign = "Sky Garnet Class Destroyer";
			break;
		case "Pyrite Class Frigate":
			similiarDesign = "Onyx Class Frigate";
			break;

		// Empire designs
		case "Ru25 Gunboats":
			// Fall through
		case "Ru30 Gunboats":
			similiarDesign = "Ru25 Gunboat";
			break;
		case "Mig Class Transport":
			similiarDesign = "Mig Class Scout";
			break;
		case "Moscow Class Star Destroyer":
			similiarDesign = "Moscow Class Star Escort";
			break;
		case "Super Star Carrier II":
			similiarDesign = "Super Star Carrier";
			break;
		case "Super Star Cruiser II":
			similiarDesign = "Super Star Cruiser";
			break;

		// Robotic designs
		case "Pawn B Class Baseship":
			similiarDesign = "Pawn Class Baseship";
			break;
		case "Cybernaut B Class Baseship":
			similiarDesign = "Cybernaut Class Baseship";
			break;

		// Rebel designs
		case "Sage Class Repair Ship":
			similiarDesign = "Sage Class Frigate";
			break;
		case "Taurus Class Transport":
			similiarDesign = "Taurus Class Scout";
			break;
		case "Gaurdian B Class Destroyer":
			// Fall through
		case "Gaurdian C Class Destroyer":
			similiarDesign = "Gaurdian Class Destroyer";
			break;
		case "Heavy Armored Transport":
			similiarDesign = "Armored Transport";
			break;
		case "Iron Lady Class Command Ship":
			similiarDesign = "Iron Lady Class Frigate";
			break;
			
		// Colonial designs
		case "Little Joe Light Escort":
			similiarDesign = "Little Joe Class Escort";
			break;
		case "Scorpius Class Carrier":
			// Fall through
		case "Scorpius Class Heavy Carrier":
			similiarDesign = "Scorpius Class Light Carrier";
			break;
	}
	
	if (similiarDesign) {
		return mergedShipReport(targetDesign,similiarDesign);
	} else {
		return shipDbLookup(targetDesign).details();
	}
	
	return "No data found";
}

function shipDbLookup(targetDesign) {
	for (i = 0; i < shipDb.length; i++) {
		if (shipDb[i].shipName == targetDesign) {
			return shipDb[i];
		}
	}
	
	return shipDb[0];
}

function mergedShipReport(newDesign, baseDesign) {
	var newStats = shipDbLookup(newDesign);
	var baseStats = shipDbLookup(baseDesign);
	
	var basicDesc;
	var weaponDesc;
	var capDesc;
	var costDesc;
	var specialDesc;
	
	if (newStats.techLevel > 0) {
		basicDesc = compareVals(newStats.techLevel,baseStats.techLevel,"tech","Tech "+newStats.techLevel) + " ship with " +
			compareVals(newStats.mass,baseStats.mass,"mass",newStats.mass + " kT hull mass") + ", " + 
			compareVals(newStats.engines,baseStats.engines,"engines",newStats.engines + " engine(s)") + " and " + 
			compareVals(newStats.crew,baseStats.crew,"crew",newStats.crew + " crew");
	}
		
	if (newStats.beamBanks + newStats.torpTubes + newStats.ftrBays == 0) {
		weaponDesc = "No weapons";
	} else {
		weaponDesc = "Weapons: " + compareVals(newStats.beamBanks,baseStats.beamBanks,"beams",newStats.beamBanks +" beam bank(s)");
		
		if (newStats.torpTubes > 0) {
			weaponDesc = weaponDesc + ", " + compareVals(newStats.torpTubes,baseStats.torpTubes,"tubes",newStats.torpTubes + " torpedo tube(s)");
		}
		
		if (newStats.ftrBays > 0) {
			weaponDesc = weaponDesc + ", " + compareVals(newStats.ftrBays,baseStats.ftrBays,"bays",newStats.ftrBays + " fighter bay(s)");
		}
	}
	
	if (newStats.fuelMax > 0) {
		capDesc = "Capacity: " + compareVals(newStats.fuelMax,baseStats.fuelMax,"fuel",newStats.fuelMax + " kT neutronium fuel") + ", " + 
			compareVals(newStats.cargoMax,baseStats.cargoMax,"cargo",newStats.cargoMax + " kT cargo");
	} else {
		capDesc = "Capacity: " + compareVals(newStats.cargoMax,baseStats.cargoMax,"cargo",newStats.cargoMax + " kT cargo");
	}
	
	costDesc = "Construction cost: " + compareVals(newStats.costDu,baseStats.costDu,"cost",newStats.costDu + " du") + " " +
		compareVals(newStats.costTr,baseStats.costTr,"cost",newStats.costTr + " tr") + " " +
		compareVals(newStats.costMo,baseStats.costMo,"cost",newStats.costMo + " mo") + " ";
	if (newStats.techLevel > 0) {
		costDesc = costDesc + compareVals(newStats.costMc,baseStats.costMc,"cost",newStats.costMc + " mc");
	} else {
		costDesc = costDesc + compareVals(newStats.costMc,baseStats.costMc,"cost",newStats.costMc + " clans");
	}
	
	if (newStats.special) {
		specialDesc = compareVals(newStats.special,baseStats.special,"special","<b>Special</b>: " + newStats.special);
	}

	grandDesc = basicDesc + "<br />" + weaponDesc + "<br />" + capDesc + "<br /><br />" + costDesc;
	if (specialDesc) {
		grandDesc = grandDesc + "<br />" + specialDesc;
	}
	
	return grandDesc;
}

function compareVals(newVals,oldVals,whichItem,text) {
	var outText = text;
	if (text.search("(s)") > 0) {
		if (newVals == 1) {
			outText = text.replace("(s)","");
		} else {
			outText = text.replace("(s)","s");
		}
	}
	
	switch (whichItem) {
		case "tech":
			// Fall through
		case "mass":
			// Fall through
		case "special":
			if (newVals != oldVals) {
				outText = "<span class=\"changed\">" + outText + "</span>";
			}
			break;
		case "engines":
			if (newVals > oldVals) {
				if (oldVals == 1) {
					outText = "<span class=\"changed\">" + outText + "</span>";
				} else {
					outText = "<span class=\"weakened\">" + outText + "</span>";
				}
			} else if (newVals < oldVals) {
				outText = "<span class=\"improved\">" + outText + "</span>";
			}
			break;
		case "crew":
			// Fall through
		case "beams":
			// Fall through
		case "tubes":
			// Fall through
		case "bays":
			// Fall through
		case "fuel":
			// Fall through
		case "cargo":
			if (newVals > oldVals) {
				outText = "<span class=\"improved\">" + outText + "</span>";
			} else if (newVals < oldVals) {
				outText = "<span class=\"weakened\">" + outText + "</span>";
			}
			break;
		case "cost":
			if (newVals > oldVals) {
				outText = "<span class=\"weakened\">" + outText + "</span>";
			} else if (newVals < oldVals) {
				outText = "<span class=\"improved\">" + outText + "</span>";
			}
			break;
	}
	
	return outText;
}

function shipAbility(abilLink) {
	var abilName = abilLink;
	var finalLink = abilLink.replace("'","\\'");
	
	if (abilLink == "Cloak" || abilLink == "Advanced Cloak") {
		abilName = abilLink + "ing Device";
	}
	
	return "<a class=\"bindTxt\" href=\"javascript:dispInfo('" + finalLink + "')\">" + abilName + "</a>";
}
