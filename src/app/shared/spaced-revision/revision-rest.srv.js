angular.module('app').service('RevisionRestSrv', function(AppSrv) {

	var vm = this;

	vm.getItemInfo = function(cd_item) {
		return AppSrv.requestWithPromise('revision/item/info', {'cd_item': cd_item});
	}

	vm.getExpressions = function(cd_item, onlyVisible) {
		return AppSrv.requestWithPromise('revision/expressions/get', {'cd_item': cd_item, 'onlyVisible': onlyVisible});
	}

	vm.updExpressions = function(cd_item, expressions) {
		var successfullyMessage = {
			title: 'Spaced Revision',
			message: 'expressions updated succesfully!'
		}
		return AppSrv.requestWithPromisePayLoad('revision/expressions/upd', {'cd_item': cd_item}, expressions, successfullyMessage);
	}

	vm.markAsReviewed = function(cd_item) {
		return AppSrv.requestWithPromise('revision/markasreviewed', {'cd_item': cd_item});
	}
	

});