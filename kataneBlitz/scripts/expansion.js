// 9-Ball functions

function makeAll9Balls() {
	var nineBcollection = document.getElementsByClassName("nbBreak");
	
	for (var n in nineBcollection) {
		if (nineBcollection[n].className == "nbBreak" && nineBcollection[n].id.endsWith("nbK")) {
			var baseId = nineBcollection[n].id.substr(0,nineBcollection[n].id.length-3);
			
			build9Ball(baseId);
		}
	}
}

function build9Ball(readId) {
	var ballRack = [false, true, false, false, false, false, false, false, false, true];
	var breakRack = "";
	var breakDiv = document.getElementById(readId+"nbK");
	
	for (var b = 0; b < 9; b++) {
		var activeBall = readId+"nbO"+b;
		var activeLabel = readId+"nbL"+b;
		var rollBall;
		
		switch (b) {
			case 8:
				paint9Ball(activeBall, activeLabel, 1);
				if (!lastDigitEven()) {
					breakRack += "8";
				}
				break;
				
			case 4:
				paint9Ball(activeBall, activeLabel, 9);
				break;
				
			default:
				do {
					rollBall = irandom(2,8);
				} while (ballRack[rollBall]);
				ballRack[rollBall] = true;
				
				paint9Ball(activeBall, activeLabel, rollBall);
				
				/*
				 * Ball 0 needs to be greater than 5
				 * Ball 1 needs to be less than Ball 0
				 * Ball 2 needs to be greater than the last serial digit
				 * Ball 3 needs to be a prime number
				 */
				if ((b == 0 && rollBall > 5) || 
					(b == 1 && rollBall < get9Ball(readId+"nbL0")) ||
					(b == 2 && rollBall > getLastDigit()) ||
					(b == 3 && (rollBall == 2 || rollBall == 3 || rollBall == 5 || rollBall == 7))) {
					breakRack += b.toString();
				}
				break;
		}
	}
	
	// Either adjacent random ball is one diff in value to this ball
	if (Math.abs(get9Ball(readId+"nbL5") - get9Ball(readId+"nbL2")) == 1 || Math.abs(get9Ball(readId+"nbL5") - get9Ball(readId+"nbL7")) == 1) {
		breakRack += "5";
	}

	// Difference between the two adjacent random balls exceeds 2
	if (Math.abs(get9Ball(readId+"nbL3") - get9Ball(readId+"nbL7")) > 2) {
		breakRack += "6";
	}

	// Neither adjacent random ball can be greater than 6
	if (get9Ball(readId+"nbL5") <= 6 && get9Ball(readId+"nbL6") <= 6) {
		breakRack += "7";
	}
	
	breakDiv.innerHTML = breakRack;
}

function paint9Ball(readBall, readLabel, numeral) {
	var ballObj = document.getElementById(readBall);
	var labelObj = document.getElementById(readLabel);
	var backColor;
	
	labelObj.innerHTML = numeral;
	
	switch (numeral) {
		case 2:
			backColor = "#00F";
			break;
		case 3:
			backColor = "#F00";
			break;
		case 4:
			backColor = "#808";
			break;
		case 5:
			backColor = "#F80";
			break;
		case 6:
			backColor = "#0C0";
			break;
		case 7:
			backColor = "#840";
			break;
		case 8:
			backColor = "#000";
			break;
		default:
			backColor = "#FF0";
			break;
	}
	
	ballObj.style.borderColor = backColor;
	ballObj.style.visibility = "";
}

function get9Ball(readId) {
	return parseInt(document.getElementById(readId).innerHTML);
}

function check9Bobjs(readObj) {
	var baseId = readObj.id;
	var breakBalls = 0;
	var totalBalls = 0;

	var breakDiv = document.getElementById(baseId+"nbK").innerHTML;
	for (var a = 0; a < 9; a++) {
		var workObj = document.getElementById(baseId+"nbO"+a);
		var workObjLabel = document.getElementById(baseId+"nbL"+a).innerHTML;
		if (workObj.style.visibility != "hidden") {
			totalBalls++;
			
			if (breakDiv.search(a) >= 0) {
				breakBalls++;
			}
		}
	}
	
	if (totalBalls <= 0) {
		console.log("All object balls have been pocketed.")
		solveModule(readObj, true, false);
	}
	
	return breakBalls;
}

function pot9Ball(readObj, localObj) {
	var baseId = readObj.id;
	var readBall = parseInt(localObj.id.slice(-1));
	var readValue = parseInt(document.getElementById(baseId+"nbL"+readBall).innerHTML);
	var breakDiv = document.getElementById(baseId+"nbK").innerHTML;
	
	if (breakDiv.search(readBall) >= 0) {
		localObj.style.visibility = "hidden";
		console.log("The "+readValue+"-ball was pocketed correctly during break.")
		
		if (check9Bobjs(readObj) <= 0) {
			console.log("All required object balls have been pocketed during break.")
		}
	} else if (check9Bobjs(readObj) > 0) {
		console.warn("The "+readValue+"-ball was pocketed incorrectly during break!")
		solveModule(readObj, false, false);
		build9Ball(baseId);
	} else {
		var legalBall = 9;
		
		for (var c = 0; c < 9; c++) {
			var workObj = document.getElementById(baseId+"nbO"+c);
			var workObjLabel = document.getElementById(baseId+"nbL"+c).innerHTML;
			if (workObj.style.visibility != "hidden") {
				legalBall = Math.min(legalBall, workObjLabel);
			}	
		}
		
		if (readValue <= legalBall) {
			localObj.style.visibility = "hidden";
			console.log("The "+readValue+"-ball was pocketed correctly.");
			check9Bobjs(readObj);
		} else {
			console.warn("The "+readValue+"-ball was pocketed incorrectly! The "+legalBall+"-ball was the required ball.")
			solveModule(readObj, false, false);
			build9Ball(baseId);
		}
	}
	
	playSound(potBallSnd);
}

// Modulo functions

function makeAllModulos() {
	var moduloCollection = document.getElementsByClassName("moduloDivisor");
	
	for (var m in moduloCollection) {
		if (moduloCollection[m].className == "moduloDivisor" && moduloCollection[m].id.endsWith("xmV")) {
			var baseId = moduloCollection[m].id.substr(0,moduloCollection[m].id.length-3);
			
			buildModulo(baseId);
		}
	}
}

function buildModulo(readId) {
	var newDivisor = irandom(3,Math.min(15+Math.floor(score/25),29));
	var newDividend = irandom(50,Math.min(999+Math.floor(score/50)*1000,9999));
	var newExponent = 1;
	if (moduleFile == "cruelModulo" || (score >= 50 && irandom(1,10) <= 1)) {
		// Upgrade to Cruel Modulo, if certain conditions are met
		newDivisor = irandom(10,Math.min(19+Math.floor(score/25),49));
		newDividend = irandom(50,999);
		newExponent = irandom(10,15+Math.floor(score/25));
	} else {
		document.getElementById(readId+"xmE").style.visibility = "hidden";
	}
	
	document.getElementById(readId+"xmV").innerHTML = newDivisor;
	document.getElementById(readId+"xmD").innerHTML = newDividend;
	document.getElementById(readId+"xmE").innerHTML = newExponent;
	clearModulo(document.getElementById(readId), false);
}

function inputModDigit(readObj, localObj) {
	var actualObj = document.getElementById(readObj.id+"xmI");
	var curVal = actualObj.innerHTML;
	var newDigit = localObj.innerHTML;

	if (readObj.style.borderColor != solveColor) {
		if (curVal == "") {
			actualObj.innerHTML = newDigit;
		} else {
			actualObj.innerHTML = parseInt(curVal) + newDigit;
		}
	}
	
	playSound(buttonSnds[0]);
}

function submitModulo(readObj) {
	var baseId = readObj.id;
	
	var getDivisor = BigInt(document.getElementById(baseId+"xmV").innerHTML);
	var getDividend = BigInt(document.getElementById(baseId+"xmD").innerHTML);
	var getExponent = BigInt(document.getElementById(baseId+"xmE").innerHTML);
	var calcSolution = (getDividend ** getExponent) % getDivisor;
	var getRemainder = document.getElementById(baseId+"xmI").innerHTML;
	
	if (gameActive && readObj.style.borderColor != solveColor) {
		var txtExpression = "Cruel Modulo "+getDividend+"^"+getExponent+" % "+getDivisor;
		if (getExponent == 1) {
			txtExpression = "Modulo "+getDividend+" % "+getDivisor;
		}
		
		if (getRemainder != "" && parseInt(getRemainder) == calcSolution) {
			console.log(txtExpression+" was solved correctly. ("+calcSolution+")");
			solveModule(readObj, true, false);
		} else {
			console.warn(txtExpression+" was solved incorrectly! Your answer was "+getRemainder+". The correct answer was "+calcSolution+".");
			solveModule(readObj, false, false);
			buildModulo(baseId);
		}
	}
	
	playSound(buttonSnds[0]);
}

function clearModulo(readObj, playSnd) {
	if (readObj.style.borderColor != solveColor) {
		document.getElementById(readObj.id+"xmI").innerHTML = "";
	}
	
	if (playSnd) {
		playSound(buttonSnds[0]);
	}
}

