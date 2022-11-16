var nuStaticData;

function connectNuAPI() {
	if (XMLHttpRequest) {
		var apiRequest = new XMLHttpRequest();
		apiRequest.open("GET", "https://api.planets.nu/static/all", true);
		
		apiRequest.send();
		
		apiRequest.onreadystatechange = function() {
			if (apiRequest.readyState === 4) {
				if (apiRequest.status == 200) {
					nuStaticData = JSON.parse(apiRequest.responseText);
					startProgram();
				}
			}
		}
	}
}

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
			} else if (evName = "change") {
				object.onchange = fnName;
			} else if (evName = "blur") {
				object.onblur = fnName;
			}
		}
	} catch(err) {
		throwError(err);
	}
}

function getQueryParam(param) { 
	var query = window.location.search.substring(1); 
	var vars = query.split("&"); 
	for (var i=0;i<vars.length;i++) { 
		var pair = vars[i].split("="); 
		if (pair[0] == param) { 
			return pair[1]; 
		} 
	}
	return -1; //not found 
}
