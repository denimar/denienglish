describe('item', function () {

	var $injector = angular.injector(['item']);
	var scope;
	var fakeItem = {cdItem: 1, dsItem: '_Item-Testing', blFavorite: true, blFazerRevisao: true};
	var fakeCallback = {
		data: {
			data: [fakeItem]
		}		
	};	
	var thenCallback = {
		then: function(callbackFn) {
			callbackFn(fakeCallback);
		}
	};
	var itemDataService;
	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;

		var restService = $injector.get('restService');	
		spyOn(restService, 'requestWithPromise').and.returnValue(thenCallback);		
		spyOn(restService, 'requestWithPromisePayLoad').and.returnValue(thenCallback);				

		itemDataService = $injector.get('itemDataService');	

		var videoDataService = $injector.get('videoDataService');	
		spyOn(videoDataService, 'add').and.returnValue(thenCallback);		

	}));


	describe('itemService', function () {
		var itemService = $injector.get('itemService');

		it("add (Video)", function () {
			var videoService = $injector.get('videoService');				
			var newVideoItemModalService = $injector.get('newVideoItemModalService');			

			spyOn(newVideoItemModalService, 'showModal').and.returnValue(thenCallback);		

			itemService.add(scope, videoService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(1);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
			});
		});

		it("add (Text)", function () {
			var uiDeniModalSrv = $injector.get('uiDeniModalSrv');

			spyOn(uiDeniModalSrv, 'createWindowDescriptionMoreImage').and.returnValue({
				show: function() {
					return {
						then: function(callbackFn){
							callbackFn({
								'button': 'ok',
								'data': {
									'imageEl': {
										get: function(fakeNr) {
											return 0;
										}
									}
								}
							});
						}
					}	
				}	
			});
			
			var generalService = $injector.get('generalService');
			var textService = $injector.get('textService');

			spyOn(generalService, 'getDataURLImagemObjeto').and.returnValue('');
			spyOn(itemDataService, 'add').and.returnValue(thenCallback);		


			itemService.add(scope, textService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(fakeItem.cdItem);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
			});
		});

		it("del", function () {
			spyOn(itemDataService, 'del').and.returnValue(thenCallback);		

			itemService.del(0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(fakeItem.cdItem);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
			});
		});

		it("favorite.set", function () {
			spyOn(itemDataService.favorite, 'set').and.returnValue(thenCallback);

			itemService.favorite.set(0, true).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
			});
		});

		it("favorite.get", function () {
			spyOn(itemDataService.favorite, 'get').and.returnValue(thenCallback);

			itemService.favorite.get(0).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
			});
		});

		it("revision.set", function () {
			spyOn(itemDataService.revision, 'set').and.returnValue(thenCallback);

			itemService.revision.set(0, true).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
			});
		});

		it("revision.get", function () {
			spyOn(itemDataService.revision, 'get').and.returnValue(thenCallback);

			itemService.revision.get(0).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
			});
		});

	});	

	describe('itemDataService', function () {

		it("list", function() {
			expect(itemDataService.list()).toBe(thenCallback);
		});

		it("get", function() {
			expect(itemDataService.get()).toBe(thenCallback);			
		});

		it("add", function() {
			expect(itemDataService.add()).toBe(thenCallback);			
		});

		it("upd", function() {
			expect(itemDataService.upd()).toBe(thenCallback);			
		});

		it("del", function() {
			expect(itemDataService.del()).toBe(thenCallback);			
		});

		it("favorite.set", function() {
			spyOn(itemDataService.favorite, 'set').and.returnValue(thenCallback);			
			expect(itemDataService.favorite.set()).toBe(thenCallback);			
		});

		it("favorite.get", function() {
			spyOn(itemDataService.favorite, 'get').and.returnValue(thenCallback);
			expect(itemDataService.favorite.get()).toBe(thenCallback);			
		});

		it("revision.set", function() {
			spyOn(itemDataService.revision, 'set').and.returnValue(thenCallback);			
			expect(itemDataService.revision.set()).toBe(thenCallback);			
		});

		it("revision.get", function() {
			spyOn(itemDataService.revision, 'get').and.returnValue(thenCallback);
			expect(itemDataService.revision.get()).toBe(thenCallback);			
		});

	});	


});