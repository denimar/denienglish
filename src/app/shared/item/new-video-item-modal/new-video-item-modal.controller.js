(function() {
	'use strict';

	angular
		.module('item')
		.controller('newVideoItemModalController', newVideoItemModalController);

	function newVideoItemModalController($sce) {
		var vm = this;

		var _getDataURLImagemObjeto = function(videoElement, width, height, quality) {
			var originalWiddh = 0;
			var originalHeight = 0;	
			if (videoElement instanceof HTMLImageElement) { //Imagem
				originalWiddh = videoElement.naturalWidth;
				originalHeight = videoElement.naturalHeight;		
			} else {
				originalWiddh = videoElement.videoWidth;
				originalHeight = videoElement.videoHeight;		
			}	
			
			var canvas = document.createElement('canvas');
			var newWidth = width;
			var newHeight = height;
			
			var xPerc = 1;
			if (originalHeight > originalWiddh) {
				xPerc = newWidth / originalWiddh;							
				newHeight = xPerc * originalHeight;
			} else {
				xPerc = newHeight / originalHeight;
				newWidth = xPerc * originalWiddh;							
			}
			
			canvas.width  = newWidth;
			canvas.height = newHeight;
			var ctx = canvas.getContext('2d');

			ctx.drawImage(videoElement, 0, 0, originalWiddh, originalHeight, 0, 0, newWidth, newHeight);

			return canvas.toDataURL("image/jpeg", quality);
		}

		vm.capturePosterFromVideo = function() {
			var videoElement = $('.video-preview').get(0);
				
			var imageUrl = _getDataURLImagemObjeto(videoElement, 150, 150, 0.5);

			//var imageUrl = _getDataURLImagemObjeto(videoElement, 150, 150, 0.5);
			console.log(imageUrl);
		}

	};

})();	