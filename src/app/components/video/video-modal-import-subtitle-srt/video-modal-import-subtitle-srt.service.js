(function() {

    'use strict';

  angular
    .module('video')
    .service('videoModalImportSubtitleSrtService', videoModalImportSubtitleSrtService);

    function videoModalImportSubtitleSrtService($q, $http, $rootScope, restService, uiDeniModalSrv, Upload) {

  	var vm = this;
    vm.cdItem;
  	vm.controller;

  	vm.setController = function(controller, scope) {
  		vm.controller = controller;
      vm.controller.cdItem = vm.cdItem;

      scope.$watch('ctrl.strFile', function (newValue, oldValue) {
          vm.controller.strFile = newValue;
      });
  	}

  	vm.showModal = function(cdItem) {
        vm.cdItem = cdItem;
        var deferred = $q.defer();

        var wndImportSubtitle = uiDeniModalSrv.createWindow({
              scope: $rootScope,
              title: 'Importing Subtitle (.srt)',
              width: '600px',         
              height: '230px',
              position: uiDeniModalSrv.POSITION.CENTER,
              buttons: [uiDeniModalSrv.BUTTON.OK, uiDeniModalSrv.BUTTON.CANCEL],
              urlTemplate: 'src/app/components/video/video-modal-import-subtitle-srt/video-modal-import-subtitle-srt.view.html',
              modal: true,
              listeners: {

              	onshow: function(objWindow) {
              	}

              }
        });

        wndImportSubtitle.show().then(function(modalResponse) {

          if (modalResponse.button == 'ok') {
            if ((vm.controller.strFile) && (!vm.controller.strFile.$error)) {

              var fileInput = $(wndImportSubtitle).find('input[type=file]');
               var fd = new FormData();
               fd.append('cdItem', vm.cdItem);
               fd.append('file', vm.controller.strFile);

               $http.post(restService.SERVER_URL + 'subtitle/importsrt', fd, {
                  transformRequest: angular.identity,
                  headers: {'Content-Type': undefined}
               })
            
               .success(function(serverResponseAddSubtitle){
                  uiDeniModalSrv.ghost("Subtitles", "Subtitles imported successfully!");
                  deferred.resolve(serverResponseAddSubtitle.data);
               })
            
               .error(function(reason){
                  deferred.reject(reason);
               });

            }
          }
          
        });

        return deferred.promise;
  	};

    vm.uploaderOnAfterAddingFile = function(fileItem) {
      vm.controller.file = fileItem.file; 
      //var spanFileName = $('.video-modal-import-subtitle-srt .select-file-drag-and-drop .filename');
      //spanFileName.html(fileItem.file.name);
    };
  	

  };

})();  