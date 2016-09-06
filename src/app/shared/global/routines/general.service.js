(function() {

	'use strict';

	angular
		.module('routinesMdl')
		.service('generalService', generalService);

	function generalService($q, $sce, $compile, DictionaryRestSrv, PronunciationRestSrv, AppSrv) {
		var vm = this;

		vm.getAllExpressions = function() {
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
		};

		/**
		 * Insert into a element a specific html and binding it with a controller
		 * passed by parameter
		 *
		 */
		 /*
		vm.insertHtmlWithController = function(targetElement, html, controller) {
			var $div = $('<div ng-controller="' + controller + '">' + html + '</div>');
			targetElement.append($div);

			var scope = angular.element($div).scope();
			$compile($div)(scope);
		}
		*/

		vm.insertHtmlWithController = function(targetElement, html, controller, scope) {	
			targetElement.html('')
			var $div = $('<div>' + html + '</div>');
			$compile($div)(scope);
			targetElement.append($div);
		};	

		vm.getDataURLImagemObjeto = function(prObjeto, prLargura, prAltura, prQualidade) {
			var xLarguraOriginal = 0;
			var xAlturaOriginal = 0;	
			if (prObjeto instanceof HTMLImageElement) { //Imagem
				xLarguraOriginal = prObjeto.naturalWidth;
				xAlturaOriginal = prObjeto.naturalHeight;		
			} else {
				xLarguraOriginal = prObjeto.videoWidth;
				xAlturaOriginal = prObjeto.videoHeight;		
			}	
			
			var canvas = document.createElement('canvas');
			var xNovaLargura = prLargura;
			var xNovaAltura = prAltura;
			
			var xPerc = 1;
			if (xAlturaOriginal > xLarguraOriginal) {
				xPerc = xNovaLargura / xLarguraOriginal;							
				xNovaAltura = xPerc * xAlturaOriginal;
			} else {
				xPerc = xNovaAltura / xAlturaOriginal;
				xNovaLargura = xPerc * xLarguraOriginal;							
			}
			
			canvas.width  = xNovaLargura;
			canvas.height = xNovaAltura;
			var ctx = canvas.getContext('2d');

			ctx.drawImage(prObjeto,0,0,xLarguraOriginal,xAlturaOriginal,0,0,xNovaLargura,xNovaAltura);

			return canvas.toDataURL("image/png", prQualidade); //o certo é dimininuir também um pouco a qualidade...
		};


	};

})();	