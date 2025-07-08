baseStatFile = "seriesPlay";
window.onbeforeunload = function(event) {confirmLeave(event, "Leaving this game will save your series, but reset your current attempt to the beginning.")};

function finishSeriesGame() {
	var nextGame = !solGame.recordWin;
	var redoGame = false;
	var endSeries = (seriesGame > 3);
	
	if (!nextGame && !endSeries) {
		if (seriesDiff == 1) {
			if (seriesGame < 3) {
				var cardsWorth = bestCasual * seriesLives;
				
				nextGame = confirm("Abort this game and go to the next game in the series? (You will bank $"+cardsWorth+" this way.)");
				if (nextGame) {
					seriesScore += cardsWorth;
					seriesLives++;
					seriesGame++;
					saveSeriesFile(false);
				}
			} else {
				var finalScore = seriesScore + solGame.casualScore * seriesLives;
				if (seriesSeason == 1) {
					finalScore -= 20;
				}
				
				endSeries = confirm("Abort this game and finish this series? (Your final score will be $"+finalScore+".)");
			}
		} else if (seriesLives > 1) {
			redoGame = confirm("Abort this game and start a new game? (This process will deduct one life.)");
			
			if (redoGame) {
				playSound(gameLostSnd);
			}
		} else {
			endSeries = confirm("This is your last life. End this series?");
		}
	}

	if (endSeries) {
		deleteSeriesFile();
		solGame.gameActive = false;
		self.location = "../index.htm";
	} else if (nextGame) {
		solGame.gameActive = false;
		self.location = "index.htm";
	} else if (redoGame) {
		seriesLives--;
		solGame.gameActive = false;
		newGame(false, true);
	}
}