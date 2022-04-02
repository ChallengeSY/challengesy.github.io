packsCreated = 0;
cardsCreated = 0;
circulation = 0;
normalPack = 7;
shortPack = 5;
giveJokers = true;

drafting = false;
completed = false;
plrAlive = true;
mapRerolled = false;
canRerollMap = true;
sabotage = new Array(true, true, false); //In order: Can the player use Sabotage, can the CPU use sabotage, and has the player been sabotaged recently
roundNum = 1;
playersLeft = 16;
gamesWon = 0;
gamesLost = 0;
gameGoal = 2;
discardsLeft = 0;

window.onload = firstDraft;

//Manage events
function addEvent(object, evName, fnName, cap) {
	try {
		if (object.addEventListener) {
            object.addEventListener(evName, fnName, cap);
		} else if (object.attachEvent) {
            object.attachEvent("on" + evName, fnName);
		} else {
			if (evName == "click") {
				object.onclick = fnName;
			}
		}
	} catch(err) {
		alert(err);
	}
}

function removeEvent(object, evName, fnName, cap) {
	try {
		if (object.removeEventListener) {
			object.removeEventListener(evName, fnName, cap);
		}
		
		if (object.detachEvent) {
			object.detachEvent("on" + evName, fnName);
		}
		
		if (evName == "click") {
			object.onclick = null;
		}
	} catch(err) {
		alert(err);
	}
}

function firstDraft() {
	drafting = true;
	createCard("yourcards","random");
	for (var j = 0; j < 1; j++) {
		createPack(false);
	}
	
	// Workaround a malfunctioning external element, if necessary
	var divCollection = document.getElementsByTagName("div");
	var findId = divCollection.length - 1;
	if (divCollection[findId].id != "temp") {
		divCollection[findId].style.display = "none";
	}
}

//Create a card pack
function createPack(forSelf) {
	parentDiv = document.getElementById("newcards");
	if (forSelf) {
		cardsPerPack = shortPack;
	} else {
		cardsPerPack = normalPack;
	}
	
	imgFrag = document.createElement("img");
	imgFrag.src = "cards/Pack" + cardsPerPack + ".png";
	imgFrag.alt = "Card pack";
	imgFrag.style.cursor = "pointer";
	imgFrag.id = "pack" + packsCreated;
	imgFrag.title = cardsPerPack + "-card pack";
	
	if (forSelf) {
		imgFrag.title = imgFrag.title + ": Click to open and add its contents directly to your collection";
		addEvent(imgFrag,"click",openSelfPack,false);
	} else {
		imgFrag.title = imgFrag.title + ": Click to open. Its contents will be in draft rotation";
		addEvent(imgFrag,"click",openDraftPack,false);
	}
	
	parentDiv.appendChild(imgFrag);
	
	packsCreated++;
}

//Open the card pack
function openSelfPack() {
	useId = this.id;
	
	imgPiece = document.getElementById(useId);
	imgPiece.style.display = "none";
	
	for (var i = 0; i < shortPack; i++) {
		if (i == 0 && shortPack > 7) {
			createCard("yourcards","joker");
		} else {
			createCard("yourcards",null);
		}
	}
	updateSubtitle(false,false,false);
}

//Open the card pack
function openDraftPack() {
	if (circulation == 0 && drafting) {
		useId = this.id;
		
		imgPiece = document.getElementById(useId);
		imgPiece.style.display = "none";
		
		for (var i = 0; i < normalPack; i++) {
			if (i == 0 && normalPack > 7) {
				createCard("yourcards","joker");
			} else {
				createCard("newcards",null);
				if (playersLeft <= 4) {
					createCard("com2",null);
					createCard("com3",null);
					createCard("com4",null);
				}
			}
		}
	}
}

//Creates a card
function createCard(where, specific) {
	parentDiv = document.getElementById(where);
	var weights = new Array(21, 20, 19, 20, 21, 1, 20, 19, 21, 19, 20, 10, 0, 0, 4, 7, 5, 1);
	var imgLoc = null, plural = true, imgATxt, imgDTxt, newCard, totalWeight = 0, rollDie, rollNeeded = 0;
	
	if (specific == "joker") {
		newCard = 12;
	} else if (specific == "random") {
		newCard = 13;
	} else if (specific == "reroll") {
		newCard = 14;
	} else {
		for (var a = 0; a < weights.length; a++) {
			totalWeight += weights[a];
		}
		
		rollDie = Math.floor(Math.random() * totalWeight);
		
		for (var b = 0; b < weights.length; b++) {
			rollNeeded += weights[b];
			if (rollDie < rollNeeded) {
				newCard = b;
				break;
			}
		}
	}
	
	switch (newCard) {
		case 0:
			imgATxt = "Fed";
			break;
		case 1:
			imgATxt = "Lizard";
			break;
		case 2:
			plural = false;
			imgLoc = "BirdMan";
			imgATxt = "Bird Men";
			break;
		case 3:
			imgATxt = "Fascist";
			break;
		case 4:
			imgATxt = "Privateer";
			break;
		case 5:
			plural = false;
			imgATxt = "Cyborg";
			break;
		case 6:
			imgLoc = "Crystalline";
			imgATxt = "Crystal";
			break;
		case 7:
			plural = false;
			imgATxt = "Empire";
			break;
		case 8:
			imgLoc = "Robotic";
			imgATxt = "Robot";
			break;
		case 9:
			imgATxt = "Rebel";
			break;
		case 10:
			plural = false;
			imgATxt = "Colonial";
			break;
		case 11:
			imgATxt = "Horwasp";
			break;
		case 12:
			imgLoc = "Joker";
			imgATxt = "Race card - Joker";
			imgDTxt = "Joker card: Play one game as ANY race";
			break;
		case 13:
			imgLoc = "Random";
			imgATxt = "Race card - Random";
			imgDTxt = "Random race: Play one game as a RANDOM race. Cannot be discarded";
			break;
		case 14:
			imgLoc = "Reroll";
			imgATxt = "Reroll pack";
			imgDTxt = "Reroll pack: Discard five (5) additional cards (if able) and receive a new 5-card pack";
			break;
		case 15:
			imgLoc = "Remap";
			imgATxt = "Regenerate map";
			imgDTxt = "Regenerate map: Discards the current map and generates a new map to play. Usable once per round.";
			break;
		case 16:
			imgATxt = "Sabotage";
			imgDTxt = "Sabotage: When played, your opponent discards three (3) cards of their choice. Usable once per round.";
			break;
		case 17:
			imgATxt = "Recycler";
			imgDTxt = "Recycler: Receive a free REROLL PACK at the end of each play phase. Limit 1 per player effective.";
	}
	
	if (!imgLoc)
		imgLoc = imgATxt;
	
	imgLoc = "cards/" + imgLoc + ".png";
	
	if (newCard < 12) {
		imgDTxt = imgATxt + " race card: Play one game as the " + imgATxt;
		if (plural)
			imgDTxt = imgDTxt + "s";
		imgATxt = "Race card - " + imgATxt;
	}
	
	imgFrag = document.createElement("img");
	imgFrag.src = imgLoc
	imgFrag.alt = imgATxt;
	imgFrag.title = imgDTxt;
	imgFrag.style.cursor = "pointer";
	imgFrag.id = "card" + cardsCreated;
	
	if (where == "yourcards") {
		addEvent(imgFrag,"click",playCard,false);
	} else {
		if (where == "newcards") {
			circulation++;
		}
		addEvent(imgFrag,"click",collectCard,false);
	}
	
	parentDiv.appendChild(imgFrag);
	
	cardsCreated++;
}

function collectCard() {
	if (drafting && !completed) {
		parentDiv = document.getElementById("yourcards");
		useId = this.id;
		
		imgPiece = document.getElementById(useId);
		removeEvent(imgPiece,"click",collectCard,false);
		addEvent(imgPiece,"click",playCard,false);
		parentDiv.appendChild(document.getElementById(useId));
		
		rotateCards();
	}
}

function rotateCards() {
	var draftCollection = document.getElementById("newcards");
	var tempCollection = document.getElementById("temp");
	var cpuDraft = new Array(), cpuCount = new Array();
	draftCount = draftCollection.childNodes.length;
	var selNode, nodeId, takeCard, tempCount;
	imgCount = 0;
	
	cpuDraft[0] = document.getElementById("com2");
	cpuCount[0] = cpuDraft[0].childNodes.length;
	cpuDraft[1] = document.getElementById("com3");
	cpuCount[1] = cpuDraft[1].childNodes.length;
	cpuDraft[2] = document.getElementById("com4");
	cpuCount[2] = cpuDraft[2].childNodes.length;
	
	for (var k = 0; k < draftCount; k++) {
		selNode = draftCollection.childNodes[k];
		if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
			imgCount++;
			nodeId = selNode.id;
			
			if (playersLeft > 4 && nodeId.substring(0,4) == "card") {
				selNode.style.display = "none";
			}
		}
	}
	
	if (playersLeft <= 4) {
		takeCard = Math.floor(Math.random() * circulation);
		for (var r = 0; r < 3; r++) {
			auxCount = 0;
			for (var l = 0; l < cpuCount[r]; l++) {
				selNode = cpuDraft[r].childNodes[l];
				if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
					nodeId = selNode.id;
					
					if (auxCount == takeCard) {
						selNode.style.display = "none";
					}

					auxCount++;
				}
			}
		}
	}
	
	if (circulation > 0) {
		circulation--;
	}
	manageCount = circulation;
	
	if (manageCount > 0) {
		if (playersLeft > 4) {
			for (var m = 0; m < manageCount; m++) {
				//Simply create new cards. Too many players for the size of the card packs
				createCard("newcards",null);
			}
		} else {
			//Once the remaining players decreases to 4, then the real meat begins; you will receive a subset of your original pack back
			//Rotate the computer's cards first
			for (var p = playersLeft - 2; p >= 0; p--) {
				switch (p) {
					case 0:
						if (playersLeft > 2) {
							targetCollection = cpuDraft[1];
						} else {
							targetCollection = tempCollection;
						}
						break;
					case 1:
						targetCollection = cpuDraft[2];
						break;
					case 2:
						targetCollection = tempCollection;
						break;
				}
				
				//Do in reverse order, avoids instant feedback problems
				for (var t = cpuCount[p] - 1; t >= 0; t--) {
					selNode = cpuDraft[p].childNodes[t];
					if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
						targetCollection.appendChild(selNode);
					}
				}
			}
			
			targetCollection = cpuDraft[0];
			//Next, pass unpicked player cards to the first computer
			for (var t = draftCount - 1; t >= 0; t--) {
				selNode = draftCollection.childNodes[t];
				if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
					targetCollection.appendChild(selNode);
				}
			}
			
			tempCount = tempCollection.childNodes.length;
			//Finally, pass the "previous" computer's cards to the player
			for (var t = tempCount - 1; t >= 0; t--) {
				selNode = tempCollection.childNodes[t];
				if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
					draftCollection.appendChild(selNode);
				}
			}
		}
	}

	circulation = manageCount;
	updateSubtitle(false,false,false);
	
	if (imgCount == 0)
		changePhase();
}

function changePhase() {
	drafting = !drafting;
	canRerollMap = true;
	sabotage[0] = true;
	sabotage[1] = true;
	
	if (drafting) {
		playersLeft /= 2;
	
		if (!plrAlive) {
			completed = true;
			document.getElementById("phase").innerHTML = "Simulation complete. You were knocked out!";
		} else if (playersLeft > 1)  {
			roundNum++;
			
			if (playersLeft > 2) {
				createPack(false);
				document.getElementById("phase").innerHTML = "Draft phase "+roundNum;
			} else {
				drafting = false;
			}
		} else {
			completed = true;
			document.getElementById("phase").innerHTML = "Simulation complete. You won!";
		}

		updateSubtitle(true,false,false);
	}
	
	if (!drafting) {
		if (roundNum < 4) {
			gameGoal = 2;
		} else {
			gameGoal = 3;
		}
		gamesWon = 0;
		gamesLost = 0;

		document.getElementById("phase").innerHTML = "Play phase "+roundNum;
		updateSubtitle(false,true,false);
	}
}

function playCard() {
	if (!drafting && !completed) {
		useId = this.id;
		imgPiece = document.getElementById(useId);
		useCard = imgPiece.alt;
		validPlay = true;
		if (useCard != "Race card - Random" && 
			(useCard != "Regenerate Map" || canRerollMap || discardsLeft > 0) && 
			(useCard != "Sabotage" || sabotage[0] || discardsLeft > 0) &&
			(useCard != "Recycler" || discardsLeft > 0))
			imgPiece.style.display = "none";
		
		if (discardsLeft == 0) {
			if (useCard.substring(0,9) == "Race card") {
				winRoll = Math.random();
				switch(useCard) {
					case "Race card - Random":
						//Fall through
					case "Race card - Empire":
						winWeight = .35;
						break;
					case "Race card - Cyborg":
						winWeight = .05;
						break;
					default:
						winWeight = .65;
				}
				
				if (mapRerolled) {
					winWeight += .1;
					mapRerolled = false;
				}
				
				if (!sabotage[0]) {
					winWeight += .1;
				}
				
				if (winRoll < winWeight) {
					gamesWon++;
				} else {
					gamesLost++;
				}
				
				if (sabotage[1] && Math.random() < .025 * roundNum) {
					sabotage[2] = true;
					discardsLeft = Math.min(3,handSize(false) - 1);
				}
			} else if (useCard == "Regenerate Map") {
				if (canRerollMap) {
					mapRerolled = true;
					canRerollMap = false;
				} else {
					validPlay = false;
				}
			} else if (useCard == "Sabotage") {
				if (sabotage[0]) {
					sabotage[0] = false;
				} else {
					validPlay = false;
				}
			} else if (useCard == "Reroll pack") {
				discardsLeft = Math.min(5,handSize(false) - 1);
			}
			
			if (gamesWon == gameGoal) {
				changePhase();
			} else if (gamesLost == gameGoal) {
				plrAlive = false;
				changePhase();
			}
		} else {
			validPlay = false;
			if (useCard != "Race card - Random") {
				discardsLeft--;
			}
			
			if (discardsLeft == 0) {
				if (sabotage[2]) {
					sabotage[1] = false;
					sabotage[2] = false;
				} else {
					createPack(true);
				}
			}
		}
		
		updateSubtitle(false,false,validPlay);
	}
}

function updateSubtitle(trigDraft, trigPrep, trigPlay) {
	if (discardsLeft > 0) {
		if (sabotage[2]) {
			document.getElementById("games").innerHTML = "Sabotage played on you! Discards left: "+discardsLeft;
		} else {
			document.getElementById("games").innerHTML = "You played Reroll pack! Discards left: "+discardsLeft;
		}
	} else {
		document.getElementById("games").innerHTML = "Pairing score: "+gamesWon+" - "+gamesLost+"<br />Hand size: " +  handSize(trigDraft, trigPrep, trigPlay);
	}
}

function handSize(trigDraft, trigPrep, trigPlay) {
	cardCount = 0;
	var handCollection = document.getElementById("yourcards");
	handCount = handCollection.childNodes.length;
	var selNode;
	
	var recycleUsed = false;
	
	for (var n = 0; n < handCount; n++) {
		selNode = handCollection.childNodes[n];
		if (selNode.nodeName == "IMG" && selNode.style.display != "none") {
			cardCount++;
			
			if (trigDraft) {
				switch (selNode.alt) {
					case "Recycler":
						if (!recycleUsed) {
							createCard("yourcards","reroll");
							cardCount++;
							recycleUsed = true;
						}
						break;
				}
			}
		}
	}
	
	return cardCount;
}
