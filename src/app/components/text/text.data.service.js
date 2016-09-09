(function() {
    
    'use strict';

    angular
	    .module('text')
	    .factory('textDataService', textDataService);

	function textDataService(restService) {

		return {
			list: textList,
			getContent: textGetContent,
			setContent: textSetContent
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function textList(cdItem) {
			return restService.requestWithPromise('text/list', {'cd_item': cdItem});
		};

		function textGetContent(cdTexto) {
			return restService.requestWithPromise('text/content/get', {'cd_texto': cdTexto});
		};

		function textSetContent(cdTexto, content) {
			var successfullyMessage = {
				title: 'Texts',
				message: 'text updated successfully!'
			};
			return restService.requestWithPromisePayLoad('text/content/set', {}, {'cd_texto': cdTexto, 'tx_conteudo': content}, successfullyMessage);
		};

	}
		
})();	