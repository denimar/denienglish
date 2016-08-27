'use strict'

angular.module('app').controller('SpacedRevisionSelectExpressionsModalCtrl', function(spacedRevisionSelectExpressionsModal) {

	this.selectedExpressions = {};

	spacedRevisionSelectExpressionsModal.setController(this);
	
	this.expressions = spacedRevisionSelectExpressionsModal.getExpressions();

	this.filterExpressionsDicionary = spacedRevisionSelectExpressionsModal.filterExpressionsDicionary;
	this.filterExpressionsPronunciation = spacedRevisionSelectExpressionsModal.filterExpressionsPronunciation;

});