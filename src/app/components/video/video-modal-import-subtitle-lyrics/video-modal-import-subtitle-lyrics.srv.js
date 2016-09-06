angular.module('app').service('videoModalImportSubtitleLyricsSrv', function($rootScope, $q, restService, uiDeniModalSrv) {

	var vm = this;
  vm.cdItem;
	vm.controller;

	vm.setController = function(controller, scope) {
		vm.controller = controller;
    vm.controller.cdItem = vm.cdItem;
	}

	vm.showModal = function(cdItem) {
      vm.cdItem = cdItem;
      var deferred = $q.defer();

      var wndImportSubtitle = uiDeniModalSrv.createWindow({
            scope: $rootScope,
            title: 'Importing Subtitle from a text (often lyrics of musics)',
            width: '550px',         
            height: '500px',
            position: uiDeniModalSrv.POSITION.CENTER,
            buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
            urlTemplate: 'src/app/components/video/video-modal-import-subtitle-lyrics/video-modal-import-subtitle-lyrics.tpl.htm',
            modal: true,
            listeners: {

            	onshow: function(objWindow) {
            	}

            }
      });

      wndImportSubtitle.show().then(function(modalResponse) {

        if (modalResponse.button == 'ok') {
          var successfullyMessage = {
            title: 'Updating',
            message: 'Item updated successfully!'
          }

          var textArea = $(wndImportSubtitle).find('textarea');
          lyrics = textArea.val();

          restService.requestWithPromisePayLoad('subtitle/importlyrics', {}, {'cdItem': vm.cdItem, 'lyrics': lyrics}, successfullyMessage).then(function(serverReturn) {
            deferred.resolve(serverReturn.data);
          });   
        }

      });

      return deferred.promise;
	};

});