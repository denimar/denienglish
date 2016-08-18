angular.module('app').directive('dictionaryDefinitionView', function() {

	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			cdDicionario: '=?'
		},
		controller: 'DictionaryDefinitionViewCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'src/app/shared/dictionary/directives/dictionary-definition-view/dictionary-definition-view.tpl.htm',
		link: function(scope, element, attrs) {
			scope.ctrl.element = $(element);	    
		}	
	}

});