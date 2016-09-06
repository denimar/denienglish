(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('DictionaryModalEditController', DictionaryModalEditController);

	function DictionaryModalEditController(dictionaryModalEditService) {

		//use this control in the service	
		dictionaryModalEditService.setController(this);

		this.model = {};

	};

})();