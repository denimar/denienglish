(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.controller('uiDeniGridCtrl', uiDeniGridCtrl);

	function uiDeniGridCtrl($scope, $element, $timeout, uiDeniGridSrv, uiDeniGridUtilSrv, uiDeniGridConstants) {
		var vm = this;
		vm.scope = $scope;
		vm.enabled = true;
		vm.checkedRecords = [];
		vm.filterInfo = null;
		vm.searchInfo = null;	
		
		//
		vm.loading = false;	

		//
		vm.element = $element;	

	    //
	    vm.wrapper = vm.element.find('.ui-deni-grid-wrapper');
	    vm.viewport = vm.wrapper.find('.ui-deni-grid-viewport');
	    vm.container = vm.viewport.find('.ui-deni-grid-container');

	    // *************************************************************************
	    // VARIABLE COLUMNS
	    // *************************************************************************
	    vm.colsViewportWrapper = vm.container.find('.ui-variable-cols-viewport-wrapper');
	    vm.colsViewport = vm.colsViewportWrapper.find('.ui-viewport');
	    vm.colsContainer = vm.colsViewport.find('.ui-container');

	    // header
	    vm.headerViewportWrapper = vm.colsContainer.find('.ui-header-viewport-wrapper');
		vm.headerViewport = vm.headerViewportWrapper.find('.ui-header-viewport');
		vm.headerContainer = vm.headerViewport.find('.ui-header-container');	
		// body
	    vm.bodyViewportWrapper = vm.colsContainer.find('.ui-body-viewport-wrapper');
		vm.bodyViewport = vm.bodyViewportWrapper.find('.ui-body-viewport');
		vm.bodyContainer = vm.bodyViewport.find('.ui-body-container');	
		//footer
		vm.footerViewportWrapper = vm.colsContainer.find('.ui-footer-viewport-wrapper');
		vm.footerViewport = vm.footerViewportWrapper.find('.ui-footer-viewport');
		vm.footerContainer = vm.footerViewport.find('.ui-footer-container');
	    // *************************************************************************
	    // *************************************************************************

	    // *************************************************************************
	    // FIXED COLUMNS
	    // *************************************************************************
	    vm.fixedColsViewportWrapper = vm.container.find('.ui-fixed-cols-viewport-wrapper');
	    vm.fixedColsViewport = vm.fixedColsViewportWrapper.find('.ui-viewport');
	    vm.fixedColsContainer = vm.fixedColsViewport.find('.ui-container');

	    // header    
	    vm.fixedColsHeaderViewportWrapper = vm.fixedColsContainer.find('.ui-header-viewport-wrapper');
		vm.fixedColsHeaderViewport = vm.fixedColsHeaderViewportWrapper.find('.ui-header-viewport');
		vm.fixedColsHeaderContainer = vm.fixedColsHeaderViewport.find('.ui-header-container');	
	    // body	
	    vm.fixedColsBodyViewportWrapper = vm.fixedColsContainer.find('.ui-body-viewport-wrapper');
		vm.fixedColsBodyViewport = vm.fixedColsBodyViewportWrapper.find('.ui-body-viewport');
		vm.fixedColsBodyContainer = vm.fixedColsBodyViewport.find('.ui-body-container');	
	    // footer	
		vm.fixedColsFooterViewportWrapper = vm.fixedColsContainer.find('.ui-footer-viewport-wrapper');
		vm.fixedColsFooterViewport = vm.footerViewportWrapper.find('.ui-footer-viewport');
		vm.fixedColsFooterContainer = vm.footerViewport.find('.ui-footer-container');
	    // *************************************************************************
	    // *************************************************************************

		var currentHeight = vm.element.css('height');
		/*
		$timeout(function() {
			if (vm.element.css('height') != currentHeight) {
				currentHeight = vm.element.css('height');
				vm.wrapper.css('height', currentHeight);
				vm.element.css('height', currentHeight);
			}
		}, 2000);
		*/

	    //Paging
		vm.paging = vm.viewport.find('.ui-deni-grid-paging');    

		//Set the default options
		uiDeniGridUtilSrv.setDefaultOptions(vm, vm.options);
		
		vm.options.alldata = []; //It is used when I filter the data and there is a need to know the original data
		
		//Inherit API from ui-deni-view and create some new APIs too		
		vm.options.api = _getApi(vm, uiDeniGridSrv);

		vm.element.show(function(event) {
			///////////////////////////////////////////////////////////////////////////
			//FIXED COLUMNS ///////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (vm.options.fixedCols) {
				//
				vm.fixedColsViewportWrapper.css('width', vm.options.fixedCols.width + 'px');
				//
				vm.colsViewportWrapper.css('width', 'calc(100% - ' + vm.fixedColsViewportWrapper.css('width') + ')');		
			} else {
				//
				vm.fixedColsViewportWrapper.css('display', 'none');
				//
				vm.colsViewportWrapper.css('width', '100%');				
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			///
			vm.clientWidth = uiDeniGridUtilSrv.getClientWidthDeniGrid(vm);	

			///////////////////////////////////////////////////////////////////////////
			//COLUMN HEADERS //////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (vm.options.hideHeaders) {
				//
				vm.headerViewportWrapper.css('display', 'none');
				vm.fixedColsHeaderViewportWrapper.css('display', 'none');
			} else {
				//columnHeaderLevels has a numer greater than one when it has a grouped column headers.
				vm.columnHeaderLevels = uiDeniGridUtilSrv.getColumnHeaderLevels(vm, vm.options.columns);

				if (vm.columnHeaderLevels > 1) {
					//realPercentageWidth cause effect only when there are more then one level of columns
					uiDeniGridUtilSrv.setRealPercentageWidths(vm.options.columns, '100%');
				}

				//
				uiDeniGridSrv.createColumnHeaders(vm, vm.options.columns);
				uiDeniGridSrv.createColumnHeadersEvents(vm);		

				//the height of the column headers varies when there is grouped column headers (Just in this case)
				vm.headerViewportWrapper.css('height', 'calc(' + vm.options.columnHeaderHeight + ' * ' + vm.columnHeaderLevels + ')');
				vm.fixedColsHeaderViewportWrapper.css('height', 'calc(' + vm.options.columnHeaderHeight + ' * ' + vm.columnHeaderLevels + ')');
			}	
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			///////////////////////////////////////////////////////////////////////////
			//GRID FOOTER /////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	
			if (vm.options.colLines) {
				vm.headerContainer.find('.ui-header-container-column').css('border-right', 'solid 1px silver');
			}
			
			//How many column footer rows is there in the grid (footer.grid different from false)
			vm.columnFooterRowsNumberGrid = uiDeniGridUtilSrv.getColumnFooterRowsNumber(vm);		
			//How many grouping footer rows is there in the grid (footer.grouping different from false)
			vm.columnFooterRowsNumberGrouping = uiDeniGridUtilSrv.getColumnFooterRowsNumber(vm, true);		
			//
			vm.columnFooterNumber = uiDeniGridUtilSrv.getColumnFooterNumber(vm);		

			//Should show the footer?
			if ((uiDeniGridUtilSrv.hasColumnFooter(vm)) && (vm.columnFooterRowsNumberGrid > 0)) {
				//
				uiDeniGridUtilSrv.createColumnFooters(vm, vm.footerContainer, vm.options.columns, true);
				//How many footers?
				var columnFooterRowsNumber = vm.footerContainer.find('.ui-footer-row').length;
				//There is no need to add paadding when a footerRowTemplate was set
				var padding = angular.isDefined(vm.options.footerRowTemplate) ? '0px' : '2px';
				vm.footerViewportWrapper.css({
					'padding-top': padding,
					//'padding-bottom': padding,			
					//'height': 'calc(' + vm.options.columnFooterRowHeight + ' * ' + columnFooterRowsNumber + ' + (' + padding + ' * 2))'
				});
			} else {
				//
				vm.footerViewportWrapper.css('display', 'none');
				vm.fixedColsFooterViewportWrapper.css('display', 'none');
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////	

			//Paging
			if (vm.options.paging) {
				vm.paging.css('height', uiDeniGridConstants.PAGING_HEIGHT);
				uiDeniGridUtilSrv.createPagingItems(vm, vm.paging, vm.options.paging);
			}

			vm.searchInfo = null; //hold values for render the field values (realce)
			vm.searching = false;
			vm.resizing = false;

			//This guy manages which items the grid should render
			vm.managerRendererItems = new uiDeniGridUtilSrv.ManagerRendererItems(vm);

			//Create Events for the ui-deni-view
			uiDeniGridSrv.createUiDeniViewEvents(vm);  //TODO: change the name of this method

			//
			uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(vm);

			if (vm.options.data) {
				vm.options.api.loadData(vm.options.data);
			} else if ((vm.options.url) && (vm.options.autoLoad)) {
				vm.options.api.load();
			}
		});

	}

	function _getApi(controller, uiDeniGridSrv) {

		return {
			/**
			 *	
			 *
			 */		 
			clearSelections: function() {
	        	uiDeniGridSrv.clearSelections(controller);
			},

			/**
			 *	
			 *
			 */		 
			find: function(valuesToFind, opts) {
				return uiDeniGridSrv.find(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findFirst: function(valuesToFind, opts) {
				return uiDeniGridSrv.findFirst(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findKey: function(keyValue, opts) {
				return uiDeniGridSrv.findKey(controller, keyValue, opts);
			},

			/**
			 *	
			 *
			 */		 
			findLast: function(valuesToFind, opts) {
				return uiDeniGridSrv.findLast(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findNext: function(valuesToFind, opts) {
				return uiDeniGridSrv.findNext(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			findPrevious: function(valuesToFind, opts) {
				return uiDeniGridSrv.findPrevious(controller, valuesToFind, opts);
			},

			/**
			 *	
			 *
			 */		 
			filter: function(valuesToFilter, opts) {
				return uiDeniGridSrv.filter(controller, valuesToFilter, opts);
			},


			/**
			 *	
			 *
			*/		 
	        getChangedRecords: function() {
	        	return uiDeniGridSrv.getChangedRecords(controller);
	        },

			/**
			 *	
			 *
			*/		 
	        getColumn: function(fieldName) {
	        	return uiDeniGridSrv.getColumn(controller, fieldName);
	        },


			/**
			 *	
			 *
			 */		 
			getEnabled: function(enabled) {
				return controller.enabled;
			},

			/**
			 *	
			 *
			 */		 
			getPageNumber: function() {
				return uiDeniGridSrv.getPageNumber(controller);
			},

			/**
			 *	
			 *
			 */		 
			getRowHeight: function() {
				return uiDeniGridSrv.getRowIndex(controller);
			},

			/**
			 *	
			 *
			*/		 
	        getRowIndex: function(record) {
	        	return uiDeniGridSrv.getRowIndex(controller, record);
	        },


			/**
			 *	
			 *
			*/		 
	        getSelectedRow: function() {
	        	return uiDeniGridSrv.getSelectedRow(controller);
	        },

			/**
			 *	
			 *
			*/		 
	        getSelectedRowIndex: function() {
	        	return uiDeniGridSrv.getSelectedRowIndex(controller);
	        },

			/**
			 *	
			 *
			 */
			isEnableGrouping: function() {
				return uiDeniGridSrv.isEnableGrouping(controller);
			},

			/**
			 *	
			 *
			 */
			isGrouped: function() {
				return uiDeniGridSrv.isGrouped(controller);
			},	        

			/**
			 *	
			 *
			*/		 
			isRowSelected: function(row) {        
	        	return uiDeniGridSrv.isRowSelected(controller, row);
	        },

			/**
			 * @param row {Element|Integer} Can be the rowIndex or a jquery element row
			 * 
			 */
			isRowVisible: function(row) {
				return uiDeniGridSrv.isRowVisible(controller, row);							
			},

			/**
			 *	
			 *
			 */
			load: function() {
				uiDeniGridSrv.load(controller);
			},

			/**
			 *	
			 *
			 */
			loadData: function(data) {
				uiDeniGridSrv.loadData(controller, data);							
			},


			/**
			 *	
			 *
			*/		 
			isHideHeaders: function() {        
	        	return uiDeniGridSrv.isHideHeaders(controller);
	        },

			/**
			 *	
			 *
			 */
			reload: function() {
				return uiDeniGridSrv.reload(controller);
			},

			/**
			 *	
			 *
			 */
			removeRow: function(row) {
				uiDeniGridSrv.removeRow(controller, row);
			},

			/**
			 *	
			 *
			 */
			removeSelectedRows: function() {
				uiDeniGridSrv.removeSelectedRows(controller);
			},

			/**
			 *	
			 *
			*/		 
	        resolveRowElement: function(row) {
	        	return uiDeniGridSrv.resolveRowElement(controller, row);        	
	        },	

			/**
			 *	
			 *
			*/		 
	        resolveRowIndex: function(row) {
	        	return uiDeniGridSrv.resolveRowIndex(controller, row);        	
	        },	


			/**
			 *	
			 *
			 */
			repaint: function() {
				uiDeniGridSrv.repaint(controller);							
			},

			/**
			 *	
			 *
			 */
			repaintRow: function(row) {
				return uiDeniGridSrv.repaintRow(controller, row);							
			},

			/**
			 *	
			 *
			 */
			repaintSelectedRow: function() {
				return uiDeniGridSrv.repaintSelectedRow(controller);
			},


			/**
			 *	
			 *
			 */
			setDisableGrouping: function() {
				uiDeniGridSrv.setDisableGrouping(controller);
			},

			/**
			 *	
			 *
			 */
			setEnableGrouping: function() {
				uiDeniGridSrv.setEnableGrouping(controller);
			},

			/**
			 *	
			 *
			*/		 
			setHideHeaders: function(hideHeaders) {
				return uiDeniGridSrv.setHideHeaders(controller, hideHeaders);
			},

			/**
			 *	
			 *
			 */		 
			selectAll: function() {
	        	uiDeniGridSrv.selectAll(controller);
			},

			/**
			 *	
			 *
			 */		 
			setEnabled: function(enabled) {
				uiDeniGridSrv.setEnabled(controller, enabled);
			},

			/**
			 *	
			 *
			*/		 
	        selectRow: function(row, preventSelecionChange, scrollIntoView) {
	        	uiDeniGridSrv.selectRow(controller, row, preventSelecionChange, scrollIntoView);
	        },

			/**
			 *	
			 *
			 */		 
			setPageNumber: function(pageNumber) {
				uiDeniGridSrv.setPageNumber(controller, pageNumber);
			},

			/**
			 *	
			 *
			 */		 
			setRowHeight: function(rowHeight) {
				uiDeniGridSrv.setRowHeight(controller, rowHeight);
			},

			/**
			 *	
			 *
			 */
			setToogleGrouping: function() {
				uiDeniGridSrv.setToogleGrouping(controller);
			},


			/**
			 *	
			 * holdSelection {boolean} true is default
			*/		 
	        sort: function(sorters, holdSelection) {
	        	controller.options.sorters = uiDeniGridSrv.sort(controller, sorters, holdSelection);
	        	return controller.options.sorters;
	        },

			/**
			 *	
			 *
			*/		 
	        updateSelectedRow: function(json) {
	        	uiDeniGridSrv.updateSelectedRow(controller, json);
	        },

			/**
			 *	
			 *
			*/		 
	        updateCell: function(rowIndex, colIndex, value) {
	        	uiDeniGridSrv.updateCell(controller, rowIndex, colIndex, value);
	        },
			
			/**
			 *	
			 *
			*/		 
	        updateSelectedCell: function(value) {
	        	uiDeniGridSrv.updateSelectedCell(controller, value);
	        }
	    };
	}

})();
