(function() {
	
	'use strict';

	angular
		.module('app')
		.service('revisionRestService', revisionRestService);

	function revisionRestService(restService) {
		var vm = this;

		vm.getItemInfo = function(cd_item) {
			return restService.requestWithPromise('revision/item/info', {'cd_item': cd_item});
		}

		vm.getExpressions = function(cd_item, onlyVisible) {
			return restService.requestWithPromise('revision/expressions/get', {'cd_item': cd_item, 'onlyVisible': onlyVisible});
		}

		vm.updExpressions = function(cd_item, expressions) {
			var successfullyMessage = {
				title: 'Spaced Revision',
				message: 'expressions updated succesfully!'
			}
			return restService.requestWithPromisePayLoad('revision/expressions/upd', {'cd_item': cd_item}, expressions, successfullyMessage);
		}

		vm.updText = function(cd_item, returnOnlyVisible) {
			var successfullyMessage = {
				title: 'Spaced Revision',
				message: 'expressions updated succesfully!'
			}
			return restService.requestWithPromise('revision/expressions/updtext', {'cd_item': cd_item, 'returnOnlyVisible': returnOnlyVisible}, successfullyMessage);
		}

		vm.markAsReviewed = function(cd_item) {
			return restService.requestWithPromise('revision/markasreviewed', {'cd_item': cd_item});
		}
		

	};

})();	