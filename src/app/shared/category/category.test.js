describe('CategoryTest', function () {

	var $injector = angular.injector(['categoryMdl']);

	describe('CategorySrvTest', function () {
		var categorySrv = $injector.get('categorySrv');

		it('should have a correct message', function() {
		    expect(categorySrv.getMessage()).toBe('message test');
		});	

	});

	describe('CategoryRestSrvTest', function () {
		var categoryRestSrv = $injector.get('categoryRestSrv');	

		it("rename", function (done) {
	        categoryRestSrv.rename(292, 'Category Renamed').then(function(serverResponse) {
	        	categoryRestSrv.rename(292, 'aaa111');
	            expect(serverResponse.data.data[0].dsCategoria).toBe("Category Renamed");
	            done();
	        });
		});		
			
	});	
	
});