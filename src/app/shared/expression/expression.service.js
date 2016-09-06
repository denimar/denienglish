(function() {

	'use strict';

	angular
		.module('expression')
		.service('expressionService', expressionService);

	function expressionService() {
		var vm = this;
		vm.loadedExpressions = []; //store the joining between dictionary and pronunciation expressions

	};

})();