angular.module('app').controller('HomeCtrl', function($sce, $scope, $rootScope, $routeParams, $log, $timeout, $mdSidenav, AppConsts, AppEnums, AppSrv, ItemRestSrv, itemSrv, uiDeniModalSrv, ItemRestSrv, StringSrv, spacedRevisionSrv, categorySrv) {
	
	var vm = this;

	var TREEVIEW_ID = '#categoryTreeview';
	var jsTreeInstance = null;
	
	AppSrv.createHamburgerButton(['show-xs', 'hide-gt-xs'], AppEnums.Side.LEFT);

	vm.categoryPath = null;
	vm.currentNavItem = "pageItems";
	vm.currentCategoryNode = null; //Category Node
	
	$.jstree.defaults.core.themes.variant = "large";	

	vm.addCategoryClick = function() {
		categorySrv.add($scope, vm.currentCategoryNode.id).then(function(addedCategory) {
			var newNode = { 
				state: "open", 
				id: addedCategory.cdCategoria,				
				text: addedCategory.dsCategoria,
				data: addedCategory
			};

			jsTreeInstance.create_node(vm.currentCategoryNode.id, newNode, 'last', function(addedNode) {
				jsTreeInstance.deselect_all();
				jsTreeInstance.select_node(addedNode);
			});		
		});
	}	

	vm.editCategoryClick = function() {
		categorySrv.rename($scope, vm.currentCategoryNode.id, vm.currentCategoryNode.text).then(function(renamedCategory) {
			jsTreeInstance.rename_node(vm.currentCategoryNode, renamedCategory);
		});
	}	

	vm.delCategoryClick = function() {
		categorySrv.del(vm.currentCategoryNode.id).then(function(serverResponse) {
			var parentNode = jsTreeInstance.get_node(vm.currentCategoryNode.parent);
			jsTreeInstance.delete_node([vm.currentCategoryNode]);
			jsTreeInstance.select_node(parentNode);
		});
	}

	var _reloadDataGrid = function() {
		if (vm.currentCategoryNode) {
	 		//Items
	    	if (vm.currentNavItem == 'pageItems') {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'item/list?cd_categoria=' + vm.currentCategoryNode.id;
	    	//Revisions
	    	} else if (vm.currentNavItem == 'pageRevisions') {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'revision/list?pendente=true&days=5&cd_categoria=' + vm.currentCategoryNode.id;
	    	//Favorites
	    	} else {
				$scope.gridOptions.url = AppConsts.SERVER_URL + 'item/favorite/get?cd_categoria=' + vm.currentCategoryNode.id;
	    	}
					
			$scope.gridOptions.api.reload();
		}	
	}

    vm.isOpenRight = function(){
      return $mdSidenav('left').isOpen();
    };	

  	$(TREEVIEW_ID)
		.on('loaded.jstree', function (e, data) {
			jsTreeInstance = data.instance;
			var categoryToSet = AppSrv.currentCategory || $routeParams.cdCategoria;
			if (categoryToSet) {
				jsTreeInstance.select_node(categoryToSet);
			}	
		})
		.on('changed.jstree', function (e, data) {
		  if (data.node) {
				vm.setCurrentCategory(data);
				_reloadDataGrid();			  
		  }  
		})
		.jstree({
			'core' : {
				check_callback: true,
				'data' : {
					"url" : AppConsts.SERVER_URL + 'category/category/tree/list',				
					//"url" : "//www.jstree.com/fiddle/",
					"dataType" : "json" // needed only if you do not supply JSON headers
				},
			},
			plugins : [
				"wholerow"
			],
		});

		
	var _getTopParentNode = function() {
		if (vm.currentCategoryNode.parent == '#') {
			return vm.currentCategoryNode.id;
		} else {
			return vm.currentCategoryNode.parents[vm.currentCategoryNode.parents.length - 2];
		}	
	}

    $scope.gridOptions = {
    	hideHeaders: true,
		colLines: false,
    	keyField: 'cdItem',
        rowHeight: '100px', //22px is default
        columns: [
        	{
        		header: 'Item',
        		name: 'cdItem',
        		width: 'calc(100% - 96px)',
        		renderer: function(value, record) {
					var linkViewItem = null;
					var topParentNode = _getTopParentNode();
					
					if (topParentNode == AppEnums.CategoryType.TEXT) {
						linkViewItem = '/text';
					} else {
						linkViewItem = '/video';						
					}
					var time = new Date();
					var miliseconds = time.getMilliseconds();
					var favorite = record.blFavorite ? 'star' : 'star_border';
					var selected = record.blFavorite ? 'selected' : '';
  					var cellTemplate = '<div class="cell-template">\n' +
									   '    <img class="item-image"\n' +
									   '        src="{0}item/image/get?topCategoryNode={8}&cd_item={1}&time={5}" \n' +
									   '    />\n' +                                  
									   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
									   '    <div>{4}</div>\n' +									   
									   '    <md-icon class="material-icons favorite {6}" ng-click="funcaoTeste()"> {7} </md-icon>\n' +
									   '<div>';

  					return StringSrv.format(cellTemplate, AppConsts.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', miliseconds, selected, favorite, topParentNode);
        		}
        	},
        	{
        		width: '32px',
	            action: {
	                mdIcon: 'restore',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						spacedRevisionSrv.showModal(record.cdItem);
	                }
	            }        		
        	},
        	{
        		width: '32px',
	            action: {
	                mdIcon: 'edit',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						var rowEl = $(imgActionColumn).closest('.ui-row');
						var imgEl = rowEl.find('.item-image');

						var config = {
							description: record.dsItem,
							imgSrc: imgEl.attr('src')
						};

						var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage(config);
						wndDescriptionMorImage.show().then(function(response) {
							if (response.button == 'ok') {								
								ItemRestSrv.upd(record.cdItem, AppSrv.currentCategory, response.data.description, response.data.image).then(function(responseUpd) {
									$scope.gridOptions.api.reload().then(function(responseData) {
										imgEl.attr('src', response.data.image);								

										var cdItemUpdated = responseUpd.data[0].cdItem;
								        $scope.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
									});
								});				
							}
						});
	                }
	            }        		
        	},
        	{
        		width: '32px',
	            action: {
	                mdIcon: 'delete_forever',
	                tooltip: '',
	                fn: function(record, column, imgActionColumn) {
						itemSrv.del(record.cdItem).then(function() {
							$scope.gridOptions.api.reload();
						});	                	
	                }
	            }        		
        	}

        ],
        listeners: {
			onafterload: function(data, options) {
			},

            onafterrepaintrow: function(rowIndex, elementRow) {
				$timeout(function() {
					elementRow.find('.material-icons.favorite').click(function(event) {
						var record = $scope.gridOptions.api.getSelectedRow();
						itemSrv.favorite.set(record.cdItem, !record.blFavorite).then(function(blFavorite) {
							record.blFavorite = blFavorite;						
							$scope.gridOptions.api.repaintSelectedRow();						
						});
					});
				}, 500);
            }
		}			

        /*
        listeners: {
			onafterload: function(data, options) {

				$('.ui-cell.action-buttons').click(function(event) {
					var button = $(event.currentTarget);
					var record = $scope.gridOptions.api.getSelectedRow();

					if (button.is('.btn-revision')) {
						alert('btn-revision');
						//ItemRestSrv.del(record.cdItem);
					} else if (button.is('.btn-edit')) {
						var rowEl = $(event.currentTarget).closest('.row-template');
						var imgEl = rowEl.find('.item-image');

						var config = {
							description: record.dsItem,
							imgSrc: imgEl.attr('src')
						};

						var wndDescriptionMorImage = uiDeniModalSrv.createWindowDescriptionMoreImage(config);
						wndDescriptionMorImage.show().then(function(response) {
							if (response.button == 'ok') {
								ItemRestSrv.upd(record.cdItem, AppSrv.currentCategory, response.data.description, response.data.image).then(function(responseUpd) {
									$scope.gridOptions.api.reload().then(function(responseData) {
										var cdItemUpdated = responseUpd.data[0].cdItem;
								        $scope.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
									});
								});				
							}
						});
					} else if (button.is('.btn-delete')) {
						ItemRestSrv.del(record.cdItem).then(function() {
							$scope.gridOptions.api.reload();
						});
					}

				});

			}
        }
        */
    };		

    /*
    vm.setCurrentNavItem = function(currentNavItemName) {
    	vm.currentNavItem = currentNavItemName;
    	_reloadDataGrid();
    }
    */
    $scope.$watch('ctrl.currentNavItem', function(newCurrentNavItem, oldCurrentNavItem) {
    	vm.currentNavItem = newCurrentNavItem;
    	if (newCurrentNavItem) {
    		_reloadDataGrid();
    	}
    });


    vm.setCurrentCategory = function(nodeData) {
    	vm.currentCategoryNode = nodeData.node;
		AppSrv.currentCategory = vm.currentCategoryNode.id;

    	var path = '<span class="categoryPathTitle">' + vm.currentCategoryNode.text + '</span>';

    	var parentId = vm.currentCategoryNode.parent;
    	while (parentId != '#') { //# means root node
    		var parentObj = nodeData.instance.get_node(parentId);
    		path = parentObj.text + " / " + path;

    		var parentId = parentObj.parent;
    	}

		vm.categoryPath = path;
    }

    vm.addNewItemButtonClick = function(event) {
    	var topParentNode = _getTopParentNode();
    	var fnNewItem;

		itemSrv.add($scope, topParentNode).then(function(addedItem) {
			$scope.gridOptions.api.reload().then(function(responseData) {
				var cdItemAdded = addedItem.data[0].cdItem;
		        $scope.gridOptions.api.findKey(cdItemAdded, {inLine: true});						
			});
		});
    }


});