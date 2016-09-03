angular.module('app').controller('AppCtrl', function($scope, $rootScope, $route, $routeParams, $location, AppSrv) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;		

	$rootScope.loading = false;
	//$scope.auxiliarMenu	= AppSrv.auxiliarMenu;


});