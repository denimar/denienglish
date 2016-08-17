angular.module('app').service('dictionaryModalSrv', function(uiDeniModalSrv, DictionaryModalEnums, AppConsts, DictionaryRestSrv) {

	var vm = this;
      vm.controller;      
      vm.getDefinitionFn;

      vm.setController = function(controller) {
            vm.controller = controller;
      }

	vm.showModal = function(scope, getDefinitionFn) {
            vm.getDefinitionFn = getDefinitionFn; //Function to get definitioni (prevent circular reference)
		
		uiDeniModalSrv.createWindow({
            scope: scope,
            title: 'Dictionary',
            width: '650px',         
            height: '580px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK],
            urlTemplate: 'src/app/shared/dictionary/dictionary-modal/dictionary-modal.tpl.htm',
            modal: true,
            listeners: {

            	onshow: function(objWindow) {
					
            	}

            }
        }).show();

	}	

      vm.getGridDictionaryOptions = function() {

            return {
                  keyField: 'cdDicionario',
                  url: AppConsts.SERVER_URL + 'dictionary/list',
                  hideHeaders: true,
                  columns: [
                        {
                              name: 'dsExpressao',
                              width: '45%'
                        },
                        {
                              name: 'dsTags',
                              width: '45%'
                        },
                        {
                              width: '10%',
                              action: {
                                    mdIcon: 'delete_forever',
                                    tooltip: 'Remove a expression from dictionary',
                                    fn: function(record, column, imgActionColumn) {
                                          DictionaryRestSrv.del(record.cdDicionario).then(function(serverResponse) {
                                                vm.controller.gridDictionaryOptions.api.reload();
                                          });
                                    }
                              }                 
                        }
                  ],
                  listeners: {
                        onselectionchange: function(ctrl, element, rowIndex, record) {

                              vm.getDefinitionFn(record.cdDicionario).then(function(expression) {

                                    var div = $(document.createElement('div'));
                                    div.html(expression);
                                    $('.dictionary-modal .definition').html('');
                                    $('.dictionary-modal .definition').append(div);
                              });               

                        },

                        onbeforeload: function() {
                              $('.dictionary-modal .definition').html('');
                        }
                  }   
            }

      }

      vm.searchInputChange = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.SEARCHING;
      }

      vm.searchInputKeydown = function() {
            if (event.keyCode == 13) {  //Return Key

                  //Find a Record
                  if (vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHING) {
                        vm.searchButtonClick(vm.controller);

                  //Add a Record    
                  } else if (vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHED) {
                        vm.searchButtonAddClick(vm.controller)
                  }     
            }
      }

      vm.showSearchButton = function(button) {
            return (
                        (button == 'search' && vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHING) ||
                        (button == 'add' && vm.controller.searchState == DictionaryModalEnums.SearchState.SEARCHED)
                   );
      }

      vm.searchButtonClick = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.SEARCHED;            
            var searchInput = $('.dictionary-modal .search-input');            
            vm.controller.gridDictionaryOptions.api.filter(searchInput.val());            
      }

      vm.searchButtonAddClick = function() {
            vm.controller.searchState = DictionaryModalEnums.SearchState.ADDED;            
            var searchInput = $('.dictionary-modal .search-input');            
            
            DictionaryRestSrv.add(searchInput.val(), '').then(function(serverResponse) {
                  //var addedRecord = serverResponse.data.data[0];
                  //vm.controller.gridDictionaryOptions.data.splice(0, 0, addedRecord);
                  //vm.controller.gridDictionaryOptions.api.repaint();
                  vm.controller.gridDictionaryOptions.api.reload();
                  vm.controller.searchState = DictionaryModalEnums.SearchState.STOPPED;                  
            });
      }

      vm.showLoading = function() {
            return vm.controller.searchState == DictionaryModalEnums.SearchState.ADDED;
      }

});