/**
 *
 *
 *
 */
angular.module('ui-deni-grid').controller('uiDeniGridCtrl', function($scope, $element, $timeout, uiDeniGridSrv, uiDeniGridUtilSrv, uiDeniGridConstants) {
	var me = this;
	me.scope = $scope;
	me.element = $element;	
	me.checkedRecords = [];
	me.filterInfo = null;
	me.searchInfo = null;	
	me.initialData = []; //It is used when I filter the data and there is a need to know the original data

	//
	me.loading = false;	

    //
    me.wrapper = me.element.find('.ui-deni-grid-wrapper');
    me.viewport = me.wrapper.find('.ui-deni-grid-viewport');
    me.container = me.viewport.find('.ui-deni-grid-container');

    // *************************************************************************
    // VARIABLE COLUMNS
    // *************************************************************************
    me.colsViewportWrapper = me.container.find('.ui-variable-cols-viewport-wrapper');
    me.colsViewport = me.colsViewportWrapper.find('.ui-viewport');
    me.colsContainer = me.colsViewport.find('.ui-container');

    // header
    me.headerViewportWrapper = me.colsContainer.find('.ui-header-viewport-wrapper');
	me.headerViewport = me.headerViewportWrapper.find('.ui-header-viewport');
	me.headerContainer = me.headerViewport.find('.ui-header-container');	
	// body
    me.bodyViewportWrapper = me.colsContainer.find('.ui-body-viewport-wrapper');
	me.bodyViewport = me.bodyViewportWrapper.find('.ui-body-viewport');
	me.bodyContainer = me.bodyViewport.find('.ui-body-container');	
	//footer
	me.footerViewportWrapper = me.colsContainer.find('.ui-footer-viewport-wrapper');
	me.footerViewport = me.footerViewportWrapper.find('.ui-footer-viewport');
	me.footerContainer = me.footerViewport.find('.ui-footer-container');
    // *************************************************************************
    // *************************************************************************

    // *************************************************************************
    // FIXED COLUMNS
    // *************************************************************************
    me.fixedColsViewportWrapper = me.container.find('.ui-fixed-cols-viewport-wrapper');
    me.fixedColsViewport = me.fixedColsViewportWrapper.find('.ui-viewport');
    me.fixedColsContainer = me.fixedColsViewport.find('.ui-container');

    // header    
    me.fixedColsHeaderViewportWrapper = me.fixedColsContainer.find('.ui-header-viewport-wrapper');
	me.fixedColsHeaderViewport = me.fixedColsHeaderViewportWrapper.find('.ui-header-viewport');
	me.fixedColsHeaderContainer = me.fixedColsHeaderViewport.find('.ui-header-container');	
    // body	
    me.fixedColsBodyViewportWrapper = me.fixedColsContainer.find('.ui-body-viewport-wrapper');
	me.fixedColsBodyViewport = me.fixedColsBodyViewportWrapper.find('.ui-body-viewport');
	me.fixedColsBodyContainer = me.fixedColsBodyViewport.find('.ui-body-container');	
    // footer	
	me.fixedColsFooterViewportWrapper = me.fixedColsContainer.find('.ui-footer-viewport-wrapper');
	me.fixedColsFooterViewport = me.footerViewportWrapper.find('.ui-footer-viewport');
	me.fixedColsFooterContainer = me.footerViewport.find('.ui-footer-container');
    // *************************************************************************
    // *************************************************************************

	var currentHeight = me.element.css('height');
	/*
	$timeout(function() {
		if (me.element.css('height') != currentHeight) {
			currentHeight = me.element.css('height');
			me.wrapper.css('height', currentHeight);
			me.element.css('height', currentHeight);
		}
	}, 2000);
	*/

    //Paging
	me.paging = me.viewport.find('.ui-deni-grid-paging');    

	//Set the default options
	uiDeniGridUtilSrv.setDefaultOptions(me, me.options);
	
	//Inherit API from ui-deni-view and create some new APIs too		
	me.options.api = {

		/**
		 *	
		 *
		 */		 
		clearSelections: function() {
        	uiDeniGridSrv.clearSelections(me);
		},

		/**
		 *	
		 *
		 */		 
		find: function(valuesToFind, opts) {
			return uiDeniGridSrv.find(me, valuesToFind, opts);
		},

		/**
		 *	
		 *
		 */		 
		findFirst: function(valuesToFind, opts) {
			return uiDeniGridSrv.findFirst(me, valuesToFind, opts);
		},

		/**
		 *	
		 *
		 */		 
		findKey: function(keyValue, opts) {
			return uiDeniGridSrv.findKey(me, keyValue, opts);
		},

		/**
		 *	
		 *
		 */		 
		findLast: function(valuesToFind, opts) {
			return uiDeniGridSrv.findLast(me, valuesToFind, opts);
		},

		/**
		 *	
		 *
		 */		 
		findNext: function(valuesToFind, opts) {
			return uiDeniGridSrv.findNext(me, valuesToFind, opts);
		},

		/**
		 *	
		 *
		 */		 
		findPrevious: function(valuesToFind, opts) {
			return uiDeniGridSrv.findPrevious(me, valuesToFind, opts);
		},

		/**
		 *	
		 *
		 */		 
		filter: function(valuesToFilter, opts) {
			return uiDeniGridSrv.filter(me, valuesToFilter, opts);
		},


		/**
		 *	
		 *
		*/		 
        getChangedRecords: function() {
        	return uiDeniGridSrv.getChangedRecords(me);
        },

		/**
		 *	
		 *
		*/		 
        getColumn: function(fieldName) {
        	return uiDeniGridSrv.getColumn(me, fieldName);
        },

		/**
		 *	
		 *
		 */		 
		getPageNumber: function() {
			return uiDeniGridSrv.getPageNumber(me);
		},

		/**
		 *	
		 *
		 */		 
		getRowHeight: function() {
			return uiDeniGridSrv.getRowIndex(me);
		},

		/**
		 *	
		 *
		*/		 
        getRowIndex: function(record) {
        	return uiDeniGridSrv.getRowIndex(me, record);
        },


		/**
		 *	
		 *
		*/		 
        getSelectedRow: function() {
        	return uiDeniGridSrv.getSelectedRow(me);
        },

		/**
		 *	
		 *
		*/		 
        getSelectedRowIndex: function() {
        	return uiDeniGridSrv.getSelectedRowIndex(me);
        },

		/**
		 *	
		 *
		 */
		isEnableGrouping: function() {
			return uiDeniGridSrv.isEnableGrouping(me);
		},

		/**
		 *	
		 *
		 */
		isGrouped: function() {
			return uiDeniGridSrv.isGrouped(me);
		},	        

		/**
		 *	
		 *
		*/		 
		isRowSelected: function(row) {        
        	return uiDeniGridSrv.isRowSelected(me, row);
        },

		/**
		 * @param row {Element|Integer} Can be the rowIndex or a jquery element row
		 * 
		 */
		isRowVisible: function(row) {
			return uiDeniGridSrv.isRowVisible(me, row);							
		},

		/**
		 *	
		 *
		 */
		load: function() {
			uiDeniGridSrv.load(me);
		},

		/**
		 *	
		 *
		 */
		loadData: function(data) {
			uiDeniGridSrv.loadData(me, data);							
		},


		/**
		 *	
		 *
		*/		 
		isHideHeaders: function() {        
        	return uiDeniGridSrv.isHideHeaders(me);
        },

		/**
		 *	
		 *
		 */
		reload: function() {
			return uiDeniGridSrv.reload(me);
		},

		/**
		 *	
		 *
		 */
		removeRow: function(row) {
			uiDeniGridSrv.removeRow(me, row);
		},

		/**
		 *	
		 *
		 */
		removeSelectedRows: function() {
			uiDeniGridSrv.removeSelectedRows(me);
		},

		/**
		 *	
		 *
		*/		 
        resolveRowElement: function(row) {
        	return uiDeniGridSrv.resolveRowElement(me, row);        	
        },	

		/**
		 *	
		 *
		*/		 
        resolveRowIndex: function(row) {
        	return uiDeniGridSrv.resolveRowIndex(me, row);        	
        },	


		/**
		 *	
		 *
		 */
		repaint: function() {
			uiDeniGridSrv.repaint(me);							
		},

		/**
		 *	
		 *
		 */
		repaintRow: function(row) {
			return uiDeniGridSrv.repaintRow(me, row);							
		},

		/**
		 *	
		 *
		 */
		repaintSelectedRow: function() {
			return uiDeniGridSrv.repaintSelectedRow(me);
		},


		/**
		 *	
		 *
		 */
		setDisableGrouping: function() {
			uiDeniGridSrv.setDisableGrouping(me);
		},

		/**
		 *	
		 *
		 */
		setEnableGrouping: function() {
			uiDeniGridSrv.setEnableGrouping(me);
		},

		/**
		 *	
		 *
		*/		 
		setHideHeaders: function(hideHeaders) {
			return uiDeniGridSrv.setHideHeaders(me, hideHeaders);
		},

		/**
		 *	
		 *
		 */		 
		selectAll: function() {
        	uiDeniGridSrv.selectAll(me);
		},

		/**
		 *	
		 *
		*/		 
        selectRow: function(row, preventSelecionChange, scrollIntoView) {
        	uiDeniGridSrv.selectRow(me, row, preventSelecionChange, scrollIntoView);
        },

		/**
		 *	
		 *
		 */		 
		setPageNumber: function(pageNumber) {
			uiDeniGridSrv.setPageNumber(me, pageNumber);
		},

		/**
		 *	
		 *
		 */		 
		setRowHeight: function(rowHeight) {
			uiDeniGridSrv.setRowHeight(me, rowHeight);
		},

		/**
		 *	
		 *
		 */
		setToogleGrouping: function() {
			uiDeniGridSrv.setToogleGrouping(me);
		},


		/**
		 *	
		 * holdSelection {boolean} true is default
		*/		 
        sort: function(sorters, holdSelection) {
        	return me.options.sorters = uiDeniGridSrv.sort(me, sorters, holdSelection);
        },

		/**
		 *	
		 *
		*/		 
        updateSelectedRow: function(json) {
        	uiDeniGridSrv.updateSelectedRow(me, json);
        },

		/**
		 *	
		 *
		*/		 
        updateCell: function(rowIndex, colIndex, value) {
        	uiDeniGridSrv.updateCell(me, rowIndex, colIndex, value);
        },
		
		/**
		 *	
		 *
		*/		 
        updateSelectedCell: function(value) {
        	uiDeniGridSrv.updateSelectedCell(me, value);
        },


	}

	me.element.show(function(event) {
		///////////////////////////////////////////////////////////////////////////
		//FIXED COLUMNS ///////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	
		if (me.options.fixedCols) {
			//
			me.fixedColsViewportWrapper.css('width', me.options.fixedCols.width + 'px');
			//
			me.colsViewportWrapper.css('width', 'calc(100% - ' + me.fixedColsViewportWrapper.css('width') + ')');		
		} else {
			//
			me.fixedColsViewportWrapper.css('display', 'none');
			//
			me.colsViewportWrapper.css('width', '100%');				
		}
		///////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	

		///
		me.clientWidth = uiDeniGridUtilSrv.getClientWidthDeniGrid(me);	

		///////////////////////////////////////////////////////////////////////////
		//COLUMN HEADERS //////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	
		if (me.options.hideHeaders) {
			//
			me.headerViewportWrapper.css('display', 'none');
			me.fixedColsHeaderViewportWrapper.css('display', 'none');
		} else {
			//columnHeaderLevels has a numer greater than one when it has a grouped column headers.
			me.columnHeaderLevels = uiDeniGridUtilSrv.getColumnHeaderLevels(me, me.options.columns);

			if (me.columnHeaderLevels > 1) {
				//realPercentageWidth cause effect only when there are more then one level of columns
				uiDeniGridUtilSrv.setRealPercentageWidths(me.options.columns, '100%');
			}

			//
			uiDeniGridSrv.createColumnHeaders(me, me.options.columns);
			uiDeniGridSrv.createColumnHeadersEvents(me);		

			//the height of the column headers varies when there is grouped column headers (Just in this case)
			me.headerViewportWrapper.css('height', 'calc(' + me.options.columnHeaderHeight + ' * ' + me.columnHeaderLevels + ')');
			me.fixedColsHeaderViewportWrapper.css('height', 'calc(' + me.options.columnHeaderHeight + ' * ' + me.columnHeaderLevels + ')');
		}	
		///////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	

		///////////////////////////////////////////////////////////////////////////
		//GRID FOOTER /////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	
		if (me.options.colLines) {
			me.headerContainer.find('.ui-header-container-column').css('border-right', 'solid 1px silver');
		}
		
		//How many column footer rows is there in the grid (footer.grid different from false)
		me.columnFooterRowsNumberGrid = uiDeniGridUtilSrv.getColumnFooterRowsNumber(me);		
		//How many grouping footer rows is there in the grid (footer.grouping different from false)
		me.columnFooterRowsNumberGrouping = uiDeniGridUtilSrv.getColumnFooterRowsNumber(me, true);		
		//
		me.columnFooterNumber = uiDeniGridUtilSrv.getColumnFooterNumber(me);		

		//Should show the footer?
		if ((uiDeniGridUtilSrv.hasColumnFooter(me)) && (me.columnFooterRowsNumberGrid > 0)) {
			//
			uiDeniGridUtilSrv.createColumnFooters(me, me.footerContainer, me.options.columns, true);
			//How many footers?
			var columnFooterRowsNumber = me.footerContainer.find('.ui-footer-row').length;
			//There is no need to add paadding when a footerRowTemplate was set
			var padding = angular.isDefined(me.options.footerRowTemplate) ? '0px' : '2px';
			me.footerViewportWrapper.css({
				'padding-top': padding,
				//'padding-bottom': padding,			
				//'height': 'calc(' + me.options.columnFooterRowHeight + ' * ' + columnFooterRowsNumber + ' + (' + padding + ' * 2))'
			});
		} else {
			//
			me.footerViewportWrapper.css('display', 'none');
			me.fixedColsFooterViewportWrapper.css('display', 'none');
		}
		///////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////	

		//Paging
		if (me.options.paging) {
			me.paging.css('height', uiDeniGridConstants.PAGING_HEIGHT);
			uiDeniGridUtilSrv.createPagingItems(me, me.paging, me.options.paging);
		}

		me.searchInfo = null; //hold values for render the field values (realce)
		me.searching = false;
		me.resizing = false;

		//This guy manages which items the grid should render
		me.managerRendererItems = new uiDeniGridUtilSrv.ManagerRendererItems(me);

		//Create Events for the ui-deni-view
		uiDeniGridSrv.createUiDeniViewEvents(me);  //TODO: change the name of this method

		//
		uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(me);

		if (me.options.data) {
			me.options.api.loadData(me.options.data);
		} else if ((me.options.url) && (me.options.autoLoad)) {
			me.options.api.load();
		}

	});


});