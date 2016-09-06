angular.module('app').controller('AppCtrl', function($scope, $rootScope, $route, $routeParams, $location) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;		

	$rootScope.loading = false;

});