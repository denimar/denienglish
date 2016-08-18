
angular.module('VideoMdl').controller('VideoCtrl', function($scope, $rootScope, $routeParams, $sce, GeneralSrv, VideoSrv, subtitleModalSrv, SubtitleRestSrv, uiDeniModalSrv, pronunciationSrv, pronunciationModalSrv, dictionarySrv, dictionaryModalSrv, pronunciationSrv) {
	var vm = this;
	vm.scope = $scope;

	$scope.name = "VideoCtrl";
	$scope.params = $routeParams;	
	vm.cdItem = $scope.params.cdItem;
	vm.commentaries = '';
	vm.initialCommentaries = '';

    VideoSrv.configElementVideo(vm, $scope.params.cdItem).then(function(t08vdo) {
		vm.t08vdo = t08vdo;
		//vm.commentaries = t08vdo.txComentarios;
	});

	VideoSrv.configGridSubtitles(vm, $scope.params.cdItem);		
	VideoSrv.configWYSIWYG(vm, $scope.params.cdItem);	
	GeneralSrv.getAllExpressions().then(function(response) {
		vm.gridSubtitlesOptions.api.repaint();
	});

	vm.dictionaryModalClick = function() {
		dictionaryModalSrv.showModal($rootScope).then(function(dictionaryData) {dictionarySrv
			vm.gridSubtitlesOptions.api.repaint();
		});
	}

	vm.pronunciationModalClick = function() {
		pronunciationModalSrv.showModal($rootScope).then(function(pronunciationData) {
			vm.gridSubtitlesOptions.api.repaint();
		});
	}

	vm.addSubtitleButtonClick = function() {
		subtitleModalSrv.add($scope, vm).then(function(subtitleAdded) {
			vm.gridSubtitlesOptions.api.reload().then(function() {
				vm.gridSubtitlesOptions.api.findKey(subtitleAdded.cdItemSubtitle, {inLine: true});
			});
		});
	}

	vm.editSubtitleButtonClick = function() {
		subtitleModalSrv.edit($scope, vm).then(function(subtitleUpdated) {
			vm.gridSubtitlesOptions.api.reload().then(function() {
				vm.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
			});
		});
	}

	vm.delSubtitleButtonClick = function() {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		SubtitleRestSrv.del(record.cdItemSubtitle).then(function() {
			vm.gridSubtitlesOptions.api.reload();
		});
	}

	var _incrementOneSecond = function(increment) {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		var cdItemSubtitle = record.cdItemSubtitle;
		record.nrStart = record.nrStart + increment;
		record.nrEnd = record.nrEnd + increment;		

		SubtitleRestSrv.upd(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(responseServer) {
			uiDeniModalSrv.ghost('Subtitle', 'Subtitle time is update successfully');				
			vm.gridSubtitlesOptions.api.repaint();
			vm.gridSubtitlesOptions.api.findKey(cdItemSubtitle, {inLine: true});
		});
	}

	vm.decreaseOneSecondButtonClick = function() {
		_incrementOneSecond(-1);
	}

	vm.incrementOneSecondButtonClick = function() {
		_incrementOneSecond(1);
	}

	vm.listenButtonClick = function() {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		pronunciationSrv.listenExpression(record.dsTexto);
	}

    $scope.openDictionary = function(cdDicionario) {
        dictionarySrv.openDictionaryDefinitionView($rootScope, cdDicionario);
    }     

	$scope.openPronunciation = function(dsExpressao) {
        pronunciationSrv.listenExpression(dsExpressao);
    }

    vm.importSubtitleFromLyrics = VideoSrv.importSubtitleFromLyrics;
    vm.importSubtitleFromSrtFile = VideoSrv.importSubtitleFromSrtFile;

});