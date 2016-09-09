(function() {
	'use strict';
	
	angular
		.module('item')
		.factory('itemDataService', itemDataService);

	function itemDataService(restService) {
		
		return {
			list: itemList,
			get: itemGet,
			add: itemAdd,
			upd: itemUpd,
			del: itemDel,
			favorite: {
				set: itemFavoriteSet,
				get: itemFavoriteGet
			},
			revision: {
				set: itemRevisionSet,
				get: itemRevisionGet
			}
		}

		/***************************************************
		 IMPLEMENTATION ************************************
		****************************************************/
		
		function itemList(cd_categoria) {
			return restService.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
		}

		function itemGet(cd_item) {
			return restService.requestWithPromise('item/get', {'cd_item': cd_item});
		}

		function itemAdd(topCategoryNode, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Inserting',
				message: 'Item added successfully!'
			}
			return restService.requestWithPromisePayLoad('item/add', {'topCategoryNode': topCategoryNode, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		function itemUpd(cd_item, cd_categoria, ds_item, bt_imagem) {
			var successfullyMessage = {
				title: 'Updating',
				message: 'Item updated successfully!'
			}
			return restService.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
		}

		function itemDel(cd_item) {
			var successfullyMessage = {
				title: 'Deleting',
				message: 'Item deleted successfully!'
			}
			return restService.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
		}

		function itemFavoriteSet(cd_item, bl_favorite) {
			return restService.requestWithPromise('item/favorite/set', {'cd_item': cd_item, 'bl_favorite': bl_favorite});
		}

		function itemFavoriteGet(cd_item) {
			return restService.requestWithPromise('item/favorite/get', {'cd_item': cd_item});			
		}

		function itemRevisionSet(cd_item, bl_fazer_revisao) {
			return restService.requestWithPromise('item/revision/set', {'cd_item': cd_item, 'bl_fazer_revisao': bl_fazer_revisao});
		}

		function itemRevisionGet(cd_item) {
			return restService.requestWithPromise('item/revision/get', {'cd_item': cd_item});			
		}

	}	

})();	
