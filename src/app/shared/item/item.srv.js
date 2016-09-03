angular.module('app').service('itemSrv', function($rootScope, $q, ItemRestSrv, AppSrv, uiDeniModalSrv, newVideoItemModalSrv, AppEnums, VideoRestSrv, AppConsts) {

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
	 	scope.newVideoItemModal = {
	 		canShowImagePreview: false,
	 		tp_video: 0
	 	};

		scope.newVideoItemModal.getImagePreviewUrl = function() {
			scope.newVideoItemModal.canShowImagePreview = (scope.newVideoItemModal.id_video) &&
				                                          (
			                                                ((scope.newVideoItemModal.tp_video == 0) && (scope.newVideoItemModal.id_video.length == 11)) || //youtube
														    ((scope.newVideoItemModal.tp_video == 1) && (scope.newVideoItemModal.id_video.length == 28)) //google drive
														  );  

		    if (scope.newVideoItemModal.canShowImagePreview) {
				return AppConsts.SERVER_URL + 'item/image/getlink?tp_video=' + scope.newVideoItemModal.tp_video + '&id_video=' + scope.newVideoItemModal.id_video
			} 
			return null;

			/*
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/0.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/1.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/2.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/3.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/jpg.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/mqdefault.jpg';
			//return 'https://img.youtube.com/vi/' + scope.newVideoItemModal.id_video '/maxresdefault.jpg';
			*/
		};


	 	newVideoItemModalSrv.showModal(scope).then(function(response) {
	 		$rootScope.loading = true;
	 		VideoRestSrv.add(AppSrv.currentCategory, scope.newVideoItemModal.tp_video, scope.newVideoItemModal.id_video, scope.newVideoItemModal.description).then(function(serverResponse) {
 				deferred.resolve(serverResponse);
 				$rootScope.loading = false;
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

	/**
	 *
	 */
	vm.revision = {

		set: function(cd_item, bl_fazer_revisao) {
			var deferred = $q.defer();
			ItemRestSrv.revision.set(cd_item, bl_fazer_revisao).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		},

		get: function(cd_item) {
			var deferred = $q.defer();
			ItemRestSrv.revision.get(cd_item).then(function(serverReturn) {
				deferred.resolve(serverReturn.data.data[0].blFazerRevisao);
			}, function(reason) {
				deferred.reject(reason);
			});
			return deferred.promise;
		}

	}

});