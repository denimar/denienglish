angular.module('app').config(function($routeProvider) {
	
    $routeProvider
        .when("/:cdCategoria?", {
            templateUrl : "src/app/components/home/home.htm",
            controller: "HomeCtrl",
            controllerAs: "ctrl"
        })
        .when("/text/:cdItem", {
            templateUrl : "src/app/components/text/text.htm",
            controller: "TextCtrl",
            controllerAs: "ctrl"
        })
        /*
        .when("/text/:cdItem", {
            templateUrl : "app/shared/spaced-revision/teste.htm",
            controller: "TesteCtrl",
            controllerAs: "ctrl"
        })
        */
        .when("/video/:cdItem", {
            templateUrl : "src/app/components/video/video.htm",
            controller: "VideoCtrl",
            controllerAs: "ctrl"
        }).
    	otherwise({
    		redirectTo: '/'
    	});	

});