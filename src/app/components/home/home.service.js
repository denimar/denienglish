(function() {
	
	'use strict';

	angular
		.module('app')
		.service('homeService', homeService);

	function homeService($timeout, $rootScope, generalService, categoryService, restService, itemService, stringService, spacedRevisionModalService, uiDeniModalSrv, itemRestService, textService) {

		var vm = this;
		var jsTreeInstance = null;

		/**
		 *
		 *
		 */
		vm.addCategoryClick = function(scope, currentCategoryId) {
			categoryService.add(scope, currentCategoryId).then(function(addedCategory) {
				var newNode = { 
					state: "open", 
					id: addedCategory.cdCategoria,				
					text: addedCategory.dsCategoria,
					data: addedCategory
				};

				jsTreeInstance.create_node(currentCategoryId, newNode, 'last', function(addedNode) {
					jsTreeInstance.deselect_all();
					jsTreeInstance.select_node(addedNode);
				});		
			});
		};	


		/**
		 *
		 *
		 */
		vm.editCategoryClick = function(scope, currentCategoryNode) {
			categoryService.rename(scope, currentCategoryNode.id, currentCategoryNode.text).then(function(renamedCategory) {
				jsTreeInstance.rename_node(currentCategoryNode, renamedCategory);
			});
		};

		/**
		 *
		 *
		 */
		vm.delCategoryClick = function(currentCategoryNode) {
			categoryService.del(currentCategoryNode.id).then(function(serverResponse) {
				var parentNode = jsTreeInstance.get_node(currentCategoryNode.parent);
				jsTreeInstance.delete_node([currentCategoryNode]);
				jsTreeInstance.select_node(parentNode);
			});
		};

		/**
		 *
		 *
		 */
		var _getTopParentNode = function(controller) {
			if (controller.currentCategoryNode.parent == '#') {
				return controller.currentCategoryNode.id;
			} else {
				return controller.currentCategoryNode.parents[controller.currentCategoryNode.parents.length - 2];
			}	
		};


		/**
		 *
		 *
		 */
	    vm.addNewItemButtonClick = function(controller, scope, event) {
	    	var topParentNode = _getTopParentNode(controller);
	    	var fnNewItem;

			itemService.add(scope, topParentNode, controller.currentCategoryNode).then(function(addedItem) {
				controller.gridOptions.api.reload().then(function(responseData) {
					var objAdded = addedItem.data[0];
					var cdItemAdded = objAdded.cdItem || objAdded.t05itm.cdItem;
			        controller.gridOptions.api.findKey(cdItemAdded, {inLine: true});						
				});
			});
	    };


		/**
		 *
		 *
		 */
	    var _setCurrentCategory = function(controller, nodeData) {
	    	controller.currentCategoryNode = nodeData.node;
			controller.currentCategory = controller.currentCategoryNode.id;

	    	var path = '<span class="categoryPathTitle">' + controller.currentCategoryNode.text + '</span>';

	    	var parentId = controller.currentCategoryNode.parent;
	    	while (parentId != '#') { //# means root node
	    		var parentObj = nodeData.instance.get_node(parentId);
	    		path = parentObj.text + " / " + path;

	    		var parentId = parentObj.parent;
	    	}

			controller.categoryPath = path;
	    };	

		/**
		 *
		 *
		 */
	    vm.reloadDataGrid = function(controller) {

			if (controller.currentCategoryNode) {
		 		//Items
		    	if (controller.currentNavItem == 'pageItems') {
					controller.gridOptions.url = restService.SERVER_URL + 'item/list?cd_categoria=' + controller.currentCategoryNode.id;
		    	//Revisions
		    	} else if (controller.currentNavItem == 'pageRevisions') {
					controller.gridOptions.url = restService.SERVER_URL + 'revision/list?pendente=true&days=5&cd_categoria=' + controller.currentCategoryNode.id;
		    	//Favorites
		    	} else {
					controller.gridOptions.url = restService.SERVER_URL + 'item/favorite/get?cd_categoria=' + controller.currentCategoryNode.id;
		    	}
						
				controller.gridOptions.api.reload();
			}	

	    };

		/**
		 *
		 *
		 */
		vm.configureTreeView = function(controller) {

		  	$('#categoryTreeview')
				.on('loaded.jstree', function (e, data) {
					jsTreeInstance = data.instance;
					if (controller.currentCategory) {
						jsTreeInstance.select_node(controller.currentCategory);
					}	
				})
				.on('changed.jstree', function (e, data) {
				  if (data.node) {
						_setCurrentCategory(controller, data);
						vm.reloadDataGrid(controller);			  
				  }  
				})
				.jstree({
					'core' : {
						check_callback: true,
						'data' : {
							"url" : restService.SERVER_URL + 'category/category/tree/list',				
							//"url" : "//www.jstree.com/fiddle/",
							"dataType" : "json" // needed only if you do not supply JSON headers
						},
					},
					plugins : [
						"wholerow"
					],
				});

		};

		/**
		 *
		 *
		 */
		vm.configureGridItems = function(controller, scope) {
		    controller.gridOptions = {
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
							var topParentNode = _getTopParentNode(controller);
							
							if (topParentNode == textService.topParentNodeId) {
								linkViewItem = '/text';
							} else {
								linkViewItem = '/video';						
							}
							var time = new Date();
							var miliseconds = time.getMilliseconds();

							var revise = record.blFazerRevisao ? 'check_box' : 'check_box_outline_blank';						
							var reviseSelected = record.blFazerRevisao ? 'selected' : '';
							
							var favorite = record.blFavorite ? 'star' : 'star_border';
							var favoriteSelected = record.blFavorite ? 'selected' : '';						

		  					var cellTemplate = '<div class="cell-template">\n' +
											   '    <img class="item-image"\n' +
											   '        src="{0}item/image/get?cd_item={1}&time={5}" \n' +
											   '    />\n' +                                  
											   '    <div><a href="#{2}/{1}">{3}</a></div>\n' +
											   '    <div>{4}</div>\n' +									   
											   '    <md-icon class="material-icons revise {6}"> {7} </md-icon>\n' +										   										   
											   '    <md-icon class="material-icons favorite {8}"> {9} </md-icon>\n' +
											   '<div>';

		  					return stringService.format(cellTemplate, restService.SERVER_URL, record.cdItem, linkViewItem, record.dsItem, 'blá blá blá blá', miliseconds, reviseSelected, revise, favoriteSelected, favorite);
		        		}
		        	},
		        	{
		        		width: '32px',
			            action: {
			                mdIcon: 'restore',
			                tooltip: '',
			                fn: function(record, column, imgActionColumn) {
								spacedRevisionModalService.showModal(scope, record.cdItem);
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
										var uriImage = generalService.getDataURLImagemObjeto(response.data.imageEl.get(0), 160, 140, 1);
										itemRestService.upd(record.cdItem, controller.currentCategory, response.data.description, uriImage).then(function(responseUpd) {
											controller.gridOptions.api.reload().then(function(responseData) {
												imgEl.attr('src', response.data.image);								

												var cdItemUpdated = responseUpd.data[0].cdItem;
										        controller.gridOptions.api.findKey(cdItemUpdated, {inLine: true});						
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
								itemService.del(record.cdItem).then(function() {
									controller.gridOptions.api.reload();
								});	                	
			                }
			            }        		
		        	}

		        ],
		        listeners: {
					onbeforeload: function(data, options) {
						$rootScope.subTitle = '';
					},

		            onafterrepaintrow: function(rowIndex, elementRow) {
						$timeout(function() {

							elementRow.find('.material-icons.revise').click(function(event) {
								var record = controller.gridOptions.api.getSelectedRow();
								record.blFazerRevisao = !record.blFazerRevisao;

								var revisionIcon = $(event.currentTarget);
								if (revisionIcon.is('.selected')) {
									revisionIcon.html('check_box_outline_blank');
									revisionIcon.removeClass('selected');
								} else {
									revisionIcon.html('check_box');
									revisionIcon.addClass('selected');
								}	

								itemService.revision.set(record.cdItem, record.blFazerRevisao).then(function(blFazerRevisao) {
									uiDeniModalSrv.ghost('Items', 'Item updated successfuly!');
								});
							});

							elementRow.find('.material-icons.favorite').click(function(event) {
								var record = controller.gridOptions.api.getSelectedRow();
								record.blFavorite = !record.blFavorite;

								var favoriteIcon = $(event.currentTarget);
								if (favoriteIcon.is('.selected')) {
									favoriteIcon.html('star_border');
									favoriteIcon.removeClass('selected');
								} else {
									favoriteIcon.html('star');
									favoriteIcon.addClass('selected');
								}	

								itemService.favorite.set(record.cdItem, record.blFavorite).then(function(blFavorite) {
									uiDeniModalSrv.ghost('Items', 'Item updated successfuly!');
								});
							});


						}, 500);
		            },

		            onselectionchange: function(ctrl, element, rowIndex, record) {
						$rootScope.subTitle = record.dsItem;
						if (!scope.$$phase) {
							scope.$apply();
						}
		            }
				}			
		    };		

		};

	};

})();	