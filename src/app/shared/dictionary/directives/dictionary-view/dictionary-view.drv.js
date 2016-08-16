angular.module('dictionaryViewMdl').directive('dictionaryView', function() {

	return {
		restrict: 'E',
		bindToController: {
			expressao: '='
		},
		controller: 'DictionaryViewCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'srv/app/shared/dictionary-view/dictionary-view.tpl.htm'
	}

});