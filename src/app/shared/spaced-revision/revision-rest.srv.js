angular.module('app').service('RevisionRestSrv', function(AppSrv) {

	var vm = this;

	vm.getItemInfo = function(cd_item) {
		return AppSrv.requestWithPromise('revision/item/info', {'cd_item': cd_item});
	}

	vm.getExpressions = function(cd_item) {
		return AppSrv.requestWithPromise('revision/expressions/get', {'cd_item': cd_item});
	}

	vm.setLevelOfLearning = function(cd_dicionario, cd_pronuncia, nrLevelOfLearning) {
		return AppSrv.requestWithPromise('revision/expressions/levelOfLearning/set', {'cd_dicionario': cd_dicionario, 'cd_pronuncia': cd_pronuncia, "nr_level_of_learning": nrLevelOfLearning});	
	}

	vm.markAsReviewed = function(cd_item) {
		return AppSrv.requestWithPromise('revision/markasreviewed', {'cd_item': cd_item});
	}
	

});