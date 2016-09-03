angular.module('app').service('spacedRevisionModalSrv', function($rootScope, $filter, StringSrv, AppConsts, dictionarySrv, pronunciationSrv, RevisionRestSrv, uiDeniModalSrv, revisionSrv, spacedRevisionSelectExpressionsModal) {

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
			if (vm.controller.currentExpression.t50dci) {
				vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.t50dci.dsExpressao;
				vm.controller.model.expression.type = 'Dictionary';		
				vm.controller.model.expression.resultType = 'menu';				
			} else {
				vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.t51prn.dsExpressao;
				vm.controller.model.expression.type = 'Pronuciation';		
				vm.controller.model.expression.resultType = 'volume_up';				
			}
			vm.controller.model.expression.definition = '';
		}	
	}

	vm.showResult = function(controller) {
		//dictionary Result
		if (controller.currentExpression.t50dci) {
			//
			if (event.ctrlKey) {
				pronunciationSrv.listenExpression(controller.currentExpression.t50dci.dsExpressao);
			}	

			var dictionaryDefinitionView = $('.spaced-revision-modal .definition-detail-content-content dictionary-definition-view');
			var element = angular.element(dictionaryDefinitionView);
			var scope = element.scope();
			scope.$$childTail.ctrl.cdDicionario = controller.currentExpression.t50dci.cdDicionario;
			if (!scope.$$phase) {
				scope.$apply();
			}

			vm.controller.showDefinitionContent = true;                              

		//pronunciation Result
		} else if (angular.isDefined(controller.currentExpression.t51prn.cdPronuncia)) {
			pronunciationSrv.listenExpression(controller.currentExpression.t51prn.dsExpressao);
		}

	}

	vm.markAsReviewed = function(cd_item) {
		return RevisionRestSrv.markAsReviewed(cd_item).then(function() {
			uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
		});
	}

	vm.selectExpressions = function() {
		spacedRevisionSelectExpressionsModal.showModal($rootScope.selectedCdItem).then(function(expressions) {
			vm.controller.expressions = $filter('filter')(expressions, function(record, index, array) {
				return record.blMostrar;
			});
		});
	}	

	vm.showModal = function(scope, cdItem) {
		$rootScope.selectedCdItem = cdItem;
		$rootScope.loading = true;
	
		revisionSrv.getExpressions(cdItem, true).then(function(response) {
			$rootScope.loading = false;

	        uiDeniModalSrv.createWindow({
	            scope: $rootScope,
	            title: 'Spaced Revision',
	            width: '900px',         
	            height: '600px',
	            position: uiDeniModalSrv.POSITION.CENTER,
	            buttons: [uiDeniModalSrv.BUTTON.CLOSE],
	            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-modal/spaced-revision-modal.tpl.htm',
	            modal: true,
	            listeners: {

	            	onshow: function(objWindow) {
						
						revisionSrv.getItemInfo(cdItem).then(function(serverResponse) {
							vm.controller.expressions = response;
							vm.selectExpression(0);
							vm.controller.element = $(objWindow);
							
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