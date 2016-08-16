angular.module('app').service('revisionSrv', function($q, RevisionRestSrv) {

	var vm = this;

	vm.getItemInfo = function(cd_item) {
		var deferred = $q.defer();

		RevisionRestSrv.getItemInfo(cd_item).then(function(serverResponse) {
			var informations = serverResponse.data.data[0];
			deferred.resolve(informations);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}

	vm.getExpressions = function(cd_item) {
		var deferred = $q.defer();

		RevisionRestSrv.getExpressions(cd_item).then(function(serverResponse) {
			var expressions = serverResponse.data.data;
			deferred.resolve(expressions);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}

	vm.setLevelOfLearning = function(cd_dicionario, cd_pronuncia, nrLevelOfLearning) {
		var deferred = $q.defer();

		RevisionRestSrv.setLevelOfLearning(cd_dicionario, cd_pronuncia, nrLevelOfLearning).then(function(serverResponse) {
			var result = serverResponse.data.data[0];
			deferred.resolve(result);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}


});