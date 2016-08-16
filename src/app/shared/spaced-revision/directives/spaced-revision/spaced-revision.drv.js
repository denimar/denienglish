angular.module('spacedRevisionMdl').directive('spacedRevision', function(spacedRevisionSrv, revisionSrv) {
	
	return {
		restrict: 'E',
		bindToController: {
			cdItem: '@',
			showItemDetail: '@'
		},
		controller: 'SpacedRevisionCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'src/app/shared/spaced-revision/directives/spaced-revision/spaced-revision.tpl.htm',
		link: function(scope, element, attrs, controller, transcludeFn) {

			scope.$watch('ctrl.cdItem', function(newCdItem, oldCdItem) {
				if (newCdItem) {
					revisionSrv.getExpressions(newCdItem).then(function(response) {	
						scope.ctrl.expressions = response;
						spacedRevisionSrv.selectExpression(scope.ctrl, 0);
						scope.ctrl.element = element;
						spacedRevisionSrv.updateLearnedPercentage(scope.ctrl);
					});
				}
			});

			/*
			scope.$watch('ctrl.model.expression.learnedRate', function(newLearnedRate, oldLearnedRate) {
				if (newLearnedRate) {
					revisionSrv.setLevelOfLearning(scope.ctrl.currentExpression.cdDicionario, scope.ctrl.currentExpression.cdPronuncia, newLearnedRate);
					scope.ctrl.currentExpression.nrLevelOfLearning = newLearnedRate;
					spacedRevisionSrv.updateLearnedPercentage(scope.ctrl);
				}
			});
			*/

		}
	}
	
});