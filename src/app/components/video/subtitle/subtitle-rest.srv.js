angular.module('app').service('SubtitleRestSrv', function(restService) {

	var vm = this;

	vm.list = function(cd_item) {
		return restService.requestWithPromise('subtitle/list', {'cd_item': cd_item});
	}

	vm.add = function(cd_video, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Subtitle added successfully!'
		}
		return restService.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cd_video, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.upd = function(cd_item_subtitle, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return restService.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cd_item_subtitle, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.incASecond = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return restService.requestWithPromise('subtitle/incasecond', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage);		
	}

	vm.decASecond = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return restService.requestWithPromise('subtitle/decasecond', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage);		
	}

	vm.del = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Subtitle deleted successfully!'
		}
		return restService.requestWithPromise('subtitle/del', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage, 'Confirm deleting?');
	}


});