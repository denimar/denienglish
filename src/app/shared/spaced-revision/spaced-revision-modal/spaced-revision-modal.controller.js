(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('SpacedRevisionController', SpacedRevisionController);

	function SpacedRevisionController(stringService, restService, itemService, revisionService, dictionaryService, spacedRevisionModalService) {		
		var vm = this;
		spacedRevisionModalService.setController(vm);

		vm.showDefinitionContent = false;
		vm.learnedRate = 60;
		vm.expressions = [];
		vm.currentExpression;
		vm.currentExpressionIndex;	
		vm.model = {
			expression: {}
		};

		vm.model.navigatorStatus = '';	

		vm.navigate = function(number) {
			spacedRevisionModalService.selectExpression(vm.currentExpressionIndex + number);
		}
		
		vm.navigateFirst = function() {
			spacedRevisionModalService.selectExpression(0);
		}

		vm.navigateLast = function() {
			spacedRevisionModalService.selectExpression(vm.expressions.length - 1);
		}	

		vm.showResult = function() {
			spacedRevisionModalService.showResult(vm);
		}

		vm.markAsReviewed = function(cd_item) {
			spacedRevisionModalService.markAsReviewed(cd_item);
		}

		vm.selectExpressions = spacedRevisionModalService.selectExpressions;

		/*
		if (vm.cdItem) {
			vm.itemImage = stringService.format('{0}item/image/get?cd_item={1}&time={2}', restService.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

			revisionService.getItemInfo(vm.cdItem).then(function(serverResponse) {
				vm.dsItem = serverResponse.dsItem;
				vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
			});

		} else {
			new Error('Attributes passed in a wrong way!')
		}
		*/

	};

})();	