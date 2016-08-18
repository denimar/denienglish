angular.module('TextMdl').service('TextSrv', function(AppSrv, TextRestSrv, StringSrv, GeneralSrv) {

	var vm = this;

	vm.setContent = function(controller, scope, content) {
        var panelEditor = $('.text .text-content');                        
		controller.content = content;
        //controller.formatedContent = $sce.trustAsHtml(StringSrv.addLinksDictionaryAndPronunciation(controller.content));
        controller.formatedContent = StringSrv.addLinksDictionaryAndPronunciation(controller.content);
		GeneralSrv.insertHtmlWithController(panelEditor, controller.formatedContent, 'TextCtrl', scope);
	}


});