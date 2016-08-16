angular.module('app').service('itemSrv', function($q, ItemRestSrv, AppSrv, uiDeniModalSrv, newVideoItemModalSrv, AppEnums, VideoRestSrv) {

	var vm = this;

	/**
	 *
	 */
	 var _addItemText = function(scope) {
	 	var deferred = $q.defer();

		var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage();
		wndDescriptionMorImage.show().then(function(response) {
			if (response.button == 'ok') {
				var imageURI = AppSrv.getDataURLImagemObjeto(response.data.imageEl.get(0), 150, 150, 0.5);
				ItemRestSrv.add(AppEnums.CategoryType.TEXT, AppSrv.currentCategory, response.data.description, imageURI).then(function(responseAdd) {
					deferred.resolve(responseAdd);
				});				
			} else {
				deferred.reject();
			}
		});

		return deferred.promise;
	 }	


	/**
	 *
	 */
	 var _addItemVideo = function(scope) {
	 	var deferred = $q.defer();
	 	scope.newVideoItemModal = {};

		scope.newVideoItemModal.getImagePreviewUrl = function() {
			if (scope.newVideoItemModal.kindOfVideo == "0") { //youtube
				return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId + '/default.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/0.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/1.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/2.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/3.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/jpg.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/mqdefault.jpg';
				//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.videoId '/maxresdefault.jpg';

			} else if (scope.newVideoItemModal.kindOfVideo == "1") { //google drive
				return 'https://docs.google.com/vt?id=' + scope.newVideoItemModal.videoId;
			} else {
				return '';
			}	
		};


	 	newVideoItemModalSrv.showModal(scope).then(function(response) {
	 		VideoRestSrv.add(AppSrv.currentCategory, scope.newVideoItemModal.kindOfVideo, scope.newVideoItemModal.videoId, scope.newVideoItemModal.description).then(function(serverResponse) {
 				deferred.resolve(serverResponse);
	 		});
	 	});

	 	return deferred.promise;
	 }


	/**
	 *
	 */
	 vm.add = function(scope, categoryType) {

	 	//text
	 	if (categoryType == AppEnums.CategoryType.TEXT) {
	 		return _addItemText(scope);

	 	//video
	 	} else {
	 		return _addItemVideo(scope);

	 	}
	 }	

	/**
	 *
	 */
	vm.del = function(cd_item) {
		return ItemRestSrv.del(cd_item);
	}

	/**
	 *
	 */
	vm.favorite = {

		set: function(cd_item, bl_favorite) {
			var deferred = $q.defer();
			ItemRestSrv.favorite.set(cd_item, bl_favorite).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFavorite);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		},

		get: function(cd_item) {
			var deferred = $q.defer();
			ItemRestSrv.favorite.get(cd_item).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFavorite);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		}

	}


});