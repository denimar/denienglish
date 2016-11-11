describe('item', function() {
	var $injector = angular.injector(['item']);
	var itemMock = $injector.get('itemMock');

	describe('itemDataService', function () {
		var itemDataService;

		beforeEach(inject(function(_$rootScope_) {
			itemDataService = $injector.get('itemDataService');	

			itemMock.mock();

			var videoDataService = $injector.get('videoDataService');	
			spyOn(videoDataService, 'add').and.returnValue(itemMock.fakeThenCallback);		
		}));


		it("list", function() {
			expect(itemDataService.list()).toBe(itemMock.fakeThenCallback);
		});

		it("get", function() {
			expect(itemDataService.get()).toBe(itemMock.fakeThenCallback);			
		});

		it("add", function() {
			expect(itemDataService.add()).toBe(itemMock.fakeThenCallback);			
		});

		it("upd", function() {
			expect(itemDataService.upd()).toBe(itemMock.fakeThenCallback);			
		});

		it("del", function() {
			expect(itemDataService.del()).toBe(itemMock.fakeThenCallback);			
		});

		it("favorite.set", function() {
			spyOn(itemDataService.favorite, 'set').and.returnValue(itemMock.fakeThenCallback);			
			expect(itemDataService.favorite.set()).toBe(itemMock.fakeThenCallback);			
		});

		it("favorite.get", function() {
			spyOn(itemDataService.favorite, 'get').and.returnValue(itemMock.fakeThenCallback);
			expect(itemDataService.favorite.get()).toBe(itemMock.fakeThenCallback);			
		});

		it("revision.set", function() {
			spyOn(itemDataService.revision, 'set').and.returnValue(itemMock.fakeThenCallback);			
			expect(itemDataService.revision.set()).toBe(itemMock.fakeThenCallback);			
		});

		it("revision.get", function() {
			spyOn(itemDataService.revision, 'get').and.returnValue(itemMock.fakeThenCallback);
			expect(itemDataService.revision.get()).toBe(itemMock.fakeThenCallback);			
		});

	});

});	