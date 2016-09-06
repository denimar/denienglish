(function() {
	'use strict';
	
	angular
		.module('item')
		.service('newVideoItemModalService', newVideoItemModalService);

	function newVideoItemModalService($q, uiDeniModalSrv) {
		var vm = this;

		vm.showModal = function(scope) {
		 	var deferred = $q.defer();

			var modal = uiDeniModalSrv.createWindow({
				scope: scope,
				title: 'Creating a new video',
				width: '550px',			
				height: '300px',
				position: uiDeniModalSrv.POSITION.CENTER,
				buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
				urlTemplate: 'src/app/shared/item/new-video-item-modal/new-video-item-modal.view.html',
				modal: true,
				listeners: {
					onshow: function(objWindow) {
						scope.newVideoItemModal.kindOfVideo = 0;
					}
				}
			});

			modal.show().then(function(modalResponse) {
				if (modalResponse.button == 'ok') {
					deferred.resolve(scope.newVideoItemModal);

				} else {
					deferred.reject();
				}
			});		


			return deferred.promise;
		}

	};

})();	