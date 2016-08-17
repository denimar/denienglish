angular.module('app').service('dictionarySrv', function($q, DictionaryRestSrv, dictionaryModalSrv) {

	var vm = this;

	vm.list = function() {
		return DictionaryRestSrv.list();
	}

	vm.add = function(ds_expressao, ds_tags) {
		return DictionaryRestSrv.add(ds_expressao, ds_tags);
	}

	vm.del = function(cd_dicionario) {
		return DictionaryRestSrv.del(cd_dicionario);
	}


	vm.learnedToogle = function(cd_dicionario) {
		return DictionaryRestSrv.learnedToogle(cd_dicionario);
	}

	vm.definitionSet = function(cd_dicionario, definition) {
		return DictionaryRestSrv.definitionSet(cd_dicionario, definition);
	}

	vm.definitionGet = function(cd_dicionario) {
		var deferred = $q.defer();

		DictionaryRestSrv.definitionGet(cd_dicionario).then(function(serverResponse) {
			deferred.resolve(serverResponse.data.data[0].txDefinicao);			
		});

		return deferred.promise;
	}	

	vm.showModal = function(scope) {
		return dictionaryModalSrv.showModal(scope, vm.definitionGet);
	}	

});