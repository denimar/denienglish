angular.module('VideoMdl').service('VideoSrv', function($timeout, $sce, $compile, $interval, $q, VideoRestSrv, AppConsts, StringSrv, AppSrv) {
	
	var vm = this;

	var _selectSubtitleInTime = function(controller, time) {
		var data = controller.gridSubtitlesOptions.data;
		for (var index = 0 ; index < data.length ; index++) {
			var record = data[index];
			if ((time >= record.nrStart) && (time <= record.nrEnd)) {
				if (index != controller.gridSubtitlesOptions.api.getSelectedRowIndex()) {
					controller.gridSubtitlesOptions.api.selectRow(index, true, false);
				}	
				break;
			}
		}
	}

	var selectingSubtitle = false;
	vm.configElementVideo = function(controller, cdItem) {
		var deferred = $q.defer();

		controller.onPlayerReady = function(API) {
			controller.videoAPI = API;
			controller.videoAPI.autoPlay = false;

			var intervalPromise = $interval(function() {
		        //controller.videoAPI.play();
		        //controller.videoAPI.currentState = 'play';

				if (angular.isDefined(controller.currentTime)) {
					$interval.cancel(intervalPromise);
				}

	    	}, 1000);
		};

		controller.onUpdateTime = function(currentTime, totalTime) {
			controller.currentTime = currentTime * 1000;
			controller.totalTime = totalTime * 1000;
			controller.timeLeft = controller.totalTime - controller.currentTime;
			if (!selectingSubtitle) {
				_selectSubtitleInTime(controller, currentTime);
			}	
		};		

		VideoRestSrv.get(cdItem).then(function(serverReturn) {
			var t08vdo = serverReturn.data.data[0];
			deferred.resolve(t08vdo);

			var videoUrl;
			if (t08vdo.tpVideo == 'YOUTUBE') {
				urlImage = "https://www.youtube.com/watch?v=" + t08vdo.idVideo;
			} else {
				urlImage = "https://googledrive.com/host/" + t08vdo.idVideo;
			}

			controller.videoConfig = {
				//preload: "auto",
				autoPlay: false,
				sources: [
					//{src: t08vdo.dsUrl},
					{src: $sce.trustAsResourceUrl(urlImage), type: "video/mp4"},
				],
				theme: {
					url: "dist/videogular/videogular.css"
				},
				plugins: {
					controls: {
						autoHide: true,
						autoHideTime: 5000
					},
					//poster: AppConsts.SERVER_URL + "item/image/get?cd_item=" + t08vdo.t05itm.cdItem + '&time=452'
				}
			};	
			
			/*
            controller.videoConfig = {
                preload: "auto",
                "autoplay": true,
                sources: [
                    {src: $sce.trustAsResourceUrl(t08vdo.dsUrl), type: "video/mp4"},
                ],
                theme: {
                    url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
                }
            };			
			*/

		});

		return deferred.promise;
	}	

	vm.configGridSubtitles = function(controller, cdItem) {	

		controller.gridSubtitlesOptions = {
			keyField: 'cdItemSubtitle',
			rowHeight: '37px',
			url: AppConsts.SERVER_URL + '/subtitle/list?cd_item=' + cdItem,
			hideHeaders: true,
	        columns: [
	        	{
	            	name: 'nrStart',
	            	width: '15%',
	            	align: 'center',	            	
	            	renderer: function(value, record) {
	            		return StringSrv.doubleToStrTime(value);
	            	}	
	        	},
	        	{
	            	name: 'nrEnd',
	            	width: '15%',
	            	align: 'center',
	            	renderer: function(value, record) {
	            		return StringSrv.doubleToStrTime(value);
	            	}	
	        	},
	        	{
	            	name: 'dsTexto',
	            	width: '80%',
	            	renderer: function(value, record) {
						var $div = $('<div>' + StringSrv.addLinksDictionaryAndPronunciation(value) + '</div>');
						$compile($div)(controller.scope);
	            		return $div;
	            	}	
	        	}
	        ],
	        listeners: {				
				onselectionchange: function(ctrl, element, rowIndex, record) {
					selectingSubtitle = true;
					try {
						controller.videoAPI.seekTime(record.nrStart);
					} finally {	
						//controller.videoAPI.pause();						
						$timeout(function() {
							selectingSubtitle = false;
						}, 1500)
					}	
				}
	        }
	    };


	}

	vm.configWYSIWYG = function(controller, cdItem) {

		var fnExecSaveButton = function() {
			VideoRestSrv.commentaries.set(controller.t08vdo.cdVideo, controller.t08vdo.txComentarios);
		}

		var fnExecCancelButton = function() {
	    	VideoRestSrv.get(cdItem).then(function(serverResponse) {
	    		controller.t08vdo = serverResponse.data.data[0];
	    	});
		}

		controller.options = AppSrv.getConfigWYSIWYG(fnExecSaveButton, fnExecCancelButton);
	}

});