speakeasy.factory('socketFactory', function() {
	var factory = {};	
	var username = "";

	var getDateTime = function () {
		var raw_date = new Date();
		var mins = raw_date.getMinutes();
		if (mins < 10) {
			mins = "0" + mins;
		}
		var hours = raw_date.getHours();
		var date = raw_date.getDate();
		var month = raw_date.getMonth();
		var full_date = month + "/" + date + " at " + hours + ":" + mins;
		console.log(full_date);
		return full_date;
	}

	//==============================USER MANAGEMENT===========================//
	factory.getCurrentUser = function(user) {
		username = user;
		// console.log(username);
	}

	factory.setCurrentUser = function (callback) {
		callback(username);
	}
	//==============================MESSAGE HANDLING==========================//

	factory.welcomeMessage = function (data) {
		$('#chat_area').append("<div class='message_holder'><p class='chat_message'>"+data.message+"</p></div>");
	}

	factory.receiveMessage = function (data) {
		var $chat = $("#chat_area");
		var timestamp = getDateTime();
		// console.log(data);
		if (data.author === username) {
			data.author = "You";
		}
		$('#chat_area').append("<div class='message_holder'><p class='chat_message'><span class='bold'>"+data.author+"</span>: " + data.message + "</p><p class='timestamp'>-->" +timestamp+"<--</p></div>");
		$chat.animate({scrollTop: $chat[0].scrollHeight}, 'fast');
	}

	factory.newUser = function (data) {
		var timestamp = getDateTime();
		// console.log(data);
		$("#chat_area").append("<div class='message_holder'><p class='chat_message'><span class='bold'>" + data.name + "</span> logged in! </p><p class='timestamp'>-->" +timestamp+"<--</p></div>");	
		$("#" + data.name).toggleClass(function() {
			// console.log("Checking class");
			if ($(this).attr("class", data.name)) {
				// console.log("Changing class");
				return "Online";
			}
		});
	}

	factory.userLogoff = function (data) {
		var timestamp = getDateTime();
		$('#chat_area').append("<div class='message_holder'><p class='chat_message'><span class='bold'>"+data.name+"</span> left the chat.</p><p class='timestamp'>-->" +timestamp+"<--</p></div>");
		//check the class of that user's tag in the user list and swap it to offline
		$("#" + data.name).toggleClass(function() {
			// console.log("Checking class");
			if ($(this).attr("class", data.name)) {
				// console.log("changing class");
				return "Offline";
			}
		});		
	} 

	return factory;
});