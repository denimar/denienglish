describe('item', function() {
	var $injector = angular.injector(['item', 'mock']);
	var appMock = $injector.get('appMock');
	var itemMock = $injector.get('itemMock');

	describe('new-video-item-modal', function() {

		var uiDeniModalSrv = $injector.get('uiDeniModalSrv');
		var newVideoItemModalService = $injector.get('newVideoItemModalService');
		var fakeScope = {
			newVideoItemModal: {
				tp_video: 0, //0=youtube, 1=googledrive
				id_video: 'd020hcWA_Wg',
				description: 'fake description'
			}	
		};

		beforeEach(function() {
			appMock.uiDeniModalSrv.createWindow();
		});

		it('showModal', function(done) {

		 	newVideoItemModalService.showModal(fakeScope).then(function(response) {
		 		expect(response).toBe(fakeScope.newVideoItemModal);	
		 		done();
		 	});

		});

	});

});