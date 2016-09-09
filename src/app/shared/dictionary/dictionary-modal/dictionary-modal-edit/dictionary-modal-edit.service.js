(function() {

      'use strict';

      angular
            .module('app')
            .service('dictionaryModalEditService', dictionaryModalEditService);

      function dictionaryModalEditService($q, $interval, uiDeniModalSrv, dictionaryDataService) {
            var vm = this;
            vm.controller;      
            
            vm.setController = function(controller) {
                  vm.controller = controller;
            };

      	vm.showModal = function(scope, recordToEdit) {
                  var deferred = $q.defer();

                  uiDeniModalSrv.createWindow({
                        scope: scope,
                        title: 'Dictionary - Editing',
                        width: '400px',         
                        height: '200px',
                        position: uiDeniModalSrv.POSITION.CENTER,
                        buttons: [uiDeniModalSrv.BUTTON.OK],
                        urlTemplate: 'src/app/shared/dictionary/dictionary-modal/dictionary-modal-edit/dictionary-modal-edit.view.html',
                        modal: true,
                        listeners: {

                        	onshow: function(wnd) {
                                    var intervalPromise = $interval(function() {

                                          if (vm.controller) {
                                                $interval.cancel(intervalPromise);

                                                vm.controller.model.dsExpression = recordToEdit.dsExpressao;
                                                vm.controller.model.dsTags = recordToEdit.dsTags;    

                                                $(wnd).keydown(function() {
                                                      var key = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
                                                      if ((key == 13) && (event.target.name == 'tagsEdit')) {  // 13 is the RETURN key
                                                            wnd.close('ok');
                                                      }
                                                });
                                          }

                                    }, 100);
                        	}

                        }
                  }).show().then(function(modalResponse) {
                        if (modalResponse.button == 'ok') {
                              dictionaryDataService.upd(recordToEdit.cdDicionario, vm.controller.model.dsExpression, vm.controller.model.dsTags);
                              deferred.resolve(vm.controller.model);
                        }
                  });

                  return deferred.promise;
      	};

      };

})();