# Voice_Chat

##Overview and project direction
This voice chat app is designed to be a very streamlined peer-to-peer audio/text chat via socket.io over a node.js server with an Express and MongoDB back-end and Angular front-end utilizing WebRTCPeerConnection, ICE, STUN/TURN servers, and the getUserMedia() functionality built into the later versions of Chrome, Firefox, and Safari. I am working on this in my spare time, so there may be some extended periods without any progress. I also haven't come up with a name yet :-P

##Voice Chat status
-- As of 10/15/2015, the biggest feature that still is not working is the voice chat itself. I am having issues sending the stream information with the WebRTC handshakes. Since the documentation is quite poor for WebRTC, it may be a matter of just refactoring the code until it works. You can follow along with what happens in the console and watch the handshake requests go out as well as any responses. I have been using [WebRTC-experiment](https://www.webrtc-experiment.com) to help with the signaling setup. Muaz has the best documentation I have been able to find, yet there are still some gaps in the information. He also provides a great Peer.js library that you can use to make connection establishment even easier.

##Overall functionality updates
-- 10/15/2015 
* Fixed form validation errors being persistent through successful registration.
* Added admin page for users with admin privileges. Uses bootstrap to create an accordion element for each user in the db. User editing right now has no effect on the db. I need to work on getting the Angular to play nicely with the pre-populated forms.
* Text chat works and now will not send blank messages. Chat area auto-scrolls to the bottom any time a message is appended into the div.

##The Future
-- 10/15/2015
* The next thing I will work on is getting the admin page to actually make changes to the database. This is an issue being caused by the pre-populated forms. Angular uses two-way binding. In order to submit a form, you need to specify ng-model for each input element. Unfortunately this overrides anything you put into the value field, and the ng-model is empty until you submit the form, with the net result being that the fields are empty to start with. This is suboptimal. There are workarounds out there, I just haven't had time to explore them.
* After that is fixed, the only thing left to do is fix the Peer Connection so that the streams from both ends are connected. This will take a substantial amount of time, as I may have to completely rewrite my socket emits and listeners and paired functions.
* Once the two-way voice-chat is working, I will then try and expand to allow multiple users into the chat, and even possibly have multiple rooms, with a different text-chat for global and private messaging.
* The last thing will be some audio meters so you can watch for clipping and adjust gain via a slider. Stylistic changes may come in the future as well, as it doesn't look terribly nice at the moment. 

##It's live!
You can now check out the app at https://conedeathaps-voicechat.herokuapp.com. It's a bit sluggish to load, but it's all there! MAKE SURE TO USE HEADPHONES OR BLOCK ACCESS TO YOUR MICROPHONE. Otherwise you will get some really nasty feedback pretty much immediately, as your local stream is played back through your speakers at this time.
