var rawJson;
var stageTotal;
var stageNum = 0;
var saveCookieDate = new Date;
var recallingStages = true;
const letterRows = "LKJIHGFEDCBA";
const deepSpace = "unexploredW";

function initReplay() {
	makeHexes();
	getJsonFile();
}

function makeHexes() {
	var hexBoard = document.getElementById("gameBoard");
	
	for (y = 0; y < 12; y++) {
		var newRow = document.createElement("div");
		if (y % 2 == 1) {
			newRow.className = "hexRow even";
		} else {
			newRow.className = "hexRow";
		}
		for (x = 0; x < 13 - (y % 2); x++) {
			var newHex = document.createElement("div");
			newHex.className = "hex";
			newHex.id = letterRows.charAt(y)+(x+1);
			newHex.title = "Sector "+newHex.id;
			newRow.appendChild(newHex);
		}
		hexBoard.appendChild(newRow);
	}
}

function dispRow(b, newDisp) {
	for (x = 0; x < 13; x++) {
		var findObj = document.getElementById(b+(x+1));
		
		if (findObj) {
			if (newDisp) {
				findObj.style.display = "";
			} else {
				findObj.style.display = "none";
			}
		}
	}
}

function dispCol(a, newDisp) {
	for (y = 0; y < 12; y++) {
		var findObj = document.getElementById(letterRows.charAt(y)+a);
		
		if (findObj) {
			if (newDisp) {
				findObj.style.visibility = "";
			} else {
				findObj.style.visibility = "hidden";
			}
		}
	}
}

function irandom(mini, maxi) {
	return Math.floor((Math.random() * (maxi - mini + 1)) + mini);
}

function placeCounter(curId, newX, newY, newPic) {
	var calcX = newX * 54 - 40;
	var calcY = newY * 47 + 20;
	var workObj;

	var hexBoard = document.getElementById("gameBoard");
	
	findObj = document.getElementById(curId);
	if (findObj) {
		workObj = findObj;
	} else {
		workObj = document.createElement("img");
		workObj.id = curId;
		workObj.src = "gfx/" + curId + ".png";
		workObj.className = "counter";
		workObj.style.position = "absolute";
		if (workObj.id.startsWith("system")) {
			workObj.style.zIndex = 2;
		} else {
			workObj.style.zIndex = 3;
		}
		
		hexBoard.appendChild(workObj);
	}
	
	if (!curId.startsWith("system")) {
		var randX, randY
		
		do {
			randX = irandom(-20,20);
			randY = irandom(-12,12);
		} while (Math.abs(randX) < 17 && Math.abs(randY) < 9)
		
		calcX = calcX + randX;
		calcY = calcY + randY;
	}
	
	if (newY % 2 == 1) {
		calcX = calcX + 26;
	}
	
	if (newPic) {
		workObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			workObj.style.zIndex = 1;
		}
	}
	workObj.style.left = calcX + "px";
	workObj.style.top = calcY + "px";
}

function placeSystemMarker(newX, newY, newPic) {
	placeCounter("system"+letterRows.charAt(newY)+newX, newX, newY, newPic);
}

function placeHomeworld(newX, newY, color) {
	placeSystemMarker(newX,newY,"home20"+color);
	
	for (var i = 1; i <= 3; i++) {
		placeCounter("SC"+i+color,newX,newY,null);
		placeCounter("CO"+i+color,newX,newY,"CO"+color);
	}

	placeCounter("SY1"+color,newX,newY,null);
	placeCounter("Miner1"+color,newX,newY,"Miner"+color);
}

function place3plrHomeMarkers(color, orient) {
	var homeMarker = "unexplored"+color;
	
	if (orient == "top") {
		for (var a = 4; a <= 10; a++) {
			if (a < 10) {
				if (a == 7) {
					placeHomeworld(a,0,color);
				} else {
					placeSystemMarker(a,0,homeMarker);
				}
				placeSystemMarker(a,1,homeMarker);
			}
			placeSystemMarker(a,2,homeMarker);
			if (a >= 5 && a < 9) {
				placeSystemMarker(a,3,homeMarker);
				if (a >= 6) {
					placeSystemMarker(a,4,homeMarker);
				}
			}
		}
	}
}

function renderCounter(curId, newPic) {
	findObj = document.getElementById(curId);
	if (findObj) {
		findObj.src = "gfx/" + newPic + ".png";
		if (newPic.startsWith("minerals")) {
			findObj.style.zIndex = 1;
		}
	}
}

function readJson() {
	var curStage = rawJson.stages[stageNum];
	var commentary = document.getElementById("commentary");
	var seekObj, readX, readY;
	
	commentary.innerHTML = curStage.commentary;
	keywordifyCollection(document.getElementsByTagName("p"));
	keywordifyCollection(document.getElementsByTagName("li"));
	
	// Parse the many actions
	actionPool = curStage.actions;
	for (i in actionPool) {
		// console.log(actionPool[i]);
		
		if (actionPool[i].location) {
			for (y = 0; y < 12; y++) {
				if (letterRows.charAt(y) == actionPool[i].location.substring(0,1)) {
					readY = y;
					break;
				}
			}
			
			readX = actionPool[i].location.substring(1);
		}
		
		if (actionPool[i].placeCounter) {
			workId = actionPool[i].placeCounter;
			if (actionPool[i].name) {
				placeCounter(workId, readX, readY, actionPool[i].name);
			} else {
				placeCounter(workId, readX, readY, null);
			}
		}
		
		if (actionPool[i].revealCounter) {
			workId = actionPool[i].revealCounter;
			renderCounter(workId, actionPool[i].name);
		}
		
		if (actionPool[i].removeCounter) {
			workId = actionPool[i].removeCounter;
			
			workObj = document.getElementById(workId);
			if (workObj) {
				workObj.remove();
			}
		}
		
		
		if (actionPool[i].createPreset) {
			if (actionPool[i].createPreset == "alienEmpiresSolo") {
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");
				
				for (var l = 1; l <= 12; l++) {
					if (l <= 3 || l >= 10) {
						placeSystemMarker(l,0,deepSpace);
						placeSystemMarker(l,1,deepSpace);
					}

					if (l <= 4 || l >= 9) {
						placeSystemMarker(l,3,deepSpace);
					}
				}
				
				for (var j = 1; j <= 13; j++) {
					if (j <= 3 || j >= 11) {
						placeSystemMarker(j,2,deepSpace);
					}
				}
				
				for (var h = 2; h <= 12; h++) {
					if (h <= 5 || h >= 9) {
						placeSystemMarker(h,4,deepSpace);
					}

					if (h <= 11) {
						placeSystemMarker(h,5,deepSpace);
					}
				}

				for (var f = 4; f <= 10; f++) {
					placeSystemMarker(f,6,deepSpace);
					
					if (f < 10) {
						placeSystemMarker(f,7,deepSpace);
					}
				}
				
				for (z = 9; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			} else if (actionPool[i].createPreset == "doomsdaySoloSm") {
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");
				
				placeSystemMarker(3,0,deepSpace);
				placeSystemMarker(10,0,deepSpace);
				
				for (var k = 2; k <= 11; k++) {
					if (k <= 3 || k >= 10) {
						placeSystemMarker(k,1,deepSpace);
					}

					if (k <= 4 || k >= 9) {
						placeSystemMarker(k,3,deepSpace);
					}
				}
				
				for (var j = 2; j <= 12; j++) {
					if (j <= 3 || j >= 11) {
						placeSystemMarker(j,2,deepSpace);
					}
				}
				
				placeSystemMarker(3,4,deepSpace);
				placeSystemMarker(5,4,deepSpace);
				placeSystemMarker(9,4,deepSpace);
				placeSystemMarker(11,4,deepSpace);
				
				for (var g = 4; g <= 9; g++) {
					placeSystemMarker(g,5,deepSpace);
					
					if (g > 4 && g != 7) {
						placeSystemMarker(g,6,deepSpace);
					}
				}
				
				for (z = 7; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			} else if (actionPool[i].createPreset == "doomsdaySoloLg") {
				var plrColor = actionPool[i].playerColor;
				
				place3plrHomeMarkers(plrColor, "top");

				for (var l = 1; l <= 13; l++) {
					if (l <= 3 || l >= 10) {
						placeSystemMarker(l,0,deepSpace);
						
						if (l < 13) {
							placeSystemMarker(l,1,deepSpace);
						}
						if (l != 10) {
							placeSystemMarker(l,2,deepSpace);
						}
					}

					if (l <= 4 || (l >= 9 && l < 13)) {
						placeSystemMarker(l,3,deepSpace);
					}
				}

				for (var h = 2; h <= 12; h++) {
					if (h <= 5 || h >= 9) {
						placeSystemMarker(h,4,deepSpace);
					}
					placeSystemMarker(h,5,deepSpace);
					if (h >= 3) {
						placeSystemMarker(h,6,deepSpace);
						if (h <= 10) {
							placeSystemMarker(h,7,deepSpace);
							if (h >= 4) {
								placeSystemMarker(h,8,deepSpace);
							}
						}
					}
				}
				
				for (z = 10; z < 12; z++) {
					dispRow(letterRows.charAt(z), false);
				}
			}
		}
	}

	document.getElementById("stageL").disabled = (stageNum <= 0);
	document.getElementById("stageR").disabled = (stageNum >= stageTotal);

	saveCookieDate.setTime(saveCookieDate.getTime() + (7*24*60*60*1000))

	if (!recallingStages) {
		setCookie("se4xReplay", getParam("replay")+"~"+stageNum,saveCookieDate,"/",null,false);
	}
}

function changeStage(direction) {
	stageNum += direction;
	readJson();
}

function getJsonFile() {
	readFile = "games/"+getParam("replay")+".json";
	var jsonReplay = document.getElementById("replayJson");
	
	var stageMem = 0;
	
	// AJAX this
	if (window.XMLHttpRequest) {
		//Code for modern browsers
		fileRequest = new XMLHttpRequest();
	} else {
		//Legacy code, for ancient IE versions 5 and 6
		fileRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	fileRequest.open("GET",readFile,true);
	fileRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	fileRequest.send();
	
	fileRequest.onreadystatechange = function() {
		if (fileRequest.readyState === 4) {
			if (fileRequest.status==200) {
				rawJson = JSON.parse(fileRequest.responseText);
				setupBox();
				stageTotal = rawJson.stages.length - 1;
				
				if (getCookie("se4xReplay") && getCookie("se4xReplay").startsWith(getParam("replay"))) {
					stageMem = getCookie("se4xReplay").split("~")[1];
				}
				
				readJson();
				while (stageNum < stageMem) {
					changeStage(1);
				}
				recallingStages = false;
			} else {
				console.error("Error "+fileRequest.status);
			}
		}
	}
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
