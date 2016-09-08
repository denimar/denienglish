(function() {

	'use strict';

	angular
		.module('video')
		.service('videoRestService', videoRestService);

	function videoRestService(restService) {
		var vm = this;

		vm.add = function(cdCategoria, tpVideo, idVideo, dsItem) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'Video added successfully!'
			};
			return restService.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cdCategoria, 'tp_video': tpVideo, 'id_video': idVideo, 'ds_item': dsItem}, successfullyMessage);
		};

		vm.get = function(cdItem) {
			return restService.requestWithPromise('video/get', {'cd_item': cdItem});
		};

		vm.commentaries = {

			set: function(cdVideo, commentary) {
				var successfullyMessage = {
					title: 'Videos',
					message: 'commentary updated successfully!'
				};
				return restService.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cdVideo}, {'txCommentaries': commentary}, successfullyMessage);
			}

		};


	}

})();		