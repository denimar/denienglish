(function() {

	'use strict'

	angular
		.module('pronunciation')
		.controller('pronunciationModalController', pronunciationModalController);

	function pronunciationModalController(pronunciationModalService, pronunciationModalEnums) {

		//use this control in the service	
		pronunciationModalService.setController(this);

		this.searchState = pronunciationModalEnums.SearchState.STOPPED; //will be fulfilled by pronunciationModalEnums.SearchState enum
		this.searchValue = '';

		this.gridPronunciationOptions = pronunciationModalService.getGridPronunciationOptions();

		this.searchInputChange = pronunciationModalService.searchInputChange;
		this.searchInputKeydown = pronunciationModalService.searchInputKeydown;

		this.searchButtonClick = pronunciationModalService.searchButtonClick;
		this.searchButtonAddClick = pronunciationModalService.searchButtonAddClick;
		this.showSearchButton = pronunciationModalService.showSearchButton;

		this.showLoading = pronunciationModalService.showLoading;

	};

})();