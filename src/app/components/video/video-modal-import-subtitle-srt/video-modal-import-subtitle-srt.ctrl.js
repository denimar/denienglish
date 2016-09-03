angular.module('app').controller('VideoModalImportSubtitleSrtCtrl', function($scope, Upload, AppConsts, videoModalImportSubtitleSrtSrv) {

	videoModalImportSubtitleSrtSrv.setController(this, $scope);    

});