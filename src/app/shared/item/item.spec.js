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
	var itemRestService;
	
	beforeEach(inject(function(_$rootScope_) {
		scope = _$rootScope_;

		var restService = $injector.get('restService');	
		spyOn(restService, 'requestWithPromise').and.returnValue(thenCallback);		
		spyOn(restService, 'requestWithPromisePayLoad').and.returnValue(thenCallback);				

		itemRestService = $injector.get('itemRestService');	

		var videoRestService = $injector.get('videoRestService');	
		spyOn(videoRestService, 'add').and.returnValue(thenCallback);		

	}));


	describe('itemService', function () {
		var itemService = $injector.get('itemService');
		var textService = $injector.get('textService');
		var videoService = $injector.get('videoService');				
		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');
		var newVideoItemModalService = $injector.get('newVideoItemModalService');

		beforeEach(function() {
		});	

		it("add (Video)", function (done) {
			spyOn(newVideoItemModalService, 'showModal').and.returnValue(thenCallback);		

			itemService.add(scope, videoService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(1);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
				done();				
			});
		});

		it("add (Text)", function (done) {
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
			spyOn(generalService, 'getDataURLImagemObjeto').and.returnValue('');
			spyOn(itemRestService, 'add').and.returnValue(thenCallback);		


			itemService.add(scope, textService.topParentNodeId, 0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(1);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
				done();				
			});
		});

		it("del", function (done) {
			spyOn(itemRestService, 'del').and.returnValue(thenCallback);		

			itemService.del(0).then(function(serverResponse) {
				var record = serverResponse.data.data[0];
				expect(record.cdItem).toBe(1);				
				expect(record.dsItem).toBe(fakeItem.dsItem);
				done();				
			});
		});

		it("favorite.set", function (done) {
			spyOn(itemRestService.favorite, 'set').and.returnValue(thenCallback);

			itemService.favorite.set(0, true).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
				done();				
			});
		});

		it("favorite.get", function (done) {
			spyOn(itemRestService.favorite, 'get').and.returnValue(thenCallback);

			itemService.favorite.get(0).then(function(blFavorite) {
				expect(blFavorite).toBe(true);
				done();				
			});
		});

		it("revision.set", function (done) {
			spyOn(itemRestService.revision, 'set').and.returnValue(thenCallback);

			itemService.revision.set(0, true).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
				done();				
			});
		});

		it("revision.get", function (done) {
			spyOn(itemRestService.revision, 'get').and.returnValue(thenCallback);

			itemService.revision.get(0).then(function(blFazerRevisao) {
				expect(blFazerRevisao).toBe(true);
				done();				
			});
		});

	});	

	describe('itemRestService', function () {

		it("list", function() {
			expect(itemRestService.list()).toBe(thenCallback);
		});

		it("get", function() {
			expect(itemRestService.get()).toBe(thenCallback);			
		});

		it("add", function() {
			expect(itemRestService.add()).toBe(thenCallback);			
		});

		it("upd", function() {
			expect(itemRestService.upd()).toBe(thenCallback);			
		});

		it("del", function() {
			expect(itemRestService.del()).toBe(thenCallback);			
		});

		it("favorite.set", function() {
			spyOn(itemRestService.favorite, 'set').and.returnValue(thenCallback);			
			expect(itemRestService.favorite.set()).toBe(thenCallback);			
		});

		it("favorite.get", function() {
			spyOn(itemRestService.favorite, 'get').and.returnValue(thenCallback);
			expect(itemRestService.favorite.get()).toBe(thenCallback);			
		});

		it("revision.set", function() {
			spyOn(itemRestService.revision, 'set').and.returnValue(thenCallback);			
			expect(itemRestService.revision.set()).toBe(thenCallback);			
		});

		it("revision.get", function() {
			spyOn(itemRestService.revision, 'get').and.returnValue(thenCallback);
			expect(itemRestService.revision.get()).toBe(thenCallback);			
		});

	});	


});