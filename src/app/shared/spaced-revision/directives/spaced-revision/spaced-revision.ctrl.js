angular.module('spacedRevisionMdl').controller('SpacedRevisionCtrl', function(StringSrv, AppConsts, itemSrv, categorySrv, revisionSrv, dictionarySrv, spacedRevisionSrv) {
	
	var vm = this;

	vm.learnedRate = 60;
	vm.expressions = [];
	vm.currentExpression;
	vm.currentExpressionIndex;	
	vm.model = {
		expression: {}
	};

	vm.model.navigatorStatus = '';	

	vm.navigate = function(number) {
		spacedRevisionSrv.selectExpression(vm, vm.currentExpressionIndex + number);
	}
	
	vm.navigateFirst = function() {
		spacedRevisionSrv.selectExpression(vm, 0);
	}

	vm.navigateLast = function() {
		spacedRevisionSrv.selectExpression(vm, vm.expressions.length - 1);
	}	

	vm.showResult = function() {
		spacedRevisionSrv.showResult(vm);
	}

	vm.changeLearnedRate = function() {
		revisionSrv.setLevelOfLearning(vm.currentExpression.cdDicionario, vm.currentExpression.cdPronuncia, vm.model.expression.learnedRate);
		vm.currentExpression.nrLevelOfLearning = vm.model.expression.learnedRate;
		spacedRevisionSrv.updateLearnedPercentage(vm);
	}

	vm.markAsReviewed = function(cd_item) {
		spacedRevisionSrv.markAsReviewed(cd_item);
		console.log('TODO: FAZER UMA ROTINA NA uiDeniModal para fechar a janela ativa...');
		console.log('TODO: VERIFICAR TAMBÉM O UI-DENI-MODAL... PASSAGEM DO Scope...');		
	}

	if (vm.cdItem) {
		vm.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

		revisionSrv.getItemInfo(vm.cdItem).then(function(serverResponse) {
			vm.dsItem = serverResponse.dsItem;
			vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
		});

	} else {
		new Error('Attributes passed in a wrong way!')
	}

});