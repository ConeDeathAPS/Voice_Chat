speakeasy.factory('userFactory', function($http, md5) {
	var errors = [];
	var users = [];
	var user = {};
	var factory = {};
	//===============================BEGIN INITIALIZATIOM===========================//
	factory.initGetUsers = function(callback) {
		getUsers(callback);
	}

	var getUsers = function (grabUsers) {
		$http.get('/users')
		.then(function (response) {
			// console.log("Function getUsers response: " + response);
			//obfuscate the password hashes and salt
			for (each in users) {
				users[each].password = "OBFUSCATED";
				users[each].salt = "OBFUSCATED";
			}
			users = response.data;
			// console.log("All users:");
			// console.log(users);
			grabUsers(users);
		}, function (response) {
			console.log("Function getUsers http get failed.");
			errors.push["Failed to get other users."];
		});
	}

	factory.setUsers = function (callback) {
		callback(users);
	}

	factory.getCurrentUser = function(callback) {
		callback(user);
		console.log(user);
	}
	//===============================END INITIALIZATIOM===========================//
	//when the user logs in or out, update the status of the user
	factory.updateStatus = function (status, username, callback) {
		console.log("username: ", username);
		$http.post('/users/status/', {username: username, status: status})
		.then(function(response) {
			// console.log("finished updating status, getting users.");
			getUsers(callback);
		}, function (response) {
			console.log("Error updating status.");
			return false;
		})
	}

	factory.getLoginInfo = function (login_info, callback) {
		//clear the errors array
		errors = [];
		
		// console.log("http.put activated");
		$http.put('/users', login_info)
		.then(function (response) {
			//if a user is found, return the user, otherwise return errors
			if (response.data[0]) {
				// console.log(response);
				var user_info = response.data[0];
				user = user_info
				validateLogin(user_info, login_info, callback);				
			} else {
				console.log("User not found!");
				errors.push("I couldn't find that email in the database, try again!");
				callback(errors, {});
			}
		})
	}

	var validateLogin = function (user_info, login_info, callback) {
		//compare md5 hash for given pw and retrieved salt to hash stored in db.
		// console.log("login validation activated");
		var salt = user_info.salt;
		var password = login_info.password;
		var check_pw = password + " " + salt;
		var enc_check_pw = md5.createHash(check_pw);
		//if the passwords match then return the user and an empty errors array
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
		// console.log('This is newUser -> ' + newUser);
		$http.post('users', newUser)
		.then(function (response) {
			console.log("User added successfully");
			console.log(response.data);
			user = response.data;
			errors = [];
			return errors;
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
		//Concatenate name to check for uniqueness of name and email
		var new_name = newUser.fn + " " + newUser.ln;
		for (each in users) {
			var check_name = users[each].first_name + " " + users[each].last_name;
			console.log('Names: ' + new_name + " vs " + check_name);
			if (newUser.email === users[each].email) {
				console.log("Duplicate email entered");
				errors.push("That email already exists!");
				return errors;
			} else if (new_name == check_name) {
				console.log("That name already exists!");
				errors.push("That name already exists!");
				return errors;
			}
			else if (newUser.username === users[each].username) {
				console.log("That username already exists!");
				errors.push("That username already exists!");
				return errors;
			}
		}
		createUser(newUser);
	}
	//============================END USER REGISTRATION===========================//

	factory.alertNoAdminAccess = function () {
		alert("You do not have permission to go here");
	}

	return factory;
});
