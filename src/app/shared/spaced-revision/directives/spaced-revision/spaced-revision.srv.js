angular.module('spacedRevisionMdl').service('spacedRevisionSrv', function($rootScope, dictionarySrv, pronunciationSrv, RevisionRestSrv, uiDeniModalSrv) {

	var vm = this;

	vm.selectExpression = function(controller, index) {
		if (controller.expressions.length > 0) {
			controller.currentExpressionIndex = index;
			controller.currentExpression = controller.expressions[index];
			controller.model.expression.dsExpressao = controller.currentExpression.dsExpressao;
			controller.model.expression.type = controller.currentExpression.cdDicionario != 0 ? 'Dictionary' : 'Pronuciation';		
			controller.model.expression.resultType = controller.currentExpression.cdDicionario != 0 ? 'menu' : 'volume_up';				
			controller.model.expression.learnedRate	= controller.currentExpression.nrLevelOfLearning;
			controller.model.expression.definition = '';
		}	
	}

	vm.showResult = function(controller) {
		//dictionary Result
		if (controller.currentExpression.cdDicionario != 0) {
			//
			if (event.ctrlKey) {
				pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
			}	

			dictionarySrv.definitionGet(controller.currentExpression.cdDicionario).then(function(expression) {
				controller.model.expression.definition = expression;

				var div = $(document.createElement('div'));
				div.html(expression);
				$('.definition-detail-content-content').html('');
				$('.definition-detail-content-content').append(div);
			});

		//pronunciation Result
		} else if (angular.isDefined(controller.currentExpression.cdPronuncia)) {
			pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
		}

	}

	vm.updateLearnedPercentage = function(controller) {
		var progressBar = controller.element.find('.item-detail-data-progress-bar');
		var progressBarWidth = progressBar.width();

		var sum = 0;
		for (var index = 0 ; index < controller.expressions.length ; index++) {
			sum += controller.expressions[index].nrLevelOfLearning;
		}

		var percentage = sum / controller.expressions.length;
		controller.model.learnedPercentage = percentage.toFixed(2);;
		var progress = controller.element.find('.item-detail-data-progress');
		progress.width(progressBarWidth * percentage / 100);
	}

	vm.markAsReviewed = function(cd_item) {
		return RevisionRestSrv.markAsReviewed(cd_item).then(function() {
			uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
		});
	}

	vm.showModal = function(cdItem) {
		$rootScope.selectedCdItem = cdItem;

        uiDeniModalSrv.createWindow({
            scope: $rootScope,
            title: 'Spaced Revision',
            width: '900px',         
            height: '600px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK],
            urlTemplate: 'src/app/shared/spaced-revision/directives/spaced-revision/spaced-revision-modal.htm',
            modal: true
        }).show();  		
	}
	
});