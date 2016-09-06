(function() {

	'use strict'

	angular
		.module('pronunciation')
		.constant('pronunciationModalEnums', {
			SearchState: {
				STOPPED: 0,
				SEARCHING: 1,
				SEARCHED: 2,
				ADDING: 3,
				ADDED: 4,		
			},
		});	

})();