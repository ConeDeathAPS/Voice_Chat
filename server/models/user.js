var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	username: String,
	email: String,
	password: String,
	salt: String,
	dob: Date,
	created_at: {type: Date, default: Date.now},
	updated_at: {type: Date, default: Date.now},
	status: String,
	admin: Boolean
})

//updated_at will be used to track past activity
//status will be Online, Offline, or Away
//admins will have access to the admin page with the admin controller

var user = mongoose.model('user', UserSchema);