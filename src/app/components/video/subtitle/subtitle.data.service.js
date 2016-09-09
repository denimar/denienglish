(function() {
	
	'use strict';

	angular
		.module('video')
		.service('subtitleDataService', subtitleDataService);

	function subtitleDataService(restService) {

		return {
			list: subtitleList,
			add: subtitleAdd,
			upd: subtitleUpd,
			incASecond: subtitleIncASecond,
			decASecond: subtitleDecASecond,
			del: subtitleDel
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/	
			
		function subtitleList(cdItem) {
			return restService.requestWithPromise('subtitle/list', {'cd_item': cdItem});
		};

		function subtitleAdd(cdVideo, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Subtitle added successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cdVideo, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		function subtitleUpd(cdItemSubtitle, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cdItemSubtitle, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		function subtitleIncASecond(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/incasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		function subtitleDecASecond(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/decasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		function subtitleDel(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Subtitle deleted successfully!'
			};
			return restService.requestWithPromise('subtitle/del', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage, 'Confirm deleting?');
		};

	}

})();
