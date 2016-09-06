'use strict';

angular
	.module('category')
	.service('categoryService', categoryService);

function categoryService($q, categoryRestService, uiDeniModalSrv) {

	var vm = this;

	vm.add = function(scope, cd_categoria_pai) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('New Category', "Enter a descrption of the category", '', true, scope).then(function(enteredText) {
			categoryRestService.add(cd_categoria_pai, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0]);
			});
		});

		return deferred.promise;		
	};

	vm.rename = function(scope, cd_categoria, ds_categoria) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('Renaming Category', "Enter a descrption of the category", ds_categoria, true, scope).then(function(enteredText) {
			categoryRestService.rename(cd_categoria, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].dsCategoria);
			});
		});

		return deferred.promise;		
	};

	vm.del = function(cd_categoria) {
		var deferred = $q.defer();
		categoryRestService.del(cd_categoria).then(function(serverResponse) {
			deferred.resolve(serverResponse.data.data[0]);
		});
		return deferred.promise;			
	};


};