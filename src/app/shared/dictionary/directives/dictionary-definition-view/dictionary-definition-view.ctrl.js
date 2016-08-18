angular.module('app').controller('DictionaryDefinitionViewCtrl', function($scope, dictionaryDefinitionViewSrv) {
	
	dictionaryDefinitionViewSrv.setController(this);
	
	this.currentDefinition = null;	

	this.editingDefinition = false;

	this.definitionEditClick = dictionaryDefinitionViewSrv.definitionEditClick;
	this.definitionSaveClick = dictionaryDefinitionViewSrv.definitionSaveClick;
	this.definitionCancelClick = dictionaryDefinitionViewSrv.definitionCancelClick;

	$scope.$watch('ctrl.cdDicionario', function(newValue, oldValue) {
		dictionaryDefinitionViewSrv.refreshDefinition(newValue);	
	});

});