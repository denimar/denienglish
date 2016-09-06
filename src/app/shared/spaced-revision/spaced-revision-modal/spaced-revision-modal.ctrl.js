angular.module('app').controller('SpacedRevisionCtrl', function(StringSrv, AppConsts, itemSrv, revisionSrv, dictionarySrv, spacedRevisionModalSrv) {
	
	var vm = this;
	spacedRevisionModalSrv.setController(vm);

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
		spacedRevisionModalSrv.selectExpression(vm.currentExpressionIndex + number);
	}
	
	vm.navigateFirst = function() {
		spacedRevisionModalSrv.selectExpression(0);
	}

	vm.navigateLast = function() {
		spacedRevisionModalSrv.selectExpression(vm.expressions.length - 1);
	}	

	vm.showResult = function() {
		spacedRevisionModalSrv.showResult(vm);
	}

	vm.markAsReviewed = function(cd_item) {
		spacedRevisionModalSrv.markAsReviewed(cd_item);
	}

	vm.selectExpressions = spacedRevisionModalSrv.selectExpressions;

	/*
	if (vm.cdItem) {
		vm.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

		revisionSrv.getItemInfo(vm.cdItem).then(function(serverResponse) {
			vm.dsItem = serverResponse.dsItem;
			vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
		});

	} else {
		new Error('Attributes passed in a wrong way!')
	}
	*/

});