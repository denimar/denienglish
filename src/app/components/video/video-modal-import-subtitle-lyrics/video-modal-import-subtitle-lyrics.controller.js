(function() {

	'use strict';

	angular
		.module('video')
		.controller('videoModalImportSubtitleLyricsController', videoModalImportSubtitleLyricsController);

	function videoModalImportSubtitleLyricsController(videoModalImportSubtitleLyricsService) {
		videoModalImportSubtitleLyricsService.setController(this);    
	};

})();	