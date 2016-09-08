(function() {
	
	'use strict';

	angular
		.module('video')
		.service('subtitleRestService', subtitleRestService);

	function subtitleRestService(restService) {
		var vm = this;

		vm.list = function(cdItem) {
			return restService.requestWithPromise('subtitle/list', {'cd_item': cdItem});
		};

		vm.add = function(cdVideo, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Subtitle added successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cdVideo, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		vm.upd = function(cdItemSubtitle, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cdItemSubtitle, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		vm.incASecond = function(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/incasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		vm.decASecond = function(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/decasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		vm.del = function(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Subtitle deleted successfully!'
			};
			return restService.requestWithPromise('subtitle/del', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage, 'Confirm deleting?');
		};


	}

})();
