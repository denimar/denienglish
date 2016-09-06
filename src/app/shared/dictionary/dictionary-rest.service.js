(function() {

	'use strict';

	angular
		.module('dictionary')
		.service('dictionaryRestService', dictionaryRestService);

	function dictionaryRestService($q, restService) {

		var vm = this;
		vm.loadedExpressions = [];

		vm.list = function() {
			var deferred = $q.defer();

			restService.requestWithPromise('dictionary/list').then(function(dictionaryResponse) {
				vm.loadedExpressions = dictionaryResponse.data.data;
				deferred.resolve(vm.loadedExpressions);
			});

			return deferred.promise;
		}


		vm.add = function(ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Expression added successfully!'
			};
			return restService.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
		};

		vm.upd = function(cd_dicionario, ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			}
			return restService.requestWithPromise('dictionary/upd', {'cd_dicionario': cd_dicionario, 'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);
		}	

		vm.del = function(cd_dicionario) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Expression deleted successfully!'
			};
			return restService.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
		};


		vm.learnedToogle = function(cd_dicionario) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
		};

		vm.definitionSet = function(cd_dicionario, definition) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
		};

		vm.definitionGet = function(cd_dicionario) {
			return restService.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
		};	

	};

})();	