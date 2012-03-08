// addEvent By Scott Andrew
function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener)	{
		elm.addEventListener(evType, fn, useCapture);
		return true;
	} 
	else if (elm.attachEvent) {
		var r = elm.attachEvent("on"+evType, fn);
		return r;
	}
}

function addEventById(Id, evType, fn, useCapture) {
	addEvent(document.getElementById(Id), evType, fn, useCapture);
}