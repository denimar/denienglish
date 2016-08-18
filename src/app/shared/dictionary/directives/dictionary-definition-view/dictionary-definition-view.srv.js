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