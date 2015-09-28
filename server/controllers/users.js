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
			console.log(req.body.adminKey);
			console.log("VRferrichastygar-frillynuance");
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
			console.log("Retrieving info for req.body.email");
			Users.find({email: req.body.email}, function (err, user) {
				if (err) {
					console.log("Error getting user from database");
					res.json({});
				} else if (user) {
					console.log(user);
					res.json(user);				
				} else {
					console.log("Could not find user.");
					res.json({});
				}

			})
		},

		update: function (req, res) {
			
		},

		destroy: function (req, res) {
			
		}
	}
})();