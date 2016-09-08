(function() {
	
	'use strict';

	angular
		.module('text')
		.service('textService', textService);

	function textService(textRestService, stringService, generalService) {

		var vm = this;
		vm.topParentNodeId = 275; //t02ctg.cdCategoria from the top parent node

		vm.setContent = function(controller, scope, content) {
	        var panelEditor = $('.text .text-content');                        
			controller.content = content;
	        controller.formatedContent = stringService.addLinksDictionaryAndPronunciation(controller.content);
			generalService.insertHtmlWithController(panelEditor, controller.formatedContent, 'textController', scope);
		};


	}

})();