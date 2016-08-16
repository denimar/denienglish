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