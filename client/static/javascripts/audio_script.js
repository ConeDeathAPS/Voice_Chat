//cross-browser compatibility assurance
var peerConnection = window.RTCPeerConnection || 
	window.mozRTCPeerConnection || 
	window.webkitRTCPeerConnection || 
	window.msRTCPeerConnection;

var sessionDescription = window.RTCSessionDescription || 
	window.mozRTCSessionDescription ||
	window.webkitRTCSessionDescription || 
	window.msRTCSessionDescription;

//variable initialization
var audioContext = null;
var audio = null;
var localStream;
var join_button = document.getElementById("join");
var localStream;
var remoteStream;

//function to initiate an audio stream on window load
var joinChat = (function () {
	canvas = document.getElementById("audio_level");

	window.audioContext = window.AudioContext || window.webkitAudioContext;

	audioContext = new AudioContext();

	try {
		console.log("Initializing getUserMedia().");
		//checking for browser compatibility
		navigator.getUserMedia = 
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;
		//getting audio only, passing in success and error callbacks
		navigator.getUserMedia({
			audio: true 
		}, gotStream, didntGetStream);
		console.log("Stream initialized");
	} catch (e) {
		console.log("getUserMedia() threw an exception super hard: ", e);
	}
})();

//error function
function didntGetStream() {
	console.log("Stream generation failed!");
}

var mediaStreamSource = null;
//success function
function gotStream(stream) {
	console.log("Got stream!");
	localStream = stream;

	//creating a new media stream source from the audio context(with the stream as a parameter)
	mediaStreamSource1 = audioContext.createMediaStreamSource(stream);

	//this connects the source for the media stream to the local audio context stream, playing the audio through the speakers
	mediaStreamSource1.connect(audioContext.destination);

	// drawLoop();
}

//this functino will stop the audio
var stopAudio = function() {
	console.log("Stopping audio.");
	audioContext.close();
}
