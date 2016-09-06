(function() {
	
	'use strict';

	angular
		.module('app')
		.service('spacedRevisionSelectExpressionsModalService', spacedRevisionSelectExpressionsModalService);

	function spacedRevisionSelectExpressionsModalService($rootScope, $timeout, $filter, $q, revisionService, revisionRestService, uiDeniModalSrv) {
		var vm = this;
		vm.controller;
		vm.expressions;

		vm.setController = function(controller) {
			vm.controller = controller;
		}

		vm.showModal = function(cdItem) {
			var deferred = $q.defer();

			$rootScope.loading = true;
		
			revisionService.getExpressions(cdItem, false).then(function(expressions) {
				$rootScope.loading = false;

				vm.expressions = expressions;			

		        var modal = uiDeniModalSrv.createWindow({
		            scope: $rootScope,
		            title: 'Spaced Revision - Selecting Expressions',
		            width: '750px',         
		            height: '600px',
		            position: uiDeniModalSrv.POSITION.CENTER,
		            buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
		            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-select-expressions-modal/spaced-revision-select-expressions-modal.view.html',
		            modal: true,
		            listeners: {

		            	onshow: function(objWindow) {
		            	}

		            }
		        });

				modal.show().then(function(modalResponse) {
					if (modalResponse.button == 'ok') {
						revisionRestService.updExpressions(cdItem, vm.controller.expressions).then(function() {
							deferred.resolve(vm.controller.expressions);
						});

					} else {
						deferred.reject();
					}
				});

			});			


			return deferred.promise;
		}

		vm.getExpressions = function() {
			return vm.expressions;
		}

		vm.filterExpressionsDicionary = function(expression) {
			return expression.t50dci;
		}

		vm.filterExpressionsPronunciation = function(expression) {
			return expression.t51prn;
		}

		/*
		vm.addWords = function() {

			vm.controller.dictionary = $filter('filter')(vm.expressions, function(record, index, array) {
				return record.t50dci;
			});

			vm.controller.pronunciation = $filter('filter')(vm.expressions, function(record, index, array) {
				return record.t51prn;
			});


		}

		/*
		vm.getNgModelExpression = function(expression) {
			var ngModel;
			if (expression.t50dci) {
				ngModel = 'd' + expression.t50dci.cdDicionario;
			} else {
				ngModel = 'p' + expression.t51prn.cdPronuncia;
			}

			vm.controller.selectedExpressions[ngModel] = true;

			return 'ctrl.selectedExpressions.' + ngModel;
		}
		*/

	};

})();	