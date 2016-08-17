angular.module('TextMdl').controller('TextCtrl', function($scope, $rootScope, $routeParams, AppSrv, TextRestSrv, TextSrv, GeneralSrv, StringSrv, uiDeniModalSrv) {
     
    var vm = this;
    vm.editing = false;
    vm.params = $routeParams;
    vm.texts = [];
    vm.selectedIndex = -1;
    vm.contentStored = ''; //used by cancel button to rescue the previous value
    vm.content = '';
    vm.formatedContent = '';     
    vm.t07txt = null;

    TextSrv.configWYSIWYG(vm, $scope);

    TextRestSrv.list(vm.params.cdItem).then(function(serverResponse) {
    	vm.texts = serverResponse.data.data;
        vm.selectedIndex = 0;     	
    });

    $scope.$watch('ctrl.selectedIndex', function(current, old){
        if (current != old) {
        	if (vm.texts.length > 0) {
                $rootScope.loading = true;
    	    	vm.t07txt = vm.texts[current];

    			TextRestSrv.getContent(vm.t07txt.cdTexto).then(function(serverResponse) {
    				GeneralSrv.getAllExpressions().then(function(response) {
                        TextSrv.setContent(vm, $scope, serverResponse.data.data[0].txConteudo);
                        $rootScope.loading = false;
    				});
    			});
    		}	
        }
    });    

    vm.editClick = function() {
        vm.contentStored = vm.content;
        vm.editing = true;
    }

    $scope.openDictionary = function(expression) {
        alert('here');

        uiDeniModalSrv.createWindow({
            scope: $scope,
            title: 'Dictionary - ' + expression,
            width: '600px',         
            height: '300px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK],
            htmlTemplate: '<dictionary-view expression="house" style="width:100%;height:100%;display:block;"></dictionary-view>',
            modal: true
        }).show();        

    }     

    $scope.openPronunciation = function(expression) {
    	alert('Pronunciation - ' + expression);
    }     

});