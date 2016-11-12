angular.module('uiDeniModalMdl').service('uiDeniModalSrv', function($q, $compile, $templateRequest, $interpolate) {

		var me = this;

		//Privates Variables
		var _defaultWidth = '450px';
		var _defaultHeight = '250px';		
		var _OUTTER_BORDER_COLOR = 'silver';
		var _INNER_BORDER_COLOR = 'silver';		
		var _TEMPLATE_DIALOGS = '<table>' +
			                    '  <tr>' +
			                    '    <td style="padding: 8px; text-align: center; width: 64px">' +
			                    '      <img src="{0}" />' +
			                    '    </td>' +
			                    '    <td>' +
			                    '      <div style="max-height: 80px; overflow-y: auto;">' +
			                    '        {1}' +		                    
			                    '      </div>'	
			                    '    </td>' +
			                    '  </tr>' +		                    
			                    '</table>';	                    

		var _TEMPLATE_PROMPT_MATERIAL = '<div class="template-prompt" layout="column">\n' +		
									    '  <md-input-container flex>\n' +
									    '    <label>{{htmlMessage}}</label>\n' +
									    '    <input type="text" />\n' +
									    '  </md-input-container>\n' +
									    '</div>';

		var _TEMPLATE_PROMPT = '<div class="template-prompt">\n' +		
							   '	<div>\n' +		
							   '		<div class="message">{{htmlMessage}}</div>\n' +
							   '		<input type="text" />\n' +
							   '	</div>\n' +				
							   '</div>';

		var _TEMPLATE_DIALOG_DESCRIPTION_MORE_IMAGE = '<form style="padding:20px;">\n' +
														'<table>\n' +
															'<tr>\n' +
																'<td style="text-align:right;">Description</td>\n' +
																'<td><input style="width:350px;" type="text" name="edtDescription" placeHolder="type the image description"></td>\n' +
															'</tr>\n' +			
															'<tr>\n' +
																'<td style="vertical-align:top; text-align:right;">Image</td>\n' +
																'<td>\n' +
																'	<image crossOrigin="Anonymous" id="imgDialogImageDescription"style="float:left; width:150px; height:150px; margin-top:3px;" />\n' +
																'	<div style="float:left; margin-top:3px">\n'+
																'		<input style="display:none;" accept="image/*" type="file" id="file-2" class="inputfile inputfile-2" /><label for="file-2"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg> <span>Choose a file&hellip;</span></label>\n' +
																'	</div>\n' +
																'</td>\n' +
															'</tr>\n' +			
														'</table>\n' +		
		                                              '</form>';

		var _mousedownPos;
		var _mousemovePos;		
		var _isDraggingWidth = 0; //
		me.isDragging = false;

		/**
		 *
		 */	                    
		me.ICON_DIALOG_CONFIRM = 'data:image/png;base64,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';                    
		me.ICON_DIALOG_INFO = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAO9UlEQVR4nNWaa6wd1XXHf3vPnPc59/3w495rY2NjYxsMCWADAdcQAkRNSlIipZSqRGo/pBVNH0obqa1aUalVJfKhH9pEqZqWSFVbCZpKlAQoJikUXBrj2sb4gd/3ge/z3Hvuec/svfphZs6Z+zDYwJeOtDV75sxZ8/+vx95rrz3w//xQn4SQjj1PxeWpVfoAEmvRNaWDf/Sx3v2RCSwD7QAOSiW16/Yls+nhdDq5LpXPDWitHN839Ua5MlmvNUe9emNCfH8e8AAD2I9D5poJhMAj7boolc10Fm7dtG3D4zfvHN533fqedb0d6WQ64YACEfCM0DCWctWTmYVa7cLo7LkT7158fvzs+D97tdp7QDMic60krolACF4DCaV195pNQ4/vu3fnb9yxY+1IRzapSg1LqW5pGEGh0FqhCEgYEUSEhIaEBt8YZkt1/52T40cOvfnuX5amZl9EpHqtRK6KQEzrDkple9YPfuULP3/7n929c+1g1YPJso/rakZ60ox0p+jOuKRcjaMVWoEVMFaoeZa5qs+F2TpjxTq+sThKqNSacvTE2DtvHHj7G/WFxYNAIyQhHwjsagjEtO7qRGL49n23fverD+7Yj3bVeMmjvyPFbSMF+gsJFIpK0zJfNxRrhqon+FZIaEUuqenOaLrSDpmExoowsdDkfy6UmC030Ahzpap34MDRv7lw7L2nEFkAfEA+yBofSCAGPpnM52595Cv3PnvfLUNrzs95pFMu+7Z0019IUG5YTkzXuTjvU/MFQaEUqFC8ACLhACRCPqHZ3Jvghr4UaVczWqzz09NFynWPpudx+MiFg28d+NlXxfcnQhJXdCnnKsCnMt1dD/7Kr97/3G03DPacmm5w03AH92/rQSnFa+crvDFaZapi8UShlAatUUqjtCJgEjYUIoq6EcZLHu9O1ql6hq39GW4aylNtCtNlj4G+jqF8X/fnRs9NvCDWlgHbGHv12gikhvYHmi/kb3/sl/c/u31DT/7sTJOHdvWzfW2ek1N1fnSqxFzNIkqjdAhYa5RSId44eBAUQrtvLEwu+pyYrNGbc7l5KE8u6XJ+pkZHR7Y/19P12dFzE89jbTk1tF9WI7EqgY49TykgoVx3+PNfvudHt24d6D474/GlT61hXXeKA+8tcmi8GrqKg9IKpRQoHZ6X9WOeGrhT2MLrpi+cnqohItwylKc7l+T05QqFjky/JFI3T41e/jegmRrav8ISKwiEruOiVOdNd+1+5uE7N+88Pd3gi7cMsq47zfPH5zkz04TQVSKwqDaJqJ90NfmkwrdgpD1jWQliQgTEBtfWwmixQa1p+NRInkzS4cxUjZ6e/MapuaqtFhcOAv5yS+hVDKCBVOfagcc+d/fWfedmG9yxuZuNfRleOjHP2ZkGlgCMjWkxuKda12vzmq/fkuLrt6T59d1pOlI6pn0JQIsEpCSSp3h7tMKb50vsHulgx/oCKM2n9974DTeT2QUkWTbwLCEQaV85zpo77t75h6K0yqYS7Nncyf+OVTg2UQ1frMJzoLmoL62z4oHrEmTc4F2dKcW9I4kWaUvs/y0y7fbamUUuzTV4YFc/+XSCdDqZvn73DX8BZAEnlsassIAGUr0j635tx3V9faPFBp/fPUC5YXn5RBETgjUiAfDQNYyV9v0QVNJZOkKnnPbz1soSBcTvGQHfwL8engHgwZsGsSg2XLfmrmQhvxdIxK3QIhCyclC6a9uuTU9Um5bh3ixrOlP8+PgcdU9aYI0VjMQbGBv7zcJrYx4SzqPGwutjXqiA8HmJ5ICxNgBu27/N13xef2+Bbevy9ORTKMfR67du+C0gHccdt4ACkunOwmdG1nYOXF5osm97L7Nlj3cnKoGWYtpvv1wC7YXAjQ1m359NePz12zWeO9Xgrw7VOFs0wX+MLFVCpPmWjOga3ji7QMOz3LOtDyuwdnjgM8p11wFu5EbuCvcZXvNLSdfBV5qh7gwvHJvF8wXtCiiLKAcIxn7BImgEQWPRKKxotLYopZiqWhYalpoHvrFB8FpBrG2RtiGp5X1jBc8zHBldZNdQAVdrEolEOtPddV91euYiQQYregkBpXJ9gz2fLtUNN6zNg4Ijo4v4oVZ9I/jGtvotjZroN8FYi28smzo139qb5Q/25vjm3iy9aRU8Y21bng3kRXL8EHggB3wLB88tkEk6rO/JYAW6BnsfAlKR9+glo08isS6fT/eVaj47hjqYq/gUK34gOGb6CLxvbKuZVl/wjPBzG5Kk3SAbLSQVe4cSwXO+tJ6LQLeVYtskbEBsbK5O3bPcONSBsUKhu7ALpTIR9siFFOC46dQm13WchmcZ7ExxcbaGZywOCkEQLBpwRAV90WixaAElCi0KZUEpRWLZFJnU4PsWK4KIDSYwa4MWWsFaCfrGBq5kLMYYphebbOjLYiwk0sk+tO7CmBnAW0LASSaHRUAU5FIuY3NBzi4oNApBo0UwjkFZjdKCUhrtCI7WaK1wtKCUao1A0WFF8FpxEJ4NsVgIgLcIGYs1gjGWyfkGG/oyWBGU0gntur3WmHMde55aEsSOk0r1N31LKqVwtGKu7AWaUIIxBs8aDCoEHQDWut1XKrxWwTIyfoiA5wfAxbYDOgK/xBJGWuCtEYpVj63JXDAAgEaRD11IxQkoFGnPNySSQc5YbfrM1zw8a1Ba4zgBWEdHSVk7dRCrUFphbWSBpQTqnmWu4uEqcHUgX6IRSUJ3CUkE1mi7VMOzOEq1gl1pp5VSxAnge6be8CyqYfAsNHyhUjc4bkg3TCxV5HTRhCggWgVxEKxkVriQiNBoGuoi2DAd1QiuAq2CScZGw6uJXMpgjeBo1QryetPHGuNFcuMExK83pqcW6qTqQtO39OUTgYZMAFTFsoOWBcLkTNlgES9hCi0scyEbuISEi3trg2CuhcDFBqsFHZILAt1ijaEr61Kp+yxUmlQqTYOVaghhCQErnjfu+wa0YaHqsbEvi7U2TJGjJaFta71FIPB/G5JoOf0S4UEctcELEtf6ilgI3ckY+jpSTBRrNJoG3/c9MWZuOQEBjG02L/m+8ZRjEhcmy2xeWwhfaGJQVCst1qJCjbZXYdaqVUchEcH4JpZOtwlEI1NrGI3FQtJRDHameePEFFoJfqM5gzWLhFWL+ExsMP6U32jMWmN4/eQUvYUUvbnEEs20mwlHCYvxDSa8NuH18iAWCWddY5a09rgftmUW2TyQJZXQHDw9jUbwK9VjBGUXA+FsFtZfDCJVr7R40BjLW6dnMMay78a+lS9ptTjokEhIZvkRxIBpz9x+e/aOy2wpyAbkHto9SKna5MxEKfj/wsKLBHmQbREIDx+o+8XiD60xzJZqHLs0z8O7B3FUbNa0gZZWar9NJkrcVrpQnGQko20Ju4xEIe2wZ0sPrx6bRKyhVmtWbaX8ZmiBFQQEqEu99rZfr79vjOGZA2fpLaTYt70PGzO3NaY1c66wiG8wvl09BuIWi5FuybWh3PD86J4hHEfzL6+fJ+UoanPzr2HtdGgBWU7AAk1Eis2ZmWesMRy9MMfRi0W+tn8j+aQOBF/JnULgLWDWLiHg+atbK+46ce2v707zxdvW8vLhCYqlGtVaw/iz038LlAEvKju2CISVLx8o24X5Z/16fdL4Pk//8DiZpMOTD1+PRNpZrsWWS5gWmReOzsZWZMILx2ZjsWKXWLQVvCaQ7yjhW49so1r3+e6LJ8klNaXpuf+URuMYUIsCGJaVVVJD+yN7Yz2vpPOF+0s1X9U9yy/u3UC14XN8tBTYLl7Yieo8UalEhGNjZQ6cKPKTU/N859VxjlxaDFKGcNJq9+2SlAJr+c0Hr+f263v40386wnSxQqlcq1YvXfptrD0XWsBEpZUlBBpjr5Ia2h9AajYnJZncppKpTSfHSqztyfLonSPMlBq89/5iuzi1HLwNztYK06Um56dqzJa9cNy37XOLRHsOUFZ4Yv9GvrxnmO+/coZXDo+R1FZmz1/6tlSrLwFFoBmvWq8obIVWCMo1lcpxlct/Vjm6479Pz7JlfSeP3jmCMcI7F+fDNYK0LNImIiuurYSajkCHE5lIMGK5Gp58eAtf2jPMc29e5O//4xRdWYfxS5dfNtPTTwNTQDWu/VUJxKxgEGnaSvmoyhXuE6WyPz0+yUBXhkfv2sAN6wscOjtHrWECsJFb0Qa9WmunETZ0IVjfnebPH7uJPVt7+YcDZ/i7l07Rl3MYHZs55k2MfxORUWAR8JdXqVetjbbcCHysLdly+TC53D5B5f7rxDSXi3V+Yc8wj9wxjBXh3PuLND2z1JVWJRD5f3DuyiT42v6N/P4j20kmNH/8j4d5+e1R+nIul8Zm3mmOXnoy9Pt5wqFzeW30ivsDrRppUA3rw03c7K4f+rabyWzUjktfZ4bfeWQne7cNUG34vHJ0kn8/NMHF6SpN315JLOmEZsvaAl+4fT13b+/H0YofHxrnOy+cwFGWlIOMX5r8iXf5/T8Jwc8Bda6wR/BhGxzRDmQG6EXrTbp/4Pfczq4HEq7rWKXZMFjgifu3cue2AdJJh8W6x/hsjdGZClMLDTxjSbmaNd0ZhvuyrOvJkE25LFY9Dhyd4AcHzrBQrtNXSFJcqNaLoxPfswvzP0BkgiBoG4C50gbH1WwxKYL5Ig10AQMqnblTDwz+biKT2ZhIuMoIpJIuO0Z6uOvGQW4c6aK/I0Uy4eA6Gt+31D3D5WKNYxfmeOPEFKfH53EUdGddag3PTF+efcubnHwa3zsJTAMlwpznI28xxUgQkkgCOaAbpdaoTPYe3dP7uJvNbkmnXEcrjRdW54BwfaxaY76jFemEJpcK1s2lcqO+MDt/yMzMfF+ajSPADIG/V/mQraVrIhAjEewNB4WlPNAB9JBIbFb5wj6dze1x0umNyaSbS7iOcqPFPq102jTqzVK9XDllFsuvSbX8OsaMh6AXQuBRovaBm3vXTCBGAgJrOAQWyYYtD+RQqoDj9OK4vUqpLFqnxJo6Iov4/gzWziJSAeKtTnuz+6qAfyQCq5CJgtwlKHsnw5YI7+nwGQnB+QSfGDTD5oX3rlrjnxiB6IgRIQQctSj4YflGTnu3SeDjffDxiXytEh3xnZMPOz7uVyrR8X8rzdIJeIToZwAAAABJRU5ErkJggg==';
		me.ICON_DIALOG_WARNING = 'data:image/png;base64,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';
		me.ICON_DIALOG_ERROR = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFNklEQVR42u2YbWyTVRSAzz3turGgmYngBybqD7cwDGsLG7IhY/wANSI6205dppCJbCSoMRrQhW3IEKIhQYmTRZxhKG7tzCJgnPxQh3xvvK1fIMQPjAbFaBbZHPvqPZ62OtK1696+b7t2iefPbu9777n3Offcc8+ZgEkuItEbSEoAaTNPI8R6bt7n+41EH0DK8Gqx96vuSQHgtVn3IcKyICiQbQanpzjpAWSJdYkg+DjcNwJYjE7l06QFoMJCo5ze40EBs8LCAXhwpjJHbPQ1kxBA2qyVAqE+IiTAKj6FXUkHQMtzMmSq4RwCTIsIKemiSE3JxHdPXkoqAK/Duo03/4yasRJoq8Hpfj5pAGSx+TYy4tcMYFI1Xsp+NNBM0fLF+aQA8NosbYji/qgmEbmEy+1IOIB0WItYySda5pKAhdiifJ4wALLbDRK+VzhsztYET9CF2co8PWFVJ4D1CdbQEPIhfSoHyyqAvKLA764OgIZNAH29oToIVqBL2T3hALI072oaGDrHvn9dyMentgDkLwnuO9IO8FpVqB4JF1D0ZwnX6V7QIJoByGHdyn/Whf34zjGAlFEBabAfoKwgvDEI6gwuZcOEAUjb7FsJjWc4bKaGHdByKvzEh/N4sjdUH8jLQhizsKXr5wkB4GyzlbPNB8cc0MC5XMa1wX0+/19ZOLZRAN4zOJVH4g7A2eadnG0eijjoxUaArJzgvh+/BVhfGgmAhKQCbHUfixsA1QDKb8ydiGiNOHDtZoAFdwX3neSnYttzkY1D8gS6PPOFP+eLA4B0WFYKEI3jDiypBCh+PLhv/x6+3NvHN5KEUmxV9sYcgOzZU6UwcbaJN4w7eDFnFatHBZW3OGgddI1vJIBfsE9kiQOn+mIKwNlmHUedKlWDZ80FqB71vm1Zy+XMUXXGAqjlmmFjzABkseVmMhKHTZyiagfTZwDs2Bfc9zSXw7/+pGo6P25/CyNlYrP7QkwA2PrNbP0SVav7BA3s72xtg3FkR1CWDzA8pFoFP25N/Lg9phtA2izzCcURjDbk7tjPJ3FjoP3nRYA190Q13R9WQc5Dp6dTMwD7ouDIcxxB5EW1uk827AS4PTfQPqOwV6+KWgW/0IcZYGGksBoRgK1fJlA0Rb2yTyqqAYqWB9odBwDqazSp4Wy1hLNVZ9QAdO+cdJlOZ9l1btK08gPlAA+tCbSdfBrvv6lJDV+f8wJM2dh6/HJUAFxp1fDHWk2r+mTB3fwi1wXar/NpHPpQsyo+hSo+hZdUA0hbzgy+uL5HK13zqplcpG16O9Cu5tM469GsSgL1IBkzhavzN1UAHDab2HXKNK/ok2s4G935738YK5YCdP+hSx1HpUbOVsvHBZAOcy4Bnog6bMZZ+C5IYcS52NzlHhPAHzbt1sNcpOfrWs2UBlC+/kpZefRgIBfyVWX6pEM4lUVjAvDmHUJAi25zVdYCLFoW3PcZP2xv1OpWzdlqMWerbSEA0nbHFILB01xp3aJ7lT2cRphGVZuDAwCPFvhDih5hT/pBXOrNxvbvBoIB7NYX2PqbdW8+EkCZPs/8TwhoHTrdL48AkD33eimGOWyKq2KyQhxdKCDyLxqSmdj25e9+AA6buzjqlOtVOyLxu8RXEAgaOFut4GTNnEMSFfZ9jJn2CRC+C14h0SK8NnM7F+lLE70hTRAEHwmvwzyM/gpk8on/FNj/u9l3MhK9GW0A1MMAllc4+jyb6M1oAiC5XZA92yRF2qucbKzgu5CW6E2p2riU/SBwN0L/k0mVsGmR/wESLf8AUDTOtcRWYicAAAAASUVORK5CYII=';		
		me.ICON_DIALOG_CHECK = 'data:image/png;base64,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';

		/**
		 *
		 */
		me.BUTTON = {
			YES: 1,
			NO: 2,
			OK: 3,
			CANCEL: 4,
			CLOSE: 5
		};

		/**
		 *
		 */
		me.POSITION = {
			TOP_LEFT: 1,
			TOP_CENTER: 2,
			TOP_RIGHT: 3,

			LEFT: 4,
			CENTER: 5,
			RIGHT: 6,

			BOTTOM_LEFT: 7,
			BOTTOM_CENTER: 8,
			BOTTOM_RIGHT: 9
		};

	    var _format = function() {
	        var formatted = arguments[0];
	        for (var i = 1; i < arguments.length; i++) {
	            var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
	            formatted = formatted.replace(regexp, arguments[i]);
	        }
	        return formatted;        
	    }

	    //TODO: Today it is working just for Angular Material. Implement to the others
	    /*
	    var _getFormData = function(form) {
	    	var dataReturn = {};

			var formElements = form.find('md-input-container,md-datepicker,md-checkbox');  //TODO: for while, it works just in Angular Material
			for (var index = 0 ; index < formElements.length ; index++) {
				var element = $(formElements[index]);
				var tagName = element.get(0).tagName.toLowerCase();

				if (tagName == 'md-input-container') {

					//Is a Input?
					var input = element.find('input');
					if (input.length > 0) {
						var name = input.attr('name') || input.attr('ng-model');
						dataReturn[name] = input.val();
					} else {	
						//Is a Select?
						var select = element.find('md-select');
						if (select.length > 0) {
							var name = select.attr('name') || select.attr('ng-model');
							dataReturn[name] = select.find('md-select-value').text().trim();
						}
					}

				} else if (tagName == 'md-checkbox') {
					var name = element.attr('name') || element.attr('ng-model');
					dataReturn[name] = element.is('.md-checked');

				} else {
					console.log('It should\'nt has entered here');	
				}
			}

			return dataReturn;
	    }
	    */


		/**
		 *
		 */
		me.createEmptyWindow = function(config) {
			var config = config || {};
			
			///////////////////////////////////////////
			//setting default values
			///////////////////////////////////////////			
			config.modal = config.modal === undefined ? true : config.modal;			
			config.destroyOnClose = config.destroyOnClose === undefined ? true : config.destroyOnClose;
			config.width = config.width || _defaultWidth;
			config.height = config.height || _defaultHeight;
			///////////////////////////////////////////
			///////////////////////////////////////////			

			var objWindow = document.createElement('div');
			var $objWindow = $(objWindow);
			$objWindow.css({
				display: 'none',
				'font-family': 'arial',
				'font-size': '12px',
			    width: config.width, 
			    height: config.height,
			    position: 'fixed',
			    'border': 'solid 1px ' + _OUTTER_BORDER_COLOR,
				'z-index': 998
			});

			$objWindow.keydown(function(event) {
				var key = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
				if (key == 27) {  // 27 is the ESC key
					objWindow.close('cancel');
				}
			});


			if (config.modal) {
				var background =  document.createElement('div'); 
				document.body.appendChild(background);

				var $background = $(background);
				$background.css({
					id: 'wndBackground',
				    display: 'none', /* Hidden by default */
				    position: 'fixed', /* Stay in place */
					top: '0px',
    				left: '0px',				    
				    'z-index': 997, /* Sit on top */
				    'padding-top': '100px', /* Location of the box */
				    width: '100%', /* Full width */
				    height: '100%', /* Full height */
				    //overflow: 'auto', /* Enable scroll if needed */
				    'background-color': 'rgb(0,0,0)', /* Fallback color */
				    'background-color': 'rgba(0,0,0,0.4)', /* Black w/ opacity */
				});
				
				background.appendChild(objWindow);
			} else {
				document.body.appendChild(objWindow);				
			}

			var _setFocusFirstInput = function() {
				var firstInput = $objWindow.find('input').eq(0);
				if (firstInput.length > 0) {
					firstInput.focus();
				}	
			}

			var deferred = $q.defer();			
			objWindow.show = function() {	
				$objWindow.focusout(function() {
					if (!event.relatedTarget) {
						_setFocusFirstInput();
					}
					//console.log(event.srcElement.tagName + '-' + event.target.tagName + '-' + event.relatedTarget.tagName);
				})

				try {
					//Show the window					
					if (config.modal) {					
						$background.css('display', 'block');
					}	
					$objWindow.css('display', 'block');						

					//Position Adjust
					_setWindowPosition(me, objWindow, config.position);

					////////////////////////////////////////////////////
					//onshow event
					////////////////////////////////////////////////////			
					if ((config.listeners) && (config.listeners.onshow)) {
						config.listeners.onshow(objWindow);
					}
					////////////////////////////////////////////////////
					////////////////////////////////////////////////////			

					setTimeout(function() {
						_setFocusFirstInput();					
					}, 500);
				} catch (e) {
					deferred.reject(e);
				}	

				return deferred.promise;
			};
			objWindow.close = function(responseButton) {
				var validData = true;

				var form = $objWindow.find('form');
				if (form.length > 0) {
					var validData = ((responseButton == 'cancel') || (form.get(0).checkValidity())); //When there is a form, a validation must be done.									
				}

				if (validData) {
					var canclose = true;
					var jsonResponse = {
						button: responseButton,
					};
					if ((responseButton !== undefined) && (responseButton !== 'cancel') && (responseButton !== 'no')) {
						////////////////////////////////////////////////////
						//oncanclose event
						////////////////////////////////////////////////////
						if ((config.listeners) && (config.listeners.oncanclose)) {
							canclose = config.listeners.oncanclose(objWindow);
						}
						////////////////////////////////////////////////////
						////////////////////////////////////////////////////			
						
						if (canclose) {
							if (objWindow.getData) {
								jsonResponse.data = objWindow.getData();
							}

							/*
							if (form.length > 0) {
								jsonResponse.form = {};
								jsonResponse.form.data = _getFormData(form);
							}	
							*/
						}	
					}	

					if (canclose) {
						//Close the window					
						if (config.modal) {			
							if (config.destroyOnClose) {
								document.body.removeChild(background);
							} else {	
								$background.css('display', 'none');
							}	
						} else {
							if (config.destroyOnClose) {
								objWindow.remove();
							} else {	
								$objWindow.css('display', 'none');
							}	
						}	

						deferred.resolve(jsonResponse);
					}	
				}	
			};


			return objWindow;
		}

		/**
		 *
		 */
		me.createWindow = function(config) {
			var config = config || {};

			////////////////////////////////////////////////////
			//UI-DENI-MODAL
			////////////////////////////////////////////////////			
			var objWindow = me.createEmptyWindow(config);
			var $objWindow = $(objWindow);
			$objWindow.addClass('ui-deni-modal');
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			

			////////////////////////////////////////////////////
			//HEADER
			////////////////////////////////////////////////////			
			var divHeader = $(document.createElement('div'));
			divHeader.addClass('deni-modal-header');			
			divHeader.html(config.title);
			$objWindow.append(divHeader);
			divHeader.mousedown(function() {
				_mousedownPos = {
					x: event.x,
					left: $objWindow.offset().left,
					top: $objWindow.offset().top,					
					y: event.y
				}
			});
			divHeader.mousemove(function() {
				if (_mousedownPos) {
					_mousemovePos = {
						x: event.x,
						y: event.y
					}

					var differenceX = _mousemovePos.x - _mousedownPos.x; 
					var differenceY = _mousemovePos.y - _mousedownPos.y; 				
					me.isDragging = ((Math.abs(differenceX) > _isDraggingWidth) || (Math.abs(differenceY) > _isDraggingWidth));

					if (me.isDragging) {
						divHeader.css('cursor', 'move');
						var newLeft = _mousedownPos.left + differenceX;
						var newTop = _mousedownPos.top + differenceY;
						$objWindow.css({
							left: newLeft + 'px',
							top: newTop + 'px'
						});	
					}
				}	
			});
			var _removeDragging = function() {
				me.isDragging = false;
				_mousedownPos = null;
				divHeader.css('cursor', 'default');
			}

			divHeader.mouseup(function() {
				_removeDragging();
			});
			divHeader.mouseleave(function() {
				_removeDragging();
			});
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			


			////////////////////////////////////////////////////
			//CONTENT
			////////////////////////////////////////////////////			
			var divContent = document.createElement('div');
			var $divContent = $(divContent);
			$divContent.addClass('deni-modal-content');
			

			if (config.htmlTemplate) {
				if (config.scope) {
					var element = $compile(config.htmlTemplate)(config.scope);
					$divContent.append(element);
				} else {
					$divContent.html(config.htmlTemplate);
				}	
			} else if (config.urlTemplate) {
				$templateRequest(config.urlTemplate).then(function(template) {
					var element = $compile(template)(config.scope);
					$divContent.append(element);										
				});	
			}

			objWindow.appendChild(divContent);
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////			


			////////////////////////////////////////////////////
			//BUTTONS BAR
			////////////////////////////////////////////////////			
			var divButtonsBar = $(document.createElement('div'));
			divButtonsBar.addClass('modal-buttons-bar');
			_createButtons(objWindow, divButtonsBar, config.buttons);
			$(objWindow).append(divButtonsBar);
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////

			return objWindow;
		}

		/**
		 *
		 */
		me.confirm = function(htmlMessage) {
			return _createDialog({
				title: 'Confirmation',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_CONFIRM, htmlMessage),
	        	buttons: [
	        		me.BUTTON.YES,
	        		me.BUTTON.NO	        		
	        	],
			});
		}

		/**
		 *
		 */
		me.info = function(htmlMessage) {
			return _createDialog({
				title: 'Information',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_INFO, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}


		/**
		 *
		 */
		me.warning = function(htmlMessage) {
			return _createDialog({
				title: 'Warning!',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_WARNING, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}

		/**
		 *
		 */
		me.error = function(htmlMessage) {
			return _createDialog({
				title: 'Error!',
	        	htmlTemplate: _format(_TEMPLATE_DIALOGS, me.ICON_DIALOG_ERROR, htmlMessage),
	        	buttons: [
	        		me.BUTTON.OK	        		
	        	],
			});
		}

		/**
		 *
		 */
		me.prompt = function(htmlTitle, htmlMessage, initialText, material, scope) {
			var deferred = $q.defer();

			var template = material ? _TEMPLATE_PROMPT_MATERIAL : _TEMPLATE_PROMPT;
			template = $interpolate(template) ({htmlMessage: htmlMessage});

			var wndPrompt = me.createWindow({
				scope: scope,
				title: htmlTitle || 'Enter a text',
				width: '470px',			
				height: '140px',
				position: me.POSITION.CENTER,
				buttons: [me.BUTTON.OK, me.BUTTON.CANCEL],			
				htmlTemplate: template,
				modal: true,
				listeners: {
					onshow: function(wnd) {
						var input = $(wnd).find('input');
						input.val(initialText);

						$(wnd).keydown(function() {
							var key = event.which || event.keyCode;  // Use either which or keyCode, depending on browser support
							if (key == 13) {  // 13 is the RETURN key
								wnd.close('ok');
							}
						});
					}
				}
			})

			wndPrompt.show().then(function(msgResponse) {
				if (msgResponse.button == 'ok') {
					var input = $(wndPrompt).find('input');
					deferred.resolve(input.val());
				} else {
					deferred.reject();
				}
			});

			return deferred.promise;
		}

		/**
		 *
		 */
		 me.ghost = function(htmlTitle, htmlMessage, iconDialog, position) {
		 	position = position || me.POSITION.TOP_RIGHT;
			var objWindow = me.createEmptyWindow({
				position: position || me.POSITION.TOP_RIGHT,
				width: '280px',
				height: 'auto',
				modal: false
			});

			var $objWindow = $(objWindow);
			$objWindow.css({
			    'background-color': '#323232',
			    //'background-color': '#000',
			    'border-color': _OUTTER_BORDER_COLOR,
			    'border-radius': '3px',
			    'box-sizing': 'border-box',
			    'font-size': '12px',
			    padding: '10px',
			    'box-shadow': '-5px 5px 10px silver',
			    'border-radius': '10px',
			    'z-index': '999',
			    //color: 'white',
			    color: 'white',
			    opacity: 0.7
			});

			//TABLE
			var tableContent = document.createElement('table');

			//ROW
			var rowContent = tableContent.insertRow();

			//CELL IMAGE
			var cellImg = rowContent.insertCell();
			cellImg.rowSpan = 2;
			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				'margin-right': '8px'
			});
			imgDlg.src = iconDialog || me.ICON_DIALOG_CHECK;
			cellImg.appendChild(imgDlg);

			//CELL TITLE
			var cellTitle = rowContent.insertCell();			
			$(cellTitle).css({
				'font-weight': 'bold',
				height: '10px',
				padding: '2px 2px 5px 0px',
			    'font-size': '14px',
			    'font-weight': 'bold',
			    'border-bottom': 'dotted 1px #8bb0da'
			});
			cellTitle.innerHTML = htmlTitle;

			//CELL MESSAGE
			var cellMsg = tableContent.insertRow().insertCell();
			$(cellMsg).css({
				'vertical-align': 'top',
				'padding-top': '5px'
			});
			cellMsg.innerHTML = htmlMessage;

			objWindow.appendChild(tableContent);
			
			objWindow.show();
			
			var top = $objWindow.position().top;				
			if ((position == me.POSITION.TOP_LEFT) || (position == me.POSITION.TOP_CENTER) || (position == me.POSITION.TOP_RIGHT)) {
				$objWindow.css('top', '-' + $objWindow.height() + 'px');
			} else if ((position == me.POSITION.BOTTOM_LEFT) || (position == me.POSITION.BOTTOM_CENTER) || (position == me.POSITION.BOTTOM_RIGHT)) {
				$objWindow.css('top', ($objWindow.position().top + $objWindow.height()) + 'px');
			}
			$objWindow.animate({top: top});
			$objWindow.fadeIn('slow');


			setTimeout(function() {
				//$objWindow.fadeOut('slow');
				objWindow.close();
			}, 2500);
		 }

		/*
		 *
		 *
		 */
		 me.createWaiting = function(htmlMessage) {
			var objWindow = me.createEmptyWindow({
				width: 'auto',
				height: 'auto'
			});

			var $objWindow = $(objWindow);
			$objWindow.css({
				//'height': '150px',				
				'width': '330px',				
			    'background-color': 'white',
			    'border-color': _OUTTER_BORDER_COLOR,
			    'border-radius': '3px',
			    'box-sizing': 'border-box',
			    //padding: '10px',
			    'box-shadow': '10px 10px 5px #888888',
			    'border-radius': '10px',
				'text-align': 'center',			    
			});

			var divMsg = document.createElement('div');
			var $divMsg = $(divMsg);
			$divMsg.html(htmlMessage);
			$divMsg.css({
				'padding-left': '20px',
				'box-sizing': 'border-box',
				'padding-right': '20px',
				'margin-top': '10px',
				color: 'rgb(42,103,131)',				
				'line-height': '14px'
			});
			objWindow.appendChild(divMsg);

			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				width: '290px',
				//height: '14px',				

				'box-sizing': 'border-box',		
				'margin-top': '25px',
				'opacity': '0.5',
				'margin-bottom': '5px',
				//'border': 'solid 1px red'
				//border: 'solid 1px green',
			});
			imgDlg.src = "data:image/gif;base64,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";
			objWindow.appendChild(imgDlg);

			/*
			//TABLE
			var tableContent = document.createElement('table');
			$(tableContent).css({
				width: '100%',
				height: '100%',				
				border: 'solid 1px green',
				color: 'black'
			});

			//CELL IMAGE
			var cellImg = tableContent.insertRow().insertCell();
			$(cellImg).attr('height', '50px');
			//cellImg.rowSpan = 2;
			var imgDlg = document.createElement('img');
			$(imgDlg).css({
				width: '100%',
				height: '100%',
				border: 'solid 1px orange',
			});
			imgDlg.src = "/totalenglish/assets/images/loading.gif";
			cellImg.appendChild(imgDlg);

			//CELL MESSAGE
			var cellMsg = tableContent.insertRow().insertCell();
			$(cellMsg).css({
				'border': 'solid 1px red',
				'vertical-align': 'top'
			});
			cellMsg.innerHTML = htmlMessage;

			objWindow.appendChild(tableContent);
			*/

			return objWindow;
		}


		var _getDataURLImagemObjeto = function(prObjeto, prLargura, prAltura, prQualidade) {
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


		/**
		 *
		 */
		 me.createWindowDescriptionMoreImage = function(config) {
		 	config = config || {};		 	
		 	$.extend(true, config, {
				width: '500px',
				height: '280px',	
				'box-sizing': 'border-box',
				position: me.POSITION.CENTER,
				modal: true,
				title: config.title || 'Choose a image',
	        	htmlTemplate: _TEMPLATE_DIALOG_DESCRIPTION_MORE_IMAGE,
		        buttons: [
		        	me.BUTTON.OK,
		        	me.BUTTON.CANCEL	        		
		        ],
		        listeners: {
		        	onshow: function(objWindowShowed) {
		        		var $objWindowShowed = $(objWindowShowed);
		        		var $descriptionEdit = $objWindowShowed.find('input[type=text]');
				        setTimeout(function(){
				        	$descriptionEdit.val(config.description);
				            $descriptionEdit.focus();
				        }, 10);

						//Seta o evento change para o file input
						var $fileInput = $objWindowShowed.find('input[type=file]');
						var $img = $objWindowShowed.find('img');						
/*
						if (config.imgEl) {
							var image = _getDataURLImagemObjeto(config.imgEl.get(0), 150, 150, 0.5);
							$img.attr('src', image);
*/
						if (config.imgSrc) {
							$img.attr('src', config.imgSrc);
						}	
						$fileInput.change(function(event) {
							$img.attr('src', URL.createObjectURL(event.target.files[0]));
						});
		        	},
		        	
		        	oncanclose: function(objWindowCanClose) {
		        		var $objWindowCanClose = $(objWindowCanClose);

						var $descriptionEdit = $objWindowCanClose.find('input[type=text]');
						if ($descriptionEdit.val().trim() == '') {
							me.info('You must fill the description field!')
								.then(function() {
									$descriptionEdit.focus();
								});

							return false;
						}
			
						//Consiste se a imagem foi preenchida
						var $img = $objWindowCanClose.find('img');
						if (!_isImageOk($img[0])) {
							me.info('You must fill the image field!');
							return false;						
						}
						
						return true;
		        	}	
		        }
		 	});

			var objWindow = me.createWindow(config);

			objWindow.getData = function() {
				var form = $($(objWindow).find('.deni-modal-content').find('form'));
				var descriptionEl = form.find('input[type=text]');
				var description = descriptionEl.val();
				var imageEl = form.find('img');
				var fileEl = form.find('input[type=file]');

				return {
					description: description,
					imageEl: imageEl,
					fileEl: fileEl
				};
			}

			return objWindow;
		}	


		/**
		 *
		 */
		function _createDialog(config) {
		 	config = config || {};		 	
		 	$.extend(true, config, {
				width: '430px',
				height: '140px',
				position: me.POSITION.CENTER,
				'box-sizing': 'border-box',
				modal: true,
				listeners: {
					onshow: function(wnd) {
						$(wnd).find('button')[0].focus();
					}
				}
			});

			var objWindow = me.createWindow(config);

			var $objWindow = $(objWindow);


			var $table = $objWindow.find('table');
			$table.css({
				height: '100%',
				width: '100%'
			});

			var $td = $table.find('td');
			$td.css({
				padding: '4px',
				//'vertical-align': 'top'				
			});


			var $tdImg = $table.find('td:nth-child(1)');
			$tdImg.css({
				//border: 'solid 1px orange',
				'text-align': 'center'
			});

			var $img = $table.find('img');
			$img.css({
				//border: 'solid 1px orange',
			});

			var $tdMessage = $table.find('td:nth-child(2)');
			$tdMessage.css({
				//border: 'solid 1px green',
				//'padding-top': '15px'
			});

			return objWindow.show();
		}

		/**
		 *
		 */
		function _setWindowPosition(me, targetWindow, position) {
			var $targetWindow = $(targetWindow);
			var margem = 2;
			var shadow = 10;
			position = position || me.POSITION.CENTER;

			//HORIZONTAL LEFT
			if ((position === me.POSITION.TOP_LEFT) || (position === me.POSITION.LEFT) || (position === me.POSITION.BOTTOM_LEFT)) {
				$targetWindow.css('left', margem + 'px');				
			//HORIZONTAL CENTER
			} else if ((position === me.POSITION.TOP_CENTER) || (position === me.POSITION.CENTER) || (position === me.POSITION.BOTTOM_CENTER)) {
				$targetWindow.css('left', (window.innerWidth / 2 - targetWindow.offsetWidth / 2) + 'px');
			//HORIZONTAL RIGHT
			} else if ((position === me.POSITION.TOP_RIGHT) || (position === me.POSITION.RIGHT) || (position === me.POSITION.BOTTOM_RIGHT)) {
				$targetWindow.css('left', (window.innerWidth - targetWindow.offsetWidth - margem - shadow) + 'px');
			}

			//VERTICAL TOP
			if ((position === me.POSITION.TOP_LEFT) || (position === me.POSITION.TOP_CENTER) || (position === me.POSITION.TOP_RIGHT)) {
				$targetWindow.css('top', margem + 'px');				
			//VERTICAL CENTER
			} else if ((position === me.POSITION.LEFT) || (position === me.POSITION.CENTER) || (position === me.POSITION.RIGHT)) {
				$targetWindow.css('top', (window.innerHeight / 2 - targetWindow.offsetHeight / 2) + 'px');
			//VERTICAL BOTTOM
			} else if ((position === me.POSITION.BOTTOM_LEFT) || (position === me.POSITION.BOTTOM_CENTER) || (position === me.POSITION.BOTTOM_RIGHT)) {
				$targetWindow.css('top', (window.innerHeight - targetWindow.offsetHeight - shadow - margem) + 'px');
			}
		}

		/**
		 *
		 */
		function _createButtons(targetWindow, divButtonsBar, buttons) {
			buttons = buttons || [me.BUTTON.CLOSE];
			for (var count = 0 ; count < buttons.length ; count++) {
				var button = $(document.createElement('button'));
				button.addClass('modal-button');
				var response = '';

				// "YES" BUTTON
				if (buttons[count] === me.BUTTON.YES) {
					button.get(0).response = 'yes';
					button.html('Yes');
				// "NO" BUTTON	
				} else if (buttons[count] === me.BUTTON.NO) {
					button.get(0).response = 'no';
					button.html('No');
				// "OK" BUTTON
				} else if (buttons[count] === me.BUTTON.OK) {
					button.get(0).response = 'ok';
					button.html('OK');
				// "CANCEL" BUTTON						
				} else if (buttons[count] === me.BUTTON.CANCEL) {
					button.get(0).response = 'cancel';
					button.html('Cancel');
				// "CLOSE" BUTTON	
				} else /*if (buttons[count] === me.BUTTON.CLOSE) */ { //Close is a Default Button
					button.get(0).response = 'close';
					button.html('Close');
				}

				button.click(function(event) {
					targetWindow.close(event.target.response);
				});				

				divButtonsBar.append(button);
			}	

		}

		/**
		 *
		 */
		 /*
		function _createButtons(targetWindow, divButtonsBar, buttons) {
			buttons = buttons || [me.BUTTON.CLOSE];
			for (var count = 0 ; count < buttons.length ; count++) {
				var buttonClass = 'button';

				var button;

				//
				if ((buttons[count] === me.BUTTON.OK) && ($(targetWindow).find('form').length > 0)) {
					button = $(document.createElement('input'));
					button.attr('type', 'submit');
					button.attr('value', 'OK');					
				} else {
					button = $(document.createElement('button'));
				}

				button.addClass('modal-button');
				var response = '';

				// "YES" BUTTON
				if (buttons[count] === me.BUTTON.YES) {
					button.get(0).response = 'yes';
					button.html('Yes');
				// "NO" BUTTON	
				} else if (buttons[count] === me.BUTTON.NO) {
					button.get(0).response = 'no';
					button.html('No');
				// "OK" BUTTON
				} else if (buttons[count] === me.BUTTON.OK) {
					button.get(0).response = 'ok';
					button.html('OK');
				// "CANCEL" BUTTON						
				} else if (buttons[count] === me.BUTTON.CANCEL) {
					button.get(0).response = 'cancel';
					button.html('Cancel');
				// "CLOSE" BUTTON	
				} else / { //Close is a Default Button
					button.get(0).response = 'close';
					button.html('Close');
				}

				button.click(function(event) {
					targetWindow.close(event.target.response);
				});				

				divButtonsBar.append(button);
			}	

		}
		*/

		/**
		 *
		 */
		var _isImageOk = function(img) {
			// During the onload event, IE correctly identifies any images that
			// weren't downloaded as not complete. Others should too. Gecko-based
			// browsers act like NS4 in that they report this incorrectly.
			if (!img.complete) {
				return false;
			}

			// However, they do have two very useful properties: naturalWidth and
			// naturalHeight. These give the true size of the image. If it failed
			// to load, either of these should be zero.
			if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
				return false;
			}

			// No other way of checking: assume it's ok.
			return true;
		}		

	});