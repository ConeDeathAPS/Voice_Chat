speakeasy.factory('adminFactory', function($http) {
	var errors = [];
	var factory = {};

	//methods here
	factory.changeInputClass = function (id) {
		//when the edit button is clicked, enable the form
		if ($(".input_" + id).attr('disabled')) {
			// console.log("Enabling form");
			$(".input_" + id).removeAttr('disabled');
			$("#delete_" + id).removeAttr('disabled');
			$("#change_" + id).removeAttr('disabled');
			$("#control_" + id).html("Stop Editing User");	
			return true;		
		}
		//if they click it again, disable the form
		if (!($(".input_" + id).attr('disabled'))) {
			// console.log("Disabling form");
			$(".input_" + id).attr('disabled', 'disabled');	
			$("#delete_" + id).attr('disabled', 'disabled');
			$("#change_" + id).attr('disabled', 'disabled');
			$("#control_" + id).html("Edit User");	
			return true;	
		}
	}

	factory.updateUser = function (changes) {
		$http.post('/users')
		.then(function (response) {
			console.log("User update success.");
			errors = [];
			return errors
		}).then(function (response) {
			console.log("User update failed.");
			errors.push("?User update failed.");
			return errors;
		})
	}

	return factory;
});