var express = require("express");

var app = express();

app.use(express.static(__dirname + "/client"));

var bodyParser = require("body-parser");

app.use(bodyParser.json({extended: true}));

require('./server/config/mongoose.js');

var routes = require("./server/config/routes.js");

routes(app);

var port = 1234;

var server = app.listen(port, function() {
  console.log("|-------------------------------|")
  console.log("|--------------"+port+"-------------|")
  console.log("|-------------------------------|")
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
	console.log("New connection ID " + socket.id);
	socket.on("new_user_logged_in", function (username) {
		socket.broadcast.emit('new_connection', {username: username});		
	});
	

})