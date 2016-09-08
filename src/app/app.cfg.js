angular.module('app').config(function($routeProvider) {
	
    $routeProvider
        .when('/:cdCategoria?', {
            templateUrl : 'src/app/components/home/home.view.html',
            controller: 'homeController',
            controllerAs: 'ctrl'
        })
        .when('/text/:cdItem', {
            templateUrl : 'src/app/components/text/text.view.html',
            controller: 'textController',
            controllerAs: 'ctrl'
        })
        /*
        .when('/text/:cdItem', {
            templateUrl : 'app/shared/spaced-revision/teste.htm',
            controller: 'TesteCtrl',
            controllerAs: 'ctrl'
        })
        */
        .when('/video/:cdItem', {
            templateUrl : 'src/app/components/video/video.view.html',
            controller: 'videoController',
            controllerAs: 'ctrl'
        }).
    	otherwise({
    		redirectTo: '/'
    	});	

});