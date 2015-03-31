var midi = require('midi');
var io = require('socket.io')(5000);

var input = new midi.input();

console.log(input.getPortCount());
console.log(input.getPortName(0));


var sockets = [];

io.on('connection', function(socket) {
	sockets.push(socket);
	socket.on('message', function(message) {
		console.log('>', message);
	});
	socket.on('disconnect', function() {
		sockets = sockets.filter(function(e) { return e !== socket; });
	});
});


input.on('message', function(deltaTime, message) {
	sockets.forEach(function(socket) {
		socket.send({data: message, delta: deltaTime});
	})
});

input.openPort(0);

/*
> node korg.js

~elsewhere~

define(function(require) {
	var socket = io('ws://localhost:5000/');
	var vars = {};
	for(var i=0; i<64; i++) {
		vars[i] = 0.0;
	}

	socket.on('connect', function() {
		socket.send('hi');
		socket.on('message', function(message) {
			vars[message.data[1]] = message.data[2];
		});
	});

	return vars;
});

*/