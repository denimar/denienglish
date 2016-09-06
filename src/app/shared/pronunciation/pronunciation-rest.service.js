(function() {

	'use strict'

	angular
		.module('pronunciation')
		.service('pronunciationRestService', pronunciationRestService);

	function pronunciationRestService($q, restService) {

		var vm = this;
		vm.loadedExpressions = [];		

		vm.list = function() {
			var deferred = $q.defer();

			restService.requestWithPromise('pronunciation/list').then(function(pronunciationResponse) {
				vm.loadedExpressions = pronunciationResponse.data.data;
				deferred.resolve(vm.loadedExpressions);
			});

			return deferred.promise;
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

	};

})();	