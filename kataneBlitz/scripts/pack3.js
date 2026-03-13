const colFlashWords = ["red", "green", "blue", "yellow", "magenta", "white"];
const colFlashColors = colKeyColors;

var colourCycle = -2;
var colourFlasher = -1;

// Colour Flash functions

// Ensure that there is a valid solution to each module
function fixAllColFlashes() {
	coloCollection = document.getElementsByClassName("colFlashFrame");
	clearInterval(colourFlasher);
	
	for (var c in coloCollection) {
		if (coloCollection[c].className == "colFlashFrame") {
			var workId = coloCollection[c].id;
			var baseId = workId.substring(0,workId.length-3);
			
			lastCol = document.getElementById(baseId+"cfW8").style.color;
			switch (lastCol) {
				case colFlashColors[0]: // Red
					if (countCFwords(baseId, colFlashWords[4], false) == 0) {
						mutateCFentry(baseId, irandom(1,8), colFlashWords[4], null);
					}
					if (countCFwords(baseId, colFlashWords[5], false) == 0 &&
						countCFcolors(baseId, colFlashColors[5], false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[5]);
					}
					break;
					
				case colFlashColors[1]: // Green
					while ((countCFwords(baseId, colFlashWords[3], false) == 0 &&
							countCFcolors(baseId, colFlashColors[3], false) == 0) ||
							countCFmatches(baseId, true, false) == 0) {
						if (countCFwords(baseId, colFlashWords[3], false) == 0 &&
							countCFcolors(baseId, colFlashColors[3], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), null, colFlashColors[3]);
						}
						
						if (countCFmatches(baseId, true, false) == 0) {
							mutateCFentry(baseId, irandom(1,7), "makeMatch", null);
						}
					}
					break;
					
				case colFlashColors[2]: // Blue
					while (countCFpairs(baseId, colFlashWords[5], colFlashColors[0], false) == 0 ||
						countCFcolors(baseId, colFlashColors[1], false) == 0) {
						if (countCFpairs(baseId, colFlashWords[5], colFlashColors[0], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), colFlashWords[5], colFlashColors[0]);
						}
						
						if (countCFcolors(baseId, colFlashColors[1], false) == 0) {
							mutateCFentry(baseId, irandom(1,7), null, colFlashColors[1]);
						}
					}
					break;
					
				case colFlashColors[3]: // Yellow
					if (countCFcolors(baseId, colFlashColors[4], false) < 1) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[4]);
					}
					break;
					
				case colFlashColors[4]: // Magenta
					var ensureCol = convertCFwordCol(document.getElementById(baseId+"cfW7").innerHTML);
					
					if (countCFcolors(baseId, ensureCol, false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, ensureCol);
					}
					break;
					
				case colFlashColors[5]: // White
					if (countCFwords(baseId, colFlashWords[2], false) == 0 && countCFcolors(baseId, colFlashColors[2], false) == 0) {
						mutateCFentry(baseId, irandom(1,7), null, colFlashColors[2]);
					}
					
					if (countCFwords(baseId, colFlashWords[3], false) == 0) {
						mutateCFentry(baseId, irandom(1,8), colFlashWords[3], null);
					}
					break;
			}
		}
	}
	
	colourCycle = -2;
	colourFlasher = setInterval(cycleColFlashes, 875);
}

function cycleColFlashes() {
	if (colourCycle >= 8) {
		colourCycle = -1;
	} else {
		colourCycle++;
	}
	
	var makeDispVis = Math.max(colourCycle,0);
	
	dispCollection = document.getElementsByClassName("colFlashDisp");
	
	for (var d in dispCollection) {
		if (dispCollection[d].className == "colFlashDisp") {
			var workId = dispCollection[d].id;
			
			dispCollection[d].style.display = (workId.endsWith(makeDispVis) ? "" : "none");
		}
	}
}

function pressColFlashButton(readObj, readPress) {
	if (life > 0 && timeLimit > 0) {
		var lastCol, deltaCycle, requiredCycle, requiredBool, allowAnyMatchPair, readBool;
		
		readBool = (readPress.id.endsWith("Y"));
		
		lastCol = document.getElementById(readObj.id+"cfW8").style.color;
		deltaCycle = 0;
		allowAnyMatchPair = false;
		
		switch (lastCol) {
			case colFlashColors[0]: // Red
				if (countCFwords(readObj.id, colFlashWords[1], false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[1], "findEitherOr", 2);
					requiredBool = true;
				} else if (countCFcolors(readObj.id, colFlashColors[2], false) == 1) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[4], null, 0);
					requiredBool = false;
				} else {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[5], "findEitherOr", Infinity);
					requiredBool = true;
				}
				break;
				
			case colFlashColors[1]: // Green
				if (countCFhighWords(readObj.id) >= 2) {
					requiredCycle = 5;
					requiredBool = false;
				} else if (countCFwords(readObj.id, colFlashWords[4], false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[3], "findEitherOr", 0);
					requiredBool = false;
				} else {
					allowAnyMatchPair = true;
					requiredBool = true;
				}
				break;
				
			case colFlashColors[2]: // Blue
				if (countCFmatches(readObj.id, false, false) >= 3) {
					requiredCycle = findCFpattern(readObj.id, "findMismatch", null, 0);
					requiredBool = true;
				} else if (countCFpairs(readObj.id, colFlashWords[0], colFlashColors[1], false) >= 1 ||
					countCFpairs(readObj.id, colFlashWords[1], colFlashColors[5], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[5], colFlashColors[0], 0);
					requiredBool = false;
				} else  {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[1], colFlashColors[1], Infinity);
					requiredBool = true;
				}
				break;
				
			case colFlashColors[3]: // Yellow
				if (countCFpairs(readObj.id, colFlashWords[2], colFlashColors[1], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, null, colFlashColors[1], 0);
					requiredBool = true;
				} else if (countCFpairs(readObj.id, colFlashWords[5], colFlashColors[5], false) >= 1 ||
					countCFpairs(readObj.id, colFlashWords[5], colFlashColors[0], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, "findMismatch", null, 1);
					requiredBool = true;
				} else  {
					requiredCycle = countCFwords(readObj.id, colFlashWords[4], false) + countCFcolors(readObj.id, colFlashColors[4], false) - countCFpairs(readObj.id, colFlashWords[4], colFlashColors[4], false);
					requiredBool = false;
				}
				break;
				
			case colFlashColors[4]: // Magenta
				if (countCFhighColors(readObj.id) >= 2) {
					requiredCycle = 3;
					requiredBool = true;
				} else if (countCFwords(readObj.id, colFlashWords[3], false) > countCFcolors(readObj.id, colFlashWords[2], false)) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[3], null, Infinity);
					requiredBool = false;
				} else {
					var semiLastColor = convertCFwordCol(document.getElementById(readObj.id+"cfW7").innerHTML);
					
					requiredCycle = findCFpattern(readObj.id, null, semiLastColor, 0);
					requiredBool = false;
				}
				break;
				
			case colFlashColors[5]: // White
				var fetchWords = [convertCFcolWord(document.getElementById(readObj.id+"cfW3").style.color),
					document.getElementById(readObj.id+"cfW4").innerHTML,
					document.getElementById(readObj.id+"cfW5").innerHTML];
			
				if (fetchWords[0] == fetchWords[1] || fetchWords[0] == fetchWords[2]) {
					requiredCycle = findCFpattern(readObj.id, colFlashWords[2], "findEitherOr", 0);
					requiredBool = false;
				} else if (countCFpairs(readObj.id, colFlashWords[3], colFlashColors[0], false) >= 1) {
					requiredCycle = findCFpattern(readObj.id, null, colFlashColors[2], Infinity);
					requiredBool = true;
				} else {
					requiredCycle = 0; // Indeed, one can literally press No (false) whenever...
					requiredBool = false;
				}
				break;
		}
		
		if (allowAnyMatchPair) {
			var localObj, readWord, readCol;
			localObj = document.getElementById(readObj.id+"cfW"+colourCycle);
			readWord = localObj.innerHTML;
			readCol = localObj.style.color;
			
			if (readBool == requiredBool && readWord == convertCFcolWord(readCol)) {
				solveModule(readObj, true, false, 25);
				console.log("Colour Flash solved. The required input was "+requiredBool+" on any word where the color matched.");
			} else if (readBool != requiredBool || readObj.style.borderColor != solveColor) {
				solveModule(readObj, false, true);
				console.warn("Colour Flash striked!");
				if (true || life <= 0) {
					console.warn("The correct input was "+requiredBool+" on any word where the color matched.");
				}
			}
		} else if (readBool == requiredBool && (colourCycle == requiredCycle || requiredCycle == 0)) {
			solveModule(readObj, true, false, 25);
			console.log("Colour Flash solved. The required input was "+requiredBool+" at word "+requiredCycle+".");
		} else if (readBool != requiredBool || readObj.style.borderColor != solveColor) {
			solveModule(readObj, false, true);
			console.warn("Colour Flash striked!");
			if (true || life <= 0) {
				console.warn("The correct input was "+requiredBool+" at word "+requiredCycle+".");
			}
		}
	}

	playSound(buttonSnds[0]);
}

// Series of counting functions
function countCFwords(readBase, findVal, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).innerHTML == findVal) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFhighWords(readBase) {
	var highestCombo = 0;
	
	for (var w = 0; w < colFlashWords.length; w++) {
		highestCombo = Math.max(countCFwords(readBase, colFlashWords[w], true), highestCombo);
	}
	
	return highestCombo;
}

function countCFcolors(readBase, findCol, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).style.color == findCol) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFhighColors(readBase) {
	var highestCombo = 0;
	
	for (var c = 0; c < colFlashColors.length; c++) {
		highestCombo = Math.max(countCFcolors(readBase, colFlashColors[c], true), highestCombo);
	}
	
	return highestCombo;
}

function countCFpairs(readBase, findVal, findCol, needStreak) {
	var count = 0;
	var highestCount = 0;
	
	for (var d = 1; d <= 8; d++) {
		if (document.getElementById(readBase+"cfW"+d).innerHTML == findVal && document.getElementById(readBase+"cfW"+d).style.color == findCol) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

function countCFmatches(readBase, needMatch, needStreak) {
	var count = 0;
	var highestCount = 0;
	var pairFound = false;
	
	for (var d = 1; d <= 8; d++) {
		pairFound = false;
		var localObj = document.getElementById(readBase+"cfW"+d);
		var readTxt = localObj.innerHTML;
		var readCol = localObj.style.color;
		
		for (var e = 0; e < colFlashWords.length; e++) {
			if (readTxt == colFlashWords[e] && readCol == colFlashColors[e]) {
				pairFound = true;
				break;
			}
		}
		
		if (pairFound == needMatch) {
			count++;
			if (count > highestCount) {
				highestCount = count;
			}
		} else if (needStreak) {
			count = 0;
		}
	}
	
	return highestCount;
}

// Convert a word to a color, and vise versa
function convertCFwordCol(inWord) {
	for (var c = 0; c < colFlashWords.length; c++) {
		if (inWord == colFlashWords[c]) {
			return colFlashColors[c];
		}
	}
}

function convertCFcolWord(inCol) {
	for (var c = 0; c < colFlashColors.length; c++) {
		if (inCol == colFlashColors[c]) {
			return colFlashWords[c];
		}
	}
}

function findCFpattern(readBase, targetWord, targetCol, skipCount) {
	var skipsLeft = skipCount;
	var lastMatch = -1;
		
	for (var k = 1; k <= 8; k++) {
		var localObj = document.getElementById(readBase+"cfW"+k);
		var readTxt = localObj.innerHTML;
		var readCol = localObj.style.color;

		if (targetWord == "findMatch") {
			for (var a = 0; a < colFlashWords.length; a++) {
				if (readTxt == colFlashWords[a] && readCol == colFlashColors[a]) {
					if (skipsLeft > 0) {
						skipsLeft--;
						lastMatch = k;
						break;
					} else {
						return k;
					}
				}
			}
		} else if (targetWord == "findMismatch") {
			for (var b = 0; b < colFlashWords.length; b++) {
				if ((readTxt == colFlashWords[b] && readCol != colFlashColors[b]) ||
					(readTxt != colFlashWords[b] && readCol == colFlashColors[b])) {
					if (skipsLeft > 0) {
						skipsLeft--;
						lastMatch = k;
						break;
					} else {
						return k;
					}
				}
			}
		} else if (targetCol == "findEitherOr") {
			var trueTargetCol = convertCFwordCol(targetWord);
			
			if (readTxt == targetWord || readCol == trueTargetCol) {
				if (skipsLeft > 0) {
					skipsLeft--;
					lastMatch = k;
				} else {
					return k;
				}
			}
		} else if ((readTxt == targetWord || targetWord == null) && (readCol == targetCol || targetCol == null)) {
			if (skipsLeft > 0) {
				skipsLeft--;
				lastMatch = k;
			} else {
				return k;
			}
		}
	}
	
	if (!isFinite(skipsLeft)) {
		return lastMatch;
	}
	
	return -1; //Somehow not found
}

function mutateCFentry(readBase, getDisp, newVal, newCol) {
	var localObj = document.getElementById(readBase+"cfW"+getDisp);
	
	if (newVal == "makeMatch") {
		var getValue = localObj.innerHTML;
		var getColor = localObj.style.color;
		
		if (irandom(0,1) < 1) {
			localObj.style.color = convertCFwordCol(getValue);
		} else {
			localObj.innerHTML = convertCFcolWord(getColor);
		}
	} else {
		if (newVal != null) {
			localObj.innerHTML = newVal;
		}
		if (newCol != null) {
			localObj.style.color = newCol;
		}
	}
}
