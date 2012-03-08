var http = require('http'), 
        io = require('socket.io');
var express = require('express');
var sys = require('sys');
	
var app = express.createServer(express.staticProvider(__dirname + '/public'));
app.listen(80);


var board_sol = [
	             [7, 6, 9, 1, 8, 2, 4, 3, 5],
	             [1, 3, 5, 7, 6, 4, 8, 9, 2],
	             [2, 8, 4, 5, 3, 9, 6, 1, 7],
	             [5, 1, 6, 3, 7, 8, 2, 4, 9],
	             [8, 7, 2, 4, 9, 1, 5, 6, 3],
	             [9, 4, 3, 2, 5, 6, 7, 8, 1],
	             [6, 5, 8, 9, 2, 3, 1, 7, 4],
	             [3, 2, 1, 6, 4, 7, 9, 5, 8],
	             [4, 9, 7, 8, 1, 5, 3, 2, 6]
	            ];

var board_start = [
                   [7, 6, 0, 1, 8, 0, 4, 0, 5],
                   [1, 3, 5, 7, 0, 0, 8, 0, 2],
                   [2, 0, 0, 5, 0, 9, 6, 1, 7],
                   [5, 0, 6, 0, 0, 8, 0, 4, 9],
                   [0, 7, 2, 4, 9, 1, 5, 0, 3],
                   [0, 4, 3, 2, 0, 0, 0, 0, 1],
                   [0, 0, 0, 0, 0, 0, 0, 7, 4],
                   [0, 2, 1, 6, 4, 7, 9, 0, 8],
                   [4, 9, 0, 8, 1, 5, 0, 2, 6]                   
                  ];

var board_neutral = new Array();
for (var i = 0; i < 9; i++){
	board_neutral[i] = new Array();
	for (var j = 0; j < 9; j++) {
		board_neutral[i][j] = board_start[i][j];
	}
}

var board_game = new Array();
for (var i = 0; i < 9; i++){
	board_game[i] = new Array();
	for (var j = 0; j < 9; j++) {
//		board_game[i][j] = board_start[i][j];
		board_game[i][j] = 0;
	}
}

var socket = io.listen(app, {resource: "data"});

socket.on('connection', function(client){

  client.on('message', function(data){
	  var msg = JSON.parse(data);
	  console.log("message: " + sys.inspect(msg, true));
	  var reply;
	  if (msg.command == "put"){
		  if (board_neutral[msg.row][msg.col] != 0) {
			  reply = {elems: [{command: "neutral", row : msg.row, col: msg.col, value: board_neutral[msg.row][msg.col]}]};
		  }else if (board_sol[msg.row][msg.col] == msg.value){
			  board_game[msg.row][msg.col] = msg.value;
			  reply = {elems: [{command: "correct", row : msg.row, col: msg.col, value: msg.value}]};
		  } else {
			  board_game[msg.row][msg.col] = msg.value;
			  reply = {elems: [{command: "wrong", row : msg.row, col: msg.col, value: msg.value}]};
		  }
		  client.broadcast(JSON.stringify(reply));		  
	  } else if (msg.command == "get_state") {
		  var reply = new Object();
		  reply.elems = new Array();

		  for (var i = 0; i < 9; i++) {
			  for (var j = 0; j < 9; j++) {
				  if (board_neutral[i][j] != 0) {
					  reply.elems.push({command: "neutral", row : i, col: j, value: board_neutral[i][j]});
				  }
			  }
		  }
		  for (var i = 0; i < 9; i++) {
			  for (var j = 0; j < 9; j++) {
				  if (board_game[i][j] != 0) {
					  var str = board_game[i][j] == board_sol[i][j]? "correct" : "wrong";
					  reply.elems.push({command: str, row : i, col: j, value: board_game[i][j]});
				  }
			  }
		  }

	  }
	  
	  console.log("reply: " + sys.inspect(reply, true));
	  client.send(JSON.stringify(reply));		  
	  
  });

  client.on('disconnect', function(){});
});

