angular.module('apagarDepois').service('apagarDepoisSrv', function() {

	var vm = this;

	vm.name = 'denimar de moraes';
	vm.getMessage = function() {
		return 'message test';
	};


});