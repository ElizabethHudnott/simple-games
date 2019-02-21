'use strict';

{
	const audioContext = new AudioContext();

	class SoundEffects extends EventTarget {

		constructor() {
			super();
			const me = this;

			var sounds = new Map();
			var numberLoading = 0;

			function requestComplete() {
				numberLoading--;
				if (numberLoading === 0) {
					var event = new Event('load');
					me.dispatchEvent(event);
				}

			}

			function dispatchError(message, url) {
				var event = new Event('error');
				event.message = message;
				event.url = url;
				me.dispatchEvent(event);
				requestComplete();
			}

			this.load = function (label, url) {
				var request = new XMLHttpRequest();
				request.open('GET', url);
				request.responseType = 'arraybuffer';
				request.timeout = 60000;

				request.addEventListener('load', function (event) {
			  		if (request.status < 400) {
				  		audioContext.decodeAudioData(request.response)
				  		.then(function(buffer) {
				  			sounds.set(label, buffer)
				  			requestComplete();

				  		}).catch(function (error) {
				  			dispatchError(error.message, url)
				  		});
				  	} else {
				  		dispatchError(request.status + ' - ' + request.statusText, url);
				  	}
			  	});

				request.addEventListener('error', function (event) {
					dispatchError('Network error', url);
				});

				request.addEventListener('timeout', function (event) {
					dispatchError('Timeout', url);
				});

				numberLoading++;
			 	request.send();
			}

			this.play = function (label, volume) {
				if (sounds.has(label)) {
					var source = audioContext.createBufferSource();
					source.buffer = sounds.get(label);
					var node = source;
					if (volume !== undefined) {
						var gainNode = audioContext.createGain();
						gainNode.gain.value = volume;
						node.connect(gainNode);
						node = gainNode;
					}
					node.connect(audioContext.destination);
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
