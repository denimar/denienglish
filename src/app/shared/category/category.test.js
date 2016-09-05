describe('CategoryTest', function () {

	var $injector = angular.injector(['categoryMdl']);
	var categorySrv = $injector.get('categorySrv');

	it('should have a correct message', function() {
	    expect(categorySrv.getMessage()).toBe('message test');
	});	

});