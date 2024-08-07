//Storage
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

//Fallback Cookies
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
