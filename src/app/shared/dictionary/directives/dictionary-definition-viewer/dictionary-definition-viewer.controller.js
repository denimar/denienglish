(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('dictionaryDefinitionViewerController', dictionaryDefinitionViewerController);

	function dictionaryDefinitionViewerController($scope, dictionaryDefinitionViewerService) {
		
		dictionaryDefinitionViewerService.setController(this);
		
		this.currentDefinition = null;	

		this.editingDefinition = false;

		this.definitionEditClick = dictionaryDefinitionViewerService.definitionEditClick;
		this.definitionSaveClick = dictionaryDefinitionViewerService.definitionSaveClick;
		this.definitionCancelClick = dictionaryDefinitionViewerService.definitionCancelClick;

		$scope.$watch('ctrl.cdDicionario', function(newValue, oldValue) {
			dictionaryDefinitionViewerService.refreshDefinition(newValue);	
		});

	};

})();	