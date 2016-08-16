/**
 *
 *
 */

angular.module('ui-deni-grid').directive('uiDeniGrid', function($templateCache, uiDeniGridSrv) {

	return {
		restrict: 'E',
		scope: {
			options: '='
		},
		replace: false,
		bindToController: true,
		controllerAs: 'ctrl',
		controller: 'uiDeniGridCtrl',
		template: $templateCache.get('ui-deni-grid'),
		link: function(scope, element) {

			/*
	    	scope.$watch(function() {
	    		return element.get(0).offsetHeight;
	    	}, function(newElementHeight, oldElementHeight) {
	    		if (newElementHeight) {
	    			console.log(newElementHeight);
	    			console.log(uiDeniGridSrv);
	    			var wrapper = element.find('.ui-deni-grid-wrapper');
					wrapper.height(newElementHeight);
				}	
	    	});
	    	*/

		}
	}

});	
