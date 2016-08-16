angular.module('dictionaryViewMdl', []);
angular.module('spacedRevisionMdl', []);
angular.module('VideoMdl', []);
angular.module('TextMdl', []);
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
	'spacedRevisionMdl',

	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"info.vietnamcode.nampnq.videogular.plugins.youtube",
	//"com.2fdevs.videogular.plugins.overlayplay",
	//"com.2fdevs.videogular.plugins.poster",
	//"com.2fdevs.videogular.plugins.buffering",	
	
	'summernote'
]);

angular.module('app').config(function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});
angular.module('app').service('categoryRestSrv', function(AppSrv) {

	var vm = this;

	vm.add = function(cd_categoria_pai, ds_categoria) {
		var successfullyMessage = {
			title: 'Adding',
			message: 'Category added successfully!'
		}
		return AppSrv.requestWithPromise('category/add', {'cd_categoria_pai': cd_categoria_pai, 'ds_categoria': ds_categoria}, successfullyMessage);
	}

	vm.rename = function(cd_categoria, ds_categoria) {
		var successfullyMessage = {
			title: 'Editing',
			message: 'Category renamed successfully!'
		}
		return AppSrv.requestWithPromise('category/upd', {'cd_categoria': cd_categoria, 'ds_categoria': ds_categoria}, successfullyMessage);
	}

	vm.del = function(cd_categoria) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Category deleted successfully!'
		}
		return AppSrv.requestWithPromise('category/del', {'cd_categoria': cd_categoria}, successfullyMessage, 'Confirm deleting?');
	}


});

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
	}

	vm.rename = function(scope, cd_categoria, ds_categoria) {
		var deferred = $q.defer();

		uiDeniModalSrv.prompt('Renaming Category', "Enter a descrption of the category", ds_categoria, true, scope).then(function(enteredText) {
			categoryRestSrv.rename(cd_categoria, enteredText).then(function(serverResponse) {
				deferred.resolve(serverResponse.data.data[0].dsCategoria);
			});
		});

		return deferred.promise;		
	}

	vm.del = function(cd_categoria) {
		return categoryRestSrv.del(cd_categoria);		
	}

});
angular.module('app').service('DictionaryRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function() {
		return AppSrv.requestWithPromise('dictionary/list');
	}

	vm.add = function(ds_expressao, ds_tags) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Expression added successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/add', {'ds_expressao': ds_expressao, 'ds_tags': ds_tags}, successfullyMessage);		
	}

	vm.del = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Expression deleted successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/del', {'cd_dicionario': cd_dicionario}, successfullyMessage, 'Confirm deleting?');
	}


	vm.learnedToogle = function(cd_dicionario) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromise('dictionary/learned/toogle', {'cd_dicionario': cd_dicionario}, successfullyMessage);		
	}

	vm.definitionSet = function(cd_dicionario, definition) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Expression updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('dictionary/definition/set', {}, {cd_dicionario: cd_dicionario, 'tx_definicao': definition}, successfullyMessage);		
	}

	vm.definitionGet = function(cd_dicionario) {
		return AppSrv.requestWithPromise('dictionary/definition/get', {'cd_dicionario': cd_dicionario});		
	}	

});
angular.module('app').service('dictionarySrv', function($q, DictionaryRestSrv) {

	var vm = this;

	vm.list = function() {
		return DictionaryRestSrv.list();
	}

	vm.add = function(ds_expressao, ds_tags) {
		return DictionaryRestSrv.add(ds_expressao, ds_tags);
	}

	vm.del = function(cd_dicionario) {
		return DictionaryRestSrv.del(cd_dicionario);
	}


	vm.learnedToogle = function(cd_dicionario) {
		return DictionaryRestSrv.learnedToogle(cd_dicionario);
	}

	vm.definitionSet = function(cd_dicionario, definition) {
		return DictionaryRestSrv.definitionSet(cd_dicionario, definition);
	}

	vm.definitionGet = function(cd_dicionario) {
		var deferred = $q.defer();

		DictionaryRestSrv.definitionGet(cd_dicionario).then(function(serverResponse) {
			deferred.resolve(serverResponse.data.data[0].txDefinicao);			
		});

		return deferred.promise;
	}		

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

});
angular.module('app').service('itemSrv', function($q, ItemRestSrv, AppSrv, uiDeniModalSrv, newVideoItemModalSrv, AppEnums, VideoRestSrv) {

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
	 	scope.newVideoItemModal = {};

		scope.newVideoItemModal.getImagePreviewUrl = function() {
			if (scope.newVideoItemModal.kindOfVideo == "0") { //youtube
				return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId + '/default.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/0.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/1.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/2.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/3.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/jpg.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/mqdefault.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/maxresdefault.jpg';

			} else if (scope.newVideoItemModal.kindOfVideo == "1") { //google drive
				return 'https://docs.google.com/vt?id=' + scope.newVideoItemModal.videoId;
			} else {
				return '';
			}	
		};


	 	newVideoItemModalSrv.showModal(scope).then(function(response) {
	 		VideoRestSrv.add(AppSrv.currentCategory, scope.newVideoItemModal.kindOfVideo, scope.newVideoItemModal.videoId, scope.newVideoItemModal.description).then(function(serverResponse) {
 				deferred.resolve(serverResponse);
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

	/*
	this.listenExpression = function(expression) {
		var utterance = new SpeechSynthesisUtterance(expression);
		$window.speechSynthesis.speak(utterance);		
	}	
	*/

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
angular.module('app').service('DatabaseSrv', function() {

	var me = this;

});
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
	}

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
	}	

});
angular.module('app').service('StringSrv', function(AppSrv) {

	var me = this;

	me.format = function() {
		var formatted = arguments[0];
		for (var i = 1; i < arguments.length; i++) {
			var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
			formatted = formatted.replace(regexp, arguments[i]);
		}
		return formatted;        
	}


    me.leftPad = function(numero, qtdVezes, caracterRepetir) {
        var retorno = qtdVezes - numero.toString().length + 1;
        return Array(+(retorno > 0 && retorno)).join(caracterRepetir) + numero;
    }    

    me.replaceAll = function(string, find, replace) {
        if (string) {
            return string.replace(RegExp('\\b' + find + '\\b','g'), replace);   
        } else {
            return '';
        }
    }       


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
    }   

    me.strTimeToDouble = function(strTime) {
        //00:05:22,900
        var xTimeStr = strTime;
        var xHours = parseInt(xTimeStr.substring(0, 2));
        var xMinutes = parseInt(xTimeStr.substring(3, 5));
        xTimeStr = xTimeStr.substring(6, xTimeStr.length).replace(",", ".");
        var xSeconds = parseFloat(xTimeStr);        
        
        return (xHours * 3600) + (xMinutes * 60) + xSeconds;
    }       


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
				var expressao = item.dsExpressao.toLowerCase();

				var pos = textoLower.search(new RegExp('\\b' + expressao + '\\b'));
				while (pos != -1) {
					var textoSubs = texto.substring(pos, pos + expressao.length);
					if (textoSubs.toLowerCase() == expressao) {
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
					
					pos = textoLower.search(new RegExp('\\b' + expressao + '\\b'));
				}
			}

			for (var conta = 0 ; conta < expressoesSubst.length ; conta++) {
				var item = expressoesSubst[conta];
				var find = me.format(matrizSubst, conta);
				var replace = null;
				var functionName = null;
				var classLink = null;
				if (item.cd_dicionario) {
					functionName = 'openDictionary';
					classLink = 'dictionary-link';
				} else {
					functionName = 'openPronunciation';					
					classLink = 'pronunciation-link';					
				}
				replace = me.format('<span class="' + classLink + '" ng-click=\"' + functionName + '(\'' + item.ds_expressao + '\');\">' + item.ds_expressao + '</span>', me.replaceAll(item.ds_expressao, "'", "\\'"), me.replaceAll(item.texto, "'", "\\'"));				
				texto = me.replaceAll(texto, find, replace);		
			}					

			return texto;
		}	
	}

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
angular.module('dictionaryViewMdl').controller('dictionaryViewSrv', function() {

	var vm = this;

});
angular.module('spacedRevisionMdl').service('spacedRevisionSrv', function($rootScope, dictionarySrv, pronunciationSrv, RevisionRestSrv, uiDeniModalSrv) {

	var vm = this;

	vm.selectExpression = function(controller, index) {
		if (controller.expressions.length > 0) {
			controller.currentExpressionIndex = index;
			controller.currentExpression = controller.expressions[index];
			controller.model.expression.dsExpressao = controller.currentExpression.dsExpressao;
			controller.model.expression.type = controller.currentExpression.cdDicionario != 0 ? 'Dictionary' : 'Pronuciation';		
			controller.model.expression.resultType = controller.currentExpression.cdDicionario != 0 ? 'menu' : 'volume_up';				
			controller.model.expression.learnedRate	= controller.currentExpression.nrLevelOfLearning;
			controller.model.expression.definition = '';
		}	
	}

	vm.showResult = function(controller) {
		//dictionary Result
		if (controller.currentExpression.cdDicionario != 0) {
			//
			if (event.ctrlKey) {
				pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
			}	

			dictionarySrv.definitionGet(controller.currentExpression.cdDicionario).then(function(expression) {
				controller.model.expression.definition = expression;

				var div = $(document.createElement('div'));
				div.html(expression);
				$('.definition-detail-content-content').html('');
				$('.definition-detail-content-content').append(div);
			});

		//pronunciation Result
		} else if (angular.isDefined(controller.currentExpression.cdPronuncia)) {
			pronunciationSrv.listenExpression(controller.model.expression.dsExpressao);
		}

	}

	vm.updateLearnedPercentage = function(controller) {
		var progressBar = controller.element.find('.item-detail-data-progress-bar');
		var progressBarWidth = progressBar.width();

		var sum = 0;
		for (var index = 0 ; index < controller.expressions.length ; index++) {
			sum += controller.expressions[index].nrLevelOfLearning;
		}

		var percentage = sum / controller.expressions.length;
		controller.model.learnedPercentage = percentage.toFixed(2);;
		var progress = controller.element.find('.item-detail-data-progress');
		progress.width(progressBarWidth * percentage / 100);
	}

	vm.markAsReviewed = function(cd_item) {
		return RevisionRestSrv.markAsReviewed(cd_item).then(function() {
			uiDeniModalSrv.ghost('Spaced Revision', 'Item marked as reviewed successfuly!');
		});
	}

	vm.showModal = function(cdItem) {
		$rootScope.selectedCdItem = cdItem;

        uiDeniModalSrv.createWindow({
            scope: $rootScope,
            title: 'Spaced Revision',
            width: '900px',         
            height: '600px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK],
            urlTemplate: 'src/app/shared/spaced-revision/directives/spaced-revision/spaced-revision-modal.htm',
            modal: true
        }).show();  		
	}
	
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
angular.module('dictionaryViewMdl').controller('DictionaryViewCtrl', function() {

	var vm = this;

});
angular.module('spacedRevisionMdl').controller('SpacedRevisionCtrl', function(StringSrv, AppConsts, itemSrv, categorySrv, revisionSrv, dictionarySrv, spacedRevisionSrv) {
	
	var vm = this;

	vm.learnedRate = 60;
	vm.expressions = [];
	vm.currentExpression;
	vm.currentExpressionIndex;	
	vm.model = {
		expression: {}
	};

	vm.model.navigatorStatus = '';	

	vm.navigate = function(number) {
		spacedRevisionSrv.selectExpression(vm, vm.currentExpressionIndex + number);
	}
	
	vm.navigateFirst = function() {
		spacedRevisionSrv.selectExpression(vm, 0);
	}

	vm.navigateLast = function() {
		spacedRevisionSrv.selectExpression(vm, vm.expressions.length - 1);
	}	

	vm.showResult = function() {
		spacedRevisionSrv.showResult(vm);
	}

	vm.changeLearnedRate = function() {
		revisionSrv.setLevelOfLearning(vm.currentExpression.cdDicionario, vm.currentExpression.cdPronuncia, vm.model.expression.learnedRate);
		vm.currentExpression.nrLevelOfLearning = vm.model.expression.learnedRate;
		spacedRevisionSrv.updateLearnedPercentage(vm);
	}

	vm.markAsReviewed = function(cd_item) {
		spacedRevisionSrv.markAsReviewed(cd_item);
		console.log('TODO: FAZER UMA ROTINA NA uiDeniModal para fechar a janela ativa...');
		console.log('TODO: VERIFICAR TAMBÉM O UI-DENI-MODAL... PASSAGEM DO Scope...');		
	}

	if (vm.cdItem) {
		vm.itemImage = StringSrv.format('{0}item/image/get?cd_item={1}&time={2}', AppConsts.SERVER_URL, vm.cdItem, (new Date()).getMilliseconds());

		revisionSrv.getItemInfo(vm.cdItem).then(function(serverResponse) {
			vm.dsItem = serverResponse.dsItem;
			vm.dsBreadCrumbPath = serverResponse.dsBreadCrumbPath;
		});

	} else {
		new Error('Attributes passed in a wrong way!')
	}

});
angular.module('dictionaryViewMdl').directive('dictionaryView', function() {

	return {
		restrict: 'E',
		bindToController: {
			expressao: '='
		},
		controller: 'DictionaryViewCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'srv/app/shared/dictionary-view/dictionary-view.tpl.htm'
	}

});
angular.module('spacedRevisionMdl').directive('spacedRevision', function(spacedRevisionSrv, revisionSrv) {
	
	return {
		restrict: 'E',
		bindToController: {
			cdItem: '@',
			showItemDetail: '@'
		},
		controller: 'SpacedRevisionCtrl',
		controllerAs: 'ctrl',
		templateUrl: 'src/app/shared/spaced-revision/directives/spaced-revision/spaced-revision.tpl.htm',
		link: function(scope, element, attrs, controller, transcludeFn) {

			scope.$watch('ctrl.cdItem', function(newCdItem, oldCdItem) {
				if (newCdItem) {
					revisionSrv.getExpressions(newCdItem).then(function(response) {	
						scope.ctrl.expressions = response;
						spacedRevisionSrv.selectExpression(scope.ctrl, 0);
						scope.ctrl.element = element;
						spacedRevisionSrv.updateLearnedPercentage(scope.ctrl);
					});
				}
			});

			/*
			scope.$watch('ctrl.model.expression.learnedRate', function(newLearnedRate, oldLearnedRate) {
				if (newLearnedRate) {
					revisionSrv.setLevelOfLearning(scope.ctrl.currentExpression.cdDicionario, scope.ctrl.currentExpression.cdPronuncia, newLearnedRate);
					scope.ctrl.currentExpression.nrLevelOfLearning = newLearnedRate;
					spacedRevisionSrv.updateLearnedPercentage(scope.ctrl);
				}
			});
			*/

		}
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
angular.module('VideoMdl').service('VideoSrv', function($timeout, $sce, $compile, $interval, $q, VideoRestSrv, AppConsts, StringSrv, AppSrv) {
	
	var vm = this;

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


	}

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
	}

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

	vm.configWYSIWYG = function(controller, scope) {

		var fnExecSaveButton = function() {
			TextRestSrv.setContent(controller.t07txt.cdTexto, controller.content).then(function(serverResponse) {			
				vm.setContent(controller, scope, serverResponse.data[0].txConteudo);
				controller.editing = false;				
			});	
		}

		var fnExecCancelButton = function() {
			controller.content = controller.contentStored;			
			controller.editing = false;
			scope.$apply();
		}

		controller.options = AppSrv.getConfigWYSIWYG(fnExecSaveButton, fnExecCancelButton);
	}

	vm.setContent = function(controller, scope, content) {
        var panelEditor = $('.text .text-content');                        
		controller.content = content;
        //controller.formatedContent = $sce.trustAsHtml(StringSrv.addLinksDictionaryAndPronunciation(controller.content));
        controller.formatedContent = StringSrv.addLinksDictionaryAndPronunciation(controller.content);
		GeneralSrv.insertHtmlWithController(panelEditor, controller.formatedContent, 'TextCtrl', scope);
	}


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

angular.module('VideoMdl').controller('VideoCtrl', function($scope, $routeParams, $sce, GeneralSrv, VideoSrv, subtitleModalSrv, SubtitleRestSrv, uiDeniModalSrv, pronunciationSrv) {
	var vm = this;
	vm.scope = $scope;

	$scope.name = "VideoCtrl";
	$scope.params = $routeParams;	
	vm.cdItem = $scope.params.cdItem;
	vm.commentaries = '';
	vm.initialCommentaries = '';

    $scope.openDictionary = function(expression) {
    	alert('dictionary');
    }     

    $scope.openPronunciation = function(expression) {
    	alert('Pronunciation - ' + expression);
    }     


	VideoSrv.configElementVideo(vm, $scope.params.cdItem).then(function(t08vdo) {
		vm.t08vdo = t08vdo;
		//vm.commentaries = t08vdo.txComentarios;
	});

	VideoSrv.configGridSubtitles(vm, $scope.params.cdItem);		
	VideoSrv.configWYSIWYG(vm, $scope.params.cdItem);	
	GeneralSrv.getAllExpressions().then(function(response) {
		vm.gridSubtitlesOptions.api.repaint();
	});

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

		SubtitleRestSrv.upd(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(responseServer) {
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

});
angular.module('app').controller('HomeCtrl', function($sce, $scope, $rootScope, $routeParams, $log, $timeout, $mdSidenav, AppConsts, AppEnums, AppSrv, ItemRestSrv, itemSrv, uiDeniModalSrv, ItemRestSrv, StringSrv, spacedRevisionSrv, categorySrv) {
	
	var vm = this;

	var TREEVIEW_ID = '#categoryTreeview';
	var jsTreeInstance = null;
	
	AppSrv.createHamburgerButton(['show-xs', 'hide-gt-xs'], AppEnums.Side.LEFT);

	vm.categoryPath = null;
	vm.currentNavItem = "pageItems";
	vm.currentCategoryNode = null; //Category Node
	
	$.jstree.defaults.core.themes.variant = "large";	

	vm.addCategoryClick = function() {
		categorySrv.add($scope, vm.currentCategoryNode.id).then(function(addedCategory) {
			var newNode = { 
				state: "open", 
				id: addedCategory.cdCategoria,				
				text: addedCategory.dsCategoria,
				data: addedCategory
			};

			jsTreeInstance.create_node(vm.currentCategoryNode.id, newNode, 'last', function(addedNode) {
				jsTreeInstance.deselect_all();
				jsTreeInstance.select_node(addedNode);
			});		
		});
	}	

	vm.editCategoryClick = function() {
		categorySrv.rename($scope, vm.currentCategoryNode.id, vm.currentCategoryNode.text).then(function(renamedCategory) {
			jsTreeInstance.rename_node(vm.currentCategoryNode, renamedCategory);
		});
	}	

	vm.delCategoryClick = function() {
		categorySrv.del(vm.currentCategoryNode.id).then(function(serverResponse) {
			var parentNode = jsTreeInstance.get_node(vm.currentCategoryNode.parent);
			jsTreeInstance.delete_node([vm.currentCategoryNode]);
			jsTreeInstance.select_node(parentNode);
		});
	}

	var _reloadDataGrid = function() {
		if (vm.currentCategoryNode) {
	 		//Items
	    	if (vm.currentNavItem == 'pageItems') {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'item/list?cd_categoria=' + vm.currentCategoryNode.id;
	    	//Revisions
	    	} else if (vm.currentNavItem == 'pageRevisions') {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'revision/list?pendente=true&days=5&cd_categoria=' + vm.currentCategoryNode.id;
	    	//Favorites
	    	} else {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'item/favorite/get?cd_categoria=' + vm.currentCategoryNode.id;
	    	}
					
			$scope.gridOptions.api.reload();
		}	
	}

    vm.isOpenRight = function(){
      return $mdSidenav('left').isOpen();
    };	

  	$(TREEVIEW_ID)
		.on('loaded.jstree', function (e, data) {
			jsTreeInstance = data.instance;
			var categoryToSet = AppSrv.currentCategory || $routeParams.cdCategoria;
			if (categoryToSet) {
				jsTreeInstance.select_node(categoryToSet);
			}	
		})
		.on('changed.jstree', function (e, data) {
		  if (data.node) {
				vm.setCurrentCategory(data);
				_reloadDataGrid();			  
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

		
	var _getTopParentNode = function() {
		if (vm.currentCategoryNode.parent == '#') {
			return vm.currentCategoryNode.id;
		} else {
			return vm.currentCategoryNode.parents[vm.currentCategoryNode.parents.length - 2];
		}	
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
					var miliseconds = time.getMilliseconds();
					var favorite = record.blFavorite ? 'star' : 'star_border';
					var selected = record.blFavorite ? 'selected' : '';
  					var cellTemplate = '<div class="cell-template">\n' +
									   '    <img class="item-image"\n' +
									   '        src="{0}item/image/get?topCategoryNode={8}&cd_item={1}&time={5}" \n' +
									   '    />\n' +                                  
									   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
									   '    <div>{4}</div>\n' +									   
									   '    <md-icon class="material-icons favorite {6}" ng-click="funcaoTeste()"> {7} </md-icon>\n' +
									   '<div>';

  					return StringSrv.format(cellTemplate, AppConsts.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', miliseconds, selected, favorite, topParentNode);
        		}
        	},
        	{
        		width: '32px',
	            action: {
	                mdIcon: 'restore',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						spacedRevisionSrv.showModal(record.cdItem);
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
	                mdIcon: 'delete_forever',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						itemSrv.del(record.cdItem).then(function() {
							$scope.gridOptions.api.reload();
						});	                	
	                }
	            }        		
        	}

        ],
        listeners: {
			onafterload: function(data, options) {
			},

            onafterrepaintrow: function(rowIndex, elementRow) {
				$timeout(function() {
					elementRow.find('.material-icons.favorite').click(function(event) {
						var record = $scope.gridOptions.api.getSelectedRow();
						itemSrv.favorite.set(record.cdItem, !record.blFavorite).then(function(blFavorite) {
							record.blFavorite = blFavorite;						
							$scope.gridOptions.api.repaintSelectedRow();						
						});
					});
				}, 500);
            }
		}			

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

    /*
    vm.setCurrentNavItem = function(currentNavItemName) {
    	vm.currentNavItem = currentNavItemName;
    	_reloadDataGrid();
    }
    */
    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
    	vm.currentNavItem = newCurrentNavItem;
    	if (newCurrentNavItem) {
    		_reloadDataGrid();
    	}
    });


    vm.setCurrentCategory = function(nodeData) {
    	vm.currentCategoryNode = nodeData.node;
		AppSrv.currentCategory = vm.currentCategoryNode.id;

    	var path = '<span class="categoryPathTitle">' + vm.currentCategoryNode.text + '</span>';

    	var parentId = vm.currentCategoryNode.parent;
    	while (parentId != '#') { //# means root node
    		var parentObj = nodeData.instance.get_node(parentId);
    		path = parentObj.text + " / " + path;

    		var parentId = parentObj.parent;
    	}

		vm.categoryPath = path;
    }

    vm.addNewItemButtonClick = function(event) {
    	var topParentNode = _getTopParentNode();
    	var fnNewItem;

		itemSrv.add($scope, topParentNode).then(function(addedItem) {
			$scope.gridOptions.api.reload().then(function(responseData) {
				var cdItemAdded = addedItem.data[0].cdItem;
		        $scope.gridOptions.api.findKey(cdItemAdded, {inLine: true});						
			});
		});
    }


});
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
//CONSTANTS
angular.module('app').constant('AppConsts', {
	SERVER_URL: 'https://denienglishsrv-denimar.rhcloud.com/', 
	//SERVER_URL: 'http://localhost:8087/denienglish/',
	//SERVER_URL: 'http://localhost:8084/denienglish/',
	//SERVER_URL: 'http://localhost:8088/denienglishsrv/',
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
angular.module('app').service('AppSrv', function($q, $resource, $http, AppEnums, AppConsts, uiDeniModalSrv) {

	var me = this;

	me.currentCategory = null; //Category Id	
	
	me.allExpressions = []; //All Expressions (Dictionary plus Pronunciations)
	me.dictionaryExpressions = [];
	me.pronunciationExpressions = [];	
	me.auxiliarMenu = [];

	/**
	 * className is waiting for a array of String considering: hide-x, hide-gt-xs, hide-sm, hide-md...
	 * side is waiting for AppEnums.Side.LEFT | AppEnums.Side.RIGHT
	 * reference: https://material.angularjs.org/latest/layout/options
	 */
	me.createHamburgerButton = function(classArray, side) {
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
	me.getNgRepeatTrackById = function(record) {
		//The first property is gonna be the id property
		var keyField = Object.keys(record)[0];
		//Get the id value
		return record[keyField];
	}
   
	me.getConfigWYSIWYG = function(fnExecSaveButton, fnExecCancelButton) {

		var saveButton = function (context) {
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
		}


		var cancelButton = function (context) {
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
		}

	    return {
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

	}

    me.requestWithPromise = function(relativeUrl, parameters, successMessage, confirmMessage) {
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

    me.requestWithPromisePayLoad = function(relativeUrl, parameters, parametersPayLoad, successMessage, confirmMessage) {
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

	me.getDataURLImagemObjeto = function(prObjeto, prLargura, prAltura, prQualidade) {
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

	me.listenExpression = function(expression, callbackFunction) {
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

});
angular.module('app').controller('AppCtrl', function($scope, $rootScope, $route, $routeParams, $location, AppSrv) {
	
	$scope.$route = $route;
	$scope.$location = $location;
	$scope.$routeParams = $routeParams;		

	$rootScope.loading = false;
	//$scope.auxiliarMenu	= AppSrv.auxiliarMenu;


});