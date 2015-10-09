speakeasy.controller('adminsController', function ($scope, $location, $cookies, userFactory, adminFactory, md5, socketFactory) {
	var that = this;
	that.errors =[];
	that.admins = [];
	that.users = [];

	userFactory.initGetUsers(function (data) {
		that.users = data;
	})

	that.enableEdit = function (id) {
		adminFactory.changeInputClass(id);
	}

	that.changeUserInfo = function () {
		console.log(that.updateUser);
		if (that.updateUser) {
			that.errors = adminFactory.updateUser(that.updateUser);
			userFactory.initGetUsers(function (data) {
				that.users = data;
			})
		} else {
			that.errors.push("Please make sure that there is information in the fields");
		}

	}


})