(function() {

	'use strict';

	angular
		.module('dictionary')
		.factory('dictionaryDataService', dictionaryDataService);

	function dictionaryDataService($q, restService) {
		return {
			cachedExpressions: [],
			list: dictionaryList,
			add: dictionaryAdd,
			upd: dictionaryUpd,
			del: dictionaryDel,
			learnedToogle: dictionaryLearnedToogle,
			definitionSet: dictionaryDefinitionSet,
			definitionGet: dictionaryDefinitionGet
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function dictionaryList(ignoreCache) {
			var deferred = $q.defer();
			var vm = this;

			if (ignoreCache || vm.cachedExpressions.length === 0) {
				restService.requestWithPromise('dictionary/list').then(function(dictionaryResponse) {
					vm.cachedExpressions = dictionaryResponse.data.data;
					deferred.resolve(vm.cachedExpressions);
				});
			} else {
				deferred.resolve(vm.cachedExpressions);				
			}	

			return deferred.promise;
		}


		function dictionaryAdd(ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Expression added successfully!'
			};
			return restService.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
		};

		function dictionaryUpd(cd_dicionario, ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			}
			return restService.requestWithPromise('dictionary/upd', {'cd_dicionario': cd_dicionario, 'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);
		}	

		function dictionaryDel(cd_dicionario) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Expression deleted successfully!'
			};
			return restService.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
		};


		function dictionaryLearnedToogle(cd_dicionario) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
		};

		function dictionaryDefinitionSet(cd_dicionario, definition) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
		};

		function dictionaryDefinitionGet(cd_dicionario) {
			return restService.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
		};	

	};

})();