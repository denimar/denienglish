describe('item', function () {

	var $injector = angular.injector(['item']);
	var scope;
	var fakeItem = {cdItem: 1, dsItem: '_Item-Testing'};
	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;

		var restService = $injector.get('restService');	
		spyOn(restService, 'requestWithPromise').and.returnValue({
			then: function(callbackFn) {
				callbackFn({
					data: {
						data: [fakeItem]
					}		
				});
			}
		});		

	}));


	describe('itemService', function () {
		var itemService = $injector.get('itemService');
		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');

		beforeEach(function() {
			spyOn(uiDeniModalSrv, 'createWindowDescriptionMoreImage').and.returnValue({
				then: function(callbackFn){
					callbackFn(fakeCategory.dsCategoria);
				}
			});		
		});	

		it("add", function (done) {
			itemService.add(scope, 0).then(function(addedRecord) {
				expect(addedRecord.cdItem).toBe(1);				
				expect(addedRecord.dsItem).toBe(fakeItem.dsItem);
				done();				
			});
		});

	});	

	/*
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
	*/
	
});