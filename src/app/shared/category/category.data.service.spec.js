describe('category', function () {

	var $injector = angular.injector(['category']);
	var categoryMock = $injector.get('categoryMock');
	
	beforeEach(inject(function() {
		categoryMock.mock();
	}));

	describe('categoryDataService', function () {
		var categoryDataService;

		beforeEach(function() {
			categoryDataService = $injector.get('categoryDataService');					
		});	

		it("add", function () {
	        expect(categoryDataService.add()).toBe(categoryMock.fakeThenCallback);	
		});		

		it("rename", function () {
	        expect(categoryDataService.rename()).toBe(categoryMock.fakeThenCallback);	
		});		

		it("del", function () {
	        expect(categoryDataService.del()).toBe(categoryMock.fakeThenCallback);	
		});		

	});	

});