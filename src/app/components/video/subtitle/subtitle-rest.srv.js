angular.module('app').service('SubtitleRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function(cd_item) {
		return AppSrv.requestWithPromise('subtitle/list', {'cd_item': cd_item});
	}

	vm.add = function(cd_video, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Subtitle added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cd_video, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.upd = function(cd_item_subtitle, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cd_item_subtitle, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.incASecond = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return AppSrv.requestWithPromise('subtitle/incasecond', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage);		
	}

	vm.decASecond = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return AppSrv.requestWithPromise('subtitle/decasecond', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage);		
	}

	vm.del = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Subtitle deleted successfully!'
		}
		return AppSrv.requestWithPromise('subtitle/del', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage, 'Confirm deleting?');
	}


});