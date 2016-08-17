angular.module('app').controller('DictionaryModalCtrl', function(dictionaryModalSrv) {

	//use this control in the service	
	dictionaryModalSrv.setController(this);

	this.searchState; //will be fulfilled by DictionaryModalEnums.SearchState enum
	this.searchValue = '';

	this.gridDictionaryOptions = dictionaryModalSrv.getGridDictionaryOptions();

	this.searchInputChange = dictionaryModalSrv.searchInputChange;

	this.searchInputKeydown = dictionaryModalSrv.searchInputKeydown;

	this.showSearchButton = dictionaryModalSrv.showSearchButton;

	this.searchButtonClick = dictionaryModalSrv.searchButtonClick;

	this.searchButtonAddClick = dictionaryModalSrv.searchButtonClick;

	this.showLoading = dictionaryModalSrv.showLoading;

});
