describe('category', function () {

	var $injector = angular.injector(['category', 'mock']);
	var appMock = $injector.get('appMock');
	var categoryMock = $injector.get('categoryMock');
	var scope;
	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;
		categoryMock.mock();
	}));		


	describe('categoryService', function () {
		var categoryService = $injector.get('categoryService');
		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');

		beforeEach(function() {
			appMock.uiDeniModalSrv.prompt(categoryMock.fakeCategory.dsCategoria);
		});	


		it("add", function () {
			categoryService.add(scope, categoryMock.fakeCategory.cdCategoria).then(function(addedRecord) {
				expect(addedRecord).toBe(categoryMock.fakeCategory);
			});
		});

		it("rename", function () {
			categoryService.rename(scope, categoryMock.fakeCategory.cdCategoria, categoryMock.fakeCategory.dsCategoria).then(function(renamedRecord) {
				expect(renamedRecord).toBe(categoryMock.fakeCategory.dsCategoria);
			});
		});

		it("del", function () {
			categoryService.del(1).then(function(deletedRecord) {
				expect(deletedRecord).toBe(categoryMock.fakeCategory);
			});
		});
			
	});

});