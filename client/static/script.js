var speakeasy = angular.module('speakeasy', ['ngRoute', 'ngCookies', 'angular-md5']);

	speakeasy.config(function ($routeProvider) {
		$routeProvider
		.when('/', {
			templateUrl: '/static/partials/lander.html'
		})
		.when('/chat', {
			templateUrl: '/static/partials/chatter.html'
		})
	})

speakeasy.factory('userFactory', function($http, md5) {
	var errors = [];
	var users = [];
	var user = {};
	var factory = {};
	//===============================BEGIN INITIALIZATIOM===========================//
	factory.getUsers = function (grabUsers) {
		if (user.admin) {
			$http.get('/users')
			.then(function (response) {
				console.log("Function getUsers response: " + response);
				users = response.data;
				grabUsers(users);
			}, function (response) {
				console.log("Function getUsers http get failed.");
				errors.push["Failed to get other users."];
			});
		}
	}

	factory.getCurrentUser = function(grabCurrentUser) {
		grabCurrentUser(user);
		// console.log(user);
	}
	//===============================END INITIALIZATIOM===========================//
	
	factory.getLoginInfo = function (login_info, callback) {
		errors = [];
		console.log("http.put activated");
		$http.put('/users', login_info)
		.then(function (response) {
			if (response.data[0]) {
				console.log(response);
				var user_info = response.data[0];
				validateLogin(user_info, login_info, callback);				
			} else {
				console.log("User not found!");
				errors.push("I couldn't find that email in the database, try again!");
				callback(errors, {});
			}

		})
	}

	var validateLogin = function (user_info, login_info, callback) {
		console.log("login validation activated");
		var salt = user_info.salt;
		var password = login_info.password;
		var check_pw = password + " " + salt;
		var enc_check_pw = md5.createHash(check_pw);
		// console.log(user_info.password);
		// console.log(enc_check_pw);s
		if (enc_check_pw === user_info.password) {
			user = user_info;
			errors = [];
			callback(errors, user);
		} else {
			console.log("passwords do not match");
			errors.push("Invalid password. Try again.");
			callback(errors, user);
		}

	}
	//============================BEGIN USER REGISTRATION===========================//
	//if all validation is passed, then add the user to the database
	var createUser = function (newUser) {
		$http.post('users', newUser)
		.then(function (user_data) {
			console.log("User added successfully");
			user = user_data;
		}, function (response) {
			console.log("User addition failed");
		})
	}

	//escape inputs as strings
	factory.validateUserInput = function (newUser) {
		newUser.fn = String(newUser.fn);
		newUser.ln = String(newUser.ln);
		newUser.email = String(newUser.email);
		newUser.username = String(newUser.username);
		newUser.pw1 = String(newUser.pw1);
		newUser.pw2 = String(newUser.pw2);
		validateUserAgainstOthers(newUser);
	}

	var validateUserAgainstOthers = function (newUser) {
		var new_name = newUser.fn + " " + newUser.ln;
		for (each in users) {
			var check_name = users[each].first_name + " " + users[each].last_name;
			if (newUser.email === users[each].email) {
				console.log("Duplicate email entered");
				errors.push("That email already exists!");
				return errors;
			} else if (new_name === check_name) {
				console.log("That name already exists!");
				errors.push("That name already exists!");
				return errors;
			}
		}
		createUser(newUser);
	}
	//============================END USER REGISTRATION===========================//

	return factory;
});

speakeasy.controller('usersController', function ($scope, $location, $rootScope, $cookies, userFactory, md5) {
	var that = this;
	that.errors = [];
	that.users = [];
	that.errors = [];

	userFactory.getUsers(function (data) {
		that.users = data;
		if ($cookies.get('first_name')) {
				that.user.first_name = $cookies.get('first_name');
				that.user.last_name = $cookies.get('last_name');
				that.user.username = $cookies.get('username');
				that.user.email = $cookies.get('email');
				that.user.dob = $cookies.get('dob');
				console.log(that.user);
		} else {
			userFactory.getCurrentUser(function (data) {
				that.user = data;
			})
		}
	})

	that.getUserInfo = (function () {
		userFactory.getCurrentUser(function (data) {
			that.user = data;
			console.log(that.user);
		})
	})();

	that.loginUser = function () {
		that.errors = [];
		userFactory.getLoginInfo(that.login, function (errs, usr) {
			if (errs[0] === undefined) {
				$location.path('/chat');
				that.user = usr;
				console.log(that.user);
				console.log('login success!');
			} else {
				that.errors = errs;
				console.log(that.errors);
			}
		});
	}

	//===============================BEGIN ADDING A USER=============================//
	//begins the behind the scenes validation process, also initiates password encryption
	that.registerUser = function () {
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
		that.errors = (userFactory.validateUserInput(that.newUser));
		if (that.errors === undefined) {
			that.newUser = {};
			$location.path('/chat');
			userFactory.getCurrentUser(function (data) {
				that.user = data;
			})	
			console.log(that.user);
		}

	}

	//generates a random 5 character string
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

	that.gotoChatter = function () {
		console.log('doing this');
		$location.path('/chat');
	}

	that.logout = function () {
		// console.log('got here');
		that.user = {};
		$location.path("/");
	}

})

speakeasy.factory('adminFactory', function() {
	var errors = [];
	var users = [];
	var factory = {};
	
	//methods here
	

	return factory;
});

speakeasy.controller('adminsController', function ($scope, $location, $cookies, userFactory, adminFactory, md5) {
	var that = this;
	that.errors =[];
	that.admins = [];
	that.users = [];



})