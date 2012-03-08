
function addEvent(elm, evType, fn, useCapture) {
	if (elm.addEventListener) {
		elm.addEventListener(evType, fn, useCapture);
		return true;
	} else if (elm.attachEvent) {
		var r = elm.attachEvent("on" + evType, fn);
		return r;
	}
}

function addEventById(Id, evType, fn, useCapture) {
	addEvent(document.getElementById(Id), evType, fn, useCapture);
}

var d = document;

var tm = 0;
var isTimerFrozen = true;
var solved = false;
var isLoaded = false;

var done = true;

addEvent(window, "load", game_init);
io.setPath("/");
var socket = new io.Socket('88.198.28.27', {
	resource : "data"
});
socket.connect();

function game_init() {
	game_new();


	socket.on('connect', function() {
		var msg = {
			command : "get_state"
		};
		socket.send(JSON.stringify(msg));
	});

	function show_responce(info) {
		var tdid = 'td' + info.col + info.row;
		var s;
		var new_val = (info.value != 0 ? info.value : '');
		if (info.command == "correct") {
			s = '<p class="solR"><span class="n' + info.value + '>' + new_val + '</span></p>';			
		} else if (info.command == "wrong") {
			s = '<p class="solW"><span class="n' + info.value + '>' + new_val +'</span></p>';						
		} else if (info.command == "neutral") {
			s = '<p class="base"><span class="n' + info.value + '>' + new_val +'</span></p>';			
		}
		d.getElementById(tdid).innerHTML = s;
	}

	socket.on('message', function(data) {
		var msg = JSON.parse(data);
		var elems = msg.elems;
		for (var i = 0; i < elems.length; i++) {
			show_responce(elems[i]);
		}
		// Hide numz pane
		d.getElementById('numz').style.top = "-10000px";
	});

}

function game_new() {
	d.getElementById('numz').style.top = "-10000px";
}

function f(i, j) {
	var s_elem = d.getElementById('td' + i + j);
	if (s_elem) {
		var s_value = s_elem.s_value;
		if (!s_value) {
			s_elem.s_value = 0;
			s_value = s_elem.s_value;
		}
		if (s_value == 0) {
			var dl = d.getElementById('numz');
			dl.classname = "dl" + i + j;

			var t = j * 41;
			var l = i * 41 + 30;

			dl.style.top = t + "px";
			dl.style.left = l + "px";
		}

	}
}


function putnum(m1) {
	var i = parseInt(d.getElementById('numz').classname.charAt(2));
	var j = parseInt(d.getElementById('numz').classname.charAt(3));
	setnum(m1, i, j);
}

function setnum(new_value, i, j) {
	if ((typeof (i)).indexOf("undefined") != -1 || (typeof (j)).indexOf("undefined") != -1)
		return;

	socket.send(JSON.stringify({command: "put", row: j, col: i, value: new_value}));
}

function gen_table() {
	var s = '<dl class="dl__" id="numz"><dt><a onclick="putnum(-1);"></a></dt><dt><a onclick="putnum(0);"></a></dt><dt><a onclick="putnum(-1);"></a></dt><dt><a onclick="putnum(1);"></a></dt><dt><a onclick="putnum(2);"></a></dt><dt><a onclick="putnum(3);"></a></dt><dt><a onclick="putnum(4);"></a></dt><dt><a onclick="putnum(5);"></a></dt><dt><a onclick="putnum(6);"></a></dt><dt><a onclick="putnum(7);"></a></dt><dt><a onclick="putnum(8);"></a></dt><dt><a onclick="putnum(9);"></a></dt></dl>';

	s += '<ul id="tab">\n';

	for (var i = 0; i <= 8; i++)
		for (var j = 0; j <= 8; j++) {
			var cl = 'class=\"' + ((j == 2 || j == 5) ? 'r' : '')
					+ ((i == 2 || i == 5) ? 'b' : '') + '\"';
			s += '<li id=\"td' + j + i + '\" ' + cl + 'onclick=\"f(' + j + ','
					+ i + ')\"' + '></li>\n';
		}

	s += '</ul>\n';
	d.write(s);
}