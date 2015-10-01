socket.on('handshakeRequest', oncallback);
socket.on('sdpOffer', processAnswer);
socket.on("ICE_information", addIce);
//=================================BEGIN RTCPC FUNCTIONS==================================//
function oncallback(response) {
	console.log("got handshake request");
	console.log("Response: ", response);
	if (response.userID === userID) {
		return;
	}
	if (response.type && response.type === 'request_to_join') {
		console.log("sending handshake confirmation");
		socket && socket.emit('handshakeConfirm', {
			participant: true,
			userID: userID
		});
	}
}

var peer;
//create an offer with user info and stream
function createAnswer(offer_sdp) {
	console.log('creating answer');
	peer = RTCPeerConnection({
		onAnswerSDP: offer_sdp,
		onICE: function(candidate) {
			console.log("sending answer");
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
//parse the answer that was received
function processAnswer (response) {
	console.log("received sdp offer");
	console.log("SDPoffer: ", response);
	if (response.sdp) {
		var answerSDP = JSON.parse(response.sdp);
		createAnswer(answerSDP);
	}
}

function addIce (response) {
	peer.addICE({
		sdpMLineIndex: candidate.sdpMLineIndex,
		candidate: canditate.candidate
	});
}