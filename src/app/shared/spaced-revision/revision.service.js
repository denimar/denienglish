(function() {
	
	'use strict';

	angular
		.module('app')
		.service('revisionService', revisionService);

	function revisionService($q, revisionRestService) {
		var vm = this;

		vm.getItemInfo = function(cd_item) {
			var deferred = $q.defer();

			revisionRestService.getItemInfo(cd_item).then(function(serverResponse) {
				var informations = serverResponse.data.data[0];
				deferred.resolve(informations);
			}, function(reason) {
				deferred.reject(reason);
			});

			return deferred.promise;
		}

		vm.getExpressions = function(cd_item, onlyVisible) {
			var deferred = $q.defer();

			revisionRestService.getExpressions(cd_item, onlyVisible).then(function(serverResponse) {
				var expressions = serverResponse.data.data;
				deferred.resolve(expressions);
			}, function(reason) {
				deferred.reject(reason);
			});

			return deferred.promise;
		}

	};

})();	