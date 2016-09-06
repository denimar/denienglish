(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('DictionaryModalController', DictionaryModalController);

	function DictionaryModalController(dictionaryModalService, dictionaryModalEnums) {

		//use this control in the service	
		dictionaryModalService.setController(this);

		this.searchState = dictionaryModalEnums.SearchState.STOPPED; //will be fulfilled by dictionaryModalEnums.SearchState enum
		this.searchValue = '';

		this.gridDictionaryOptions = dictionaryModalService.getGridDictionaryOptions();

		this.searchInputChange = dictionaryModalService.searchInputChange;
		this.searchInputKeydown = dictionaryModalService.searchInputKeydown;

		this.searchButtonClick = dictionaryModalService.searchButtonClick;
		this.searchButtonAddClick = dictionaryModalService.searchButtonAddClick;
		this.showSearchButton = dictionaryModalService.showSearchButton;

		this.showLoading = dictionaryModalService.showLoading;

	};

})();