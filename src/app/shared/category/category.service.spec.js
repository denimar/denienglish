describe('category', function () {

	var $injector = angular.injector(['category']);
	var scope;
	var fakeCategory = {cdCategoria: 1, dsCategoria: '_Catecory-Testing'};
	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;

		var restSrv = $injector.get('restSrv');	
		spyOn(restSrv, 'requestWithPromise').and.returnValue({
			then: function(callbackFn) {
				callbackFn({
					data: {
						data: [fakeCategory]
					}		
				});
			}
		});		

	}));		


	describe('CategorySrv', function () {
		var categoryService = $injector.get('categoryService');
		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');

		beforeEach(function() {
			spyOn(uiDeniModalSrv, 'prompt').and.returnValue({
				then: function(callbackFn){
					callbackFn(fakeCategory.dsCategoria);
				}
			});		
		});	


		it("add", function (done) {
			categoryService.add(scope, fakeCategory.cdCategoria).then(function(addedRecord) {
				expect(addedRecord.cdCategoria).toBe(1);				
				expect(addedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
				done();				
			});
		});

		it("rename", function (done) {
			categoryService.rename(scope, fakeCategory.cdCategoria, fakeCategory.dsCategoria).then(function(renamedRecord) {
				expect(renamedRecord).toBe(fakeCategory.dsCategoria);
			});
			done();
		});

		it("del", function (done) {
			categoryService.del(1).then(function(deletedRecord) {
				expect(deletedRecord.cdCategoria).toBe(1);				
				expect(deletedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
				done();				
			});
		});
			
	});

	describe('CategoryRestSrv', function () {

		var categoryRestService;

		beforeEach(function() {
			categoryRestService = $injector.get('categoryRestService');					
		});	

		it("add", function (done) {
	        categoryRestService.add(fakeCategory.cdCategoria, fakeCategory.dsCategoria).then(function(serverResponse) {
	        	var addedRecord = serverResponse.data.data[0];
	            expect(addedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
	            done();
	        });
		});		

		it("rename", function (done) {
	        categoryRestService.rename(fakeCategory.cdCategoria, fakeCategory.dsCategoria).then(function(serverResponse) {
	        	var renamedRecord = serverResponse.data.data[0];
	            expect(renamedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
	            done();
	        });
		});		

		it("del", function (done) {
	        categoryRestService.del(fakeCategory.cdCategoria).then(function(serverResponse) {
	        	var deletedRecord = serverResponse.data.data[0];
	            expect(deletedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
	            done();
	        });
		});		

	});	
	
});