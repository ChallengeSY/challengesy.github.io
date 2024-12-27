var chapter = 0;

function continueStory() {
	chapter++;
	
	document.getElementById("ch"+chapter).style.display = "block";
	fetchButton = document.getElementById("stop"+chapter);
	if (fetchButton) {
		fetchButton.style.display = "none";
	}
}

function finishStory() {
	while (true) {
		chapter++;
		
		fetchChapter = document.getElementById("ch"+chapter)
		if (fetchChapter) {
			fetchChapter.style.display = "block";
		} else {
			break;
		}
		fetchButton = document.getElementById("stop"+chapter);
		if (fetchButton) {
			fetchButton.style.display = "none";
		}
	}
}
