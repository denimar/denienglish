(function() {
	'use strict';
	
	angular
		.module('item')
		.service('itemRestService', itemRestService);

	function itemRestService(restService) {
		var vm = this;

		vm.list = function(cd_categoria) {
			return restService.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
		}

		vm.get = function(cd_item) {
			return restService.requestWithPromise('item/get', {'cd_item': cd_item});
		}

		vm.add = function(topCategoryNode, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Item added successfully!'
			}
			return restService.requestWithPromisePayLoad('item/add', {'topCategoryNode': topCategoryNode, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		vm.upd = function(cd_item, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Item updated successfully!'
			}
			return restService.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		vm.del = function(cd_item) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Item deleted successfully!'
			}
			return restService.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
		}

		vm.favorite = {

			set: function(cd_item, bl_favorite) {
				return restService.requestWithPromise('item/favorite/set', {'cd_item': cd_item, 'bl_favorite': bl_favorite});
			},

			get: function(cd_item) {
				return restService.requestWithPromise('item/favorite/get', {'cd_item': cd_item});			
			}

		}	

		vm.revision = {

			set: function(cd_item, bl_fazer_revisao) {
				return restService.requestWithPromise('item/revision/set', {'cd_item': cd_item, 'bl_fazer_revisao': bl_fazer_revisao});
			},

			get: function(cd_item) {
				return restService.requestWithPromise('item/revision/get', {'cd_item': cd_item});			
			}

		}	


	};

})();	