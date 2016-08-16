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