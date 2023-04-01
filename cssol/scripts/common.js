var inactiveReset = new Date();
var seedSlot = new Array(312);
var selectX, selectDepth, finishPtr, highestHeight, canFillColumn, seedPassword, oldPassword, cardsDealt;
var baseStatFile, passField, clockPtr, forceRender, rectangularTableau, divFrag;
const reserveStart = 50;
const COLUMN_WIDTH = 110;
const FANNING_X = 16;
var FANNING_Y = (isFinite(getCookie("pileDensity")) ? getCookie("pileDensity") : 30);
var abandonHandling = (isFinite(getCookie("abandonPrompt")) ? getCookie("abandonPrompt") : 1);
var facedownHints = (isFinite(getCookie("downturnHints")) ? getCookie("downturnHints") : 1);
var preferDeckId = (isFinite(getCookie("cardback")) ? getCookie("cardback") : -1);
var playSfx = (isFinite(getCookie("playSfx")) ? getCookie("playSfx") : 1);
var emptyAutoRefills = 0;
var playHeight = 500;
var wasteDealBy = 1;
var wasteFanned = false;
var pairingGame = false;
var golfGame = false;
var skipSounds = 0;
var shuffleID = Math.floor(Math.random()*4);
var scoringModel = "buildUpSuit";

var playDeck, searchElement, baseRank, finalRank, tableauWidth;
var wizardScoring = null;
var tableau = new Array(49);
var height = new Array(49);
var prevHeight = new Array(49);
var downturn = new Array(49);
var foundationPile = new Array(24);
var reserveSlot = new Array(48);
var stockPile = new Array(312);
forceRender = false;
rectangularTableau = true;
traditionalStock = true;
allowLogs = true;

for (var tab = 0; tab < 49; tab++) {
	tableau[tab] = new Array(312);
	downturn[tab] = 0;
}

function createDivFrag(newId, newX, newY, newZ) {
	divFrag = document.createElement("div");
	divFrag.id = newId;
	divFrag.title = "";
	divFrag.className = "invis";
	divFrag.style.left = newX+"px";
	divFrag.style.top = newY+"px";
	divFrag.style.cursor = "pointer";
	divFrag.style.zIndex = newZ;
	if (!newId.startsWith("stock") && !newId.startsWith("home")) {
		divFrag.draggable = "true";
	}
}

// Automate function registration based on ID
function autoAddEvents(activeObj) {
	var workId = activeObj.id;
	// Golf-type games are very simple to play, thus most functionality is omitted from them.
	
	if (workId.startsWith("home")) {
		addEvent(activeObj, "click", playFoundation, false);
		if (!golfGame) {
			addEvent(activeObj, "dragover", allowDrop, false);
			addEvent(activeObj, "drop", playFoundation, false);
		}
	} else if (workId.startsWith("open")) {
		if (golfGame) {
			addEvent(activeObj, "click", playCard, false);
		} else {
			addEvent(activeObj, "click", playReserve, false);
			addEvent(activeObj, "dragstart", playReserve, false);
			addEvent(activeObj, "dragover", allowDrop, false);
			addEvent(activeObj, "drop", playReserve, false);
			addEvent(activeObj, "mouseup", unmuteSfx, false);
		}
	} else if (workId.startsWith("stock")) {
		addEvent(activeObj, "click", dealStock, false);
	} else if (workId.startsWith("waste")) {
		// Waste piles are complex. They get extra functionality in pairing games
		if (golfGame) {
			activeObj.draggable = "false";
			activeObj.style.cursor = "";
		} else {
			addEvent(activeObj, "click", playWaste, false);
			addEvent(activeObj, "dragstart", playWaste, false);
			if (pairingGame) {
				addEvent(divFrag, "dragover", allowDrop, false);
				addEvent(divFrag, "drop", playWaste, false);
			}
		}
	} else {
		addEvent(activeObj, "click", playCard, false);
		if (!golfGame) {
			addEvent(activeObj, "dragstart", playCard, false);
			addEvent(activeObj, "dragover", allowDrop, false);
			addEvent(activeObj, "drop", playCard, false);
			addEvent(activeObj, "mouseup", unmuteSfx, false);
		}
	}
}

function confirmLeave(event, leaveMsg) {
	if (leaveMsg == null || leaveMsg == "") {
		dispMessage = "You will abandon an unfinished game.";
	} else {
		dispMessage = leaveMsg;
	}
	
	if (solGame.gameActive && solGame.totalMoves > 0 &&
		(abandonHandling < 2 || (abandonHandling < 3 && solGame.recordWin == true))) {
		event.returnValue = dispMessage;
	}
}

function allowDrop(event) {
	event.preventDefault();
}

function exportLog(gameWon) {
	// Dummy function; kept for compatibility
}

//Records move
function incrementMove() {
	if (solGame.recordPlay) {
		solGame.recordPlay = false;
		exportLog(0);
	}
	if (!clockPtr) {
		clockPtr = setInterval(function(){incrementSecond()},1000);
	}
	solGame.totalMoves++;
}

//Tracks time
function incrementSecond() {
	if (solGame.gameActive) {
		solGame.dealTime++;
	}
}

//Resets internal data
function resetInternals() {
	var scoreIndi;

	if (clockPtr) {
		clearInterval(clockPtr);
		clockPtr = null;
	}
	
	solGame.totalMoves = 0;
	solGame.gameActive = true;
	solGame.recordPlay = (baseStatFile != "wizard");
	solGame.recordWin = solGame.recordPlay;
	solGame.casualScore = 0;
	solGame.dealTime = 0;
	
	scoreIndi = document.getElementById("casualScore");
	if (scoreIndi) {
		document.getElementById("casualScore").innerHTML = solGame.casualScore;
	}
	
	selectX = -1;
}

//Restarts game
function restartGame(penalize) {
	var preserveWin, gameTime;

	//Records eligibility to win and game time
	preserveWin = solGame.recordWin;
	gameTime = solGame.dealTime;
	
	//Ask if necessary
	if (solGame.gameActive && solGame.totalMoves > 0 && !penalize && confirm("Confirm game restart?")) {
		solGame.gameActive = false;
	}
	
	//Restarts a game using the same seed
	if (!solGame.gameActive || penalize || solGame.totalMoves == 0) {
		newGame(false,false);
	}
	
	if (solGame.totalMoves == 0) {
		solGame.recordWin = preserveWin;
		solGame.dealTime = gameTime;
		updateStatus("Restart successful");
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

//Handle card selection

function selectCard(object) {
	newClasses = object.className;
	if (!object.className.endsWith("cardSelected")) {
		newClasses = object.className + " cardSelected";
	}
	applyClasses(object,newClasses);
	if (!skipSounds && !finishPtr) {
		playSound(cardUp);
	}
}

function deselectCard(object) {
	newClasses = object.className;
	if (object.className.endsWith("cardSelected")) {
		newClasses = object.className.slice(0, -13);
	}
	applyClasses(object,newClasses);
	if (!skipSounds && !finishPtr) {
		playSound(cardDown);
	}
}

function deselectAll() {
	var divElements = document.getElementsByTagName("div");
	selectX = -1;
	selectDepth = 0;

	for (d in divElements) {
		if (typeof divElements[d].className !== "undefined" && divElements[d].className.endsWith("cardSelected")) {
			deselectCard(divElements[d]);
		}
	}
	if (skipSounds == 2) {
		skipSounds = 0;
	}
}

function unmuteSfx() {
	skipSounds = 0;
}

function applyClasses(object, newClasses) {
	object.className = newClasses;
}

function setOpacity(object, value) {
	// Apply the opacity value for IE and non-IE browsers
	object.style.filter = "alpha(opacity = " + value + ")";
	object.style.opacity = value/100;
}

function cardsConnected(cardBottom, cardTop) {
	var rankValue = new Array(2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 1);
	
	if (solGame.spiderCon == "downSuit") {
		return (getSuit(cardBottom) == getSuit(cardTop) && rankValue[getRank(cardTop)] == rankValue[getRank(cardBottom)] + 1);
	} else if (solGame.spiderCon == "downDiffSuit") {
		return (getSuit(cardBottom) != getSuit(cardTop) && rankValue[getRank(cardTop)] == rankValue[getRank(cardBottom)] + 1);
	} else if (solGame.spiderCon == "downColor") {
		return (getColor(cardBottom) == getColor(cardTop) && rankValue[getRank(cardTop)] == rankValue[getRank(cardBottom)] + 1);
	} else if (solGame.spiderCon == "downColorAlt") {
		return (getColor(cardBottom) != getColor(cardTop) && rankValue[getRank(cardTop)] == rankValue[getRank(cardBottom)] + 1);
	} else if (solGame.spiderCon == "downAnySuit") {
		return (rankValue[getRank(cardTop)] == rankValue[getRank(cardBottom)] + 1);
	}
	return false;
}

//Renders the entire play area
function renderPlayarea() {
	try {
		var newImage, newInner, newTitle, newCard;
		var spiderScore = 0;
		var spiderCombo = 0;
		var baseTopPos = 0;
		var baseLeftPos = 0;
		newCard = null;
		skipSounds = 1;
		
		//Auto-refill empty tableau piles
		if (emptyAutoRefills > 0 && (solGame.stockRemain > 0 || solGame.wasteSize >= 0)) {
			for (x = 0; x < 49; x++) {
				searchElement = document.getElementById("x"+x+"y0");
				if (searchElement && !tableau[x][0]) {
					for (i = 0; i < emptyAutoRefills; i++) {
						if (solGame.stockRemain > 0) {
							if (solGame.wasteSize < 0) {
								newCard = quickDealStock();
							}
							
							if (newCard) {
								tableau[x][i] = newCard;
							} else if (solGame.wasteSize >= 0) {
								tableau[x][i] = stockPile[solGame.wasteSize];
								deleteEntry();
								incrementMove();
							}
						} else if (solGame.wasteSize >= 0) {
							tableau[x][i] = stockPile[solGame.wasteSize];
							deleteEntry();
							incrementMove();
						}
					}
				}
			}
		}

		//Tableau
		for (x = 0; x < 49; x++) {
			for (y = 0; y < 312; y++) {
				if (y == 0) {
					prevHeight[x] = height[x];

					if (spiderCombo > 0 && spiderCombo < 12) {
						spiderScore--;
					}
					spiderCombo = 0;
				}
				
				searchElement = document.getElementById("x"+x+"y"+y);
				if (searchElement && (y <= height[x] + 2 || y <= prevHeight[x] + 2 ||
					y == 0 || tableau[x][y] || !rectangularTableau)) {
					if (tableau[x][y]) {
						renderDiv(searchElement,"play" + (tableau[x][y].deckID % 6));
						
						if (y < downturn[x]) {
							newInner = "";
							newTitle = "Face-down card";
							if ((y + 1 == downturn[x] && facedownHints == 2) || facedownHints > 2) {
								newTitle = "(" + tableau[x][y].nameParse() + ")";
							}
						} else {
							newInner = tableau[x][y].innerCode();
							newTitle = tableau[x][y].nameParse();
							
							if ((y == 0 && tableau[x][y].rank == "King") || (y > 0 && y > downturn[x] && cardsConnected(tableau[x][y],tableau[x][y-1]))) {
								spiderScore++;
								spiderCombo++;
							} else {
								if (spiderCombo > 0 && spiderCombo < 12) {
									spiderScore--;
								}
								spiderCombo = 0;
							}
						}
					} else {
						newInner = "";
						
						if (spiderCombo > 0 && spiderCombo < 12) {
							spiderScore--;
						}
						spiderCombo = 0;
						
						if (y == 0) {
							renderDiv(searchElement,"empty");
							newTitle = "Empty tableau pile";
							
							height[x] = -1;
						} else {
							renderDiv(searchElement,"invis");
							newTitle = "";

							if (tableau[x][y-1]) {
								height[x] = y - 1;
							}
						}
					}
					
					if (newInner != searchElement.innerHTML || forceRender) {
						searchElement.innerHTML = newInner;
					}
					searchElement.title = newTitle;
				} else {
					if (tableau[x][y-1]) {
						height[x] = y - 1;
					}
				}
			}
		}
		
		if (rectangularTableau) {
			//Reveal unobstructed downturned cards for rectangular tableaux
			for (var x = 0; x < 49; x++) {
				if (height[x] + 1 == downturn[x] && downturn[x] > 0) {
					downturn[x]--;
					var deltaY = height[x] - 1;
					
					searchElement = document.getElementById("x"+x+"y"+height[x]);
					newInner = tableau[x][height[x]].innerCode();
					newTitle = tableau[x][height[x]].nameParse();
						
					if (newInner != searchElement.innerHTML || forceRender) {
						searchElement.innerHTML = newInner;
						searchElement.title = newTitle;
					}
					
					if (deltaY >= 0 && facedownHints >= 2) {
						searchElement = document.getElementById("x"+x+"y"+deltaY);
						searchElement.title = "(" + tableau[x][deltaY].nameParse() + ")";
					}
				}
			}
		}
		
		//Foundation piles
		for (i = 0; i < 24; i++) {
			searchElement = document.getElementById("home"+i);
			
			if (searchElement) {
				if (foundationPile[i]) {
					newInner = foundationPile[i].innerCode();
					newTitle = foundationPile[i].nameParse();
					renderDiv(searchElement,"card");

					spiderScore = spiderScore + 13;
				} else {
					newInner = emptyFoundationSlot();
					newTitle = "Empty Foundation Pile";
					renderDiv(searchElement,"empty");
				}
				
				if (newInner != searchElement.innerHTML || forceRender) {
					searchElement.innerHTML = newInner;
					searchElement.title = newTitle;
				}
			} else {
				break;
			}
		}
		
		//Reserve pool
		for (i = 0; i < 48; i++) {
			searchElement = document.getElementById("open"+i);
			
			if (searchElement) {
				if (reserveSlot[i]) {
					newInner = reserveSlot[i].innerCode();
					newTitle = reserveSlot[i].nameParse();
					renderDiv(searchElement, "card");
					
				} else {
					newInner = "";
					newTitle = "Empty Reserve Slot";
					
					if (reserveReusable > i) {
						renderDiv(searchElement, "empty");
					} else {
						renderDiv(searchElement, "invis");
					}
				}
				
				if (newInner != searchElement.innerHTML || forceRender) {
					searchElement.innerHTML = newInner;
					searchElement.title = newTitle;
				}
			} else {
				break;
			}
		}
		
		//Stock pile
		for (var i = 0; i < 104; i++) {
			searchElement = document.getElementById("stock"+i);
			
			if (searchElement) {
				if (solGame.stockRemain > 3*i) {
					var checkWaste = document.getElementById("waste0");
					var backID = 0;
					
					if (checkWaste && traditionalStock) {
						backID = stockPile[solGame.wasteSize+1].deckID % 6;
					} else {
						var nextCard = checkNextCard();
						backID = nextCard.deckID % 6;
					}
					
					if (solGame.stockRemain > 3*(i+1)) {
						renderDiv(searchElement,"playStack");
					} else {
						renderDiv(searchElement,"play" + backID);
					}
					
					if (i == 0) {
						searchElement.innerHTML = "";
					}
				} else {
					if (i == 0) {
						renderDiv(searchElement,"empty");
						searchElement.innerHTML = emptyStockPile();
					} else {
						renderDiv(searchElement,"invis");
					}
				}
				
				var tooltip = "Stock: " + solGame.stockRemain;
				if (solGame.redeals == Infinity) {
					tooltip += " \nRedeals: Endless";
				} else {
					tooltip += " \nRedeals: " + solGame.redeals;
				}
				searchElement.title = tooltip;
			} else {
				break;
			}
		}
		
		//Waste pile
		for (var i = 0; i < 312; i++) {
			searchElement = document.getElementById("waste"+i);
			if (searchElement) {
				if (!wasteFanned) {
					if (i == 0) {
						baseLeftPos = parseInt(searchElement.style.left.substr(0,searchElement.style.left.length - 2));
						baseTopPos = parseInt(searchElement.style.top.substr(0,searchElement.style.top.length - 2));
						
						leftPos = baseLeftPos;
						topPos = baseTopPos;
					} else {
						if (wasteDealBy > 1 && i >= solGame.wasteSize - (wasteDealBy - 1) && i <= solGame.wasteSize) {
							fanStack = Math.min(wasteDealBy - 1,solGame.wasteSize) + (i - solGame.wasteSize);
							push = FANNING_X * fanStack;
							
							if (fanStack <= 0) {
								leftPos = baseLeftPos + Math.floor(i/3);
								topPos = baseTopPos + Math.floor(i/3);
							} else {
								leftPos = baseLeftPos + Math.floor((i-fanStack)/3) + push;
								topPos = baseTopPos + Math.floor((i-fanStack)/3);
							}
						} else {
							leftPos = baseLeftPos + Math.floor(i/3);
							topPos = baseTopPos + Math.floor(i/3);
						}
					}
	
					searchElement.style.left = leftPos+"px";
					searchElement.style.top = topPos+"px";
				}
				
				if (solGame.wasteSize >= i) {
					renderDiv(searchElement,"card");
					newInner = stockPile[i].innerCode();
					newTitle = stockPile[i].nameParse();
				} else if (i == 0 && golfGame) {
					renderDiv(searchElement,"empty");
					newInner = emptyFoundationSlot();
					newTitle = "Empty foundation pile";
				} else {
					renderDiv(searchElement,"invis");
					newInner = "";
					newTitle = "";
				}
				
				if (newInner != searchElement.innerHTML || forceRender) {
					searchElement.innerHTML = newInner;
					searchElement.title = newTitle;
				}
			} else {
				break;
			}
		}

		//Apply Spider Scoring, if appropriate
		if (solGame.spiderCon) {
			solGame.casualScore = spiderScore;
		}

		searchElement = document.getElementById("casualScore");
		if (searchElement) {
			searchElement.innerHTML = solGame.casualScore;
		}
		searchElement = document.getElementById("moneyScore");
		if (searchElement) {
			searchElement.innerHTML = solGame.moneyScore;
		}
		deselectAll();
		forceRender = false;
		updateStatus("&emsp;");

	} catch(err) {
		throwError(err);
	} finally {
		skipSounds = 0;
	}
}

function renderDiv(workObj, newClass) {
	switch (newClass) {
		case "invis":
			newClasses = "invis";
			break;
		case "empty":
			newClasses = "empty";
			break;
		case "empty hilight":
			newClasses = "empty cardSelected";
			break;
		case "playStack":
			newClasses = "card backstack";
			break;
		case "play0":
			newClasses = "card back0";
			break;
		case "play1":
			newClasses = "card back1";
			break;
		case "play2":
			newClasses = "card back2";
			break;
		case "play3":
			newClasses = "card back3";
			break;
		case "play4":
			newClasses = "card back4";
			break;
		case "play5":
			newClasses = "card back5";
			break;
		default:
			newClasses = "card";
			break;
	}
	
	applyClasses(workObj,newClasses);
}

function emptyFoundationSlot() {
	return "<div>\n" +
		"<div class=\"spotA1\">&spades;</div>\n" + 
		"<div class=\"spotA5\">&hearts;</div>\n" + 
		"<div class=\"spotC1\">&diams;</div>\n" + 
		"<div class=\"spotC5\">&clubs;</div>\n" + 
		"</div>\n"; 
}

function emptyStockPile() {
	var redealSymbol = "<span class=\"red\">&#10006;</span>";
	
	if (solGame.redeals > 0) {
		redealSymbol = "<span style=\"color: lime;\">&#10004;</span>";
	}
	
	return "<div>\n" +
		"<div class=\"ace\" style=\"margin-left: -0.1em; margin-top: -0.1em;\">" + redealSymbol + "</div>\n" + 
		"</div>\n"; 
}

function toggleHelp(stableTableau) {
	var helpPanel = document.getElementById("helpPanel");
	var helpButton = document.getElementById("helpButton");
	var helpKeyword = "help";
	if (baseStatFile == "wizard") {
		helpKeyword = "specs";
	}

	if (helpPanel.style.display == "block") {
		helpPanel.style.display = "none";
		helpButton.value = "Show "+helpKeyword;
	} else {
		helpPanel.style.display = "block";
		helpButton.value = "Hide "+helpKeyword;
	}
	
	if (!stableTableau) {
		resizeHeight();
	}
}

function resizeHeight() {
	if (window.innerHeight) {
		var helpPanel = document.getElementById("helpPanel");
		var heightModifier = 225;

		if (helpPanel.style.display == "none") {
			heightModifier = 225;
		} else {
			heightModifier = 225 + helpPanel.offsetHeight;
		}
		
		playHeight = window.innerHeight - heightModifier;
		document.getElementById("tableau").style.height = playHeight+"px";
	}
}

function changeHeight(delta) {
	playHeight += delta;
	
	if (playHeight < 300) {
		playHeight = 300;
	}

	if (playHeight > 800) {
		playHeight = 800;
	}
	
	document.getElementById("tableau").style.height = playHeight+"px";
}

function setBaseRank(newBaseRank) {
	baseRank = newBaseRank;
	finalRank = "";
	if (baseRank != "") {
		switch (baseRank) {
			case "Ace":
				finalRank = "King";
				break;
			case "2":
				finalRank = "Ace";
				break;
			case "Jack":
				finalRank = "10";
				break;
			case "Queen":
				finalRank = "Jack";
				break;
			case "King":
				finalRank = "Queen";
				break;
			default:
				finalRank = parseInt(baseRank) - 1;
				break;
		}
	}
}

//Common end-game messages
function gameWon() {
	if (solGame.recordWin || baseStatFile == "wizard") {
		var gameSeconds, gameMinutes, gameHours, clearTime, remainingTime;
		
		remainingTime = solGame.dealTime;
		gameHours = Math.floor(remainingTime/3600);
		remainingTime = remainingTime - gameHours * 3600;
		gameMinutes = Math.floor(remainingTime/60);
		remainingTime = remainingTime - gameMinutes * 60;
		gameSeconds = remainingTime;

		clearTime = "";
		if (gameHours > 0) {
			clearTime = gameHours + ":";
			if (gameMinutes < 10) {
				clearTime = clearTime + "0";
			}
			clearTime = clearTime + gameMinutes + ":";
			if (gameSeconds < 10) {
				clearTime = clearTime + "0";
			}
			clearTime = clearTime + gameSeconds;
		} else {
			clearTime = gameMinutes + ":";
			if (gameSeconds < 10) {
				clearTime = clearTime + "0";
			}
			clearTime = clearTime + gameSeconds;
		}
		
		solGame.recordWin = false;
		if (baseStatFile == "wizard") {
			updateStatus("Congratulations!! You won the game in " + clearTime + "!<br />Solitaire Wizard games are unranked. Thanks for playing.");
		} else {
			updateStatus("Congratulations!! You won the game in " + clearTime + "!");
			exportLog(1);
		}
	} else {
		updateStatus("Congratulations! You won the game!<br />To qualify, please start a <b>new game</b> without using the password feature");
	}
	playSound(gameWonSnd);
	solGame.gameActive = false;
}

function noMovesLeft() {
	if (solGame.totalMoves == 0) {
		updateStatus("Interesting! No moves can be made at all.");
	} else {
		updateStatus("Defeat! No legal moves remain!");
		playSound(gameLostSnd);
	}
	solGame.gameActive = false;
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

function throwError(errorObj) {
	var statusBar = document.getElementById("statusBar");
	var errMessage = errorObj.message;
	var errPinpoint = "";
	
	if (errorObj.lineNumber && errorObj.fileName) {
		errPinpoint = "<br />(" + errorObj.fileName + " at line " + errorObj.lineNumber + ")";
	}
	
	statusBar.innerHTML = "<span style=\"color: rgb(255,128,0); font-weight: bold;\">Error</span>: " + errMessage + errPinpoint;
}

function playSound(playObj) {
	if (playSfx > 0 && playObj) {
		playObj.play();
	}
}

//Loads common sound effects
function loadSoundEffects() {
	cardUp = new sound("../sfx/cardUp.wav");
	cardDown = new sound("../sfx/cardDn.wav");
	scoreCard = new sound("../sfx/scoreCard.wav");
	redealSnd = new sound("../sfx/redeal.wav");
	
	gameWonSnd = new sound("../sfx/gameWon.wav");
	gameLostSnd = new sound("../sfx/gameLost.wav");
}

//sound object
function sound(src) {
	if (playSfx > 0) {
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
} 

//solGame object
var solGame = {
	casualScore: 0,
	moneyScore : null,
	stockRemain: 0,
	wasteSize  : -1,
	totalMoves : 0,
	difficulty : 2,
	redeals    : 0,
	dealTime   : 0,
	spiderCon  : null,
	gameActive : false,
	recordGame : true,
	recordWin  : true
}

//solDeck object
function solDeck(numDecks) {

	this.cards = new Array(numDecks * 52);
	var suits = new Array("Club", "Diamond", "Heart", "Spade");
	var ranks = new Array("2", "3", "4", "5", "6", "7",
		"8", "9", "10", "Jack", "Queen", "King", "Ace")
	
	if (preferDeckId >= 0) {
		shuffleID = preferDeckId - 1;
	}

	// Generate the array of solCard objects
	var cardCount = 0;
	for (var k = 0; k < numDecks; k++) {
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 13; j++) {
				this.cards[cardCount] = new solCard(suits[i], ranks[j], shuffleID);
				cardCount++;
			}
		}
		if (preferDeckId == -1) {
			shuffleID++;
		}
	}
	
	// Shuffle method to randomize the card order
	this.shuffle = function () {
		this.cards.sort(function() {
			return 0.5 - Math.random();
		})
	}

	// Deal a card
	this.dealCard = function() {
		return this.cards.shift();
	}
}

//solCard object
function solCard(suit, rank, newID) {

	this.suit = suit; // Club, Diamond, Heart, or Spade
	this.rank = rank; // 2 through 10, Jack, Queen, King, or Ace
	this.deckID = newID;

}
	
solCard.prototype.innerCode = function() {
	var outerShell = "";
	var innerShell = "";
	var suitPip = "&" + this.suit.toLowerCase() + "s;";
	var faceImg = "";
	var cornerRank = this.rank.charAt(0);
	if (this.rank == "10") {
		cornerRank = "10";
	}

	if (this.suit == "Diamond") {
		suitPip = "&diams;";
	}
	var cornerIndex = cornerRank + "<br />" + suitPip;
	
	if (this.rank == "King" || this.rank == "Queen" || this.rank == "Jack") {
		faceImg = "../gfx/" + this.rank.toLowerCase() + ".gif";
		innerShell = "<div class=\"indexA\">" + cornerIndex + "</div>\n" +
			"<div class=\"indexB\">" + cornerIndex + "</div>\n" +
			"<img class=\"face\" src=\"" + faceImg + "\" alt=\"\" width=\"80\" height=\"130\" draggable=\"false\" />\n" +
			"<div class=\"spotA1\">" + suitPip + "</div>\n" +
			"<div class=\"spotC5\">" + suitPip + "</div>\n";
	} else {
		
		innerShell = "<div class=\"indexA\">" + cornerIndex + "</div>\n" +
			"<div class=\"indexB\">" + cornerIndex + "</div>\n";

		switch (this.rank) {
			case "Ace":
				innerShell = innerShell +
					"<div class=\"ace\">" + suitPip + "</div>\n";
				break;
			case "2":
				innerShell = innerShell +
					"<div class=\"spotB1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotB5\">" + suitPip + "</div>\n";
				break;
			case "3":
				innerShell = innerShell +
					"<div class=\"spotB1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotB3\">" + suitPip + "</div>\n" + 
					"<div class=\"spotB5\">" + suitPip + "</div>\n";
				break;
			case "4":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "5":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotB3\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "6":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA3\">" + suitPip + "</div>\n" +
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC3\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "7":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA3\">" + suitPip + "</div>\n" +
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotB2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC3\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "8":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA3\">" + suitPip + "</div>\n" +
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotB2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotB4\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC3\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "9":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA2\">" + suitPip + "</div>\n" +
					"<div class=\"spotA4\">" + suitPip + "</div>\n" +
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotB2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC4\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
			case "10":
				innerShell = innerShell +
					"<div class=\"spotA1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotA2\">" + suitPip + "</div>\n" +
					"<div class=\"spotA4\">" + suitPip + "</div>\n" +
					"<div class=\"spotA5\">" + suitPip + "</div>\n" +
					"<div class=\"spotB2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotB4\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC1\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC2\">" + suitPip + "</div>\n" + 
					"<div class=\"spotC4\">" + suitPip + "</div>\n" +
					"<div class=\"spotC5\">" + suitPip + "</div>\n";
				break;
		}
	}
	
	outerShell = "<div class=\"front " + this.suit.toLowerCase() + "s\">\n" 
	outerShell = outerShell + innerShell + "</div>\n"; 
	
	return outerShell;
}

solCard.prototype.passValue = function () {
	var passStr = this.suit.substring(0,1);
	
	if (this.rank == "10") passStr += "T";
	else passStr += this.rank.substring(0,1);
	
	return passStr.toUpperCase();
}
	
solCard.prototype.nameParse = function () {
	var fullName = this.rank + " of " + this.suit + "s";

	return fullName;
}

//Data extraction
function getSuit(object) {
	var suits = new Array("Club", "Diamond", "Heart", "Spade");
	
	for (var i = 0; i < 4; i++) {
		if (object.suit == suits[i]) {
			return i;
		}
	}
}

function getColor(object) {
	if (getSuit(object) == 0 || getSuit(object) == 3) {
		return 0;
	} else {
		return 1;
	}
}

function getRank(object) {
	var ranks = new Array("2", "3", "4", "5", "6", "7",
		"8", "9", "10", "Jack", "Queen", "King", "Ace")
	
	for (var i = 0; i < 13; i++) {
		if (object.rank == ranks[i]) {
			return i;
		}
	}
}

function shuffleDeck(decks) {
	passField = document.getElementById("password");
	numShuffles = 2 + decks * 5;

	for (var i = 0; i < numShuffles; i++) {
		playDeck.shuffle();
	}
	
	seedPassword = "";

	for (var j = 0; j < 52 * decks; j++) {
		seedSlot[j] = playDeck.dealCard();
		seedPassword += seedSlot[j].passValue();
	}
		
	if (passField) {
		passField.value = seedPassword;
	}
}

//Reads the password and (if valid) seeds the shuffle accordingly
function readPass(numDecks) {
	var suitIndex, rankIndex, internalIndex, startChar, cardCounts, passwordValid;
	passField = document.getElementById("password");
	
	cardCounts = new Array(52);
	seedPassword = passField.value;
	passwordValid = true;
	
	for (var i = 0; i < 52; i++) {
		cardCounts[i] = 0;
	}
	
	for (var k = 0; k < 52 * numDecks; k++) {
		startChar = k*2;
	
		suitIndex = seedPassword.substring(startChar,startChar+1);
		rankIndex = seedPassword.substring(startChar+1,startChar+2);
		
		if (suitIndex == "S") {
			seedSlot[k].suit = "Spade";
		} else if (suitIndex == "H") {
			seedSlot[k].suit = "Heart";
		} else if (suitIndex == "D") {
			seedSlot[k].suit = "Diamond";
		} else if (suitIndex == "C") {
			seedSlot[k].suit = "Club";
		} else {
			passwordValid = false;
			break;
		}
		
		if (rankIndex == "A") {
			seedSlot[k].rank = "Ace";
		} else if (rankIndex == "T") {
			seedSlot[k].rank = "10";
		} else if (rankIndex == "J") {
			seedSlot[k].rank = "Jack";
		} else if (rankIndex == "Q") {
			seedSlot[k].rank = "Queen";
		} else if (rankIndex == "K") {
			seedSlot[k].rank = "King";
		} else if (rankIndex >= 2 && rankIndex <= 9) {
			seedSlot[k].rank = rankIndex;
		} else {
			passwordValid = false;
			break;
		}
		
		internalIndex = getSuit(seedSlot[k]) * 13 + getRank(seedSlot[k]);
		if (++cardCounts[internalIndex] > numDecks) {
			passwordValid = false;
			break;
		}
	}
	
	return passwordValid;
}

function assignSeedCard() {
	return seedSlot[cardsDealt++];
}

function checkNextCard() {
	return seedSlot[cardsDealt];
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
