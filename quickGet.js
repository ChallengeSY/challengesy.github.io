function getParam(param) { 
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
