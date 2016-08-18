angular.module('app').service('pronunciationSrv', function($q, $window) {

	var vm = this;

	this.listenExpression = function(expression) {
		var deferred = $q.defer();

		try {
			if (event.ctrlKey && event.shiftKey) { //CTRL+SHIFT --> abre o site http://emmasaying.com para ver se eles possuem a pronúncia da expressão
				//var altenativeSite = 'http://emmasaying.com/?s=';
				var altenativeSite = 'http://www.wordreference.com/enpt/'
				$window.open(altenativeSite + expression);
			} else {
				var timer = setInterval(function() {
				    var voices = speechSynthesis.getVoices();
				    if (voices.length !== 0) {
				    	clearInterval(timer);

						var sentence = new SpeechSynthesisUtterance();
						sentence.text = expression;
						sentence.lang = 'en-US';

					    for(var i = 0; i < voices.length; i++) {
							if(voices[i].lang == sentence.lang ){
								sentence.voice = voices[i];
								break;
							}
						}				

						sentence.rate = 0.8;
						
						sentence.onstart = function(event) { 
						}
						sentence.onend = function(event) { 
							deferred.resolve();
						}
						
						speechSynthesis.speak(sentence);
					}
						
				}, 200);
					
			}	
		} catch(e) {
			deferred.reject(e);
		}

		return deferred.promise;
	}


});