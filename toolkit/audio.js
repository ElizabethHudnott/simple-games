'use strict';

{
	const audioContext = new AudioContext();

	class SoundEffects extends EventTarget {

		constructor() {
			super();
			var sounds = new Map();
			var numberLoading = 0;

			this.load = function (label, url) {
				var request = new XMLHttpRequest();
				request.open('GET', url, true);
				request.responseType = 'arraybuffer';

				request.onload = function () {
			  		audioContext.decodeAudioData(request.response)
			  		.then(function(buffer) {
			  			numberLoading--;
			  			sounds.set(label, buffer)

			  		}).catch(function (error) {
			  			numberLoading--;
			  			console.log(error);
			  		});
			  	}

			  	numberLoading++;
			 	request.send();
			}

			this.play = function (label) {
				if (sounds.has(label)) {
					var source = audioContext.createBufferSource();
					source.buffer = sounds.get(label);
					source.connect(audioContext.destination);
					source.start(0);
				}
			}
		}

	}

	if (!('GameKit' in window)) {
		window.GameKit = {};
	}

	window.GameKit.audioContext = audioContext;
	window.GameKit.SFX = new SoundEffects();
}
