socket.on('connect', onconnect);
socket.on('handshakeConfirm', oncallback);
socket.on('ICE_information', addIce);
socket.on('sdpOffer', processAnswerIfOfferer);
//socket is now opened, need to transmit request
function onconnect () {
	console.log("Sending handshake request");
	transmitRequest();
}
//set some variables
var userID = 'offerer';
var foundParticipant = false;
//send actual request
function transmitRequest() {
	console.log('sent handshake request');
	socket.emit('handshakeRequest', {
		userID: userID,
		type: 'request_to_join'
	});

	!foundParticipant && setTimeout(transmitRequest, 1000);
}
//when we receive response
function oncallback(response) {
	console.log("Received handshake confirmation");
	console.log("Response: ", response);
	if (response.userID === userID) {
		return;
	}
	if (response.participant) {
		foundParticipant = true;
		createOffer();
	}
}

var peer;
//create an offer with user info and stream
function createOffer() {
	console.log("Creating offer");
	peer = RTCPeerConnection({
		onOfferSDP: sendOfferSDP,
		onICE: function(candidate) {
			console.log("sending sdpOffer");
			console.log(candidate);
			socket && socket.emit('ICE_information', {
				userID: userID,
				candidate: {
					sdpMLineIndex: candidate.sdpMLineIndex,
					candidate: JSON.stringify(candidate.canditate)
				}
			});
		},
		onRemoteStream: function (stream) {
			if (stream) {
				audio.src = webkitURL.createObjectURL(stream);
			}
		},
		attachStream: clientStream
	});
}
//send offer SDP
function sendOfferSDP(sdp) {
	console.log("Sending offer");
	var sdp = JSON.stringify(sdp);

	socket.emit('sdpOffer', {
		userID: userID,
		sdp: sdp
	});
}

var answerSDP = {};
//got answer SDP
function processAnswerIfOfferer (response) {
	console.log("Processing answer");
	if (response.sdp) {
		var JSON_sdp = JSON.parse(response.sdp);
		peer.addAnswerSDP(JSON_sdp);
	}
}

function addIce (response) {
	peer.addICE({
		sdpMLineIndex: candidate.sdpMLineIndex,
		candidate: canditate.candidate
	});
}