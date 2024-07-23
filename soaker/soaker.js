const maxRolls = 3;
var numScoreRows;
var rollPhase = 0;
var diceRolls = [0,0,0,0,0,0];
var gameActive = false;

function setupGame() {
	var sectionUpper = ["Aces", "Twos", "Threes", "Fours", "Fives", "Sixes"];
	var sectionMiddle = ["Three Pairs", "Two Trios", "Small Straight (4)", "Medium Straight (5)", "Large Straight (6)"];
	var sectionLower = ["Three of a Kind", "Four of a Kind", "Five of a Kind", "Six of a Kind", "Yarborough"];
	var totalLetters = ["U", "M", "L"];
	
	numScoreRows = Math.max(sectionUpper.length, sectionMiddle.length, sectionLower.length);

	var tabSect = document.getElementById("comboBoard");
	var trFrag, tdFrag;
	
	// Build the table
	for (var i = 0; i < numScoreRows; i++) {
		trFrag = document.createElement("tr");
		
		// Upper Section pair
		if (i < sectionUpper.length) {
			createScorePair(trFrag, sectionUpper[i], "upper"+i);
		} else {
			createEmptyPair(trFrag);
		}
		
		// Middle Section pair
		if (i < sectionMiddle.length) {
			createScorePair(trFrag, sectionMiddle[i], "middle"+i);
		} else {
			createEmptyPair(trFrag);
		}
		
		// Lower Section pair
		if (i < sectionLower.length) {
			createScorePair(trFrag, sectionLower[i], "lower"+i);
		} else {
			createEmptyPair(trFrag);
		}
		
		tabSect.appendChild(trFrag);
	}
	
	trFrag = document.createElement("tr");
	// Upper Section Bonus
	createScorePair(trFrag, "Bonus (&ge;74)", "bonusU");

	// Middle Section gets no bonus
	createEmptyPair(trFrag);

	// Lower Section Bonus
	createScorePair(trFrag, "SoaK Bonus", "bonusL");
	tabSect.appendChild(trFrag);
	
	// Section totals
	trFrag = document.createElement("tr");
	for (var j = 0; j < totalLetters.length; j++) {
		createScorePair(trFrag, "Section Total", "total"+totalLetters[j], "0");
	}
	
	tabSect.appendChild(trFrag);
	loadSoundEffects();
	newGame(true);
}

function createScorePair(parentObj, label, scoreId) {
	var tdFrag;
	
	if (label == "Section Total") {
		tdFrag = document.createElement("th");
	} else {
		tdFrag = document.createElement("td");
	}
	tdFrag.innerHTML = label;
	parentObj.appendChild(tdFrag);
	
	tdFrag = document.createElement("td");
	tdFrag.className = "numeric";
	tdFrag.id = scoreId;
	tdFrag.innerHTML = "&nbsp;";
	tdFrag.style.cursor = "pointer";
	tdFrag.onclick = function() { applyCombo(this) };
	parentObj.appendChild(tdFrag);
}

function createEmptyPair(parentObj) {
	var tdFrag;
	
	tdFrag = document.createElement("td");
	parentObj.appendChild(tdFrag);
	tdFrag = document.createElement("td");
	parentObj.appendChild(tdFrag);
}

/* ------------------------------------------------------------------------ */

function updateButtons() {
	var workObj = document.getElementById("actionButton");
	var rollsLeft = maxRolls - rollPhase;
	
	workObj.value = "Next roll ("+rollsLeft+")";
	workObj.disabled = (rollsLeft <= 0 || !gameActive);
}

function newGame(newSession) {
	var askConfirm = (gameActive && getScore("totalG") > 0);
	
	if (!askConfirm || confirm("Abort this game and start a new game?")) {
		if (askConfirm) {
			playSound(overSnd);
		}
		
		// Empty scoreboard
		for (var k = 0; k < numScoreRows; k++) {
			lockScore("upper"+k, false);
			lockScore("middle"+k, false);
			lockScore("lower"+k, false);
		}
		setScore("bonusL","+0");
		updateScoreboard();

		gameActive = false;
		rollPhase = 0;
		rollDice();
		gameActive = true;
		updateButtons();

		if (newSession) {
			updateStatus("Welcome to SoaKer.");
		} else {
			updateStatus("Game started");
		}
	}
}

function applyCombo(localObj) {
	localId = localObj.id;
	
	if (!gameActive) {
		updateStatus("The game is already over. Tap <q>New Game</q> to start a fresh game.");
	} else if (isScoreLocked(localId)) {
		updateStatus("This box is already locked.");
	} else if (rollPhase < 1) {
		updateStatus("At least one roll must be done before a score can be locked.");
	} else {
		if (hasJoker() && getScore("lower3") > 0) {
			updateStatus("SoaK bonus achieved! Score bonus +100");
			setScore("bonusL", "+" + parseInt(getScore("bonusL") + 100));
			playSound(soakSnd);
		} else {
			updateStatus("Score placed!");
		}
		lockScore(localId, true);
		
		if (updateScoreboard() <= 0) {
			updateStatus("Game over! All combinations filled!");
			playSound(overSnd);
			gameActive = false;
		}
		rollPhase = 0;
		updateButtons();
	}
}

function toggleKeep(localObj) {
	if (rollPhase > 0 && rollPhase < maxRolls && gameActive) {
		var localId = localObj.id;
		
		lockDie(localId, !isDieLocked(localId));
		playSound(lockSnd);
	}
}

function rollDice() {
	for (var d = 0; d < 6; d++) {
		var workId = "die"+d;
		
		if (!isDieLocked(workId) || rollPhase <= 0) {
			diceRolls[d] = randomInt(1,6);

			renderDie(d);
			lockDie(workId, false);
		}
	}

	if (gameActive) {
		playSound(rollSnd);
	}
	
	rollPhase = Math.max(rollPhase,0) + 1;
	updateButtons();
	paintScoreboard();
	
	updateStatus("&nbsp;");
}

/* ------------------------------------------------------------------------ */

function renderDie(inVal) {
	var workObj = document.getElementById("die"+inVal);
	
	if (workObj) {
		var innerShell = "";
		
		switch (diceRolls[inVal]) {
			case 1:
				innerShell = "<div class=\"pip4\">&#9632;</div>";
				break;
			case 2:
				innerShell = "<div class=\"pip3 green\">&#9632;</div>\
					<div class=\"pip5 green\">&#9632;</div>";
				break;
			case 3:
				innerShell = "<div class=\"pip3 red\">&#9632;</div>\
					<div class=\"pip4 red\">&#9632;</div>\
					<div class=\"pip5 red\">&#9632;</div>";
				break;
			case 4:
				innerShell = "<div class=\"pip1 red\">&#9632;</div>\
					<div class=\"pip3 red\">&#9632;</div>\
					<div class=\"pip5 red\">&#9632;</div>\
					<div class=\"pip7 red\">&#9632;</div>";
				break;
			case 5:
				innerShell = "<div class=\"pip1 green\">&#9632;</div>\
					<div class=\"pip3 green\">&#9632;</div>\
					<div class=\"pip4 green\">&#9632;</div>\
					<div class=\"pip5 green\">&#9632;</div>\
					<div class=\"pip7 green\">&#9632;</div>";
				break;
			case 6:
				innerShell = "<div class=\"pip1\">&#9632;</div>\
					<div class=\"pip2\">&#9632;</div>\
					<div class=\"pip3\">&#9632;</div>\
					<div class=\"pip5\">&#9632;</div>\
					<div class=\"pip6\">&#9632;</div>\
					<div class=\"pip7\">&#9632;</div>";
				break;
		}
		
		workObj.innerHTML = innerShell;
	}
}

function lockDie(workId, newLock) {
	var workObj = document.getElementById(workId);
	
	if (workObj) {
		if (newLock) {
			workObj.className = "dieRoll dieLock";
		} else {
			workObj.className = "dieRoll";
		}
	}
}

function isDieLocked(workId) {
	var workObj = document.getElementById(workId);
	
	if (workObj) {
		return (workObj.className.endsWith("dieLock"));
	}
	
	return false;
}

function lockScore(workId, newLock) {
	var workObj = document.getElementById(workId);
	
	if (workObj) {
		if (newLock) {
			workObj.className = "numeric";
			if (!isFinite(getScore(workId)) || getScore(workId) <= 0) {
				playSound(zeroSnd);
			} else if (workId == "lower3" && getScore(workId) > 0) {
				playSound(soakSnd);
			} else {
				playSound(comboSnd);
			}
		} else {
			workObj.className = "numeric tentative";
		}
	}
}

function isScoreLocked(workId) {
	var workObj = document.getElementById(workId);
	
	if (workObj) {
		return (!workObj.className.endsWith("tentative"));
	} else {
		return true;
	}
	
	return false;
}

function getScore(workId) {
	var workObj = document.getElementById(workId);
	
	if (workObj && isScoreLocked(workId)) {
		return parseInt(workObj.innerHTML);
	}
	
	return 0;
}

function setScore(workId, newVal) {
	var workObj = document.getElementById(workId);
	
	if (workObj) {
		if (newVal > 0 || isScoreLocked(workId)) {
			workObj.innerHTML = newVal;
		} else {
			workObj.innerHTML = "&nbsp;";
		}
	}
}

function updateScoreboard() {
	var mainSects = ["upper", "middle", "lower"];
	
	var sectionTotals = [0, 0, 0];
	var bonusCurve = 0;
	
	var openSlots = 0;
	
	for (var l = 0; l < mainSects.length; l++) {
		for (var k = 0; k < numScoreRows; k++) {
			var readId = mainSects[l]+k;
			
			if (isScoreLocked(readId) && !isFinite(getScore(readId))) {
				setScore(readId, 0);
			}
			
			sectionTotals[l] += getScore(readId);
			
			if (l == 0 && isScoreLocked(readId)) {
				bonusCurve += -(k+1) * 3.5 + getScore(readId);
			}
			
			if (!isScoreLocked(readId)) {
				openSlots++
			}
		}
	}
	
	bonusCurve = Math.floor(bonusCurve);
	if (bonusCurve >= 0) {
		bonusCurve = "+" + bonusCurve;
	}
	if (sectionTotals[0] >= 74) {
		setScore("bonusU","+40 ("+bonusCurve+")");
		sectionTotals[0] += 40;
	} else {
		setScore("bonusU","+0 ("+bonusCurve+")");
	}
	
	sectionTotals[2] += getScore("bonusL");

	setScore("totalU",sectionTotals[0]);
	setScore("totalM",sectionTotals[1]);
	setScore("totalL",sectionTotals[2]);
	setScore("totalG",sectionTotals[0] + sectionTotals[1] + sectionTotals[2]);
	
	return openSlots;
}

/* ------------------------------------------------------------------------ */

function diceAllSameColor() {
	for (var c = 1; c < 6; c++) {
		if (diceRolls[c] != diceRolls[c-1] && diceRolls[c] != 7 - diceRolls[c-1]) {
			return false;
		}
	}
	
	return true;
}

function getDieCount(goal) {
	var tally = 0;
	
	for (var e = 0; e < 6; e++) {
		if (diceRolls[e] == goal) {
			tally++;
		}
	}
	
	return tally;
}

function getPairCount() {
	var tally = 0;
	
	for (var f = 1; f <= 6; f++) {
		if (getDieCount(f) >= 2) {
			tally += Math.floor(getDieCount(f)/2);
		}
	}
	
	return tally;
}

function getTrioCount() {
	var tally = 0;
	
	for (var f = 1; f <= 6; f++) {
		if (getDieCount(f) >= 3) {
			tally += Math.floor(getDieCount(f)/3);
		}
	}
	
	return tally;
}

function getHighestCount() {
	var tally = 0;
	
	for (var f = 1; f <= 6; f++) {
		tally = Math.max(tally, getDieCount(f));
	}
	
	return tally;
}

function getDiceSum() {
	var tally = 0;
	
	for (var f = 1; f <= 6; f++) {
		tally += getDieCount(f) * f;
	}
	
	return tally;
}

function getLongestSeq() {
	var tally = 0;
	var combo = 0;
	
	for (var f = 1; f <= 6; f++) {
		if (getDieCount(f) >= 1) {
			tally++;
			combo = Math.max(tally, combo);
		} else {
			tally = 0;
		}
	}
	
	return combo;
}

function hasJoker() {
	return (isScoreLocked("lower3") && getHighestCount() >= 6);
}

function autoSetScore(workId) {
	if (!isScoreLocked(workId)) {
		if (workId.startsWith("upper")) {
			var seekPips = parseInt(workId.charAt(5)) + 1
			
			setScore(workId, getDieCount(seekPips) * seekPips);
		} else {
			setScore(workId,0);

			switch (workId) {
				case "middle0":
					if (getPairCount() == 3) {
						if (diceAllSameColor()) {
							setScore(workId,45);
						} else {
							setScore(workId,30);
						}
					}
					break;
					
				case "middle1":
					if (getTrioCount() == 2) {
						if (diceAllSameColor()) {
							setScore(workId,75);
						} else {
							setScore(workId,50);
						}
					}
					break;
					
				case "middle2":
					if (getLongestSeq() >= 4 || hasJoker()) {
						setScore(workId,30);
					}
					break;
					
				case "middle3":
					if (getLongestSeq() >= 5 || hasJoker()) {
						setScore(workId,50);
					}
					break;
					
				case "middle4":
					if (getLongestSeq() >= 6 || hasJoker()) {
						setScore(workId,100);
					}
					break;
					
				case "lower0":
					if (getHighestCount() >= 3) {
						setScore(workId,getDiceSum());
					}
					break;

				case "lower1":
					if (getHighestCount() >= 4) {
						setScore(workId,getDiceSum() + 10);
					}
					break;

				case "lower2":
					if (getHighestCount() >= 5) {
						var sortedDice = cloneArray(diceRolls).sort();
						var commonPip = sortedDice[2];
						
						if (diceAllSameColor()) {
							setScore(workId,70 + commonPip);
						} else {
							setScore(workId,50 + commonPip);
						}
					}
					break;

				case "lower3":
					if (getHighestCount() >= 6) {
						setScore(workId,100);
					}
					break;
					
				case "lower4":
					setScore(workId,getDiceSum());
					break;
			}
		}
	}
}

function paintScoreboard() {
	for (var k = 0; k < numScoreRows; k++) {
		autoSetScore("upper"+k);
		autoSetScore("middle"+k);
		autoSetScore("lower"+k);
	}
}

/* ------------------------------------------------------------------------ */

function cloneArray(orgArray) {
	newArray = new Array();
	
	for (var c = 0; c < orgArray.length; c++) {
		newArray[c] = orgArray[c];
	}
	
	return newArray;
}

function updateStatus(newMessage) {
	var statusBar = document.getElementById("statusBar");
	
	statusBar.innerHTML = newMessage;
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function toggleHelp() {
	var helpPanel = document.getElementById("helpPanel");
	var helpButton = document.getElementById("helpButton");

	if (helpPanel.style.display == "block") {
		helpPanel.style.display = "none";
		helpButton.value = "Show help";
	} else {
		helpPanel.style.display = "block";
		helpButton.value = "Hide help";
	}
}

function playSound(playObj) {
	if (playObj !== undefined) {
		playObj.play();
	}
}

function loadSoundEffects() {
	lockSnd = new sound("lock.wav");
	rollSnd = new sound("roll.wav");
	
	zeroSnd = new sound("zero.wav");
	comboSnd = new sound("combo.wav");
	soakSnd = new sound("soak.wav");
	
	overSnd = new sound("over.wav");
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
		this.sound.fastSeek(0);
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
} 
