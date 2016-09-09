(function() {

	'use strict';

	angular
		.module('video')
		.controller('videoController', videoController);

	function videoController(
		$scope, $rootScope, $routeParams, generalService, itemDataService, videoService, subtitleModalService, 
		subtitleDataService, uiDeniModalSrv, pronunciationService, pronunciationModalService, dictionaryService, 
		dictionaryModalService, spacedRevisionModalService) {

		var vm = this;
		videoService.setController(vm);
		vm.scope = $scope;


		$scope.name = 'videoController';
		$scope.params = $routeParams;	
		vm.t05itm = null;
		vm.cdItem = $scope.params.cdItem;
		vm.commentaries = '';
		vm.initialCommentaries = '';

		itemDataService.get($scope.params.cdItem).then(function(serverResponse) {
			vm.t05itm = serverResponse.data.data[0];
			$rootScope.subTitle = vm.t05itm.dsItem;
		});

	    videoService.configElementVideo(vm, $scope.params.cdItem).then(function(t08vdo) {
			vm.t08vdo = t08vdo;
			//vm.commentaries = t08vdo.txComentarios;
		});

		videoService.configGridSubtitles(vm, $scope.params.cdItem);		
		videoService.configWYSIWYG(vm, $scope.params.cdItem);	
		generalService.getAllExpressions().then(function(response) {
			vm.gridSubtitlesOptions.api.repaint();
		});

		vm.dictionaryModalClick = function() {
			dictionaryModalService.showModal($rootScope).then(function(dictionaryData) {
				vm.gridSubtitlesOptions.api.repaint();
			});
		};

		vm.pronunciationModalClick = function() {
			pronunciationModalService.showModal($rootScope).then(function(pronunciationData) {
				vm.gridSubtitlesOptions.api.repaint();
			});
		};

		vm.addSubtitleButtonClick = function() {
			subtitleModalService.add($scope, vm).then(function(subtitleAdded) {
				vm.gridSubtitlesOptions.api.reload().then(function() {
					vm.gridSubtitlesOptions.api.findKey(subtitleAdded.cdItemSubtitle, {inLine: true});
				});
			});
		};

		vm.editSubtitleButtonClick = videoService.editSubtitleButtonClick;

		/*
		vm.editSubtitleButtonClick = function() {
			subtitleModalService.edit($scope, vm).then(function(subtitleUpdated) {
				vm.gridSubtitlesOptions.api.reload().then(function() {
					vm.gridSubtitlesOptions.api.findKey(subtitleUpdated.cdItemSubtitle, {inLine: true});
				});
			});
		}
		*/

		vm.delSubtitleButtonClick = function() {
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			subtitleDataService.del(record.cdItemSubtitle).then(function() {
				vm.gridSubtitlesOptions.api.reload();
			});
		};

		var _incrementOneSecond = function(increment) {
			$rootScope.loading = true;
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			var cdItemSubtitle = record.cdItemSubtitle;
			record.nrStart = record.nrStart + increment;
			record.nrEnd = record.nrEnd + increment;		

			var fn;
			if (increment > 0) {
				fn = subtitleDataService.incASecond;
			} else {
				fn = subtitleDataService.decASecond;
			}

			fn(cdItemSubtitle, record.nrStart, record.nrEnd, record.dsTexto).then(function(serverResponse) {
				$rootScope.loading = false;
				uiDeniModalSrv.ghost('Subtitle', 'Subtitle time is update successfully');				
				vm.gridSubtitlesOptions.api.repaint();
				vm.gridSubtitlesOptions.api.findKey(cdItemSubtitle, {inLine: true});
			});
		};

		vm.decreaseOneSecondButtonClick = function() {
			_incrementOneSecond(-1);
		};

		vm.incrementOneSecondButtonClick = function() {
			_incrementOneSecond(1);
		};

		vm.listenButtonClick = function() {
			var record = vm.gridSubtitlesOptions.api.getSelectedRow();
			pronunciationService.listenExpression(record.dsTexto);
		};

	    vm.spacedRevisionClick = function() {
	        spacedRevisionModalService.showModal($scope, vm.cdItem);
	    };

	    $scope.openDictionary = function(cdDicionario, dsExpressao) {
	        dictionaryService.openDictionaryDefinitionView($rootScope, cdDicionario, dsExpressao);
	    };    

		$scope.openPronunciation = function(dsExpressao) {
	        pronunciationService.listenExpression(dsExpressao);
	    };

	    vm.importSubtitleFromLyrics = videoService.importSubtitleFromLyrics;
	    vm.importSubtitleFromSrtFile = videoService.importSubtitleFromSrtFile;

	}

})();	