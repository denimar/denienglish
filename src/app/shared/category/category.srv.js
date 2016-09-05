'use strict';

angular.module('categoryMdl').service('categorySrv', function() {

	var vm = this;

	vm.getMessage = function() {
		return 'message test';
	};
});

/*

angular.module('categoryMdl').service('categorySrv', function($q, categoryRestSrv, uiDeniModalSrv) {

	var vm = this;

	vm.add = function(scope, cd_categoria_pai) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('New Category', "Enter a descrption of the category", '', true, scope).then(function(enteredText) {
			categoryRestSrv.add(cd_categoria_pai, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0]);
			});
		});

		return deferred.promise;		
	};

	vm.rename = function(scope, cd_categoria, ds_categoria) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('Renaming Category', "Enter a descrption of the category", ds_categoria, true, scope).then(function(enteredText) {
			categoryRestSrv.rename(cd_categoria, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].dsCategoria);
			});
		});

		return deferred.promise;		
	};

	vm.del = function(cd_categoria) {
		return categoryRestSrv.del(cd_categoria);		
	};

});

*/