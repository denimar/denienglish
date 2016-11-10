(function() {

	'use strict';

	/**
	 *
	 *
	 */

	angular
		.module('ui-deni-grid')
		.service('uiDeniGridUtilSrv', uiDeniGridUtilSrv);


	function uiDeniGridUtilSrv($filter, uiDeniGridConstants) {

		var me = this;

		/*
		 *  Validas Formats:
		 *
		 *		-currency: Format a number to a currency format.
		 *		-date: Format a date to a specified format.
		 *		-int or integer: Trunc a float number to show only its integer value.
		 *		-float: Like currency, but without dollar sign
	 	 *		-lowercase: Format a string to lower case.
	 	 *		-uppercase: Format a string to upper case.		
		 */
		me.getFormatedValue = function(value, format) {
			var lowerFormat = format.toLowerCase();

			switch (lowerFormat) {

				case 'currency':
					return $filter(lowerFormat)(value);

				case 'date':
					return $filter(lowerFormat)(value, 'shortDate');

				case 'float':
					return $filter('currency')(value, '');

				case 'int':
				case 'integer':
					return value;

				case 'lowercase':
					return value.toUpperCase();

				case 'uppercase':
					return value.toLowerCase();

				default:
					return value;
			}
		};

		/**
		 *	
		 *
		 */
		 me.setInputEditorDivCell = function(controller, record, column, divCellElement) {

		 	//
		 	var createEditor = function() {
		 		var editor = column.editor;

				/////////////////////////////////////////////////////////
				// Setting default values
				/////////////////////////////////////////////////////////

		 		//if the editor value is a boolean.. (ex.: editor: true)
		 		if (editor === true) { 
					editor = {
						type: 'text'
					};

				//if the editor is a string... (ex.: editor: 'date')
		 		} else if (angular.isString(editor)) { 
					editor = {
						type: editor
					};
		 		} else if (!angular.isObject(editor)) { 
		 			throw new Error ('"setInputEditorDivCell : " Property "editor" was set in a wrong way!');
		 		}	

		 		/////////////////////////////////////////////////////////

				editor.type = editor.type.toLowerCase();
				var input;
		 		if (editor.type === 'select') {
					input = $(document.createElement('select'));
					//add the items in the select
					for (let index = 0 ; index < editor.items.length ; index++) {
						var option = document.createElement('option');
						var item = editor.items[index];
						option.value = item.value;
						option.text = item.text;
						input.get(0).add(option);
					}
		 		} else {
					input = $(document.createElement('input'));
				}	

			 	//
		 		var properties = Object.keys(column.editor);
		 		for (let index = 0 ; index < properties.length ; index++) {
		 			var property = properties[index];
		 			if (property !== 'items') { //used just for the select input
		 				input.attr(property, column.editor[property]);
		 			}	
		 		}

			 	return input;
		 	};

	 		//
	 		var spanCellInner = divCellElement.find('.ui-cell-inner');
	 		var oldValue = spanCellInner.html();

	 		//
	 		var inputEditor = createEditor();
	 		inputEditor.css('font-size', spanCellInner.css('font-size'));
	 		inputEditor.css('font-family', spanCellInner.css('font-familly')); 		
	 		inputEditor.addClass('ui-cell-input-editor');

	 		//
	 		inputEditor.attr('oldValue', oldValue);
	 		inputEditor.val(oldValue);

	 		//
	 		spanCellInner.remove();

	 		//
	 		var cellsPadding = divCellElement.css('padding');
	 		divCellElement.css('padding', '0px');
	 		divCellElement.append(inputEditor);

	 		var resolveInputEditor = function(inputEditor, confirm) {
				var inputEditorKeyDown = inputEditor;

				//
				var divCellElementKeyDown = inputEditorKeyDown.parent();

		 		//
		 		var spanCellInnerKeyDown = $(document.createElement('span'));
		 		spanCellInnerKeyDown.addClass('ui-cell-inner');

		 		//confirming?
				if (confirm) { 					
					var newValue = inputEditorKeyDown.val();

					//
					inputEditorKeyDown.remove();

			 		//
			 		divCellElementKeyDown.append(spanCellInnerKeyDown);

					var rowElement = divCellElementKeyDown.closest('.ui-row');
					
					//
					controller.options.api.updateCell(rowElement.attr('rowindex'), divCellElementKeyDown.attr('colindex'), newValue);

				//not confirmed
				} else { 
					//
					var oldValueKeyDown = inputEditorKeyDown.attr('oldValue');

			 		//
			 		spanCellInnerKeyDown.html(oldValueKeyDown);

					//
					inputEditorKeyDown.remove();

			 		//
			 		divCellElementKeyDown.append(spanCellInnerKeyDown);

				}
				divCellElement.css('padding', cellsPadding);
	 		};

	 		//KeyDown (input)
			inputEditor.keydown(function(event) {
				//ESCAPE or RETURN pressed
				if ((event.keyCode === 27) || (event.keyCode === 13)) { 

					//ESCAPE pressed
					if (event.keyCode === 27) { 
						resolveInputEditor($(event.target), false);

					//RETURN pressed
					} else if (event.keyCode === 13) { 
						resolveInputEditor($(event.target), true);
					}
			 	}	

			});

	 		//FocusOut (input)
			inputEditor.focusout(function(event) {
				resolveInputEditor($(event.target), false);
			});	


			//
	 		inputEditor.focus();

		 };


		/**
		 *	
		 *
		 */
		me.getRealColumnWidth = function(controller, colWidth, clientWidthParent) {
			var clientWidth = clientWidthParent || controller.clientWidth;

			//
			//
			var realColWidth = colWidth;
			if (realColWidth.indexOf('%') !== -1) {
				realColWidth = realColWidth.replace('%', '');
				realColWidth = clientWidth * realColWidth / 100;
				realColWidth = realColWidth + 'px';
			}	

			return realColWidth;
		};

		/**
		 * realPercentageWidth cause effect only when there are more then one level of columns
		 */
		me.setRealPercentageWidths = function(columns, percentageMaster) {
			var percentageMasterValue = parseFloat(percentageMaster.replace('%', ''));
			for (let index = 0 ; index < columns.length ; index++) {
				if (percentageMaster !== '100%') {
					var percentageWidthValue = parseFloat(columns[index].width.replace('%', ''));
					columns[index].realPercentageWidth = (percentageMasterValue * percentageWidthValue / 100) + '%';
				}
				var columnChildren = columns[index].columns;			
				if ((columnChildren) && (columnChildren.length > 0)) {
					me.setRealPercentageWidths(columnChildren, columns[index].width);
				}	
			}
		};


		/**	
		 *
		 *
		 */
		me.getClientWidthDeniGrid = function(controller) {

			//
			var scroolBarWidth = controller.bodyViewport.get(0).offsetWidth - controller.bodyViewport.get(0).clientWidth;
			//
			var containerWidth = controller.colsContainer.width() - scroolBarWidth;	

			return containerWidth;
		};

		/**
		 *	
		 *
		 */
		me.adjustColumnWidtsAccordingColumnHeader = function(controller, headerContainerColumn, colIndex) {

			var headerContainer = headerContainerColumn.closest('.ui-header-container');
			var bodyContainer = headerContainerColumn.closest('.ui-container').find('.ui-body-container');

			//Refresh deniview widths
			//bodyContainer.find('.ui-row').css('width', headerContainer.css('width'));
			bodyContainer.find('.ui-row:not(.row-detail)').css('width', headerContainer.css('width'));
			//
			var newWidth = headerContainerColumn.css('width');
			if (headerContainerColumn.is('.ui-header-container-column.last-subcolumn')) {
				//plus border width 
				newWidth = 'calc(' + newWidth + ' + 2px)'; 
			}
			bodyContainer.find('.ui-cell[colIndex=' + colIndex + ']').css('width', newWidth);

			//
			if (controller.options.data.length > 0) {
				//var firstRowCells = bodyContainer.find('.ui-row:eq(0)').find('.ui-cell');
				//var lastCellInTheFirstRow = firstRowCells[firstRowCells.length - 1];
				//bodyContainer.width(lastCellInTheFirstRow.offsetLeft + lastCellInTheFirstRow.offsetWidth);
				bodyContainer.width(headerContainer.width());
			}	
		};

		/**
		 *	
		 *
		 */
		me.adjustAllColumnWidtsAccordingColumnHeader = function(controller) {
			if (angular.isDefined(controller.options.columns)) {
				let columns = me.getColumns(controller, controller.options.columns);
				//Any column was specified in percentage? TODO: create a function to get this
				let anyColumnInPercentage = false;
				for (let colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
					if (controller.options.columns[colIndex].width.toString().indexOf('%') !== -1) {
						anyColumnInPercentage = true;
						break;
					}
				}
				if (anyColumnInPercentage) {
					controller.bodyContainer.find('.ui-row').css('width', '100%');
				}
			}

			let colIndex = 0;

			//Fixed Columns
			let headerContainerColumns = controller.fixedColsHeaderContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (let index = 0 ; index < headerContainerColumns.length ; index++) {
				let headerContainerColumn = $(headerContainerColumns[index]);
				me.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
				colIndex++;
			}

			//Variable Columns
			headerContainerColumns = controller.headerContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (let index = 0 ; index < headerContainerColumns.length ; index++) {
				let headerContainerColumn = $(headerContainerColumns[index]);
				me.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
				colIndex++;
			}
		};	



		/**
		 *	
		 *
		 */	 
		me.setDefaultOptions = function(controller) {
			
			var opt = {};

			/**
			 *
			 * 
			 *
			 */ 
			opt.api = {}; 

			/**
			 *
			 * 
			 *
			 */ 
			opt.listeners = {};

			/**
			 *
			 * 'cell' or 'row' (default = 'row')
			 * 
			 *
			 */ 
	        opt.selType = 'row';
			
			/**
			 *
			 * (default = true)
			 * 
			 *
			 */ 
	        opt.colLines = true;

			/**
			 *
			 * (default = true)
			 * 
			 *
			 */ 
	        opt.rowLines = true;
			
			/**
			 * @opt {Boolean} [autoLoad=true]
			 *
			 */
			opt.autoLoad = true;

			/**
			 * @opt {String} [columnHeaderHeight='25px']
			 *
			 */
			opt.columnHeaderHeight = uiDeniGridConstants.DEFAULT_COLUMN_HEADER_HEIGHT;


			/**
			 * @opt {String} [columnFooterRowHeight='22px']
			 *
			 */
			opt.columnFooterRowHeight = uiDeniGridConstants.DEFAULT_COLUMN_ROW_FOOTER_HEIGHT;

			/**
			 * @opt {String} [columnGroupingFooterRowHeight='18px']
			 *
			 */
			opt.columnGroupingFooterRowHeight = uiDeniGridConstants.DEFAULT_COLUMN_GROUPING_ROW_FOOTER_HEIGHT;

			/**
			 * @opt {Boolean} [enableGrouping=true]
			 *
			 */
			opt.enableGrouping = true;

			/**
			 * @opt {Boolean} [enableColumnResize=true]
			 *
			 */
			opt.enableColumnResize = true;

			/**
			 * @opt {Boolean} [hideHeader=false]
			 *
			 */
			opt.hideHeaders = false;

			/**
			 * @opt {String} [rowHeight='22px']
			 *
			 */
			opt.rowHeight = uiDeniGridConstants.DEFAULT_ROW_HEIGHT;

			/**
			 * @opt {Boolean} [multiSelect=false]
			 *
			 */
			opt.multiSelect = false;

			/**
			 * @opt {Boolean} [sortableColumns=true]
			 *
			 */
			opt.sortableColumns = true;


		    /**
		     * @opt {Array|Object|String} [sorters=null]
			 *
			 * 	It is a very flexible config and might be filled this way 
			 *
			 * 	(string):
			 *
			 *		'city' or even
			 *
			 *	or (json):
			 *
			 * 		{name: 'city', direction: 'ASC'} or	 
			 *
			 *	or (function):
			 *	
			 *		function(rec1, rec2) {
			 *			if (rec1.age == rec2.age) return 0;
			 *			return rec1.age < rec2.age ? -1 : 1;
			 *		});	 
			 *
			 *	or even (array):
			 *
			 * 		[
			 *			'city', 
			 *			{name: 'age', direction: 'DESC'}, 
			 *			function(rec1, rec2) {
			 *				if (rec1.age == rec2.age) return 0;
			 *				return rec1.age < rec2.age ? -1 : 1;
			 *			}
			 *		]
			 *
			 */
			opt.sorters = [];

			/**
			 * @opt {Boolean} [stropRows=true]
			 *
			 *
			 */
			opt.stripRows = true;


			//
			angular.extend(opt, controller.options);

			controller.options = opt;


			/**
			 * @opt {Boolean} [hideHeaders=false]
			 *
			 *
			 * when there is rowTemplate it also don't has column headers
			 *
			 */
			controller.options.hideHeaders = (controller.options.hideHeaders === true) || (angular.isDefined(controller.options.rowTemplate)) || (angular.isDefined(controller.options.cardView));

			//CardView
			if (controller.options.cardView) {
				controller.options.rowHeight = controller.options.cardView.rowHeight || '150px';
			}	
			//Avoid a error when is passed a integer value
			controller.options.rowHeight = controller.options.rowHeight.toString();


			/////////////////////////////////////////////////////
			// Setting default values to the grouping
			/////////////////////////////////////////////////////
			controller.isGrouped = (controller.options.enableGrouping && angular.isDefined(controller.options.grouping));
			if (controller.isGrouped) {

				//grouping passed like a string
				if (angular.isString(controller.options.grouping)) {
					controller.options.grouping = {
						expr: controller.options.grouping
					};
				}

				//
				if (!((angular.isObject(controller.options.grouping)) && (!(angular.isArray(controller.options.grouping))))) {
					throw new Error('"loadData": param "grouping" passed in a wrong way');
				}	

				//
				var defaultTemplate = '<b>{' + controller.options.grouping.expr + '}</b> ({count})';
				//
				controller.options.grouping.template = controller.options.grouping.template || defaultTemplate;
			}	
			/////////////////////////////////////////////////////


			////////////////////////////////////////////////////////////////////////////////////////
			// fixedCols
			////////////////////////////////////////////////////////////////////////////////////////		
			if (controller.options.fixedCols) {

				//
				var getFixedColsWidth = function(fixedColumns) {
					var fixedColsWidth = 0;
					//
					if (controller.options.fixedCols.indicator) {
						fixedColsWidth += parseFloat(uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH.replace('px', ''));
					}
					//
					if (controller.options.fixedCols.rowNumber) {
						fixedColsWidth += parseFloat(uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH.replace('px', ''));
					}
					//
					if (controller.options.fixedCols.checkbox) {
						fixedColsWidth += parseFloat(uiDeniGridConstants.FIXED_COL_CHECKBOX_WIDTH.replace('px', ''));
					}

					//
					if (controller.options.fixedCols.columns) {
						for (let index = 0 ; index < fixedColumns.length ; index++) {
							fixedColsWidth += parseFloat(me.getRealColumnWidth(controller, fixedColumns[index].width).replace('px', ''));
						}	
					}	

					return fixedColsWidth;
				};


				//fixedCols filled just with 'true'
				if (controller.options.fixedCols === true) {
					controller.options.fixedCols = {
						indicator: true
					};
				}

				//fixedCols.indicator filled different of 'true' (MUST BE A BOOLEAN VALUE)
				if ((angular.isDefined(controller.options.fixedCols.indicator)) && (controller.options.fixedCols.indicator !== true) && (controller.options.fixedCols.indicator !== false)) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.indicator" property was set in a wrong way! (it must be a boolean value)');
				}

				//fixedCols.rowNumber filled different of 'true' (MUST BE A BOOLEAN VALUE)
				if ((angular.isDefined(controller.options.fixedCols.rowNumber)) && (controller.options.fixedCols.rowNumber !== true) && (controller.options.fixedCols.rowNumber !== false)) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.rowNumber" property was set in a wrong way! (it must be a boolean value)');
				}

				//fixedCols.checkbox filled different of 'true' (MUST BE A BOOLEAN VALUE)
				if ((angular.isDefined(controller.options.fixedCols.checkbox)) && (controller.options.fixedCols.checkbox !== true) && (controller.options.fixedCols.checkbox !== false)) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.checkbox" property was set in a wrong way! (it must be a boolean value)');
				}

				//Are there columns in the fixed colums?
				var fixedColumns = controller.options.fixedCols.columns;
				if (fixedColumns) {
					if (angular.isArray(fixedColumns)) {
						for (let index = 0 ; index < fixedColumns.length ; index++) {

							//confirms the existence of the column
							var found = false;
							for (var fieldIndex = 0 ; fieldIndex < controller.options.columns.length ; fieldIndex++) {						
								var field = controller.options.columns[fieldIndex];

								if (field.name === fixedColumns[index]) {
									fixedColumns[index] = field;
									found = true;
									break;
								}
							}
							if (!found) {
								throw new Error('"setInitialDefaultOptions" : "fixedCols.columns" -> column "' + fixedColumns[index] + '" not found!');
							}

						}						
					} else {	
						throw new Error('"setInitialDefaultOptions" : "fixedCols.columns" property was set in a wrong way!');
					}
				}	

				controller.options.fixedCols.width = getFixedColsWidth(fixedColumns);
			}	
			////////////////////////////////////////////////////////////////////////////////////////
			////////////////////////////////////////////////////////////////////////////////////////		

			//Paging
			if (controller.options.paging) {
				if (controller.options.paging === true) {
					controller.options.paging = {};
				}

				controller.options.paging.type = controller.options.paging.type || 'json';
				controller.options.paging.pageSize = controller.options.paging.pageSize || 50;
				controller.options.paging.currentPage = controller.options.paging.currentPage || 1;
			}
			
			////////////////////////////////////////////////////////////////////////////////////////
			//restConfig
			////////////////////////////////////////////////////////////////////////////////////////		
			var restConfig = controller.options.restConfig;
			var restConfigDefaults = {
				type: 'json',
				data: 'data',
				total: 'total',
				start: 'start',
				limit: 'limit'			
			};

			if (restConfig) {
				angular.extend(restConfigDefaults, restConfig);
			} else {
				restConfig = restConfigDefaults;
			}
			controller.options.restConfig = restConfig;
			////////////////////////////////////////////////////////////////////////////////////////
			////////////////////////////////////////////////////////////////////////////////////////		
			
		};

		/**
		 *	
		 *
		 */
		me.remakeHeightBodyViewportWrapper = function(controller) {
			var paddingfooterDivContainerWidth = 3;
			
			var otherDivsheight = 0;

			//Showing column header?
			if (controller.headerViewportWrapper.css('display') !== 'none') {
				otherDivsheight += controller.headerViewportWrapper.height();
			}

			//Paging?
			if (controller.options.paging) {
				controller.container.css('height', 'calc(100% - ' +  uiDeniGridConstants.PAGING_HEIGHT + ')');
			}

			//Showing footer?
			if (controller.footerViewportWrapper.css('display') !== 'none') {
				otherDivsheight += controller.footerViewportWrapper.height() + paddingfooterDivContainerWidth;
			}

			var viewMainDivHeight = 'calc(100% - ' + otherDivsheight + 'px)';
			controller.bodyViewportWrapper.css('height', viewMainDivHeight);
		};

		/**
		 *	
		 *
		 */
		me.hasColumnFooter = function(controller) {

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				var columns = controller.options.columns;
				for (let index = 0 ; index < columns.length ; index++) {
					if (columns[index].footer) {
						return true;
					}
				}
			}	

			return false;
		};


		/**
		 *	
		 *
		 */
		me.getColumnHeaderLevels = function(controller, columns) {
			var greaterLevelChild = 0;
			var levelsChild = 0;
			for (let index = 0 ; index < columns.length ; index++) {
				var column = columns[index];
				//
				if (column.columns) {
					//
					levelsChild = me.getColumnHeaderLevels(controller, column.columns);
					
					if (levelsChild > greaterLevelChild) {
						greaterLevelChild = levelsChild;
					}
				}	
			}	


			return 1 + greaterLevelChild;
		};


		/**
		 *	It is not the same as getColumnFooterRowsNumber
		 *
		 */
		me.getColumnFooterNumber = function(controller) {

			//How many footers?
			var columnFooterNumber = 0;

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				for (let index = 0 ; index < controller.options.columns.length ; index++) {
					var column = controller.options.columns[index];
					//
					if (column.footer) {
						var lenght = angular.isArray(column.footer) ? column.footer.length : 1;				
						//
						if (lenght > columnFooterNumber) {
							columnFooterNumber = lenght;
						}
					}	
				}	
			}	

			return columnFooterNumber;

		};

		/**
		 * It is not the same as getColumnFooterNumber	
		 *
		 */
		me.getColumnFooterRowsNumber = function(controller, groupingFooter) {

			//How many footers?
			var columnFooterRowsNumber = 0;

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				for (let index = 0 ; index < controller.options.columns.length ; index++) {
					var column = controller.options.columns[index];
					//
					if (column.footer) {
						var lenght = 1;				
						//
						if (angular.isArray(column.footer)) {
							lenght = 0;
							for (var colIndex = 0 ; colIndex < column.footer.length ; colIndex++) {
								var footer = column.footer[colIndex];
								//
								if (angular.isObject(footer)) {
									//
									if (groupingFooter) {	
										//
										if (footer.grouping !== false) {
											lenght++;
										}
									//	
									} else {
										//
										if (footer.grid !== false) {
											lenght++;
										}
									}
								//	
								} else {
									lenght++;
								}
							}
						}
						//
						if (lenght > columnFooterRowsNumber) {
							columnFooterRowsNumber = lenght;
						}
					}	
				}	
			}	

			return columnFooterRowsNumber;
		};


		/**
		 *	
		 *
		 */
		me.createColumnFooters = function(controller, footerContainer, columns, gridFooter) {
			//There is no need to add cells when a footerRowTemplate was set
			if (!angular.isDefined(controller.options.footerTemplate)) {		
				var rowClass;
				var cellClass;
				var cellInnerClass;

				//Grid Footer
				if (gridFooter) {
					rowClass = 'ui-footer-row';
					cellClass = 'ui-footer-cell';
					cellInnerClass = 'ui-footer-cell-inner';			
				//Group Footer
				} else {
					rowClass = 'ui-grouping-footer-row';
					cellClass = 'ui-grouping-footer-cell';
					cellInnerClass = 'ui-grouping-footer-cell-inner';			
				}

				//
				var footerCellElement;
				//
				var footerCellInnerElement;

				//How many footers?
				var columnFooterRowsNumber = gridFooter ? controller.columnFooterRowsNumberGrid : controller.columnFooterRowsNumberGrouping;

				var rowHeight = gridFooter ? controller.options.columnFooterRowHeight : controller.options.columnGroupingFooterRowHeight;

				//loop over footers
				for (var footerIndex = 0 ; footerIndex < columnFooterRowsNumber ; footerIndex++) {
					//
					var footerRowElement = $(document.createElement('div'));
					footerRowElement.css('height', rowHeight);
					footerRowElement.addClass(rowClass);

					//
					footerRowElement.attr('index', footerIndex);			

					//There is no need to add cells when a footerRowTemplate was set
					if (!angular.isDefined(controller.options.footerRowTemplate)) {
						//
						//var countFootersAdded = 0;

						//
						var footerColIndex = 0;

						//loop over columns
						for (let index = 0 ; index < columns.length ; index++) {
							var column = columns[index];
							
							//
							footerCellElement = $(document.createElement('div'));
							//
							footerCellElement.addClass(cellClass);
							//
							footerCellElement.attr('index', index);

							//
							footerCellElement.css({
								width: me.getRealColumnWidth(controller, column.width),
								//height: controller.options.rowHeight || '22px',
								//height: '16px',
								'text-align': column.align
							});

							//
							footerRowElement.append(footerCellElement);
							//countFootersAdded++;

							//
							if (column.footer) {
								//
								footerCellInnerElement = $(document.createElement('span'));
								//
								footerCellInnerElement.addClass(cellInnerClass);					

								//
								//footerCellElement.attr('footerColIndex', footerColIndex);
								//footerCellInnerElement.attr('footerColIndex', footerColIndex);	
								footerColIndex++;	

								//
								footerCellElement.append(footerCellInnerElement);

								//transform the property footer in a array
								if (!angular.isArray(column.footer)) {
									column.footer = [column.footer];
								}
							}

						} //loop over columns (end)
					}	

					footerContainer.append(footerRowElement);			

				} //loop over footers	

				//
				if (columnFooterRowsNumber > 0) {

					//
					//if (footerCellElement) {
						//
						var footerRows = footerContainer.find('.' + rowClass);
						var firstRow = $(footerRows.get(0));
						firstRow.find('.' + cellClass).addClass('first-row');
						var lastRow = $(footerRows.get(footerRows.length - 1));			
						lastRow.find('.' + cellClass).addClass('last-row');			

						//
						var colsLength = firstRow.find('.' + cellClass).length;
						footerContainer.find('.' + cellClass  + '[footerColIndex=0]').addClass('first-col');
						footerContainer.find('.' + cellClass + '[footerColIndex=' + (colsLength-1) + ']').addClass('last-col');			
					//}
				}
			}	
		};

		/**
		 *	
		 *
		 */
		me.renderColumnFooters = function(controller, footerContainer, columns, data, gridFooter) {
			var rowClass;
			var cellClass;
			var cellInnerClass;

			//Grid Footer
			if (gridFooter) {
				rowClass = 'ui-footer-row';
				cellClass = 'ui-footer-cell';
				cellInnerClass = 'ui-footer-cell-inner';			
			//Group Footer
			} else {
				rowClass = 'ui-grouping-footer-row';
				cellClass = 'ui-grouping-footer-cell';
				cellInnerClass = 'ui-grouping-footer-cell-inner';			
			}

			//
			var recordToFooterTemplate = {};
			var visibleFooterRowIndex = 0;

			//
			for (var footerRowIndex = 0 ; footerRowIndex < controller.columnFooterNumber ; footerRowIndex++) {
				//
				var recordToFooterRowTemplate = {};

				var footerRow;
				//if hasn't a footerTemplate
				if (!angular.isDefined(controller.options.footerTemplate)) {
					footerRow = $(footerContainer.find('.' + rowClass)[footerRowIndex]);
				}	

				//
				for (var columnIndex = 0 ; columnIndex < columns.length ; columnIndex++) {
					var column = columns[columnIndex];				

					//
					if (column.footer) {
						//
						var footer = column.footer[footerRowIndex];

						//
						if (angular.isDefined(footer)) {
							//Should this footer be showed in grid?	
							var showInGrid = footer.grid !== false;
							//Should this footer be showed in groupin?
							var showInGrouping = footer.grouping !== false;

							//Should this footer be showed?
							var showItemFooter = ((gridFooter && showInGrid) || ((!gridFooter) && showInGrouping));

							//If Yes...
							if (showItemFooter) {

								//
								var defaultFunctionsNames = Object.keys(me.defaultFunctions);

								//
								if (angular.isString(footer)) {
									//	
									if (defaultFunctionsNames.indexOf(footer.toLowerCase()) === -1) {
										footer = {
											text: footer
										};	
									//
									} else {
										footer = {
											fn: footer.toLowerCase()
										};
									}
								//	
								} else if (angular.isFunction(footer)) {
									footer = {
										fn: footer
									};
								}	

								
								footerRow = $(footerContainer.find('.' + rowClass)[visibleFooterRowIndex]);

								//
								var divFooterCell = $(footerRow.find('.' + cellClass).get(columnIndex));

								//
								var spanFooterCellInner = divFooterCell.find('.' + cellInnerClass);
								spanFooterCellInner.empty();


								//
								var footerFn = footer.fn;
								if (angular.isDefined(footerFn)) {
									var value;

									// Custom Function	
									if (angular.isFunction(footerFn)) {
										value = footerFn(data, column.name);

									// Default Function	
									} else if (angular.isString(footerFn)) {

										if (defaultFunctionsNames.indexOf(footerFn.toLowerCase()) === -1) {
											throw new Error('"renderColumnFooters" : "' + footerFn + '" is not a default function!');
										} else {	
											var defaultFunction = footerFn.toUpperCase();
											footer.text = (footer.text || footerFn.toLowerCase() + ' : ');

											// AVG	
											if (defaultFunction === 'AVG') {
												value = me.defaultFunctions.avg(data, column.name);

											// COUNT
											} else if (defaultFunction === 'COUNT') {
												value = me.defaultFunctions.count(data);

											// MAX
											} else if (defaultFunction === 'MAX') {
												value = me.defaultFunctions.max(data, column.name);

											// MIN
											} else if (defaultFunction === 'MIN') {
												value = me.defaultFunctions.min(data, column.name);

											// SUM
											} else if (defaultFunction === 'SUM') {
												value = me.defaultFunctions.sum(data, column.name);
												
											}
										}
											
									} else {
										throw new Error('"renderColumnFooters" : "fn" param passed in a wrong way!');
									}

									//format value
									var format = footer.format || column.format;
									if (angular.isDefined(format)) {
										value = me.getFormatedValue(value, format);
									}	

									//footerTemplate
									if (angular.isDefined(controller.options.footerTemplate)) {
										recordToFooterTemplate[column.name + '(' + footerRowIndex + ').text'] = footer.text;
										recordToFooterTemplate[column.name + '(' + footerRowIndex + ').value'] = value;

									//footerRowTemplate
									} else if (angular.isDefined(controller.options.footerRowTemplate)) {
										recordToFooterRowTemplate[column.name + '.text'] = footer.text;
										recordToFooterRowTemplate[column.name + '.value'] = value;
									} else {	
										//
										if (angular.isDefined(footer.align)) {
											divFooterCell.css('text-align', footer.align);
										}

										//
										if (angular.isDefined(footer.style)) {
											divFooterCell.css(footer.style);
										}

										///////////////////////////////////////////////////////////////
										//Value Element ///////////////////////////////////////////////
										///////////////////////////////////////////////////////////////
										var valueElement = $(document.createElement('span'));
										valueElement.addClass('fn-value');
										spanFooterCellInner.append(valueElement);
										valueElement.html(value);
										//valueRenderer
										if (footer.valueRenderer) {
											value = footer.valueRenderer(valueElement, value);
										}
										///////////////////////////////////////////////////////////////
										///////////////////////////////////////////////////////////////

										///////////////////////////////////////////////////////////////
										//Text Element ///////////////////////////////////////////////
										///////////////////////////////////////////////////////////////
										var textElement = $(document.createElement('span'));
										textElement.addClass('fn-text');
										textElement.insertBefore(valueElement);
										textElement.html(footer.text);
										//textRenderer
										if (footer.textRenderer) {
											footer.text = footer.textRenderer(textElement, footer.text);
										}
										///////////////////////////////////////////////////////////////
										///////////////////////////////////////////////////////////////									
									}	

								//
								} else if (angular.isDefined(footer.text)) {
									spanFooterCellInner.html(footer.text);
								} else {
									throw new Error('"renderColumnFooters" : column footer neither has "function" nor "text" property was set!');
								}

								visibleFooterRowIndex++;
							}					
		
						}
					}			

				}

				//footerRowTemplate
				if (angular.isDefined(controller.options.footerRowTemplate)) {
					let valueToRender = me.applyTemplateValues(controller.options.footerRowTemplate, recordToFooterRowTemplate);
					footerRow.html(valueToRender);
					footerRow.css('width', '100%');
				}	
			}

			//footerTemplate
			if (angular.isDefined(controller.options.footerTemplate)) {
				let valueToRender = me.applyTemplateValues(controller.options.footerTemplate, recordToFooterTemplate);
				footerContainer.html(valueToRender);
			}	

		};

		me.createPagingItems = function(controller, paging, pagingOptions) {
			//First Page Button
			var buttonFirst = $(document.createElement('span'));
			buttonFirst.addClass('button');
			buttonFirst.addClass('button-first');
			buttonFirst.addClass('disabled');
			paging.append(buttonFirst);
			buttonFirst.click(function(event) {
				controller.options.api.setPageNumber(1);
			});

			//Previous Page Button
			var buttonPrev = $(document.createElement('span'));
			buttonPrev.addClass('button');
			buttonPrev.addClass('button-prev');
			buttonPrev.addClass('disabled');
			paging.append(buttonPrev);
			buttonPrev.click(function(event) {
				controller.options.api.setPageNumber(controller.options.api.getPageNumber() - 1);
			});

			//
			var separator1 = $(document.createElement('span'));
			separator1.addClass('separator');
			paging.append(separator1);

			//
			var labelPageNumber = $(document.createElement('span'));
			labelPageNumber.addClass('label-page-number');
			labelPageNumber.html('Page');
			paging.append(labelPageNumber);

			//
			var inputPageNumber = $(document.createElement('input'));
			inputPageNumber.addClass('input-page-number');
			inputPageNumber.attr('type', 'text');
			inputPageNumber.attr('value', controller.options.paging.currentPage);
			paging.append(inputPageNumber);
			inputPageNumber.keydown(function(event) {
				if (event.keyCode === 13) { //Return
					var pageNumber = parseInt($(event.target).val());
					if (pageNumber < 1) {				
						pageNumber = 1;
					} else if (pageNumber > controller.options.paging.pageCount) {
						pageNumber = controller.options.paging.pageCount;
					}
					controller.options.api.setPageNumber(pageNumber);
					$(event.target).select();							
				}	
			});

			//
			inputPageNumber.focusin(function(event) {
				$(event.target).select();
			});

			//
			var labelPageCount = $(document.createElement('span'));
			labelPageCount.addClass('label-page-count');
			//labelPageCount.html('of 156');
			paging.append(labelPageCount);

			//
			var separator2 = $(document.createElement('span'));
			separator2.addClass('separator');
			paging.append(separator2);

			//Next Page Button
			var buttonNext = $(document.createElement('span'));
			buttonNext.addClass('button');
			buttonNext.addClass('button-next');
			buttonNext.addClass('disabled');		
			paging.append(buttonNext);
			buttonNext.click(function(event) {
				controller.options.api.setPageNumber(controller.options.api.getPageNumber() + 1);
			});

			//
			var buttonLast = $(document.createElement('span'));
			buttonLast.addClass('button');
			buttonLast.addClass('button-last');
			buttonLast.addClass('disabled');
			paging.append(buttonLast);
			buttonLast.click(function(event) {
				controller.options.api.setPageNumber(controller.options.paging.pageCount);
			});

			//
			var separator3 = $(document.createElement('span'));
			separator3.addClass('separator');
			paging.append(separator3);

			//
			var refreshButton = $(document.createElement('span'));
			refreshButton.addClass('button');
			refreshButton.addClass('button-refresh');
			paging.append(refreshButton);
			refreshButton.click(function(event) {
				controller.options.api.reload();
			});

			//
			var labelRecordCount = $(document.createElement('span'));
			labelRecordCount.addClass('label-record-count');
			//labelRecordCount.html('654 records');
			paging.append(labelRecordCount);

			//
			var separator5 = $(document.createElement('span'));
			separator5.addClass('separator');
			separator5.css('float', 'right');
			paging.append(separator5);

			//
			var labelDisplaying = $(document.createElement('span'));
			labelDisplaying.addClass('label-displaying');
			//labelDisplaying.html('Displaying records 51 - 100 of 6679');
			paging.append(labelDisplaying);


			//Additional buttons
			if (angular.isDefined(pagingOptions.buttons)) {
				if (angular.isArray(pagingOptions.buttons)) {
					var separator4 = $(document.createElement('span'));
					separator4.addClass('separator');
					separator4.css({
						float: 'right',
						'margin-left': '4px'
					});
					paging.append(separator4);

					angular.forEach(pagingOptions.buttons, function(buttonConfig) {
						//
						var additionalButton = $(document.createElement('span'));
						additionalButton.addClass('button');
						additionalButton.addClass('button-additional');
						additionalButton.addClass('disabled');			
						additionalButton.html(buttonConfig.text);
						paging.append(additionalButton);
						additionalButton.get(0).onclick = buttonConfig.click;
					});
				} else {
					console.log('"buttons" property must be a array.');
				}	
			}	

			//
			paging.find('.button').mouseenter(function(event) {
				$(event.target).addClass('hover');
			});

			//
			paging.find('.button').mouseout(function(event) {
				$(event.target).removeClass('hover');
			});

		};

		/**
		 *	
		 *
		 */
		me.defaultFunctions = {

			//AVG
			avg: function(data, columnName) {
				return me.defaultFunctions.sum(data, columnName) / data.length;
			},

			//COUNT
			count: function(data) {
				return data.length;
			},

			//MAX
			max: function(data, columnName) {
				var maxValue = Number.MIN_VALUE;			
				for (var recIndex = 0 ; recIndex < data.length ; recIndex++) {
					let record = data[recIndex];
					let value = record[columnName];
					if (value > maxValue) {
						maxValue = value;
					}
				}

				return maxValue;
			},

			//MIN
			min: function(data, columnName) {
				var minValue = Number.MAX_VALUE;
				for (let recIndex = 0 ; recIndex < data.length ; recIndex++) {
					let record = data[recIndex];
					let value = record[columnName];
					if (value < minValue) {
						minValue = value;
					}
				}

				return minValue;
			},

			//SUM
			sum: function(data, columnName) {
				var sumValue = 0;			
				for (var recIndex = 0 ; recIndex < data.length ; recIndex++) {
					let record = data[recIndex];
					sumValue += record[columnName];
				}

				return sumValue;
			},

		};

		//
		//
		var _rendererRealcedCells = function(colName, value, searchInfo) {
			var keys = Object.keys(searchInfo.valuesToFind);
			if (keys.indexOf(colName) === -1) {
				return value;
			} else {
				var valueToFind = searchInfo.valuesToFind[colName];
				var pos = value.indexOf(valueToFind);
				if (pos === -1) {
					return value;
				} else {
					var realce = searchInfo.opts.inLine.realce;
					var newValue = ''; 
					var initPos = pos;
					while (pos !== -1) {
						newValue += value.substring(value, pos);
						var valueToTemplate = value.substring(pos, pos + valueToFind.length);
						var parsedValue = '<span style="' + realce.style + '">' + valueToTemplate + '</span>';
						newValue += parsedValue;

						initPos = pos + parsedValue.length;
						pos = value.indexOf(valueToFind, initPos);
					}
					return newValue;			
				}		
			}
		};

		/**
		 *	
		 *
		 */
		me.rowDetailsExpand = function(controller, rowElement, record, rowIndex) {	
			var spinnerCell = rowElement.find('.ui-cell-inner.row-detail');
			spinnerCell.removeClass('expand');		
			spinnerCell.addClass('collapse');		

			rowElement.addClass('row-detail-expanded');
			controller.managerRendererItems.insertRowDefailtBox(rowIndex);
			controller.options.api.repaint();
		};	

		/**
		 *	
		 *
		 */
		me.rowDetailsCollapse = function(controller, rowElement, record, rowIndex) {	
			var spinnerCell = rowElement.find('.ui-cell-inner.row-detail');
			spinnerCell.removeClass('collapse');
			spinnerCell.addClass('expand');		

			rowElement.removeClass('row-detail-expanded');		
			controller.managerRendererItems.removeRowDetailtBox(rowIndex);
			controller.options.api.repaint();		
		};


		var _removeElementsBelow = function(controller, rowElementGroup, childrenSize, rowIndex, factor) {
			var topToIncrease = childrenSize * controller.managerRendererItems.rowHeight;
			topToIncrease = topToIncrease * factor;
			rowElementGroup.parent().find('.ui-row').filter(function() {
				return $(this).attr('rowindex') > rowIndex;
			}).remove();
		};

		/**
		 *	
		 *
		 */
		me.groupExpand = function(controller, rowElement, record, rowIndex) {

			var groupIndex = rowElement.attr('groupIndex');	
			//Row Detail is a grouping		
			if (angular.isDefined(groupIndex)) {
				groupIndex = parseInt(groupIndex);

				//
				var childrenIndexes = [];
				var data = controller.options.data;
				for (let index = 0 ; index < controller.options.data.length ; index++) {
					var rec = controller.options.data[index];
					if (rec.groupIndex === groupIndex) {
						childrenIndexes.push(index);
					}
				}

				//
				controller.managerRendererItems.insertChildrenGroup(groupIndex, childrenIndexes);
				controller.options.api.repaint();
			}
		};

		/**
		 *	
		 *
		 */
		me.groupCollapse = function(controller, rowElement, record, rowIndex) {
			
			var groupIndex = rowElement.attr('groupIndex');
			//Row Detail is a grouping		
			if (angular.isDefined(groupIndex)) {
				groupIndex = parseInt(groupIndex);
				
				//
				controller.managerRendererItems.removeAllChildrenGroup(groupIndex);
				controller.options.api.repaint();
			}
		};

		/**
		 *
		 *
		 */
		me.transformToArrayValue = function(valueToTransform) {
			var transformedValue = [];
			if (valueToTransform) {
				if (Array.isArray(valueToTransform)) {
					transformedValue = valueToTransform;
				} else {
					transformedValue.push(valueToTransform);
				}				
			}	
			return transformedValue;
		};

		/**
		 *
		 *
		 */
	    me.applyTemplateValues = function(template, record, aditionalJson) {
	    	var newJson = me.prepareForNestedJson(record);

	    	//
			angular.extend(newJson, aditionalJson);

	    	var keys = Object.keys(newJson);
	    	var parsedTemplate = template;

	    	for (let index = 0 ; index < keys.length ; index++) {
	    		var key = keys[index];
	    		var value = newJson[key];

				//var regexp = new RegExp('\\{' + key + '\\}', 'gi');
	    		//parsedTemplate = parsedTemplate.replace(regexp, value);
	    		var searchStr = '{' + key + '}';
	    		var indexOf = parsedTemplate.indexOf(searchStr);
	    		while (indexOf !== -1) {
	    			parsedTemplate = parsedTemplate.replace(searchStr, value);
	    			indexOf = parsedTemplate.indexOf(searchStr, indexOf + value.length);
	    		}
	    	}

	    	return parsedTemplate;
	    };


	 	/**
	 	 * Below is a example in which is necessary the prepareForNestedJson function
		 *	 {
	     *   	name: 'Alisha', 
	     *   	address: {
	     *   		city: 'Welch'
	     *		}
	     *   }
	     */
		me.prepareForNestedJson = function(json){
			var root = {};
		 	var tree = function(json, index){
				var suffix = toString.call(json) === '[object Array]' ? ']' : '';
				for(var key in json){
					if (!json.hasOwnProperty(key)) {
						continue;
					}	
					if (!angular.isObject(json[key])) {
		    			root[index + key + suffix] = json[key];						
					}
		    		if (toString.call(json[key]) === '[object Array]' ) {
		    			tree(json[key], index + key + suffix + '[');
		    		} else if(toString.call(json[key]) === '[object Object]') {
		    			tree(json[key], index + key + suffix + '.');   
		    		}	
		   		}
		 	};

		 	tree(json, '');

		 	return root;
		};

		/**
		 *	Usage:  getColumns(controller, controller.options.columns)
		 *
		*/
	    me.getColumns = function(controller, sourceColumns) {

	    	var columns = [];
			for (let index = 0 ; index < sourceColumns.length ; index++) {
				var column = sourceColumns[index];

				//
				if (column.columns) {
					columns = columns.concat(me.getColumns(controller, column.columns));
				} else {
					columns.push(column);
				}
			}

			return columns;
	    };
		

		/**
		 *
		 *
		 */
		me.isFixedColumn = function(controller, columnName) {
			if ((controller.options.fixedCols) && (controller.options.fixedCols.columns)) {
				for (let index = 0 ; index < controller.options.fixedCols.columns.length ; index++) {
					if (controller.options.fixedCols.columns[index].name === columnName) {
						return true;
					}
				}
			} else {
				return false;
			}
		};

		/**
		 *
		 *
		 *
		 */
	    me.format = function() {
	        var formatted = arguments[0];
	        for (var i = 1; i < arguments.length; i++) {
	            var regexp = new RegExp('\\{' + (i - 1).toString() + '\\}', 'gi');
	            formatted = formatted.replace(regexp, arguments[i]);
	        }
	        return formatted;        
	    };
		
		/**
		 * This guy manages which items the grid should render
		 *
		 *
		 */
		me.ManagerRendererItems = function(controller) {
			var mng = this;

			mng.rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));

			//
			mng.items = [];
			//
			mng.renderedItems = [];

			//
			mng.createItems = function() {
				mng.items = [];
				var data;
				var top = 0;

				//
				if (controller.options.api.isGrouped()) {
					for (let index = 0 ; index < controller.options.dataGroup.length ; index++) {

						//
						mng.items.push({
							top: top,
							height: mng.rowHeight,						
							rowIndex: controller.options.dataGroup[index].rowIndex,
							groupIndex: index,
							children: controller.options.dataGroup[index].children
						});
						top += mng.rowHeight;

						//
						if ((me.hasColumnFooter(controller)) && (controller.columnFooterRowsNumberGrouping > 0)) {
							//
							let rowHeight = controller.options.columnGroupingFooterRowHeight;
							rowHeight = parseInt(rowHeight.toString().replace('px', ''));
							rowHeight = rowHeight * controller.columnFooterRowsNumberGrouping;

							//
							mng.items.push({
								top: top,
								height: rowHeight,
								rowIndex: controller.options.dataGroup[index].rowIndex,
								groupIndex: index,
								children: controller.options.dataGroup[index].children,
								footerContainer: true
							});
							top += rowHeight;
						}
					}
				//	
				} else {
					//It might have more than one record by row whe is configured 'cardView' property 
					var recordsByRow = angular.isDefined(controller.options.cardView) ? controller.options.cardView.numberOfColumns : 1;
					
					//for (let index = 0 ; index < controller.options.data.length ; index++) {
					var index = 0;	
					while (index < controller.options.data.length) {	
					
						for (let indexRecord = 0 ; indexRecord < recordsByRow ; indexRecord++) {
							mng.items.push({
								top: top,
								height: mng.rowHeight,
								rowIndex: index
							});
							top += mng.rowHeight;

							if ((controller.options.rowDetails) && (controller.options.rowDetails.autoExpand)) {
								let rowHeight = controller.options.rowDetails.height || 50;
								rowHeight = parseInt(rowHeight.toString().replace('px', ''));
								mng.items.push({
									top: top,
									height: rowHeight,
									rowIndex: index,
									rowDetails: true
								});
								top += rowHeight;
							}	
							
							index++;
						}	
					}
				}
			};

			//
			mng.removeRow = function(controller, rowIndex) {
				var found = false;
				var top;
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];

					if (found) {
						item.rowIndex--;
						item.top = top;
						if (item.rendered) {
							item.rowElement.remove();
						}
						item.rendered = false;
						top += item.height;
					} else {
						if (item.rowIndex === rowIndex) {
							found = true;
							top = item.top;
							mng.items.splice(index, 1);						
							if (item.rendered) {
								item.rowElement.remove();
							}
							controller.options.data.splice(rowIndex, 1);
							index--;
						}
					}	
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);
			};	

			//
			mng.insertRowDefailtBox = function(rowIndex) {
				
				var found = false;
				var top;
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];

					if (found) {
						item.top = top;
						if (item.rendered) {
							item.rowElement.css('top', top + 'px');
						}
						top += item.height;
					} else {
						if (item.rowIndex === rowIndex) {
							item.expanded = true;
							found = true;
							top = item.top + item.height - 2;

							var rowHeight = controller.options.rowDetails.height || 50;
							rowHeight = parseInt(rowHeight.toString().replace('px', ''));

							mng.items.splice(index + 1, 0, {
								top: top,
								height: rowHeight, //elementRowDefailBox.height(), //TODO: <<--								
								rowIndex: rowIndex,
								rowDetails: true
								//rowElement: elementRowDefailBox,
								//rendered: true //it is important!
							});
							index++;
							top += rowHeight;
						}
					}	
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);
			};

			//
			mng.removeRowDetailtBox = function(rowIndex) {
				
				var found = false;
				var top;
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];

					if (found) {
						item.top = top;
						if (item.rendered) {
							item.rowElement.css('top', top + 'px');
						}
						top += item.height;
					} else {
						if (item.rowIndex === rowIndex) {
							item.expanded = false;
							found = true;
							top = item.top + item.height;
							//mng.items[index+1].rowElement.remove();
							controller.bodyContainer.find('.ui-row.row-detail-container[rowindex=' + rowIndex + ']').remove();

							//remove the row detail box
							mng.items.splice(index+1, 1);
						}
					}	
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);				
			};

			//
			mng.insertChildrenGroup = function(groupIndex, childrenIndexes) {
				
				var found = false;
				var top;
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];

					if (found) {
						item.top = top;
						if (item.rendered) {
							item.rowElement.css('top', top + 'px');
						}
						top += item.height;
					} else {
						if (item.groupIndex === groupIndex) {
							item.expanded = true;
							found = true;
							top = item.top + item.height;

							for (var recIndex = 0 ; recIndex < childrenIndexes.length ; recIndex++) {
								mng.items.splice(index + 1 + recIndex, 0, {
									top: top,
									height: mng.rowHeight,								
									rowIndex: childrenIndexes[recIndex],
									groupIndex: groupIndex,
									indexInsideGroup: recIndex
								});
								top += mng.rowHeight;
							}
							index += childrenIndexes.length;
						}
					}	
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);
			};

			//
			mng.removeAllChildrenGroup = function(groupIndex) {
				
				var found = false;
				var top;
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];

					if (found) {
						item.top = top;
						if (item.rendered) {
							item.rowElement.css('top', top + 'px');
						}
						top += item.height;
					} else {
						if (item.groupIndex === groupIndex) {
							item.expanded = false;
							found = true;
							index++;
							while (mng.items[index].groupIndex === groupIndex) {
								var childItem = mng.items[index];
								if (childItem.footerContainer) {
									break;
								} else {	
									if (childItem.rendered) {
										childItem.rowElement.remove();
										//childItem.rendered = false;
									}
									mng.items.splice(index, 1);
								}	
							}
							index--;						
							top = item.top + item.height;
						}
					}	
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);
			};


			//
			mng.getVisibleRows = function() {

				//
				var itemsToRender = [];

				//
				var scrollTop = controller.bodyViewport.scrollTop();
				var scrollBottom = scrollTop + controller.bodyViewport.height();			

				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];
					if (((item.top + item.height) > scrollTop) && (item.top < scrollBottom)) {
						itemsToRender.push(item);
					}
				}

				return itemsToRender;
			};

			//
			mng.removeAllNotVisibleElementsRows = function(controller, visibleRows) {
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];
					if (item.rendered) {
						if (visibleRows.indexOf(item) === -1) {					

							//
							if (!item.footerContainer) {
								//
								var selector = '.ui-row[rowindex=' + item.rowIndex + ']:not(.ui-grouping-footer-container)';

								//
								controller.bodyContainer.find(selector).remove();

								//
								controller.fixedColsBodyContainer.find(selector).remove();

								//
								item.rendered = false;
								item.rowElement = undefined;
							}	
						}	
					}
				}
			};

			//
			mng.setAllElementsToNotRendered = function() {
				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];
					item.rendered = false;
					item.rowElement = undefined;
				}
			};

			//
			mng.getInfoGroup = function(groupIndex) {

				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];
					//it get only the rows which are groping
					if ((item.groupIndex === groupIndex) && (angular.isDefined(item.children))) {
						return item;
					}
				}

				return null;
			};

			//
			mng.getInfoRow = function(rowIndex) {

				for (let index = 0 ; index < mng.items.length ; index++) {
					var item = mng.items[index];
					//it don't get the rows which are groping
					//if ((item.rowIndex == rowIndex) && (!angular.isDefined(item.children))) {
					if (item.rowIndex === rowIndex) {
						return item;
					}
				}

				return null;
			};

			mng.adjustElementTop = function(itemRendered) {
				itemRendered.rowElement.css('top', itemRendered.top + 'px');
			};


		}; //ManagerRendererItems (end)


	}

})();