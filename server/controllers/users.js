var mongoose = require('mongoose');
var Users = mongoose.model('user');

module.exports = (function () {
	return {
		index: function (req, res) {
			Users.find({}, function (err, users) {
				if (err) {
					console.log(err);
					res.json({});
				} else {
					res.json(users);
				}
			})
		},

		create: function (req, res) {
			//check for the admin key, if it is set to the correct string then make them an admin
			// console.log(req.body.adminKey);
			// console.log("VRferrichastygar-frillynuance");
			var privileges = false;
			if (req.body.adminKey) {
				if (req.body.adminKey === "VRferrichastygar-frillynuance")
				{
					privileges = true;					
				}
			}
			//set the object relationships from the post data
			var user = new Users({first_name: req.body.fn, last_name: req.body.ln, username: req.body.username, email: req.body.email, password: req.body.pw1, salt: req.body.salt, dob: req.body.dob, status: req.body.status, admin: privileges});
			//save the user to the database
			user.save(function (err, product) {
				if (err) {
					console.log("error adding user to the database");
					res.json({});
				} else {
					//if addition was successful, then send back the new JSON
					res.json(product);
				}
			})
		},

		findOne: function (req, res) {
			console.log("Retrieving info for " + req.body.email);
			Users.find({email: req.body.email}, function (err, user) {
				if (err) {
					console.log("Error getting user from database");
					res.json({});
				} else if (user) {
					// console.log(user);
					res.json(user);				
				} else {
					console.log("Could not find user.");
					res.json({});
				}

			})
		},

		updateStatus: function (req, res) {
			console.log("Got to updateStatus function");
			console.log(req.body);
			//update the status in the db
			var date = new Date();
			var update = {status: req.body.status, updated_at: date},
				options = {new: true};
			Users.findOneAndUpdate({username: req.body.username}, update, options, function (err, user) {
				if (err) {
					console.log("Error updating the user status.");
					res.json({});
				} else {
					// console.log(user);
					console.log(user);
					console.log("Updated status for "+user.username+" to " + req.body.status);
					res.json({user});
				}
			})
		},

		update: function (req, res) {
			console.log("Performing update", req.body);
			var update = {
				first_name: req.body.first_name, 
				last_name: req.body.last_name,
				email: req.body.email,
				username: req.body.username,
				dob: req.body.dob,
				admin: req.body.admin
						},
				options = {upsert: true, new: true};
			Users.findOneAndUpdate({id: req.body.id}, update, options, function (err, user) {
				if (err) {
					console.log("Error updating user information");
					res.json({});
				} else {
					console.log("Successfully updates user information");
					res.json({user});
				}
			})
		},

		destroy: function (req, res) {
			
		}
	}
})();