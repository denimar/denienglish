(function() {

	'use strict';

	angular
		.module('video')
		.service('videoDataService', videoDataService);

	function videoDataService(restService) {

		return {
			add: videoAdd,
			get: videoGet,
			commentaries: {
				set: videoComentariesSet
			}
		}	

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/		

		function videoAdd(cdCategoria, tpVideo, idVideo, dsItem) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'Video added successfully!'
			};
			return restService.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cdCategoria, 'tp_video': tpVideo, 'id_video': idVideo, 'ds_item': dsItem}, successfullyMessage);
		};

		function videoGet(cdItem) {
			return restService.requestWithPromise('video/get', {'cd_item': cdItem});
		};

		function videoComentariesSet(cdVideo, commentary) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'commentary updated successfully!'
			};
			return restService.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cdVideo}, {'txCommentaries': commentary}, successfullyMessage);
		};

	}

})();		