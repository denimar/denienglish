angular.module('app').controller('HomeCtrl', function($scope, $rootScope, $routeParams, homeSrv, AppEnums, AppSrv) {
	
	var vm = this;
	vm.categoryPath = null;		

	AppSrv.createHamburgerButton(['show-xs', 'hide-gt-xs'], AppEnums.Side.LEFT);

	vm.currentNavItem = "pageItems";
	vm.currentCategoryNode = null; //Category Node
	
	$.jstree.defaults.core.themes.variant = "large";	

	vm.addCategoryClick = function() {
		homeSrv.addCategoryClick($scope, vm.currentCategoryNode.id);
	}	

	vm.editCategoryClick = function() {
		homeSrv.editCategoryClick($scope, vm.currentCategoryNode);
	}	

	vm.delCategoryClick = function() {
		homeSrv.delCategoryClick(vm.currentCategoryNode);
	}

    vm.addNewItemButtonClick = function(event) {
    	homeSrv.addNewItemButtonClick(vm, $scope, event);
    }	

	homeSrv.configureTreeView(vm, AppSrv.currentCategory || $routeParams.cdCategoria);

	homeSrv.configureGridItems(vm, $scope);
		
    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
    	vm.currentNavItem = newCurrentNavItem;
    	if (newCurrentNavItem) {
    		homeSrv.reloadDataGrid(vm);
    	}
    });

});