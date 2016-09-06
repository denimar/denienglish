(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('homeController', homeController);

	function homeController($scope, $rootScope, $routeParams, homeService, generalService) {
		
		var vm = this;
		vm.categoryPath = null;		
		vm.currentCategory = null; //Category Id	

		generalService.createHamburgerButton(['show-xs', 'hide-gt-xs'], generalService.SideEnum.LEFT);

		vm.currentNavItem = "pageItems";
		vm.currentCategoryNode = null; //Category Node
		
		$.jstree.defaults.core.themes.variant = "large";	

		vm.addCategoryClick = function() {
			homeService.addCategoryClick($scope, vm.currentCategoryNode.id);
		};	

		vm.editCategoryClick = function() {
			homeService.editCategoryClick($scope, vm.currentCategoryNode);
		};	

		vm.delCategoryClick = function() {
			homeService.delCategoryClick(vm.currentCategoryNode);
		}

	    vm.addNewItemButtonClick = function(event) {
	    	homeService.addNewItemButtonClick(vm, $scope, event);
	    };	

		homeService.configureTreeView(vm, vm.currentCategory || $routeParams.cdCategoria);

		homeService.configureGridItems(vm, $scope);
			
	    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
	    	vm.currentNavItem = newCurrentNavItem;
	    	if (newCurrentNavItem) {
	    		homeService.reloadDataGrid(vm);
	    	}
	    });

	}

})();	