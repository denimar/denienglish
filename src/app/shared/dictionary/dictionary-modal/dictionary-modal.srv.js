'use strict';

angular.module('app').service('dictionaryModalSrv', function($rootScope, $q, $timeout, uiDeniModalSrv, DictionaryModalEnums, AppSrv, AppConsts, DictionaryRestSrv, dictionaryModalEditSrv) {

	var vm = this;
      vm.controller;      

      var expressionAdded = null;
      
      vm.setController = function(controller) {
            vm.controller = controller;
      };

	vm.showModal = function(scope) {
            var deferred = $q.defer();

            uiDeniModalSrv.createWindow({
                  scope: scope,
                  title: 'Dictionary',
                  width: '700px',         
                  height: '580px',
                  position: uiDeniModalSrv.POSITION.CENTER,
                  buttons: [uiDeniModalSrv.BUTTON.CLOSE],
                  urlTemplate: 'src/app/shared/dictionary/dictionary-modal/dictionary-modal.tpl.htm',
                  modal: true,
                  listeners: {

                  	onshow: function(objWindow) {
                  	}

                  }
            }).show().then(function() {
                  AppSrv.allExpressions = AppSrv.pronunciationExpressions.concat(vm.controller.gridDictionaryOptions.alldata);
                  deferred.resolve(vm.controller.gridDictionaryOptions.alldata);
            });

            return deferred.promise;
	};	

      var _editExpression = function(record) {
            dictionaryModalEditSrv.showModal($rootScope, record).then(function(modelAdded) {
                  record.dsExpressao = modelAdded.dsExpression;
                  record.dsTags = modelAdded.dsTags;   
                  var selectedRowIndex = vm.controller.gridDictionaryOptions.api.getSelectedRowIndex();
                  vm.controller.gridDictionaryOptions.api.repaintSelectedRow();                                             
                  vm.controller.gridDictionaryOptions.api.selectRow(selectedRowIndex);
            });
      }

      vm.getGridDictionaryOptions = function() {

            return {
                  keyField: 'cdDicionario',
                  rowHeight: '25px',
                  data: AppSrv.dictionaryExpressions,
                  hideHeaders: true,
                  columns: [
                        {
                              name: 'dsExpressao',
                              width: '40%'
                        },
                        {
                              name: 'dsTags',
                              width: '40%'
                        },
                        {
                              width: '10%',
                              action: {
                                    mdIcon: 'edit',
                                    tooltip: 'Edit the current expression',
                                    fn: function(record, column, imgActionColumn) {
                                          _editExpression(record);
                                    }
                              }                 
                        },
                        {
                              width: '10%',
                              action: {
                                    mdIcon: 'delete_forever',
                                    tooltip: 'Remove a expression from dictionary',
                                    fn: function(record, column, imgActionColumn) {
                                          DictionaryRestSrv.del(record.cdDicionario).then(function(serverResponse) {

                                                var deleteItemFn = function(data) {
                                                      for (var i = data.length - 1; i >= 0; i--) {
                                                            if (data[i].cdDicionario == record.cdDicionario) {
                                                                  data.splice(i, 1);
                                                                  break;
                                                            }
                                                      }
                                                }

                                                deleteItemFn(vm.controller.gridDictionaryOptions.data);
                                                deleteItemFn(vm.controller.gridDictionaryOptions.alldata);                  
                                                vm.controller.gridDictionaryOptions.api.loadData(vm.controller.gridDictionaryOptions.alldata);

                                          });
                                    }
                              }                 
                        }
                  ],
                  listeners: {
                        onselectionchange: function(ctrl, element, rowIndex, record) {
                              var dictionaryDefinitionView = $('.dictionary-modal .dictionary-definition-view');
                              var element = angular.element(dictionaryDefinitionView);
                              var scope = element.scope();
                              scope.$$childTail.ctrl.cdDicionario = record.cdDicionario;
                              if (!scope.$$phase) {
                                    scope.$apply();
                              }                              
                        },

                        onbeforeload: function() {
                              var dictionaryDefinitionView = $('.dictionary-modal .dictionary-definition-view');
                              var element = angular.element(dictionaryDefinitionView);
                              var scope = element.scope();
                              scope.$$childTail.ctrl.cdDicionario = null;
                        },

                        onafterload: function(data, gridOptions) {
                              if (expressionAdded) {
                                    gridOptions.api.selectRow(expressionAdded);
                                    expressionAdded = null;
                              }
                        },

                        onrowdblclick: function(record, rowElement, rowIndex) {
                              _editExpression(record);
                        }
                  }   
            }

      };

      vm.searchInputChange = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.SEARCHING;
      };

      vm.searchInputKeydown = function() {
            if (event.keyCode == 13) {  //Return Key

                  //Find a Record
                  if (vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHING) {
                        vm.searchButtonClick(vm.controller);

                  //Add a Record    
                  } else if (vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHED) {
                        vm.searchButtonAddClick()
                  }     
            }
      };

      vm.showSearchButton = function(button) {
            return (
                        (button == 'search' && vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHING) ||
                        (button == 'add' && vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHED)
                   );
      };

      vm.searchButtonClick = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.SEARCHED;            
            var searchInput = $('.dictionary-modal .search-input');            
            vm.controller.gridDictionaryOptions.api.filter(searchInput.val());            
      };

      vm.searchButtonAddClick = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.ADDED;            
            var searchInput = $('.dictionary-modal .search-input');            
            var expressionAdd = searchInput.val();
            
            DictionaryRestSrv.add(expressionAdd, '').then(function(serverResponse) {
                  expressionAdded = serverResponse.data.data[0];

                  var insertItemFn = function(data) {
                        var indexAdd = data.length;
                        for (var i = data.length - 1; i >= 0; i--) {
                              if (expressionAdded.dsExpressao > data[i].dsExpressao) {
                                    indexAdd = i;
                                    break;
                              }
                        }
                        data.splice(indexAdd, 0, expressionAdded);                        
                  }

                  insertItemFn(vm.controller.gridDictionaryOptions.data);
                  insertItemFn(vm.controller.gridDictionaryOptions.alldata);                  
                  vm.controller.gridDictionaryOptions.api.loadData(vm.controller.gridDictionaryOptions.alldata);

                  vm.controller.searchState = DictionaryModalEnums.SearchState.STOPPED;
            });
      };

      vm.showLoading = function() {
            return vm.controller.searchState == DictionaryModalEnums.SearchState.ADDED;
      };


});