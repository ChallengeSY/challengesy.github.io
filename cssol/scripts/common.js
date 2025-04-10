var scriptTime = new Date();
var seedSlot = new Array(312);
var selectX, selectDepth, finishPtr, highestHeight, canFillColumn, seedPassword, oldPassword, cardsDealt;
var baseStatFile, passField, clockPtr, forceRender, rectangularTableau, divFrag;
const reserveStart = 50;
const COLUMN_WIDTH = 110;
const FANNING_X = 16;
var FANNING_Y = (getStorage("pileDensity") && isFinite(getStorage("pileDensity")) ? getStorage("pileDensity") : 30);
var abandonHandling = (getStorage("abandonPrompt") && isFinite(getStorage("abandonPrompt")) ? getStorage("abandonPrompt") : 1);
var facedownHints = (getStorage("downturnHints") && isFinite(getStorage("downturnHints")) ? getStorage("downturnHints") : 1);
var preferDeckId = (getStorage("cardback") && isFinite(getStorage("cardback")) ? getStorage("cardback") : -1);
var playSfx = (getStorage("playSfx") && isFinite(getStorage("playSfx")) ? getStorage("playSfx") : 1);
var playMus = (getStorage("playMus") && isFinite(getStorage("playMus")) ? getStorage("playMus") : -1);
var useJokeStyle = (scriptTime.getUTCDate() == 1 && scriptTime.getUTCMonth() == 3);
var emptyAutoRefills = 0;
var undoCount = 0;
var playHeight = 500;
var wasteDealBy = 1;
var wasteFanned = false;
var reverseRender = false;
var pairingGame = false;
var golfGame = false;
var tallyStreak, longestStreak;
var dynamicDealCt = false;
var skipSounds = 0;
var shuffleID = Math.floor(Math.random()*4);
var scoringModel = "buildUpSuit";

var playDeck, searchElement, baseRank, finalRank, tableauWidth;
var wizardScoring = null;
forceRender = false;
rectangularTableau = true;
traditionalStock = true;
allowLogs = true;
stockDealTo = 0;

function createDivFrag(newId, newX, newY, newZ) {
	divFrag = document.createElement("div");
	divFrag.id = newId;
	divFrag.title = "";
	divFrag.className = "invis";
	divFrag.style.left = newX+"px";
	if (newY >= 0) {
		divFrag.style.top = newY+"px";
	} else {
		divFrag.style.bottom = newY+"px";
	}
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

/*
 * Logs game using AJAX and additional aux functions
 */
function exportLog(gameWon) {
	if (baseStatFile == "seriesPlay") {
		if (gameWon > 0) {
			saveSeriesFile(true);
			if (seriesGame <= 3) {
				appendStatus("<br />The series has been saved. Tap <q>Finish</q> when you are ready to play the next game.");
			} else if (seriesScore < 1000) {
				appendStatus("<br />The series has been successfully completed!");
			} else {
				appendStatus("<br />A perfect score has been achieved on this series!");
			}
		}
	}
}

//Move processing
function recordMove() {
	if (solGame.recordPlay) {
		solGame.recordPlay = false;
		exportLog(0);
	}
	
	gameHistory.push(new gameObj(solGame));
	if (!clockPtr) {
		clockPtr = setInterval(function(){incrementSecond()},1000);
		playSound(bgMusic);
	}
	solGame.totalMoves++;
}

function undoMove() {
	var historyLength = gameHistory.length - 1;
	var undoButton = document.getElementById("undo");
	
	if (!solGame.recordWin && baseStatFile == "seriesPlay") {
		updateStatus("You may not undo a Series game that has been won.");
	} else {
		if (historyLength >= 0) {
			tallyStreak = 0;
			gameHistory[historyLength].dealTime = solGame.dealTime;
			solGame = new gameObj(gameHistory.pop());
			
			playSound(cardDown);
			if (!traditionalStock || stockDealTo < 0 || stockDealTo > 1) {
				cardsDealt = wizardDecks*52 - solGame.stockRemain;
			}
		}

		undoCount++;
		forceRender = true;
		renderPlayarea();
	}
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

	gameHistory = new Array();
	
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
	
	undoCount = 0;
	selectX = -1;
}

//Restarts game
function restartGame(penalize) {
	var preserveWin, gameTime;

	//Records eligibility to win and game time
	preserveWin = solGame.recordWin;
	gameTime = solGame.dealTime;
	
	if (!preserveWin && baseStatFile == "seriesPlay") {
		updateStatus("You may not restart a Series game that has been won.");
	} else {
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
	if (!finishPtr) {
		playSound(cardUp);
	}
}

function deselectCard(object) {
	newClasses = object.className;
	if (object.className.endsWith("cardSelected")) {
		newClasses = object.className.slice(0, -13);
	}
	applyClasses(object,newClasses);
	if (!finishPtr) {
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
	var newImage, newInner, newTitle, newCard;
	var spiderScore = 0;
	var spiderCombo = 0;
	var baseTopPos = 0;
	var baseLeftPos = 0;
	newCard = null;
	skipSounds = 1;

	if (reverseRender) {
		customRender();
	}
	
	//Auto-refill empty tableau piles
	if (emptyAutoRefills > 0 && (solGame.stockRemain > 0 || solGame.wasteSize >= 0)) {
		for (x = 0; x < 49; x++) {
			searchElement = document.getElementById("x"+x+"y0");
			if (searchElement && !solGame.tableau[x][0]) {
				for (i = 0; i < emptyAutoRefills; i++) {
					if (solGame.stockRemain > 0) {
						if (solGame.wasteSize < 0) {
							newCard = quickDealStock();
						}
						
						if (newCard) {
							solGame.tableau[x][i] = newCard;
						} else if (solGame.wasteSize >= 0) {
							solGame.tableau[x][i] = solGame.stockPile[solGame.wasteSize];
							deleteEntry();
						}
					} else if (solGame.wasteSize >= 0) {
						solGame.tableau[x][i] = solGame.stockPile[solGame.wasteSize];
						deleteEntry();
					}
				}
			}
		}
	}

	//Tableau
	for (x = 0; x < 49; x++) {
		for (y = 0; y < 312; y++) {
			if (y == 0) {
				solGame.prevHeight[x] = solGame.height[x];

				if (spiderCombo > 0 && spiderCombo < 12) {
					spiderScore--;
				}
				spiderCombo = 0;
			}
			
			searchElement = document.getElementById("x"+x+"y"+y);
			if (searchElement && (y <= solGame.height[x] + 2 || y <= solGame.prevHeight[x] + 2 ||
				y == 0 || solGame.tableau[x][y] || !rectangularTableau || forceRender)) {
				if (solGame.tableau[x][y]) {
					renderDiv(searchElement,"play" + (solGame.tableau[x][y].deckID % 6));
					
					if (y < solGame.downturn[x]) {
						newInner = "";
						newTitle = "Face-down card";
						if ((y + 1 == solGame.downturn[x] && facedownHints == 2) || facedownHints > 2) {
							newTitle = "(" + solGame.tableau[x][y].nameParse() + ")";
						}
					} else {
						newInner = solGame.tableau[x][y].innerCode();
						newTitle = solGame.tableau[x][y].nameParse();
						
						if ((y == 0 && solGame.tableau[x][y].rank == "King") || (y > 0 && y > solGame.downturn[x] && cardsConnected(solGame.tableau[x][y],solGame.tableau[x][y-1]))) {
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
						
						solGame.height[x] = -1;
					} else {
						renderDiv(searchElement,"invis");
						newTitle = "";

						if (solGame.tableau[x][y-1]) {
							solGame.height[x] = y - 1;
						}
					}
				}
				
				if (newInner != searchElement.innerHTML || forceRender) {
					searchElement.innerHTML = newInner;
				}
				searchElement.title = newTitle;
			} else {
				if (solGame.tableau[x][y-1]) {
					solGame.height[x] = y - 1;
				}
			}
		}
	}
	
	if (rectangularTableau) {
		//Reveal unobstructed downturned cards for rectangular tableaux
		for (var x = 0; x < 49; x++) {
			if (solGame.height[x] + 1 == solGame.downturn[x] && solGame.downturn[x] > 0) {
				solGame.downturn[x]--;
				var deltaY = solGame.height[x] - 1;
				
				searchElement = document.getElementById("x"+x+"y"+solGame.height[x]);
				newInner = solGame.tableau[x][solGame.height[x]].innerCode();
				newTitle = solGame.tableau[x][solGame.height[x]].nameParse();
					
				if (newInner != searchElement.innerHTML || forceRender) {
					searchElement.innerHTML = newInner;
					searchElement.title = newTitle;
				}
				
				if (deltaY >= 0 && facedownHints >= 2) {
					searchElement = document.getElementById("x"+x+"y"+deltaY);
					searchElement.title = "(" + solGame.tableau[x][deltaY].nameParse() + ")";
				}
			}
		}
	}
	
	//Foundation piles
	for (i = 0; i < 24; i++) {
		searchElement = document.getElementById("home"+i);
		
		if (searchElement) {
			if (solGame.foundationPile[i]) {
				newInner = solGame.foundationPile[i].innerCode();
				newTitle = solGame.foundationPile[i].nameParse();
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
			if (solGame.reserveSlot[i]) {
				newInner = solGame.reserveSlot[i].innerCode();
				newTitle = solGame.reserveSlot[i].nameParse();
				renderDiv(searchElement, "card");
				
			} else {
				newInner = "";
				newTitle = "Empty Reserve Slot";
				
				if (reserveReusable > i || stockDealTo == 4) {
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
					backID = solGame.stockPile[solGame.wasteSize+1].deckID % 6;
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
				newInner = solGame.stockPile[i].innerCode();
				newTitle = solGame.stockPile[i].nameParse();
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

	searchElement = document.getElementById("autoBuild");
	if (searchElement) {
		searchElement.disabled = (baseRank == "");
	}
	searchElement = document.getElementById("undoMove");
	if (searchElement) {
		searchElement.disabled = (gameHistory.length < 1 || solGame.casualScore >= maxScore);
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
	skipSounds = 0;
	forceRender = false;
	if (!reverseRender && baseStatFile != "blackjack") {
		try {
			customRender();
		} catch(err) {
			// Blank catch. Only a few games require additional rendering
		}
	}
	updateStatus("&emsp;");
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
		"<div class=\"ace\">" + redealSymbol + "</div>\n" + 
		"</div>\n"; 
}

function toggleHelp() {
	var helpPanel = document.getElementById("helpPanel");

	if (helpPanel.style.display == "block") {
		helpPanel.style.display = "none";
	} else {
		helpPanel.style.display = "block";
	}
	
	resizeHeight();
}

function togglePass() {
	var passPanel = document.getElementById("passDisp");

	if (passPanel.style.display == "inline") {
		passPanel.style.display = "none";
	} else {
		passPanel.style.display = "inline";
	}
}

function resizeHeight() {
	if (window.innerHeight) {
		var helpPanel = document.getElementById("helpPanel");
		var heightModifier = 165;
		
		var stockPile = document.getElementById("stock0");
		var foundationPool = document.getElementById("home0");

		if (helpPanel && helpPanel.style.display == "none") {
			heightModifier = 165;
		} else {
			heightModifier = 165 + helpPanel.offsetHeight;
		}
		
		playHeight = window.innerHeight - heightModifier;
		document.getElementById("tableau").style.height = playHeight+"px";
		
		var cmdPanel = document.getElementById("commandPanel");
		
		if (cmdPanel) {
			if (!stockPile || foundationPool) {
				maxHeight = document.getElementById("tableau").style.maxHeight;
				commandOffset = 85 + helpPanel.offsetHeight;
				
				if (isFinite(parseInt(maxHeight)) && playHeight > parseInt(maxHeight)) {
					commandOffset = window.innerHeight - parseInt(maxHeight) - 80;
				}
				
				cmdPanel.style.bottom = commandOffset+"px";
			} else if (!cmdPanel.style.top) {
				cmdPanel.style.top = "90px";
			}
		}
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
		updateStatus("Congratulations!! You won the game in " + clearTime + "!");
		exportLog(1);
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
		stopMusic();
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
	console.error(errorObj);
	
	/*
	var statusBar = document.getElementById("statusBar");
	var errMessage = errorObj.message;
	var errPinpoint = "";
	
	if (errorObj.lineNumber && errorObj.fileName) {
		errPinpoint = "<br />(" + errorObj.fileName + " at line " + errorObj.lineNumber + ")";
	}
	
	statusBar.innerHTML = "<span style=\"color: rgb(255,128,0); font-weight: bold;\">Error</span>: " + errMessage + errPinpoint;
	*/
}

function playSound(playObj) {
	playObj.play();
}

function stopMusic() {
	bgMusic.stop();
}

//Loads common sound effects
function loadSoundEffects() {
	cardUp = new sound("../sfx/cardUp.wav");
	cardDown = new sound("../sfx/cardDn.wav");
	scoreCard = new sound("../sfx/scoreCard.wav");
	redealSnd = new sound("../sfx/redeal.wav");
	
	gameWonSnd = new sound("../sfx/gameWon.wav");
	gameLostSnd = new sound("../sfx/gameLost.wav");
	
	bgMusic = new sound("../sfx/mus/Tunnel Routine.mp3");
}

//sound object
function sound(src) {
	var bgmFile = (src.search("/mus/") >= 0);
	
	if ((playSfx > 0 && !bgmFile) || (playMus > 0 && bgmFile)) {
		this.sound = document.createElement("audio");
		this.sound.src = src;
		this.sound.setAttribute("preload", "auto");
		if (bgmFile) {
			this.sound.setAttribute("loop", "loop");
		}
		this.sound.setAttribute("controls", "none");
		this.sound.style.display = "none";
		
		document.body.appendChild(this.sound);
		this.play = function(){
			if (!bgmFile) {
				this.sound.currentTime = 0;
			}
			this.sound.play();
		}
		this.stop = function(){
			this.sound.pause();
			if (bgmFile) {
				this.sound.currentTime = 0;
			}
		}
	} else {
		// Blank functions, to protect against errors
		this.play = function() {}
		this.stop = function() {}
	}
} 

// Array management
function emptyDoubleArray(sizeA,sizeB) {
	var createArrays = new Array(sizeA);
	for (var o = 0; o < createArrays.length; o++) {
		createArrays[o] = new Array(sizeB);
	}
	
	return createArrays;
}

function emptySingleArray(sizeA, initA) {
	var createArrays = new Array(49);
	if (typeof initA !== undefined) {
		for (var o = 0; o < createArrays.length; o++) {
			createArrays[o] = initA;
		}
	}
	
	return createArrays;
}

function cloneDoubleArray(orgArray) {
	newArray = new Array();
	
	for (var d = 0; d < orgArray.length; d++) {
		newArray[d] = new Array();
		
		for (var e = 0; e < orgArray[d].length; e++) {
			newArray[d][e] = orgArray[d][e];
		}
	}
	
	return newArray;
}

function cloneSingleArray(orgArray) {
	newArray = new Array();
	
	for (var c = 0; c < orgArray.length; c++) {
		newArray[c] = orgArray[c];
	}
	
	return newArray;
}

// Game object
function gameObj(source) {
	if (source == null) {
		this.tableau        = emptyDoubleArray(49,312);
		this.height         = emptySingleArray(49,0);
		this.prevHeight     = emptySingleArray(49,0);
		this.downturn       = emptySingleArray(49,0);
		this.obstructed     = emptyDoubleArray(49,104);
		this.foundationPile = emptySingleArray(24,null);
		this.reserveSlot    = emptySingleArray(48,null);
		this.stockPile      = emptySingleArray(213,null);
		this.casualScore    = 0;
		this.moneyScore     = null;
		this.stockRemain    = 0;
		this.wasteSize      = -1;
		this.totalMoves     = 0;
		this.difficulty     = 2;
		this.redeals        = 0;
		this.dealTime       = 0;
		this.spiderCon      = null;
		this.gameActive     = false;
		this.recordGame     = true;
		this.recordWin      = true;
	} else {
		this.tableau        = cloneDoubleArray(source.tableau);
		this.height         = cloneSingleArray(source.height);
		this.prevHeight     = cloneSingleArray(source.prevHeight);
		this.downturn       = cloneSingleArray(source.downturn);
		this.obstructed     = cloneDoubleArray(source.obstructed);
		this.foundationPile = cloneSingleArray(source.foundationPile);
		this.reserveSlot    = cloneSingleArray(source.reserveSlot);
		this.stockPile      = cloneSingleArray(source.stockPile);
		this.casualScore    = source.casualScore;
		this.moneyScore     = source.moneyScore;
		this.stockRemain    = source.stockRemain;
		this.wasteSize      = source.wasteSize;
		this.totalMoves     = source.totalMoves;
		this.difficulty     = source.difficulty;
		this.redeals        = source.redeals;
		this.dealTime       = source.dealTime;
		this.spiderCon      = source.spiderCon;
		this.gameActive     = source.gameActive;
		this.recordGame     = source.recordGame;
		this.recordWin      = source.recordWin;
	}
}

var solGame = new gameObj(null);

// Blank history array
var gameHistory = new Array();

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
	
	this.createEmptyCard = function() {
		return new solCard(suits[0], ranks[0], shuffleID);
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
	var filepath = window.location.pathname;
	var jokeSuit = null;
	if (this.rank == "10") {
		cornerRank = "10";
	}
	
	if (useJokeStyle) {
		switch (this.suit) {
			case "Spade":
				jokeSuit = "diamond";
				break;
			case "Heart":
				jokeSuit = "club";
				break;
			case "Diamond":
				jokeSuit = "s`ade";
				break;
			case "Club":
				jokeSuit = "heart";
				break;
		}
	}

	if (this.suit == "Diamond") {
		suitPip = "&diams;";
	}
	var cornerIndex = cornerRank + "<br />" + suitPip;
	
	if (this.rank == "King" || this.rank == "Queen" || this.rank == "Jack") {
		if (filepath.startsWith("/cssol/games/") || filepath.startsWith("/cssol/wizard/") || filepath.startsWith("/cssol/series/")) {
			faceImg = "../gfx/" + this.rank.toLowerCase() + ".gif";
		} else {
			faceImg = "gfx/" + this.rank.toLowerCase() + ".gif";
		}
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
	
	if (useJokeStyle) {
		outerShell = "<div class=\"front " + jokeSuit + "s\">\n" 
	} else {
		outerShell = "<div class=\"front " + this.suit.toLowerCase() + "s\">\n" 
	}
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
		if (typeof seedSlot[k] === "undefined") {
			seedSlot[k] = playDeck.createEmptyCard();
		}
		
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

//Series Challenge functions
function loadSeriesFile() {
	var passField = document.getElementById("password");
	
	if (getStorage("cssolSeries")) {
		seriesElements = getStorage("cssolSeries").split("~");
		
		if (seriesElements.length >= 2) {
			seriesDiff = parseInt(seriesElements[0].charAt(0));
			seriesGame = parseInt(seriesElements[0].charAt(1));
			seriesLives = parseInt(seriesElements[0].charAt(2));
			
			seriesScore = parseInt(seriesElements[1]);
			seriesPassword = seriesElements[2];
		} else {
			seriesGame = 0;
			seriesLives = 0;
		}
		
		if (passField) {
			passField.value = seriesPassword;
		}
	} else {
		seriesElements = null;
		seriesGame = 0;
	}
}

function saveSeriesFile(gameWon) {
	var passField = document.getElementById("password");
	var resButton = document.getElementById("restartGame");
	
	var seriesFields = [document.getElementById("seriesSkill"),document.getElementById("seriesScore"),document.getElementById("seriesLives"),document.getElementById("livesDisp")];
	
	if (gameWon) {
		var winBonus = 0;
		var cardsMod = 0;
		switch (seriesGame) {
			case 2:
				winBonus = 128;
				break;
			case 3:
				winBonus = 268;
				cardsMod = -4;
				break;
		}
		
		if (seriesDiff == 4) {
			seriesLives = seriesGame + 2;
		}
		
		var undoPenalty = undoCount * (seriesDiff - 1);
		
		seriesPassword = "";
		seriesScore += Math.max((solGame.casualScore + cardsMod) * seriesLives + winBonus - undoPenalty,0);
		
		if (++seriesGame <= 3) {
			switch (seriesDiff) {
				case 3:
					seriesLives++;
					break;
				case 4:
					seriesLives = 1;
					break;
				default:
					seriesLives = 2 + seriesGame;
					break;
			}
		} else if (seriesDiff == 4) {
			seriesLives = 1;
		}
		
		resButton.disabled = true;
	} else if (passField) {
		seriesPassword = passField.value;
	}
	
	if (seriesFields[0]) {
		var skillName;
		switch (seriesDiff) {
			case 1:
				skillName = "Casual";
				break;
			case 2:
				skillName = "Regular";
				break;
			case 3:
				skillName = "Fanatic";
				break;
			case 4:
				skillName = "Hardcore";
				break;
			default:
				skillName = "???";
				break;
		}
		seriesFields[0].innerHTML = skillName;
		
		if (seriesFields[3] && seriesDiff == 1) {
			seriesFields[3].style.display = "none";
		}
	}
	if (seriesFields[1]) {
		seriesFields[1].innerHTML = seriesScore;
	}
	if (seriesFields[2]) {
		seriesFields[2].innerHTML = seriesLives;
	}
	buildSaveStr = seriesDiff.toString()+seriesGame+seriesLives+"~"+seriesScore+"~"+seriesPassword;
	
	if (seriesGame <= 3) {
		setStorage("cssolSeries",buildSaveStr);
	} else {
		deleteSeriesFile();
	}
}

function deleteSeriesFile() {
	setStorage("cssolSeries",null);
}

//Storage management
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

//Cookie management - Fallback for older browsers
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
