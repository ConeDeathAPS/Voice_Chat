speakeasy.controller('usersController', function ($scope, $location, $rootScope, $cookies, userFactory, md5, socketFactory) {
	var that = this;
	that.errors = [];
	that.users = [];
	that.errors = [];


	//get all users for the user_monitor
	userFactory.getUsers(function (data) {
		that.users = data;
	})

	//get the user's info from the factory. This is run every time the page loads.
	that.getUserInfo = function () {
		userFactory.getCurrentUser(function (data) {
			// console.log(data);
			that.user = data;
			// console.log(that.user);
		})
	};

	//initialize login validation functions.
	that.loginUser = function () {
		that.errors = [];
		//make sure they entered all information
		if (that.login === undefined) {
			that.errors.push("Please enter your stuff to login!");
			return false;
		} else if (that.login.email === undefined) {
			that.errors.push("Please enter your email");
			return false;
		} else if (that.login.password === undefined) {
			that.errors.push("Please enter your password");
			return false;
		}

		userFactory.getLoginInfo(that.login, function (errs, usr) {
			if (errs[0] === undefined) {
				that.login = {};
				that.user = usr;
				console.log(that.user.username);
				userFactory.updateStatus("Online", that.user.username, function (data) {
					that.users = data;
					console.log(that.users);
				});
				socketFactory.getCurrentUser(that.user.username);
				$location.path('/chat');				
				// console.log(that.user);
				// console.log('login success!');
			} else {
				that.errors = errs;
				// console.log(that.errors);
			}
		});
	}

	//===============================BEGIN ADDING A USER=============================//
	//begins the behind the scenes validation process, also initiates password encryption
	that.registerUser = function () {
		that.errors = [];
		//make sure all inputs were filled in
		if (that.newUser === undefined) {
			that.errors.push("You gotta enter stuff!");
			return false;
		} else if (that.newUser.fn === undefined) {
			that.errors.push("Enter your first name!");
			return false;
		} else if (that.newUser.ln === undefined) {
			that.errors.push("Enter your last name!");
			return false;
		} else if (that.newUser.email === undefined) {
			that.errors.push("Enter your email address!");
			return false;
		} else if (that.newUser.username === undefined) {
			that.errors.push("Enter your username!");
			return false;
		} else if (that.newUser.pw1 === undefined) {
			that.errors.push("Enter your password!");
			return false;
		} else if (that.newUser.dob === undefined) {
			that.errors.push("Enter your date of birth!");
			return false;
		} 
		//if all data was entered, then start validation and encrypt password+salt
		if (that.newUser.pw1 === that.newUser.pw2) {
			var salt = randomSalt();
			var password = that.newUser.pw1 + " " + salt;
			// console.log(password);
			that.newUser.salt = salt;
			that.newUser.status = "Online";
			that.newUser.pw1 = md5.createHash(password || "");
			// console.log(that.newUser.pw1);
		} else {
			that.errors.push("Your passwords to not match!");
			return false;
		}
		//this runs validation and if there are any errors it will break
		that.errors = userFactory.validateUserInput(that.newUser);
		if (that.errors === undefined) {
			that.newUser = {};
			$location.path('/');
			that.errors = ["Registration successful, please login."];
		}
	}

	//generates a random 5 character string for use as a salt
	var randomSalt = function () {
		var salt = "";
		var string = "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()-=_+[]{}|,./<>?;:";
		var nums = [Math.floor(Math.random() * 63), Math.floor(Math.random() * 63), Math.floor(Math.random() * 63), Math.floor(Math.random() * 63), Math.floor(Math.random() * 63)];
		for (i = 0; i < 5; i++) {
			salt += string[nums[i]];
		}
		// console.log(salt);
		return salt;
	}		
	//===============================END ADDING A USER=============================//
	//function for the go to chatter button for dev work only
	that.gotoChatter = function () {
		console.log('doing this');
		$location.path('/chat');
	}
	//function for logout.
	that.logout = function () {
		// console.log('got here');
		console.log("Logging out");
		userFactory.updateStatus("Offline", that.user.username, function (data) {
			that.users = data;
			console.log(that.users);
		});
		that.user = {};
		$location.path("/");
	}
})

speakeasy.controller('socketsController', function ($scope, socketFactory, userFactory) {
	var that = this;
	that.username = "";
	var socket = io.connect();

//The way this controller works is that all socket listeners and emitters will be HERE in the controller. All HTML modification and clientside updates are provided by the factory. Most of these socket listeners will simply call a factory function.

	socketFactory.setCurrentUser(function (data) {
		that.username = data;
	})

	that.logout = function () {
		console.log('sending user logoff message for ' + that.username);
		socket.emit('disconnected', {user: that.username});
	}

	that.firstEmit = (function () {
		console.log("sending new user emit");
		socket.emit('new_user_logged_in', {username: that.username});	
	})();

	that.sendMessage = function () {
		console.log("New message received. Contents ->");
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
		console.log("New user detected: " + username);
		socketFactory.newUser(username);
	})

	socket.on('user_left', function (data) {
		socketFactory.userLogoff(data);
	})
})

speakeasy.controller('adminsController', function ($scope, $location, $cookies, userFactory, adminFactory, md5, socketFactory) {
	var that = this;
	that.errors =[];
	that.admins = [];
	that.users = [];



})