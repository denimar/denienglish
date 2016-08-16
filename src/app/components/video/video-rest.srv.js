angular.module('app').service('VideoRestSrv', function(AppSrv) {

	var vm = this;

	vm.add = function(cd_categoria, tp_video, id_video, ds_item) {
		var successfullyMessage = {
			title: 'Videos',
			message: 'Video added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cd_categoria, 'tp_video': tp_video, 'id_video': id_video, 'ds_item': ds_item}, successfullyMessage);
	}

	vm.get = function(cd_item) {
		return AppSrv.requestWithPromise('video/get', {'cd_item': cd_item});
	}

	vm.commentaries = {

		set: function(cd_video, commentary) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'commentary updated successfully!'
			}
			return AppSrv.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cd_video}, {'txCommentaries': commentary}, successfullyMessage);
		}

	}


});