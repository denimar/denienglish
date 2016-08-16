angular.module('app').service('DictionaryRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function() {
		return AppSrv.requestWithPromise('dictionary/list');
	}

	vm.add = function(ds_expressao, ds_tags) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Expression added successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
	}

	vm.del = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Expression deleted successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
	}


	vm.learnedToogle = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
	}

	vm.definitionSet = function(cd_dicionario, definition) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
	}

	vm.definitionGet = function(cd_dicionario) {
		return AppSrv.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
	}	

});