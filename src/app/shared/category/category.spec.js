describe('category', function () {

	var $injector = angular.injector(['category']);
	var scope;
	var fakeCategory = {cdCategoria: 1, dsCategoria: '_Catecory-Testing'};
	var fakeCallback = {
		data: {
			data: [fakeCategory]
		}		
	};	
	var thenCallback = {
		then: function(callbackFn) {
			callbackFn(fakeCallback);
		}
	};

	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;

		var restService = $injector.get('restService');	
		spyOn(restService, 'requestWithPromise').and.returnValue(thenCallback);		

	}));		


	describe('categoryService', function () {
		var categoryService = $injector.get('categoryService');
		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');

		beforeEach(function() {
			spyOn(uiDeniModalSrv, 'prompt').and.returnValue({
				then: function(callbackFn){
					callbackFn(fakeCategory.dsCategoria);
				}
			});		
		});	


		it("add", function () {
			categoryService.add(scope, fakeCategory.cdCategoria).then(function(addedRecord) {
				expect(addedRecord.cdCategoria).toBe(fakeCategory.cdCategoria);				
				expect(addedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
			});
		});

		it("rename", function () {
			categoryService.rename(scope, fakeCategory.cdCategoria, fakeCategory.dsCategoria).then(function(renamedRecord) {
				expect(renamedRecord).toBe(fakeCategory.dsCategoria);
			});
		});

		it("del", function () {
			categoryService.del(1).then(function(deletedRecord) {
				expect(deletedRecord.cdCategoria).toBe(fakeCategory.cdCategoria);				
				expect(deletedRecord.dsCategoria).toBe(fakeCategory.dsCategoria);
			});
		});
			
	});

	describe('categoryDataService', function () {

		var categoryDataService;

		beforeEach(function() {
			categoryDataService = $injector.get('categoryDataService');					
		});	

		it("add", function () {
	        expect(categoryDataService.add()).toBe(thenCallback);	
		});		

		it("rename", function () {
	        expect(categoryDataService.rename()).toBe(thenCallback);	
		});		

		it("del", function () {
	        expect(categoryDataService.del()).toBe(thenCallback);	
		});		

	});	
	
});