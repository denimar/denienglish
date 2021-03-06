angular.module('app').service('pronunciationModalSrv', function($q, AppSrv, uiDeniModalSrv, PronunciationModalEnums, AppConsts, PronunciationRestSrv, pronunciationSrv) {

	var vm = this;
      vm.controller;      

      var expressionAdded = null;
      
      vm.setController = function(controller) {
            vm.controller = controller;
      }

	vm.showModal = function(scope) {
            var deferred = $q.defer();

            uiDeniModalSrv.createWindow({
                  scope: scope,
                  title: 'Pronunciation',
                  width: '550px',         
                  height: '450px',
                  position: uiDeniModalSrv.POSITION.CENTER,
                  buttons: [uiDeniModalSrv.BUTTON.CLOSE],
                  urlTemplate: 'src/app/shared/pronunciation/pronunciation-modal/pronunciation-modal.tpl.htm',
                  modal: true,
                  listeners: {

                  	onshow: function(objWindow) {
      					
                  	}

                  }
            }).show().then(function() {
                  AppSrv.allExpressions = AppSrv.dictionaryExpressions.concat(vm.controller.gridPronunciationOptions.alldata);
                  deferred.resolve(vm.controller.gridPronunciationOptions.alldata);
            });

            return deferred.promise;
	}	

      vm.getGridPronunciationOptions = function() {

            return {
                  keyField: 'cdPronuncia',
                  rowHeight: '25px',
                  data: AppSrv.pronunciationExpressions,
                  hideHeaders: true,
                  columns: [
                        {
                              name: 'dsExpressao',
                              width: '80%'
                        },
                        {
                              width: '10%',
                              action: {
                                    mdIcon: 'headset',
                                    tooltip: 'Listen the selected expression',
                                    fn: function(record, column, imgActionColumn) {
                                          pronunciationSrv.listenExpression(record.dsExpressao);                 
                                    }
                              }                 
                        },
                        {
                              width: '10%',
                              action: {
                                    mdIcon: 'delete_forever',
                                    tooltip: 'Remove a expression from pronunciation',
                                    fn: function(record, column, imgActionColumn) {
                                          PronunciationRestSrv.del(record.cdPronuncia).then(function(serverResponse) {

                                                var deleteItemFn = function(data) {
                                                      for (var i = data.length - 1; i >= 0; i--) {
                                                            if (data[i].cdPronuncia == record.cdPronuncia) {
                                                                  data.splice(i, 1);
                                                                  break;
                                                            }
                                                      }
                                                }

                                                deleteItemFn(vm.controller.gridPronunciationOptions.data);
                                                deleteItemFn(vm.controller.gridPronunciationOptions.alldata);                  
                                                vm.controller.gridPronunciationOptions.api.loadData(vm.controller.gridPronunciationOptions.alldata);

                                          });
                                    }
                              }                 
                        }
                  ],
                  listeners: {
                        onafterload: function(data, gridOptions) {
                              if (expressionAdded) {
                                    gridOptions.api.selectRow(expressionAdded);
                                    expressionAdded = null;
                              }
                        },
                  }
            }

      }

      vm.searchInputChange = function() {
            vm.controller.searchState = PronunciationModalEnums.SearchState.SEARCHING;
      }

      vm.searchInputKeydown = function() {
            if (event.keyCode == 13) {  //Return Key

                  //Find a Record
                  if (vm.controller.searchState == PronunciationModalEnums.SearchState.SEARCHING) {
                        vm.searchButtonClick(vm.controller);

                  //Add a Record    
                  } else if (vm.controller.searchState == PronunciationModalEnums.SearchState.SEARCHED) {
                        vm.searchButtonAddClick()
                  }     
            }
      }

      vm.showSearchButton = function(button) {
            return (
                        (button == 'search' && vm.controller.searchState == PronunciationModalEnums.SearchState.SEARCHING) ||
                        (button == 'add' && vm.controller.searchState == PronunciationModalEnums.SearchState.SEARCHED)
                   );
      }

      vm.searchButtonClick = function() {
            vm.controller.searchState = PronunciationModalEnums.SearchState.SEARCHED;            
            var searchInput = $('.pronunciation-modal .search-input');            
            vm.controller.gridPronunciationOptions.api.filter(searchInput.val());            
      }

      vm.searchButtonAddClick = function() {
            vm.controller.searchState = PronunciationModalEnums.SearchState.ADDED;            
            var searchInput = $('.pronunciation-modal .search-input');            
            var expressionAdd = searchInput.val();
            
            PronunciationRestSrv.add(expressionAdd, '').then(function(serverResponse) {
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

                  insertItemFn(vm.controller.gridPronunciationOptions.data);
                  insertItemFn(vm.controller.gridPronunciationOptions.alldata);                  
                  vm.controller.gridPronunciationOptions.api.loadData(vm.controller.gridPronunciationOptions.alldata);

                  vm.controller.searchState = PronunciationModalEnums.SearchState.STOPPED;
            });
      }


      vm.showLoading = function() {
            return vm.controller.searchState == PronunciationModalEnums.SearchState.ADDED;
      }


});