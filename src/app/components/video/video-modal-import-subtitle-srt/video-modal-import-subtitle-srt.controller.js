(function() {

    'use strict';

	angular
		.module('video')
		.controller('VideoModalImportSubtitleSrtController', VideoModalImportSubtitleSrtController);

	function VideoModalImportSubtitleSrtController($scope, videoModalImportSubtitleSrtService) {
		videoModalImportSubtitleSrtService.setController(this, $scope);    
	};

})();	