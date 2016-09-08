(function() {
    
    'use strict';

    angular
	    .module('text')
	    .service('textRestService', textRestService);

	function textRestService(restService) {
		var vm = this;

		vm.list = function(cdItem) {
			return restService.requestWithPromise('text/list', {'cd_item': cdItem});
		};

		vm.getContent = function(cdTexto) {
			return restService.requestWithPromise('text/content/get', {'cd_texto': cdTexto});
		};

		vm.setContent = function(cdTexto, content) {
			var successfullyMessage = {
				title: 'Texts',
				message: 'text updated successfully!'
			};
			return restService.requestWithPromisePayLoad('text/content/set', {}, {'cd_texto': cdTexto, 'tx_conteudo': content}, successfullyMessage);
		};


	}

})();	