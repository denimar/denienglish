angular.module('app').controller('DictionaryModalCtrl', function(dictionaryModalSrv, DictionaryModalEnums) {

	//use this control in the service	
	dictionaryModalSrv.setController(this);

	this.searchState = DictionaryModalEnums.SearchState.STOPPED; //will be fulfilled by DictionaryModalEnums.SearchState enum
	this.searchValue = '';

	this.gridDictionaryOptions = dictionaryModalSrv.getGridDictionaryOptions();

	this.searchInputChange = dictionaryModalSrv.searchInputChange;
	this.searchInputKeydown = dictionaryModalSrv.searchInputKeydown;

	this.searchButtonClick = dictionaryModalSrv.searchButtonClick;
	this.searchButtonAddClick = dictionaryModalSrv.searchButtonAddClick;
	this.showSearchButton = dictionaryModalSrv.showSearchButton;

	this.showLoading = dictionaryModalSrv.showLoading;

});
