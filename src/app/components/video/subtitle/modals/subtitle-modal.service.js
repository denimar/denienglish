(function() {
	
	'use strict';

	angular
		.module('video')
		.service('subtitleModalService', subtitleModalService);

	function subtitleModalService($q, uiDeniModalSrv, stringService, subtitleRestService) {
		var vm = this;

		var EnumOperation = {
			ADDING: 1,
			EDITING: 2
		};

		var _getSubtitleModal = function(scope, controller, operation) {
			var deferred = $q.defer();

			controller.subtitleModalData = {};

			var record = controller.gridSubtitlesOptions.api.getSelectedRow();

			if (operation === EnumOperation.EDITING) { //Editing
				controller.subtitleModalData.start = stringService.doubleToStrTime(record.nrStart);
				controller.subtitleModalData.end = stringService.doubleToStrTime(record.nrEnd);
				controller.subtitleModalData.text = record.dsTexto;			
			} else { //Adding
				if (record) {
					controller.subtitleModalData.start = stringService.doubleToStrTime(record.nrStart + 1);
					controller.subtitleModalData.end = stringService.doubleToStrTime(record.nrStart + 2);
				} else {
					//initial value (fake value)
					controller.subtitleModalData.start = stringService.doubleToStrTime(1);
					controller.subtitleModalData.end = stringService.doubleToStrTime(10);
				}
			}

			var modal = uiDeniModalSrv.createWindow({
				scope: scope,
				title: 'Subtitles',
				width: '450px',			
				height: '230px',
				position: uiDeniModalSrv.POSITION.CENTER,
				buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
				urlTemplate: 'src/app/components/video/subtitle/modals/subtitle-modal.view.html',
				modal: true,
		        listeners: {
		        	onshow: function(objWindowShowed) {
		        		//alert('show...');
		        	},
		        }	
			});

			modal.show().then(function(msgResponse) {
				if (msgResponse.button === 'ok') {
					var fn;

					controller.subtitleModalData.start = stringService.strTimeToDouble(controller.subtitleModalData.start);
					controller.subtitleModalData.end = stringService.strTimeToDouble(controller.subtitleModalData.end);				

					console.log(controller.subtitleModalData);
					if (operation === EnumOperation.EDITING) { //Editing
						subtitleRestService.upd(record.cdItemSubtitle, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
							deferred.resolve(responseServer.data[0]);
						});
					} else { //Adding
						subtitleRestService.add(controller.t08vdo.cdVideo, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
							deferred.resolve(responseServer.data[0]);
						});
					}

				} else {
					deferred.reject('');
				}
			}); 

			return deferred.promise;
		};	

		vm.add = function(scope, controller) {
			return _getSubtitleModal(scope, controller, EnumOperation.ADDING);
		};

		vm.edit = function(scope, controller) {
			return _getSubtitleModal(scope, controller, EnumOperation.EDITING);
		};

	}

})();	