angular.module('app').controller('PronunciationModalCtrl', function(pronunciationModalSrv, PronunciationModalEnums) {

	//use this control in the service	
	pronunciationModalSrv.setController(this);

	this.searchState = PronunciationModalEnums.SearchState.STOPPED; //will be fulfilled by PronunciationModalEnums.SearchState enum
	this.searchValue = '';

	this.gridPronunciationOptions = pronunciationModalSrv.getGridPronunciationOptions();

	this.searchInputChange = pronunciationModalSrv.searchInputChange;
	this.searchInputKeydown = pronunciationModalSrv.searchInputKeydown;

	this.searchButtonClick = pronunciationModalSrv.searchButtonClick;
	this.searchButtonAddClick = pronunciationModalSrv.searchButtonClick;
	this.showSearchButton = pronunciationModalSrv.showSearchButton;

	this.showLoading = pronunciationModalSrv.showLoading;

});
