'use strict';

angular.module('categoryMdl').service('categoryRestSrv', function(restSrv) {

	var vm = this;

	vm.add = function(cd_categoria_pai, ds_categoria) {
		var successfullyMessage = {
			title: 'Adding',
			message: 'Category added successfully!'
		};
		return restSrv.requestWithPromise('category/add', {'cd_categoria_pai': cd_categoria_pai, 'ds_categoria': ds_categoria}, successfullyMessage);
	};

	vm.rename = function(cd_categoria, ds_categoria) {
		var successfullyMessage = {
			title: 'Editing',
			message: 'Category renamed successfully!'
		};
		return restSrv.requestWithPromise('category/upd', {'cd_categoria': cd_categoria, 'ds_categoria': ds_categoria}, successfullyMessage);
	};

	vm.del = function(cd_categoria) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Category deleted successfully!'
		};
		return restSrv.requestWithPromise('category/del', {'cd_categoria': cd_categoria}, successfullyMessage, 'Confirm deleting?');
	};


});
