(function() {

	'use strict';

	angular
		.module('routines')
		.service('generalService', generalService);

	function generalService($q, $sce, $compile, dictionaryRestService, pronunciationRestService, expressionService) {
		var vm = this;
		vm.SideEnum = {
			LEFT: 1,
			RIGHT: 2
		};

		vm.getAllExpressions = function() {
			var deferred = $q.defer();

			dictionaryRestService.list().then(function(dictionaryResponseData) {
				pronunciationRestService.list().then(function(pronunciationResponseData) {
					expressionService.loadedExpressions = dictionaryResponseData.concat(pronunciationResponseData);
					deferred.resolve(expressionService.loadedExpressions);
				}, function(reasonPronunciation) {
					console.error(reasonPronunciation);
				});

			}, function(reasonDictionary) {
				console.error(reasonDictionary);
			});


			return deferred.promise;
		};

		/**
		 * className is waiting for a array of String considering: hide-x, hide-gt-xs, hide-sm, hide-md...
		 * side is waiting for generalService.SideEnum.LEFT | generalService.SideEnum.RIGHT
		 * reference: https://material.angularjs.org/latest/layout/options
		 */
		vm.createHamburgerButton = function(classArray, side) {
			var hamburgerIconButton = $(document.createElement('button'));
			hamburgerIconButton.addClass("md-button");		
			hamburgerIconButton.addClass("md-icon-button");
			hamburgerIconButton.addClass("md-ink-ripple");

			for (var index = 0 ; index < classArray.length ; index++) {
				var className = classArray[index];
				hamburgerIconButton.attr(className, "");
				hamburgerIconButton.addClass(className);	
			}

			var hamburgerIconButtonImg = $(document.createElement('img'));
			hamburgerIconButtonImg.attr('src', 'src/assets/images/hamburger.png');
			hamburgerIconButtonImg.addClass("hamburger-button");
			hamburgerIconButton.append(hamburgerIconButtonImg);

			var mainToobar = $('.md-toolbar-tools-main');

			if (side === vm.SideEnum.LEFT) {
				mainToobar.prepend(hamburgerIconButton);
			} else {
				mainToobar.append(hamburgerIconButton);			
			}	
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