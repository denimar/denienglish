angular.module('app').service('ItemRestSrv', function(AppSrv) {

	var vm = this;

	vm.list = function(cd_categoria) {
		return AppSrv.requestWithPromise('item/list', {'cd_categoria': cd_categoria});
	}

	vm.get = function(cd_item) {
		return AppSrv.requestWithPromise('item/get', {'cd_item': cd_item});
	}

	vm.add = function(topCategoryNode, cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Inserting',
			message: 'Item added successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/add', {'topCategoryNode': topCategoryNode, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	vm.upd = function(cd_item, cd_categoria, ds_item, bt_imagem) {
		var successfullyMessage = {
			title: 'Updating',
			message: 'Item updated successfully!'
		}
		return AppSrv.requestWithPromisePayLoad('item/upd', {'cd_item': cd_item, 'cd_categoria': cd_categoria, 'ds_item': ds_item}, {'bt_imagem': bt_imagem}, successfullyMessage);		
	}

	vm.del = function(cd_item) {
		var successfullyMessage = {
			title: 'Deleting',
			message: 'Item deleted successfully!'
		}
		return AppSrv.requestWithPromise('item/del', {'cd_item': cd_item}, successfullyMessage, 'Confirm deleting?');
	}

	vm.favorite = {

		set: function(cd_item, bl_favorite) {
			return AppSrv.requestWithPromise('item/favorite/set', {'cd_item': cd_item, 'bl_favorite': bl_favorite});
		},

		get: function(cd_item) {
			return AppSrv.requestWithPromise('item/favorite/get', {'cd_item': cd_item});			
		}

	}	

});