angular.module('TextMdl').service('TextSrv', function(AppSrv, TextRestSrv, StringSrv, GeneralSrv) {

	var vm = this;

	vm.configWYSIWYG = function(controller, scope) {

		var fnExecSaveButton = function() {
			TextRestSrv.setContent(controller.t07txt.cdTexto, controller.content).then(function(serverResponse) {			
				vm.setContent(controller, scope, serverResponse.data[0].txConteudo);
				controller.editing = false;				
			});	
		}

		var fnExecCancelButton = function() {
			controller.content = controller.contentStored;			
			controller.editing = false;
			scope.$apply();
		}

		controller.options = AppSrv.getConfigWYSIWYG(fnExecSaveButton, fnExecCancelButton);
	}

	vm.setContent = function(controller, scope, content) {
        var panelEditor = $('.text .text-content');                        
		controller.content = content;
        //controller.formatedContent = $sce.trustAsHtml(StringSrv.addLinksDictionaryAndPronunciation(controller.content));
        controller.formatedContent = StringSrv.addLinksDictionaryAndPronunciation(controller.content);
		GeneralSrv.insertHtmlWithController(panelEditor, controller.formatedContent, 'TextCtrl', scope);
	}


});