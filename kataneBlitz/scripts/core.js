var life = 0;
var lifeMax = 5;
var score = 0;
var nextBomb = 0;
var bombCountdown = -1;
var needyCountdown = -Infinity;
var graceTime = 0;
var timeLimit = 180;
var timeMax = 180;
var handicap = 0;
var maxPerBomb = 11;
var moduleFile = null;
var firstLoad = false;
var gameActive = false;
var hideSolves = false;
var needyScore = 0;
var eggCooldown = 0;
var singleSolvableFile = false;
var singleNeedyFile = false;
var endlessNeedys = true;
var bombQueued = false;

const solveColor = "rgb(0, 255, 0)";
const strikeColor = "rgb(255, 0, 0)";
const stageColor = "rgb(0, 204, 0)";

const defaultIndicators = ["SND", "CLR", "CAR", "IND", "FRQ", "SIG", "NSA", "MSA", "TRN", "BOB", "FRK"];
const defaultPorts = ["DVI-D", "Parallel", "PS/2", "RJ-45", "Serial", "Stereo"];
const defaultModules = ["bigButton", "keypad", "maze", "memory", "morse", "password", "simon", "venn", "whosOnFirst", "wires", "wireSequence"];
const defaultNeedys = ["ventGas", "capacitor", "knob"];
const addonModules = ["9ball", "adjLetters", "modulo", "switches"];

var grandModules = cloneArray(defaultModules).concat(addonModules);

const needyCycleDur = 0.2;

function startGame() {
	var moduleValid = false;
	var initialModules = 1, initialNeedy = 0;

	if (score > 0) {
		console.clear();
	}
	score = 0;
	goal = 9;
	handicap = 0;
	timeMax = 180;
	eggCooldown = 7;

	if (moduleFile.startsWith("endless")) {
		goal = Infinity;
		timeMax = 180;
		handicap = 0;
		initialModules = irandom(3,5);
		if (moduleFile == "endlessHardcore") {
			initialNeedy = 0;
			timeMax = 300;
			lifeMax = 1;
		} else if (moduleFile == "endless") {
			initialNeedy = Math.max(irandom(-2,1),0);
			timeMax = 300;
			lifeMax = 3;
		} else {
			endlessNeedys = false;
			lifeMax = 3;
		}
		
		if ( moduleFile == "endlessVenn") {
			handicap = 75;
			initialModules = irandom(5,7);
		} else if (moduleFile == "endlessButtons") {
			handicap = 50;
			initialModules = irandom(5,7);
		} else if (moduleFile == "endlessSimon") {
			timeMax = 120;
		}
		moduleValid = (moduleFile == "endless" || moduleFile == "endlessStable" || moduleFile == "endlessHardcore" ||
			moduleFile == "endlessButtons" || moduleFile == "endlessSimon" || moduleFile == "endlessVenn");
	} else if (moduleFile.startsWith("short")) {
		goal = Infinity;
		handicap = Infinity;
		initialModules = irandom(3,5);
		lifeMax = 3;
		if (moduleFile.search("Inf") >= 0) {
			timeMax = Infinity;
		} else {
			timeMax = parseInt(moduleFile.substring(5));
		}
		moduleValid = (!isNaN(timeMax) && timeMax > 0);
		timeMax *= 60;
	} else if (moduleFile == "mixedPractice") {
		moduleValid = true;
		timeMax = 300;
		initialModules = 3;
		goal = 37;
	} else if (moduleFile == "mixedPack1") {
		moduleValid = true;
		timeMax = 300;
		initialModules = 3;
		goal = 21;
	} else if (moduleFile == "kiloBomb") {
		moduleValid = true;
		timeMax = 1500;
		lifeMax = 5;
		goal = 19;
		hideSolves = true;
		initialModules = goal;
	} else if (moduleFile == "megaBomb") {
		moduleValid = true;
		timeMax = 2700;
		lifeMax = 8;
		goal = 47;
		hideSolves = true;
		initialModules = goal;
	} else if (moduleFile == "gigaBomb") {
		moduleValid = true;
		timeMax = 4260;
		lifeMax = 11;
		goal = 91;
		hideSolves = true;
		initialModules = goal;
	} else if (moduleFile == "teraBomb") {
		moduleValid = true;
		timeMax = 5940;
		lifeMax = 15;
		goal = 187;
		hideSolves = true;
		initialModules = goal;
	} else if (moduleFile == "adjLetters") {
		moduleValid = true;
		singleSolvableFile = true;
		goal = 4;
	} else if (moduleFile == "venn" || moduleFile == "wires" || moduleFile == "modulo" || moduleFile == "switches") {
		moduleValid = true;
		singleSolvableFile = true;
		goal = 16;
	} else if (moduleFile == "bigButton" || moduleFile == "debug") {
		moduleValid = true;
		singleSolvableFile = true;
		goal = 20;
	} else if (moduleFile == "capacitor" || moduleFile == "knob" || moduleFile == "ventGas" || moduleFile == "mixedNeedy") {
		moduleValid = true;
		singleNeedyFile = (moduleFile != "mixedNeedy");
		goal = 15;
		initialModules = 3;
		initialNeedy = 1;
		lifeMax = 3;
	} else {
		singleSolvableFile = true;
		moduleValid = (moduleFile == "keypad" || moduleFile == "password" || moduleFile == "maze" || moduleFile == "memory" ||
			moduleFile == "morse" || moduleFile == "password" || moduleFile == "simon" || moduleFile == "whosOnFirst" || moduleFile == "wireSequence" ||
			moduleFile == "9ball" || moduleFile == "cruelModulo");
	}
	
	if (moduleValid) {
		life = lifeMax;
		timeLimit = timeMax;
		makeBomb(initialModules, initialNeedy);
	} else {
		applyFeedback(false, "To play this game, a valid module must be loaded.");
	}
}

function solveModule(obj, cond, postSolve, weight) {
	// Solve the module
	if ((postSolve && life > 0) || (gameActive && obj.style.borderColor != solveColor)) {
		if (cond) {
			obj.style.borderColor = solveColor;
			if (hideSolves) {
				obj.style.display = "none";
			}
			
			score++;
			if (!isFinite(goal) && isFinite(handicap)) {
				var finalScore = score + handicap - weight;
				
				if (finalScore <= 0) {
					timeLimit += 40;
				} else if (finalScore <= 25) {
					timeLimit += 30;
				} else if (finalScore <= 50) {
					timeLimit += 20;
				} else if (finalScore <= 75) {
					timeLimit += 10;
				} else if (finalScore <= 100) {
					timeLimit += 5;
				} else if (finalScore <= 125) {
					timeLimit += 3;
				} else {
					timeLimit += 1;
				}
				timeMax = Math.max(timeMax,timeLimit);
			}
			
			if (score >= goal) {
				gameWon();
			} else if (!bombQueued) {
				if (score >= nextBomb) {
					if (isFinite(goal)) {
						if (moduleFile == "mixedPractice") {
							var nextSize;
							switch (score) {
								case 3:
									nextSize = 5;
									break;
								case 8:
									nextSize = 7;
									break;
								default:
									nextSize = 11;
									break;
							}
							
							disarmBomb(nextSize,0);
						} else if (moduleFile == "mixedPack1") {
							var nextSize;
							switch (score) {
								case 3:
									nextSize = 7;
									break;
								default:
									nextSize = 11;
									break;
							}
							
							disarmBomb(nextSize,0);
						} else if (moduleFile == "capacitor" || moduleFile == "knob" || moduleFile == "ventGas" || moduleFile == "mixedNeedy") {
							var nextSize, nextNeedy;
							switch (score) {
								case 2:
									nextSize = 7;
									nextNeedy = 2;
									break;
								default:
									nextSize = 11;
									nextNeedy = 3;
									break;
							}
							
							disarmBomb(nextSize,nextNeedy);
						} else if (score >= 9) {
							disarmBomb(Math.min(goal - score,maxPerBomb),0);
						} else {
							disarmBomb(Math.min((Math.sqrt(score)+1) ** 2 - score,goal - score),0);
						}
					} else if (score % 25 <= 22) {
						if (endlessNeedys) {
							disarmBomb(Math.min(irandom(3,maxPerBomb),25 - score % 25),Math.max(irandom(-7,2),0));
						} else {
							disarmBomb(Math.min(irandom(3,maxPerBomb),25 - score % 25),0);
						}
					} else {
						var genModules = 25 - score % 25;
						
						if (endlessNeedys) {
							disarmBomb(3,3-genModules);
						} else {
							disarmBomb(genModules,0);
						}
					}
				} else {
					applyFeedback(true, "...");
					document.getElementById("fPanel").style.visibility = "hidden";
				}
				eggCooldown--;
			}
		} else {
			if (obj.style.borderColor != solveColor) {
				obj.style.borderColor = strikeColor;
			}
			strikeBomb();
		}
		
		updateUI();
	}
}

function strikeBomb() {
	life--;
	
	updateUI();
	if (life > 0) {
		playSound(strikeSnd);
		if (score < nextBomb) {
			startBombCountdown(false);
		}
	} else {
		explodeBomb();
	}
}

function startBombCountdown(auxAlso) {
	clearInterval(bombCountdown);
	
	var adjustedMax = Math.max(lifeMax-1,4);
	var adjustedLife;
	if (lifeMax < 5) {
		adjustedLife = life - 1 + (5 - lifeMax);
	} else {
		adjustedLife = life - 1;
	}
	
	bombCountdown = setInterval(timeDecay, 500+(adjustedLife/adjustedMax*500));
	
	if (auxAlso) {
		makeAllMazes();
		makeAllMemories();
		makeAllSimons();
		makeAllWhosOnFirsts();
		
		makeAll9Balls();
		makeAllModulos();
	}
}

function gameWon() {
	clearInterval(bombCountdown);
	activateAllNeedys(false);
	applyFeedback(true, "Congratulations! All bombs have been disarmed.&emsp;"+continueButton(0,0));
	playSound(gameWonSnd);
	gameActive = false;
	document.body.className = "";
}

function disarmBomb(nextTarget, nextNeedys) {
	clearInterval(bombCountdown);
	activateAllNeedys(false);
	if (score % 25 == 0 || (score - needyScore) % 25 == 0 && !isFinite(goal)) {
		if (moduleFile == "endlessHardcore") {
			applyFeedback(true, score+" modules disarmed.&emsp;"+continueButton(nextTarget,nextNeedys));
		} else {
			applyFeedback(true, score+" modules disarmed! Extra life acquired.&emsp;"+continueButton(nextTarget,nextNeedys));
			life++;
			lifeMax = Math.max(lifeMax,life);
		}
	} else {
		applyFeedback(true, "Bomb disarm successful.&emsp;"+continueButton(nextTarget,nextNeedys));
	}
	playSound(gameWonSnd);
	gameActive = false;
}

function explodeBomb() {
	clearInterval(bombCountdown);
	activateAllNeedys(false);
	applyFeedback(false, "Game over! The bomb has exploded!&emsp;"+continueButton(0,0));
	playSound(explodeSnd);
	gameActive = false;
	document.body.className = "deadPlr";
}

function timeDecay() {
	if (graceTime > 0) {
		graceTime--;
	} else {
		timeLimit--;
		updateUI();
	
		if (!isFinite(needyCountdown) && (timeLimit + 90 <= timeMax || score > 0 || life < lifeMax)) {
			activateAllNeedys(true);
		}
	}
	
	if (timeLimit <= 0) {
		explodeBomb();
	} else if (timeLimit <= 10 && graceTime <= 0) {
		playSound(beepSnd);
	}
}

function activateAllNeedys(newState) {
	if (newState) {
		var masterCollection = document.getElementsByTagName("meter");
		needyCollection = new Array(); //Reset array
		
		for (var n in masterCollection) {
			if (masterCollection[n].className && masterCollection[n].className.search("needyModule") >= 0) {
				needyCollection.push(masterCollection[n]);
				
				activateNeedyModule(masterCollection[n], true);
			}
		}
		
		needyCountdown = setInterval(cycleNeedyHeats, needyCycleDur * 1000);
	} else {
		bombQueued = true;
		
		try {
			for (var n in needyCollection) {
				activateNeedyModule(needyCollection[n], false);
			}
		} catch(err) {
			// Dummy catch
		}

		clearInterval(needyCountdown);
		needyCountdown = -Infinity;
	}
}

function activateNeedyModule(timerObj, newState) {
	var baseId = timerObj.id.substring(0,timerObj.id.length-2);
	var baseObj = document.getElementById(baseId);
	
	var meterObj = document.getElementById(baseId+"nH");
	var timerObj = document.getElementById(baseId+"nT");
	
	if (baseObj.className.search("capacitorFrame") >= 0) {
		activateCapacitor(baseObj, newState);
	} else if (baseObj.className.search("knobFrame") >= 0) {
		activateKnob(baseObj, newState);
	} else if (baseObj.className.search("ventGasFrame") >= 0) {
		activateVentGas(baseObj, newState, false);
	}
	
	if (newState) {
		meterObj.value = 0;
		timerObj.innerHTML = meterObj.max;
	} else if (baseObj.className.search("capacitorFrame") >= 0 &&
		baseObj.style.borderColor == strikeColor) {
		/*
		 * If a Capacitor module strikes (overloads), then it 
		 * permanently deactivates. It can no longer award a point.
		 */
		meterObj.value = meterObj.max;
		if (score >= nextBomb) {
			needyScore--;
		}
	} else if (score >= nextBomb && !isFinite(goal)) {
		// Score this module in Endless games
		solveModule(baseObj, true, true, 0);
	}
}

function cycleNeedyHeats() {
	for (var n in needyCollection) {
		var needyHeat = parseFloat(needyCollection[n].value);
		var maxHeat = parseFloat(needyCollection[n].max);
		
		var baseId = needyCollection[n].id.substring(0,needyCollection[n].id.length-2);
		var baseObj = document.getElementById(baseId);
		var timerObj = document.getElementById(baseId+"nT");
		var dischargeObj = document.getElementById(baseId+"nD");
		
		if (dischargeObj && dischargeObj.innerHTML == "Discharging") {
			needyHeat = Math.max(needyHeat - 1,0);
			needyCollection[n].value = needyHeat;
			timerObj.innerHTML = Math.ceil(maxHeat - needyHeat);
			
		} else if (needyHeat > -999 && needyHeat < 0) {
			needyHeat += needyCycleDur;
			needyCollection[n].value = needyHeat;
			
			if (needyHeat >= 0) {
				activateNeedyModule(needyCollection[n], true);
			}
			
		} else if (needyHeat < maxHeat) {
			needyHeat += needyCycleDur;
			needyCollection[n].value = needyHeat;
			timerObj.innerHTML = Math.ceil(maxHeat - needyHeat);
			
			if (needyHeat >= maxHeat) {
				if (!validateKnob(baseObj)) {
					solveModule(baseObj, false, true);
					console.warn("Needy module has overloaded!");
				}
				activateNeedyModule(needyCollection[n], false);
			} else if (needyHeat + 5 >= maxHeat && needyHeat % 1 < needyCycleDur/2) {
				playSound(beepSnd);
			}
		}
	}
}

function applyFeedback(good, panelTxt) {
	document.getElementById("fPanel").style.visibility = "visible";
	document.getElementById("fPanel").style.borderColor = (good ? "lime" : "red");
	document.getElementById("fTxt").innerHTML = panelTxt;
}

function continueButton(canStillPlay, needyCount) {
	if (canStillPlay > 0) {
		return "<a class=\"interact\" href=\"javascript:makeBomb("+canStillPlay+","+needyCount+");\">Next bomb</a>";
	}
	return "<a class=\"interact\" href=\"javascript:startGame();\">Restart game</a>";
}

function cloneArray(orgArray) {
	newArray = new Array();
	
	for (var c = 0; c < orgArray.length; c++) {
		newArray[c] = orgArray[c];
	}
	
	return newArray;
}

/* ----------------------------------------------------------- */

function makeBomb(totCount, needyCount) {
	var useModuleRules = moduleFile;
	var randomAdd = irandom(0,defaultModules.length-1);
	graceTime = 3;
	if (score > 0) {
		console.clear();
	}
	bombQueued = false;
	
	// Generate a collection of modules for the next bomb
	if (isFinite(goal)) {
		switch (totCount) {
			case 1:
				timeMax = 180;
				break;
			case 3:
				if (score < 3) {
					timeMax = 300;
				} else {
					timeMax = 240;
				}
				break;
			case 5:
				timeMax = 360;
				break;
			case 7:
				// Fall thru
			case 11:
				if (score < 26) {
					timeMax = 420;
				} else {
					timeMax = 300;
				}
				break;
		}
		
		if (moduleFile == "adjLetters") {
			timeMax = timeMax * 2 - 60;
		}
		timeLimit = timeMax;
		life = lifeMax;
	}
	
	nextBomb = score + totCount - needyCount;
	needyScore = needyCount;

	bombNode = document.getElementById("bomb");
	moduleCollection = document.getElementsByTagName("fieldset");
	for (j = 0; j < moduleCollection.length; j++) {
		if (moduleCollection[j].id == "edgework" || moduleCollection[j].id.startsWith("module")) {
			moduleCollection[j--].remove();
		}
	}
	
	createEdgework();

	var hardModules = [0, 0];
	for (k = 0; k < totCount; k++) {
		if (moduleFile == "mixedPractice" && totCount == 11) {
			useModuleRules = defaultModules[(k + randomAdd) % defaultModules.length];
		} else if (moduleFile == "mixedPack1") {
			hardModules[1] = Math.floor(totCount/4);
			
			do
				useModuleRules = addonModules[irandom(0,3)];
			while (useModuleRules == "adjLetters" && hardModules[0] >= hardModules[1]);
			
			if (useModuleRules == "adjLetters") {
				hardModules[0]++;
				timeMax += 60;
				timeLimit += 60;
			}
		} else if (moduleFile == "endlessButtons") {
			useModuleRules = "bigButton";
		} else if (moduleFile == "endlessSimon") {
			useModuleRules = "simon";
		} else if (moduleFile == "endlessVenn") {
			useModuleRules = "venn";
		} else {
			if (k < needyCount) {
				if (singleNeedyFile) {
					useModuleRules = moduleFile;
				} else {
					useModuleRules = defaultNeedys[irandom(0,defaultNeedys.length-1)];
				}
			} else if (moduleFile == "endlessStable" || moduleFile == "mixedPractice" || moduleFile == "mixedNeedy" ||
				moduleFile == "capacitor" || moduleFile == "knob" || moduleFile == "ventGas") {
				useModuleRules = defaultModules[irandom(0,defaultModules.length-1)];
			} else if (!singleSolvableFile) {
				do {
					var difficulty = 0;
					useModuleRules = grandModules[irandom(0,grandModules.length-1)];
					
					if (moduleFile.startsWith("endless") || moduleFile.startsWith("short")) {
						if (useModuleRules == "adjLetters") {
							difficulty = 1;
						}
					}
				} while (score < difficulty * 25 || (useModuleRules == "bigButton" && !isFinite(timeMax)))
			}
		}
		
		newId = score + k + 1;
		
		newModule = document.createElement("fieldset");
		newModule.id = "module"+newId;
		
		newModuleLabel = document.createElement("legend");
		newModuleLabel.innerHTML = "Module "+newId;
		newModule.appendChild(newModuleLabel);
		
		createBombModule(newModule,useModuleRules);
		
		bombNode.appendChild(newModule);
	}

	gameActive = true;
	
	if (firstLoad) {
		applyFeedback(true, "...");
		document.getElementById("fPanel").style.visibility = "hidden";
	} else {
		loadSoundEffects();
		firstLoad = true;
	}

	updateUI();
	startBombCountdown(true);
}

function createEdgework() {
	const serialChars = 'ABCDEFGHIJKLMNPQRSTUVWXZ0123456789';
	var numBatt = irandom(0,2) + 2*irandom(0,2);
	var numIndicators = irandom(0,3);
	var numPortPlates = irandom(0,3);
	
	edgework = document.createElement("fieldset");
	edgework.id = "edgework";
	
	edgeworkLabel = document.createElement("legend");
	edgeworkLabel.innerHTML = "Bomb specifics"
	edgework.appendChild(edgeworkLabel);
	
	edgeworkFrag = document.createElement("span");
	edgeworkFrag.id = "serialNum";
	edgeworkFrag.innerHTML = "";
	
	for (var c = 0; c < 6; c++) {
		if (c == 0) {
			edgeworkFrag.innerHTML += serialChars.charAt(irandom(0,23));
		} else if (c == 5) {
			edgeworkFrag.innerHTML += serialChars.charAt(irandom(24,serialChars.length-1));
		} else {
			edgeworkFrag.innerHTML += serialChars.charAt(irandom(0,serialChars.length-1));
		}
	}
	edgework.appendChild(edgeworkFrag);
	
	edgework.innerHTML += " / ";

	edgeworkFrag = document.createElement("span");
	edgeworkFrag.id = "numBatts";
	edgeworkFrag.innerHTML = numBatt;
	edgework.appendChild(edgeworkFrag);

	edgework.innerHTML += " batt";
	
	var indicatorPool = cloneArray(defaultIndicators);
	
	for (var d = 0; d < numIndicators; d++) {
		rolledId = irandom(0,indicatorPool.length-1);
		rolledInd = indicatorPool[rolledId];
		rolledLight = irandom(9898,9899);
		
		if (d == 0) {
			edgework.innerHTML += "<br />";
		} else {
			edgework.innerHTML += " / ";
		}
		
		edgeworkFrag = document.createElement("span");
		edgeworkFrag.innerHTML = "&#"+rolledLight+"; "+rolledInd;
		edgeworkFrag.id = "u"+rolledInd;
		if (rolledLight == 9898) {
			edgeworkFrag.id = "l"+rolledInd; 
		}
		indicatorPool.splice(rolledId, 1);
		edgework.appendChild(edgeworkFrag);
	}
	
	var portCounts = [0,0,0,0,0,0];
	var firstPort = false;
	
	for (var e = 0; e < numPortPlates; e++) {
		var portA = irandom(0,defaultPorts.length-1);
		var portB = irandom(0,defaultPorts.length-1);
		
		portCounts[portA]++;
		if (portA != portB) {
			portCounts[portB]++;
		}
	}
	
	for (var p = 0; p < portCounts.length; p++) {
		if (portCounts[p] > 0) {
			if (firstPort) {
				edgework.innerHTML += " + ";
			} else {
				edgework.innerHTML += "<br />";
				firstPort = true;
			}
			
			edgeworkFrag = document.createElement("span");
			edgeworkFrag.innerHTML = portCounts[p];
			edgeworkFrag.id = "p"+defaultPorts[p];
			edgework.appendChild(edgeworkFrag);
			edgework.innerHTML += " "+defaultPorts[p];
		}
	}
	
	bombNode.appendChild(edgework);
}

function makeBr() {
	var lineBreak = document.createElement("br");
	
	return lineBreak;
}

/* ----------------------------------------------------------- */

function getSerial() {
	return document.getElementById("serialNum").innerHTML;
}

function getBatteries() {
	return parseInt(document.getElementById("numBatts").innerHTML);
}

function hasIndicator(label) {
	return (document.getElementById("u"+label) || document.getElementById("l"+label));
}

function hasLitIndicator(label, flag) {
	if (flag) {
		return document.getElementById("l"+label);
	} else {
		return document.getElementById("u"+label);
	}
}

function getLastDigit() {
	return parseInt(getSerial().slice(-1));
}

function lastDigitEven() {
	return (getLastDigit() % 2 == 0);
}

function serialHasVowel() {
	return (getSerial().search(/[aeiou]/i) >= 0);
}

function getBombPorts(part) {
	portsObj = document.getElementById("p"+part);
	if (portsObj) {
		return parseInt(portsObj.innerHTML);
	}
	
	return 0;
}

/* ----------------------------------------------------------- */

function checkBit(inVal, bitId) {
	return (inVal & (2 ** bitId));
}

function countBitDiff(valA, valB) {
	var ceiling = Math.ceil(Math.log(Math.max(valA, valB)) / Math.log(2));
	var bitsDiff = 0;
	
	for (var b = 0; b < ceiling; b++) {
		if (checkBit(valA, b) != checkBit(valB, b)) {
			bitsDiff++;
		}
	}
	
	return bitsDiff;
}

function renderTime(amt, dispFrac) {
	if (!isFinite(amt)) {
		return "-'--''"
	}
	
	minutes = Math.floor(amt / 60);
	seconds = (Math.floor(amt) % 60);
	fraction = Math.round(amt * 1000) % 1000;
	
	if (!dispFrac) {
		minutes = Math.floor((amt + 0.999) / 60);
		seconds = Math.ceil(amt - 1e-6) % 60;
	}
	
	buildStr = minutes+ "'"
	
	if (seconds < 10) {
		buildStr = buildStr+"0"
	}		
	
	buildStr = buildStr+seconds+"''"
	if (dispFrac) {
		if (fraction < 10) {
			buildStr = buildStr+"00"
		} else if (fraction < 100) {
			buildStr = buildStr+"0"
		}
		buildStr = buildStr+fraction;
	}
	
	return buildStr;
}

function updateUI() {
	if (isFinite(goal)) {
		document.getElementById("score").innerHTML = score + " / " + goal;
	} else {
		document.getElementById("score").innerHTML = score + " / &infin;";
	}
	document.getElementById("life").innerHTML = life + " / " + lifeMax;
	document.getElementById("bombTime").innerHTML = renderTime(timeLimit, false);
	
	var meterSize = score/goal*300;
	if (!isFinite(goal) && moduleFile != "endlessHardcore") {
		var meterSize = (score%25)/25*300;
	}
	var curveLeft = Math.min(meterSize,3);
	var curveRight = Math.min(Math.max(meterSize-297,0),3);
	var meterClass = "okay";
	if (!isFinite(goal)) {
		meterClass = "endless";
	} else if (score*3 < goal) {
		meterClass = "warning";
	} else if (score*3 < goal*2) {
		meterClass = "caution";
	}
	document.getElementById("scoreMtr").innerHTML = "<div class=\"" + meterClass + "\" style=\"width: " + meterSize + "px; border-radius: " +
		curveLeft + "px " + curveRight + "px " + curveRight + "px " + curveLeft + "px;\"></div>";
	
	meterSize = Math.max(life/lifeMax*300,0);
	curveLeft = Math.min(meterSize,3);
	curveRight = Math.min(Math.max(meterSize-297,0),3);
	meterClass = "okay";
	if (lifeMax == 1) {
		meterClass = "warning";
	} else if (life <= 1 && score < goal) {
		meterClass = "danger";
	} else if (life*3 <= lifeMax) {
		meterClass = "warning";
	} else if (life*3 <= lifeMax*2) {
		meterClass = "caution";
	}

	document.getElementById("lifeMtr").innerHTML = "<div class=\"" + meterClass + "\" style=\"width: " + meterSize + "px; border-radius: " +
		curveLeft + "px " + curveRight + "px " + curveRight + "px " + curveLeft + "px;\"></div>";
	
	meterSize = Math.max(timeLimit/timeMax*300,0);
	curveLeft = Math.min(meterSize,3);
	curveRight = Math.min(Math.max(meterSize-297,0),3);
	meterClass = "okay";
	if (!isFinite(timeLimit)) {
		meterSize = 0;
	} else if (timeLimit <= 10 && score < goal) {
		meterClass = "nightmare";
	} else if (timeLimit <= 60 && score < goal) {
		meterClass = "danger";
	} else if (timeLimit <= 120 || timeLimit*4 < timeMax) {
		meterClass = "warning";
	} else if (timeLimit <= 180 || timeLimit*2 < timeMax) {
		meterClass = "caution";
	}
	
	if (gameActive) {
		if (timeLimit > 60) {
			document.body.className = "";
		} else {
			document.body.className = "redAlarm";
		}
	}

	document.getElementById("timerMtr").innerHTML = "<div class=\"" + meterClass + "\" style=\"width: " + meterSize + "px; border-radius: " +
		curveLeft + "px " + curveRight + "px " + curveRight + "px " + curveLeft + "px;\"></div>";
	
	if (score >= 25 || score*10 > goal) {
		document.getElementById("help").style.display = "none";
	}
}

function irandom(mini, maxi) {
	return Math.floor((Math.random() * (maxi - mini + 1)) + mini);
}

// Sound effects
function playSound(playObj) {
	if (playObj !== undefined) {
		playObj.play();
	}
}

function loadSoundEffects() {
	// General effects
	beepSnd = new sound("snd/beep.wav");
	strikeSnd = new sound("snd/strike.wav");
	explodeSnd = new sound("snd/explosion.wav");
	gameWonSnd = new sound("snd/gameWon.wav");
	
	// Default Module effects
	buttonSnds = [new sound("snd/buttonPressed.wav"), new sound("snd/buttonReleased.wav")];
	simonSnds = [new sound("snd/selectB.wav"), new sound("snd/selectY.wav"), new sound("snd/selectR.wav"), new sound("snd/selectG.wav")];
	fartSnd = new sound("snd/reverb_fart.wav");
	
	// Expansion Module effects
	potBallSnd = new sound("snd/potBall.wav");
}

//sound object
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	
	document.body.appendChild(this.sound);
	this.play = function(){
		this.sound.currentTime = 0;
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
} 

function getParam(param) { 
	var query = window.location.search.substring(1); 
	var vars = query.split("&"); 
	for (var i=0;i<vars.length;i++) { 
		var pair = vars[i].split("="); 
		if (pair[0] == param) { 
			return pair[1]; 
		} 
	}
	return -1; //not found 
}
