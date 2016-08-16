angular.module('app').service('GeneralSrv', function($q, $sce, $compile, DictionaryRestSrv, PronunciationRestSrv, AppSrv) {

	var me = this;

	me.getAllExpressions = function() {
		var deferred = $q.defer();

		DictionaryRestSrv.list().then(function(responseDictionary) {
			AppSrv.dictionaryExpressions = responseDictionary.data.data;
	
			PronunciationRestSrv.list().then(function(responsePronunciation) {
				AppSrv.pronunciationExpressions = responsePronunciation.data.data;	

				AppSrv.allExpressions = AppSrv.dictionaryExpressions.concat(AppSrv.pronunciationExpressions);
				deferred.resolve(AppSrv.allExpressions);
			}, function(reasonPronunciation) {
				console.error(reasonPronunciation);
			});

		}, function(reasonDictionary) {
			console.error(reasonDictionary);
		});


		return deferred.promise;
	}

	/**
	 * Insert into a element a specific html and binding it with a controller
	 * passed by parameter
	 *
	 */
	 /*
	me.insertHtmlWithController = function(targetElement, html, controller) {
		var $div = $('<div ng-controller="' + controller + '">' + html + '</div>');
		targetElement.append($div);

		var scope = angular.element($div).scope();
		$compile($div)(scope);
	}
	*/

	me.insertHtmlWithController = function(targetElement, html, controller, scope) {	
		targetElement.html('')
		var $div = $('<div>' + html + '</div>');
		$compile($div)(scope);
		targetElement.append($div);
	}	

});