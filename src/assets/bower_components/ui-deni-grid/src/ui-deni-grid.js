(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.directive('uiDeniGrid', uiDeniGrid);

	function uiDeniGrid($templateCache, uiDeniGridSrv) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			replace: false,
			bindToController: true,
			controllerAs: 'ctrl',
			controller: 'uiDeniGridCtrl',
			template: $templateCache.get('ui-deni-grid')
		}
	}	

})();	
