function dispImage(filename, altTxt) {
	document.write("<p class=\"noKeywords center\"><a href=\"" + filename + "\"><img src=\"" + filename + "\" alt=\"" + altTxt + "\" /></a></p>");
}

function turnPic(ep, turn) {
	dispImage("ep"+ep+"turn"+turn+".png","Economic Phase "+ep+" / Turn "+turn);
}

function turnRow(ep) {
	document.write("<p class=\"noKeywords center\">\
		<a href=\"ep"+ep+"turn1.png\"><img src=\"ep"+ep+"turn1.png\"\" alt=\"Eco Phase "+ep+" / Trn 1\" /></a>\
		<a href=\"ep"+ep+"turn2.png\"><img style=\"margin-left: 3%; margin-right: 3%;\" src=\"ep"+ep+"turn2.png\"\" alt=\"Eco Phase "+ep+" / Trn 2\" /></a>\
		<a href=\"ep"+ep+"turn3.png\"><img src=\"ep"+ep+"turn3.png\"\" alt=\"Eco Phase "+ep+" / Trn 3\" /></a></p>");
}

alienOpponents = [new alienPlayer("Red"), new alienPlayer("Green"), new alienPlayer("Yellow")];
