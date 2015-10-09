var express = require("express");

var app = express();

app.use(express.static(__dirname + "/client"));

var bodyParser = require("body-parser");

app.use(bodyParser.json({extended: true}));

require('./server/config/mongoose.js');

var routes = require("./server/config/routes.js");

routes(app);

var port = process.env.PORT || 1234;

var server = app.listen(port, function() {
  console.log("|-------------------------------|")
  console.log("|--------------"+port+"-------------|")
  console.log("|-------------------------------|")
});

var io = require('socket.io').listen(server);
var users = [];
var userID = 'answerer';

io.sockets.on('connection', function (socket) {
	console.log("New connection ID " + socket.id);
	socket.on("new_user_logged_in", function (username) {
		socket.broadcast.emit('new_connection', {name: username.username});	
		socket.emit('welcome_message', {message: "Welcome! " + users.length + " people are online!", users: users.length});
		users.push({socket_id: socket.id, username: username.username});	
		console.log("New user bcast sent");
		console.log("Users array->");
		console.log(users);
	});
	socket.on('handshake', function (data) {
		console.log("Handshake request...");
		socket.broadcast.emit("handshake_request", data);
	});
	socket.on('got_handshake', function (data) {
		console.log("Handshake response...");
		socket.broadcast.emit('handshake_response', data);
	});
	socket.on('sdpOffer', function (data) {
		console.log("SDP exchange step 1...");
		socket.broadcast.emit('sdpOlive_branch', data);
	});
	// socket.on("ICE_offer", function (data) {
	// 	console.log("exchanging ICE info part 1...");
	// 	socket.broadcast.emit('ICE_offer_create', data);
	// });
	socket.on('sdpAnswer', function (data) {
		console.log("SDP exchange step 2...");
		socket.broadcast.emit('sdpResponse', data);
	});
	// socket.on('ICE_answer', function (data) {
	// 	console.log("exchanging ICE info part 2...");
	// 	socket.broadcast.emit('ICE_answer_create', data);
	// });
	
	socket.on('disconnected', function () {
		var logged_username;
		console.log("user logoff detected");
		//remove the disconnected user from the users array
		for (i = 0; i < users.length; i++) {
			console.log("Looking in users array for leaving user at socket " + socket.id);
			if (users[i].socket_id == socket.id) {
				console.log("Found user " + users[i].username + " at index " + i + ". Removing.");
				logged_username = users[i].username;
				users.splice(i, 1);
			}
		}
		socket.emit('you_left', {name: logged_username});
		socket.broadcast.emit('user_left', {name: logged_username});
		console.log("User logoff message sent for " + logged_username);
	});
	socket.on('disconnect', function () {
		var logged_username;
		console.log("user abrupt leave detected");
		for (i = 0; i < users.length; i++) {
			console.log("Looking in users array for leaving user at socket " + socket.id);
			if (users[i].socket_id == socket.id) {
				console.log("Found user " + users[i].username + " at index " + i + ". Removing.");
				logged_username = users[i].username;
				users.splice(i, 1);
			}
		}
		console.log(logged_username)
		socket.broadcast.emit('user_left', {name: logged_username});
		console.log("User logoff message sent for " + logged_username);
		socket.emit('you_left', {name: logged_username});

	})
	socket.on("new_message_bcast", function (message) {
		console.log("Incoming standard message detected");
		io.emit("incoming_message", {message: message.message, author: message.username});
		console.log("Finished message bcast.");
	});
	

})