(function() {

	'use strict';

	angular
		.module('dictionary')
		.directive('dictionaryDefinitionViewer', dictionaryDefinitionViewer);

	function dictionaryDefinitionViewer() {
		
		return {
			restrict: 'E',
			scope: {},
			bindToController: {
				cdDicionario: '=?'
			},
			controller: 'dictionaryDefinitionViewerController',
			controllerAs: 'ctrl',
			templateUrl: 'src/app/shared/dictionary/directives/dictionary-definition-viewer/dictionary-definition-viewer.view.html',
			link: function(scope, element, attrs) {
				scope.ctrl.element = $(element);	    
			}	
		}

	};

})();	