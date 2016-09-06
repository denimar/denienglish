(function() {
	'use strict';

	angular
		.module('routinesMdl')
		.service('restService', restService);

	function restService($q, $http, uiDeniModalSrv) {

		var vm = this;

		var SERVER_URL = 'https://denienglishsrv-denimar.rhcloud.com/'; //Hosting in Open Shift
		//var SERVER_URL = 'http://localhost:8087/denienglish/'; //Locally

	    vm.requestWithPromise = function(relativeUrl, parameters, successMessage, confirmMessage) {
			var deferred = $q.defer();

			var execRequest = function() {
				var parametrosUrl = {params: parameters};			
				$http.get(SERVER_URL + relativeUrl, parametrosUrl)
					.then(function(retornoServer) {
						if (retornoServer.data.success) {
							if (successMessage) {						
								uiDeniModalSrv.ghost(successMessage.title, successMessage.message);
							}	
							deferred.resolve(retornoServer);
						} else {
							throw retornoServer.data.message;
						}	
					})
					.catch(function(retornoServer) {
						if (retornoServer.data.message) {
							uiDeniModalSrv.error(retornoServer.data.message);
						} else {
							uiDeniModalSrv.error(retornoServer.data);
						}

						deferred.reject(retornoServer);
					});
			};

			try { 
				angular.module("ngRoute") 
			} catch(err) {
				//Enter here only when it is testing, because in this case there no need to show messages
				successMessage = null;
				confirmMessage = null;
			}

			if (confirmMessage) {
				uiDeniModalSrv.confirm(confirmMessage)
					.then(function (response) { 
						if (response.button === 'yes') {
							execRequest();
						}
					});	
			} else {
				execRequest();
			}

			return deferred.promise;
	    };

	    vm.requestWithPromisePayLoad = function(relativeUrl, parameters, parametersPayLoad, successMessage, confirmMessage) {
			var deferred = $q.defer();

			var execRequest = function() {
		        var resource = $resource(SERVER_URL + relativeUrl, parameters, {}, {'request': { method:'POST'}});
		        resource.save(parametersPayLoad).$promise
					.then(function(retornoServer) {
						if (retornoServer.success) {
							if (successMessage) {		
								uiDeniModalSrv.ghost(successMessage.title, successMessage.message);			
							}	
							deferred.resolve(retornoServer);
						} else {
							uiDeniModalSrv.error(retornoServer.message);
							deferred.reject(retornoServer);
						}	
					})
					.catch(function(retornoServer) {
						if (retornoServer.message) {
							uiDeniModalSrv.error(retornoServer.message);
						} else if (retornoServer.data) {
							if (retornoServer.data.message) {
								uiDeniModalSrv.error(retornoServer.data.message);
							} else {
								uiDeniModalSrv.error(retornoServer.data);
							}
						} else {
							uiDeniModalSrv.error('Inespected Error!');
						}	
						deferred.reject(retornoServer);
					});
			};

			if (confirmMessage) {
				
				uiDeniModalSrv.confirm(confirmMessage)
					.then(function (response) { 
						if (response.button === 'yes') {
							execRequest();
						}
					});	

			} else {
				execRequest();
			}

			return deferred.promise;
	    };    


	};

})();	