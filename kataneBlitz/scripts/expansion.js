// Modulo Functions

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
	var newDivisor = irandom(3,19);
	var newDividend = irandom(50,999);
	
	document.getElementById(readId+"xmV").innerHTML = newDivisor;
	document.getElementById(readId+"xmD").innerHTML = newDividend;
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
	
	var getDivisor = parseInt(document.getElementById(baseId+"xmV").innerHTML);
	var getDividend = parseInt(document.getElementById(baseId+"xmD").innerHTML);
	var calcSolution = getDividend % getDivisor;
	var getRemainder = document.getElementById(baseId+"xmI").innerHTML;
	
	if (gameActive && readObj.style.borderColor != solveColor) {
		if (getRemainder != "" && parseInt(getRemainder) == calcSolution) {
			console.log("Modulo "+getDividend+" % "+getDivisor+" was solved correctly.");
			solveModule(readObj, true, false);
		} else {
			console.warn("Modulo "+getDividend+" % "+getDivisor+" was solved incorrectly! Your answer was "+getRemainder+". The correct answer was "+calcSolution+".");
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

