var difficulty = 0;
var minefield = new Array();
var enableAjax = false;
var forceOpening = false;
var NFgame = false;

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
	
	for (y = 0; y < boardHeight; y++) {
		trFrag = document.createElement("tr");
		
		for (x = 0; x < boardWidth; x++) {
			if (y == 0) {
				minefield[x] = new Array();
			}

			tdFrag = document.createElement("td");
			tdFrag.className = "tile";
			tdFrag.id = "x"+x+"y"+y;
			addEvent(tdFrag, "click", touchTile, false);
			trFrag.appendChild(tdFrag);

		}
		gameBoard.appendChild(trFrag);
	}
	minefield[boardWidth] = new Array();
	document.getElementById("scoreboard").colSpan = boardWidth;
	
	if (boardWidth == 8 && boardHeight == 8 && boardMines == 10) {
		difficulty = 1;
	} else if (boardWidth == 16 && boardHeight == 16 && boardMines == 40) {
		difficulty = 2;
	} else if (boardWidth == 30 && boardHeight == 16 && boardMines == 99) {
		difficulty = 3;
	} else if (boardWidth == 40 && boardHeight == 24 && boardMines == 215) {
		difficulty = 4;
	}
	forceOpening = (boardMines <= boardWidth*boardHeight-9);
	loadSoundEffects();
	newGame(true);
}

function newGame(newSession) {
	clearInterval(timeHandle);
	gameActive = false;
	gamePlayable = true;

	// Empty the board of mines
	for (y = 0; y < boardHeight; y++) {
		for (x = 0; x < boardWidth; x++) {
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
	safeLeft = boardWidth * boardHeight - boardMines;
	NFgame = true;

	// Create new mines
	plantMines(boardMines);
	
	document.getElementById("time").innerHTML = renderTime(0, false);
	if (newSession) {
		if (difficulty == 1) {
			toggleHelp();
		}
		updateStatus("Welcome to Wrapsweeper.");
	} else {
		updateStatus("Game started");
	}
	renderBoard();
}

function plantMines(mineCt) {
	var plantedSoFar = 0;
	
	while (plantedSoFar < mineCt) {
		u = randomInt(0, boardWidth-1);
		w = randomInt(0, boardHeight-1);
		
		if (!minefield[u][w].isMine) {
			minefield[u][w].isMine = true;
			plantedSoFar++;
		}
	}
	
	for (ny = 0; ny < boardHeight; ny++) {
		for (nx = 0; nx < boardWidth; nx++) {
			minefield[nx][ny].clue = 0;
			if (!minefield[nx][ny].isMine) {
				minefield[nx][ny].clue = countMines(nx,ny);
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
	} else if (mineCombo >= Math.min(10,boardMines/2) && gameActive) {
		endGame(false);
	}
	
	for (y = 0; y < boardHeight; y++) {
		for (x = 0; x < boardWidth; x++) {
			minefield[x][y].delayChain = false;
			activeTile = document.getElementById("x"+x+"y"+y);
			activeTile.style.color = "";
			activeTile.innerHTML = "";
			activeTile.style.cursor = "";
			
			if (!minefield[x][y].revealed) {
				activeTile.className = "tile";
				if (minefield[x][y].flagged) {
					activeTile.innerHTML = "&#9873;";
					if (minefield[x][y].chained && !minefield[x][y].isMine) {
						activeTile.innerHTML = "&#10006;";
					}
				}
			} else {
				activeTile.className = "tile revealed";
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
							activeTile.style.color = "#00FF00";
							break;
						case 3:
							activeTile.style.color = "#FF0000";
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
	
	document.getElementById("flags").innerHTML = flags;
	document.getElementById("dmgpanel").style.visibility = (damage > 0 ? "" : "hidden");
	document.getElementById("damage").innerHTML = damage;
	document.getElementById("penalty").innerHTML = renderTime(penalty, false);
}

function incrementTimer() {
	gametime = gametime + 0.1;
	document.getElementById("time").innerHTML = renderTime(gametime, false);
	autoReveal();
}

function countFlags(fx, fy) {
	var refX, refY;
	var flagsFound = 0;
	
	for (b = fy-1; b <= fy+1; b++) {
		for (a = fx-1; a <= fx+1; a++) {
			refX = a;
			refY = b;
			
			//Wraparound as need be
			if (refX < 0) {
				refX = refX + boardWidth;
			}
			if (refX >= boardWidth) {
				refX = refX - boardWidth;
			}
			if (refY < 0) {
				refY = refY + boardHeight;
			}
			if (refY >= boardHeight) {
				refY = refY - boardHeight;
			}
			
			if (minefield[refX][refY].flagged || (minefield[refX][refY].isMine && minefield[refX][refY].revealed)) {
				flagsFound++;
			}
		}
	}
	
	return flagsFound;
}

function countMines(mx, my) {
	var refX, refY;
	var minesFound = 0;
	
	for (b = my-1; b <= my+1; b++) {
		for (a = mx-1; a <= mx+1; a++) {
			refX = a;
			refY = b;
			
			//Wraparound as need be
			if (refX < 0) {
				refX = refX + boardWidth;
			}
			if (refX >= boardWidth) {
				refX = refX - boardWidth;
			}
			if (refY < 0) {
				refY = refY + boardHeight;
			}
			if (refY >= boardHeight) {
				refY = refY - boardHeight;
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
	
	for (ay = 0; ay < boardHeight; ay++) {
		for (ax = 0; ax < boardWidth; ax++) {
			if (minefield[ax][ay].chained && !minefield[ax][ay].delayChain) {
				for (d = ay-1; d <= ay+1; d++) {
					for (c = ax-1; c <= ax+1; c++) {
						wrapX = c;
						wrapY = d;
						
						//Wraparound as need be
						if (wrapX < 0) {
							wrapX = wrapX + boardWidth;
						}
						if (wrapX >= boardWidth) {
							wrapX = wrapX - boardWidth;
						}
						if (wrapY < 0) {
							wrapY = wrapY + boardHeight;
						}
						if (wrapY >= boardHeight) {
							wrapY = wrapY - boardHeight;
						}
						
						if (!minefield[wrapX][wrapY].revealed) {
							touchTile(wrapX,wrapY);
							minefield[wrapX][wrapY].delayChain = true;
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

function touchTile(ox, oy) {
	flagMode = document.getElementById("flagMode");
	
	if (gamePlayable) {
		var baseID = null;
		var x, y, rerollCt;
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
						for (d = y-1; d <= y+1; d++) {
							for (c = x-1; c <= x+1; c++) {
								wrapX = c;
								wrapY = d;
								
								//Wraparound as need be
								if (wrapX < 0) {
									wrapX = wrapX + boardWidth;
								}
								if (wrapX >= boardWidth) {
									wrapX = wrapX - boardWidth;
								}
								if (wrapY < 0) {
									wrapY = wrapY + boardHeight;
								}
								if (wrapY >= boardHeight) {
									wrapY = wrapY - boardHeight;
								}
								
								if (minefield[wrapX][wrapY].isMine) {
									rerollCt++
									minefield[wrapX][wrapY].isMine = false;
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
				timeHandle = setInterval(incrementTimer, 100);
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
	
	if (countFlags(cx, cy) == minefield[cx][cy].clue) {
		for (qy = cy-1; qy <= cy+1; qy++) {
			for (qx = cx-1; qx <= cx+1; qx++) {
				choX = qx;
				choY = qy;
				
				//Wraparound as need be
				if (choX < 0) {
					choX = choX + boardWidth;
				}
				if (choX >= boardWidth) {
					choX = choX - boardWidth;
				}
				if (choY < 0) {
					choY = choY + boardHeight;
				}
				if (choY >= boardHeight) {
					choY = choY - boardHeight;
				}
				
				if (!minefield[choX][choY].revealed) {
					newTiles++;
					touchTile(choX, choY);
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
	fraction = Math.round(amt * 10) % 10;
	
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
		buildStr = buildStr+fraction;
	}
	
	return buildStr;
}

function endGame(gameWon) {
	clearInterval(timeHandle);
	gameActive = false;
	gamePlayable = false;
	if (gameWon) {
		playSound(gameWonSnd);
		flags = 0;
		
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x++) {
				if (!minefield[x][y].revealed && !minefield[x][y].flagged) {
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
		for (y = 0; y < boardHeight; y++) {
			for (x = 0; x < boardWidth; x++) {
				if (!minefield[x][y].revealed && minefield[x][y].isMine) {
					minefield[x][y].revealTile();
					minefield[x][y].chained = true;
				} else if (minefield[x][y].flagged && !minefield[x][y].isMine) {
					minefield[x][y].chained = true;
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
function shiftCellsLeft(event) {
	var numTms = 1;
	if (event && event.ctrlKey) {
		numTms = 5;
	}
	
	for (tm = 0; tm < numTms; tm++) {
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
	renderBoard();
}

function shiftCellsDown(event) {
	var numTms = 1;
	if (event && event.ctrlKey) {
		numTms = 5;
	}
	
	for (tm = 0; tm < numTms; tm++) {
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
	renderBoard();
}

function shiftCellsUp(event) {
	var numTms = 1;
	if (event && event.ctrlKey) {
		numTms = 5;
	}
	
	for (tm = 0; tm < numTms; tm++) {
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
	renderBoard();
}

function shiftCellsRight(event) {
	var numTms = 1;
	if (event && event.ctrlKey) {
		numTms = 5;
	}
	
	for (tm = 0; tm < numTms; tm++) {
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
	renderBoard();
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
		this.sound.play();
	}
	this.stop = function(){
		this.sound.pause();
	}
} 
