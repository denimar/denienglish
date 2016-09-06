(function() {
    
    'use strict';

    angular
        .module('text')
        .controller('textController', textController);

    function textController($scope, $rootScope, $routeParams, dictionaryService, dictionaryModalService, pronunciationService, pronunciationModalService, textRestService, textService, generalService, stringService, uiDeniModalSrv, spacedRevisionModalService, itemRestService) {
         
        var vm = this;

        vm.editing = false;
        vm.params = $routeParams;
        vm.texts = [];
        vm.selectedIndex = -1;
        vm.contentStored = ''; //used by cancel button to rescue the previous value
        vm.content = '';
        vm.formatedContent = '';     
        vm.t05itm = null;
        vm.t07txt = null;

        itemRestService.get(vm.params.cdItem).then(function(serverResponse) {
            vm.t05itm = serverResponse.data.data[0];
            $rootScope.subTitle = vm.t05itm.dsItem;
        });

        textRestService.list(vm.params.cdItem).then(function(serverResponse) {
        	vm.texts = serverResponse.data.data;
            vm.selectedIndex = 0;     	
        });

        vm.dictionaryModalClick = function() {
            dictionaryModalService.showModal($rootScope).then(function(dictionaryData) {
                textService.setContent(vm, $scope, vm.content);
            });
        };

        vm.pronunciationModalClick = function() {
            pronunciationModalService.showModal($rootScope).then(function(pronunciationData) {
                textService.setContent(vm, $scope, vm.content);
            });
        };

        $scope.$watch('ctrl.selectedIndex', function(current, old){
            if ((angular.isDefined(current)) && (current !== old)) {
            	if (vm.texts.length > 0) {
                    $rootScope.loading = true;
        	    	vm.t07txt = vm.texts[current];

        			textRestService.getContent(vm.t07txt.cdTexto).then(function(serverResponse) {
        				generalService.getAllExpressions().then(function(response) {
                            textService.setContent(vm, $scope, serverResponse.data.data[0].txConteudo);
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
            textRestService.setContent(vm.t07txt.cdTexto, vm.content).then(function(serverResponse) {           
                textService.setContent(vm, $scope, serverResponse.data[0].txConteudo);
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
                pronunciationService.listenExpression(selection.toString().trim());
            }
        };

        vm.spacedRevisionClick = function() {
            spacedRevisionModalService.showModal($scope, vm.params.cdItem);
        }

        $scope.openDictionary = function(cdDicionario, dsExpressao) {
            dictionaryService.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
        };    

        $scope.openPronunciation = function(dsExpressao) {
            pronunciationService.listenExpression(dsExpressao);
        };     

    };

})();    