angular.module('TextMdl', []);
angular.module('VideoMdl', []);
'use strict';

angular.module('app', [
	'ngRoute',
	'TextMdl',
	'VideoMdl',
	'ngMaterial', 
	'ngResource',
	'ngMessages', 
	'ngSanitize', 
	'material.svgAssetsCache', 
	'ui-deni-grid',
	'uiDeniModalMdl',

	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"info.vietnamcode.nampnq.videogular.plugins.youtube",
	//"com.2fdevs.videogular.plugins.overlayplay",
	//"com.2fdevs.videogular.plugins.poster",
	//"com.2fdevs.videogular.plugins.buffering",	
	
	'summernote',
	'ngFileUpload'
]);

angular.module('app').config(function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});
//ENUMERATIONS
angular.module('app').constant('DictionaryModalEnums', {

	SearchState: {
		STOPPED: 0,
		SEARCHING: 1,
		SEARCHED: 2,
		ADDING: 3,
		ADDED: 4,		
	},

});	
//ENUMERATIONS
angular.module('app').constant('PronunciationModalEnums', {

	SearchState: {
		STOPPED: 0,
		SEARCHING: 1,
		SEARCHED: 2,
		ADDING: 3,
		ADDED: 4,		
	},

});	
'use strict';

angular.module('app').service('categoryRestSrv', function(AppSrv) {

	var vm = this;

	vm.add = function(cd_categoria_pai, ds_categoria) {
		var successfullyMessage = {
			title: 'Adding',
			message: 'Category added successfully!'
		};
		return AppSrv.requestWithPromise('category/add', {'cd_categoria_pai': cd_categoria_pai, 'ds_categoria': ds_categoria}, successfullyMessage);
	};

	vm.rename = function(cd_categoria, ds_categoria) {
		var successfullyMessage = {
			title: 'Editing',
			message: 'Category renamed successfully!'
		};
		return AppSrv.requestWithPromise('category/upd', {'cd_categoria': cd_categoria, 'ds_categoria': ds_categoria}, successfullyMessage);
	};

	vm.del = function(cd_categoria) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Category deleted successfully!'
		};
		return AppSrv.requestWithPromise('category/del', {'cd_categoria': cd_categoria}, successfullyMessage, 'Confirm deleting?');
	};


});

'use strict';

angular.module('app').service('categorySrv', function($q, categoryRestSrv, uiDeniModalSrv) {

	var vm = this;

	vm.add = function(scope, cd_categoria_pai) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('New Category', "Enter a descrption of the category", '', true, scope).then(function(enteredText) {
			categoryRestSrv.add(cd_categoria_pai, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0]);
			});
		});

		return deferred.promise;		
	};

	vm.rename = function(scope, cd_categoria, ds_categoria) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('Renaming Category', "Enter a descrption of the category", ds_categoria, true, scope).then(function(enteredText) {
			categoryRestSrv.rename(cd_categoria, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].dsCategoria);
			});
		});

		return deferred.promise;		
	};

	vm.del = function(cd_categoria) {
		return categoryRestSrv.del(cd_categoria);		
	};

});
'use strict';

angular.module('app').service('DictionaryRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function() {
		return AppSrv.requestWithPromise('dictionary/list');
	};

	vm.add = function(ds_expressao, ds_tags) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Expression added successfully!'
		};
		return AppSrv.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
	};

	vm.upd = function(cd_dicionario, ds_expressao, ds_tags) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/upd', {'cd_dicionario': cd_dicionario, 'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);
	}	

	vm.del = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Expression deleted successfully!'
		};
		return AppSrv.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
	};


	vm.learnedToogle = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		};
		return AppSrv.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
	};

	vm.definitionSet = function(cd_dicionario, definition) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		};
		return AppSrv.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
	};

	vm.definitionGet = function(cd_dicionario) {
		return AppSrv.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
	};	

});
'use strict';

angular.module('app').service('dictionarySrv', function($q, DictionaryRestSrv, dictionaryModalSrv, uiDeniModalSrv, pronunciationSrv) {

	var vm = this;

	vm.list = function() {
		return DictionaryRestSrv.list();
	};

	vm.add = function(ds_expressao, ds_tags) {
		return DictionaryRestSrv.add(ds_expressao, ds_tags);
	}

	vm.del = function(cd_dicionario) {
		return DictionaryRestSrv.del(cd_dicionario);
	};


	vm.learnedToogle = function(cd_dicionario) {
		return DictionaryRestSrv.learnedToogle(cd_dicionario);
	};

	vm.definitionSet = function(cd_dicionario, definition) {
		return DictionaryRestSrv.definitionSet(cd_dicionario, definition);
	};

	vm.definitionGet = function(cd_dicionario) {
		var deferred = $q.defer();

		DictionaryRestSrv.definitionGet(cd_dicionario).then(function(serverResponse) {
			deferred.resolve(serverResponse.data.data[0].txDefinicao);			
		});

		return deferred.promise;
	};

	vm.openDictionaryDefinitionView = function(scope, cdDicionario, dsExpressao) {

		if (event.ctrlKey) {
			
			pronunciationSrv.listenExpression(dsExpressao);

		} else {
	        uiDeniModalSrv.createWindow({
	            scope: scope,
	            title: 'Dictionary - ' + dsExpressao,
	            width: '750px',         
	            height: '400px',
	            position: uiDeniModalSrv.POSITION.CENTER,
	            buttons: [uiDeniModalSrv.BUTTON.OK],
	            htmlTemplate: '<dictionary-definition-view cd-dicionario="' + cdDicionario + '"></dictionary-definition-view>',
	            modal: true
	        }).show();        
	    }

	};	

});
angular.module('app').service('ItemRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function(cd_categoria) {
		return AppSrv.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
	}

	vm.get = function(cd_item) {
		return AppSrv.requestWithPromise('item/get', {'cd_item': cd_item});
	}

	vm.add = function(topCategoryNode, cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Item added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/add', {'topCategoryNode': topCategoryNode, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	vm.upd = function(cd_item, cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Item updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	vm.del = function(cd_item) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Item deleted successfully!'
		}
		return AppSrv.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
	}

	vm.favorite = {

		set: function(cd_item, bl_favorite) {
			return AppSrv.requestWithPromise('item/favorite/set', {'cd_item': cd_item, 'bl_favorite': bl_favorite});
		},

		get: function(cd_item) {
			return AppSrv.requestWithPromise('item/favorite/get', {'cd_item': cd_item});			
		}

	}	

	vm.revision = {

		set: function(cd_item, bl_fazer_revisao) {
			return AppSrv.requestWithPromise('item/revision/set', {'cd_item': cd_item, 'bl_fazer_revisao': bl_fazer_revisao});
		},

		get: function(cd_item) {
			return AppSrv.requestWithPromise('item/revision/get', {'cd_item': cd_item});			
		}

	}	


});
angular.module('app').service('itemSrv', function($rootScope, $q, ItemRestSrv, AppSrv, uiDeniModalSrv, newVideoItemModalSrv, AppEnums, VideoRestSrv, AppConsts) {

	var vm = this;

	/**
	 *
	 */
	 var _addItemText = function(scope) {
	 	var deferred = $q.defer();

		var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage();
		wndDescriptionMorImage.show().then(function(response) {
			if (response.button == 'ok') {
				var imageURI = AppSrv.getDataURLImagemObjeto(response.data.imageEl.get(0), 150, 150, 0.5);
				ItemRestSrv.add(AppEnums.CategoryType.TEXT, AppSrv.currentCategory, response.data.description, imageURI).then(function(responseAdd) {
					deferred.resolve(responseAdd);
				});				
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	 }	


	/**
	 *
	 */
	 var _addItemVideo = function(scope) {
	 	var deferred = $q.defer();
	 	scope.newVideoItemModal = {
	 		canShowImagePreview: false,
	 		tp_video: 0
	 	};

		scope.newVideoItemModal.getImagePreviewUrl = function() {
			scope.newVideoItemModal.canShowImagePreview = (scope.newVideoItemModal.id_video) &&
				                                          (
			                                                ((scope.newVideoItemModal.tp_video == 0) && (scope.newVideoItemModal.id_video.length == 11)) || //youtube
														    ((scope.newVideoItemModal.tp_video == 1) && (scope.newVideoItemModal.id_video.length == 28)) //google drive
														  );  

		    if (scope.newVideoItemModal.canShowImagePreview) {
				return AppConsts.SERVER_URL + 'item/image/getlink?tp_video=' + scope.newVideoItemModal.tp_video + '&id_video=' + scope.newVideoItemModal.id_video
			} 
			return null;

			/*
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/0.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/1.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/2.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/3.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/jpg.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/mqdefault.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/maxresdefault.jpg';
			*/
		};


	 	newVideoItemModalSrv.showModal(scope).then(function(response) {
	 		$rootScope.loading = true;
	 		VideoRestSrv.add(AppSrv.currentCategory, scope.newVideoItemModal.tp_video, scope.newVideoItemModal.id_video, scope.newVideoItemModal.description).then(function(serverResponse) {
 				deferred.resolve(serverResponse);
 				$rootScope.loading = false;
	 		});
	 	});

	 	return deferred.promise;
	 }


	/**
	 *
	 */
	 vm.add = function(scope, categoryType) {

	 	//text
	 	if (categoryType == AppEnums.CategoryType.TEXT) {
	 		return _addItemText(scope);

	 	//video
	 	} else {
	 		return _addItemVideo(scope);

	 	}
	 }	

	/**
	 *
	 */
	vm.del = function(cd_item) {
		return ItemRestSrv.del(cd_item);
	}

	/**
	 *
	 */
	vm.favorite = {

		set: function(cd_item, bl_favorite) {
			var deferred = $q.defer();
			ItemRestSrv.favorite.set(cd_item, bl_favorite).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFavorite);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		},

		get: function(cd_item) {
			var deferred = $q.defer();
			ItemRestSrv.favorite.get(cd_item).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFavorite);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		}

	}

	/**
	 *
	 */
	vm.revision = {

		set: function(cd_item, bl_fazer_revisao) {
			var deferred = $q.defer();
			ItemRestSrv.revision.set(cd_item, bl_fazer_revisao).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		},

		get: function(cd_item) {
			var deferred = $q.defer();
			ItemRestSrv.revision.get(cd_item).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		}

	}

});
angular.module('app').service('PronunciationRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function() {
		return AppSrv.requestWithPromise('pronunciation/list');
	}

	vm.add = function(ds_expressao) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Expression added successfully!'
		}
		return AppSrv.requestWithPromise('pronunciation/add', {'ds_expressao': ds_expressao}, successfullyMessage);		
	}

	vm.del = function(cd_pronuncia) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Expression deleted successfully!'
		}
		return AppSrv.requestWithPromise('pronunciation/del', {'cd_pronuncia': cd_pronuncia}, successfullyMessage, 'Confirm deleting?');
	}


	vm.learnedToogle = function(cd_pronuncia) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromise('pronunciation/learned/toogle', {'cd_pronuncia': cd_pronuncia}, successfullyMessage);		
	}

});
angular.module('app').service('pronunciationSrv', function($q, $window) {

	var vm = this;

	this.listenExpression = function(expression) {
		var deferred = $q.defer();

		try {
			if (event.ctrlKey && event.shiftKey) { //CTRL+SHIFT --> abre o site http://emmasaying.com para ver se eles possuem a pronúncia da expressão
				//var altenativeSite = 'http://emmasaying.com/?s=';
				var altenativeSite = 'http://www.wordreference.com/enpt/'
				$window.open(altenativeSite + expression);
			} else {
				var timer = setInterval(function() {
				    var voices = speechSynthesis.getVoices();
				    if (voices.length !== 0) {
				    	clearInterval(timer);

						var sentence = new SpeechSynthesisUtterance();
						sentence.text = expression;
						sentence.lang = 'en-US';

					    for(var i = 0; i < voices.length; i++) {
							if(voices[i].lang == sentence.lang ){
								sentence.voice = voices[i];
								break;
							}
						}				

						sentence.rate = 0.8;
						
						sentence.onstart = function(event) { 
						}
						sentence.onend = function(event) { 
							deferred.resolve();
						}
						
						speechSynthesis.speak(sentence);
					}
						
				}, 200);
					
			}	
		} catch(e) {
			deferred.reject(e);
		}

		return deferred.promise;
	}


});
angular.module('app').service('RevisionRestSrv', function(AppSrv) {

	var vm = this;

	vm.getItemInfo = function(cd_item) {
		return AppSrv.requestWithPromise('revision/item/info', {'cd_item': cd_item});
	}

	vm.getExpressions = function(cd_item) {
		return AppSrv.requestWithPromise('revision/expressions/get', {'cd_item': cd_item});
	}

	vm.setLevelOfLearning = function(cd_dicionario, cd_pronuncia, nrLevelOfLearning) {
		return AppSrv.requestWithPromise('revision/expressions/levelOfLearning/set', {'cd_dicionario': cd_dicionario, 'cd_pronuncia': cd_pronuncia, "nr_level_of_learning": nrLevelOfLearning});	
	}

	vm.markAsReviewed = function(cd_item) {
		return AppSrv.requestWithPromise('revision/markasreviewed', {'cd_item': cd_item});
	}
	

});
angular.module('app').service('revisionSrv', function($q, RevisionRestSrv) {

	var vm = this;

	vm.getItemInfo = function(cd_item) {
		var deferred = $q.defer();

		RevisionRestSrv.getItemInfo(cd_item).then(function(serverResponse) {
			var informations = serverResponse.data.data[0];
			deferred.resolve(informations);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}

	vm.getExpressions = function(cd_item) {
		var deferred = $q.defer();

		RevisionRestSrv.getExpressions(cd_item).then(function(serverResponse) {
			var expressions = serverResponse.data.data;
			deferred.resolve(expressions);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}

	vm.setLevelOfLearning = function(cd_dicionario, cd_pronuncia, nrLevelOfLearning) {
		var deferred = $q.defer();

		RevisionRestSrv.setLevelOfLearning(cd_dicionario, cd_pronuncia, nrLevelOfLearning).then(function(serverResponse) {
			var result = serverResponse.data.data[0];
			deferred.resolve(result);
		}, function(reason) {
			deferred.reject(reason);
		});

		return deferred.promise;
	}


});
'use strict';

angular.module('app').service('dictionaryModalSrv', function($rootScope, $q, $timeout, uiDeniModalSrv, DictionaryModalEnums, AppSrv, AppConsts, DictionaryRestSrv, dictionaryModalEditSrv) {

	var vm = this;
      vm.controller;      
      
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
                  buttons: [uiDeniModalSrv.BUTTON.OK],
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
                  var itemToAdd = serverResponse.data.data[0];

                  var insertItemFn = function(data) {
                        var indexAdd = data.length;
                        for (var i = data.length - 1; i >= 0; i--) {
                              if (itemToAdd.dsExpressao > data[i].dsExpressao) {
                                    indexAdd = i;
                                    break;
                              }
                        }
                        data.splice(indexAdd, 0, itemToAdd);                        
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
'use strict';

angular.module('app').service('DatabaseSrv', function() {

	var me = this;

});
'use strict';

angular.module('app').service('GeneralSrv', function($q, $sce, $compile, DictionaryRestSrv, PronunciationRestSrv, AppSrv) {

	var me = this;

	me.getAllExpressions = function() {
		var deferred = $q.defer();

		DictionaryRestSrv.list().then(function(responseDictionary) {
			AppSrv.dictionaryExpressions = responseDictionary.data.data;
	
			PronunciationRestSrv.list().then(function(responsePronunciation) {
				AppSrv.pronunciationExpressions = responsePronunciation.data.data;	

				AppSrv.allExpressions = AppSrv.dictionaryExpressions.concat(AppSrv.pronunciationExpressions);
				deferred.resolve(AppSrv.allExpressions);
			}, function(reasonPronunciation) {
				console.error(reasonPronunciation);
			});

		}, function(reasonDictionary) {
			console.error(reasonDictionary);
		});


		return deferred.promise;
	};

	/**
	 * Insert into a element a specific html and binding it with a controller
	 * passed by parameter
	 *
	 */
	 /*
	me.insertHtmlWithController = function(targetElement, html, controller) {
		var $div = $('<div ng-controller="' + controller + '">' + html + '</div>');
		targetElement.append($div);

		var scope = angular.element($div).scope();
		$compile($div)(scope);
	}
	*/

	me.insertHtmlWithController = function(targetElement, html, controller, scope) {	
		targetElement.html('')
		var $div = $('<div>' + html + '</div>');
		$compile($div)(scope);
		targetElement.append($div);
	};	

});
'use strict';

angular.module('app').service('StringSrv', function(AppSrv) {

	var me = this;

	me.format = function() {
		var formatted = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;        
	};


    me.leftPad = function(numero, qtdVezes, caracterRepetir) {
        var retorno = qtdVezes - numero.toString().length + 1;
        return Array(+(retorno > 0 && retorno)).join(caracterRepetir) + numero;
    }  ;  

    me.replaceAll = function(string, find, replace) {
        if (string) {
            return string.replace(RegExp('\\b' + find + '\\b','g'), replace);   
        } else {
            return '';
        }
    };       


    me.doubleToStrTime = function(segundos) {
        //00:05:22,900

        var  SEGUNDOS_HORA = 3600;      
        var SEGUNDOS_MINUTO = 60;
        
        //var xSegundos = segundos;
        
        var xHoras = (segundos / SEGUNDOS_HORA);
        var xHorasStr = me.leftPad(Math.floor(xHoras), 2, "0");
        
        //xSegundos = xSegundos % SEGUNDOS_HORA;
        
        var xMinutos = (segundos / SEGUNDOS_MINUTO);
        var xMinutosStr = me.leftPad(Math.floor(xMinutos), 2, "0");

        var xSegundosStr = (segundos % SEGUNDOS_MINUTO).toString();   
        var xSegundosFrac = "000";
        var xPosSeg = xSegundosStr.indexOf(".");
        if (xPosSeg != -1) {
            xSegundosFrac = xSegundosStr.substring(xPosSeg + 1).substring(0, 3);
            xSegundosFrac += "0".repeat(3 - xSegundosFrac.length);
            xSegundosStr = xSegundosStr.substring(0, xPosSeg);
        }
        xSegundosStr = me.leftPad(Math.floor(xSegundosStr), 2, "0") + "," + xSegundosFrac; 
        
        return xHorasStr + ":" + xMinutosStr + ":" + xSegundosStr;
    };   

    me.strTimeToDouble = function(strTime) {
        //00:05:22,900
        var xTimeStr = strTime;
        var xHours = parseInt(xTimeStr.substring(0, 2));
        var xMinutes = parseInt(xTimeStr.substring(3, 5));
        xTimeStr = xTimeStr.substring(6, xTimeStr.length).replace(",", ".");
        var xSeconds = parseFloat(xTimeStr);        
        
        return (xHours * 3600) + (xMinutes * 60) + xSeconds;
    };       


	/*
	 * @param array deve conter os array do dicionário e das pronúncias contatenado, formando um grande array.
	 *
	 */
	me.addLinksDictionaryAndPronunciation = function(text) {
		var array = AppSrv.allExpressions;
		if (array.length == 0) {
			return text;
		} else {
			var texto = me.replaceAll(text, '"', "'");
			var textoLower = texto.toLowerCase();	
			var matrizSubst = 'matrizsubst1-{0}-matrizsubst2';
			var expressoesSubst = [];
			var contaSubst = 0;
			
			for (var conta = 0 ; conta < array.length ; conta++) {
				var item = array[conta];
				var expressionsToReplace = [];
				expressionsToReplace.push(item.dsExpressao.toLowerCase());

				if (item.dsTags) {
					var tagsArray = item.dsTags.split(',');
					angular.forEach(tagsArray, function(tag) {
						expressionsToReplace.push(tag.trim().toLowerCase());
					});
				}

				angular.forEach(expressionsToReplace, function(expressaoLower) {
					var posExpressao = textoLower.search(new RegExp('\\b' + expressaoLower + '\\b'));
					while (posExpressao != -1) {
						var textoSubs = texto.substring(posExpressao, posExpressao + expressaoLower.length);
						if (textoSubs.toLowerCase() == expressaoLower) {
							expressoesSubst.push({
								cd_pronuncia: item.cdPronuncia,
								cd_dicionario: item.cdDicionario,								
								ds_expressao: item.dsExpressao,
								texto: textoSubs
							});
							var subst = me.format(matrizSubst, contaSubst);
							texto = texto.replace(new RegExp('\\b' + textoSubs + '\\b', "g"), subst);

							contaSubst++;
							//xPos += subst.length;
							textoLower = texto.toLowerCase();	
						}
						
						posExpressao = textoLower.search(new RegExp('\\b' + expressaoLower + '\\b'));
					}
				});	

			}

			for (var conta = 0 ; conta < expressoesSubst.length ; conta++) {
				var item = expressoesSubst[conta];
				var find = me.format(matrizSubst, conta);
				var replace = null;
				var functionExec = null;
				var classLink = null;
				if (item.cd_dicionario) {
					functionExec = 'openDictionary(' + item.cd_dicionario + ', \'' + item.texto + '\');';
					classLink = 'dictionary-link';
				} else {
					functionExec = 'openPronunciation(\'' + item.ds_expressao.trim() + '\');';					
					classLink = 'pronunciation-link';					
				}
				//replace = me.format('<span class="' + classLink + '" ng-click=\"' + functionExec + '\">' + item.ds_expressao + '</span>', me.replaceAll(item.texto, "'", "\\'"), me.replaceAll(item.texto, "'", "\\'"));				
				replace = '<span class="' + classLink + '" ng-click=\"' + functionExec + '\">' + item.texto + '</span>';
				texto = me.replaceAll(texto, find, replace);		
			}					

			return texto;
		}	
	};

});
angular.module('app').service('newVideoItemModalSrv', function($q, uiDeniModalSrv) {

	var vm = this;

	vm.showModal = function(scope) {
	 	var deferred = $q.defer();

		var modal = uiDeniModalSrv.createWindow({
			scope: scope,
			title: 'Creating a new video',
			width: '550px',			
			height: '300px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			urlTemplate: 'src/app/shared/item/new-video-item-modal/new-video-item-modal.tpl.htm',
			modal: true,
			listeners: {
				onshow: function(objWindow) {
					scope.newVideoItemModal.kindOfVideo = 0;
				}
			}
		});

		modal.show().then(function(modalResponse) {
			if (modalResponse.button == 'ok') {
				deferred.resolve(scope.newVideoItemModal);

			} else {
				deferred.reject();
			}
		});		


		return deferred.promise;
	}

});
angular.module('app').service('pronunciationModalSrv', function($q, AppSrv, uiDeniModalSrv, PronunciationModalEnums, AppConsts, PronunciationRestSrv, pronunciationSrv) {

	var vm = this;
      vm.controller;      
      
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
                  buttons: [uiDeniModalSrv.BUTTON.OK],
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
                  ]
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
                  var itemToAdd = serverResponse.data.data[0];

                  var insertItemFn = function(data) {
                        var indexAdd = data.length;
                        for (var i = data.length - 1; i >= 0; i--) {
                              if (itemToAdd.dsExpressao > data[i].dsExpressao) {
                                    indexAdd = i;
                                    break;
                              }
                        }
                        data.splice(indexAdd, 0, itemToAdd);                        
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
angular.module('app').service('spacedRevisionModalSrv', function($rootScope, StringSrv, AppConsts, dictionarySrv, pronunciationSrv, RevisionRestSrv, uiDeniModalSrv, revisionSrv) {

	var vm = this;
	vm.controller;

	vm.setController = function(controller) {
		vm.controller = controller;
	}

	vm.selectExpression = function(index) {
		vm.controller.showDefinitionContent = false;
		if (vm.controller.expressions.length > 0) {
			vm.controller.currentExpressionIndex = index;
			vm.controller.currentExpression = vm.controller.expressions[index];
			vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.dsExpressao;
			vm.controller.model.expression.type = vm.controller.currentExpression.cdDicionario != 0 ? 'Dictionary' : 'Pronuciation';		
			vm.controller.model.expression.resultType = vm.controller.currentExpression.cdDicionario != 0 ? 'menu' : 'volume_up';				
			vm.controller.model.expression.learnedRate	= vm.controller.currentExpression.nrLevelOfLearning;
			vm.controller.model.expression.definition = '';
		}	
	}

	vm.showResult = function(controller) {
		//dictionary Result
		if (controller.currentExpression.cdDicionario != 0) {
			//
			if (event.ctrlKey) {
				pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
			}	

			var dictionaryDefinitionView = $('.spaced-revision-modal .definition-detail-content-content dictionary-definition-view');
			var element = angular.element(dictionaryDefinitionView);
			var scope = element.scope();
			scope.$$childTail.ctrl.cdDicionario = controller.currentExpression.cdDicionario;
			if (!scope.$$phase) {
				scope.$apply();
			}

			vm.controller.showDefinitionContent = true;                              

		//pronunciation Result
		} else if (angular.isDefined(controller.currentExpression.cdPronuncia)) {
			pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
		}

	}

	vm.updateLearnedPercentage = function() {
		var progressBar = vm.controller.element.find('.item-detail-data-progress-bar');
		var progressBarWidth = progressBar.width();

		var sum = 0;
		for (var index = 0 ; index < vm.controller.expressions.length ; index++) {
			sum += vm.controller.expressions[index].nrLevelOfLearning;
		}

		var percentage = sum / vm.controller.expressions.length;
		vm.controller.model.learnedPercentage = percentage.toFixed(2);;
		var progress = vm.controller.element.find('.item-detail-data-progress');
		progress.width(progressBarWidth * percentage / 100);
	}

	vm.markAsReviewed = function(cd_item) {
		return RevisionRestSrv.markAsReviewed(cd_item).then(function() {
			uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
		});
	}

	vm.showModal = function(scope, cdItem) {
		$rootScope.selectedCdItem = cdItem;
		$rootScope.loading = true;
	
		revisionSrv.getExpressions(cdItem).then(function(response) {
			$rootScope.loading = false;

	        uiDeniModalSrv.createWindow({
	            scope: $rootScope,
	            title: 'Spaced Revision',
	            width: '900px',         
	            height: '600px',
	            position: uiDeniModalSrv.POSITION.CENTER,
	            buttons: [uiDeniModalSrv.BUTTON.OK],
	            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-modal/spaced-revision-modal.tpl.htm',
	            modal: true,
	            listeners: {

	            	onshow: function(objWindow) {
						
						revisionSrv.getItemInfo(cdItem).then(function(serverResponse) {
							vm.controller.expressions = response;
							vm.selectExpression(0);
							vm.controller.element = $(objWindow);
							vm.updateLearnedPercentage(vm.controller.expressions);

							vm.controller.cdItem = cdItem;
							vm.controller.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, cdItem, (new Date()).getMilliseconds());
						
							vm.controller.dsItem = serverResponse.dsItem;
							vm.controller.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
						});
	            	}

	            }
	        }).show();

	    });

	}
	
});
'use strict';

angular.module('app').service('dictionaryModalEditSrv', function($q, $interval, uiDeniModalSrv, DictionaryRestSrv) {

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
                  urlTemplate: 'src/app/shared/dictionary/dictionary-modal/dictionary-modal-edit/dictionary-modal-edit.tpl.htm',
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
                        DictionaryRestSrv.upd(recordToEdit.cdDicionario, vm.controller.model.dsExpression, vm.controller.model.dsTags);
                        deferred.resolve(vm.controller.model);
                  }
            });

            return deferred.promise;
	};

});
angular.module('app').service('dictionaryDefinitionViewSrv', function(DictionaryRestSrv) {

	var vm = this;
	vm.cdDicionario = null;
	vm.controller = null;

	vm.setController = function(controller) {
		vm.controller = controller;
	}

	var _updateDefinitionDiv = function(definition) {
		var definitionEl = vm.controller.element.find('.definition');
	    definitionEl.html('');

	    if (definition) {
		    var div = $(document.createElement('div'));
		    div.html(definition);
		    definitionEl.append(div);
		}    
	}

	vm.refreshDefinition = function(cdDicionario) {
		vm.controller.currentDefinition = '';
		_updateDefinitionDiv('');
		vm.cdDicionario = cdDicionario;		
		if (cdDicionario) {
			DictionaryRestSrv.definitionGet(cdDicionario).then(function(serverResponse) {
				if (serverResponse.data.total > 0) {
					var record = serverResponse.data.data[0];
				    vm.controller.currentDefinition = record.txDefinicao;
				    _updateDefinitionDiv(vm.controller.currentDefinition);
				}
			});
		}	
	}

	vm.definitionEditClick = function() {
		vm.controller.currentDefinitionBeforeEditing = vm.controller.currentDefinition;
	    vm.controller.editingDefinition = true;
	}

	vm.definitionSaveClick = function() {
	    DictionaryRestSrv.definitionSet(vm.cdDicionario, vm.controller.currentDefinition).then(function(serverResponse) {
			vm.controller.editingDefinition = false;                  
			_updateDefinitionDiv(vm.controller.currentDefinition);
	    });
	}

	vm.definitionCancelClick = function() {
	    vm.controller.currentDefinition = vm.controller.currentDefinitionBeforeEditing;
	    vm.controller.editingDefinition = false;
	}


});
angular.module('app').controller('DictionaryModalCtrl', function(dictionaryModalSrv, DictionaryModalEnums) {

	//use this control in the service	
	dictionaryModalSrv.setController(this);

	this.searchState = DictionaryModalEnums.SearchState.STOPPED; //will be fulfilled by DictionaryModalEnums.SearchState enum
	this.searchValue = '';

	this.gridDictionaryOptions = dictionaryModalSrv.getGridDictionaryOptions();

	this.searchInputChange = dictionaryModalSrv.searchInputChange;
	this.searchInputKeydown = dictionaryModalSrv.searchInputKeydown;

	this.searchButtonClick = dictionaryModalSrv.searchButtonClick;
	this.searchButtonAddClick = dictionaryModalSrv.searchButtonClick;
	this.showSearchButton = dictionaryModalSrv.showSearchButton;

	this.showLoading = dictionaryModalSrv.showLoading;

});

angular.module('app').controller('NewVideoItemModalCtrl', function($sce) {

	var vm = this;

	/*
	vm.videoConfig = {
		preload: "auto",
		sources: [
			//{src: t08vdo.dsUrl},
			{src: $sce.trustAsResourceUrl('https://www.youtube.com/watch?v=d020hcWA_Wg'), type: "video/mp4"},
		],
		theme: {
			url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
		},
		plugins: {
			controls: {
				autoHide: true,
				autoHideTime: 5000
			}
		}
	};	
	*/

	var _getDataURLImagemObjeto = function(videoElement, width, height, quality) {
		var originalWiddh = 0;
		var originalHeight = 0;	
		if (videoElement instanceof HTMLImageElement) { //Imagem
			originalWiddh = videoElement.naturalWidth;
			originalHeight = videoElement.naturalHeight;		
		} else {
			originalWiddh = videoElement.videoWidth;
			originalHeight = videoElement.videoHeight;		
		}	
		
		var canvas = document.createElement('canvas');
		var newWidth = width;
		var newHeight = height;
		
		var xPerc = 1;
		if (originalHeight > originalWiddh) {
			xPerc = newWidth / originalWiddh;							
			newHeight = xPerc * originalHeight;
		} else {
			xPerc = newHeight / originalHeight;
			newWidth = xPerc * originalWiddh;							
		}
		
		canvas.width  = newWidth;
		canvas.height = newHeight;
		var ctx = canvas.getContext('2d');

		ctx.drawImage(videoElement, 0, 0, originalWiddh, originalHeight, 0, 0, newWidth, newHeight);

		return canvas.toDataURL("image/jpeg", quality);
	}

	vm.capturePosterFromVideo = function() {
		var videoElement = $('.video-preview').get(0);
			
		var imageUrl = _getDataURLImagemObjeto(videoElement, 150, 150, 0.5);

		//var imageUrl = _getDataURLImagemObjeto(videoElement, 150, 150, 0.5);
		console.log(imageUrl);
	}

});
angular.module('app').controller('PronunciationModalCtrl', function(pronunciationModalSrv, PronunciationModalEnums) {

	//use this control in the service	
	pronunciationModalSrv.setController(this);

	this.searchState = PronunciationModalEnums.SearchState.STOPPED; //will be fulfilled by PronunciationModalEnums.SearchState enum
	this.searchValue = '';

	this.gridPronunciationOptions = pronunciationModalSrv.getGridPronunciationOptions();

	this.searchInputChange = pronunciationModalSrv.searchInputChange;
	this.searchInputKeydown = pronunciationModalSrv.searchInputKeydown;

	this.searchButtonClick = pronunciationModalSrv.searchButtonClick;
	this.searchButtonAddClick = pronunciationModalSrv.searchButtonClick;
	this.showSearchButton = pronunciationModalSrv.showSearchButton;

	this.showLoading = pronunciationModalSrv.showLoading;

});

angular.module('app').controller('SpacedRevisionCtrl', function(StringSrv, AppConsts, itemSrv, categorySrv, revisionSrv, dictionarySrv, spacedRevisionModalSrv) {
	
	var vm = this;
	spacedRevisionModalSrv.setController(vm);

	vm.showDefinitionContent = false;
	vm.learnedRate = 60;
	vm.expressions = [];
	vm.currentExpression;
	vm.currentExpressionIndex;	
	vm.model = {
		expression: {}
	};

	vm.model.navigatorStatus = '';	

	vm.navigate = function(number) {
		spacedRevisionModalSrv.selectExpression(vm.currentExpressionIndex + number);
	}
	
	vm.navigateFirst = function() {
		spacedRevisionModalSrv.selectExpression(0);
	}

	vm.navigateLast = function() {
		spacedRevisionModalSrv.selectExpression(vm.expressions.length - 1);
	}	

	vm.showResult = function() {
		spacedRevisionModalSrv.showResult(vm);
	}

	vm.changeLearnedRate = function() {
		revisionSrv.setLevelOfLearning(vm.currentExpression.cdDicionario, vm.currentExpression.cdPronuncia, vm.model.expression.learnedRate);
		vm.currentExpression.nrLevelOfLearning = vm.model.expression.learnedRate;
		spacedRevisionModalSrv.updateLearnedPercentage(vm);
	}

	vm.markAsReviewed = function(cd_item) {
		spacedRevisionModalSrv.markAsReviewed(cd_item);
		console.log('TODO: FAZER UMA ROTINA NA uiDeniModal para fechar a janela ativa...');
		console.log('TODO: VERIFICAR TAMBÉM O UI-DENI-MODAL... PASSAGEM DO Scope...');		
	}

	/*
	if (vm.cdItem) {
		vm.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

		revisionSrv.getItemInfo(vm.cdItem).then(function(serverResponse) {
			vm.dsItem = serverResponse.dsItem;
			vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
		});

	} else {
		new Error('Attributes passed in a wrong way!')
	}
	*/

});
angular.module('app').controller('DictionaryModalEditCtrl', function(dictionaryModalEditSrv) {

	//use this control in the service	
	dictionaryModalEditSrv.setController(this);

	this.model = {};

});

angular.module('app').controller('DictionaryDefinitionViewCtrl', function($scope, dictionaryDefinitionViewSrv) {
	
	dictionaryDefinitionViewSrv.setController(this);
	
	this.currentDefinition = null;	

	this.editingDefinition = false;

	this.definitionEditClick = dictionaryDefinitionViewSrv.definitionEditClick;
	this.definitionSaveClick = dictionaryDefinitionViewSrv.definitionSaveClick;
	this.definitionCancelClick = dictionaryDefinitionViewSrv.definitionCancelClick;

	$scope.$watch('ctrl.cdDicionario', function(newValue, oldValue) {
		dictionaryDefinitionViewSrv.refreshDefinition(newValue);	
	});

});
angular.module('app').directive('dictionaryDefinitionView', function() {

	return {
		restrict: 'E',
		scope: {},
		bindToController: {
			cdDicionario: '=?'
		},
		controller: 'DictionaryDefinitionViewCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'src/app/shared/dictionary/directives/dictionary-definition-view/dictionary-definition-view.tpl.htm',
		link: function(scope, element, attrs) {
			scope.ctrl.element = $(element);	    
		}	
	}

});
'use strict';

angular.module('app').service('homeSrv', function($timeout, $rootScope, categorySrv, AppConsts, AppSrv, itemSrv, AppEnums, StringSrv, spacedRevisionModalSrv, uiDeniModalSrv, ItemRestSrv) {

	var vm = this;
	var jsTreeInstance = null;

	/**
	 *
	 *
	 */
	vm.addCategoryClick = function(scope, currentCategoryId) {
		categorySrv.add(scope, currentCategoryId).then(function(addedCategory) {
			var newNode = { 
				state: "open", 
				id: addedCategory.cdCategoria,				
				text: addedCategory.dsCategoria,
				data: addedCategory
			};

			jsTreeInstance.create_node(currentCategoryId, newNode, 'last', function(addedNode) {
				jsTreeInstance.deselect_all();
				jsTreeInstance.select_node(addedNode);
			});		
		});
	};	


	/**
	 *
	 *
	 */
	vm.editCategoryClick = function(scope, currentCategoryNode) {
		categorySrv.rename(scope, currentCategoryNode.id, currentCategoryNode.text).then(function(renamedCategory) {
			jsTreeInstance.rename_node(currentCategoryNode, renamedCategory);
		});
	};

	/**
	 *
	 *
	 */
	vm.delCategoryClick = function(currentCategoryNode) {
		categorySrv.del(currentCategoryNode.id).then(function(serverResponse) {
			var parentNode = jsTreeInstance.get_node(currentCategoryNode.parent);
			jsTreeInstance.delete_node([currentCategoryNode]);
			jsTreeInstance.select_node(parentNode);
		});
	};

	/**
	 *
	 *
	 */
	var _getTopParentNode = function(controller) {
		if (controller.currentCategoryNode.parent == '#') {
			return controller.currentCategoryNode.id;
		} else {
			return controller.currentCategoryNode.parents[controller.currentCategoryNode.parents.length - 2];
		}	
	};


	/**
	 *
	 *
	 */
    vm.addNewItemButtonClick = function(controller, scope, event) {
    	var topParentNode = _getTopParentNode(controller);
    	var fnNewItem;

		itemSrv.add(scope, topParentNode).then(function(addedItem) {
			controller.gridOptions.api.reload().then(function(responseData) {
				var objAdded = addedItem.data[0];
				var cdItemAdded = objAdded.cdItem || objAdded.t05itm.cdItem;
		        controller.gridOptions.api.findKey(cdItemAdded, {inLine: true});						
			});
		});
    };


	/**
	 *
	 *
	 */
    var _setCurrentCategory = function(controller, nodeData) {
    	controller.currentCategoryNode = nodeData.node;
		AppSrv.currentCategory = controller.currentCategoryNode.id;

    	var path = '<span class="categoryPathTitle">' + controller.currentCategoryNode.text + '</span>';

    	var parentId = controller.currentCategoryNode.parent;
    	while (parentId != '#') { //# means root node
    		var parentObj = nodeData.instance.get_node(parentId);
    		path = parentObj.text + " / " + path;

    		var parentId = parentObj.parent;
    	}

		controller.categoryPath = path;
    };	

	/**
	 *
	 *
	 */
    vm.reloadDataGrid = function(controller) {

		if (controller.currentCategoryNode) {
	 		//Items
	    	if (controller.currentNavItem == 'pageItems') {
				controller.gridOptions.url = AppConsts.SERVER_URL + 'item/list?cd_categoria=' + controller.currentCategoryNode.id;
	    	//Revisions
	    	} else if (controller.currentNavItem == 'pageRevisions') {
				controller.gridOptions.url = AppConsts.SERVER_URL + 'revision/list?pendente=true&days=5&cd_categoria=' + controller.currentCategoryNode.id;
	    	//Favorites
	    	} else {
				controller.gridOptions.url = AppConsts.SERVER_URL + 'item/favorite/get?cd_categoria=' + controller.currentCategoryNode.id;
	    	}
					
			controller.gridOptions.api.reload();
		}	

    };

	/**
	 *
	 *
	 */
	vm.configureTreeView = function(controller, currentCategory) {

	  	$('#categoryTreeview')
			.on('loaded.jstree', function (e, data) {
				jsTreeInstance = data.instance;
				if (currentCategory) {
					jsTreeInstance.select_node(currentCategory);
				}	
			})
			.on('changed.jstree', function (e, data) {
			  if (data.node) {
					_setCurrentCategory(controller, data);
					vm.reloadDataGrid(controller);			  
			  }  
			})
			.jstree({
				'core' : {
					check_callback: true,
					'data' : {
						"url" : AppConsts.SERVER_URL + 'category/category/tree/list',				
						//"url" : "//www.jstree.com/fiddle/",
						"dataType" : "json" // needed only if you do not supply JSON headers
					},
				},
				plugins : [
					"wholerow"
				],
			});

	};

	/**
	 *
	 *
	 */
	vm.configureGridItems = function(controller, scope) {
	    controller.gridOptions = {
	    	hideHeaders: true,
			colLines: false,
	    	keyField: 'cdItem',
	        rowHeight: '100px', //22px is default
	        columns: [
	        	{
	        		header: 'Item',
	        		name: 'cdItem',
	        		width: 'calc(100% - 96px)',
	        		renderer: function(value, record) {
						var linkViewItem = null;
						var topParentNode = _getTopParentNode(controller);
						
						if (topParentNode == AppEnums.CategoryType.TEXT) {
							linkViewItem = '/text';
						} else {
							linkViewItem = '/video';						
						}
						var time = new Date();
						var miliseconds = time.getMilliseconds();
						
						var favorite = record.blFavorite ? 'star' : 'star_border';
						var favoriteSelected = record.blFavorite ? 'selected' : '';						

						var revise = record.blFazerRevisao ? 'check_box' : 'check_box_outline_blank';						
						var reviseSelected = record.blFazerRevisao ? 'selected' : '';

	  					var cellTemplate = '<div class="cell-template">\n' +
										   '    <img class="item-image"\n' +
										   '        src="{0}item/image/get?cd_item={1}&time={5}" \n' +
										   '    />\n' +                                  
										   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
										   '    <div>{4}</div>\n' +									   
										   '    <md-icon class="material-icons favorite {6}"> {7} </md-icon>\n' +
										   '    <md-icon class="material-icons revise {8}"> {9} </md-icon>\n' +										   
										   '<div>';

	  					return StringSrv.format(cellTemplate, AppConsts.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', miliseconds, favoriteSelected, favorite, reviseSelected, revise);
	        		}
	        	},
	        	{
	        		width: '32px',
		            action: {
		                mdIcon: 'restore',
		                tooltip: '',
		                fn: function(record, column, imgActionColumn) {
							spacedRevisionModalSrv.showModal(scope, record.cdItem);
		                }
		            }        		
	        	},
	        	{
	        		width: '32px',
		            action: {
		                mdIcon: 'edit',
		                tooltip: '',
		                fn: function(record, column, imgActionColumn) {
							var rowEl = $(imgActionColumn).closest('.ui-row');
							var imgEl = rowEl.find('.item-image');

							var config = {
								description: record.dsItem,
								imgSrc: imgEl.attr('src')
							};

							var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage(config);
							wndDescriptionMorImage.show().then(function(response) {
								if (response.button == 'ok') {								
									var uriImage = AppSrv.getDataURLImagemObjeto(response.data.imageEl.get(0), 160, 140, 1);
									ItemRestSrv.upd(record.cdItem, AppSrv.currentCategory, response.data.description, uriImage).then(function(responseUpd) {
										controller.gridOptions.api.reload().then(function(responseData) {
											imgEl.attr('src', response.data.image);								

											var cdItemUpdated = responseUpd.data[0].cdItem;
									        controller.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
										});
									});				
								}
							});
		                }
		            }        		
	        	},
	        	{
	        		width: '32px',
		            action: {
		                mdIcon: 'delete_forever',
		                tooltip: '',
		                fn: function(record, column, imgActionColumn) {
							itemSrv.del(record.cdItem).then(function() {
								controller.gridOptions.api.reload();
							});	                	
		                }
		            }        		
	        	}

	        ],
	        listeners: {
				onbeforeload: function(data, options) {
					$rootScope.subTitle = '';
				},

	            onafterrepaintrow: function(rowIndex, elementRow) {
					$timeout(function() {
						elementRow.find('.material-icons.favorite').click(function(event) {
							var record = controller.gridOptions.api.getSelectedRow();
							record.blFavorite = !record.blFavorite;
							controller.gridOptions.api.repaintSelectedRow();													
							itemSrv.favorite.set(record.cdItem, record.blFavorite).then(function(blFavorite) {
							});
						});

						elementRow.find('.material-icons.revise').click(function(event) {
							var record = controller.gridOptions.api.getSelectedRow();
							record.blFazerRevisao = !record.blFazerRevisao;
							controller.gridOptions.api.repaintSelectedRow();
							itemSrv.revision.set(record.cdItem, record.blFazerRevisao).then(function(blFazerRevisao) {
							});
						});

					}, 500);
	            },

	            onselectionchange: function(ctrl, element, rowIndex, record) {
					$rootScope.subTitle = record.dsItem;
					if (!scope.$$phase) {
						scope.$apply();
					}
	            }
			}			
	    };		

	};

});
angular.module('app').service('TextRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function(cd_item) {
		return AppSrv.requestWithPromise('text/list', {'cd_item': cd_item});
	}

	vm.getContent = function(cd_texto) {
		return AppSrv.requestWithPromise('text/content/get', {'cd_texto': cd_texto});
	}

	vm.setContent = function(cd_texto, content) {
		var successfullyMessage = {
			title: 'Texts',
			message: 'text updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('text/content/set', {}, {'cd_texto': cd_texto, 'tx_conteudo': content}, successfullyMessage);
	}


});
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
angular.module('app').service('VideoRestSrv', function(AppSrv) {

	var vm = this;

	vm.add = function(cd_categoria, tp_video, id_video, ds_item) {
		var successfullyMessage = {
			title: 'Videos',
			message: 'Video added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cd_categoria, 'tp_video': tp_video, 'id_video': id_video, 'ds_item': ds_item}, successfullyMessage);
	}

	vm.get = function(cd_item) {
		return AppSrv.requestWithPromise('video/get', {'cd_item': cd_item});
	}

	vm.commentaries = {

		set: function(cd_video, commentary) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'commentary updated successfully!'
			}
			return AppSrv.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cd_video}, {'txCommentaries': commentary}, successfullyMessage);
		}

	}


});
angular.module('VideoMdl').service('VideoSrv', function($timeout, $sce, $compile, $interval, $q, VideoRestSrv, AppConsts, StringSrv, AppSrv, videoModalImportSubtitleLyricsSrv, videoModalImportSubtitleSrtSrv) {
	
	var vm = this;
	vm.controller;

	vm.setController = function(controller) {
		vm.controller = controller;
	}

	var _selectSubtitleInTime = function(controller, time) {
		var data = controller.gridSubtitlesOptions.data;
		for (var index = 0 ; index < data.length ; index++) {
			var record = data[index];
			if ((time >= record.nrStart) && (time <= record.nrEnd)) {
				if (index != controller.gridSubtitlesOptions.api.getSelectedRowIndex()) {
					controller.gridSubtitlesOptions.api.selectRow(index, true, false);
				}	
				break;
			}
		}
	}

	var selectingSubtitle = false;
	vm.configElementVideo = function(controller, cdItem) {
		var deferred = $q.defer();

		controller.onPlayerReady = function(API) {
			controller.videoAPI = API;
			controller.videoAPI.autoPlay = false;

			var intervalPromise = $interval(function() {
		        //controller.videoAPI.play();
		        //controller.videoAPI.currentState = 'play';

				if (angular.isDefined(controller.currentTime)) {
					$interval.cancel(intervalPromise);
				}

	    	}, 1000);
		};

		controller.onUpdateTime = function(currentTime, totalTime) {
			controller.currentTime = currentTime * 1000;
			controller.totalTime = totalTime * 1000;
			controller.timeLeft = controller.totalTime - controller.currentTime;
			if (!selectingSubtitle) {
				_selectSubtitleInTime(controller, currentTime);
			}	
		};		

		VideoRestSrv.get(cdItem).then(function(serverReturn) {
			var t08vdo = serverReturn.data.data[0];
			deferred.resolve(t08vdo);

			var videoUrl;
			if (t08vdo.tpVideo == 'YOUTUBE') {
				urlImage = "https://www.youtube.com/watch?v=" + t08vdo.idVideo;
			} else {
				urlImage = "https://googledrive.com/host/" + t08vdo.idVideo;
			}

			controller.videoConfig = {
				//preload: "auto",
				autoPlay: false,
				sources: [
					//{src: t08vdo.dsUrl},
					{src: $sce.trustAsResourceUrl(urlImage), type: "video/mp4"},
				],
				theme: {
					url: "dist/videogular/videogular.css"
				},
				plugins: {
					controls: {
						autoHide: true,
						autoHideTime: 5000
					},
					//poster: AppConsts.SERVER_URL + "item/image/get?cd_item=" + t08vdo.t05itm.cdItem + '&time=452'
				}
			};	
			
			/*
            controller.videoConfig = {
                preload: "auto",
                "autoplay": true,
                sources: [
                    {src: $sce.trustAsResourceUrl(t08vdo.dsUrl), type: "video/mp4"},
                ],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };			
			*/
		});

		return deferred.promise;
	}	

	vm.configGridSubtitles = function(controller, cdItem) {	

		controller.gridSubtitlesOptions = {
			keyField: 'cdItemSubtitle',
			rowHeight: '37px',
			url: AppConsts.SERVER_URL + '/subtitle/list?cd_item=' + cdItem,
			hideHeaders: true,
	        columns: [
	        	{
	            	name: 'nrStart',
	            	width: '15%',
	            	align: 'center',	            	
	            	renderer: function(value, record) {
	            		return StringSrv.doubleToStrTime(value);
	            	}	
	        	},
	        	{
	            	name: 'nrEnd',
	            	width: '15%',
	            	align: 'center',
	            	renderer: function(value, record) {
	            		return StringSrv.doubleToStrTime(value);
	            	}	
	        	},
	        	{
	            	name: 'dsTexto',
	            	width: '80%',
	            	renderer: function(value, record) {
						var $div = $('<div>' + StringSrv.addLinksDictionaryAndPronunciation(value) + '</div>');
						$compile($div)(controller.scope);
	            		return $div;
	            	}	
	        	}
	        ],
	        listeners: {				
				onselectionchange: function(ctrl, element, rowIndex, record) {
					selectingSubtitle = true;
					try {
						controller.videoAPI.seekTime(record.nrStart);
					} finally {	
						//controller.videoAPI.pause();						
						$timeout(function() {
							selectingSubtitle = false;
						}, 1500)
					}	
				}
	        }
	    };


	};

	vm.configWYSIWYG = function(controller, cdItem) {

		var fnExecSaveButton = function() {
			VideoRestSrv.commentaries.set(controller.t08vdo.cdVideo, controller.t08vdo.txComentarios);
		}

		var fnExecCancelButton = function() {
	    	VideoRestSrv.get(cdItem).then(function(serverResponse) {
	    		controller.t08vdo = serverResponse.data.data[0];
	    	});
		}

		controller.options = AppSrv.getConfigWYSIWYG(fnExecSaveButton, fnExecCancelButton);
	};

    vm.importSubtitleFromLyrics = function() {
    	videoModalImportSubtitleLyricsSrv.showModal(vm.controller.cdItem).then(function(subtilesAdded) {
    		vm.controller.gridSubtitlesOptions.api.loadData(subtilesAdded);
    	});
    };

    vm.importSubtitleFromSrtFile = function() {
    	videoModalImportSubtitleSrtSrv.showModal(vm.controller.cdItem).then(function(subtilesAdded) {
    		vm.controller.gridSubtitlesOptions.api.loadData(subtilesAdded);
    	});
    };


});
angular.module('app').service('SubtitleRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function(cd_item) {
		return AppSrv.requestWithPromise('subtitle/list', {'cd_item': cd_item});
	}

	vm.add = function(cd_video, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Subtitle added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cd_video, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.upd = function(cd_item_subtitle, nr_start, nr_end, ds_texto) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Subtitle updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cd_item_subtitle, 'nr_start': nr_start, 'nr_end': nr_end, 'ds_texto': ds_texto}, successfullyMessage);		
	}

	vm.del = function(cd_item_subtitle) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Subtitle deleted successfully!'
		}
		return AppSrv.requestWithPromise('subtitle/del', {'cd_item_subtitle': cd_item_subtitle}, successfullyMessage, 'Confirm deleting?');
	}


});
angular.module('app').service('videoModalImportSubtitleLyricsSrv', function($rootScope, $q, AppSrv, uiDeniModalSrv) {

	var vm = this;
  vm.cdItem;
	vm.controller;

	vm.setController = function(controller, scope) {
		vm.controller = controller;
    vm.controller.cdItem = vm.cdItem;
	}

	vm.showModal = function(cdItem) {
      vm.cdItem = cdItem;
      var deferred = $q.defer();

      var wndImportSubtitle = uiDeniModalSrv.createWindow({
            scope: $rootScope,
            title: 'Importing Subtitle from a text (often lyrics of musics)',
            width: '550px',         
            height: '500px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
            urlTemplate: 'src/app/components/video/video-modal-import-subtitle-lyrics/video-modal-import-subtitle-lyrics.tpl.htm',
            modal: true,
            listeners: {

            	onshow: function(objWindow) {
            	}

            }
      });

      wndImportSubtitle.show().then(function(modalResponse) {

        if (modalResponse.button == 'ok') {
          var successfullyMessage = {
            title: 'Updating',
            message: 'Item updated successfully!'
          }

          var textArea = $(wndImportSubtitle).find('textarea');
          lyrics = textArea.val();

          AppSrv.requestWithPromisePayLoad('subtitle/importlyrics', {}, {'cdItem': vm.cdItem, 'lyrics': lyrics}, successfullyMessage).then(function(serverReturn) {
            deferred.resolve(serverReturn.data);
          });   
        }

      });

      return deferred.promise;
	};

});
angular.module('app').service('videoModalImportSubtitleSrtSrv', function($q, $http, $rootScope, AppConsts, uiDeniModalSrv, Upload) {

	var vm = this;
  vm.cdItem;
	vm.controller;

	vm.setController = function(controller, scope) {
		vm.controller = controller;
    vm.controller.cdItem = vm.cdItem;

    scope.$watch('ctrl.strFile', function (newValue, oldValue) {
        vm.controller.strFile = newValue;
    });
	}

	vm.showModal = function(cdItem) {
      vm.cdItem = cdItem;
      var deferred = $q.defer();

      var wndImportSubtitle = uiDeniModalSrv.createWindow({
            scope: $rootScope,
            title: 'Importing Subtitle (.srt)',
            width: '600px',         
            height: '230px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
            urlTemplate: 'src/app/components/video/video-modal-import-subtitle-srt/video-modal-import-subtitle-srt.tpl.htm',
            modal: true,
            listeners: {

            	onshow: function(objWindow) {
            	}

            }
      });

      wndImportSubtitle.show().then(function(modalResponse) {

        if (modalResponse.button == 'ok') {
          if ((vm.controller.strFile) && (!vm.controller.strFile.$error)) {

            var fileInput = $(wndImportSubtitle).find('input[type=file]');
             var fd = new FormData();
             fd.append('cdItem', vm.cdItem);
             fd.append('file', vm.controller.strFile);

             $http.post(AppConsts.SERVER_URL + 'subtitle/importsrt', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
             })
          
             .success(function(serverResponseAddSubtitle){
                uiDeniModalSrv.ghost("Subtitles", "Subtitles imported successfully!");
                deferred.resolve(serverResponseAddSubtitle.data);
             })
          
             .error(function(reason){
                deferred.reject(reason);
             });

          }
        }
        
      });

      return deferred.promise;
	};

  vm.uploaderOnAfterAddingFile = function(fileItem) {
    vm.controller.file = fileItem.file; 
    //var spanFileName = $('.video-modal-import-subtitle-srt .select-file-drag-and-drop .filename');
    //spanFileName.html(fileItem.file.name);
  };
	

});
angular.module('VideoMdl').service('subtitleModalSrv', function($q, uiDeniModalSrv, StringSrv, SubtitleRestSrv) {
	var vm = this;

	var EnumOperation = {
		ADDING: 1,
		EDITING: 2
	};

	var _getSubtitleModal = function(scope, controller, operation) {
		var deferred = $q.defer();

		controller.subtitleModalData = {};

		var record = controller.gridSubtitlesOptions.api.getSelectedRow();

		if (operation == EnumOperation.EDITING) { //Editing
			var record = controller.gridSubtitlesOptions.api.getSelectedRow();
			controller.subtitleModalData.start = StringSrv.doubleToStrTime(record.nrStart);
			controller.subtitleModalData.end = StringSrv.doubleToStrTime(record.nrEnd);
			controller.subtitleModalData.text = record.dsTexto;			
		} else { //Adding
			if (record) {
				controller.subtitleModalData.start = StringSrv.doubleToStrTime(record.nrStart + 1);
				controller.subtitleModalData.end = StringSrv.doubleToStrTime(record.nrStart + 2);
			} else {
				//initial value (fake value)
				controller.subtitleModalData.start = StringSrv.doubleToStrTime(1);
				controller.subtitleModalData.end = StringSrv.doubleToStrTime(10);
			}
		}

		var modal = uiDeniModalSrv.createWindow({
			scope: scope,
			title: 'Subtitles',
			width: '450px',			
			height: '230px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			urlTemplate: 'src/app/components/video/subtitle/modals/subtitle-modal.tpl.htm',
			modal: true,
	        listeners: {
	        	onshow: function(objWindowShowed) {
	        		//alert('show...');
	        	},
	        }	
		});

		modal.show().then(function(msgResponse) {
			if (msgResponse.button == 'ok') {
				var fn;

				controller.subtitleModalData.start = StringSrv.strTimeToDouble(controller.subtitleModalData.start);
				controller.subtitleModalData.end = StringSrv.strTimeToDouble(controller.subtitleModalData.end);				

				console.log(controller.subtitleModalData);
				if (operation == EnumOperation.EDITING) { //Editing
					SubtitleRestSrv.upd(record.cdItemSubtitle, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
						deferred.resolve(responseServer.data[0]);
					});
				} else { //Adding
					SubtitleRestSrv.add(controller.t08vdo.cdVideo, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
						deferred.resolve(responseServer.data[0]);
					});
				}

			} else {
				deferred.reject('');
			}
		}); 

		return deferred.promise;
	}	

	vm.add = function(scope, controller) {
		return _getSubtitleModal(scope, controller, EnumOperation.ADDING);
	}

	vm.edit = function(scope, controller) {
		return _getSubtitleModal(scope, controller, EnumOperation.EDITING);
	}

});
angular.module('app').controller('HomeCtrl', function($scope, $rootScope, $routeParams, homeSrv, AppEnums, AppSrv) {
	
	var vm = this;
	vm.categoryPath = null;		

	AppSrv.createHamburgerButton(['show-xs', 'hide-gt-xs'], AppEnums.Side.LEFT);

	vm.currentNavItem = "pageItems";
	vm.currentCategoryNode = null; //Category Node
	
	$.jstree.defaults.core.themes.variant = "large";	

	vm.addCategoryClick = function() {
		homeSrv.addCategoryClick($scope, vm.currentCategoryNode.id);
	}	

	vm.editCategoryClick = function() {
		homeSrv.editCategoryClick($scope, vm.currentCategoryNode);
	}	

	vm.delCategoryClick = function() {
		homeSrv.delCategoryClick(vm.currentCategoryNode);
	}

    vm.addNewItemButtonClick = function(event) {
    	homeSrv.addNewItemButtonClick(vm, $scope, event);
    }	

	homeSrv.configureTreeView(vm, AppSrv.currentCategory || $routeParams.cdCategoria);

	homeSrv.configureGridItems(vm, $scope);
		
    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
    	vm.currentNavItem = newCurrentNavItem;
    	if (newCurrentNavItem) {
    		homeSrv.reloadDataGrid(vm);
    	}
    });

});
'use strict';

angular.module('TextMdl').controller('TextCtrl', function($scope, $rootScope, $routeParams, dictionarySrv, dictionaryModalSrv, pronunciationSrv, pronunciationModalSrv, AppSrv, TextRestSrv, TextSrv, GeneralSrv, StringSrv, uiDeniModalSrv, spacedRevisionModalSrv, ItemRestSrv) {
     
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

    ItemRestSrv.get(vm.params.cdItem).then(function(serverResponse) {
        vm.t05itm = serverResponse.data.data[0];
        $rootScope.subTitle = vm.t05itm.dsItem;
    });

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

    vm.spacedRevisionClick = function() {
        spacedRevisionModalSrv.showModal($scope, vm.params.cdItem);
    }

    $scope.openDictionary = function(cdDicionario, dsExpressao) {
        dictionarySrv.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
    };    

    $scope.openPronunciation = function(dsExpressao) {
        pronunciationSrv.listenExpression(dsExpressao);
    };     

});
'use strict';

angular.module('VideoMdl').controller('VideoCtrl', function($scope, $rootScope, $routeParams, $sce, GeneralSrv, ItemRestSrv, VideoSrv, subtitleModalSrv, SubtitleRestSrv, uiDeniModalSrv, pronunciationSrv, pronunciationModalSrv, dictionarySrv, dictionaryModalSrv, pronunciationSrv, spacedRevisionModalSrv) {
	var vm = this;
	VideoSrv.setController(this);
	vm.scope = $scope;


	$scope.name = "VideoCtrl";
	$scope.params = $routeParams;	
	vm.t05itm = null;
	vm.cdItem = $scope.params.cdItem;
	vm.commentaries = '';
	vm.initialCommentaries = '';

	ItemRestSrv.get($scope.params.cdItem).then(function(serverResponse) {
		vm.t05itm = serverResponse.data.data[0];
		$rootScope.subTitle = vm.t05itm.dsItem;
	});

    VideoSrv.configElementVideo(vm, $scope.params.cdItem).then(function(t08vdo) {
		vm.t08vdo = t08vdo;
		//vm.commentaries = t08vdo.txComentarios;
	});

	VideoSrv.configGridSubtitles(vm, $scope.params.cdItem);		
	VideoSrv.configWYSIWYG(vm, $scope.params.cdItem);	
	GeneralSrv.getAllExpressions().then(function(response) {
		vm.gridSubtitlesOptions.api.repaint();
	});

	vm.dictionaryModalClick = function() {
		dictionaryModalSrv.showModal($rootScope).then(function(dictionaryData) {dictionarySrv
			vm.gridSubtitlesOptions.api.repaint();
		});
	}

	vm.pronunciationModalClick = function() {
		pronunciationModalSrv.showModal($rootScope).then(function(pronunciationData) {
			vm.gridSubtitlesOptions.api.repaint();
		});
	}

	vm.addSubtitleButtonClick = function() {
		subtitleModalSrv.add($scope, vm).then(function(subtitleAdded) {
			vm.gridSubtitlesOptions.api.reload().then(function() {
				vm.gridSubtitlesOptions.api.findKey(subtitleAdded.cdItemSubtitle, {inLine: true});
			});
		});
	}

	vm.editSubtitleButtonClick = function() {
		subtitleModalSrv.edit($scope, vm).then(function(subtitleUpdated) {
			vm.gridSubtitlesOptions.api.reload().then(function() {
				vm.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
			});
		});
	}

	vm.delSubtitleButtonClick = function() {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		SubtitleRestSrv.del(record.cdItemSubtitle).then(function() {
			vm.gridSubtitlesOptions.api.reload();
		});
	}

	var _incrementOneSecond = function(increment) {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		var cdItemSubtitle = record.cdItemSubtitle;
		record.nrStart = record.nrStart + increment;
		record.nrEnd = record.nrEnd + increment;		

		SubtitleRestSrv.upd(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(serverResponse) {
			uiDeniModalSrv.ghost('Subtitle', 'Subtitle time is update successfully');				
			vm.gridSubtitlesOptions.api.repaint();
			vm.gridSubtitlesOptions.api.findKey(cdItemSubtitle, {inLine: true});
		});
	}

	vm.decreaseOneSecondButtonClick = function() {
		_incrementOneSecond(-1);
	}

	vm.incrementOneSecondButtonClick = function() {
		_incrementOneSecond(1);
	}

	vm.listenButtonClick = function() {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		pronunciationSrv.listenExpression(record.dsTexto);
	}

    vm.spacedRevisionClick = function() {
        spacedRevisionModalSrv.showModal($scope, vm.cdItem);
    }

    $scope.openDictionary = function(cdDicionario, dsExpressao) {
        dictionarySrv.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
    }     

	$scope.openPronunciation = function(dsExpressao) {
        pronunciationSrv.listenExpression(dsExpressao);
    }

    vm.importSubtitleFromLyrics = VideoSrv.importSubtitleFromLyrics;
    vm.importSubtitleFromSrtFile = VideoSrv.importSubtitleFromSrtFile;

});
angular.module('app').controller('VideoModalImportSubtitleLyricsCtrl', function(videoModalImportSubtitleLyricsSrv) {

	videoModalImportSubtitleLyricsSrv.setController(this);    

});
angular.module('app').controller('VideoModalImportSubtitleSrtCtrl', function($scope, Upload, AppConsts, videoModalImportSubtitleSrtSrv) {

	videoModalImportSubtitleSrtSrv.setController(this, $scope);    

});
//CONSTANTS
angular.module('app').constant('AppConsts', {
	SERVER_URL: 'https://denienglishsrv-denimar.rhcloud.com/', //Hosted in Open Shift
	//SERVER_URL: 'http://localhost:8087/denienglish/', //Local
});
//ENUMERATIONS
angular.module('app').constant('AppEnums', {
	CategoryType: {
		TEXT: 275,
		VIDEO: 276
	},
	Side: {
		LEFT: 1,
		RIGHT: 2
	}
});	
angular.module('app').config(function($routeProvider) {
	
    $routeProvider
        .when("/:cdCategoria?", {
            templateUrl : "src/app/components/home/home.htm",
            controller: "HomeCtrl",
            controllerAs: "ctrl"
        })
        .when("/text/:cdItem", {
            templateUrl : "src/app/components/text/text.htm",
            controller: "TextCtrl",
            controllerAs: "ctrl"
        })
        /*
        .when("/text/:cdItem", {
            templateUrl : "app/shared/spaced-revision/teste.htm",
            controller: "TesteCtrl",
            controllerAs: "ctrl"
        })
        */
        .when("/video/:cdItem", {
            templateUrl : "src/app/components/video/video.htm",
            controller: "VideoCtrl",
            controllerAs: "ctrl"
        }).
    	otherwise({
    		redirectTo: '/'
    	});	

});
'use strict';

angular.module('app').service('AppSrv', function($q, $resource, $http, AppEnums, AppConsts, uiDeniModalSrv) {

	var vm = this;

	vm.currentCategory = null; //Category Id	
	
	vm.allExpressions = []; //All Expressions (Dictionary plus Pronunciations)
	vm.dictionaryExpressions = [];
	vm.pronunciationExpressions = [];	
	vm.auxiliarMenu = [];

	/**
	 * className is waiting for a array of String considering: hide-x, hide-gt-xs, hide-sm, hide-md...
	 * side is waiting for AppEnums.Side.LEFT | AppEnums.Side.RIGHT
	 * reference: https://material.angularjs.org/latest/layout/options
	 */
	vm.createHamburgerButton = function(classArray, side) {
		var hamburgerIconButton = $(document.createElement('button'));
		hamburgerIconButton.addClass("md-button");		
		hamburgerIconButton.addClass("md-icon-button");
		hamburgerIconButton.addClass("md-ink-ripple");

		for (var index = 0 ; index < classArray.length ; index++) {
			var className = classArray[index];
			hamburgerIconButton.attr(className, "");
			hamburgerIconButton.addClass(className);	
		}

		var hamburgerIconButtonImg = $(document.createElement('img'));
		hamburgerIconButtonImg.attr('src', 'src/assets/images/hamburger.png');
		hamburgerIconButtonImg.addClass("hamburger-button");
		hamburgerIconButton.append(hamburgerIconButtonImg);

		var mainToobar = $('.md-toolbar-tools-main');

		if (side === AppEnums.Side.LEFT) {
			mainToobar.prepend(hamburgerIconButton);
		} else {
			mainToobar.append(hamburgerIconButton);			
		}	
	};

	/**
	 *
	 * It works like this: ng-repeat="rec in grid.data track by getTrackById(rec)"
 	 * 	
	 */
	vm.getNgRepeatTrackById = function(record) {
		//The first property is gonna be the id property
		var keyField = Object.keys(record)[0];
		//Get the id value
		return record[keyField];
	};
   
	vm.getConfigWYSIWYG = function(fnExecSaveButton, fnExecCancelButton) {

		var saveButton = function () {
		  var ui = $.summernote.ui;
		  
		  // create button
		  var button = ui.button({
		    contents: '<i class="glyphicon glyphicon-floppy-save"/>',
		    tooltip: 'save changes',
		    click: function () {
				fnExecSaveButton();
		    }
		  });

		  return button.render();   // return button as jquery object 
		};


		var cancelButton = function () {
		  var ui = $.summernote.ui;
		  
		  // create button
		  var button = ui.button({
		    contents: '<i class="glyphicon glyphicon-remove"/>',
		    tooltip: 'cancel changes',
		    click: function () {
		    	fnExecCancelButton();
		    }
		  });

		  return button.render();   // return button as jquery object 
		};

	    return {
			disableDragAndDrop : true,
			toolbar: [
				// [groupName, [list of button]]	      
				['saveOrCancelButtons', ['saveButton', 'cancelButton']],
				['fontsize', ['fontname', 'fontsize', 'color']],
				['style', ['bold', 'italic', 'underline', 'clear']],		    		    
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']],
				['table', ['table']],
				['insert', ['link','picture','video','hr']],
				['view', ['fullscreen', 'codeview']],
			],
			buttons: {
				saveButton: saveButton,
				cancelButton: cancelButton
			}
	    };

	};

    vm.requestWithPromise = function(relativeUrl, parameters, successMessage, confirmMessage) {
		var deferred = $q.defer();

		var execRequest = function() {
			var parametrosUrl = {params: parameters};			
			$http.get(AppConsts.SERVER_URL + relativeUrl, parametrosUrl)
				.then(function(retornoServer) {
					if (retornoServer.data.success) {
						if (successMessage) {						
							uiDeniModalSrv.ghost(successMessage.title, successMessage.message);
						}	
						deferred.resolve(retornoServer);
					} else {
						throw retornoServer.data.message;
					}	
				})
				.catch(function(retornoServer) {
					if (retornoServer.data.message) {
						uiDeniModalSrv.error(retornoServer.data.message);
					} else {
						uiDeniModalSrv.error(retornoServer.data);
					}

					deferred.reject(retornoServer);
				});
		};

		if (confirmMessage) {
			uiDeniModalSrv.confirm(confirmMessage)
				.then(function (response) { 
					if (response.button === 'yes') {
						execRequest();
					}
				});	
		} else {
			execRequest();
		}

		return deferred.promise;
    };

    vm.requestWithPromisePayLoad = function(relativeUrl, parameters, parametersPayLoad, successMessage, confirmMessage) {
		var deferred = $q.defer();

		var execRequest = function() {
	        var resource = $resource(AppConsts.SERVER_URL + relativeUrl, parameters, {}, {'request': { method:'POST'}});
	        resource.save(parametersPayLoad).$promise
				.then(function(retornoServer) {
					if (retornoServer.success) {
						if (successMessage) {		
							uiDeniModalSrv.ghost(successMessage.title, successMessage.message);			
						}	
						deferred.resolve(retornoServer);
					} else {
						uiDeniModalSrv.error(retornoServer.message);
						deferred.reject(retornoServer);
					}	
				})
				.catch(function(retornoServer) {
					if (retornoServer.message) {
						uiDeniModalSrv.error(retornoServer.message);
					} else if (retornoServer.data) {
						if (retornoServer.data.message) {
							uiDeniModalSrv.error(retornoServer.data.message);
						} else {
							uiDeniModalSrv.error(retornoServer.data);
						}
					} else {
						uiDeniModalSrv.error('Inespected Error!');
					}	
					deferred.reject(retornoServer);
				});
		};

		if (confirmMessage) {
			w2confirm(confirmMessage, function (btn) { 
				if (btn === 'Yes') {
					execRequest();
				}		
			});
		} else {
			execRequest();
		}

		return deferred.promise;
    };

	vm.getDataURLImagemObjeto = function(prObjeto, prLargura, prAltura, prQualidade) {
		var xLarguraOriginal = 0;
		var xAlturaOriginal = 0;	
		if (prObjeto instanceof HTMLImageElement) { //Imagem
			xLarguraOriginal = prObjeto.naturalWidth;
			xAlturaOriginal = prObjeto.naturalHeight;		
		} else {
			xLarguraOriginal = prObjeto.videoWidth;
			xAlturaOriginal = prObjeto.videoHeight;		
		}	
		
		var canvas = document.createElement('canvas');
		var xNovaLargura = prLargura;
		var xNovaAltura = prAltura;
		
		var xPerc = 1;
		if (xAlturaOriginal > xLarguraOriginal) {
			xPerc = xNovaLargura / xLarguraOriginal;							
			xNovaAltura = xPerc * xAlturaOriginal;
		} else {
			xPerc = xNovaAltura / xAlturaOriginal;
			xNovaLargura = xPerc * xLarguraOriginal;							
		}
		
		canvas.width  = xNovaLargura;
		canvas.height = xNovaAltura;
		var ctx = canvas.getContext('2d');

		ctx.drawImage(prObjeto,0,0,xLarguraOriginal,xAlturaOriginal,0,0,xNovaLargura,xNovaAltura);

		return canvas.toDataURL("image/png", prQualidade); //o certo é dimininuir também um pouco a qualidade...
	};

	/*
	this.atualizaItemSelecionado = function(descricao, elementoImg) {
		var $divItemSelecionado = $('.selecionado');
		var $img = $divItemSelecionado.find('img');
	}
	*/

	vm.listenExpression = function(expression, callbackFunction) {
		if (event.ctrlKey && event.shiftKey) { //CTRL+SHIFT --> abre o site http://emmasaying.com para ver se eles possuem a pronúncia da expressão
			//var siteBuscar = 'http://emmasaying.com/?s=';
			var siteBuscar = 'http://www.wordreference.com/enpt/';
			window.open(siteBuscar + expression);
		} else {
			var u = new SpeechSynthesisUtterance();
			u.text = expression;
			u.lang = 'en-US';

			u.rate = 0.8;
			
			u.onstart = function(event) { 
			}
			u.onend = function(event) { 
				if (callbackFunction) {
					callbackFunction();
				}
			}
			
			speechSynthesis.speak(u);
		}	
	};

	/*
	this.getArrayPronunciasEDicionario = function() {
		return varsSrv;		
	}
	*/

});
angular.module('app').controller('AppCtrl', function($scope, $rootScope, $route, $routeParams, $location, AppSrv) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;		

	$rootScope.loading = false;
	//$scope.auxiliarMenu	= AppSrv.auxiliarMenu;


});