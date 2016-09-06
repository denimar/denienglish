angular.module('app').service('PronunciationRestSrv', function(restService) {

	var vm = this;

	vm.list = function() {
		return restService.requestWithPromise('pronunciation/list');
	}

	vm.add = function(ds_expressao) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Expression added successfully!'
		}
		return restService.requestWithPromise('pronunciation/add', {'ds_expressao': ds_expressao}, successfullyMessage);		
	}

	vm.del = function(cd_pronuncia) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Expression deleted successfully!'
		}
		return restService.requestWithPromise('pronunciation/del', {'cd_pronuncia': cd_pronuncia}, successfullyMessage, 'Confirm deleting?');
	}


	vm.learnedToogle = function(cd_pronuncia) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return restService.requestWithPromise('pronunciation/learned/toogle', {'cd_pronuncia': cd_pronuncia}, successfullyMessage);		
	}

});