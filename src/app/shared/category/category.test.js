describe('Category', function () {

	var $injector = angular.injector(['categoryMdl']);
	var textCategory = 275; //Top Caregory "Texts"

	describe('CategorySrv', function () {
		var categorySrv = $injector.get('categorySrv');
	});

	describe('CategoryRestSrv', function () {
		var categoryRestSrv = $injector.get('categoryRestSrv');	
		var categoryTesting = '_Catecory-Testing';

		it("add", function (done) {
	        categoryRestSrv.add(textCategory, categoryTesting).then(function(serverResponse) {
	        	var addedRecord = serverResponse.data.data[0];
	        	categoryRestSrv.del(addedRecord.cdCategoria);
	            expect(addedRecord.dsCategoria).toBe(categoryTesting);
	            done();
	        });
		});		

		it("rename", function (done) {
			categoryRestSrv.add(textCategory, categoryTesting).then(function(serverResponseAdd) {
				var addedRecord = serverResponseAdd.data.data[0];
				var categoryTestingRename = categoryTesting + '-rename';
		        categoryRestSrv.rename(addedRecord.cdCategoria, categoryTestingRename).then(function(serverResponseRename) {
		        	var renamedRecord = serverResponseRename.data.data[0];
		        	categoryRestSrv.del(renamedRecord.cdCategoria);
		            expect(renamedRecord.dsCategoria).toBe(categoryTestingRename);
		            done();
		        });
		    });
		});		

		it("del", function (done) {
			categoryRestSrv.add(textCategory, categoryTesting).then(function(serverResponseAdd) {
				var addedRecord = serverResponseAdd.data.data[0];
		        categoryRestSrv.del(addedRecord.cdCategoria).then(function(serverResponseDel) {
		        	var deletedRecord = serverResponseDel.data.data[0];
		            expect(deletedRecord.dsCategoria).toBe(categoryTesting);
		            done();
		        });
		    });
		});		

	});	
	
});