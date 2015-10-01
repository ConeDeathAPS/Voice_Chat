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
var meter = null;
var canvas = null;
var width = 50;
var height = 500;
var rafID = null;
var localStream;
var join_button = document.getElementById("join");
var localStream;

//function to initiate an audio stream on window load
var join = (function () {
	canvas = document.getElementById("audio_level");

	window.audioContext = window.AudioContext || window.webkitAudioContext;

	audioContext = new AudioContext();

	try {
		console.log("initializing getUserMedia");
		//checking for browser compatibility
		navigator.getUserMedia = 
			navigator.getUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.mozGetUserMedia;
		//getting audio only, passing in success and error callbacks
		navigator.getUserMedia({
			audio: true 
		}, gotStream, didntGetStream);
		console.log("stream initialized");
	} catch (e) {
		console.log("getUserMedia threw an exception super hard: ", e);
	}
})();

//error function
function didntGetStream() {
	console.log("Stream generation failed");
}

var mediaStreamSource = null;
//success function
function gotStream(stream) {
	console.log("Got stream!");
	localStream = stream;
	//creating a new media stream source from the audio context(with the stream as a parameter)
	mediaStreamSource = audioContext.createMediaStreamSource(stream);
	// meter = createAudioMeter(audioContext);
	// mediaStreamSource.connect(meter);
	//this connects the source for a media stream to the local audio context stream, playing the audio through the speakers
	mediaStreamSource.connect(audioContext.destination);
	// drawLoop();
}

//this functino will stop the audio
var stopAudio = function() {
	console.log("Stopping audio.");
	audioContext.close();
}


//function to draw the volume meter
// function drawLoop(time) {
// 	console.log(canvas);
// 	canvas.clearRect(0, 0, width, height);

// 	if (meter.checkClipping()) {
// 		canvas.fillStyle = "red";
// 	} else {
// 		canvas.fillStyle = "green";
// 	}

// 	canvas.fillRect(0, 0, width, meter.volume*height*1.4);

// 	rafID = window.requestAnimationFrame(drawLoop);
// }

// function createAudioMeter(audioContext, clipLevel, averaging, clipLag) {
// 	var processor = audioContext.createScriptProcessor(512);
// 	processor.onaudioprocess = volumeAudioProcess;
// 	processor.clipping = false;
// 	processor.lastClip = 0;
// 	processor.volume = 0;
// 	processor.clipLevel = 0.98;
// 	processor.averaging = 0.95;
// 	processor.clipLag = 750;

// 	processor.connect(audioContext.destination);

// 	processor.checkClipping = function () {
// 		if (!this.clipping) {
// 			return false;
// 		}
// 		if ((this.lastClip + this.clipLag) < window.performance.now()) {
// 			this.clipping = false;
// 		}
// 		return this.clipping;
// 	}

// 	processor.shutdown = function () {
// 		this.disconnect();
// 		this.onaudioprocess = null;
// 	}

// 	return processor;
// }

// function volumeAudioProcess (event) {
// 	var buf = event.inputBuffer.getChannelData(0);
// 	var bufLength = buf.length;
// 	var sum = 0;
// 	var x;

// 	for (var i = 0; i < buf.length; i++) {
// 		x = buf[i];
// 		if (Math.abs(x) >= this.clipLevel) {
// 			this.clipping = true;
// 			this.lastClip = window.performance.now();
// 		}
// 		sum += x*x;
// 	}

// 	var rms = Math.sqrt(sum / bufLength);

// 	this.volume = Math.max(rms, this.volume*this.averaging);
// }
