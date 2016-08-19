angular.module('app').service('spacedRevisionModalSrv', function($rootScope, StringSrv, AppConsts, dictionarySrv, pronunciationSrv, RevisionRestSrv, uiDeniModalSrv, revisionSrv) {

	var vm = this;
	vm.controller;

	vm.setController = function(controller) {
		vm.controller = controller;
	}

	vm.selectExpression = function(index) {
		vm.controller.showDefinitionContent = false;
		if (vm.controller.expressions.length > 0) {
			vm.controller.currentExpressionIndex = index;
			vm.controller.currentExpression = vm.controller.expressions[index];
			vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.dsExpressao;
			vm.controller.model.expression.type = vm.controller.currentExpression.cdDicionario != 0 ? 'Dictionary' : 'Pronuciation';		
			vm.controller.model.expression.resultType = vm.controller.currentExpression.cdDicionario != 0 ? 'menu' : 'volume_up';				
			vm.controller.model.expression.learnedRate	= vm.controller.currentExpression.nrLevelOfLearning;
			vm.controller.model.expression.definition = '';
		}	
	}

	vm.showResult = function(controller) {
		//dictionary Result
		if (controller.currentExpression.cdDicionario != 0) {
			//
			if (event.ctrlKey) {
				pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
			}	

			var dictionaryDefinitionView = $('.spaced-revision-modal .definition-detail-content-content dictionary-definition-view');
			var element = angular.element(dictionaryDefinitionView);
			var scope = element.scope();
			scope.$$childTail.ctrl.cdDicionario = controller.currentExpression.cdDicionario;
			if (!scope.$$phase) {
				scope.$apply();
			}

			vm.controller.showDefinitionContent = true;                              

		//pronunciation Result
		} else if (angular.isDefined(controller.currentExpression.cdPronuncia)) {
			pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
		}

	}

	vm.updateLearnedPercentage = function() {
		var progressBar = vm.controller.element.find('.item-detail-data-progress-bar');
		var progressBarWidth = progressBar.width();

		var sum = 0;
		for (var index = 0 ; index < vm.controller.expressions.length ; index++) {
			sum += vm.controller.expressions[index].nrLevelOfLearning;
		}

		var percentage = sum / vm.controller.expressions.length;
		vm.controller.model.learnedPercentage = percentage.toFixed(2);;
		var progress = vm.controller.element.find('.item-detail-data-progress');
		progress.width(progressBarWidth * percentage / 100);
	}

	vm.markAsReviewed = function(cd_item) {
		return RevisionRestSrv.markAsReviewed(cd_item).then(function() {
			uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
		});
	}

	vm.showModal = function(scope, cdItem) {
		$rootScope.selectedCdItem = cdItem;
		$rootScope.loading = true;
	
		revisionSrv.getExpressions(cdItem).then(function(response) {
			$rootScope.loading = false;

	        uiDeniModalSrv.createWindow({
	            scope: $rootScope,
	            title: 'Spaced Revision',
	            width: '900px',         
	            height: '600px',
	            position: uiDeniModalSrv.POSITION.CENTER,
	            buttons: [uiDeniModalSrv.BUTTON.OK],
	            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-modal/spaced-revision-modal.tpl.htm',
	            modal: true,
	            listeners: {

	            	onshow: function(objWindow) {
						
						revisionSrv.getItemInfo(cdItem).then(function(serverResponse) {
							vm.controller.expressions = response;
							vm.selectExpression(0);
							vm.controller.element = $(objWindow);
							vm.updateLearnedPercentage(vm.controller.expressions);

							vm.controller.cdItem = cdItem;
							vm.controller.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, cdItem, (new Date()).getMilliseconds());
						
							vm.controller.dsItem = serverResponse.dsItem;
							vm.controller.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
						});
	            	}

	            }
	        }).show();

	    });

	}
	
});