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

io.sockets.on('connection', function (socket) {
	console.log("New connection ID " + socket.id);
	socket.on("new_user_logged_in", function (username) {
		socket.broadcast.emit('new_connection', {name: username.username});	
		socket.emit('welcome_message', {message: "Welcome! " + users.length + " people are online!"});
		users.push({socket_id: socket.id, username: username.username});	
		console.log("New user bcast sent");
		console.log("Users array->");
		console.log(users);

	});
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
		socket.broadcast.emit('user_left', {name: logged_username});
		console.log("User logoff message sent for " + logged_username);

	});
	socket.on("new_message_bcast", function (message) {
		console.log("Incoming standard message detected");
		io.emit("incoming_message", {message: message.message, author: message.username});
		console.log("Finished message bcast.");
	});
	

})