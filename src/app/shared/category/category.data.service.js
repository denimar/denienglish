(function () {
	'use strict';

	angular
		.module('category')
		.factory('categoryDataService', categoryDataService);

	function categoryDataService(restService) {
		
		return {
			add: categoryAdd,
			rename: categoryRename,
			del: categoryDel
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function categoryAdd(cd_categoria_pai, ds_categoria) {
			var successfullyMessage = {
				title: 'Adding',
				message: 'Category added successfully!'
			};
			return restService.requestWithPromise('category/add', {'cd_categoria_pai': cd_categoria_pai, 'ds_categoria': ds_categoria}, successfullyMessage);
		};

		function categoryRename(cd_categoria, ds_categoria) {
			var successfullyMessage = {
				title: 'Editing',
				message: 'Category renamed successfully!'
			};
			return restService.requestWithPromise('category/upd', {'cd_categoria': cd_categoria, 'ds_categoria': ds_categoria}, successfullyMessage);
		};

		function categoryDel(cd_categoria) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Category deleted successfully!'
			};
			return restService.requestWithPromise('category/del', {'cd_categoria': cd_categoria}, successfullyMessage, 'Confirm deleting?');
		};

	}	

})();