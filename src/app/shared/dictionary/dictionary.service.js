(function() {
	
	'use strict';

	angular
		.module('dictionary')
		.service('dictionaryService', dictionaryService);

	function dictionaryService($q, dictionaryDataService, dictionaryModalService, uiDeniModalSrv, pronunciationService) {
		var vm = this;

		vm.list = function() {
			return dictionaryDataService.list();
		};

		vm.add = function(ds_expressao, ds_tags) {
			return dictionaryDataService.add(ds_expressao, ds_tags);
		}

		vm.del = function(cd_dicionario) {
			return dictionaryDataService.del(cd_dicionario);
		};


		vm.learnedToogle = function(cd_dicionario) {
			return dictionaryDataService.learnedToogle(cd_dicionario);
		};

		vm.definitionSet = function(cd_dicionario, definition) {
			return dictionaryDataService.definitionSet(cd_dicionario, definition);
		};

		vm.definitionGet = function(cd_dicionario) {
			var deferred = $q.defer();

			dictionaryDataService.definitionGet(cd_dicionario).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].txDefinicao);			
			});

			return deferred.promise;
		};

		vm.openDictionaryDefinitionView = function(scope, cdDicionario, dsExpressao) {

			if (event.ctrlKey) {
				
				pronunciationService.listenExpression(dsExpressao);

			} else {
		        uiDeniModalSrv.createWindow({
		            scope: scope,
		            title: 'Dictionary - ' + dsExpressao,
		            width: '800px',         
		            height: '500px',
		            position: uiDeniModalSrv.POSITION.CENTER,
		            buttons: [uiDeniModalSrv.BUTTON.OK],
		            htmlTemplate: '<dictionary-definition-viewer cd-dicionario="' + cdDicionario + '"></dictionary-definition-viewer>',
		            modal: true
		        }).show();        
		    }

		};	

	};

})();	