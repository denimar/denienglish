angular.module('TextMdl', []);
angular.module('VideoMdl', []);
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
]);


angular.module('TextMdl').service('TextSrv', function() {

	this.showModalAddItem = function() {
		alert('add modal');
	}

});
angular.module('VideoMdl').service('VideoSrv', function() {
	
	
	
});
angular.module('app').controller('HomeCtrl', function($scope, $routeParams, $log, $mdSidenav, AppConsts, AppEnums, AppSrv, ItemRestSrv, uiDeniModalSrv, ItemRestSrv) {
	
	var me = this;
	
	AppSrv.createHamburgerButton(['show-xs', 'hide-gt-xs'], AppEnums.Side.LEFT);

	me.categoryPath = null;
	me.currentNavItem = "pageItems";
	me.currentCategoryNode = null; //Category Node
	
	$.jstree.defaults.core.themes.variant = "large";	

    me.isOpenRight = function(){
      return $mdSidenav('left').isOpen();
    };	

  	var _jsTree = $('#categoryTreeview')
		.on('loaded.jstree', function (e, data) {
			var categoryToSet = AppSrv.currentCategory || $routeParams.cdCategoria;
			if (categoryToSet) {
				data.instance.select_node(categoryToSet);
			}	
		})
		.on('changed.jstree', function (e, data) {
		  if (data.node) {
				me.setCurrentCategory(data);

				$scope.gridOptions.url = AppConsts.SERVER_URL + 'item/list?cd_categoria=' + data.node.id;
				$scope.gridOptions.api.reload();
			  
		  }  
		})
		.jstree({
			'core' : {
				'data' : {
					"url" : AppConsts.SERVER_URL + 'category/category/tree/list',				
					//"url" : "//www.jstree.com/fiddle/",
					"dataType" : "json" // needed only if you do not supply JSON headers
				},
			},
			plugins : [
				"contextmenu", "dnd", "search",
				"types", "wholerow"
			],
		});
		
	//_jsTree.select_node();	
	  
	var _getTopParentNode = function() {
		return me.currentCategoryNode.parents[me.currentCategoryNode.parents.length - 2];
	}

	 /* 
    var customRowTemplate = '<div class="row-template">\n' +
                            '    <img class="item-image"\n' +
                            '        src="' + AppConsts.SERVER_URL + 'item/image/get?cd_item={cdItem}" \n' +
                            '    />\n' +                                  
                            '    <div class="description">{dsItem}</div>\n' +
							'    <div style="float:right; margin-top: 32px;">\n' +
                            '    	<img class="ui-cell action-buttons btn-revision" src="assets/images/16x16/revision.png"  />\n' +																
							'    	<img class="ui-cell action-buttons btn-edit" src="assets/images/16x16/edit.gif" />\n' +								
							'    	<img class="ui-cell action-buttons btn-delete" src="assets/images/16x16/delete.gif"/>\n' +
							'    </div>\n' +								
                            '<div>';
	*/                            

	var funcaoTeste = function(cdItem) {
		alert(cdItem);
	}
	
    $scope.gridOptions = {
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
					var topParentNode = _getTopParentNode();
					
					if (topParentNode == AppEnums.CategoryType.TEXT) {
						linkViewItem = '/text';
					} else {
						linkViewItem = '/video';						
					}
					var time = new Date();
  					var cellTemplate = '<div class="cell-template">\n' +
									   '    <img class="item-image"\n' +
									   '        src="{0}item/image/get?cd_item={1}&time={5}" \n' +
									   '    />\n' +                                  
									   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
									   '    <div>{4}</div>\n' +									   
									   '<div>';

  					return AppSrv.String.format(cellTemplate, AppConsts.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', time);
        		}
        	},
        	{
        		width: '32px',
	            action: {
	                icon: 'assets/images/16x16/revision.png',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
	                	alert('btn-revision');
	                }
	            }        		
        	},
        	{
        		width: '32px',
	            action: {
	                icon: 'assets/images/16x16/edit.gif',
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
								ItemRestSrv.upd(record.cdItem, AppSrv.currentCategory, response.data.description, response.data.image).then(function(responseUpd) {
									$scope.gridOptions.api.reload().then(function(responseData) {
										imgEl.attr('src', response.data.image);								

										var cdItemUpdated = responseUpd.data[0].cdItem;
								        $scope.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
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
	                icon: 'assets/images/16x16/delete.gif',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						ItemRestSrv.del(record.cdItem).then(function() {
							$scope.gridOptions.api.reload();
						});	                	
	                }
	            }        		
        	}

        ],
        /*
        listeners: {
			onafterload: function(data, options) {

				$('.ui-cell.action-buttons').click(function(event) {
					var button = $(event.currentTarget);
					var record = $scope.gridOptions.api.getSelectedRow();

					if (button.is('.btn-revision')) {
						alert('btn-revision');
						//ItemRestSrv.del(record.cdItem);
					} else if (button.is('.btn-edit')) {
						var rowEl = $(event.currentTarget).closest('.row-template');
						var imgEl = rowEl.find('.item-image');

						var config = {
							description: record.dsItem,
							imgSrc: imgEl.attr('src')
						};

						var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage(config);
						wndDescriptionMorImage.show().then(function(response) {
							if (response.button == 'ok') {
								ItemRestSrv.upd(record.cdItem, AppSrv.currentCategory, response.data.description, response.data.image).then(function(responseUpd) {
									$scope.gridOptions.api.reload().then(function(responseData) {
										var cdItemUpdated = responseUpd.data[0].cdItem;
								        $scope.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
									});
								});				
							}
						});
					} else if (button.is('.btn-delete')) {
						ItemRestSrv.del(record.cdItem).then(function() {
							$scope.gridOptions.api.reload();
						});
					}

				});

			}
        }
        */
    };		

    me.setCurrentCategory = function(nodeData) {
    	me.currentCategoryNode = nodeData.node;
		AppSrv.currentCategory = me.currentCategoryNode.id;

    	var path = '<span class="categoryPathTitle">' + me.currentCategoryNode.text + '</span>';

    	var parentId = me.currentCategoryNode.parent;
    	while (parentId != '#') { //# means root node
    		var parentObj = nodeData.instance.get_node(parentId);
    		path = parentObj.text + " / " + path;

    		var parentId = parentObj.parent;
    	}

		me.categoryPath = path;
    }

    me.addNewItemButtonClick = function(event) {
    	var topParentNode = _getTopParentNode();
    	if (topParentNode == AppEnums.CategoryType.TEXT) {
			var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage();
			wndDescriptionMorImage.show().then(function(response) {
				if (response.button == 'ok') {
					ItemRestSrv.add(AppSrv.currentCategory, response.data.description, response.data.image).then(function(responseAdd) {
						$scope.gridOptions.api.reload().then(function(responseData) {
							var cdItemAdded = responseAdd.data[0].cdItem;
					        $scope.gridOptions.api.findKey(cdItemAdded, {inLine: true});						
						});
					});				
				}
			});
			
    	} else if (topParentNode == AppEnums.CategoryType.VIDEO) {
    		console.info('VIDEOS');	
    	} else {
    		console.info('WARNING ---> NEVER SHOULD ENTER HERE');	
    	}	

    	/*
		var modalWnd = deniModalSrv.createWindow({
			//scope: scope, 
			width: '600px',
			height: '350px',	
			modal: true,
			//destroyOnClose: true,
			title: 'Pronúncias',
        	//urlTemplate: 'pronuncia.tpl.html',
	        buttons: [
	        	deniModalSrv.BUTTON.FECHAR
	        ],
	        listeners: {
	        	onshow: function(objWindowShowed) {
	        	},
	        }	
		});

		modalWnd.show();
		*/
    }


});
angular.module('TextMdl').controller('TextCtrl', function($scope, $routeParams, TextRestSrv) {
     
     var me = this;
     me.params = $routeParams;
     me.texts = [];
     me.selectedIndex = -1;
     me.textContent = '';

     TextRestSrv.list(me.params.cdItem).then(function(serverResponse) {
     	me.texts = serverResponse.data.data;
		me.selectedIndex = 0;     	
     })

    $scope.$watch('ctrl.selectedIndex', function(current, old){
    	if (me.texts.length > 0) {
	    	var text = me.texts[current];

			TextRestSrv.getConteudo(text.cdTexto).then(function(serverResponse) {
				var data = serverResponse.data.data[0];
				me.textContent = data.txConteudo;
			});
		}	

    });     

	 
});
angular.module('VideoMdl').controller('VideoCtrl', function($scope, $routeParams) {
	
	 $scope.name = "VideoCtrl";
     $scope.params = $routeParams;	
	
});
angular.module('app').service('ItemRestSrv', function(AppSrv) {

	var me = this;

	me.list = function(cd_categoria) {
		return AppSrv.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
	}

	me.get = function(cd_item) {
		return AppSrv.requestWithPromise('item/get', {'cd_item': cd_item});
	}

	me.add = function(cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Item added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/add', {'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	me.upd = function(cd_item, cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Item updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	me.del = function(cd_item) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Item deleted successfully!'
		}
		return AppSrv.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
	}

});
angular.module('app').service('TextRestSrv', function(AppSrv) {

	var me = this;

	me.list = function(cd_item) {
		return AppSrv.requestWithPromise('text/list', {'cd_item': cd_item});
	}

	me.getConteudo = function(cd_texto) {
		return AppSrv.requestWithPromise('text/conteudo/get', {'cd_texto': cd_texto});
	}


});
//CONSTANTS
angular.module('app').constant('AppConsts', {
	SERVER_URL: 'https://denienglishsrv-denimar.rhcloud.com/', 
	//SERVER_URL: 'http://localhost:8087/denienglish/',
});
//ENUMERATIONS
angular.module('app').constant('AppEnums', {
	CategoryType: {
		TEXT: /*275,*/277,
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
        templateUrl : "app/components/home/home.htm",
        controller: "HomeCtrl",
        controllerAs: "ctrl"
    })
    .when("/text/:cdItem", {
        templateUrl : "app/components/text/text.htm",
        controller: "TextCtrl",
        controllerAs: "ctrl"
    })
    .when("/video/:cdItem", {
        templateUrl : "app/components/video/video.htm",
        controller: "VideoCtrl",
        controllerAs: "ctrl"
    }).
	otherwise({
		redirectTo: '/'
	});	
	
});
angular.module('app').service('AppSrv', function($q, $resource, $http, AppEnums, AppConsts, uiDeniModalSrv) {

	//String routines
	this.String = new AppSrvString();
	
	this.currentCategory = null; //Category Id	

	/**
	 * className is waiting for a array of String considering: hide-x, hide-gt-xs, hide-sm, hide-md...
	 * side is waiting for AppEnums.Side.LEFT | AppEnums.Side.RIGHT
	 * reference: https://material.angularjs.org/latest/layout/options
	 */
	this.createHamburgerButton = function(classArray, side) {
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
		hamburgerIconButtonImg.attr('src', 'assets/images/hamburger.png');
		hamburgerIconButtonImg.addClass("hamburger-button");
		hamburgerIconButton.append(hamburgerIconButtonImg);

		var mainToobar = $('#md-toolbar-tools-main');

		if (side == AppEnums.Side.LEFT) {
			mainToobar.prepend(hamburgerIconButton);
		} else {
			mainToobar.append(hamburgerIconButton);			
		}	
	}

	/**
	 *
	 * It works like this: ng-repeat="rec in grid.data track by getTrackById(rec)"
 	 * 	
	 */
	this.getNgRepeatTrackById = function(record) {
		//The first property is gonna be the id property
		var keyField = Object.keys(record)[0];
		//Get the id value
		return record[keyField];
	}
   
    this.requestWithPromise = function(relativeUrl, parameters, successMessage, confirmMessage) {
		var deferred = $q.defer();
		var parametrosUrl = {params: parameters};

		var execRequest = function() {
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

    this.requestWithPromisePayLoad = function(relativeUrl, parameters, parametersPayLoad, successMessage, confirmMessage) {
		var deferred = $q.defer();
		var parametrosUrl = {params: parameters};

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
					} else if (retornoServer.data.message) {
						uiDeniModalSrv.error(retornoServer.data.message);
					} else {
						uiDeniModalSrv.error(retornoServer.data);
					}
					deferred.reject(retornoServer);
				});
		}

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

	this.getDataURLImagemObjeto = function(prObjeto, prLargura, prAltura, prQualidade) {
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

		return canvas.toDataURL("image/jpeg", prQualidade); //o certo é dimininuir também um pouco a qualidade...
	};

	/*
	this.atualizaItemSelecionado = function(descricao, elementoImg) {
		var $divItemSelecionado = $('.selecionado');
		var $img = $divItemSelecionado.find('img');
	}
	*/

	this.listenExpression = function(expression, callbackFunction) {
		if (event.ctrlKey && event.shiftKey) { //CTRL+SHIFT --> abre o site http://emmasaying.com para ver se eles possuem a pronúncia da expressão
			//var xSiteBuscar = 'http://emmasaying.com/?s=';
			var xSiteBuscar = 'http://www.wordreference.com/enpt/'
			window.open(xSiteBuscar + expression);
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
	}

	/*
	this.getArrayPronunciasEDicionario = function() {
		return varsSrv;		
	}
	*/

	/*
	 * @param array deve conter os array do dicionário e das pronúncias contatenado, formando um grande array.
	 *
	 */
	this.addLinksDictionaryAndPronunciation = function(text) {
		var array = varsSrv.arrayPronunciasEDicionario;
		if (array.length == 0) {
			return text;
		} else {
			var texto = rotinasString.replaceAll(text, '"', "'");
			var textoLower = texto.toLowerCase();	
			var matrizSubst = 'matrizsubst1-{0}-matrizsubst2';
			var expressoesSubst = [];
			var contaSubst = 0;
			
			for (var conta = 0 ; conta < array.length ; conta++) {
				var item = array[conta];
				var expressao = item.ds_expressao.toLowerCase();

				var pos = textoLower.search(new RegExp('\\b' + expressao + '\\b'));
				while (pos != -1) {
					var textoSubs = texto.substring(pos, pos + expressao.length);
					if (textoSubs.toLowerCase() == expressao) {
						expressoesSubst.push({
							cd_pronuncia: item.cd_pronuncia,
							cd_dicionario: item.cd_dicionario,								
							ds_expressao: item.ds_expressao,
							texto: textoSubs
						});
						var subst = rotinasString.format(matrizSubst, contaSubst);
						texto = texto.replace(new RegExp('\\b' + textoSubs + '\\b', "g"), subst);

						contaSubst++;
						//xPos += subst.length;
						textoLower = texto.toLowerCase();	
					}
					
					pos = textoLower.search(new RegExp('\\b' + expressao + '\\b'));
				}
			}

			for (var conta = 0 ; conta < expressoesSubst.length ; conta++) {
				var item = expressoesSubst[conta];
				var find = rotinasString.format(matrizSubst, conta);
				var replace = null;
				if (item.cd_dicionario) {
					replace = rotinasString.format('<a href="javascript:alert(\'dicionario\');">' + item.ds_expressao + '</a>', rotinasString.replaceAll(item.ds_expressao, "'", "\\'"), rotinasString.replaceAll(item.texto, "'", "\\'"));
				} else {
					replace = rotinasString.format('<a href="javascript:alert(\'pronuncia\');">' + item.ds_expressao + '</a>', rotinasString.replaceAll(item.ds_expressao, "'", "\\'"), rotinasString.replaceAll(item.texto, "'", "\\'"));
				}
				texto = rotinasString.replaceAll(texto, find, replace);		
			}					

			return texto;
		}	
	}

});

function AppSrvString() {
	
	this.format = function() {
		var formatted = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;        
	}
	
}
angular.module('app').controller('AppCtrl', function($scope, $route, $routeParams, $location) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;	
	
});
