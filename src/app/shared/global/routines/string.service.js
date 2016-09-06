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