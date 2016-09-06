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