angular.module('VideoMdl').service('subtitleModalSrv', function($q, uiDeniModalSrv, StringSrv, SubtitleRestSrv) {
	var vm = this;

	var EnumOperation = {
		ADDING: 1,
		EDITING: 2
	};

	var _getSubtitleModal = function(scope, controller, operation) {
		var deferred = $q.defer();

		controller.subtitleModalData = {};

		var record = controller.gridSubtitlesOptions.api.getSelectedRow();

		if (operation == EnumOperation.EDITING) { //Editing
			var record = controller.gridSubtitlesOptions.api.getSelectedRow();
			controller.subtitleModalData.start = StringSrv.doubleToStrTime(record.nrStart);
			controller.subtitleModalData.end = StringSrv.doubleToStrTime(record.nrEnd);
			controller.subtitleModalData.text = record.dsTexto;			
		} else { //Adding
			if (record) {
				controller.subtitleModalData.start = StringSrv.doubleToStrTime(record.nrStart + 1);
				controller.subtitleModalData.end = StringSrv.doubleToStrTime(record.nrStart + 2);
			} else {
				//initial value (fake value)
				controller.subtitleModalData.start = StringSrv.doubleToStrTime(1);
				controller.subtitleModalData.end = StringSrv.doubleToStrTime(10);
			}
		}

		var modal = uiDeniModalSrv.createWindow({
			scope: scope,
			title: 'Subtitles',
			width: '450px',			
			height: '230px',
			position: uiDeniModalSrv.POSITION.CENTER,
			buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],			
			urlTemplate: 'src/app/components/video/subtitle/modals/subtitle-modal.tpl.htm',
			modal: true,
	        listeners: {
	        	onshow: function(objWindowShowed) {
	        		//alert('show...');
	        	},
	        }	
		});

		modal.show().then(function(msgResponse) {
			if (msgResponse.button == 'ok') {
				var fn;

				controller.subtitleModalData.start = StringSrv.strTimeToDouble(controller.subtitleModalData.start);
				controller.subtitleModalData.end = StringSrv.strTimeToDouble(controller.subtitleModalData.end);				

				console.log(controller.subtitleModalData);
				if (operation == EnumOperation.EDITING) { //Editing
					SubtitleRestSrv.upd(record.cdItemSubtitle, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
						deferred.resolve(responseServer.data[0]);
					});
				} else { //Adding
					SubtitleRestSrv.add(controller.t08vdo.cdVideo, controller.subtitleModalData.start, controller.subtitleModalData.end, controller.subtitleModalData.text).then(function(responseServer) {
						deferred.resolve(responseServer.data[0]);
					});
				}

			} else {
				deferred.reject('');
			}
		}); 

		return deferred.promise;
	}	

	vm.add = function(scope, controller) {
		return _getSubtitleModal(scope, controller, EnumOperation.ADDING);
	}

	vm.edit = function(scope, controller) {
		return _getSubtitleModal(scope, controller, EnumOperation.EDITING);
	}

});