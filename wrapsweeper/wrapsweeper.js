var difficulty = 0;
var minefield = new Array();
var enableAjax = false;
var forceOpening = false;
var NFgame = false;

var gameStart = 0.0;
var gameEnd = 0.0;
var gametime = 0.0;
var gameActive = false;
var gamePlayable = false;
var flags = 0;
var safeLeft = 0;
var mineCombo = 0;
var oldMineCombo = 0;
var damage = 0;
var numShifts = 0;
var penalty = 0.0;
var timeHandle = null;
var shiftHandle = null;
var shiftCombo = 0;
var shiftGrid = 1;
var chainReactionSpeed = (isFinite(getStorage("chainSpeed")) ? parseInt(getStorage("chainSpeed")) : 50);

const defaultModule = "wrapsweeper";

window.onload = setupGame;

// Tile Object
function playtile() {
	this.isMine = false;
	this.revealed = false;
	this.flagged = false;
	this.chained = false;
	this.delayChain = false;
	this.clue = 0;
	
	this.resetTile = function() {
		this.isMine = false;
		this.revealed = false;
		this.flagged = false;
		this.chained = false;
		this.delayChain = false;
		this.clue = 0;
	}
	
	this.flagTile = function() {
		if (!this.revealed) {
			this.flagged = !this.flagged;
		}
	}

	this.revealTile = function() {
		if (!this.flagged) {
			this.revealed = true;
		}
	}
}

//Register events
function addEvent(object, evName, fnName, cap) {
	try {
		if (object.addEventListener) {
			 object.addEventListener(evName, fnName, cap);
			 /*
		} else if (object.attachEvent) {
			 object.attachEvent("on" + evName, fnName);
			 */
		} else {
			if (evName = "click") {
				object.onclick = fnName;
			}
		}
	} catch(err) {
		throwError(err);
	}
}

function setupGame() {
	var gameBoard, trFrag, tdFrag;
	gameBoard = document.getElementById("gameboard");
	
	if (typeof gameModule === "undefined") {
		gameModule = defaultModule;
	}
	
	if (gameModule == "prismsweeper") {
		totalWidth = 2*boardLength + 2*boardHeight;
		totalHeight = boardWidth + 2*boardHeight;

		//Top border
		trFrag = document.createElement("tr");

		//Empty space
		tdFrag = document.createElement("td");
		tdFrag.rowSpan = boardHeight+1;
		tdFrag.colSpan = boardHeight+1;
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "border corTL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&uArr;";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "border corTR";
		trFrag.appendChild(tdFrag);

		gameBoard.appendChild(trFrag);
		
		// Top Board
		for (y = 0; y < boardHeight; y++) {
			trFrag = document.createElement("tr");
			
			for (x = boardHeight; x < boardHeight + boardLength; x++) {
				if (x == boardHeight && y == 0) {
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR";
					tdFrag.innerHTML = "&lArr;";
					trFrag.appendChild(tdFrag);
				}

				tdFrag = document.createElement("td");
				tdFrag.className = "tile";
				tdFrag.id = "x"+x+"y"+y;
				addEvent(tdFrag, "click", touchTile, false);
				trFrag.appendChild(tdFrag);

				if (x == boardHeight + boardLength - 1 && y == 0) {
					//Right border
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR";
					tdFrag.innerHTML = "&rArr;";
					trFrag.appendChild(tdFrag);
				}
			}
			gameBoard.appendChild(trFrag);
		}
		
		// Mid-Top Border
		trFrag = document.createElement("tr");
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border corTL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardHeight;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&uArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border cross";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border cross";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardHeight;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&uArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border junT";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&uArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border corTR";
		trFrag.appendChild(tdFrag);
		
		gameBoard.appendChild(trFrag);
		
		// Central Board
		for (y = boardHeight; y < boardWidth+boardHeight; y++) {
			trFrag = document.createElement("tr");
			
			for (x = 0; x < totalWidth; x++) {
				if ((x == 0 || x == boardHeight || x == boardLength+boardHeight || x == boardLength+boardHeight*2) && y == boardHeight) {
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardWidth;
					tdFrag.className = "border sideLR";
					if (x == 0) {
						tdFrag.innerHTML = "&lArr;";
					}
					trFrag.appendChild(tdFrag);
				}
				
				if (y == boardHeight) {
					minefield[x] = new Array();
				}

				tdFrag = document.createElement("td");
				tdFrag.className = "tile";
				tdFrag.id = "x"+x+"y"+y;
				addEvent(tdFrag, "click", touchTile, false);
				trFrag.appendChild(tdFrag);

				if (x == totalWidth - 1 && y == boardHeight) {
					//Right border
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardWidth;
					tdFrag.className = "border sideLR";
					tdFrag.innerHTML = "&rArr;";
					trFrag.appendChild(tdFrag);
				}
			}
			gameBoard.appendChild(trFrag);
		}

		minefield[totalWidth] = new Array();
		
		// Mid-Bot Border
		trFrag = document.createElement("tr");
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border corBL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardHeight;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&dArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border cross";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border cross";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardHeight;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&dArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border junB";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&dArr;";
		trFrag.appendChild(tdFrag);
		
		tdFrag = document.createElement("td");
		tdFrag.className = "border corBR";
		trFrag.appendChild(tdFrag);
		
		gameBoard.appendChild(trFrag);
		
		// Bottom Board
		for (y = boardWidth+boardHeight; y < totalHeight; y++) {
			trFrag = document.createElement("tr");
			
			if (y == boardWidth+boardHeight) {
				//More empty space
				tdFrag = document.createElement("td");
				tdFrag.rowSpan = boardHeight+1;
				tdFrag.colSpan = boardHeight+1;
				trFrag.appendChild(tdFrag);
			}
			
			for (x = boardHeight; x < boardHeight + boardLength; x++) {
				if (x == boardHeight && y == boardWidth+boardHeight) {
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR";
					tdFrag.innerHTML = "&lArr;";
					trFrag.appendChild(tdFrag);
				}

				tdFrag = document.createElement("td");
				tdFrag.className = "tile";
				tdFrag.id = "x"+x+"y"+y;
				addEvent(tdFrag, "click", touchTile, false);
				trFrag.appendChild(tdFrag);

				if (x == boardHeight + boardLength - 1 && y == boardWidth+boardHeight) {
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR";
					tdFrag.innerHTML = "&rArr;";
					trFrag.appendChild(tdFrag);
				}
			}
			gameBoard.appendChild(trFrag);
		}

		// Bottom border
		trFrag = document.createElement("tr");

		tdFrag = document.createElement("td");
		tdFrag.className = "border corBL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardLength;
		tdFrag.className = "border sideTB";
		tdFrag.innerHTML = "&dArr;";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "border corBR";
		trFrag.appendChild(tdFrag);

		gameBoard.appendChild(trFrag);
		
	} else {
		totalWidth = boardWidth;
		totalHeight = boardHeight;
		
		//Top border
		trFrag = document.createElement("tr");

		tdFrag = document.createElement("td");
		tdFrag.className = "border corTL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardWidth;
		tdFrag.className = "border sideTB";
		tdFrag.id = "borderTop";
		if (gameModule != "earthsweeper") {
			tdFrag.className = tdFrag.className + " edge";
			addEvent(tdFrag, "mousedown", startShifting, false);
			addEvent(tdFrag, "mouseup", stopShifting, false);
			addEvent(tdFrag, "mouseout", stopShifting, false);
			tdFrag.innerHTML = "&uArr;";
		}
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "border corTR";
		trFrag.appendChild(tdFrag);

		gameBoard.appendChild(trFrag);
		
		// Game board
		for (y = 0; y < boardHeight; y++) {
			trFrag = document.createElement("tr");
			
			for (x = 0; x < boardWidth; x++) {
				if (x == 0 && y == 0) {
					//Left border
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR edge";
					tdFrag.id = "borderLeft";
					addEvent(tdFrag, "mousedown", startShifting, false);
					addEvent(tdFrag, "mouseup", stopShifting, false);
					addEvent(tdFrag, "mouseout", stopShifting, false);
					tdFrag.innerHTML = "&lArr;";
					trFrag.appendChild(tdFrag);
				}
				
				if (y == 0) {
					minefield[x] = new Array();
				}

				tdFrag = document.createElement("td");
				tdFrag.className = "tile";
				tdFrag.id = "x"+x+"y"+y;
				addEvent(tdFrag, "click", touchTile, false);
				trFrag.appendChild(tdFrag);

				if (x == boardWidth - 1 && y == 0) {
					//Right border
					tdFrag = document.createElement("td");
					tdFrag.rowSpan = boardHeight;
					tdFrag.className = "border sideLR edge";
					tdFrag.id = "borderRight";
					addEvent(tdFrag, "mousedown", startShifting, false);
					addEvent(tdFrag, "mouseup", stopShifting, false);
					addEvent(tdFrag, "mouseout", stopShifting, false);
					tdFrag.innerHTML = "&rArr;";
					trFrag.appendChild(tdFrag);
				}
			}
			gameBoard.appendChild(trFrag);
		}
		minefield[boardWidth] = new Array();
		
		//Bottom border
		trFrag = document.createElement("tr");

		tdFrag = document.createElement("td");
		tdFrag.className = "border corBL";
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.colSpan = boardWidth;
		tdFrag.id = "borderBottom";
		tdFrag.className = "border sideTB";
		if (gameModule != "earthsweeper") {
			tdFrag.className = tdFrag.className + " edge";	
			addEvent(tdFrag, "mousedown", startShifting, false);
			addEvent(tdFrag, "mouseup", stopShifting, false);
			addEvent(tdFrag, "mouseout", stopShifting, false);
			tdFrag.innerHTML = "&dArr;";
		}
		trFrag.appendChild(tdFrag);

		tdFrag = document.createElement("td");
		tdFrag.className = "border corBR";
		trFrag.appendChild(tdFrag);

		gameBoard.appendChild(trFrag);
	}
	
	if (gameModule == defaultModule) {
		if (boardWidth == 8 && boardHeight == 8 && boardMines == 10) {
			difficulty = 1;
		} else if (boardWidth == 16 && boardHeight == 16 && boardMines == 40) {
			difficulty = 2;
		} else if (boardWidth == 30 && boardHeight == 16 && boardMines == 99) {
			difficulty = 3;
		} else if (boardWidth == 40 && boardHeight == 24 && boardMines == 215) {
			difficulty = 4;
		}
	}
	forceOpening = (boardMines <= totalTiles-9);
	loadSoundEffects();
	newGame(true);
}

function newGame(newSession) {
	clearInterval(timeHandle);
	gameActive = false;
	gamePlayable = true;

	// Empty the board of mines
	for (var y = 0; y < totalHeight; y++) {
		for (var x = 0; x < totalWidth; x++) {
			if (newSession) {
				minefield[x][y] = new playtile();
			} else {
				minefield[x][y].resetTile();
			}
		}
	}
	
	gametime = 0.0;
	flags = boardMines;
	damage = 0;
	penalty = 0.0;
	numShifts = 0;
	shiftCombo = 1;
	safeLeft = totalTiles - boardMines;
	NFgame = true;

	// Create new mines
	plantMines(boardMines);
	
	document.getElementById("time").innerHTML = renderTime(0, false);
	if (newSession) {
		var hideRules = null;
		
		if (difficulty == 1) {
			toggleHelp();
		}
		
		if (gameModule == "prismsweeper") {
			updateStatus("Welcome to Prismsweeper.");
			window.title = "Play - Prismsweeper";
			hideRules = document.getElementById("wrapRules");
			
			var bannerObj = document.getElementById("bannerDynam");
			bannerObj.src = "../prismsweeper/banner.png";
		} else {
			updateStatus("Welcome to Wrapsweeper.");
			hideRules = document.getElementById("prismRules");
		}
		
		hideRules.style.display = "none";
	} else {
		updateStatus("Game started");
	}
	renderBoard();
}

function plantMines(mineCt) {
	var plantedSoFar = 0;
	
	while (plantedSoFar < mineCt) {
		var u = randomInt(0, totalWidth-1);
		var w = randomInt(0, totalHeight-1);
		
		var searchObj = document.getElementById("x"+u+"y"+w);
		
		if (searchObj && !minefield[u][w].isMine) {
			minefield[u][w].isMine = true;
			plantedSoFar++;
		}
	}
	
	for (var y = 0; y < totalHeight; y++) {
		for (var x = 0; x < totalWidth; x++) {
			minefield[x][y].clue = 0;
			if (!minefield[x][y].isMine) {
				minefield[x][y].clue = countMines(x,y);
			}
		}
	}
}

function randomInt(min, max) {
	return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function renderBoard() {
	var activeTile, clueFound, helpPanel;
	
	if (safeLeft <= 0 && gameActive) {
		endGame(true);
	} else if (mineCombo >= Math.max(Math.min(10,boardMines/2),1) && gameActive) {
		endGame(false);
	}
	
	for (var y = 0; y < totalHeight; y++) {
		for (var x = 0; x < totalWidth; x++) {
			minefield[x][y].delayChain = false;
			activeTile = document.getElementById("x"+x+"y"+y);
			if (activeTile) {
				activeTile.style.color = "";
				activeTile.innerHTML = "";
				activeTile.style.cursor = "";
				
				if (!minefield[x][y].revealed) {
					if (activeTile.className.endsWith("revealed mine")) {
						activeTile.className = activeTile.className.slice(0,-14);
					} else if (activeTile.className.endsWith("revealed")) {
						activeTile.className = activeTile.className.slice(0,-9);
					}
					if (minefield[x][y].flagged) {
						activeTile.innerHTML = "&#9873;";
						if (minefield[x][y].chained && !minefield[x][y].isMine) {
							activeTile.innerHTML = "&#10006;";
						}
					}
				} else {
					if (activeTile.className.endsWith("mine")) {
						activeTile.className = activeTile.className.slice(0,-5);
					}
					if (!activeTile.className.endsWith("revealed")) {
						activeTile.className = activeTile.className + " revealed";
					}
					clueFound = minefield[x][y].clue;
					if (minefield[x][y].isMine) {
						if (minefield[x][y].chained) {
							activeTile.style.color = "black";
						} else {
							activeTile.className = "tile revealed mine";
						}
						activeTile.innerHTML = "&#9883;";
						activeTile.style.cursor = "default";
					} else if (clueFound > 0) {
						activeTile.innerHTML = clueFound;
						switch (clueFound) {
							case 1:
								activeTile.style.color = "#0000FF";
								break;
							case 2:
								activeTile.style.color = "#00E800";
								break;
							case 3:
								activeTile.style.color = "#E80000";
								break;
							case 4:
								activeTile.style.color = "#0000C0";
								break;
							case 5:
								activeTile.style.color = "#C00000";
								break;
							case 6:
								activeTile.style.color = "#008080";
								break;
							case 7:
								activeTile.style.color = "#404040";
								break;
							case 8:
								activeTile.style.color = "#FFFFFF";
								break;
						}
					} else {
						activeTile.style.cursor = "default";
					}
				}
			}
		}
	}
	
	document.getElementById("flags").innerHTML = flags;
	document.getElementById("dmgpanel").style.visibility = (damage > 0 ? "" : "hidden");
	document.getElementById("damage").innerHTML = damage;
	document.getElementById("penalty").innerHTML = renderTime(penalty, false);
}

function incrementTimer() {
	gametime = (Date.now() - gameStart)/1000;
	document.getElementById("time").innerHTML = renderTime(gametime, false);
	autoReveal();
}

function countFlags(fx, fy) {
	var flagsFound = 0;
	var refS;
	var tilesChecked = [];
	
	for (var b = fy-1; b <= fy+1; b++) {
		for (var a = fx-1; a <= fx+1; a++) {
			if (!wrapTiles(fx,fy,a,b)) {
				continue;
			}
			
			//Disallow duplicate references
			refS = "x"+refX+"y"+refY;
			if (tilesChecked.includes(refS)) {
				continue;
			} else {
				tilesChecked.push(refS);
			}
			
			if (minefield[refX][refY].flagged || (minefield[refX][refY].isMine && minefield[refX][refY].revealed)) {
				flagsFound++;
			}
		}
	}
	
	return flagsFound;
}

function countMines(mx, my) {
	var minesFound = 0;
	var refS;
	var searchObj;
	var tilesChecked = ["x"+mx+"y"+my];
	
	for (var b = my-1; b <= my+1; b++) {
		for (var a = mx-1; a <= mx+1; a++) {
			if (!wrapTiles(mx,my,a,b)) {
				continue;
			}
			
			// Disallow duplicate references, and skip non-existent elements
			refS = "x"+refX+"y"+refY;
			searchObj = document.getElementById(refS);
			
			if (!searchObj || tilesChecked.includes(refS)) {
				continue;
			} else {
				tilesChecked.push(refS);
			}
			
			if (minefield[refX][refY].isMine) {
				minesFound++;
			}
		}
	}
	
	return minesFound;
}

function autoReveal() {
	var rerender = false;
	var refS;
	var searchObj;
	
	for (var ay = 0; ay < totalHeight; ay++) {
		for (var ax = 0; ax < totalWidth; ax++) {
			if (minefield[ax][ay].chained && !minefield[ax][ay].delayChain) {
				for (var d = ay-1; d <= ay+1; d++) {
					for (var c = ax-1; c <= ax+1; c++) {
						if (!wrapTiles(ax,ay,c,d)) {
							continue;
						}
						
						refS = "x"+refX+"y"+refY;
						searchObj = document.getElementById(refS);
						
						if (searchObj && !minefield[refX][refY].revealed) {
							touchTile(null,refX,refY);
							minefield[refX][refY].delayChain = true;
						}
					}
				}
				
				rerender = true;
				minefield[ax][ay].chained = false;
			}
		}
	}
	
	if (rerender) {
		renderBoard();
	}
}

function wrapTiles(bx, by, wx, wy) {
	refX = wx;
	refY = wy;
			
	if (gameModule == "prismsweeper") {
		if ((refX < 0 && (refY < boardHeight || refY >= boardHeight + boardWidth)) ||
			(refY < 0 && (refX < boardHeight || refX >= boardHeight + boardLength)) ||
			(refX >= totalWidth && (refY < boardHeight || refY >= boardHeight + boardWidth)) ||
			(refY >= totalHeight && (refX < boardHeight || refX >= boardHeight + boardLength))) {
			return false;
		} else {
			if (refX < boardHeight) {
				if (by < boardHeight) {
					refX = refY;
					refY = boardHeight;
				} else if (by >= boardHeight+boardWidth) {
					refX = boardHeight*2 + boardWidth - 1 - refY;
					refY = boardHeight+boardWidth-1;
				}
			} else if (refX >= boardHeight + boardLength) {
				if (by < boardHeight) {
					refX = boardHeight*2 + boardLength - 1 - refY;
					refY = boardHeight;
				} else if (by >= boardHeight+boardWidth) {
					refX = boardLength - 1 + refY - (boardWidth - 1);
					refY = boardHeight+boardWidth-1;
				}
			}
			
			if (refY < 0) {
				refX = totalWidth + boardHeight - refX - 1;
				refY = boardHeight;
			} else if (refY >= totalHeight) {
				refX = totalWidth + boardHeight - refX - 1;
				refY = boardHeight + boardWidth - 1;
			} else if (refY < boardHeight) {
				if (bx < boardHeight) {
					refY = refX;
					refX = boardHeight;
				} else if (bx >= boardHeight+boardLength) {
					if (bx < boardHeight*2+boardLength) {
						refY = boardHeight*2 + boardLength - 1 - refX;
						refX = boardHeight + boardLength - 1;
					} else {
						refX = totalWidth-1 + boardHeight - refX;
						refY = 0;
					}
				}
			} else if (refY >= boardHeight+boardWidth) {
				if (bx < boardHeight) {
					refY = totalHeight-1 - refX;
					refX = boardHeight;
				} else if (bx >= boardHeight+boardLength) {
					if (bx < boardHeight*2+boardLength) {
						refY = boardWidth - boardLength + refX;
						refX = boardHeight + boardLength - 1;
					} else {
						refX = totalWidth-1 + boardHeight - refX;
						refY = totalHeight-1;
					}
				}
			}
		}
		
		if (refY < 0 || refY >= totalHeight) {
			return false;
		}
	} else {
		//Wrap vertically only if the ruleset allows it
		if (gameModule == "earthsweeper") {
			if (refY < 0 || refY >= boardHeight) {
				return false;
			}
		} else {
			if (refY < 0) {
				refY = refY + boardHeight;
			}
			if (refY >= boardHeight) {
				refY = refY - boardHeight;
			}
		}
	}

	//Wrap horizontally as necessary
	if (refX < 0) {
		refX = refX + totalWidth;
	}
	if (refX >= totalWidth) {
		refX = refX - totalWidth;
	}
	
	return true;
}

function touchTile(event, ox, oy) {
	flagMode = document.getElementById("flagMode");
	var baseID = null;
	var x, y, rerollCt;
	var refS;
	var searchObj;
	
	if (gamePlayable) {
		if (ox === undefined || oy === undefined) {
			baseID = this.id;
			x = parseInt(baseID.substring(1,4));
			if (x < 10) {
				y = parseInt(baseID.substring(3,6));
			} else if (x < 100) {
				y = parseInt(baseID.substring(4,7));
			} else {
				y = parseInt(baseID.substring(5,8));
			}
		} else {
			x = ox;
			y = oy;
		}
		
		if (baseID && (flagMode.checked || (event && event.ctrlKey))) {
			minefield[x][y].flagTile();
			if (!minefield[x][y].revealed) {
				NFgame = false;
				playSound(flagSnd);
			}
			if (minefield[x][y].flagged) {
				flags--;
			} else if (!minefield[x][y].revealed) {
				flags++;
			}
		} else if (!minefield[x][y].flagged && !minefield[x][y].revealed) {
			if (!gameActive) {
				if (forceOpening) {
					while (minefield[x][y].isMine || minefield[x][y].clue > 0) {
						rerollCt = 0;
						for (var d = y-1; d <= y+1; d++) {
							for (var c = x-1; c <= x+1; c++) {
								if (!wrapTiles(x,y,c,d)) {
									continue;
								}
								
								refS = "x"+refX+"y"+refY;
								searchObj = document.getElementById(refS);
								
								if (searchObj && minefield[refX][refY].isMine) {
									rerollCt++
									minefield[refX][refY].isMine = false;
								}
							}
						}
						
						plantMines(rerollCt);
					}
				} else {
					while (minefield[x][y].isMine) {
						minefield[x][y].isMine = false;
						plantMines(1);
					}
				}
				
				gameActive = true;
				gameStart = Date.now();
				timeHandle = setInterval(incrementTimer, Math.max(chainReactionSpeed,1));
			}
			
			minefield[x][y].revealTile();
			if (minefield[x][y].isMine) {
				playSound(detonateSnd);
				var dmgTaken = Math.max(6,safeLeft * 0.1);
				damage++;
				flags--;
				mineCombo++;
				penalty = penalty + dmgTaken;
				if (mineCombo > 1) {
					updateStatus("Mine Combo "+mineCombo+"! That is a " +renderTime(dmgTaken,true)+ " penalty!");
				} else {
					updateStatus("Boom! That is a " +renderTime(dmgTaken,true)+ " penalty!");
				}
			} else {
				playSound(uncoverTile);
				if (baseID) {
					mineCombo = 0;
				}
				safeLeft--;
				if (minefield[x][y].clue == 0) {
					minefield[x][y].chained = true;
				}
				if (mineCombo <= 0) {
					updateStatus("&nbsp;");
				}
			}
		} else if (baseID && minefield[x][y].revealed && !minefield[x][y].isMine && !NFgame) {
			oldMineCombo = mineCombo;
			numTiles = chordTile(x,y);
			if (numTiles > 0 && oldMineCombo == mineCombo) {
				mineCombo = 0;
				updateStatus("&nbsp;");
			}
		}

		if (baseID) {
			renderBoard();
		}
	}
}

function chordTile(cx, cy) {
	var newTiles = 0;
	var refS;
	var searchObj;
	
	if (countFlags(cx, cy) == minefield[cx][cy].clue) {
		for (var y = cy-1; y <= cy+1; y++) {
			for (var x = cx-1; x <= cx+1; x++) {
				if (!wrapTiles(cx,cy,x,y)) {
					continue;
				}
				
				refS = "x"+refX+"y"+refY;
				searchObj = document.getElementById(refS);
				
				if (searchObj && !minefield[refX][refY].revealed) {
					newTiles++;
					touchTile(null, refX, refY);
				}
			}
		}
	}
	
	return newTiles;
}

//Updates the app status bar
function appendStatus(newMessage) {
	var statusBar = document.getElementById("statusBar");
	var oldMessage = statusBar.innerHTML;
	
	statusBar.innerHTML = oldMessage + newMessage;
}

//Updates the app status bar
function updateStatus(newMessage) {
	var statusBar = document.getElementById("statusBar");
	
	statusBar.innerHTML = newMessage;
}

function renderTime(amt, dispFrac) {
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

function endGame(gameWon) {
	gameEnd = Date.now();
	gametime = (gameEnd - gameStart)/1000;
	clearInterval(timeHandle);
	gameActive = false;
	gamePlayable = false;
	if (gameWon) {
		playSound(gameWonSnd);
		flags = 0;
		
		for (y = 0; y < totalHeight; y++) {
			for (x = 0; x < totalWidth; x++) {
				searchObj = document.getElementById("x"+x+"y"+y);
				
				if (searchObj && !minefield[x][y].revealed && !minefield[x][y].flagged) {
					minefield[x][y].flagTile();
				}
			}
		}
		
		if (damage > 0) {
			gametime = gametime + penalty;
			updateStatus("Finished in " +renderTime(gametime,true)+ "... including a " +renderTime(penalty,true)+ " time penalty for hitting mines.");
		} else {
			updateStatus("Success! You finished in " +renderTime(gametime,true)+ ".");
		}
		exportGame();
	} else {
		playSound(gameLostSnd);
		for (y = 0; y < totalHeight; y++) {
			for (x = 0; x < totalWidth; x++) {
				searchObj = document.getElementById("x"+x+"y"+y);
				
				if (searchObj) {
					if (!minefield[x][y].revealed && minefield[x][y].isMine) {
						minefield[x][y].revealTile();
						minefield[x][y].chained = true;
					} else if (minefield[x][y].flagged && !minefield[x][y].isMine) {
						minefield[x][y].chained = true;
					}
				}
			}
		}
		
		updateStatus("Failure! You detonated too many mines in sequence.")
	}
	renderBoard();
}

function exportGame() {
	if (enableAjax) {
		if (difficulty > 0) {
			var converyNFflag = (NFgame ? 1 : 0);
			
			if (window.XMLHttpRequest) {
				//Code for modern browsers
				logRequest = new XMLHttpRequest();
			} else {
				//Legacy code, for ancient IE versions 5 and 6
				logRequest = new ActiveXObject("Microsoft.XMLHTTP");
			}

			logRequest.open("POST","logGame.php",true);
			logRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			logRequest.send("difficulty=" + difficulty + "&time=" + gametime + "&nf=" + converyNFflag + "&damage=" + damage + "&shifts=" + numShifts);
			
			logRequest.onreadystatechange = function() {
				if (logRequest.readyState === 4) {
					if (logRequest.status==200) {
						appendStatus("<br />"+logRequest.responseText);
					} else {
						appendStatus("<br /><span style=\"color: rgb(255,128,0); font-weight: bold;\">Error</span>: "+logRequest.status);
					}
				}
			}
		} else {
			appendStatus("<br />Custom games are unranked. Thanks for playing.");
		}
	}
}

// Shifting cells
function startShifting() {
	if (shiftHandle != null) {
		clearInterval(shiftHandle);
	}
	var func = null;
	switch (this.id) {
		case "borderLeft":
			func = shiftCellsLeft;
			break;
		case "borderBottom":
			func = shiftCellsDown;
			break;
		case "borderTop":
			func = shiftCellsUp;
			break;
		case "borderRight":
			func = shiftCellsRight;
			break;
	}
	
	shiftCombo = -1;
	shiftHandle = setInterval(func, 100);
}

function stopShifting() {
	var func = null;
	switch (this.id) {
		case "borderLeft":
			func = shiftCellsLeft;
			break;
		case "borderBottom":
			func = shiftCellsDown;
			break;
		case "borderTop":
			func = shiftCellsUp;
			break;
		case "borderRight":
			func = shiftCellsRight;
			break;
	}
	
	clearInterval(shiftHandle);
	if (shiftCombo <= 0) {
		shiftCombo = 1;
		setTimeout(func, 1);
	}
}

function shiftCellsLeft(event) {
	if (shiftCombo++ >= 0) {
		for (times = 0; times < shiftGrid; times++) {
			for (sy = 0; sy < boardHeight; sy++) {
				for (sx = boardWidth; sx > 0; sx--) {
					minefield[sx][sy] = minefield[sx-1][sy];
				}
			}

			for (py = 0; py < boardHeight; py++) {
				minefield[0][py] = minefield[boardWidth][py];
			}
		}
		
		if (gameActive) {
			numShifts++;
		}
	}
	renderBoard();
}

function shiftCellsDown(event) {
	if (shiftCombo++ >= 0) {
		for (times = 0; times < shiftGrid; times++) {
			for (px = 0; px < boardWidth; px++) {
				minefield[px][boardHeight] = minefield[px][0];
			}
			
			for (sy = 0; sy < boardHeight; sy++) {
				for (sx = 0; sx < boardWidth; sx++) {
					minefield[sx][sy] = minefield[sx][sy+1];
				}
			}
		}
		
		if (gameActive) {
			numShifts++;
		}
	}
	renderBoard();
}

function shiftCellsUp(event) {
	if (shiftCombo++ >= 0) {
		for (times = 0; times < shiftGrid; times++) {
			for (sy = boardHeight; sy > 0; sy--) {
				for (sx = 0; sx < boardWidth; sx++) {
					minefield[sx][sy] = minefield[sx][sy-1];
				}
			}

			for (px = 0; px < boardWidth; px++) {
				minefield[px][0] = minefield[px][boardHeight];
			}
		}
		
		if (gameActive) {
			numShifts++;
		}
	}
	renderBoard();
}

function shiftCellsRight(event) {
	if (shiftCombo++ >= 0) {
		for (times = 0; times < shiftGrid; times++) {
			for (py = 0; py < boardHeight; py++) {
				minefield[boardWidth][py] = minefield[0][py];
			}
			
			for (sy = 0; sy < boardHeight; sy++) {
				for (sx = 0; sx < boardWidth; sx++) {
					minefield[sx][sy] = minefield[sx+1][sy];
				}
			}
		}
		
		if (gameActive) {
			numShifts++;
		}
	}
	renderBoard();
}

function toggleHelp() {
	var helpPanel = document.getElementById("helpPanel");
	var helpButton = document.getElementById("helpButton");

	if (helpPanel.style.display == "block") {
		helpPanel.style.display = "none";
	} else {
		helpPanel.style.display = "block";
	}
}

function playSound(playObj) {
	if (playObj !== undefined) {
		playObj.play();
	}
}

function loadSoundEffects() {
	uncoverTile = new sound("reveal.wav");
	flagSnd = new sound("flag.wav");
	detonateSnd = new sound("mine.wav");
	
	gameWonSnd = new sound("gameWon.wav");
	gameLostSnd = new sound("gameLost.wav");
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
