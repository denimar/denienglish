(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('SpacedRevisionSelectExpressionsModalController', SpacedRevisionSelectExpressionsModalController);

	function SpacedRevisionSelectExpressionsModalController(spacedRevisionSelectExpressionsModalService) {
		this.selectedExpressions = {};

		spacedRevisionSelectExpressionsModalService.setController(this);
		
		this.expressions = spacedRevisionSelectExpressionsModalService.getExpressions();

		this.filterExpressionsDicionary = spacedRevisionSelectExpressionsModalService.filterExpressionsDicionary;
		this.filterExpressionsPronunciation = spacedRevisionSelectExpressionsModalService.filterExpressionsPronunciation;

	};

})();	