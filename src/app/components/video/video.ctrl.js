'use strict';

angular.module('VideoMdl').controller('VideoCtrl', function($scope, $rootScope, $routeParams, $sce, GeneralSrv, ItemRestSrv, VideoSrv, subtitleModalSrv, SubtitleRestSrv, uiDeniModalSrv, pronunciationSrv, pronunciationModalSrv, dictionarySrv, dictionaryModalSrv, pronunciationSrv, spacedRevisionModalSrv) {
	var vm = this;
	VideoSrv.setController(this);
	vm.scope = $scope;


	$scope.name = "VideoCtrl";
	$scope.params = $routeParams;	
	vm.t05itm = null;
	vm.cdItem = $scope.params.cdItem;
	vm.commentaries = '';
	vm.initialCommentaries = '';

	ItemRestSrv.get($scope.params.cdItem).then(function(serverResponse) {
		vm.t05itm = serverResponse.data.data[0];
		$rootScope.subTitle = vm.t05itm.dsItem;
	});

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

	vm.editSubtitleButtonClick = VideoSrv.editSubtitleButtonClick;

	/*
	vm.editSubtitleButtonClick = function() {
		subtitleModalSrv.edit($scope, vm).then(function(subtitleUpdated) {
			vm.gridSubtitlesOptions.api.reload().then(function() {
				vm.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
			});
		});
	}
	*/

	vm.delSubtitleButtonClick = function() {
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		SubtitleRestSrv.del(record.cdItemSubtitle).then(function() {
			vm.gridSubtitlesOptions.api.reload();
		});
	}

	var _incrementOneSecond = function(increment) {
		$rootScope.loading = true;
		var record = vm.gridSubtitlesOptions.api.getSelectedRow();
		var cdItemSubtitle = record.cdItemSubtitle;
		record.nrStart = record.nrStart + increment;
		record.nrEnd = record.nrEnd + increment;		

		var fn;
		if (increment > 0) {
			fn = SubtitleRestSrv.incASecond;
		} else {
			fn = SubtitleRestSrv.decASecond;
		}

		fn(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(serverResponse) {
			$rootScope.loading = false;
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

    vm.spacedRevisionClick = function() {
        spacedRevisionModalSrv.showModal($scope, vm.cdItem);
    }

    $scope.openDictionary = function(cdDicionario, dsExpressao) {
        dictionarySrv.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
    }     

	$scope.openPronunciation = function(dsExpressao) {
        pronunciationSrv.listenExpression(dsExpressao);
    }

    vm.importSubtitleFromLyrics = VideoSrv.importSubtitleFromLyrics;
    vm.importSubtitleFromSrtFile = VideoSrv.importSubtitleFromSrtFile;

});