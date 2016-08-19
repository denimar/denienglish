'use strict';

angular.module('TextMdl').controller('TextCtrl', function($scope, $rootScope, $routeParams, dictionarySrv, dictionaryModalSrv, pronunciationSrv, pronunciationModalSrv, AppSrv, TextRestSrv, TextSrv, GeneralSrv, StringSrv, uiDeniModalSrv) {
     
    var vm = this;

    vm.editing = false;
    vm.params = $routeParams;
    vm.texts = [];
    vm.selectedIndex = -1;
    vm.contentStored = ''; //used by cancel button to rescue the previous value
    vm.content = '';
    vm.formatedContent = '';     
    vm.t07txt = null;

    TextRestSrv.list(vm.params.cdItem).then(function(serverResponse) {
    	vm.texts = serverResponse.data.data;
        vm.selectedIndex = 0;     	
    });

    vm.dictionaryModalClick = function() {
        dictionaryModalSrv.showModal($rootScope).then(function(dictionaryData) {
            TextSrv.setContent(vm, $scope, vm.content);
        });
    };

    vm.pronunciationModalClick = function() {
        pronunciationModalSrv.showModal($rootScope).then(function(pronunciationData) {
            TextSrv.setContent(vm, $scope, vm.content);
        });
    };

    $scope.$watch('ctrl.selectedIndex', function(current, old){
        if ((angular.isDefined(current)) && (current !== old)) {
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
    };

    vm.saveClick = function() {
        TextRestSrv.setContent(vm.t07txt.cdTexto, vm.content).then(function(serverResponse) {           
            TextSrv.setContent(vm, $scope, serverResponse.data[0].txConteudo);
            vm.editing = false;             
        });
    };

    vm.cancelClick = function() {
        vm.content = vm.contentStored;          
        vm.editing = false;
    };

    vm.listenSelectedTextClick = function() {
        var selection = window.getSelection();
        if (selection) {
            pronunciationSrv.listenExpression(selection.toString().trim());
        }
    };

    $scope.openDictionary = function(cdDicionario, dsExpressao) {
        dictionarySrv.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
    };    

    $scope.openPronunciation = function(dsExpressao) {
        pronunciationSrv.listenExpression(dsExpressao);
    };     

});