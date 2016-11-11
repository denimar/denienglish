describe('item', function() {
	var $injector = angular.injector(['item', 'mock']);
	var appMock = $injector.get('appMock');
	var itemMock = $injector.get('itemMock');

	describe('itemService', function () {
		var itemDataService;
		var scope;

		beforeEach(inject(function(_$rootScope_) {
			scope = _$rootScope_;
			itemDataService = $injector.get('itemDataService');	

			itemMock.mock();
		}));

		var itemService = $injector.get('itemService');

		it("add (Video)", function () {
			var videoService = $injector.get('videoService');				
			var newVideoItemModalService = $injector.get('newVideoItemModalService');			

			spyOn(newVideoItemModalService, 'showModal').and.returnValue(itemMock.fakeThenCallback);		

			itemService.add(scope, videoService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record).toBe(itemMock.fakeItem);
			});
		});

		it("add (Text)", function () {
			appMock.uiDeniModalSrv.createWindowDescriptionMoreImage();
			
			var generalService = $injector.get('generalService');
			var textService = $injector.get('textService');

			spyOn(generalService, 'getDataURLImagemObjeto').and.returnValue('');
			spyOn(itemDataService, 'add').and.returnValue(itemMock.fakeThenCallback);		


			itemService.add(scope, textService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record).toBe(itemMock.fakeItem);
			});
		});

		it("del", function () {
			spyOn(itemDataService, 'del').and.returnValue(itemMock.fakeThenCallback);		

			itemService.del(0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record).toBe(itemMock.fakeItem);
			});
		});

		it("favorite.set", function () {
			spyOn(itemDataService.favorite, 'set').and.returnValue(itemMock.fakeThenCallback);

			itemService.favorite.set(0, true).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
			});
		});

		it("favorite.get", function () {
			spyOn(itemDataService.favorite, 'get').and.returnValue(itemMock.fakeThenCallback);

			itemService.favorite.get(0).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
			});
		});

		it("revision.set", function () {
			spyOn(itemDataService.revision, 'set').and.returnValue(itemMock.fakeThenCallback);

			itemService.revision.set(0, true).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
			});
		});

		it("revision.get", function () {
			spyOn(itemDataService.revision, 'get').and.returnValue(itemMock.fakeThenCallback);

			itemService.revision.get(0).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
			});
		});

	});

});
