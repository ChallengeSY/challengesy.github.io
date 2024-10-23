var designIter = 0;
var simulatorRace = 0;
var elementObj = new Array();
var maxAdvantage = 500;
var checkFighters = false;
var saveCookieDate = new Date;
window.onload = init;

//Campaign technology object
function upgrade(name, ship, mc, adv, padlock) {
	this.eleName = name;
    this.shipFlag = ship;
	this.money = mc;
	this.advCost = adv;
    this.lockDesign = padlock;
}

function init() {
	if (simulatorRace > 0) {
		connectNuAPI();
	} else {
		document.getElementById("captionRace").innerHTML = "No race detected."
	}
}

//Setup Simulator
function startProgram() {
	var techPanel = document.getElementById("techItems");
	var shipPanel = document.getElementById("shipDesigns");
	
	var buttonPanel = document.getElementById("buttonPanel");
	var trFrag, tdFrag, inputFrag, buttonFrag;
	var techName, popular;
	var bodyPanel = document.getElementsByTagName("body")[0];
	var infoFrag;

	loadRace();
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
	infoFrag.style.display = "none";
	bodyPanel.appendChild(infoFrag);
	
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
		var startGC = 0;
		
		if (getStorage("gigacredits")) {
			startGC = getStorage("gigacredits");
		}
		
		document.getElementById("userMoney").value = startGC;
		document.getElementById("userAdv").value = maxAdvantage;
	}
	calcCosts();
}

function loadRace() {
	hullsObj = nuStaticData.hulls;
	techObj = nuStaticData.advantages;
	raceObj = nuStaticData.races;
	
	var racialBaseHulls = null;
	var racialHulls = null;
	var racialBaseTech = null;
	var racialTech = null;
	
	for (var r in raceObj) {
		if (raceObj[r].id == simulatorRace) {
			racialBaseHulls = raceObj[r].basehulls.split(",");
			racialHulls = raceObj[r].hulls.split(",");
			racialBaseTech = raceObj[r].baseadvantages.split(",");
			racialTech = raceObj[r].advantages.split(",");
			document.getElementById("captionRace").innerHTML = raceObj[r].name;
			break;
		}
	}
	
	for (var h in hullsObj) {
		if (racialBaseHulls.indexOf(hullsObj[h].id.toString()) >= 0) {
			addDesign(hullsObj[h].name, true, 0, hullsObj[h].advantage, false);
		} else if (racialHulls.indexOf(hullsObj[h].id.toString()) >= 0) {
			addDesign(hullsObj[h].name, true, hullsObj[h].mc, hullsObj[h].advantage, false);
		}
	}

	for (var t in techObj) {
		if (racialBaseTech.indexOf(techObj[t].id.toString()) >= 0) {
			addDesign(techObj[t].name, false, 0, techObj[t].value, techObj[t].locked);
		} else if (racialTech.indexOf(techObj[t].id.toString()) >= 0) {
			addDesign(techObj[t].name, false, techObj[t].mc, techObj[t].value, techObj[t].locked);
		}
	}
}

//Register new design
function addDesign(name, ship, mc, adv, locked) {
    elementObj[designIter] = new upgrade(name, ship, mc, adv, locked);
    designIter++;
}

function saveGigacredits() {
	saveGC = document.getElementById("userMoney").value;
	if (isFinite(saveGC)) { 
		setStorage("gigacredits",saveGC,saveCookieDate,"/",null,false);
	}
}

/* ------------------------------------------------------------------------ */

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

//Storage
function setStorage(sName, sValue) {
	if (typeof(Storage) !== "undefined") {
		localStorage.setItem(sName, sValue);
	} else {
		var targetDate = new Date();
		targetDate.setTime(targetDate.getTime() + (360*24*60*60*1000));
		
		setCookie(sName, sValue, targetDate, "/");
	}
}

function getStorage(sName) {
	if (typeof(Storage) !== "undefined") {
		return localStorage.getItem(sName);
	} else {
		return getCookie(sName);
	}
}

//Fallback Cookies
function setCookie(cName, cValue, expDate, cPath, cDomain, cSecure) {
	if (cName && cValue != "") {
		var cString = cName + "=" + encodeURI(cValue) + ";samesite=lax";
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
	var special = "";
	var firstDash = 0;
	
	for (var h in hullsObj) {
		if (hullsObj[h].cost < 5000000) {
			special = null;
			firstDash = hullsObj[h].special.indexOf("-");
			if (firstDash > 0) {
				special = shipAbility(hullsObj[h].special.substr(0, firstDash - 1));
				if (special == shipAbility("Pod")) {
					special = null;
				}
			} else if (hullsObj[h].cancloak) {
				special = shipAbility("Cloak");
			}

			switch (hullsObj[h].name) {
				case "Neutronic Refinery Ship":
					special = shipAbility("Refinery");
					break;
				case "Merlin Class Alchemy Ship":
					special = shipAbility("Alchemy");
					break;
				case "Neutronic Fuel Carrier":
				case "Large Deep Space Freighter":
					special = shipAbility("Weak Armor");
					break;
				case "Super Transport Freighter":
					special = shipAbility("Improved Fuel Economy") + " and " + shipAbility("Weak Armor");
					break;
					
				case "Bohemian Class Survey Ship":
					special = shipAbility("Heats to 50");
					break;
				case "Eros Class Research Vessel":
					special = shipAbility("Cools to 50");
					break;
				case "Brynhild Class Escort":
					special = shipAbility("Bioscanning");
					break;
					
				case "Chameleon Class Freighter ©":
					special = shipAbility("Chameleon Device") + " and " + shipAbility("Weak Armor");
					break;
				case "Zilla Class Battlecarrier":
					special = shipAbility("Emork's Spirit Bonus") + " and " + shipAbility("Tidal Force Shield");
					break;
					
				case "Swift Heart Class Scout":
					special = shipAbility("Cloak") + " and " + shipAbility("Nebula Scanner");
					break;
				case "Deth Specula Heavy Frigate":
					special = shipAbility("Advanced Cloak") + " and " + shipAbility("Radiation Shielding");
					break;
				case "Red Wind Storm-Carrier":
					special = shipAbility("Advanced Cloak") + " and " + shipAbility("Cloaked Fighter Bay");
					break;
				case "Resolute Class Battlecruiser":
					// Fall through
				case "Dark Wing Class Battleship":
					special = shipAbility("Advanced Cloak");
					break;
					
				case "D7b Painmaker Class Cruiser":
					special = shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (50-20)");
					break;
				case "D7 Coldpain Class Cruiser":
					// Series of fall throughs
				case "Deth Specula Class Frigate":
				case "Deth Specula Armoured Frigate":
				case "D3 Thorn Class Destroyer":
				case "D3 Thorn Class Frigate":
				case "D3 Thorn Class Cruiser":
					// Stop right there
					special = shipAbility("Cloak") + " and " + shipAbility("Radiation Shielding");
					break;
				case "D19b Nefarious Class Destroyer":
					// Fall through
				case "D19c Nefarious Class Destroyer":
					special = shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (100-20)");
					break;
				case "Deth Specula Stealth":
					special = shipAbility("Cloak") + ", " + shipAbility("Radiation Shielding") + ", and " + shipAbility("Recloak Intercept");
					break;
				case "Saber Class Frigate":
					special = shipAbility("Radiation Shielding") + " and " + shipAbility("Glory Device (100-10)");
					break;
				case "Saber Class Shield Generator":
					special = shipAbility("Radiation Shielding") + ", " + shipAbility("Glory Device (100-10)") + ", and " + shipAbility("Shield Generator");
					break;
				case "D9 Usva Class Stealth Raider":
					special = shipAbility("Radiation Shielding") + " and " + shipAbility("Stealth Armor");
					break;
					
				case "Br4 Class Gunship":
					// Fall through... twice
				case "Br5 Kaye Class Torpedo Boat":
				case "Meteor Class Blockade Runner":
					// Stop right there
					special = shipAbility("Cloak") + " and " + shipAbility("Gravitonic Acceleration");
					break;
				case "Hikos Armored Trailer":
					special = null;
					break;
					
				case "B200 Class Probe":
					// Series of fall throughs
				case "Sapphire Class Space Ship":
				case "Pl21 Probe":
				case "Falcon Class Escort":
					// Stop right there
					special = shipAbility("Hyperdrive");
					break;

				case "B41b Explorer":
					special = shipAbility("Chunnel Target") + " and " + shipAbility("Nebula Scanner");
					break;
				case "B222b Destroyer":
					special = shipAbility("Chunnel Self (B200)");
					break;
				case "Deep Watcher":
					special = shipAbility("Deep Scan");
					break;
				case "Firecloud Class Cruiser":
					special = shipAbility("Chunnel Initiator") + " and " + shipAbility("Chunnel Target");
					break;
				case "Lorean Class Temporal Lance":
					special = shipAbility("Temporal Lance") + " and " + shipAbility("Chunnel Target");
					break;
				case "Dungeon Class Stargate":
					special = shipAbility("Stargate") + " and " + shipAbility("Chunnel Stabilizer");
					break;
					
				case "Topaz Class Gunboats":
					// Series of fall throughs
				case "Imperial Topaz Class Gunboats":
				case "Ru25 Gunboats":
				case "Ru30 Gunboats":
					// Stop right there
					special = shipAbility("Squadron") + ", " + shipAbility("Elusive") + ", and " + shipAbility("Planet Immunity");
					break;
					
				case "Onyx Class Frigate":
					special = shipAbility("Heats to 100");
					break;

				case "Super Star Cruiser":
					// Fall through
				case "Super Star Cruiser II":
					special = shipAbility("Intercept Interference");
					break;

				case "Pawn Class Baseship":
					// Fall through
				case "Pawn B Class Baseship":
					special = shipAbility("Advanced Bioscanning");
					break;

				case "Smugglers Falcon":
					special = shipAbility("Hyperdrive") + " and " + shipAbility("Blink Cloak");
					break;
					
				case "Aries Class Transport":
					special = shipAbility("Advanced Refinery");
					break;
				case "Cobol Class Research Cruiser":
					special = shipAbility("Bioscanning") + " and " + shipAbility("Ramscooping");
					break;
				case "Lady Royale Class Cruiser":
					special = shipAbility("Gambling");
					break;

				case "Taurus Class Scout":
					// Stackable fallthrough
				case "Cygnus Class Destroyer":
				case "Little Joe Class Escort":
				case "Sagittarius Class Transport":
				case "Gemini Class Transport":
				case "Patriot Class Light Carrier":
				case "Scorpius Class Light Carrier":
					special = shipAbility("Stackable");
					break;
					
				case "Hive":
					special = "Can scatter their clans to planets within 100 LY, destroying the Hive in the process.<br /> \
						These ships count as starbases for scoreboard and combat purposes.<br />" + shipAbility("Fear") + ", " + shipAbility("Tow Immunity (>5000)") + " and " + shipAbility("Chunnel Immunity");
					break;
				case "Jacker":
					special = shipAbility("Heavy Armor");
					break;
				case "Sentry":
					special = "Reconnaissance pod will relay information and sweep mines while stationary in space. " + shipAbility("Recharge Station (5)");
					break;
				case "Accelerator":
					special = "Support pod that boosts the distance speed of pods travelling through it by 50% while changing their directions. \
						Increased speed lasts until negated. " + shipAbility("Recharge Station (25)") + " and " + shipAbility("Tow Immunity");
					break;
				case "Protofield":
					special = "When it arrives at its destination or is <q>destroyed</q> in combat, it will explode and create a proto-minefield at a rate of 1 proto-unit per clan. Enemies suffer " + shipAbility("Protoinfection") + " just by moving through.";
					break;
				case "Red Mite":
					special = "If this " + shipAbility("Mite") + " reaches its target, it deals 100kT of damage";
					break;
				case "Blue Mite":
					special = "If this " + shipAbility("Mite") + " reaches its target, it adds 27 points of " + shipAbility("Protoinfection");
					break;
				case "Green Mite":
					special = "If this " + shipAbility("Mite") + " reaches its target, it attaches itself and relays recon information to its owner";
					break;
			}
			
			shipDb.push(new shipDesign(hullsObj[h].name, hullsObj[h].techlevel, hullsObj[h].mass,hullsObj[h].engines, hullsObj[h].crew,
				hullsObj[h].beams, hullsObj[h].launchers, hullsObj[h].fighterbays, hullsObj[h].fueltank, hullsObj[h].cargo,
				hullsObj[h].duranium, hullsObj[h].tritanium, hullsObj[h].molybdenum, hullsObj[h].cost, special));
		}
	}
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
		
		if (simulatorRace == 12) {
			if (this.fuelMax > 0) {
				grandDesc = "Horwasp ship with "+this.mass+" kT hull mass and "+this.engines+" engines<br />";
			} else {
				grandDesc = "Horwasp <a href=\"javascript:dispInfo('Pod')\">pod</a> with "+this.mass+" kT hull mass and "+this.engines+" engines<br />";
			}
		} else {
			grandDesc = "Tech "+this.techLevel+" ship with "+this.mass+" kT hull mass, ";
			if (this.engines < 1) {
				grandDesc = grandDesc + "<a href=\"javascript:dispInfo('No engines')\">no engines</a>";
			} else if (this.engines == 1) {
				grandDesc = grandDesc + this.engines+" engine";
			} else {
				grandDesc = grandDesc + this.engines+" engines";
			}
			
			grandDesc = grandDesc + " and "+this.crew+" crew<br />";
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

/* ------------------------------------------------------------------------ */

function closeBox() {
	document.getElementById("infobox").style.display = "none";
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
		case "Blink Cloak":
			displayTxt = "Simplified " + shipAbility("Cloak") + " that can only be maintained for 1 turn, before needing 1 turn to recharge. \
				<span class=\"bindTxt\">Unable to do " + shipAbility("Priority Intercept Attack") + "s</span>";
			break;
		case "Cloak":
			displayTxt = "Allows an undamaged starship the ability to cloak, consuming fuel in the process while also reducing radiation damage to 1/2. \
				<span class=\"bindTxt\">Usually allows " + shipAbility("Priority Intercept Attack") + "s</span>";
			break;
		case "Advanced Cloak":
			displayTxt = "Upgraded " + shipAbility("Cloak") + " that does not consume fuel and can overcome nebulas. \
				While cloaked, radiation damage is reduced to 1/3, and the ship is protected from ion storms";
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
		case "Deep Scan":
			displayTxt = "Unique mission that can detect enemy ship movements up to 200 LY away as they move (will not identify them).<br /> \
				Visible only to ships at the same location while mission is effective (also requires the ship be stationary and not at a planet/warp well).";
			break;
		case "Educator":
			displayTxt = "Raises Native government level by 5% per turn, to a maximum level of Representative (140%)";
			break;
		case "Elusive":
			displayTxt = "Torpedoes targeting this ship have their accuracy reduced to 10% (from 35%)";
			break;
		case "Elusive (Quantum)":
			displayTxt = shipAbility("Quantum Torpedoes") + " targeting this ship have their accuracy reduced to 10% (from 35%)";
			break;
		case "Emork's Spirit Bonus":
			displayTxt = "Complex hull function adds the following abilities and restrictions:<ul style=\"text-align: left;\"> \
				<li>This ship can only be built at a homeworld, with a fixed name assigned to the ship</li> \
				<li>This ship is unclonable, but can still be traded or captured</li> \
				<li>Gains one fighter bay for each homeworld under control. Applies only to the building player</li> \
				<li>Destruction, capture, or trading away decreases the happiness of the homeworld responsible by 100%</li> \
				<li>If the homeworld responsible falls to foreign hands, this ship will self-destruct with a force of a " + shipAbility("Glory Device (100-100)") + "</li> \
				</ul>";
			break;
		case "Fear":
			displayTxt = "Ship will reduce the happiness of enemy planets within 100 LY by 1-10 points per turn. (Based linearly on distance)";
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
			displayTxt = "When detonated, this device will deal roughly 100kT worth of damage to all ships. Fury ships and ships belonging to the owner of the detonator receive "+abilityAmt+"% of the full damage dealt";
			break;
		case "Glory Device (100-100)":
			displayTxt = "When detonated, this device will deal roughly 100kT worth of damage to ALL ships, regardless of owner";
			break;
		case "Glory Device (50-20)":
			displayTxt = "When detonated, this device will deal roughly 50kT worth of damage to all ships. Fury ships and ships belonging to the owner of the detonator receive 20% of the full damage dealt";
			break;
		case "Gravitonic Acceleration":
			displayTxt = "Ship will move at twice the normal LY per turn while consuming half the normal fuel per LY. Gains " + shipAbility("Elusive (Quantum)") + ".";
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
		case "Trailer":
			//Fall through
		case "No engines":
			displayTxt = "A ship with no engines is immobile. It has no power to move on its own, but could be towed.";
			break;
		case "Nebula Scanner":
			displayTxt = "Nebula Scanner can detect planets shrouded by a nebula 100 LY away";
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
			displayTxt =  "Can repair hull damage and remove "+shipAbility("Protoinfection")+" from any ship using the <q>Repair Ship</q> mission.";
			break;
		case "Shield Generator":
			displayTxt = "Adds 25% to the maximum shield strength, provides 25% shield generation in between battles, and adds 50% Engine Shield Bonus worth of combat mass. <span class=\"bindTxt\">(max 2 ships)</span>";
			break;
		case "Squadron":
			displayTxt = "Squadrons are comprised of multiple <q>fighters</q> and are immune to crew loss during combat. If one fighter is destroyed, the survivors escape and return to battle with one <em>less</em> beam";
			break;
		case "Stackable":
			displayTxt = "Can be combined with a different compatible ship using the " + shipAbility("Stack Ships") + " mission";
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
			displayTxt = "With a " + shipAbility("Chunnel Target") + " as a guide, can create a wormhole through time and space, allowing it and ships accompanying it to disappear from the map and the ship list. \
				They will reappear at a location beyond the " + shipAbility("Chunnel Target") + "'s initial position several turns into the future.";
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
		case "Tow Resistance":
			displayTxt = "Can be towed only at a maximum of warp factor 3.";
			break;
		case "Tidal Force Shield":
			displayTxt = "Allows the ship to end a combat versus a planet with up to 149% without being destroyed";
			break;
		case "Weak Armor":
			displayTxt = "Ship is unable to safely navigate through a debris disk, despite its small mass.";
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
			displayTxt = "Unique Torpedo Technology. These torpedoes are outfitted for higher damage and longer firing range <span class=\"bindTxt\">(30,000 --&gt; 34,000 units)</span>.";
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
			displayTxt = "Allows "+shipAbility("Super Spy")+" to build a database of friendly codes for each planet. Effectiveness starts at 100%, but decreases by 10% each turn.<br /> \
				If a code fails once, the enemy discovers the spies knowing the code, and it will no longer work.";
			break;
		case "Super Spy Infiltration":
			displayTxt = "When super spying at a starbase, specificiations (weapons, cargo, friendly code, true hull) for each orbiting starship that matches ownership are revealed to the spying player. Requires " + shipAbility("Super Spy Advanced") + ".";
			break;
		case "Red Storm Cloud": // Dummied out. Kept here as a reference
			displayTxt = "Allows TWO <a href=\"javascript:dispInfo('Red Wind Storm-Carrier')\">Red Wind Storm Carriers</a> to support other carriers with their fighter bays and ammunition.";
			break;
		// Fascist/Fury bonuses
		case "Pillage Planet":
			displayTxt = "Allows a starship to pillage a planet to generate and scavenge money and supplies, killing 20% of the population(s) in the process. Requires beam(s) to use";
			break;
		case "15X Ground Combat":
			displayTxt = "Fury clans dropped onto a foreign planet kill 15 times as many foreign colonists as normal clans";
			break;
		case "5X Ground Defense":
			displayTxt = "Fury clans defend 5 times better against clans dropped from foreign ships";
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
			displayTxt = "50&deg;W planets can become a Pleasure Planet by landing and disassembling a Lady Royale; \
				providing a massive boost in colonist happiness and doubling "+shipAbility("Gambling")+" effects, \
				at the expense of being exposed to foreign races within 250LY, reducing native happiness, and halving mining/factory efficiency.<br /><br /> \
				Non-cyborg, non-crystalline, non-robotic, non-horwasp colonists within 250LY will migrate to the planet each turn <span class=\"bindTxt\">(4% if within 100LY; otherwise 2%)</span>";
			break;
		case "Rob Fighters":
			displayTxt = "When using Rob Ship, carriers have a 10% chance to steal each fighter from enemy carriers/starbases at the same location. Stolen fighters each have a 50% of being lost.";
			break;
		case "Hidden Minefields":
			displayTxt = "Minefields laid this way can neither be scanned nor swept until a mine has been hit. Mines laid this way are half as effective.";
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
			displayTxt = "Allows an undamaged Gorbie, with weapons (except ammo) and fuel fully maxed out, to charge up a planet buster.<br /> \
				If successful (requires a full turn of concentration), a planet becomes destroyed, transforming into a debris disk in the process.<br />ALL Gorbies also become equipped with "+shipAbility("Fear");
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
			displayTxt = "Starbases &lt;200 LY apart can form blockades networks. Any intruders (even cloaked) that pass through are attacked by patrolling fighters. \
				Requires primary order and 10kT fuel per network per turn. Can be detected by Sensor Sweep";
			break;
		// Robotic bonuses
		case "4X Mine Laying":
			displayTxt = "Torpedo ships will lay 4X as many mines compared to normal ships when laid in their own identity";
			break;
		case "Star Cluster Radiation Immunity":
			displayTxt = "Robotic starships are unaffected by the radiation emitted by star clusters. They still can not enter star clusters.<br /> \
				Robotic colonies inside radiation can build normal starbases, instead of Radiation Shielded starbases.";
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
		case "Stack Ships":
			displayTxt = "Allows combining two undamaged smaller ships with matching equipment into a larger ship. They must be at the same location, and may not move on the turn they stack.";
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
			displayTxt = "Horwasps can detect enemy ships regardless of environment or cloaking status. Psychic scanning range is half the normal scanning range <span class=\"bindTxt\">(default: 150 LY)</span>. \
				Cloaked ships still can not be attacked. Robotic ships are resistant to Psychic Scanning, and can only be detected normally within further reduced distance <span class=\"bindTxt\">(default: 75 LY)</span>";
			break;
		case "Pod":
			displayTxt = "A tiny space object that moves autonomously once it leaves planetary orbit. They have a fixed trajectory, and do not count towards the ship limit. \
				<span class=\"bindTxt\">They can still usually be towed.</span><br /><br />If a pod reaches a planet, it will land and is removed from play. Visibility is limited to 50 LY for pods with weapons, and otherwise 25 LY";
			break;
		case "Call To Hive":
			displayTxt = "Exclusive mission that allows a Hive to remotely take 1% of clans from each owned planet within 100 LY";
			break;
		case "Protoinfection":
			displayTxt = "Hostile ships which catch this infection take damage over time. Will be removed gradually over time, and can be removed via Starbase Fix or the "+shipAbility("Repair Ship")+" mission";
			break;
		case "Mite":
			displayTxt = "Specialist " + shipAbility("Pod") + "s that intercept enemy ships. They execute their unique abilities if successful.<br /> \
				Warp 3 mites can intercept indefinitely. Warp 6-7 mites last 10 turns before they expire. Warp 9 mites expire after 1 turn.";
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
			displayTxt = "Also known as a Cloak Intercept (Host 3.22) and simply Intercept Attack (PHost), ships can initiate a priority intercept by choosing a victim and setting the correct aggression setting. \
				Requires at least a regular " + shipAbility("Cloak") + ", but usable regardless of damage level";
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
		case "Improved Fuel Economy":
			displayTxt = "Ships spend 30% less neutronium fuel when moving";
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


	displayTxt = "<b>" + techItem + "</b><br />" + displayTxt +
		"<br /><br /><a class=\"interact\" href=\"javascript:closeBox();\">Close</a>";
	
	infoPanel.innerHTML = displayTxt;
	infoPanel.style.display = "";
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
		case "Chameleon Class Freighter ©":
			similiarDesign = "Large Deep Space Freighter";
			break;
		case "Madonnzila Class Carrier ©":
			similiarDesign = "Madonnzila Class Carrier";
			break;
		case "T-Rex Class Battleship ©":
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
			
		// Fascist/Fury designs
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
		case "Bloodfang":
			similiarDesign = "Bloodfang Class Carrier";
			break;
			
		// Cyborg designs
		case "Deep Watcher":
			similiarDesign = "Watcher Class Scout";
			break;
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
		case "Smugglers Falcon":
			similiarDesign = "Falcon Class Escort";
			break;
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
