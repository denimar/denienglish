(function() {

	'use strict';

	angular
		.module('video')
		.service('videoRestService', videoRestService);

	function videoRestService(restService) {
		var vm = this;

		vm.add = function(cd_categoria, tp_video, id_video, ds_item) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'Video added successfully!'
			}
			return restService.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cd_categoria, 'tp_video': tp_video, 'id_video': id_video, 'ds_item': ds_item}, successfullyMessage);
		}

		vm.get = function(cd_item) {
			return restService.requestWithPromise('video/get', {'cd_item': cd_item});
		}

		vm.commentaries = {

			set: function(cd_video, commentary) {
				var successfullyMessage = {
					title: 'Videos',
					message: 'commentary updated successfully!'
				}
				return restService.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cd_video}, {'txCommentaries': commentary}, successfullyMessage);
			}

		}


	};

})();		