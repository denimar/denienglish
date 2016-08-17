angular.module('app').controller('DictionaryModalCtrl', function(dictionaryModalSrv, DictionaryModalEnums) {

	//use this control in the service	
	dictionaryModalSrv.setController(this);

	this.searchState = DictionaryModalEnums.SearchState.STOPPED; //will be fulfilled by DictionaryModalEnums.SearchState enum
	this.editingDefinition = false;
	this.searchValue = '';

	this.gridDictionaryOptions = dictionaryModalSrv.getGridDictionaryOptions();

	this.searchInputChange = dictionaryModalSrv.searchInputChange;
	this.searchInputKeydown = dictionaryModalSrv.searchInputKeydown;

	this.searchButtonClick = dictionaryModalSrv.searchButtonClick;
	this.searchButtonAddClick = dictionaryModalSrv.searchButtonClick;
	this.showSearchButton = dictionaryModalSrv.showSearchButton;

	this.showLoading = dictionaryModalSrv.showLoading;

	this.definitionEditClick = dictionaryModalSrv.definitionEditClick;
	this.definitionSaveClick = dictionaryModalSrv.definitionSaveClick;
	this.definitionCancelClick = dictionaryModalSrv.definitionCancelClick;

});
