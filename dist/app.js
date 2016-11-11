(function() {
	'use strict';

	angular
		.module('mock', [])
		.factory('appMock', appMock);

	function appMock(uiDeniModalSrv)	{

		return {
			uiDeniModalSrv: {
				createWindow: mockUiDeniModalSrvCreateWindow, 
				prompt: mockUiDeniModalSrvPrompt,
				createWindowDescriptionMoreImage: mockUiDeniModalSrvCreateWindowDescriptionMoreImage 	
			}
		}

		////

		function mockUiDeniModalSrvCreateWindow() {
			spyOn(uiDeniModalSrv, 'createWindow').and.returnValue({
				show: function() {
					return {
						then: function(callbackFn){
							callbackFn({
								'button': 'ok'
							});
						}
					}	
				}	
			});
		}

		function mockUiDeniModalSrvPrompt(textReturn) {
			spyOn(uiDeniModalSrv, 'prompt').and.returnValue({
				then: function(callbackFn){
					callbackFn(textReturn);
				}
			});		
		}

		function mockUiDeniModalSrvCreateWindowDescriptionMoreImage() {
			spyOn(uiDeniModalSrv, 'createWindowDescriptionMoreImage').and.returnValue({
				show: function() {
					return {
						then: function(callbackFn){
							callbackFn({
								'button': 'ok',
								'data': {
									'imageEl': {
										get: function(fakeNr) {
											return 0;
										}
									}
								}
							});
						}
					}	
				}	
			});
		}

	}

})();	

'use strict';

angular
	.module('category', [
		'ngResource', 
		'routines', 
		'uiDeniModalMdl'
	]);
'use strict';

angular
	.module('dictionary', [
		
	]);
(function() {

	'use strict';

	angular
		.module('expression', [
		]);

})();


'use strict'

angular
	.module('pronunciation', [
	]);
'use strict';

angular
	.module('item', [
		'ngResource', 		
		'text',		
		'video',
		'expression',
		'pronunciation',		
		'dictionary',
		'routines', 
		'uiDeniModalMdl'		
	]);
'use strict';

angular
	.module('routines', [
	]);
'use strict';

angular
	.module('text', [
	]);
'use strict';

angular
	.module('video', [
	]);
'use strict';

angular.module('app', [
	'ngRoute',
	'text',
	'video',
	'ngMaterial', 
	'ngResource',
	'ngMessages', 
	'ngSanitize', 
	'material.svgAssetsCache', 
	'ui-deni-grid',
	'uiDeniModalMdl',

	'expression',
	'dictionary',
	'pronunciation',

	'category',
	'item',	
	'routines',

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
(function() {

	'use strict';

	angular
		.module('dictionary')
		.constant('dictionaryModalEnums', {

			SearchState: {
				STOPPED: 0,
				SEARCHING: 1,
				SEARCHED: 2,
				ADDING: 3,
				ADDED: 4,		
			},

		});

})();	
(function() {

	'use strict'

	angular
		.module('pronunciation')
		.constant('pronunciationModalEnums', {
			SearchState: {
				STOPPED: 0,
				SEARCHING: 1,
				SEARCHED: 2,
				ADDING: 3,
				ADDED: 4,		
			},
		});	

})();
(function () {
	'use strict';

	angular
		.module('category')
		.factory('categoryDataService', categoryDataService);

	function categoryDataService(restService) {
		
		return {
			add: categoryAdd,
			rename: categoryRename,
			del: categoryDel
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function categoryAdd(cd_categoria_pai, ds_categoria) {
			var successfullyMessage = {
				title: 'Adding',
				message: 'Category added successfully!'
			};
			return restService.requestWithPromise('category/add', {'cd_categoria_pai': cd_categoria_pai, 'ds_categoria': ds_categoria}, successfullyMessage);
		};

		function categoryRename(cd_categoria, ds_categoria) {
			var successfullyMessage = {
				title: 'Editing',
				message: 'Category renamed successfully!'
			};
			return restService.requestWithPromise('category/upd', {'cd_categoria': cd_categoria, 'ds_categoria': ds_categoria}, successfullyMessage);
		};

		function categoryDel(cd_categoria) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Category deleted successfully!'
			};
			return restService.requestWithPromise('category/del', {'cd_categoria': cd_categoria}, successfullyMessage, 'Confirm deleting?');
		};

	}	

})();
(function() {

	'use strict';

	angular
		.module('category')
		.service('categoryService', categoryService);

	function categoryService($q, categoryDataService, uiDeniModalSrv) {
		var vm = this;

		vm.add = function(scope, cd_categoria_pai) {
			var deferred = $q.defer();

			uiDeniModalSrv.prompt('New Category', "Enter a descrption of the category", '', true, scope).then(function(enteredText) {
				categoryDataService.add(cd_categoria_pai, enteredText).then(function(serverResponse) {
					deferred.resolve(serverResponse.data.data[0]);
				});
			});

			return deferred.promise;		
		};

		vm.rename = function(scope, cd_categoria, ds_categoria) {
			var deferred = $q.defer();

			uiDeniModalSrv.prompt('Renaming Category', "Enter a descrption of the category", ds_categoria, true, scope).then(function(enteredText) {
				categoryDataService.rename(cd_categoria, enteredText).then(function(serverResponse) {
					deferred.resolve(serverResponse.data.data[0].dsCategoria);
				});
			});

			return deferred.promise;		
		};

		vm.del = function(cd_categoria) {
			var deferred = $q.defer();
			categoryDataService.del(cd_categoria).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0]);
			});
			return deferred.promise;			
		};


	};

})();	
(function() {

	'use strict';

	angular
		.module('dictionary')
		.factory('dictionaryDataService', dictionaryDataService);

	function dictionaryDataService($q, restService) {
		return {
			cachedExpressions: [],
			list: dictionaryList,
			add: dictionaryAdd,
			upd: dictionaryUpd,
			del: dictionaryDel,
			learnedToogle: dictionaryLearnedToogle,
			definitionSet: dictionaryDefinitionSet,
			definitionGet: dictionaryDefinitionGet
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function dictionaryList(ignoreCache) {
			var deferred = $q.defer();
			var vm = this;

			if (ignoreCache || vm.cachedExpressions.length === 0) {
				restService.requestWithPromise('dictionary/list').then(function(dictionaryResponse) {
					vm.cachedExpressions = dictionaryResponse.data.data;
					deferred.resolve(vm.cachedExpressions);
				});
			} else {
				deferred.resolve(vm.cachedExpressions);				
			}	

			return deferred.promise;
		}


		function dictionaryAdd(ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Expression added successfully!'
			};
			return restService.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
		};

		function dictionaryUpd(cd_dicionario, ds_expressao, ds_tags) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			}
			return restService.requestWithPromise('dictionary/upd', {'cd_dicionario': cd_dicionario, 'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);
		}	

		function dictionaryDel(cd_dicionario) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Expression deleted successfully!'
			};
			return restService.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
		};


		function dictionaryLearnedToogle(cd_dicionario) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
		};

		function dictionaryDefinitionSet(cd_dicionario, definition) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			};
			return restService.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
		};

		function dictionaryDefinitionGet(cd_dicionario) {
			return restService.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
		};	

	};

})();
(function() {
	
	'use strict';

	angular
		.module('dictionary')
		.service('dictionaryService', dictionaryService);

	function dictionaryService($q, dictionaryDataService, dictionaryModalService, uiDeniModalSrv, pronunciationService) {
		var vm = this;

		vm.list = function() {
			return dictionaryDataService.list();
		};

		vm.add = function(ds_expressao, ds_tags) {
			return dictionaryDataService.add(ds_expressao, ds_tags);
		}

		vm.del = function(cd_dicionario) {
			return dictionaryDataService.del(cd_dicionario);
		};


		vm.learnedToogle = function(cd_dicionario) {
			return dictionaryDataService.learnedToogle(cd_dicionario);
		};

		vm.definitionSet = function(cd_dicionario, definition) {
			return dictionaryDataService.definitionSet(cd_dicionario, definition);
		};

		vm.definitionGet = function(cd_dicionario) {
			var deferred = $q.defer();

			dictionaryDataService.definitionGet(cd_dicionario).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].txDefinicao);			
			});

			return deferred.promise;
		};

		vm.openDictionaryDefinitionView = function(scope, cdDicionario, dsExpressao) {

			if (event.ctrlKey) {
				
				pronunciationService.listenExpression(dsExpressao);

			} else {
		        uiDeniModalSrv.createWindow({
		            scope: scope,
		            title: 'Dictionary - ' + dsExpressao,
		            width: '800px',         
		            height: '500px',
		            position: uiDeniModalSrv.POSITION.CENTER,
		            buttons: [uiDeniModalSrv.BUTTON.OK],
		            htmlTemplate: '<dictionary-definition-viewer cd-dicionario="' + cdDicionario + '"></dictionary-definition-viewer>',
		            modal: true
		        }).show();        
		    }

		};	

	};

})();	
(function() {

	'use strict';

	angular
		.module('expression')
		.service('expressionService', expressionService);

	function expressionService() {
		var vm = this;
		vm.loadedExpressions = []; //store the joining between dictionary and pronunciation expressions

	};

})();
(function() {

	'use strict'

	angular
		.module('pronunciation')
		.service('pronunciationRestService', pronunciationRestService);

	function pronunciationRestService($q, restService) {

		var vm = this;
		vm.loadedExpressions = [];		

		vm.list = function() {
			var deferred = $q.defer();

			restService.requestWithPromise('pronunciation/list').then(function(pronunciationResponse) {
				vm.loadedExpressions = pronunciationResponse.data.data;
				deferred.resolve(vm.loadedExpressions);
			});

			return deferred.promise;
		}

		vm.add = function(ds_expressao) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Expression added successfully!'
			}
			return restService.requestWithPromise('pronunciation/add', {'ds_expressao': ds_expressao}, successfullyMessage);		
		}

		vm.del = function(cd_pronuncia) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Expression deleted successfully!'
			}
			return restService.requestWithPromise('pronunciation/del', {'cd_pronuncia': cd_pronuncia}, successfullyMessage, 'Confirm deleting?');
		}


		vm.learnedToogle = function(cd_pronuncia) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Expression updated successfully!'
			}
			return restService.requestWithPromise('pronunciation/learned/toogle', {'cd_pronuncia': cd_pronuncia}, successfullyMessage);		
		}

	};

})();	
(function() {

	'use strict'

	angular
		.module('pronunciation')
		.service('pronunciationService', pronunciationService);

	function pronunciationService($q, $window) {
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


	};

})();	
(function() {
	'use strict';
	
	angular
		.module('item')
		.factory('itemDataService', itemDataService);

	function itemDataService(restService) {
		
		return {
			list: itemList,
			get: itemGet,
			add: itemAdd,
			upd: itemUpd,
			del: itemDel,
			favorite: {
				set: itemFavoriteSet,
				get: itemFavoriteGet
			},
			revision: {
				set: itemRevisionSet,
				get: itemRevisionGet
			}
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/
		
		function itemList(cd_categoria) {
			return restService.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
		}

		function itemGet(cd_item) {
			return restService.requestWithPromise('item/get', {'cd_item': cd_item});
		}

		function itemAdd(topCategoryNode, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Item added successfully!'
			}
			return restService.requestWithPromisePayLoad('item/add', {'topCategoryNode': topCategoryNode, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		function itemUpd(cd_item, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Item updated successfully!'
			}
			return restService.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		function itemDel(cd_item) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Item deleted successfully!'
			}
			return restService.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
		}

		function itemFavoriteSet(cd_item, bl_favorite) {
			return restService.requestWithPromise('item/favorite/set', {'cd_item': cd_item, 'bl_favorite': bl_favorite});
		}

		function itemFavoriteGet(cd_item) {
			return restService.requestWithPromise('item/favorite/get', {'cd_item': cd_item});			
		}

		function itemRevisionSet(cd_item, bl_fazer_revisao) {
			return restService.requestWithPromise('item/revision/set', {'cd_item': cd_item, 'bl_fazer_revisao': bl_fazer_revisao});
		}

		function itemRevisionGet(cd_item) {
			return restService.requestWithPromise('item/revision/get', {'cd_item': cd_item});			
		}

	}	

})();	

(function() {
	'use strict';

	angular
		.module('item')
		.service('itemService', itemService);

	function itemService($rootScope, $q, itemDataService, generalService, uiDeniModalSrv, newVideoItemModalService, videoDataService, restService, textService) {
		var vm = this;

		/**
		 *
		 */
		 var _addItemText = function(scope, parentCategory) {
		 	var deferred = $q.defer();

			var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage();
			wndDescriptionMorImage.show().then(function(response) {
				if (response.button == 'ok') {
					var imageURI = generalService.getDataURLImagemObjeto(response.data.imageEl.get(0), 150, 150, 0.5);
					itemDataService.add(textService.topParentNodeId, parentCategory, response.data.description, imageURI).then(function(responseAdd) {
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
		 var _addItemVideo = function(scope, parentCategory) {
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
					return restService.SERVER_URL + 'item/image/getlink?tp_video=' + scope.newVideoItemModal.tp_video + '&id_video=' + scope.newVideoItemModal.id_video
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


		 	newVideoItemModalService.showModal(scope).then(function(response) {
		 		$rootScope.loading = true;
		 		videoDataService.add(parentCategory, scope.newVideoItemModal.tp_video, scope.newVideoItemModal.id_video, scope.newVideoItemModal.description).then(function(serverResponse) {
	 				deferred.resolve(serverResponse);
	 				$rootScope.loading = false;
		 		});
		 	});

		 	return deferred.promise;
		 }


		/**
		 *
		 */
		 vm.add = function(scope, categoryType, parentCategory) {

		 	//text
		 	if (categoryType == textService.topParentNodeId) {
		 		return _addItemText(scope, parentCategory);

		 	//video
		 	} else {
		 		return _addItemVideo(scope, parentCategory);

		 	}
		 }	

		/**
		 *
		 */
		vm.del = function(cd_item) {
			return itemDataService.del(cd_item);
		}

		/**
		 *
		 */
		vm.favorite = {

			set: function(cd_item, bl_favorite) {
				var deferred = $q.defer();
				itemDataService.favorite.set(cd_item, bl_favorite).then(function(serverReturn) {
					deferred.resolve(serverReturn.data.data[0].blFavorite);
				}, function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			},

			get: function(cd_item) {
				var deferred = $q.defer();
				itemDataService.favorite.get(cd_item).then(function(serverReturn) {
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
				itemDataService.revision.set(cd_item, bl_fazer_revisao).then(function(serverReturn) {
					deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
				}, function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			},

			get: function(cd_item) {
				var deferred = $q.defer();
				itemDataService.revision.get(cd_item).then(function(serverReturn) {
					deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
				}, function(reason) {
					deferred.reject(reason);
				});
				return deferred.promise;
			}

		}

	};

})();
(function() {
	
	'use strict';

	angular
		.module('app')
		.service('revisionRestService', revisionRestService);

	function revisionRestService(restService) {
		var vm = this;

		vm.getItemInfo = function(cd_item) {
			return restService.requestWithPromise('revision/item/info', {'cd_item': cd_item});
		}

		vm.getExpressions = function(cd_item, onlyVisible) {
			return restService.requestWithPromise('revision/expressions/get', {'cd_item': cd_item, 'onlyVisible': onlyVisible});
		}

		vm.updExpressions = function(cd_item, expressions) {
			var successfullyMessage = {
				title: 'Spaced Revision',
				message: 'expressions updated succesfully!'
			}
			return restService.requestWithPromisePayLoad('revision/expressions/upd', {'cd_item': cd_item}, expressions, successfullyMessage);
		}

		vm.updText = function(cd_item, returnOnlyVisible) {
			var successfullyMessage = {
				title: 'Spaced Revision',
				message: 'expressions updated succesfully!'
			}
			return restService.requestWithPromise('revision/expressions/updtext', {'cd_item': cd_item, 'returnOnlyVisible': returnOnlyVisible}, successfullyMessage);
		}

		vm.markAsReviewed = function(cd_item) {
			return restService.requestWithPromise('revision/markasreviewed', {'cd_item': cd_item});
		}
		

	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.service('revisionService', revisionService);

	function revisionService($q, revisionRestService) {
		var vm = this;

		vm.getItemInfo = function(cd_item) {
			var deferred = $q.defer();

			revisionRestService.getItemInfo(cd_item).then(function(serverResponse) {
				var informations = serverResponse.data.data[0];
				deferred.resolve(informations);
			}, function(reason) {
				deferred.reject(reason);
			});

			return deferred.promise;
		}

		vm.getExpressions = function(cd_item, onlyVisible) {
			var deferred = $q.defer();

			revisionRestService.getExpressions(cd_item, onlyVisible).then(function(serverResponse) {
				var expressions = serverResponse.data.data;
				deferred.resolve(expressions);
			}, function(reason) {
				deferred.reject(reason);
			});

			return deferred.promise;
		}

	};

})();	
(function() {

      'use strict';

      angular
            .module('dictionary')
            .service('dictionaryModalService', dictionaryModalService);


      function dictionaryModalService($rootScope, $q, $timeout, uiDeniModalSrv, dictionaryModalEnums, dictionaryDataService, dictionaryModalEditService, pronunciationRestService, expressionService) {
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
                        urlTemplate: 'src/app/shared/dictionary/dictionary-modal/dictionary-modal.view.html',
                        modal: true,
                        listeners: {

                        	onshow: function(objWindow) {
                        	}

                        }
                  }).show().then(function() {
                        expressionService.loadedExpressions = pronunciationRestService.loadedExpressions.concat(vm.controller.gridDictionaryOptions.alldata);
                        deferred.resolve(vm.controller.gridDictionaryOptions.alldata);
                  });

                  return deferred.promise;
      	};	

            var _editExpression = function(record) {
                  dictionaryModalEditService.showModal($rootScope, record).then(function(modelAdded) {
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
                        data: dictionaryDataService.cachedExpressions,
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
                                                dictionaryDataService.del(record.cdDicionario).then(function(serverResponse) {

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
                                    var dictionaryDefinitionViewer = $('.dictionary-modal .dictionary-definition-viewer');
                                    var element = angular.element(dictionaryDefinitionViewer);
                                    var scope = element.scope();
                                    scope.$$childTail.ctrl.cdDicionario = record.cdDicionario;
                                    if (!scope.$$phase) {
                                          scope.$apply();
                                    }                              
                              },

                              onbeforeload: function() {
                                    var dictionaryDefinitionViewer = $('.dictionary-modal .dictionary-definition-viewer');
                                    var element = angular.element(dictionaryDefinitionViewer);
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
                  vm.controller.searchState = dictionaryModalEnums.SearchState.SEARCHING;
            };

            vm.searchInputKeydown = function() {
                  if (event.keyCode == 13) {  //Return Key

                        //Find a Record
                        if (vm.controller.searchState == dictionaryModalEnums.SearchState.SEARCHING) {
                              vm.searchButtonClick(vm.controller);

                        //Add a Record    
                        } else if (vm.controller.searchState == dictionaryModalEnums.SearchState.SEARCHED) {
                              vm.searchButtonAddClick()
                        }     
                  }
            };

            vm.showSearchButton = function(button) {
                  return (
                              (button == 'search' && vm.controller.searchState == dictionaryModalEnums.SearchState.SEARCHING) ||
                              (button == 'add' && vm.controller.searchState == dictionaryModalEnums.SearchState.SEARCHED)
                         );
            };

            vm.searchButtonClick = function() {
                  vm.controller.searchState = dictionaryModalEnums.SearchState.SEARCHED;            
                  var searchInput = $('.dictionary-modal .search-input');            
                  vm.controller.gridDictionaryOptions.api.filter(searchInput.val());            
            };

            vm.searchButtonAddClick = function() {
                  vm.controller.searchState = dictionaryModalEnums.SearchState.ADDED;            
                  var searchInput = $('.dictionary-modal .search-input');            
                  var expressionAdd = searchInput.val();
                  
                  dictionaryDataService.add(expressionAdd, '').then(function(serverResponse) {
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

                        vm.controller.searchState = dictionaryModalEnums.SearchState.STOPPED;
                  });
            };

            vm.showLoading = function() {
                  return vm.controller.searchState == dictionaryModalEnums.SearchState.ADDED;
            };


      };

})();
(function() {

	'use strict';

	angular
		.module('routines')
		.service('generalService', generalService);

	function generalService($q, $sce, $compile, dictionaryDataService, pronunciationRestService, expressionService) {
		var vm = this;
		vm.SideEnum = {
			LEFT: 1,
			RIGHT: 2
		};

		vm.getAllExpressions = function() {
			var deferred = $q.defer();

			dictionaryDataService.list(true).then(function(dictionaryResponseData) {
				pronunciationRestService.list().then(function(pronunciationResponseData) {
					expressionService.loadedExpressions = dictionaryResponseData.concat(pronunciationResponseData);
					deferred.resolve(expressionService.loadedExpressions);
				}, function(reasonPronunciation) {
					console.error(reasonPronunciation);
				});

			}, function(reasonDictionary) {
				console.error(reasonDictionary);
			});


			return deferred.promise;
		};

		/**
		 * className is waiting for a array of String considering: hide-x, hide-gt-xs, hide-sm, hide-md...
		 * side is waiting for generalService.SideEnum.LEFT | generalService.SideEnum.RIGHT
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

			if (side === vm.SideEnum.LEFT) {
				mainToobar.prepend(hamburgerIconButton);
			} else {
				mainToobar.append(hamburgerIconButton);			
			}	
		};		

		/**
		 * Insert into a element a specific html and binding it with a controller
		 * passed by parameter
		 *
		 */
		 /*
		vm.insertHtmlWithController = function(targetElement, html, controller) {
			var $div = $('<div ng-controller="' + controller + '">' + html + '</div>');
			targetElement.append($div);

			var scope = angular.element($div).scope();
			$compile($div)(scope);
		}
		*/

		vm.insertHtmlWithController = function(targetElement, html, controller, scope) {	
			targetElement.html('')
			var $div = $('<div>' + html + '</div>');
			$compile($div)(scope);
			targetElement.append($div);
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

	};

})();	
(function() {
	
	'use strict';

	angular
		.module('routines')
		.service('restService', restService);

	function restService($q, $resource, $http, uiDeniModalSrv) {
		var vm = this;
		vm.SERVER_URL = 'https://denienglishsrv-denimar.rhcloud.com/'; //Hosting in Open Shift
		//vm.SERVER_URL = 'http://localhost:8087/denienglish/'; //Locally

	    vm.requestWithPromise = function(relativeUrl, parameters, successMessage, confirmMessage) {
			var deferred = $q.defer();

			var execRequest = function() {
				var parametrosUrl = {params: parameters};			
				$http.get(vm.SERVER_URL + relativeUrl, parametrosUrl)
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

			try { 
				angular.module("ngRoute") 
			} catch(err) {
				//Enter here only when it is testing, because in this case there no need to show messages
				successMessage = null;
				confirmMessage = null;
			}

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
		        var resource = $resource(vm.SERVER_URL + relativeUrl, parameters, {}, {'request': { method:'POST'}});
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


	};

})();	
(function() {

	'use strict';

	angular
		.module('routines')
		.service('stringService', stringService);

	function stringService(expressionService) {

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
			if (expressionService.loadedExpressions.length == 0) {
				return text;
			} else {
				//Order by Length of the Expressions
				var array = expressionService.loadedExpressions.sort(function(a, b){
				  // ASC  -> a.length - b.length
				  // DESC -> b.length - a.length
				  return b.dsExpressao.length - a.dsExpressao.length;
				});


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

	};

})();	
(function() {

      'use strict'

      angular
            .module('pronunciation')
            .service('pronunciationModalService', pronunciationModalService);
      
      function pronunciationModalService($q, uiDeniModalSrv, pronunciationModalEnums, pronunciationRestService, pronunciationService, dictionaryDataService, expressionService) {
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
                        urlTemplate: 'src/app/shared/pronunciation/pronunciation-modal/pronunciation-modal.view.html',
                        modal: true,
                        listeners: {

                        	onshow: function(objWindow) {
            					
                        	}

                        }
                  }).show().then(function() {
                        expressionService.loadedExpressions = dictionaryDataService.cachedExpressions.concat(vm.controller.gridPronunciationOptions.alldata);
                        deferred.resolve(vm.controller.gridPronunciationOptions.alldata);
                  });

                  return deferred.promise;
      	}	

            vm.getGridPronunciationOptions = function() {

                  return {
                        keyField: 'cdPronuncia',
                        rowHeight: '25px',
                        data: pronunciationRestService.loadedExpressions,
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
                                                pronunciationService.listenExpression(record.dsExpressao);                 
                                          }
                                    }                 
                              },
                              {
                                    width: '10%',
                                    action: {
                                          mdIcon: 'delete_forever',
                                          tooltip: 'Remove a expression from pronunciation',
                                          fn: function(record, column, imgActionColumn) {
                                                pronunciationRestService.del(record.cdPronuncia).then(function(serverResponse) {

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
                  vm.controller.searchState = pronunciationModalEnums.SearchState.SEARCHING;
            }

            vm.searchInputKeydown = function() {
                  if (event.keyCode == 13) {  //Return Key

                        //Find a Record
                        if (vm.controller.searchState == pronunciationModalEnums.SearchState.SEARCHING) {
                              vm.searchButtonClick(vm.controller);

                        //Add a Record    
                        } else if (vm.controller.searchState == pronunciationModalEnums.SearchState.SEARCHED) {
                              vm.searchButtonAddClick()
                        }     
                  }
            }

            vm.showSearchButton = function(button) {
                  return (
                              (button == 'search' && vm.controller.searchState == pronunciationModalEnums.SearchState.SEARCHING) ||
                              (button == 'add' && vm.controller.searchState == pronunciationModalEnums.SearchState.SEARCHED)
                         );
            }

            vm.searchButtonClick = function() {
                  vm.controller.searchState = pronunciationModalEnums.SearchState.SEARCHED;            
                  var searchInput = $('.pronunciation-modal .search-input');            
                  vm.controller.gridPronunciationOptions.api.filter(searchInput.val());            
            }

            vm.searchButtonAddClick = function() {
                  vm.controller.searchState = pronunciationModalEnums.SearchState.ADDED;            
                  var searchInput = $('.pronunciation-modal .search-input');            
                  var expressionAdd = searchInput.val();
                  
                  pronunciationRestService.add(expressionAdd, '').then(function(serverResponse) {
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

                        vm.controller.searchState = pronunciationModalEnums.SearchState.STOPPED;
                  });
            }


            vm.showLoading = function() {
                  return vm.controller.searchState == pronunciationModalEnums.SearchState.ADDED;
            }


      };

})();
(function() {
	'use strict';
	
	angular
		.module('item')
		.service('newVideoItemModalService', newVideoItemModalService);

	function newVideoItemModalService($q, uiDeniModalSrv) {
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
				urlTemplate: 'src/app/shared/item/new-video-item-modal/new-video-item-modal.view.html',
				modal: true
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

	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.service('spacedRevisionModalService', spacedRevisionModalService);

	function spacedRevisionModalService($rootScope, $filter, stringService, videoService, dictionaryService, pronunciationService, revisionRestService, uiDeniModalSrv, revisionService, spacedRevisionSelectExpressionsModalService) {
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
				if (vm.controller.currentExpression.t50dci) {
					vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.t50dci.dsExpressao;
					vm.controller.model.expression.type = 'Dictionary';		
					vm.controller.model.expression.resultType = 'menu';				
				} else {
					vm.controller.model.expression.dsExpressao = vm.controller.currentExpression.t51prn.dsExpressao;
					vm.controller.model.expression.type = 'Pronuciation';		
					vm.controller.model.expression.resultType = 'volume_up';				
				}
				vm.controller.model.expression.definition = '';
			}	
		}

		vm.showResult = function(controller) {
			//dictionary Result
			if (controller.currentExpression.t50dci) {
				//
				if (event.ctrlKey) {
					pronunciationService.listenExpression(controller.currentExpression.t50dci.dsExpressao);
				}	

				var dictionaryDefinitionViewer = $('.spaced-revision-modal .definition-detail-content-content dictionary-definition-viewer');
				var element = angular.element(dictionaryDefinitionViewer);
				var scope = element.scope();
				scope.$$childTail.ctrl.cdDicionario = controller.currentExpression.t50dci.cdDicionario;
				if (!scope.$$phase) {
					scope.$apply();
				}

				vm.controller.showDefinitionContent = true;                              

			//pronunciation Result
			} else if (angular.isDefined(controller.currentExpression.t51prn.cdPronuncia)) {
				pronunciationService.listenExpression(controller.currentExpression.t51prn.dsExpressao);
			}

		}

		vm.markAsReviewed = function(cd_item) {
			return revisionRestService.markAsReviewed(cd_item).then(function() {
				uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
			});
		}

		vm.selectExpressions = function() {
			spacedRevisionSelectExpressionsModalService.showModal($rootScope.selectedCdItem).then(function(expressions) {
				vm.controller.expressions = $filter('filter')(expressions, function(record, index, array) {
					return record.blMostrar;
				});
			});
		}	

		vm.showModal = function(scope, cdItem) {
			$rootScope.selectedCdItem = cdItem;
			$rootScope.loading = true;
		
			revisionService.getExpressions(cdItem, true).then(function(response) {
				$rootScope.loading = false;

		        uiDeniModalSrv.createWindow({
		            scope: $rootScope,
		            title: 'Spaced Revision',
		            width: '900px',         
		            height: '600px',
		            position: uiDeniModalSrv.POSITION.CENTER,
		            buttons: [uiDeniModalSrv.BUTTON.CLOSE],
		            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-modal/spaced-revision-modal.view.html',
		            modal: true,
		            listeners: {

		            	onshow: function(objWindow) {
							
							revisionService.getItemInfo(cdItem).then(function(serverResponse) {
								vm.controller.expressions = response;
								vm.selectExpression(0);
								vm.controller.element = $(objWindow);
								
								vm.controller.cdItem = cdItem;
								vm.controller.itemImage = stringService.format('{0}item/image/get?cd_item={1}&time={2}', videoService.SERVER_URL, cdItem, (new Date()).getMilliseconds());
							
								vm.controller.dsItem = serverResponse.dsItem;
								vm.controller.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
							});
		            	}

		            }
		        }).show();

		    });

		}
		
	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.service('spacedRevisionSelectExpressionsModalService', spacedRevisionSelectExpressionsModalService);

	function spacedRevisionSelectExpressionsModalService($rootScope, $timeout, $filter, $q, revisionService, revisionRestService, uiDeniModalSrv) {
		var vm = this;
		vm.controller;
		vm.expressions;

		vm.setController = function(controller) {
			vm.controller = controller;
		}

		vm.showModal = function(cdItem) {
			var deferred = $q.defer();

			$rootScope.loading = true;
		
			revisionService.getExpressions(cdItem, false).then(function(expressions) {
				$rootScope.loading = false;

				vm.expressions = expressions;			

		        var modal = uiDeniModalSrv.createWindow({
		            scope: $rootScope,
		            title: 'Spaced Revision - Selecting Expressions',
		            width: '750px',         
		            height: '600px',
		            position: uiDeniModalSrv.POSITION.CENTER,
		            buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
		            urlTemplate: 'src/app/shared/spaced-revision/spaced-revision-select-expressions-modal/spaced-revision-select-expressions-modal.view.html',
		            modal: true,
		            listeners: {

		            	onshow: function(objWindow) {
		            	}

		            }
		        });

				modal.show().then(function(modalResponse) {
					if (modalResponse.button == 'ok') {
						revisionRestService.updExpressions(cdItem, vm.controller.expressions).then(function() {
							deferred.resolve(vm.controller.expressions);
						});

					} else {
						deferred.reject();
					}
				});

			});			


			return deferred.promise;
		}

		vm.getExpressions = function() {
			return vm.expressions;
		}

		vm.filterExpressionsDicionary = function(expression) {
			return expression.t50dci;
		}

		vm.filterExpressionsPronunciation = function(expression) {
			return expression.t51prn;
		}

		/*
		vm.addWords = function() {

			vm.controller.dictionary = $filter('filter')(vm.expressions, function(record, index, array) {
				return record.t50dci;
			});

			vm.controller.pronunciation = $filter('filter')(vm.expressions, function(record, index, array) {
				return record.t51prn;
			});


		}

		/*
		vm.getNgModelExpression = function(expression) {
			var ngModel;
			if (expression.t50dci) {
				ngModel = 'd' + expression.t50dci.cdDicionario;
			} else {
				ngModel = 'p' + expression.t51prn.cdPronuncia;
			}

			vm.controller.selectedExpressions[ngModel] = true;

			return 'ctrl.selectedExpressions.' + ngModel;
		}
		*/

	};

})();	
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
(function() {

	'use strict';

	angular
		.module('dictionary')
		.service('dictionaryDefinitionViewerService', dictionaryDefinitionViewerService);

	function dictionaryDefinitionViewerService(dictionaryDataService) {

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
				dictionaryDataService.definitionGet(cdDicionario).then(function(serverResponse) {
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
		    dictionaryDataService.definitionSet(vm.cdDicionario, vm.controller.currentDefinition).then(function(serverResponse) {
				vm.controller.editingDefinition = false;                  
				_updateDefinitionDiv(vm.controller.currentDefinition);
		    });
		}

		vm.definitionCancelClick = function() {
		    vm.controller.currentDefinition = vm.controller.currentDefinitionBeforeEditing;
		    vm.controller.editingDefinition = false;
		}


	};

})();		
(function() {
	'use strict';

	angular
		.module('category')
		.factory('categoryMock', categoryMock);

	function categoryMock(restService)	{

		var fakeCategory = {cdCategoria: 1, dsCategoria: '_Catecory-Testing'};
		var fakeCallback = {
			data: {
				data: [fakeCategory]
			}		
		};	
		var fakeThenCallback = {
			then: function(callbackFn) {
				callbackFn(fakeCallback);
			}
		};


		return {
			fakeCategory: fakeCategory,
			fakeCallback: fakeCallback,
			fakeThenCallback: fakeThenCallback,
			mock: mock
		}

		function mock() {
			spyOn(restService, 'requestWithPromise').and.returnValue(fakeThenCallback);		
		}
	}

})();	

(function() {
	'use strict';

	angular
		.module('item')
		.factory('itemMock', itemMock);

	function itemMock(restService)	{

		var fakeItem = {cdItem: 1, dsItem: '_Item-Testing', blFavorite: true, blFazerRevisao: true};
		var fakeCallback = {
			data: {
				data: [fakeItem]
			}		
		};
		var fakeThenCallback = {
			then: function(callbackFn) {
				callbackFn(fakeCallback);
			}
		};

		return {
			fakeItem: fakeItem,
			fakeCallback: fakeCallback,
			fakeThenCallback: fakeThenCallback,
			mock: mock
		}

		function mock() {
			spyOn(restService, 'requestWithPromise').and.returnValue(fakeThenCallback);		
			spyOn(restService, 'requestWithPromisePayLoad').and.returnValue(fakeThenCallback);				
		}
	}

})();	

(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('DictionaryModalController', DictionaryModalController);

	function DictionaryModalController(dictionaryModalService, dictionaryModalEnums) {

		//use this control in the service	
		dictionaryModalService.setController(this);

		this.searchState = dictionaryModalEnums.SearchState.STOPPED; //will be fulfilled by dictionaryModalEnums.SearchState enum
		this.searchValue = '';

		this.gridDictionaryOptions = dictionaryModalService.getGridDictionaryOptions();

		this.searchInputChange = dictionaryModalService.searchInputChange;
		this.searchInputKeydown = dictionaryModalService.searchInputKeydown;

		this.searchButtonClick = dictionaryModalService.searchButtonClick;
		this.searchButtonAddClick = dictionaryModalService.searchButtonAddClick;
		this.showSearchButton = dictionaryModalService.showSearchButton;

		this.showLoading = dictionaryModalService.showLoading;

	};

})();
(function() {

	'use strict'

	angular
		.module('pronunciation')
		.controller('pronunciationModalController', pronunciationModalController);

	function pronunciationModalController(pronunciationModalService, pronunciationModalEnums) {

		//use this control in the service	
		pronunciationModalService.setController(this);

		this.searchState = pronunciationModalEnums.SearchState.STOPPED; //will be fulfilled by pronunciationModalEnums.SearchState enum
		this.searchValue = '';

		this.gridPronunciationOptions = pronunciationModalService.getGridPronunciationOptions();

		this.searchInputChange = pronunciationModalService.searchInputChange;
		this.searchInputKeydown = pronunciationModalService.searchInputKeydown;

		this.searchButtonClick = pronunciationModalService.searchButtonClick;
		this.searchButtonAddClick = pronunciationModalService.searchButtonAddClick;
		this.showSearchButton = pronunciationModalService.showSearchButton;

		this.showLoading = pronunciationModalService.showLoading;

	};

})();
(function() {
	'use strict';

	angular
		.module('item')
		.controller('newVideoItemModalController', newVideoItemModalController);

	function newVideoItemModalController($sce) {
		var vm = this;
	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('SpacedRevisionController', SpacedRevisionController);

	function SpacedRevisionController(stringService, restService, itemService, revisionService, dictionaryService, spacedRevisionModalService) {		
		var vm = this;
		spacedRevisionModalService.setController(vm);

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
			spacedRevisionModalService.selectExpression(vm.currentExpressionIndex + number);
		}
		
		vm.navigateFirst = function() {
			spacedRevisionModalService.selectExpression(0);
		}

		vm.navigateLast = function() {
			spacedRevisionModalService.selectExpression(vm.expressions.length - 1);
		}	

		vm.showResult = function() {
			spacedRevisionModalService.showResult(vm);
		}

		vm.markAsReviewed = function(cd_item) {
			spacedRevisionModalService.markAsReviewed(cd_item);
		}

		vm.selectExpressions = spacedRevisionModalService.selectExpressions;

		/*
		if (vm.cdItem) {
			vm.itemImage = stringService.format('{0}item/image/get?cd_item={1}&time={2}', restService.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

			revisionService.getItemInfo(vm.cdItem).then(function(serverResponse) {
				vm.dsItem = serverResponse.dsItem;
				vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
			});

		} else {
			new Error('Attributes passed in a wrong way!')
		}
		*/

	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('SpacedRevisionSelectExpressionsModalController', SpacedRevisionSelectExpressionsModalController);

	function SpacedRevisionSelectExpressionsModalController(spacedRevisionSelectExpressionsModalService) {
		this.selectedExpressions = {};

		spacedRevisionSelectExpressionsModalService.setController(this);
		
		this.expressions = spacedRevisionSelectExpressionsModalService.getExpressions();

		this.filterExpressionsDicionary = spacedRevisionSelectExpressionsModalService.filterExpressionsDicionary;
		this.filterExpressionsPronunciation = spacedRevisionSelectExpressionsModalService.filterExpressionsPronunciation;

	};

})();	
(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('DictionaryModalEditController', DictionaryModalEditController);

	function DictionaryModalEditController(dictionaryModalEditService) {

		//use this control in the service	
		dictionaryModalEditService.setController(this);

		this.model = {};

	};

})();
(function() {

	'use strict';

	angular
		.module('dictionary')
		.controller('dictionaryDefinitionViewerController', dictionaryDefinitionViewerController);

	function dictionaryDefinitionViewerController($scope, dictionaryDefinitionViewerService) {
		
		dictionaryDefinitionViewerService.setController(this);
		
		this.currentDefinition = null;	

		this.editingDefinition = false;

		this.definitionEditClick = dictionaryDefinitionViewerService.definitionEditClick;
		this.definitionSaveClick = dictionaryDefinitionViewerService.definitionSaveClick;
		this.definitionCancelClick = dictionaryDefinitionViewerService.definitionCancelClick;

		$scope.$watch('ctrl.cdDicionario', function(newValue, oldValue) {
			dictionaryDefinitionViewerService.refreshDefinition(newValue);	
		});

	};

})();	
(function() {

	'use strict';

	angular
		.module('dictionary')
		.directive('dictionaryDefinitionViewer', dictionaryDefinitionViewer);

	function dictionaryDefinitionViewer() {
		
		return {
			restrict: 'E',
			scope: {},
			bindToController: {
				cdDicionario: '=?'
			},
			controller: 'dictionaryDefinitionViewerController',
			controllerAs: 'ctrl',
			templateUrl: 'src/app/shared/dictionary/directives/dictionary-definition-viewer/dictionary-definition-viewer.view.html',
			link: function(scope, element, attrs) {
				scope.ctrl.element = $(element);	    
			}	
		}

	};

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.service('homeService', homeService);

	function homeService($timeout, $rootScope, generalService, categoryService, restService, itemService, stringService, spacedRevisionModalService, uiDeniModalSrv, itemDataService, textService) {

		var vm = this;
		var jsTreeInstance = null;

		/**
		 *
		 *
		 */
		vm.addCategoryClick = function(scope, currentCategoryId) {
			categoryService.add(scope, currentCategoryId).then(function(addedCategory) {
				var newNode = { 
					state: 'open', 
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
			categoryService.rename(scope, currentCategoryNode.id, currentCategoryNode.text).then(function(renamedCategory) {
				jsTreeInstance.rename_node(currentCategoryNode, renamedCategory);
			});
		};

		/**
		 *
		 *
		 */
		vm.delCategoryClick = function(currentCategoryNode) {
			categoryService.del(currentCategoryNode.id).then(function(serverResponse) {
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

			itemService.add(scope, topParentNode, controller.currentCategoryNode.id).then(function(addedItem) {
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
			controller.currentCategory = controller.currentCategoryNode.id;

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
					controller.gridOptions.url = restService.SERVER_URL + 'item/list?cd_categoria=' + controller.currentCategoryNode.id;
		    	//Revisions
		    	} else if (controller.currentNavItem == 'pageRevisions') {
					controller.gridOptions.url = restService.SERVER_URL + 'revision/list?pendente=true&days=5&cd_categoria=' + controller.currentCategoryNode.id;
		    	//Favorites
		    	} else {
					controller.gridOptions.url = restService.SERVER_URL + 'item/favorite/get?cd_categoria=' + controller.currentCategoryNode.id;
		    	}
						
				controller.gridOptions.api.reload();
			}	

	    };

		/**
		 *
		 *
		 */
		vm.configureTreeView = function(controller) {

		  	$('#categoryTreeview')
				.on('loaded.jstree', function (e, data) {
					jsTreeInstance = data.instance;
					if (controller.currentCategory) {
						jsTreeInstance.select_node(controller.currentCategory);
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
							"url" : restService.SERVER_URL + 'category/category/tree/list',				
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
							
							if (topParentNode == textService.topParentNodeId) {
								linkViewItem = '/text';
							} else {
								linkViewItem = '/video';						
							}
							var time = new Date();
							var miliseconds = time.getMilliseconds();

							var revise = record.blFazerRevisao ? 'check_box' : 'check_box_outline_blank';						
							var reviseSelected = record.blFazerRevisao ? 'selected' : '';
							
							var favorite = record.blFavorite ? 'star' : 'star_border';
							var favoriteSelected = record.blFavorite ? 'selected' : '';						

		  					var cellTemplate = '<div class="cell-template">\n' +
											   '    <img class="item-image"\n' +
											   '        src="{0}item/image/get?cd_item={1}&time={5}" \n' +
											   '    />\n' +                                  
											   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
											   '    <div>{4}</div>\n' +									   
											   '    <md-icon class="material-icons revise {6}"> {7} </md-icon>\n' +										   										   
											   '    <md-icon class="material-icons favorite {8}"> {9} </md-icon>\n' +
											   '<div>';

		  					return stringService.format(cellTemplate, restService.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', miliseconds, reviseSelected, revise, favoriteSelected, favorite);
		        		}
		        	},
		        	{
		        		width: '32px',
			            action: {
			                mdIcon: 'restore',
			                tooltip: '',
			                fn: function(record, column, imgActionColumn) {
								spacedRevisionModalService.showModal(scope, record.cdItem);
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
										var uriImage = generalService.getDataURLImagemObjeto(response.data.imageEl.get(0), 160, 140, 1);
										itemDataService.upd(record.cdItem, controller.currentCategory, response.data.description, uriImage).then(function(responseUpd) {
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
								itemService.del(record.cdItem).then(function() {
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

							elementRow.find('.material-icons.revise').click(function(event) {
								var record = controller.gridOptions.api.getSelectedRow();
								record.blFazerRevisao = !record.blFazerRevisao;

								var revisionIcon = $(event.currentTarget);
								if (revisionIcon.is('.selected')) {
									revisionIcon.html('check_box_outline_blank');
									revisionIcon.removeClass('selected');
								} else {
									revisionIcon.html('check_box');
									revisionIcon.addClass('selected');
								}	

								itemService.revision.set(record.cdItem, record.blFazerRevisao).then(function(blFazerRevisao) {
									uiDeniModalSrv.ghost('Items', 'Item updated successfuly!');
								});
							});

							elementRow.find('.material-icons.favorite').click(function(event) {
								var record = controller.gridOptions.api.getSelectedRow();
								record.blFavorite = !record.blFavorite;

								var favoriteIcon = $(event.currentTarget);
								if (favoriteIcon.is('.selected')) {
									favoriteIcon.html('star_border');
									favoriteIcon.removeClass('selected');
								} else {
									favoriteIcon.html('star');
									favoriteIcon.addClass('selected');
								}	

								itemService.favorite.set(record.cdItem, record.blFavorite).then(function(blFavorite) {
									uiDeniModalSrv.ghost('Items', 'Item updated successfuly!');
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

	};

})();	
(function() {
    
    'use strict';

    angular
	    .module('text')
	    .factory('textDataService', textDataService);

	function textDataService(restService) {

		return {
			list: textList,
			getContent: textGetContent,
			setContent: textSetContent
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/

		function textList(cdItem) {
			return restService.requestWithPromise('text/list', {'cd_item': cdItem});
		};

		function textGetContent(cdTexto) {
			return restService.requestWithPromise('text/content/get', {'cd_texto': cdTexto});
		};

		function textSetContent(cdTexto, content) {
			var successfullyMessage = {
				title: 'Texts',
				message: 'text updated successfully!'
			};
			return restService.requestWithPromisePayLoad('text/content/set', {}, {'cd_texto': cdTexto, 'tx_conteudo': content}, successfullyMessage);
		};

	}
		
})();	
(function() {
	
	'use strict';

	angular
		.module('text')
		.service('textService', textService);

	function textService(textDataService, stringService, generalService) {

		var vm = this;
		vm.topParentNodeId = 275; //t02ctg.cdCategoria from the top parent node

		vm.setContent = function(controller, scope, content) {
	        var panelEditor = $('.text .text-content');                        
			controller.content = content;
	        controller.formatedContent = stringService.addLinksDictionaryAndPronunciation(controller.content);
			generalService.insertHtmlWithController(panelEditor, controller.formatedContent, 'textController', scope);
		};


	}

})();
(function() {

	'use strict';

	angular
		.module('video')
		.service('videoDataService', videoDataService);

	function videoDataService(restService) {

		return {
			add: videoAdd,
			get: videoGet,
			commentaries: {
				set: videoComentariesSet
			}
		}	

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/		

		function videoAdd(cdCategoria, tpVideo, idVideo, dsItem) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'Video added successfully!'
			};
			return restService.requestWithPromisePayLoad('video/add', {}, {'cd_categoria': cdCategoria, 'tp_video': tpVideo, 'id_video': idVideo, 'ds_item': dsItem}, successfullyMessage);
		};

		function videoGet(cdItem) {
			return restService.requestWithPromise('video/get', {'cd_item': cdItem});
		};

		function videoComentariesSet(cdVideo, commentary) {
			var successfullyMessage = {
				title: 'Videos',
				message: 'commentary updated successfully!'
			};
			return restService.requestWithPromisePayLoad('video/commentary/set', {'cd_video': cdVideo}, {'txCommentaries': commentary}, successfullyMessage);
		};

	}

})();		
(function() {

	'use strict';

	angular
		.module('video')
		.service('videoService', videoService);

	function videoService($rootScope, $timeout, $sce, $compile, $interval, $q, videoDataService, restService, stringService, videoModalImportSubtitleLyricsService, videoModalImportSubtitleSrtService, subtitleModalService, generalService) {
		var vm = this;
		vm.topParentNodeId = 276; //t02ctg.cdCategoria from the top parent node
		vm.controller = null;

		vm.setController = function(controller) {
			vm.controller = controller;
		};

		var _selectSubtitleInTime = function(controller, time) {
			var data = controller.gridSubtitlesOptions.data;
			for (var index = 0 ; index < data.length ; index++) {
				var record = data[index];
				if ((time >= record.nrStart) && (time <= record.nrEnd)) {
					if (index !== controller.gridSubtitlesOptions.api.getSelectedRowIndex()) {
						controller.gridSubtitlesOptions.api.selectRow(index, true, false);
					}	
					break;
				}
			}
		};

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

			videoDataService.get(cdItem).then(function(serverReturn) {
				var t08vdo = serverReturn.data.data[0];
				deferred.resolve(t08vdo);

				var urlImage;
				if (t08vdo.tpVideo === 'YOUTUBE') {
					urlImage = 'https://www.youtube.com/watch?v=' + t08vdo.idVideo;
				} else {
					urlImage = 'https://googledrive.com/host/' + t08vdo.idVideo;
				}

				controller.videoConfig = {
					//preload: "auto",
					autoPlay: false,
					sources: [
						//{src: t08vdo.dsUrl},
						{src: $sce.trustAsResourceUrl(urlImage), type: 'video/mp4'},
					],
					theme: {
						url: 'dist/videogular/videogular.css'
					},
					plugins: {
						controls: {
							autoHide: true,
							autoHideTime: 5000
						},
						//poster: restService.SERVER_URL + "item/image/get?cd_item=" + t08vdo.t05itm.cdItem + '&time=452'
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
		};	

		vm.configGridSubtitles = function(controller, cdItem) {	

			controller.gridSubtitlesOptions = {
				keyField: 'cdItemSubtitle',
				rowHeight: '37px',
				url: restService.SERVER_URL + '/subtitle/list?cd_item=' + cdItem,
				hideHeaders: true,
		        columns: [
		        	{
		            	name: 'nrStart',
		            	width: '15%',
		            	align: 'center',	            	
		            	renderer: function(value, record) {
		            		return stringService.doubleToStrTime(value);
		            	}	
		        	},
		        	{
		            	name: 'nrEnd',
		            	width: '15%',
		            	align: 'center',
		            	renderer: function(value, record) {
		            		return stringService.doubleToStrTime(value);
		            	}	
		        	},
		        	{
		            	name: 'dsTexto',
		            	width: '80%',
		            	renderer: function(value, record) {
							var $div = $('<div>' + stringService.addLinksDictionaryAndPronunciation(value) + '</div>');
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
							}, 1500);
						}	
					},

					onrowdblclick: function(recordDblClick, rowElementDblClick, rowIndexDblClick) {
						vm.editSubtitleButtonClick();
					}
		        }
		    };


		};

		vm.configWYSIWYG = function(controller, cdItem) {

			var fnExecSaveButton = function() {
				videoDataService.commentaries.set(controller.t08vdo.cdVideo, controller.t08vdo.txComentarios);
			};

			var fnExecCancelButton = function() {
		    	videoDataService.get(cdItem).then(function(serverResponse) {
		    		controller.t08vdo = serverResponse.data.data[0];
		    	});
			};

			controller.options = generalService.getConfigWYSIWYG(fnExecSaveButton, fnExecCancelButton);
		};

		vm.editSubtitleButtonClick = function() {
			subtitleModalService.edit(vm.controller.scope, vm.controller).then(function(subtitleUpdated) {
				vm.controller.gridSubtitlesOptions.api.reload().then(function() {
					vm.controller.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
				});
			});
		};

	    vm.importSubtitleFromLyrics = function() {
	    	videoModalImportSubtitleLyricsService.showModal(vm.controller.cdItem).then(function(subtilesAdded) {
	    		vm.controller.gridSubtitlesOptions.api.loadData(subtilesAdded);
	    	});
	    };

	    vm.importSubtitleFromSrtFile = function() {
	    	videoModalImportSubtitleSrtService.showModal(vm.controller.cdItem).then(function(subtilesAdded) {
	    		vm.controller.gridSubtitlesOptions.api.loadData(subtilesAdded);
	    	});
	    };


	}

})();
(function() {

  'use strict';

  angular
    .module('video')
    .service('videoModalImportSubtitleLyricsService', videoModalImportSubtitleLyricsService);

  function videoModalImportSubtitleLyricsService($rootScope, $q, restService, uiDeniModalSrv) {

  	var vm = this;
    vm.cdItem = null;
  	vm.controller = null;

  	vm.setController = function(controller, scope) {
  		vm.controller = controller;
      vm.controller.cdItem = vm.cdItem;
  	};

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
              urlTemplate: 'src/app/components/video/video-modal-import-subtitle-lyrics/video-modal-import-subtitle-lyrics.view.html',
              modal: true,
              listeners: {

              	onshow: function(objWindow) {
              	}

              }
        });

        wndImportSubtitle.show().then(function(modalResponse) {

          if (modalResponse.button === 'ok') {
            var successfullyMessage = {
              title: 'Updating',
              message: 'Item updated successfully!'
            };

            var textArea = $(wndImportSubtitle).find('textarea');
            var lyrics = textArea.val();

            restService.requestWithPromisePayLoad('subtitle/importlyrics', {}, {'cdItem': vm.cdItem, 'lyrics': lyrics}, successfullyMessage).then(function(serverReturn) {
              deferred.resolve(serverReturn.data);
            });   
          }

        });

        return deferred.promise;
  	};

  }

})();  
(function() {
	
	'use strict';

	angular
		.module('video')
		.service('subtitleDataService', subtitleDataService);

	function subtitleDataService(restService) {

		return {
			list: subtitleList,
			add: subtitleAdd,
			upd: subtitleUpd,
			incASecond: subtitleIncASecond,
			decASecond: subtitleDecASecond,
			del: subtitleDel
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/	
			
		function subtitleList(cdItem) {
			return restService.requestWithPromise('subtitle/list', {'cd_item': cdItem});
		};

		function subtitleAdd(cdVideo, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Subtitle added successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/add', {}, {'cd_video': cdVideo, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		function subtitleUpd(cdItemSubtitle, nrStart, nrEnd, dsTexto) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromisePayLoad('subtitle/upd', {}, {'cd_item_subtitle': cdItemSubtitle, 'nr_start': nrStart, 'nr_end': nrEnd, 'ds_texto': dsTexto}, successfullyMessage);		
		};

		function subtitleIncASecond(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/incasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		function subtitleDecASecond(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Subtitle updated successfully!'
			};
			return restService.requestWithPromise('subtitle/decasecond', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage);		
		};

		function subtitleDel(cdItemSubtitle) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Subtitle deleted successfully!'
			};
			return restService.requestWithPromise('subtitle/del', {'cd_item_subtitle': cdItemSubtitle}, successfullyMessage, 'Confirm deleting?');
		};

	}

})();

(function() {

    'use strict';

  angular
    .module('video')
    .service('videoModalImportSubtitleSrtService', videoModalImportSubtitleSrtService);

  function videoModalImportSubtitleSrtService($q, $http, $rootScope, restService, uiDeniModalSrv) {

  	var vm = this;
    vm.cdItem = null;
  	vm.controller = null;

  	vm.setController = function(controller, scope) {
  		vm.controller = controller;
      vm.controller.cdItem = vm.cdItem;

      scope.$watch('ctrl.strFile', function (newValue, oldValue) {
          vm.controller.strFile = newValue;
      });
  	};

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
              urlTemplate: 'src/app/components/video/video-modal-import-subtitle-srt/video-modal-import-subtitle-srt.view.html',
              modal: true,
              listeners: {

              	onshow: function(objWindow) {
              	}

              }
        });

        wndImportSubtitle.show().then(function(modalResponse) {

          if (modalResponse.button === 'ok') {
            if ((vm.controller.strFile) && (!vm.controller.strFile.$error)) {

              var fileInput = $(wndImportSubtitle).find('input[type=file]');
               var fd = new FormData();
               fd.append('cdItem', vm.cdItem);
               fd.append('file', vm.controller.strFile);

               $http.post(restService.SERVER_URL + 'subtitle/importsrt', fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(serverResponseAddSubtitle){
                  uiDeniModalSrv.ghost('Subtitles', 'Subtitles imported successfully!');
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

  }

})();  
(function() {
	
	'use strict';

	angular
		.module('video')
		.service('subtitleModalService', subtitleModalService);

	function subtitleModalService($q, uiDeniModalSrv, stringService, subtitleDataService) {
		var vm = this;

		var EnumOperation = {
			ADDING: 1,
			EDITING: 2
		};

		var _getSubtitleModal = function(scope, controller, operation) {
			var deferred = $q.defer();

			controller.subtitleModalData = {};

			var record = controller.gridSubtitlesOptions.api.getSelectedRow();

			if (operation === EnumOperation.EDITING) { //Editing
				controller.subtitleModalData.start = stringService.doubleToStrTime(record.nrStart);
				controller.subtitleModalData.end = stringService.doubleToStrTime(record.nrEnd);
				controller.subtitleModalData.text = record.dsTexto;			
			} else { //Adding
				if (record) {
					controller.subtitleModalData.start = stringService.doubleToStrTime(record.nrStart + 1);
					controller.subtitleModalData.end = stringService.doubleToStrTime(record.nrStart + 2);
				} else {
					//initial value (fake value)
					controller.subtitleModalData.start = stringService.doubleToStrTime(1);
					controller.subtitleModalData.end = stringService.doubleToStrTime(10);
				}
			}

			var modal = uiDeniModalSrv.createWindow({
				scope: scope,
				title: 'Subtitles',
				width: '450px',			
				height: '230px',
				position: uiDeniModalSrv.POSITION.CENTER,
				buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
				urlTemplate: 'src/app/components/video/subtitle/modals/subtitle-modal.view.html',
				modal: true,
		        listeners: {
		        	onshow: function(objWindowShowed) {
		        		//alert('show...');
		        	},
		        }	
			});

			modal.show().then(function(msgResponse) {
				if (msgResponse.button === 'ok') {
					var fn;

					controller.subtitleModalData.start = stringService.strTimeToDouble(controller.subtitleModalData.start);
					controller.subtitleModalData.end = stringService.strTimeToDouble(controller.subtitleModalData.end);				

					console.log(controller.subtitleModalData);
					if (operation === EnumOperation.EDITING) { //Editing
						subtitleDataService.upd(record.cdItemSubtitle, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
							deferred.resolve(responseServer.data[0]);
						});
					} else { //Adding
						subtitleDataService.add(controller.t08vdo.cdVideo, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
							deferred.resolve(responseServer.data[0]);
						});
					}

				} else {
					deferred.reject('');
				}
			}); 

			return deferred.promise;
		};	

		vm.add = function(scope, controller) {
			return _getSubtitleModal(scope, controller, EnumOperation.ADDING);
		};

		vm.edit = function(scope, controller) {
			return _getSubtitleModal(scope, controller, EnumOperation.EDITING);
		};

	}

})();	
(function() {
	
	'use strict';

	angular
		.module('app')
		.controller('homeController', homeController);

	function homeController($scope, $rootScope, $routeParams, homeService, generalService) {
		
		var vm = this;
		vm.categoryPath = null;		
		vm.currentCategory = null; //Category Id	

		generalService.createHamburgerButton(['show-xs', 'hide-gt-xs'], generalService.SideEnum.LEFT);

		vm.currentNavItem = 'pageItems';
		vm.currentCategoryNode = null; //Category Node
		
		$.jstree.defaults.core.themes.variant = 'large';	

		vm.addCategoryClick = function() {
			homeService.addCategoryClick($scope, vm.currentCategoryNode.id);
		};	

		vm.editCategoryClick = function() {
			homeService.editCategoryClick($scope, vm.currentCategoryNode);
		};	

		vm.delCategoryClick = function() {
			homeService.delCategoryClick(vm.currentCategoryNode);
		};

	    vm.addNewItemButtonClick = function(event) {
	    	homeService.addNewItemButtonClick(vm, $scope, event);
	    };	

		homeService.configureTreeView(vm, vm.currentCategory || $routeParams.cdCategoria);

		homeService.configureGridItems(vm, $scope);
			
	    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
	    	vm.currentNavItem = newCurrentNavItem;
	    	if (newCurrentNavItem) {
	    		homeService.reloadDataGrid(vm);
	    	}
	    });

	}

})();	
(function() {
    
    'use strict';

    angular
        .module('text')
        .controller('textController', textController);

    function textController($scope, $rootScope, $routeParams, dictionaryService, dictionaryModalService, pronunciationService, 
        pronunciationModalService, textDataService, textService, generalService, stringService, 
        uiDeniModalSrv, spacedRevisionModalService, itemDataService) {
         
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

        itemDataService.get(vm.params.cdItem).then(function(serverResponse) {
            vm.t05itm = serverResponse.data.data[0];
            $rootScope.subTitle = vm.t05itm.dsItem;
        });

        textDataService.list(vm.params.cdItem).then(function(serverResponse) {
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

        			textDataService.getContent(vm.t07txt.cdTexto).then(function(serverResponse) {
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
            textDataService.setContent(vm.t07txt.cdTexto, vm.content).then(function(serverResponse) {           
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
        };

        $scope.openDictionary = function(cdDicionario, dsExpressao) {
            dictionaryService.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
        };    

        $scope.openPronunciation = function(dsExpressao) {
            pronunciationService.listenExpression(dsExpressao);
        };     

    }

})();    
(function() {

	'use strict';

	angular
		.module('video')
		.controller('videoController', videoController);

	function videoController(
		$scope, $rootScope, $routeParams, generalService, itemDataService, videoService, subtitleModalService, 
		subtitleDataService, uiDeniModalSrv, pronunciationService, pronunciationModalService, dictionaryService, 
		dictionaryModalService, spacedRevisionModalService) {

		var vm = this;
		videoService.setController(vm);
		vm.scope = $scope;


		$scope.name = 'videoController';
		$scope.params = $routeParams;	
		vm.t05itm = null;
		vm.cdItem = $scope.params.cdItem;
		vm.commentaries = '';
		vm.initialCommentaries = '';

		itemDataService.get($scope.params.cdItem).then(function(serverResponse) {
			vm.t05itm = serverResponse.data.data[0];
			$rootScope.subTitle = vm.t05itm.dsItem;
		});

	    videoService.configElementVideo(vm, $scope.params.cdItem).then(function(t08vdo) {
			vm.t08vdo = t08vdo;
			//vm.commentaries = t08vdo.txComentarios;
		});

		videoService.configGridSubtitles(vm, $scope.params.cdItem);		
		videoService.configWYSIWYG(vm, $scope.params.cdItem);	
		generalService.getAllExpressions().then(function(response) {
			vm.gridSubtitlesOptions.api.repaint();
		});

		vm.dictionaryModalClick = function() {
			dictionaryModalService.showModal($rootScope).then(function(dictionaryData) {
				vm.gridSubtitlesOptions.api.repaint();
			});
		};

		vm.pronunciationModalClick = function() {
			pronunciationModalService.showModal($rootScope).then(function(pronunciationData) {
				vm.gridSubtitlesOptions.api.repaint();
			});
		};

		vm.addSubtitleButtonClick = function() {
			subtitleModalService.add($scope, vm).then(function(subtitleAdded) {
				vm.gridSubtitlesOptions.api.reload().then(function() {
					vm.gridSubtitlesOptions.api.findKey(subtitleAdded.cdItemSubtitle, {inLine: true});
				});
			});
		};

		vm.editSubtitleButtonClick = videoService.editSubtitleButtonClick;

		/*
		vm.editSubtitleButtonClick = function() {
			subtitleModalService.edit($scope, vm).then(function(subtitleUpdated) {
				vm.gridSubtitlesOptions.api.reload().then(function() {
					vm.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
				});
			});
		}
		*/

		vm.delSubtitleButtonClick = function() {
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			subtitleDataService.del(record.cdItemSubtitle).then(function() {
				vm.gridSubtitlesOptions.api.reload();
			});
		};

		var _incrementOneSecond = function(increment) {
			$rootScope.loading = true;
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			var cdItemSubtitle = record.cdItemSubtitle;
			record.nrStart = record.nrStart + increment;
			record.nrEnd = record.nrEnd + increment;		

			var fn;
			if (increment > 0) {
				fn = subtitleDataService.incASecond;
			} else {
				fn = subtitleDataService.decASecond;
			}

			fn(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(serverResponse) {
				$rootScope.loading = false;
				uiDeniModalSrv.ghost('Subtitle', 'Subtitle time is update successfully');				
				vm.gridSubtitlesOptions.api.repaint();
				vm.gridSubtitlesOptions.api.findKey(cdItemSubtitle, {inLine: true});
			});
		};

		vm.decreaseOneSecondButtonClick = function() {
			_incrementOneSecond(-1);
		};

		vm.incrementOneSecondButtonClick = function() {
			_incrementOneSecond(1);
		};

		vm.listenButtonClick = function() {
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			pronunciationService.listenExpression(record.dsTexto);
		};

	    vm.spacedRevisionClick = function() {
	        spacedRevisionModalService.showModal($scope, vm.cdItem);
	    };

	    $scope.openDictionary = function(cdDicionario, dsExpressao) {
	        dictionaryService.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
	    };    

		$scope.openPronunciation = function(dsExpressao) {
	        pronunciationService.listenExpression(dsExpressao);
	    };

	    vm.importSubtitleFromLyrics = videoService.importSubtitleFromLyrics;
	    vm.importSubtitleFromSrtFile = videoService.importSubtitleFromSrtFile;

	}

})();	
(function() {

	'use strict';

	angular
		.module('video')
		.controller('videoModalImportSubtitleLyricsController', videoModalImportSubtitleLyricsController);

	function videoModalImportSubtitleLyricsController(videoModalImportSubtitleLyricsService) {
		videoModalImportSubtitleLyricsService.setController(this);    
	}

})();	
(function() {

    'use strict';

	angular
		.module('video')
		.controller('VideoModalImportSubtitleSrtController', VideoModalImportSubtitleSrtController);

	function VideoModalImportSubtitleSrtController($scope, videoModalImportSubtitleSrtService) {
		videoModalImportSubtitleSrtService.setController(this, $scope);    
	}

})();	
angular.module('app').config(function($routeProvider) {
	
    $routeProvider
        .when('/:cdCategoria?', {
            templateUrl : 'src/app/components/home/home.view.html',
            controller: 'homeController',
            controllerAs: 'ctrl'
        })
        .when('/text/:cdItem', {
            templateUrl : 'src/app/components/text/text.view.html',
            controller: 'textController',
            controllerAs: 'ctrl'
        })
        /*
        .when('/text/:cdItem', {
            templateUrl : 'app/shared/spaced-revision/teste.htm',
            controller: 'TesteCtrl',
            controllerAs: 'ctrl'
        })
        */
        .when('/video/:cdItem', {
            templateUrl : 'src/app/components/video/video.view.html',
            controller: 'videoController',
            controllerAs: 'ctrl'
        }).
    	otherwise({
    		redirectTo: '/'
    	});	

});
angular.module('app').controller('AppCtrl', function($scope, $rootScope, $route, $routeParams, $location) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;		

	$rootScope.loading = false;

});