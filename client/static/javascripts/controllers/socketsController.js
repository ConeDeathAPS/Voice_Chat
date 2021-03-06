speakeasy.controller('socketsController', function ($scope, socketFactory, userFactory) {
	var that = this;
	that.username = "";
	that.users_online;
	var userID;
	var audio = document.getElementById("audio_player");

	// that.joinRoom = function () {
	// 	console.log("Joining room...");
	// 	userID = 'answerer'
	// 	socket && socket.send({
	// 		participant: true,
	// 		userID: userID
	// 	});
	// }

	var socket = io.connect();
//=================================BEGIN RTCPC FUNCTIONS===============================//
	//===============================OFFERER FUNCTIONS============================//
socket.on('connect', onconnect);
socket.on('handshake_request', oncallbackanswerer);
socket.on('handshake_response', oncallbackofferer);
socket.on('sdpOlive_branch', getSDP);
socket.on('sdpAnswer', processAnswerIfOfferer);

//socket is now opened, need to transmit request
function onconnect () {
	console.log("Looking for other users...");
	transmitRequest();
}
//we have not yet found a participant
var foundParticipant = false;
// send handshake request once per second until we get a response that we have found a participant
function transmitRequest() {
	userID="offerer";
	if (!foundParticipant) {
		// console.log("Sending handshake request...");
		socket.emit('handshake', {
			userID: userID,
			type: 'request_to_join'
		});		
	}
	setTimeout(transmitRequest, 1000);
}
//when we receive handshake response
function oncallbackofferer(response) {
	console.log("Received handshake confirmation...");
	// console.log("Response: ", response);
	if (response.userID === userID) {
		console.log("userIDs are the same.");
		return;
	}
	if (response.participant) {
		foundParticipant = true;
		createOffer();
	}
	if (response.sdp) {
		processAnswerIfOfferer(response);
	}
}

var peer;
//create an offer with user info and stream
function createOffer() {
	console.log("Creating SDP Offer...");
	peer = RTCPeerConnection({
		onOfferSDP: sendOfferSDP,
		onICE: function(candidate) {
			// console.log("sending sdpOffer");
			// console.log(candidate);
			socket.emit('ICE_offer', {
				userID: userID,
				candidate: {
					sdpMLineIndex: candidate.sdpMLineIndex,
					candidate: JSON.stringify(candidate.canditate)
				}
			});
		},
		onRemoteStream: function (stream) {
			if (stream) {
				remoteStream = stream;
				console.log("Adding remote stream...");
				audio.src = webkitURL.createObjectURL(stream);
			}
		},
		attachStream: localStream
	});
}
//emits SDP information
function sendOfferSDP(sdp) {
	console.log("Sending offer...");
	var sdp = JSON.stringify(sdp);

	socket.emit('sdpOffer', {
		userID: userID,
		sdp: sdp
	});
}

var answerSDP = {};
//got answer SDP
function processAnswerIfOfferer (response) {
	console.log("Processing answer...");
	if (response.sdp) {
		var JSON_sdp = JSON.parse(response.sdp);
		peer.addAnswerSDP(JSON_sdp);
	}
}

	//===============================ANSWERER FUNCTIONS============================//
//gets the SDP answer and sends it to the process function
function getSDP (response) {
	processAnswerIfAnswerer(response);
}

function oncallbackanswerer(response) {
	userID = 'answerer';
	console.log("Got handshake request!");
	// console.log("Response: ", response);
	if (response.userID === userID) {
		return;
	}
	if (response.type && response.type === 'request_to_join') {
		console.log("Sending handshake confirmation...");
		socket.emit('got_handshake', {
			participant: true,
			userID: userID
		});
	}
}
//emits SDP information
function sendAnswerSDP(sdp) {
	console.log("Sending answer...");
	var sdp = JSON.stringify(sdp);

	socket.emit('sdpAnswer', {
		userID: userID,
		sdp: sdp
	});
}
var peer;
//create an offer with user info and stream
function createAnswer(offer_sdp) {
	console.log('Creating answer...');
	peer = RTCPeerConnection({
		offerSDP: offer_sdp,
		onAnswerSDP: sendAnswerSDP,
		onICE: function(candidate) {
			// console.log("Sending answer");
			socket.emit('ICE_answer', {
				userID: userID,
				candidate: {
					sdpMLineIndex: candidate.sdpMLineIndex,
					candidate: JSON.stringify(candidate.canditate)
				}
			});
		},
		onRemoteStream: function (stream) {
			if (stream) {
				remoteStream = stream;
				console.log("Adding remote stream...");
				audio.src = webkitURL.createObjectURL(stream);
			}
		},
		attachStream: localStream
	});
}
//parse the answer that was received
function processAnswerIfAnswerer (response) {
	console.log("Received sdp offer.");
	// console.log("SDPoffer: ", response);
	if (response.sdp) {
		var answerSDP = JSON.parse(response.sdp);
		createAnswer(answerSDP);
	}
}


//=================================END RTCPC FUNCTIONS===============================//

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
		if (!that.chat.message) {
			return false;
		} else if (that.chat.message === " " || that.chat.message === "") {
			return false;
		}
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
		that.users_online = data.users;
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

	socket.on('you_left', function (data) {
		console.log("Updating status for abrupt logoff: ", data);
		userFactory.updateStatus('Offline', data.name, function (data) {

		});
	})
})
