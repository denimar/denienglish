(function() {
    
    'use strict';

    angular
	    .module('app')
	    .service('textRestService', textRestService);

	function textRestService(restService) {
		var vm = this;

		vm.list = function(cd_item) {
			return restService.requestWithPromise('text/list', {'cd_item': cd_item});
		}

		vm.getContent = function(cd_texto) {
			return restService.requestWithPromise('text/content/get', {'cd_texto': cd_texto});
		}

		vm.setContent = function(cd_texto, content) {
			var successfullyMessage = {
				title: 'Texts',
				message: 'text updated successfully!'
			}
			return restService.requestWithPromisePayLoad('text/content/set', {}, {'cd_texto': cd_texto, 'tx_conteudo': content}, successfullyMessage);
		}


	};

})();	