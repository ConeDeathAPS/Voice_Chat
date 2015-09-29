speakeasy.controller('socketsController', function ($scope, socketFactory, userFactory) {
	var that = this;
	that.username = "";
	var socket = io.connect();

//The way this controller works is that all socket listeners and emitters will be HERE in the controller. All HTML modification and clientside updates are provided by the factory. Most of these socket listeners will simply call a factory function.

	socketFactory.setCurrentUser(function (data) {
		that.username = data;
	})

	that.logout = function () {
		// console.log('sending user logoff message for ' + that.username);
		socket.emit('disconnected', {user: that.username});
	}

	that.firstEmit = (function () {
		// console.log("sending new user emit");
		socket.emit('new_user_logged_in', {username: that.username});	
	})();

	that.sendMessage = function () {
		// console.log("New message received. Contents ->");
		// console.log(that.chat.message);
		socket.emit('new_message_bcast', {message: that.chat.message, username: that.username});
		that.chat.message = "";
	}

	socket.on("incoming_message", function (data) {
		socketFactory.receiveMessage(data);
		// console.log(data);
	})

	socket.on("welcome_message", function (data) {
		socketFactory.welcomeMessage(data);
	})

	socket.on("new_connection", function (username) {
		// console.log("New user detected: " + username);
		socketFactory.newUser(username);
	})

	socket.on('user_left', function (data) {
		console.log(data);
		socketFactory.userLogoff(data);
	})
})
