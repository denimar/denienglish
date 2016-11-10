'use strict';

(function () {

	'use strict';

	angular.module('ui-deni-grid', [

		//

	]);
})();
'use strict';

(function () {

			'use strict';

			angular.module('ui-deni-grid').constant('uiDeniGridConstants', {
						//
						FIXED_COL_INDICATOR_WIDTH: '25px',

						//
						FIXED_COL_ROWNUMBER_WIDTH: '38px',

						//
						FIXED_COL_CHECKBOX_WIDTH: '30px',

						//
						DEFAULT_COLUMN_HEADER_HEIGHT: '25px',

						//
						DEFAULT_COLUMN_ROW_FOOTER_HEIGHT: '18px',

						//
						DEFAULT_COLUMN_GROUPING_ROW_FOOTER_HEIGHT: '18px',

						//
						DEFAULT_ROW_HEIGHT: '22px',

						//
						PAGING_HEIGHT: '26px',

						//
						DEFAULT_REALCE_CELLS: 'background-color:#FFFF00;color:black;padding:1px;'
			});
})();
'use strict';

(function () {

	'use strict';

	angular.module('ui-deni-grid').directive('uiDeniGrid', uiDeniGrid);

	function uiDeniGrid($templateCache, uiDeniGridSrv) {
		return {
			restrict: 'E',
			scope: {
				options: '='
			},
			replace: false,
			bindToController: true,
			controllerAs: 'ctrl',
			controller: 'uiDeniGridCtrl',
			template: $templateCache.get('ui-deni-grid')
		};
	}
})();
'use strict';

(function () {

	'use strict';

	/**
  *
  *
  */

	angular.module('ui-deni-grid').service('uiDeniGridUtilSrv', uiDeniGridUtilSrv);

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
		me.getFormatedValue = function (value, format) {
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
		me.setInputEditorDivCell = function (controller, record, column, divCellElement) {

			//
			var createEditor = function createEditor() {
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
					throw new Error('"setInputEditorDivCell : " Property "editor" was set in a wrong way!');
				}

				/////////////////////////////////////////////////////////

				editor.type = editor.type.toLowerCase();
				var input;
				if (editor.type === 'select') {
					input = $(document.createElement('select'));
					//add the items in the select
					for (var index = 0; index < editor.items.length; index++) {
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
				for (var _index = 0; _index < properties.length; _index++) {
					var property = properties[_index];
					if (property !== 'items') {
						//used just for the select input
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

			var resolveInputEditor = function resolveInputEditor(inputEditor, confirm) {
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
			inputEditor.keydown(function (event) {
				//ESCAPE or RETURN pressed
				if (event.keyCode === 27 || event.keyCode === 13) {

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
			inputEditor.focusout(function (event) {
				resolveInputEditor($(event.target), false);
			});

			//
			inputEditor.focus();
		};

		/**
   *	
   *
   */
		me.getRealColumnWidth = function (controller, colWidth, clientWidthParent) {
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
		me.setRealPercentageWidths = function (columns, percentageMaster) {
			var percentageMasterValue = parseFloat(percentageMaster.replace('%', ''));
			for (var index = 0; index < columns.length; index++) {
				if (percentageMaster !== '100%') {
					var percentageWidthValue = parseFloat(columns[index].width.replace('%', ''));
					columns[index].realPercentageWidth = percentageMasterValue * percentageWidthValue / 100 + '%';
				}
				var columnChildren = columns[index].columns;
				if (columnChildren && columnChildren.length > 0) {
					me.setRealPercentageWidths(columnChildren, columns[index].width);
				}
			}
		};

		/**	
   *
   *
   */
		me.getClientWidthDeniGrid = function (controller) {

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
		me.adjustColumnWidtsAccordingColumnHeader = function (controller, headerContainerColumn, colIndex) {

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
		me.adjustAllColumnWidtsAccordingColumnHeader = function (controller) {
			if (angular.isDefined(controller.options.columns)) {
				var columns = me.getColumns(controller, controller.options.columns);
				//Any column was specified in percentage? TODO: create a function to get this
				var anyColumnInPercentage = false;
				for (var _colIndex = 0; _colIndex < controller.options.columns.length; _colIndex++) {
					if (controller.options.columns[_colIndex].width.toString().indexOf('%') !== -1) {
						anyColumnInPercentage = true;
						break;
					}
				}
				if (anyColumnInPercentage) {
					controller.bodyContainer.find('.ui-row').css('width', '100%');
				}
			}

			var colIndex = 0;

			//Fixed Columns
			var headerContainerColumns = controller.fixedColsHeaderContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (var index = 0; index < headerContainerColumns.length; index++) {
				var headerContainerColumn = $(headerContainerColumns[index]);
				me.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
				colIndex++;
			}

			//Variable Columns
			headerContainerColumns = controller.headerContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (var _index2 = 0; _index2 < headerContainerColumns.length; _index2++) {
				var _headerContainerColumn = $(headerContainerColumns[_index2]);
				me.adjustColumnWidtsAccordingColumnHeader(controller, _headerContainerColumn, colIndex);
				colIndex++;
			}
		};

		/**
   *	
   *
   */
		me.setDefaultOptions = function (controller) {

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
			controller.options.hideHeaders = controller.options.hideHeaders === true || angular.isDefined(controller.options.rowTemplate) || angular.isDefined(controller.options.cardView);

			//CardView
			if (controller.options.cardView) {
				controller.options.rowHeight = controller.options.cardView.rowHeight || '150px';
			}
			//Avoid a error when is passed a integer value
			controller.options.rowHeight = controller.options.rowHeight.toString();

			/////////////////////////////////////////////////////
			// Setting default values to the grouping
			/////////////////////////////////////////////////////
			controller.isGrouped = controller.options.enableGrouping && angular.isDefined(controller.options.grouping);
			if (controller.isGrouped) {

				//grouping passed like a string
				if (angular.isString(controller.options.grouping)) {
					controller.options.grouping = {
						expr: controller.options.grouping
					};
				}

				//
				if (!(angular.isObject(controller.options.grouping) && !angular.isArray(controller.options.grouping))) {
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
				var getFixedColsWidth = function getFixedColsWidth(fixedColumns) {
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
						for (var index = 0; index < fixedColumns.length; index++) {
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
				if (angular.isDefined(controller.options.fixedCols.indicator) && controller.options.fixedCols.indicator !== true && controller.options.fixedCols.indicator !== false) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.indicator" property was set in a wrong way! (it must be a boolean value)');
				}

				//fixedCols.rowNumber filled different of 'true' (MUST BE A BOOLEAN VALUE)
				if (angular.isDefined(controller.options.fixedCols.rowNumber) && controller.options.fixedCols.rowNumber !== true && controller.options.fixedCols.rowNumber !== false) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.rowNumber" property was set in a wrong way! (it must be a boolean value)');
				}

				//fixedCols.checkbox filled different of 'true' (MUST BE A BOOLEAN VALUE)
				if (angular.isDefined(controller.options.fixedCols.checkbox) && controller.options.fixedCols.checkbox !== true && controller.options.fixedCols.checkbox !== false) {
					throw new Error('"setInitialDefaultOptions" : "fixedCols.checkbox" property was set in a wrong way! (it must be a boolean value)');
				}

				//Are there columns in the fixed colums?
				var fixedColumns = controller.options.fixedCols.columns;
				if (fixedColumns) {
					if (angular.isArray(fixedColumns)) {
						for (var index = 0; index < fixedColumns.length; index++) {

							//confirms the existence of the column
							var found = false;
							for (var fieldIndex = 0; fieldIndex < controller.options.columns.length; fieldIndex++) {
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
		me.remakeHeightBodyViewportWrapper = function (controller) {
			var paddingfooterDivContainerWidth = 3;

			var otherDivsheight = 0;

			//Showing column header?
			if (controller.headerViewportWrapper.css('display') !== 'none') {
				otherDivsheight += controller.headerViewportWrapper.height();
			}

			//Paging?
			if (controller.options.paging) {
				controller.container.css('height', 'calc(100% - ' + uiDeniGridConstants.PAGING_HEIGHT + ')');
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
		me.hasColumnFooter = function (controller) {

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				var columns = controller.options.columns;
				for (var index = 0; index < columns.length; index++) {
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
		me.getColumnHeaderLevels = function (controller, columns) {
			var greaterLevelChild = 0;
			var levelsChild = 0;
			for (var index = 0; index < columns.length; index++) {
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
		me.getColumnFooterNumber = function (controller) {

			//How many footers?
			var columnFooterNumber = 0;

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				for (var index = 0; index < controller.options.columns.length; index++) {
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
		me.getColumnFooterRowsNumber = function (controller, groupingFooter) {

			//How many footers?
			var columnFooterRowsNumber = 0;

			//this if exists because sometimes there is no need for columns, for example when there is a row template
			if (controller.options.columns) {
				for (var index = 0; index < controller.options.columns.length; index++) {
					var column = controller.options.columns[index];
					//
					if (column.footer) {
						var lenght = 1;
						//
						if (angular.isArray(column.footer)) {
							lenght = 0;
							for (var colIndex = 0; colIndex < column.footer.length; colIndex++) {
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
		me.createColumnFooters = function (controller, footerContainer, columns, gridFooter) {
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
				for (var footerIndex = 0; footerIndex < columnFooterRowsNumber; footerIndex++) {
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
						for (var index = 0; index < columns.length; index++) {
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
					footerContainer.find('.' + cellClass + '[footerColIndex=0]').addClass('first-col');
					footerContainer.find('.' + cellClass + '[footerColIndex=' + (colsLength - 1) + ']').addClass('last-col');
					//}
				}
			}
		};

		/**
   *	
   *
   */
		me.renderColumnFooters = function (controller, footerContainer, columns, data, gridFooter) {
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
			for (var footerRowIndex = 0; footerRowIndex < controller.columnFooterNumber; footerRowIndex++) {
				//
				var recordToFooterRowTemplate = {};

				var footerRow;
				//if hasn't a footerTemplate
				if (!angular.isDefined(controller.options.footerTemplate)) {
					footerRow = $(footerContainer.find('.' + rowClass)[footerRowIndex]);
				}

				//
				for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
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
							var showItemFooter = gridFooter && showInGrid || !gridFooter && showInGrouping;

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
											footer.text = footer.text || footerFn.toLowerCase() + ' : ';

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
					var valueToRender = me.applyTemplateValues(controller.options.footerRowTemplate, recordToFooterRowTemplate);
					footerRow.html(valueToRender);
					footerRow.css('width', '100%');
				}
			}

			//footerTemplate
			if (angular.isDefined(controller.options.footerTemplate)) {
				var _valueToRender = me.applyTemplateValues(controller.options.footerTemplate, recordToFooterTemplate);
				footerContainer.html(_valueToRender);
			}
		};

		me.createPagingItems = function (controller, paging, pagingOptions) {
			//First Page Button
			var buttonFirst = $(document.createElement('span'));
			buttonFirst.addClass('button');
			buttonFirst.addClass('button-first');
			buttonFirst.addClass('disabled');
			paging.append(buttonFirst);
			buttonFirst.click(function (event) {
				controller.options.api.setPageNumber(1);
			});

			//Previous Page Button
			var buttonPrev = $(document.createElement('span'));
			buttonPrev.addClass('button');
			buttonPrev.addClass('button-prev');
			buttonPrev.addClass('disabled');
			paging.append(buttonPrev);
			buttonPrev.click(function (event) {
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
			inputPageNumber.keydown(function (event) {
				if (event.keyCode === 13) {
					//Return
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
			inputPageNumber.focusin(function (event) {
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
			buttonNext.click(function (event) {
				controller.options.api.setPageNumber(controller.options.api.getPageNumber() + 1);
			});

			//
			var buttonLast = $(document.createElement('span'));
			buttonLast.addClass('button');
			buttonLast.addClass('button-last');
			buttonLast.addClass('disabled');
			paging.append(buttonLast);
			buttonLast.click(function (event) {
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
			refreshButton.click(function (event) {
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

					angular.forEach(pagingOptions.buttons, function (buttonConfig) {
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
			paging.find('.button').mouseenter(function (event) {
				$(event.target).addClass('hover');
			});

			//
			paging.find('.button').mouseout(function (event) {
				$(event.target).removeClass('hover');
			});
		};

		/**
   *	
   *
   */
		me.defaultFunctions = {

			//AVG
			avg: function avg(data, columnName) {
				return me.defaultFunctions.sum(data, columnName) / data.length;
			},

			//COUNT
			count: function count(data) {
				return data.length;
			},

			//MAX
			max: function max(data, columnName) {
				var maxValue = Number.MIN_VALUE;
				for (var recIndex = 0; recIndex < data.length; recIndex++) {
					var record = data[recIndex];
					var value = record[columnName];
					if (value > maxValue) {
						maxValue = value;
					}
				}

				return maxValue;
			},

			//MIN
			min: function min(data, columnName) {
				var minValue = Number.MAX_VALUE;
				for (var recIndex = 0; recIndex < data.length; recIndex++) {
					var record = data[recIndex];
					var value = record[columnName];
					if (value < minValue) {
						minValue = value;
					}
				}

				return minValue;
			},

			//SUM
			sum: function sum(data, columnName) {
				var sumValue = 0;
				for (var recIndex = 0; recIndex < data.length; recIndex++) {
					var record = data[recIndex];
					sumValue += record[columnName];
				}

				return sumValue;
			}

		};

		//
		//
		var _rendererRealcedCells = function _rendererRealcedCells(colName, value, searchInfo) {
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
		me.rowDetailsExpand = function (controller, rowElement, record, rowIndex) {
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
		me.rowDetailsCollapse = function (controller, rowElement, record, rowIndex) {
			var spinnerCell = rowElement.find('.ui-cell-inner.row-detail');
			spinnerCell.removeClass('collapse');
			spinnerCell.addClass('expand');

			rowElement.removeClass('row-detail-expanded');
			controller.managerRendererItems.removeRowDetailtBox(rowIndex);
			controller.options.api.repaint();
		};

		var _removeElementsBelow = function _removeElementsBelow(controller, rowElementGroup, childrenSize, rowIndex, factor) {
			var topToIncrease = childrenSize * controller.managerRendererItems.rowHeight;
			topToIncrease = topToIncrease * factor;
			rowElementGroup.parent().find('.ui-row').filter(function () {
				return $(this).attr('rowindex') > rowIndex;
			}).remove();
		};

		/**
   *	
   *
   */
		me.groupExpand = function (controller, rowElement, record, rowIndex) {

			var groupIndex = rowElement.attr('groupIndex');
			//Row Detail is a grouping		
			if (angular.isDefined(groupIndex)) {
				groupIndex = parseInt(groupIndex);

				//
				var childrenIndexes = [];
				var data = controller.options.data;
				for (var index = 0; index < controller.options.data.length; index++) {
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
		me.groupCollapse = function (controller, rowElement, record, rowIndex) {

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
		me.transformToArrayValue = function (valueToTransform) {
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
		me.applyTemplateValues = function (template, record, aditionalJson) {
			var newJson = me.prepareForNestedJson(record);

			//
			angular.extend(newJson, aditionalJson);

			var keys = Object.keys(newJson);
			var parsedTemplate = template;

			for (var index = 0; index < keys.length; index++) {
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
		me.prepareForNestedJson = function (json) {
			var root = {};
			var tree = function tree(json, index) {
				var suffix = toString.call(json) === '[object Array]' ? ']' : '';
				for (var key in json) {
					if (!json.hasOwnProperty(key)) {
						continue;
					}
					if (!angular.isObject(json[key])) {
						root[index + key + suffix] = json[key];
					}
					if (toString.call(json[key]) === '[object Array]') {
						tree(json[key], index + key + suffix + '[');
					} else if (toString.call(json[key]) === '[object Object]') {
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
		me.getColumns = function (controller, sourceColumns) {

			var columns = [];
			for (var index = 0; index < sourceColumns.length; index++) {
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
		me.isFixedColumn = function (controller, columnName) {
			if (controller.options.fixedCols && controller.options.fixedCols.columns) {
				for (var index = 0; index < controller.options.fixedCols.columns.length; index++) {
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
		me.format = function () {
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
		me.ManagerRendererItems = function (controller) {
			var mng = this;

			mng.rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));

			//
			mng.items = [];
			//
			mng.renderedItems = [];

			//
			mng.createItems = function () {
				mng.items = [];
				var data;
				var top = 0;

				//
				if (controller.options.api.isGrouped()) {
					for (var _index3 = 0; _index3 < controller.options.dataGroup.length; _index3++) {

						//
						mng.items.push({
							top: top,
							height: mng.rowHeight,
							rowIndex: controller.options.dataGroup[_index3].rowIndex,
							groupIndex: _index3,
							children: controller.options.dataGroup[_index3].children
						});
						top += mng.rowHeight;

						//
						if (me.hasColumnFooter(controller) && controller.columnFooterRowsNumberGrouping > 0) {
							//
							var rowHeight = controller.options.columnGroupingFooterRowHeight;
							rowHeight = parseInt(rowHeight.toString().replace('px', ''));
							rowHeight = rowHeight * controller.columnFooterRowsNumberGrouping;

							//
							mng.items.push({
								top: top,
								height: rowHeight,
								rowIndex: controller.options.dataGroup[_index3].rowIndex,
								groupIndex: _index3,
								children: controller.options.dataGroup[_index3].children,
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

						for (var indexRecord = 0; indexRecord < recordsByRow; indexRecord++) {
							mng.items.push({
								top: top,
								height: mng.rowHeight,
								rowIndex: index
							});
							top += mng.rowHeight;

							if (controller.options.rowDetails && controller.options.rowDetails.autoExpand) {
								var _rowHeight = controller.options.rowDetails.height || 50;
								_rowHeight = parseInt(_rowHeight.toString().replace('px', ''));
								mng.items.push({
									top: top,
									height: _rowHeight,
									rowIndex: index,
									rowDetails: true
								});
								top += _rowHeight;
							}

							index++;
						}
					}
				}
			};

			//
			mng.removeRow = function (controller, rowIndex) {
				var found = false;
				var top;
				for (var index = 0; index < mng.items.length; index++) {
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
			mng.insertRowDefailtBox = function (rowIndex) {

				var found = false;
				var top;
				for (var index = 0; index < mng.items.length; index++) {
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
			mng.removeRowDetailtBox = function (rowIndex) {

				var found = false;
				var top;
				for (var index = 0; index < mng.items.length; index++) {
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
							mng.items.splice(index + 1, 1);
						}
					}
				}

				var rowsContainerHeight = mng.items[mng.items.length - 1].top + mng.rowHeight;
				controller.bodyContainer.height(rowsContainerHeight);
				controller.fixedColsBodyContainer.height(rowsContainerHeight);
			};

			//
			mng.insertChildrenGroup = function (groupIndex, childrenIndexes) {

				var found = false;
				var top;
				for (var index = 0; index < mng.items.length; index++) {
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

							for (var recIndex = 0; recIndex < childrenIndexes.length; recIndex++) {
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
			mng.removeAllChildrenGroup = function (groupIndex) {

				var found = false;
				var top;
				for (var index = 0; index < mng.items.length; index++) {
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
			mng.getVisibleRows = function () {

				//
				var itemsToRender = [];

				//
				var scrollTop = controller.bodyViewport.scrollTop();
				var scrollBottom = scrollTop + controller.bodyViewport.height();

				for (var index = 0; index < mng.items.length; index++) {
					var item = mng.items[index];
					if (item.top + item.height > scrollTop && item.top < scrollBottom) {
						itemsToRender.push(item);
					}
				}

				return itemsToRender;
			};

			//
			mng.removeAllNotVisibleElementsRows = function (controller, visibleRows) {
				for (var index = 0; index < mng.items.length; index++) {
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
			mng.setAllElementsToNotRendered = function () {
				for (var index = 0; index < mng.items.length; index++) {
					var item = mng.items[index];
					item.rendered = false;
					item.rowElement = undefined;
				}
			};

			//
			mng.getInfoGroup = function (groupIndex) {

				for (var index = 0; index < mng.items.length; index++) {
					var item = mng.items[index];
					//it get only the rows which are groping
					if (item.groupIndex === groupIndex && angular.isDefined(item.children)) {
						return item;
					}
				}

				return null;
			};

			//
			mng.getInfoRow = function (rowIndex) {

				for (var index = 0; index < mng.items.length; index++) {
					var item = mng.items[index];
					//it don't get the rows which are groping
					//if ((item.rowIndex == rowIndex) && (!angular.isDefined(item.children))) {
					if (item.rowIndex === rowIndex) {
						return item;
					}
				}

				return null;
			};

			mng.adjustElementTop = function (itemRendered) {
				itemRendered.rowElement.css('top', itemRendered.top + 'px');
			};
		}; //ManagerRendererItems (end)

	}
})();
'use strict';

(function () {

	'use strict';

	angular.module('ui-deni-grid').controller('uiDeniGridCtrl', uiDeniGridCtrl);

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

		vm.element.show(function (event) {
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
			if (uiDeniGridUtilSrv.hasColumnFooter(vm) && vm.columnFooterRowsNumberGrid > 0) {
				//
				uiDeniGridUtilSrv.createColumnFooters(vm, vm.footerContainer, vm.options.columns, true);
				//How many footers?
				var columnFooterRowsNumber = vm.footerContainer.find('.ui-footer-row').length;
				//There is no need to add paadding when a footerRowTemplate was set
				var padding = angular.isDefined(vm.options.footerRowTemplate) ? '0px' : '2px';
				vm.footerViewportWrapper.css({
					'padding-top': padding
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
			uiDeniGridSrv.createUiDeniViewEvents(vm); //TODO: change the name of this method

			//
			uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(vm);

			if (vm.options.data) {
				vm.options.api.loadData(vm.options.data);
			} else if (vm.options.url && vm.options.autoLoad) {
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
			clearSelections: function clearSelections() {
				uiDeniGridSrv.clearSelections(controller);
			},

			/**
    *	
    *
    */
			find: function find(valuesToFind, opts) {
				return uiDeniGridSrv.find(controller, valuesToFind, opts);
			},

			/**
    *	
    *
    */
			findFirst: function findFirst(valuesToFind, opts) {
				return uiDeniGridSrv.findFirst(controller, valuesToFind, opts);
			},

			/**
    *	
    *
    */
			findKey: function findKey(keyValue, opts) {
				return uiDeniGridSrv.findKey(controller, keyValue, opts);
			},

			/**
    *	
    *
    */
			findLast: function findLast(valuesToFind, opts) {
				return uiDeniGridSrv.findLast(controller, valuesToFind, opts);
			},

			/**
    *	
    *
    */
			findNext: function findNext(valuesToFind, opts) {
				return uiDeniGridSrv.findNext(controller, valuesToFind, opts);
			},

			/**
    *	
    *
    */
			findPrevious: function findPrevious(valuesToFind, opts) {
				return uiDeniGridSrv.findPrevious(controller, valuesToFind, opts);
			},

			/**
    *	
    *
    */
			filter: function filter(valuesToFilter, opts) {
				return uiDeniGridSrv.filter(controller, valuesToFilter, opts);
			},

			/**
    *	
    *
   */
			getChangedRecords: function getChangedRecords() {
				return uiDeniGridSrv.getChangedRecords(controller);
			},

			/**
    *	
    *
   */
			getColumn: function getColumn(fieldName) {
				return uiDeniGridSrv.getColumn(controller, fieldName);
			},

			/**
    *	
    *
    */
			getEnabled: function getEnabled(enabled) {
				return controller.enabled;
			},

			/**
    *	
    *
    */
			getPageNumber: function getPageNumber() {
				return uiDeniGridSrv.getPageNumber(controller);
			},

			/**
    *	
    *
    */
			getRowHeight: function getRowHeight() {
				return uiDeniGridSrv.getRowIndex(controller);
			},

			/**
    *	
    *
   */
			getRowIndex: function getRowIndex(record) {
				return uiDeniGridSrv.getRowIndex(controller, record);
			},

			/**
    *	
    *
   */
			getSelectedRow: function getSelectedRow() {
				return uiDeniGridSrv.getSelectedRow(controller);
			},

			/**
    *	
    *
   */
			getSelectedRowIndex: function getSelectedRowIndex() {
				return uiDeniGridSrv.getSelectedRowIndex(controller);
			},

			/**
    *	
    *
    */
			isEnableGrouping: function isEnableGrouping() {
				return uiDeniGridSrv.isEnableGrouping(controller);
			},

			/**
    *	
    *
    */
			isGrouped: function isGrouped() {
				return uiDeniGridSrv.isGrouped(controller);
			},

			/**
    *	
    *
   */
			isRowSelected: function isRowSelected(row) {
				return uiDeniGridSrv.isRowSelected(controller, row);
			},

			/**
    * @param row {Element|Integer} Can be the rowIndex or a jquery element row
    * 
    */
			isRowVisible: function isRowVisible(row) {
				return uiDeniGridSrv.isRowVisible(controller, row);
			},

			/**
    *	
    *
    */
			load: function load() {
				uiDeniGridSrv.load(controller);
			},

			/**
    *	
    *
    */
			loadData: function loadData(data) {
				uiDeniGridSrv.loadData(controller, data);
			},

			/**
    *	
    *
   */
			isHideHeaders: function isHideHeaders() {
				return uiDeniGridSrv.isHideHeaders(controller);
			},

			/**
    *	
    *
    */
			reload: function reload() {
				return uiDeniGridSrv.reload(controller);
			},

			/**
    *	
    *
    */
			removeRow: function removeRow(row) {
				uiDeniGridSrv.removeRow(controller, row);
			},

			/**
    *	
    *
    */
			removeSelectedRows: function removeSelectedRows() {
				uiDeniGridSrv.removeSelectedRows(controller);
			},

			/**
    *	
    *
   */
			resolveRowElement: function resolveRowElement(row) {
				return uiDeniGridSrv.resolveRowElement(controller, row);
			},

			/**
    *	
    *
   */
			resolveRowIndex: function resolveRowIndex(row) {
				return uiDeniGridSrv.resolveRowIndex(controller, row);
			},

			/**
    *	
    *
    */
			repaint: function repaint() {
				uiDeniGridSrv.repaint(controller);
			},

			/**
    *	
    *
    */
			repaintRow: function repaintRow(row) {
				return uiDeniGridSrv.repaintRow(controller, row);
			},

			/**
    *	
    *
    */
			repaintSelectedRow: function repaintSelectedRow() {
				return uiDeniGridSrv.repaintSelectedRow(controller);
			},

			/**
    *	
    *
    */
			setDisableGrouping: function setDisableGrouping() {
				uiDeniGridSrv.setDisableGrouping(controller);
			},

			/**
    *	
    *
    */
			setEnableGrouping: function setEnableGrouping() {
				uiDeniGridSrv.setEnableGrouping(controller);
			},

			/**
    *	
    *
   */
			setHideHeaders: function setHideHeaders(hideHeaders) {
				return uiDeniGridSrv.setHideHeaders(controller, hideHeaders);
			},

			/**
    *	
    *
    */
			selectAll: function selectAll() {
				uiDeniGridSrv.selectAll(controller);
			},

			/**
    *	
    *
    */
			setEnabled: function setEnabled(enabled) {
				uiDeniGridSrv.setEnabled(controller, enabled);
			},

			/**
    *	
    *
   */
			selectRow: function selectRow(row, preventSelecionChange, scrollIntoView) {
				uiDeniGridSrv.selectRow(controller, row, preventSelecionChange, scrollIntoView);
			},

			/**
    *	
    *
    */
			setPageNumber: function setPageNumber(pageNumber) {
				uiDeniGridSrv.setPageNumber(controller, pageNumber);
			},

			/**
    *	
    *
    */
			setRowHeight: function setRowHeight(rowHeight) {
				uiDeniGridSrv.setRowHeight(controller, rowHeight);
			},

			/**
    *	
    *
    */
			setToogleGrouping: function setToogleGrouping() {
				uiDeniGridSrv.setToogleGrouping(controller);
			},

			/**
    *	
    * holdSelection {boolean} true is default
   */
			sort: function sort(sorters, holdSelection) {
				controller.options.sorters = uiDeniGridSrv.sort(controller, sorters, holdSelection);
				return controller.options.sorters;
			},

			/**
    *	
    *
   */
			updateSelectedRow: function updateSelectedRow(json) {
				uiDeniGridSrv.updateSelectedRow(controller, json);
			},

			/**
    *	
    *
   */
			updateCell: function updateCell(rowIndex, colIndex, value) {
				uiDeniGridSrv.updateCell(controller, rowIndex, colIndex, value);
			},

			/**
    *	
    *
   */
			updateSelectedCell: function updateSelectedCell(value) {
				uiDeniGridSrv.updateSelectedCell(controller, value);
			}
		};
	}
})();
'use strict';

(function () {

	'use strict';

	angular.module('ui-deni-grid').service('uiDeniGridSrv', uiDeniGridSrv);

	function uiDeniGridSrv($compile, $timeout, $templateCache, $q, $http, $filter, uiDeniGridUtilSrv, uiDeniGridConstants) {
		var me = this;

		/**
   *
   * remove all selections in the grid
   *
   */
		me.clearSelections = function (controller) {
			controller.bodyViewport.find('.ui-row.selected').removeClass('selected');
			controller.fixedColsBodyViewport.find('.ui-row.selected').removeClass('selected');

			controller.bodyViewport.find('.ui-cell.selected').removeClass('selected');
			controller.fixedColsBodyViewport.find('.ui-cell.selected').removeClass('selected');
		};

		/**
   *
   * select all records in the grid
   *
   */
		me.selectAll = function (controller) {
			if (controller.options.multiSelect) {
				controller.bodyViewport.find('.ui-row.selected').addClass('selected');
				controller.bodyViewport.find('.ui-cell.selected').addClass('selected');
			} else {
				throw new Error('"selectAll" : to use selectAll method you must set multiSelect property to true!');
			}
		};

		/**
   *
   * @param headerContainerColumnRow optional comes filled just when we creating sub columns (grouped column headers)
   */
		me.createColumnHeaders = function (controller, columnsToCreate, headerContainerColumnRow, level, colIndexStart) {
			var columns = [];

			var createDivHeaderContainerColumnRow = function createDivHeaderContainerColumnRow(headerContainerColumn) {
				//ui-header-container-column-row
				var divHeaderContainerColumnRow = $(document.createElement('div'));
				divHeaderContainerColumnRow.addClass('ui-header-container-column-row');
				divHeaderContainerColumnRow.css('height', controller.options.columnHeaderHeight);
				headerContainerColumn.append(divHeaderContainerColumnRow);

				return divHeaderContainerColumnRow;
			};

			if (controller.options.fixedCols) {
				angular.copy(columnsToCreate, columns);

				//Row Number?
				if (controller.options.fixedCols.rowNumber) {
					columns.splice(0, 0, {
						width: uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH,
						isFixedColumn: true
					});
				}

				//Indicator?
				if (controller.options.fixedCols.indicator) {
					columns.splice(0, 0, {
						width: uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH,
						isFixedColumn: true
					});
				}

				//CheckBox?
				if (controller.options.fixedCols.checkbox) {
					columns.splice(0, 0, {
						width: uiDeniGridConstants.FIXED_COL_CHECKBOX_WIDTH,
						isFixedColumn: true,
						isCheckbox: true
					});
				}
			} else {
				columns = columnsToCreate;
			}

			//
			var clientWidthParent = headerContainerColumnRow ? headerContainerColumnRow.width() : controller.clientWidth;
			//
			//var columnHeaderLevels = uiDeniGridUtilSrv.getColumnHeaderLevels(me, me.options.columns);
			//
			var currentLevel = level || 1;

			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var idx = 0; idx < controller.options.columns.length; idx++) {
				if (controller.options.columns[idx].width.toString().indexOf('%') !== -1) {
					anyColumnInPercentage = true;
					break;
				}
			}

			//
			if (anyColumnInPercentage) {
				controller.headerViewport.css('width', 'calc(100% - 17px)');
				controller.headerContainer.css('width', '100%');
			}

			var colIndex = colIndexStart || 0;

			//
			for (var index = 0; index < columns.length; index++) {
				var column = columns[index];

				//ui-header-container-column
				var divHeaderContainerColumn = $(document.createElement('div'));

				//
				//if (anyColumnInPercentage) { aqui
				divHeaderContainerColumn.css('width', column.width);
				//} else {	
				//divHeaderContainerColumn.css('width', uiDeniGridUtilSrv.getRealColumnWidth(controller, column.width, clientWidthParent));
				//}	

				divHeaderContainerColumn.addClass('ui-header-container-column');
				divHeaderContainerColumn.attr('colindex', colIndex);
				if (angular.isDefined(headerContainerColumnRow)) {
					if (index === 0) {
						divHeaderContainerColumn.addClass('first-subcolumn');
					} else if (index === columns.length - 1) {
						divHeaderContainerColumn.addClass('last-subcolumn');
					}
				}

				//ui-header-container-column-row
				var divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);

				//ui-header-cell
				var divHeaderCell = $(document.createElement('div'));
				divHeaderCell.addClass('ui-header-cell');
				divHeaderCell.attr('colindex', colIndex);
				divHeaderCell.attr('name', column.name);
				divHeaderCell.css('text-align', column.align);
				divHeaderContainerColumnRow.append(divHeaderCell);

				//ui-header-cell-inner
				var spanHeaderCellInner = $(document.createElement('span'));
				spanHeaderCellInner.addClass('ui-header-cell-inner');
				divHeaderCell.append(spanHeaderCellInner);

				if (column.isCheckbox) {
					var inputCheck = $(document.createElement('input'));
					inputCheck.attr('type', 'checkbox');
					inputCheck.css({
						cursor: 'pointer'
					});
					divHeaderCell.css({
						'text-align': 'center'
					});
					spanHeaderCellInner.append(inputCheck);
					inputCheck.change(function (event) {
						var checkboxes = controller.fixedColsBodyContainer.find('.ui-cell-inner.checkbox').find('input[type=checkbox]');
						for (var _index = 0; _index < checkboxes.length; _index++) {
							checkboxes[_index].checked = event.target.checked;
						}
					});
				} else {
					var content = column.header || column.name;
					spanHeaderCellInner.html(content);

					if (column.action) {
						//
						divHeaderContainerColumn.addClass('action-button-column');
						//
						divHeaderCell.addClass('action-button-column');
					}
				}

				//container param comes filled just when we creating sub columns (grouped column headers)
				if (angular.isDefined(headerContainerColumnRow)) {
					headerContainerColumnRow.append(divHeaderContainerColumn);
				} else {

					//fixed column?
					if (column.isFixedColumn || uiDeniGridUtilSrv.isFixedColumn(controller, column.name)) {
						controller.fixedColsHeaderContainer.append(divHeaderContainerColumn);
					} else {
						controller.headerContainer.append(divHeaderContainerColumn);
					}
				}

				//
				if (controller.columnHeaderLevels > 1) {
					//
					if (column.columns) {
						//
						divHeaderContainerColumn.addClass('has-subcolumns');
						//
						divHeaderCell.addClass('has-subcolumns');
						//ui-header-container-column-row
						divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);
						//
						me.createColumnHeaders(controller, column.columns, divHeaderContainerColumnRow, currentLevel + 1, colIndex);
						//
						var lastColumnAdded = divHeaderContainerColumnRow.find('.ui-header-container-column.last-subcolumn');
						colIndex = lastColumnAdded.attr('colIndex');
					} else {
						if (currentLevel < controller.columnHeaderLevels) {
							//
							var heightDivHeaderContainerColumnRow = divHeaderContainerColumnRow.css('height');
							//
							var missingLevels = controller.columnHeaderLevels - currentLevel;
							//
							var calcNewHeight = 'calc(' + heightDivHeaderContainerColumnRow + ' + (' + controller.options.columnHeaderHeight + ' * ' + missingLevels + '))';
							//
							divHeaderContainerColumnRow.css({
								height: calcNewHeight
							});
						}
					}
				}

				colIndex++;
			}
		};

		/**
   *
   *
   */

		me.createColumnHeadersEvents = function (controller) {
			var hrVerticalLineResizing;
			//var columnHeaderCellResizing;
			var headerContainerColumnResizing;
			var canResize = false;

			var updResizing = function updResizing() {
				//controller.colsViewport.css('cursor', 'col-resize');
				//if ((columnHeaderCellResizing) && (event.which == 1)) {
				if (!angular.isDefined(hrVerticalLineResizing)) {
					hrVerticalLineResizing = document.createElement('hr');
					hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
					controller.colsViewport.append(hrVerticalLineResizing);
				}

				var leftResizing = event.pageX - controller.colsViewport.offset().left;
				//console.info(leftResizing);
				$(hrVerticalLineResizing).css({
					display: 'block',
					left: leftResizing,
					height: controller.colsViewport.height() + 'px'
				});
				//} else 	{
				//	$(hrVerticalLineResizing).css('display', 'none');
				//}
			};

			var setResizing = function setResizing() {
				if (!hrVerticalLineResizing) {
					hrVerticalLineResizing = document.createElement('hr');
					hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
					controller.colsViewport.append(hrVerticalLineResizing);
				}
				updResizing();
			};

			var setResizingOff = function setResizingOff() {
				controller.resizing = false;
				//columnHeaderCellResizing = null;
				headerContainerColumnResizing = null;
				controller.colsViewport.css('cursor', 'default');
				if (hrVerticalLineResizing) {
					$(hrVerticalLineResizing).css('display', 'none');
				}
			};

			//Mouse Down
			controller.headerContainer.mousedown(function (event) {
				if (!controller.enabled) {
					return;
				}

				var headerContainerColumn = $(event.target).closest('.ui-header-container-column');
				if (headerContainerColumn.length > 0) {
					//if (event.toElement.parentElement === controller.headerContainer.get(0)) {
					if (canResize) {
						controller.resizing = true;
					}
				}
				event.preventDefault();
				//event.stopImmediatePropagation(); //Prevent the mousedown that happening when we are resizing the columns
			});

			//It is necessary when there are grouped columns
			var adjustParentColumnsWidths = function adjustParentColumnsWidths(headerContainerColumn, differenceNewWidth) {
				//
				var headerContainerColumnParent = headerContainerColumn.parents('.ui-header-container-column:eq(0)');
				if (headerContainerColumnParent.length > 0) {
					var children = headerContainerColumnParent.find('.ui-header-container-column');

					//couning border right width (1px)
					var borderWidths = children.length;
					//
					headerContainerColumnParent.width(headerContainerColumnParent.width() + differenceNewWidth - borderWidths);
					//
					return adjustParentColumnsWidths(headerContainerColumnParent, differenceNewWidth);
				}
				return headerContainerColumn;
			};

			//It is necessary when there are grouped columns
			var adjustChildrenColumnsWidths = function adjustChildrenColumnsWidths(headerContainerColumn, newWidth) {
				//
				var children = headerContainerColumn.find('.ui-header-container-column');

				//
				if (children.length > 0) {
					//sum the widths
					var totalWidth = 0;
					for (var index = 0; index < children.length; index++) {
						totalWidth += $(children[index]).width();
					}

					//get the column width percentage
					for (var _index2 = 0; _index2 < children.length; _index2++) {
						var child = $(children[_index2]);
						var percentage = child.width() * 100 / totalWidth;

						child.css('width', newWidth * percentage / 100 + 'px');
					}
				}
			};

			//Mouse Up
			$(document).mouseup(function (event) {
				if (!controller.enabled) {
					return;
				}

				if (controller.resizing) {
					if (headerContainerColumnResizing) {
						//
						//let leftResizing = event.pageX - controller.colsViewport.offset().left;
						//let difference = event.clientX - headerContainerColumnResizing.getBoundingClientRect().right;
						var right = headerContainerColumnResizing.getBoundingClientRect().left + headerContainerColumnResizing.clientWidth;
						var difference = event.pageX - right;
						var $headerContainerColumnResizing = $(headerContainerColumnResizing);
						var newWidth = $headerContainerColumnResizing.width() + difference;

						//It is necessary when there are grouped columns
						if ($headerContainerColumnResizing.is('.has-subcolumns')) {
							//
							var lastSubcolumn = $headerContainerColumnResizing.find('.ui-header-container-column.last-subcolumn');
							var lastSubcolumnWidth = lastSubcolumn.width();
							//
							$headerContainerColumnResizing.width(newWidth);

							//
							var borderWidth = 1;
							lastSubcolumn.width(lastSubcolumnWidth + difference + borderWidth);
							//uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, lastSubcolumn, lastSubcolumn.attr('colindex'));
							//
							//adjustChildrenColumnsWidths($headerContainerColumnResizing, newWidth);

							///////////////////////////////////////////////////////////////////////////////////////////
							// looking for children column headers - It is necessary when there are grouped columns
							///////////////////////////////////////////////////////////////////////////////////////////
							//
							//
							//var headerContainerColumns = $headerContainerColumnResizing.find('.ui-header-container-column');
							//for (let index = 0 ; index < headerContainerColumns.length ; index++) {
							//	var headerContainerColumn = $(headerContainerColumns.get(index));
							//	uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, headerContainerColumn.attr('colindex'));
							//}
							///////////////////////////////////////////////////////////////////////////////////////////
							///////////////////////////////////////////////////////////////////////////////////////////
						} else {

							//
							var lastAdjustedParent = adjustParentColumnsWidths($headerContainerColumnResizing, difference);
							//
							$headerContainerColumnResizing.width(newWidth);
							//
							//uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, $headerContainerColumnResizing, $headerContainerColumnResizing.attr('colindex'));
						}

						uiDeniGridUtilSrv.adjustAllColumnWidtsAccordingColumnHeader(controller);
					}

					setResizingOff();
				}
				controller.colsViewport.css('cursor', 'default');

				event.preventDefault();
			});

			// Returns a function, that, as long as it continues to be invoked, will not
			// be triggered. The function will be called after it stops being called for
			// N milliseconds. If `immediate` is passed, trigger the function on the
			// leading edge, instead of the trailing.
			var debounce = function debounce(func, wait, immediate) {
				var timeout;
				return function () {
					var context = this;
					var args = arguments;
					var later = function later() {
						timeout = null;
						if (!immediate) {
							func.apply(context, args);
						}
					};
					var callNow = immediate && !timeout;
					clearTimeout(timeout);
					timeout = setTimeout(later, wait);
					if (callNow) {
						func.apply(context, args);
					}
				};
			};

			//Mouse Move
			$(document).mousemove(function (event) {
				if (!controller.enabled) {
					return;
				}

				if (controller.options.enableColumnResize) {

					if (event.which === 1) {
						//event.which: left: 1, middle: 2, right: 3 (pressed)
						if (controller.resizing) {
							debounce(updResizing(), 100);
						}
					} else if (event.which === 0) {
						//event.which: left: 1, middle: 2, right: 3 (pressed)
						controller.colsViewport.css('cursor', 'default');

						var headerContainerColumn = $(event.target).closest('.ui-header-container-column');
						if (headerContainerColumn.length > 0) {

							var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
							canResize = false;
							//columnHeaderCellResizing = null;
							headerContainerColumnResizing = null;

							for (var index = 0; index < columnHeadersCell.length; index++) {
								var columnHeaderCell = columnHeadersCell[index];

								var position = columnHeaderCell.getBoundingClientRect();
								if (event.clientX > position.right - 5 && event.clientX < position.right + 3) {
									canResize = true;
									controller.colsViewport.css('cursor', 'col-resize');
									//columnHeaderCellResizing = columnHeaderCell;
									headerContainerColumnResizing = columnHeaderCell.closest('.ui-header-container-column');
									break;
								}
							}

							if (canResize) {
								//setResizing();
							} else {
									//setResizingOff();
								}
						}
					}
				}

				event.preventDefault();
			});

			//////////////
			//////////////
			//////////////
			var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
			for (var index = 0; index < columnHeadersCell.length; index++) {
				var columnHeaderCell = $(columnHeadersCell[index]);

				//
				// Mouse Enter
				columnHeaderCell.mouseenter(function (event) {
					if (!controller.enabled) {
						return;
					}

					$(event.currentTarget).addClass('hover');
				});

				//
				// Mouse Leave
				columnHeaderCell.mouseleave(function (event) {
					if (!controller.enabled) {
						return;
					}

					$(event.currentTarget).removeClass('hover');
				});

				//
				// Mouse Up
				columnHeaderCell.mouseup(function (event) {
					if (!controller.enabled) {
						return;
					}

					if (event.which === 1) {
						//event.which: left: 1, middle: 2, right: 3 (pressed)
						if (controller.colsViewport.css('cursor') === 'default') {
							//prevent conflict with the resizing columns function
							if (controller.options.sortableColumns) {
								var headerContainerColumn = $(event.target.closest('.ui-header-container-column'));

								//Action column should not be ordered
								if (!headerContainerColumn.is('.action-button-column')) {
									var headerCell = $(event.currentTarget);
									var direction = 'ASC'; //default
									if (headerCell.is('.asc')) {
										direction = 'DESC';
									}

									if (!headerContainerColumn.is('.has-subcolumns')) {
										controller.options.api.sort({ name: headerCell.attr('name'), direction: direction });
									}
								}
							}
						}
					}
				});
			}
			//////////////
			//////////////
		};

		/**
   * TODO: It doesn't work when the data is grouped and its children are expanded... IMPROVE THAT!
      *
   * @param sorters {Array|Object|String} direction is optional
   * Example:
   * 		me.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
   * 		me.sort({name: 'city', direction: 'ASC'}); or
   *		me.sort('city');
   *		me.sort(function(rec1, rec2) {
   *			if (rec1.age == rec2.age) return 0;
   *			return rec1.age < rec2.age ? -1 : 1;
   *		});
   *
   */
		var _sort = function _sort(controller, sorters) {
			var sortersArray;
			//Transform param to a Array
			if (angular.isString(sorters)) {
				//passed a string
				sortersArray = [{ name: sorters, direction: 'ASC' }];
			} else if (angular.isObject(sorters)) {
				if (angular.isArray(sorters)) {
					//passed a array
					sortersArray = sorters;
				} else {
					//passed a json
					sortersArray = [sorters];
				}
			} else if (angular.isFunction(sorters)) {
				//Custom Sort
				sortersArray = [sorters];
			} else {
				throw new Error('"sort": param "sorters" passed in a wrong way');
			}

			if (controller.options.data) {
				var sortFn = function sortFn(array) {
					for (var index = 0; index < array.length; index++) {
						var sort = array[index];
						var direction = sort.direction || 'ASC'; //default value
						controller.options.data = $filter('orderBy')(controller.options.data, sort.name, direction.toUpperCase() === 'DESC');
					}
				};
				// Are there fixed sorters?
				if (controller.options.fixedSorters) {
					sortFn(controller.options.fixedSorters);
				}

				sortFn(sortersArray);
			}

			return sortersArray;
		};

		/*
   *
   *
   *
   */
		var _repaintCardView = function _repaintCardView(controller, visibleRow) {
			//It might have more than one record by row whe is configured "cardView" property
			var recordsByRow = controller.options.cardView.numberOfColumns;

			//
			var rowElement = $(document.createElement('div'));
			rowElement.addClass('ui-row');
			rowElement.attr('rowindex', visibleRow.rowIndex);
			rowElement.css('left', '0px');
			rowElement.css('height', visibleRow.height);
			rowElement.css('width', '100%');
			rowElement.css('top', visibleRow.top + 'px');
			rowElement.html('<table class="ui-table-card-view"><tr></tr></table>');
			controller.bodyContainer.append(rowElement);
			var rowTableRowCardView = rowElement.find('tr').get(0);
			var colWidth = (100 / recordsByRow).toString() + '%';

			//
			for (var indexRecord = 0; indexRecord < recordsByRow; indexRecord++) {
				var indexDataRecord = visibleRow.rowIndex;
				//
				if (visibleRow.rowIndex > 0) {
					indexDataRecord = visibleRow.rowIndex * recordsByRow;
				}
				indexDataRecord += indexRecord;

				var record = controller.options.data[indexDataRecord];

				var divCell = $(rowTableRowCardView.insertCell());
				divCell.css('width', colWidth);
				if (record) {
					var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.cardView.template, record);
					divCell.html(valueToRender);
					divCell.prop('record', record);

					divCell.click(function (event) {
						controller.bodyContainer.find('td').removeClass('selected');
						$(event.currentTarget).addClass('selected');

						////////////////////////////////////////////////////
						//onselectionchange event
						////////////////////////////////////////////////////
						if (controller.options.listeners.onselectionchange) {
							controller.options.listeners.onselectionchange(controller, controller.element, indexDataRecord, $(event.currentTarget).prop('record'));
						}
						////////////////////////////////////////////////////
						////////////////////////////////////////////////////
					});

					if (controller.options.cardView.checkbox === true) {
						var checkboxCardView = $(document.createElement('input'));
						checkboxCardView.addClass('checkbox');
						checkboxCardView.attr('type', 'checkbox');
						if (controller.checkedRecords.indexOf(record) !== -1) {
							checkboxCardView.attr('checked', true);
						}
						checkboxCardView.click(function (event) {
							var rec = $(event.target.parent).prop('record');
							var indexOfRec = controller.checkedRecords.indexOf(rec);

							if (indexOfRec !== -1) {
								controller.checkedRecords.splice(indexOfRec, 1);
							}

							if (event.target.checked) {
								controller.checkedRecords.push(rec);
							}

							if (controller.options.listeners.oncheckboxchange) {
								controller.options.listeners.oncheckboxchange(rec, controller.checkedRecords, event.target);
							}
						});
						divCell.append(checkboxCardView);
					}
				}
			}
			visibleRow.rowElement = rowElement;
		};

		/*
   *
   *
   *
   */
		var _repaintRow = function _repaintRow(controller, rowIndex, forceRepaint, execAfterRepaintEvent, rowObject) {
			var itemRow = rowObject || controller.managerRendererItems.getInfoRow(rowIndex);
			if (forceRepaint) {
				itemRow.rendered = false;
				if (angular.isDefined(itemRow.rowElement)) {
					itemRow.rowElement.remove();
				}
				itemRow.rowElement = undefined;
			}

			if (!itemRow.rendered) {

				// Card View
				if (angular.isDefined(controller.options.cardView)) {
					_repaintCardView(controller, itemRow);

					// Not a Card View
				} else {
					var record = controller.options.data[itemRow.rowIndex];
					itemRow.rowElement = _renderRowEl(controller, itemRow, record);
				}

				///////////////////////////////////////////////
				// onafterrepaintrow event
				///////////////////////////////////////////////
				if (itemRow.rowElement) {
					if (controller.options.listeners.onafterrepaintrow) {
						controller.options.listeners.onafterrepaintrow(itemRow.rowIndex, itemRow.rowElement);
					}
				}
				///////////////////////////////////////////////
				///////////////////////////////////////////////


				if (execAfterRepaintEvent) {
					///////////////////////////////////////////////
					// onafterrepaint event
					///////////////////////////////////////////////
					if (controller.options.listeners.onafterrepaint) {
						controller.options.listeners.onafterrepaint(controller);
					}
					///////////////////////////////////////////////
					///////////////////////////////////////////////
				}
			}
		};

		/*
   *
   *
   *
   */
		var _repaint = function _repaint(controller, forceRepaint) {

			/*
   //
   if (forceRepaint) {
   	controller.managerRendererItems.setAllElementsToNotRendered();
   }
   */

			//
			var visibleRows = controller.managerRendererItems.getVisibleRows();

			//
			for (var index = 0; index < visibleRows.length; index++) {
				var visibleRow = visibleRows[index];
				_repaintRow(controller, visibleRow.rowIndex, forceRepaint, null, visibleRow);
			}

			///////////////////////////////////////////////
			// onafterrepaint event
			///////////////////////////////////////////////
			if (controller.options.listeners.onafterrepaint) {
				controller.options.listeners.onafterrepaint(controller);
			}
			///////////////////////////////////////////////
			///////////////////////////////////////////////

			// remove all not visible rows elements
			// preventing a overloading in the RAM memory
			controller.managerRendererItems.removeAllNotVisibleElementsRows(controller, visibleRows);
		};

		/**
   * @param sorters {Array|Object|String} direction is optional
   * Example:
   * 		me.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
   * 		me.sort({name: 'city', direction: 'ASC'}); or
   *		me.sort('city');
   *
   */
		me.sort = function (controller, sorters, holdSelection) {
			//var shouldHoldSelection = holdSelection == false ? false : true;
			var recordToHold;
			if (holdSelection !== false) {
				recordToHold = me.getSelectedRow(controller);
			}

			controller.headerContainer.find('div.ui-header-cell').removeClass('sort').removeClass('asc').removeClass('desc'); //remove all sorters icons

			var sortersArray;

			//GROUPING
			if (controller.options.api.isGrouped()) {
				sortersArray = _sort(controller, sorters);

				//
				controller.bodyContainer.find('.ui-row.collapse').filter(function () {
					var rowElementGroupExpanded = $(this);
					var groupIndex = parseInt(rowElementGroupExpanded.attr('groupIndex'));
					var rowIndex = parseInt(rowElementGroupExpanded.attr('rowindex'));
					var record = controller.options.data[rowIndex];

					uiDeniGridUtilSrv.groupCollapse(controller, rowElementGroupExpanded, record, rowIndex);
					uiDeniGridUtilSrv.groupExpand(controller, rowElementGroupExpanded, record, rowIndex);
				});

				//ROW DETAIL
			} else if (controller.options.rowDetails) {
				var recordsToExpand = [];
				//get the expanded lines
				var rowElementsExpanded = controller.bodyContainer.find('.ui-row.row-detail-expanded').filter(function () {
					var rowIndex = parseInt($(this).attr('rowindex'));
					var record = controller.options.data[rowIndex];
					recordsToExpand.push(record);
				});

				//
				sortersArray = _sort(controller, sorters);

				//
				controller.options.api.loadData(controller.options.data);

				for (var index = 0; index < recordsToExpand.length; index++) {
					var record = recordsToExpand[index];
					var rowIndex = controller.options.api.resolveRowIndex(record);
					var rowElement = controller.options.api.resolveRowElement(rowIndex);

					uiDeniGridUtilSrv.rowDetailsExpand(controller, rowElement, record, rowIndex);
				}
				_repaint(controller);

				//COMMON ROW
			} else {
				sortersArray = _sort(controller, sorters);

				//
				controller.options.api.loadData(controller.options.data);
			}

			for (var _index3 = 0; _index3 < sortersArray.length; _index3++) {
				var sort = sortersArray[_index3];

				if (!angular.isFunction(sort)) {
					var $headerColElement = $(_getHeaderColElementByName(controller, sort.name, true));
					$headerColElement.addClass('sort');
					$headerColElement.addClass(sort.direction ? sort.direction.toLowerCase() : 'asc');
				}
			}

			//Call ui-deni-view method sort
			//controller.options.api.sort(sortersArray);

			if (recordToHold) {
				me.selectRow(controller, recordToHold);
			}

			return sortersArray;
		};

		/**
   * @param raiseError {boolean} Raise a error when it is not found
   *
   */
		var _getHeaderColElementByName = function _getHeaderColElementByName(controller, columnName, raiseError) {
			var columns = controller.headerContainer.find('div.ui-header-cell[name="' + columnName + '"]');
			if (columns.length === 0) {
				if (raiseError) {
					throw new Error('There is not a columns with a name "' + columnName + '"!');
				} else {
					return null;
				}
			} else {
				return columns[0];
			}
		};

		//
		//
		var _rendererRealcedCells = function _rendererRealcedCells(completeValue, valueToRealce, realceStyle) {
			if (completeValue && valueToRealce) {
				completeValue = completeValue.toString();
				var pos = completeValue.search(new RegExp(valueToRealce, 'i'));
				if (pos !== -1) {
					var newValue = '';
					var initPos = 0;
					while (pos !== -1) {
						newValue += completeValue.substring(initPos, pos);
						newValue += '<span style="' + realceStyle + '">' + completeValue.substring(pos, pos + valueToRealce.length) + '</span>';
						initPos = pos + valueToRealce.length;

						pos = completeValue.toLowerCase().indexOf(valueToRealce.toLowerCase(), initPos);
					}
					newValue += completeValue.substring(initPos, completeValue.length);
					return newValue;
				}
			}
			return completeValue;
		};

		//
		//
		//
		var _createDivCell = function _createDivCell(controller, rowElement) {

			//
			var divCell = $(document.createElement('div'));
			divCell.addClass('ui-cell');

			if (controller.options.colLines) {
				divCell.css('border-right', 'solid 1px #e6e6e6');
			}

			if (controller.options.rowLines) {
				divCell.css('border-bottom', 'solid 1px #e6e6e6');
			}

			if (!rowElement.is('.row-detail')) {
				///////////////////////////////////''
				//Set the events here
				///////////////////////////////////
				//mouseenter
				divCell.mouseenter(function (event) {
					if (!controller.enabled) {
						return;
					}

					//selType = 'row'
					if (controller.options.selType === 'row') {
						//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
						//
						controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover');
						//
						controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('hover');

						//selType = 'cell'
					} else {
						$(event.currentTarget).addClass('hover');
					}
				});

				//mouseleave
				divCell.mouseleave(function (event) {
					if (!controller.enabled) {
						return;
					}

					//$(event.currentTarget).parent().find('.ui-cell').removeClass('hover');
					//
					controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');
					//
					controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');
				});

				//mousedown
				divCell.mousedown(function (event) {
					if (!controller.enabled) {
						return;
					}

					if (event.which === 1) {
						//event.which: left: 1, middle: 2, right: 3 (pressed)

						//selType = 'row'
						if (controller.options.selType === 'row') {
							var _divCell = $(event.currentTarget);
							var _rowElement = _divCell.closest('.ui-row');
							var rowIndex = parseInt(_rowElement.attr('rowindex'));

							me.selectRow(controller, _rowElement);

							//selType = 'cell'
						} else {
							//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
							var _divCell2 = $(event.currentTarget);
							var colIndex = parseInt(_divCell2.attr('colIndex'));
							var _rowElement2 = _divCell2.closest('.ui-row');
							var _rowIndex = parseInt(_rowElement2.attr('rowindex'));

							//var rowElement = $(event.currentTarget).closest('.ui-row');
							//var divCell = rowElement.closest('.ui-cell');

							me.selectCell(controller, _rowElement2, colIndex);
						}
					}
				});

				//doubleclick
				divCell.dblclick(function (event) {
					var targetEl = $(event.target);
					if (targetEl.is('.ui-cell-inner')) {
						var _divCell3 = $(event.currentTarget);
						var colIndex = parseInt(_divCell3.attr('colIndex'));
						var columns = uiDeniGridUtilSrv.getColumns(controller, controller.options.columns);
						var column = columns[colIndex];

						if (column.editor) {
							var _rowElement3 = _divCell3.closest('.ui-row');
							var rowIndex = parseInt(_rowElement3.attr('rowindex'));
							var record = controller.options.data[rowIndex];
							uiDeniGridUtilSrv.setInputEditorDivCell(controller, record, column, _divCell3);
						}
					}
				});

				///////////////////////////////////
				///////////////////////////////////
			}

			rowElement.append(divCell);

			return divCell;
		};

		//
		//
		//
		var _createDivCellInner = function _createDivCellInner(divCellParent) {
			var spanCellInner = $(document.createElement('span'));
			spanCellInner.addClass('ui-cell-inner');

			divCellParent.append(spanCellInner);

			return spanCellInner;
		};

		/**
   *
   *
  */
		me.createUiDeniViewEvents = function (controller) {

			//
			//
			controller.options.listeners.onrenderer = function (rowElement, fixedRowElement, record, itemToRender, viewController) {

				/*
    // Card View
    if (angular.isDefined(controller.options.cardView)) {
    	//
    	var divCell = _createDivCell(controller, rowElement);
    	rowElement.css('width', '100%');
    	divCell.css('width', '100%');
    	valueToRender = uiDeniGridUtilSrv.applyTemplateValues(getTemplateCardView, record);
    	divCell.html(valueToRender);
    */

				// Row Template
				if (angular.isDefined(controller.options.rowTemplate)) {
					//
					var divCell = _createDivCell(controller, rowElement);
					rowElement.css('width', '100%');
					divCell.css('width', '100%');
					var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowTemplate, record);
					divCell.html(valueToRender);

					//Row Detail - Grouping or other type of row details
				} else if (rowElement.is('.row-detail')) {
					(function () {
						//uiDeniGridUtilSrv.renderCommonRow(controller, rowElement, record, itemToRender.rowIndex);

						//
						var divCell = _createDivCell(controller, rowElement);
						divCell.addClass('row-detail');

						//
						var spanCellInner = _createDivCellInner(divCell);
						spanCellInner.addClass('row-detail');
						if (itemToRender.expanded) {
							spanCellInner.addClass('collapse');
						} else {
							spanCellInner.addClass('expand');
						}
						spanCellInner.css('cursor', 'pointer');

						spanCellInner.click(function (event) {
							//if (event.offsetX <= 12) { //:before pseudo element width
							spanCellInner.toggleClass('expand collapse');
							rowElement.toggleClass('expand collapse');

							if (spanCellInner.is('.collapse')) {
								uiDeniGridUtilSrv.groupExpand(controller, rowElement, record, itemToRender.rowIndex);
							} else {
								uiDeniGridUtilSrv.groupCollapse(controller, rowElement, record, itemToRender.rowIndex);
							}
							//}
						});

						var valueToRender = void 0;
						if (controller.options.grouping.template) {
							var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
							valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.grouping.template, record, { count: totalRowsInGroup });
						}

						spanCellInner.html(valueToRender);

						// Grouping Footer
					})();
				} else if (rowElement.is('.ui-grouping-footer-container')) {
					var columns = controller.options.columns;
					var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
					var records = controller.options.data.slice(itemToRender.rowIndex, itemToRender.rowIndex + totalRowsInGroup);

					//
					uiDeniGridUtilSrv.createColumnFooters(controller, rowElement, columns, false);
					//
					uiDeniGridUtilSrv.renderColumnFooters(controller, rowElement, columns, records, false);

					// (Common Row)
				} else {
					//rowElement.css('width', '100%');

					var isRowSelected = rowElement.is('.selected');
					var _columns = uiDeniGridUtilSrv.getColumns(controller, controller.options.columns);
					var colIndex = 0;

					var _loop = function _loop(index) {

						//
						if (index === 0) {
							//if Fixed Columns
							if (controller.options.fixedCols) {

								//if has checkbox
								if (controller.options.fixedCols.checkbox) {
									var divCellIndicator = _createDivCell(controller, fixedRowElement);
									divCellIndicator.css('width', uiDeniGridConstants.FIXED_COL_CHECKBOX_WIDTH);
									divCellIndicator.addClass('auxiliar-fixed-column');
									var spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
									spanCellIndicatorInner.addClass('checkbox');
									var inputCheck = $(document.createElement('input'));
									inputCheck.attr('type', 'checkbox');
									inputCheck.css({
										cursor: 'pointer'
									});
									spanCellIndicatorInner.append(inputCheck);
									colIndex++;
								}

								//if has indicator
								if (controller.options.fixedCols.indicator) {
									var _divCellIndicator = _createDivCell(controller, fixedRowElement);
									_divCellIndicator.css('width', uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH);
									_divCellIndicator.addClass('auxiliar-fixed-column');
									var _spanCellIndicatorInner = _createDivCellInner(_divCellIndicator);
									_spanCellIndicatorInner.addClass('indicator');
									colIndex++;
								}

								//if has row number
								if (controller.options.fixedCols.rowNumber) {
									var divCellRowNumber = _createDivCell(controller, fixedRowElement);
									divCellRowNumber.css('width', uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH);
									divCellRowNumber.addClass('auxiliar-fixed-column');
									var spanCellRowNumberInner = _createDivCellInner(divCellRowNumber);
									spanCellRowNumberInner.addClass('rownumber');
									spanCellRowNumberInner.html(itemToRender.rowIndex + 1);
									colIndex++;
								}
							}
						}

						//
						var column = _columns[index];

						//
						var divCell = void 0;

						//if fixed column?
						if (uiDeniGridUtilSrv.isFixedColumn(controller, column.name)) {
							divCell = _createDivCell(controller, fixedRowElement);
						} else {
							divCell = _createDivCell(controller, rowElement);
						}
						divCell.attr('colIndex', colIndex);

						//
						var spanCellInner = _createDivCellInner(divCell);

						//action column
						if (column.action) {
							(function () {
								spanCellInner.css('text-align', 'center');
								spanCellInner.addClass('ui-cell-inner-action');

								var iconActionColumn = column.action.mdIcon || column.action.icon;
								if (angular.isFunction(iconActionColumn)) {
									iconActionColumn = iconActionColumn(record);
								}
								var imgActionColumn = void 0;
								if (column.action.mdIcon) {
									//Usa o md-icon do Angular Material
									var imgActionColumnBtn = $(document.createElement('md-button'));

									if (column.action.tooltip) {
										var imgActionColumnBtnTooltip = $(document.createElement('md-tooltip'));
										var textTooltip = void 0;

										if (angular.isFunction(column.action.tooltip)) {
											textTooltip = column.action.tooltip(record);
										} else {
											textTooltip = column.action.tooltip;
										}
										imgActionColumnBtnTooltip.html(textTooltip);
										imgActionColumnBtn.append(imgActionColumnBtnTooltip);
									}

									imgActionColumn = $(document.createElement('md-icon'));
									imgActionColumn.addClass('material-icons');
									imgActionColumn.html(iconActionColumn);
									imgActionColumnBtn.append(imgActionColumn);

									var imgActionColumnBtnCompiled = $compile(imgActionColumnBtn)(controller.scope);
									spanCellInner.append(imgActionColumnBtn);
									imgActionColumnBtn.find('md-icon').prop('column', column);

									imgActionColumnBtn.click(function (event) {
										var imgAction = $(event.currentTarget).find('md-icon');
										var colAction = imgAction.prop('column');
										colAction.action.fn(record, column, imgAction);
									});
								} else {
									imgActionColumn = $(document.createElement('img'));
									imgActionColumn.attr('src', iconActionColumn);
									imgActionColumn.attr('title', column.action.tooltip);
									spanCellInner.append(imgActionColumn);
									imgActionColumn.prop('column', column);

									imgActionColumn.click(function (event) {
										var imgAction = $(event.currentTarget);
										var colAction = imgAction.prop('column');
										colAction.action.fn(record, column, imgActionColumn);
									});

									imgActionColumn.css('cursor', 'pointer');
								}
							})();
						} else {

							//
							if (index === 0) {
								//
								//rowDetails Property
								if (controller.options.rowDetails) {
									spanCellInner.addClass('row-detail');

									if (itemToRender.expanded || controller.options.rowDetails.autoExpand === true) {
										spanCellInner.addClass('collapse');
									} else {
										spanCellInner.addClass('expand');
									}

									spanCellInner.click(function (event) {
										if (event.offsetX <= 12) {
											//:before pseudo element width
											var target = $(event.target);

											if (target.is('.collapse')) {
												uiDeniGridUtilSrv.rowDetailsCollapse(controller, rowElement, record, itemToRender.rowIndex);
											} else {
												uiDeniGridUtilSrv.rowDetailsExpand(controller, rowElement, record, itemToRender.rowIndex);
											}
										}
									});
								}
							}

							//
							style = column.style || {};

							divCell.css(angular.extend(style, {
								'text-align': column.align || 'left'
							}));

							//Margin First column inside of grouping
							if (index === 0 && controller.options.api.isGrouped()) {
								divCell.css('padding-left', '20px');
							}

							value = null;

							try {
								value = eval('record.' + column.name); //value = record[column.name];
							} catch (err) {}

							//Is there a specific render for this field?
							if (column.renderer) {
								value = column.renderer(value, record, _columns, itemToRender.rowIndex);
							}

							formattedValue = value;

							if (angular.isDefined(column.format)) {
								formattedValue = uiDeniGridUtilSrv.getFormatedValue(value, column.format);
							}

							//Is there something to realce (Used in Searches and Filters)
							if (controller.searchInfo) {
								if (isRowSelected) {
									formattedValue = _rendererRealcedCells(column.name, formattedValue, controller.searchInfo.valuesToField, controller.searchInfo.opts.inLine.realce.style);
								}
							} else if (controller.filterInfo) {

								if (controller.filterInfo.options.realce) {
									formattedValue = _rendererRealcedCells(formattedValue, controller.filterInfo.valuesToFilter, controller.filterInfo.options.realce);
								}
							}

							//
							spanCellInner.html(formattedValue);
						}

						//realPercentageWidth cause effect only when there are more then one level of columns
						divCell.css('width', column.realPercentageWidth || column.width);

						//
						colIndex++;
					};

					for (var index = 0; index < _columns.length; index++) {
						var style;
						var value;
						var formattedValue;

						_loop(index);
					}
				}
			};

			//
			//
			controller.options.listeners.onafterexpand = function (records, options, elementGroupRow, lastInsertedDivRow) {
				if (records.length > 0) {
					var rowIndex = controller.options.api.resolveRowIndex(records[0]);
					me.selectRow(controller, rowIndex);
				}

				//Are there footer?
				if (uiDeniGridUtilSrv.hasColumnFooter(controller)) {

					var footerDivContainer = elementGroupRow.prop('footer');
					if (angular.isDefined(footerDivContainer)) {
						footerDivContainer.css('display', 'block');
					} else {
						//Create a div container to insert the footer of the grouping
						footerDivContainer = $(document.createElement('div'));
						footerDivContainer.addClass('ui-deni-grid-grouping-footer-container');

						//Used to collapse
						elementGroupRow.prop('footer', footerDivContainer);

						footerDivContainer.insertAfter(lastInsertedDivRow);

						uiDeniGridUtilSrv.renderColumnFooters(footerDivContainer, controller.footerContainer, controller.options.columns, records, controller);
					}
				}
			};

			controller.options.listeners.onafterrepaint = function (viewController) {
				/*
    controller.clientWidth;
    		var columns = uiDeniGridUtilSrv.getColumns(controller, controller.options.columns);
    //Any column was specified in percentage? TODO: create a function to get this
    var anyColumnInPercentage = false;
    for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
    	if (controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
    		anyColumnInPercentage = true;
    		break;
    	}
    }
    */

				uiDeniGridUtilSrv.adjustAllColumnWidtsAccordingColumnHeader(controller);
			};

			//
			controller.bodyViewport.scroll(function (event) {
				var currentLeft = $(this).scrollLeft();

				//Vertical Scroll
				if (controller.bodyViewport.currentScrollLeft === currentLeft) {
					controller.bodyViewport.currentScrollTop = $(this).scrollTop();

					var firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
					if (firstViewRow.length > 0) {
						//if there is at least one record
						var boundingClientTop = firstViewRow.get(0).getBoundingClientRect().top;

						//
						var top = controller.bodyViewport.currentScrollTop * -1 + 'px';

						//
						if (controller.options.fixedCols) {
							controller.fixedColsBodyContainer.css('top', top);
						}
						//
						//controller.footerDivContainer.find('.ui-deni-grid-footer').css('top', top);
						//controller.footerDivContainer.css('left', left);
					}
				}
				//Horizontal Scroll
				else {
						controller.bodyViewport.currentScrollLeft = currentLeft;

						var _firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
						if (_firstViewRow.length > 0) {
							//if there is at least one record
							var boundingClientLeft = _firstViewRow.get(0).getBoundingClientRect().left;

							//
							var left = controller.bodyViewport.currentScrollLeft * -1 + 'px';

							//
							controller.headerContainer.css('left', left);

							//Are there footer?
							if (uiDeniGridUtilSrv.hasColumnFooter(controller)) {
								//
								controller.footerDivContainer.find('.ui-deni-grid-footer').css('left', left);
								//controller.footerDivContainer.css('left', left);
							}
						}
					}

				_repaint(controller);
			});
		};

		/**
   *
   */
		me.getSelectedRow = function (controller) {
			if (controller.rowIndex === undefined) {
				return null;
			} else {
				return controller.options.data[controller.rowIndex];
			}
		};

		/**
   *
   */
		me.getChangedRecords = function (controller) {
			var changedRows = controller.bodyViewport.find('div.ui-row.changed');
			var data = controller.options.data;
			var changedRecords = [];
			for (var index = 0; index < changedRows.length; index++) {
				var rowIndex = $(changedRows[index]).attr('rowindex');
				var changedRecord = data[rowIndex];
				changedRecords.push(changedRecord);
			}
			return changedRecords;
		};

		//
		//
		//
		//
		//
		//
		var _resolveJavaScriptElement = function _resolveJavaScriptElement(element) {
			// If element is already a jQuery object
			if (angular.isElement(element)) {
				return element.get(0);
			} else {
				return element;
			}
		};

		//
		//
		//
		//
		//
		//
		var _resolveJQueryElement = function _resolveJQueryElement(element) {
			// If element is already a jQuery object
			if (angular.isElement(element)) {
				return element;
			} else {
				return $(element);
			}
		};

		// This function help some other functions which get row parameter where sometimes
		// it comes like a record object and sometimes comes its recordIndex
		//
		// record {Object|Number} Can be passed rowIndex or the object record
		// returns the row
		var _resolveRecord = function _resolveRecord(controller, record) {
			if (angular.isObject(record)) {
				//passed the object record
				return record;
			} else {
				//passed rowIndex
				return controller.options.data[record];
			}
		};

		/**
   *	row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
   *
   */
		me.isRowSelected = function (controller, row) {
			var rowElement = controller.options.api.resolveRowElement(row);
			return rowElement.is('.selected');
		};

		/**
   *
   * return a integer value (see also getSelectedRowIndexes)
   */
		me.getSelectedRowIndex = function (controller) {
			return controller.rowIndex;
		};

		/**
   *
   * return a array (see also getSelectedRowIndex)
   *
   */
		me.getSelectedRowIndexes = function (controller) {
			var rowIndexes = [];

			//
			var selectedRows = controller.bodyViewport.find('.ui-row.selected');

			//
			for (var index = 0; index < selectedRows.length; index++) {
				rowIndexes.push(parseInt($(selectedRows[index]).attr('rowindex')));
			}

			return rowIndexes;
		};

		/**
   *	row {Object|Number} Can be passed rowIndex or the object record
   *  preventOnSelectionChange {Boolean} default false
   *  scrollIntoView {Boolean} default true
  */
		me.selectRow = function (controller, row, preventOnSelectionChange, scrollIntoView) {
			if (controller.options.data && controller.options.data.length > 0) {

				//
				var rowElement;

				//
				if (angular.isElement(row)) {
					//
					rowElement = row;
					//
					controller.rowIndex = parseInt(rowElement.attr('rowindex'));
				} else {
					//
					var rowIndex;

					//
					if (controller.options.api.isGrouped()) {
						//
						rowIndex = controller.options.api.resolveRowIndex(row);
						//
					} else {
						rowIndex = controller.options.api.resolveRowIndex(row);
					}

					//
					//var rowElement = controller.options.api.resolveRowElement(row);

					//
					scrollIntoView = scrollIntoView === false ? false : true;

					//
					if (rowIndex === -1) {
						throw new Error('selectRow: row passed in a wrong way!');
					}

					//
					var scrollIntoViewFn = function scrollIntoViewFn(rowElementToScroll) {
						if (scrollIntoView) {
							//if (!controller.options.api.isRowVisible(rowElementToScroll)) {
							//	rowElementToScroll.get(0).scrollIntoView(false);
							//}
						}
					};

					//if (rowIndex == controller.rowIndex) {
					if (me.isRowSelected(controller, rowIndex)) {
						//
						scrollIntoViewFn(rowIndex);
					} else {
						controller.rowIndex = rowIndex;

						if (controller.options.api.isGrouped()) {
							var itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
							if (!itemRow) {
								var groupIndex = controller.options.data[rowIndex].groupIndex;
								var groupInfo = controller.managerRendererItems.getInfoGroup(groupIndex);
								controller.colsViewport.scrollTop(groupInfo.top);
								_repaint(controller);
								var record = controller.options.data[rowIndex];
								uiDeniGridUtilSrv.groupExpand(controller, groupInfo.rowElement, record, rowIndex);
								itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
							}

							controller.colsViewport.scrollTop(itemRow.top);
							_repaint(controller);

							rowElement = itemRow.rowElement;
						} else {
							var rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));
							var scrollTop = rowIndex * rowHeight - controller.bodyViewportWrapper.height() / 2;
							controller.bodyViewport.scrollTop(scrollTop);
							_repaint(controller);
							var _itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
							rowElement = _itemRow.rowElement;
						}
					}
				}

				//
				if (controller.rowIndex !== undefined && !controller.options.multiSelect) {
					//remove all selections
					controller.options.api.clearSelections();
				}

				//
				rowElement.addClass('selected');

				//
				controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('selected');
				//
				controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)').find('.ui-cell').addClass('selected');

				//
				if (controller.options.fixedCols) {
					var fixedRow = controller.fixedColsBodyContainer.find('.ui-fixed-row[rowindex=' + rowElement.attr('rowindex') + ']:not(.row-detail)');
					fixedRow.addClass('selected');
					fixedRow.find('.ui-cell.indicator').addClass('selected');
				}
				if (controller.options.rowDetails) {
					rowElement.parent().find('.ui-row.row-detail-container[rowIndex=' + rowElement.attr('rowindex') + ']').addClass('selected');
				}

				//
				//scrollIntoViewFn(rowElement);

				////////////////////////////////////////////////////
				//onselectionchange event
				////////////////////////////////////////////////////
				if (!preventOnSelectionChange) {
					if (controller.options.listeners.onselectionchange) {
						controller.options.listeners.onselectionchange(controller, controller.element, controller.rowIndex, controller.options.data[controller.rowIndex]);
					}
				}
				////////////////////////////////////////////////////
				////////////////////////////////////////////////////
			} else {
				throw new Error('"selectRow": There is not record to select!');
			}
		};

		/**
   *	row {Object|Number} Can be passed rowIndex or the object record
   *  preventOnSelectionChange {Boolean} default false
   *  scrollIntoView {Boolean} default true
   *  colIndex {Integer} Column Index.
  */
		me.selectCell = function (controller, row, colIndex, preventOnSelectionChange, scrollIntoView) {
			if (controller.options.data && controller.options.data.length > 0) {

				//
				scrollIntoView = scrollIntoView === false ? false : true;

				//
				var rowElement = controller.options.api.resolveRowElement(row);
				//
				if (row.length === 0) {
					throw new Error('selectCell: row passed in a wrong way!');
				}

				var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
				//
				if (divCell.length === 0) {
					throw new Error('selectCell: colIndex passed in a wrong way!');
				}

				if (!controller.options.multiSelect) {
					//remove all selections
					controller.options.api.clearSelections();
				}

				divCell.addClass('selected');

				//
				var rowIndex = controller.options.api.resolveRowIndex(row);
				controller.rowIndex = rowIndex;
				controller.colIndex = colIndex;
			}
		};

		/**
   *
   *
  */
		me.getColumn = function (controller, fieldName) {
			for (var index = 0; index < controller.options.columns.length; index++) {
				if (controller.options.columns[index].name === fieldName) {
					return controller.options.columns[index];
				}
			}

			return null;
		};

		/**
   *
   *
  */
		me.updateSelectedRow = function (controller, json) {

			if (controller.rowIndex === undefined) {
				throw 'You have to select a record';
			} else {
				//
				var fieldsNotNested = uiDeniGridUtilSrv.prepareForNestedJson(json);
				//
				var keyFieldsToChange = Object.keys(fieldsNotNested);
				//
				var record = controller.options.data[controller.rowIndex];
				//
				var dataKeys = Object.keys(record);

				//
				for (var index = 0; index < keyFieldsToChange.length; index++) {
					var fieldNameToChange = keyFieldsToChange[index];

					if (dataKeys.indexOf(fieldNameToChange) === -1) {
						console.warn('"updateSelectedRow" : field "' + fieldNameToChange + '" not found!');
					} else {
						//
						var newValue = eval('json.' + fieldNameToChange);
						record[fieldNameToChange] = newValue;
					}
				}

				//
				_repaintRow(controller, controller.rowIndex, true, true);
			}
		};

		/**
   *
   *
  */
		me.updateCell = function (controller, rowIndex, colIndex, value) {
			var rowElement = controller.options.api.resolveRowElement(rowIndex);
			var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
			var spanCellInner = divCell.find('.ui-cell-inner');
			spanCellInner.html(value);

			//
			divCell.addClass('changed');
			//When we need the changed records we can get by ".ui-row.changed"
			divCell.closest('.ui-row').addClass('changed');
		};

		/**
   *
   *
  */
		me.updateSelectedCell = function (controller, value) {

			if (!angular.isDefined(controller.rowIndex) || !angular.isDefined(controller.colIndex)) {
				throw 'You have to select a record';
			} else {
				me.updateCell(controller, controller.rowIndex, controller.colIndex, value);
			}
		};

		/**
   *
   *
  */
		me.isHideHeaders = function (controller) {
			return controller.options.hideHeaders;
		};

		/**
   *
   *
  */
		me.setHideHeaders = function (controller, hideHeaders) {
			var display;
			if (hideHeaders) {
				display = 'none';
			} else {
				display = 'block';
			}
			controller.colsViewport.find('.ui-header-viewport').css('display', display);
			controller.options.hideHeaders = hideHeaders;
		};

		/**
   *
   *
   */
		me.getPageNumber = function (controller) {
			return controller.options.paging.currentPage;
		};

		/**
   *
   *
   */
		me.setPageNumber = function (controller, pageNumber) {
			controller.options.paging.currentPage = pageNumber;
			controller.paging.find('input.input-page-number').val(pageNumber);
			controller.options.api.reload();
			_checkDisableButtonsPageNavigation(controller, controller.options.data, pageNumber);
		};

		/**
   *
   *
   */
		var _checkDisableButtonsPageNavigation = function _checkDisableButtonsPageNavigation(controller, data, pageNumber) {
			var firstButton = controller.paging.find('.button.button-first');
			var prevButton = controller.paging.find('.button.button-prev');
			var nextButton = controller.paging.find('.button.button-next');
			var lastButton = controller.paging.find('.button.button-last');
			var additionalButtons = controller.paging.find('.button.button-additional');

			var backwards = data.length > 0 && pageNumber > 1;
			var forwards = data.length > 0 && pageNumber < controller.options.paging.pageCount;

			if (data.length > 0) {
				additionalButtons.removeClass('disabled');
			} else {
				additionalButtons.addClass('disabled');
			}

			if (backwards) {
				firstButton.removeClass('disabled');
				prevButton.removeClass('disabled');
			} else {
				firstButton.addClass('disabled');
				prevButton.addClass('disabled');
			}

			if (forwards) {
				nextButton.removeClass('disabled');
				lastButton.removeClass('disabled');
			} else {
				nextButton.addClass('disabled');
				lastButton.addClass('disabled');
			}
		};

		var _getPropertyXML = function _getPropertyXML(properties, item, parentProperty) {
			var property = item.nodeName.toLowerCase();
			if (parentProperty) {
				property = parentProperty + '.' + property;
			}
			if (properties.indexOf(property) === -1) {
				properties.push(property);

				for (var index = 0; index < item.children.length; index++) {
					_getPropertyXML(properties, item.children[index], property);
				}
			}
		};

		/**
   *
   *
   */
		var isArrayItem = function isArrayItem(itemToBeAnalyzed) {
			if (angular.isDefined(itemToBeAnalyzed.children) && itemToBeAnalyzed.children.length > 0) {
				var propName = '';
				for (var i = 0; i < itemToBeAnalyzed.children.length; i++) {
					if (propName === '') {
						propName = itemToBeAnalyzed.children[i].nodeName.toLowerCase();
					} else {
						if (itemToBeAnalyzed.children[i].nodeName.toLowerCase() !== propName) {
							return false;
						}
					}
				}

				return true;
			} else {
				return false;
			}
		};

		/**
   *
   *
   */
		var _getRecordXML = function _getRecordXML(records, item, parentNode) {
			var record = parentNode ? parentNode : {};

			for (var index = 0; index < item.children.length; index++) {
				var property = item.children[index];
				var propertyName = property.nodeName.toLowerCase();

				if (property.children.length === 0) {
					record[propertyName] = property.textContent;
				} else {
					if (isArrayItem(property)) {
						var valueArray = [];
						for (var childIndex = 0; childIndex < property.children.length; childIndex++) {
							_getRecordXML(valueArray, property.children[childIndex]);
						}
						record[propertyName] = valueArray;
					} else {
						record[propertyName] = {};
						_getRecordXML(records, property, record[propertyName]);
					}
				}
			}
			if (!angular.isDefined(parentNode)) {
				records.push(record);
			}
		};

		/**
   *
   *
   */
		var _xmlToJson = function _xmlToJson(controller, xml) {
			var xmlData = $(xml);
			var items = xmlData.find(controller.options.restConfig.data).find(controller.options.restConfig.dataItems);
			var records = [];
			for (var index = 0; index < items.length; index++) {
				_getRecordXML(records, items[index]);
			}

			var jsonReturn = {
				success: true
			};
			jsonReturn[controller.options.restConfig.data] = records;
			jsonReturn[controller.options.restConfig.total] = parseInt(xmlData.find(controller.options.restConfig.total).text());

			return jsonReturn;
		};

		/**
   *
   *
   */
		var _getDefaultRequestPromise = function _getDefaultRequestPromise(url) {
			var deferred = $q.defer();

			$http.get(url).then(function (response) {
				deferred.resolve(response);
			}, function (response) {
				deferred.reject(response);
			});

			return deferred.promise;
		};

		/**
   *
   *
   */
		me.load = function (controller) {
			var deferred = $q.defer();
			if (controller.options.url) {
				if (!controller.options.data) {
					controller.bodyViewport.addClass('initilizing-data');
				}
				controller.loading = true;

				var url = controller.options.url;

				if (controller.options.paging) {
					var page = controller.options.paging.currentPage;
					controller.paging.find('input.input-page-number').val(page);
					var limit = controller.options.paging.pageSize;
					var start = (page - 1) * limit;

					if (url.indexOf('?') === -1) {
						url += '?';
					} else {
						url += '&';
					}

					url += 'page=' + page + '&' + controller.options.restConfig.start + '=' + start + '&' + controller.options.restConfig.limit + '=' + limit;
				}

				//var loading = controller.wrapper.find('.ui-deni-grid-loading');
				//loading.css('display', 'block');
				var requestPromise = controller.options.requestPromise;
				if (!controller.options.requestPromise) {
					requestPromise = _getDefaultRequestPromise;
				}

				requestPromise(url).then(function (response) {
					var responseData;

					if (controller.options.restConfig.type === 'xml') {
						responseData = _xmlToJson(controller, response.data);
					} else {
						responseData = response.data;
					}
					if (angular.isArray(responseData)) {
						responseData = {
							success: true,
							data: responseData,
							total: responseData.length
						};
					}

					//
					if (controller.options.paging) {
						//
						controller.options.paging.dataLength = responseData[controller.options.restConfig.total];

						controller.options.paging.pageCount = Math.ceil(controller.options.paging.dataLength / controller.options.paging.pageSize);

						//
						controller.options.api.loadData(responseData[controller.options.restConfig.data]);
						deferred.resolve(responseData[controller.options.restConfig.data]);

						//
						controller.paging.find('.label-page-count').html('of ' + controller.options.paging.pageCount);

						//
						var limit = controller.options.paging.pageSize;
						var start = (controller.options.paging.currentPage - 1) * limit;
						var end = start + controller.options.paging.pageSize;

						if (end > controller.options.paging.dataLength) {
							end = controller.options.paging.dataLength;
						}
						controller.paging.find('.label-displaying').html(start + ' - ' + end);

						controller.paging.find('.label-record-count').html(controller.options.paging.dataLength + ' records');
					} else {
						//
						controller.options.api.loadData(responseData[controller.options.restConfig.data]);
						deferred.resolve(responseData[controller.options.restConfig.data]);
					}

					controller.bodyViewport.removeClass('initilizing-data');
					controller.loading = false;
				}, function (response) {
					controller.loading = false;
					deferred.reject(response.statusText);
				});
			} else {
				controller.loading = false;
				deferred.reject('"load" : To use load function is necessary set the url property.');
			}

			return deferred.promise;
		};

		/**
   *
   *
   */
		me.reload = function (controller) {
			return me.load(controller);
		};

		/**
   *
   *
   */
		me.loadData = function (controller, data) {
			///////////////////////////////////////////////////////////////////////////
			//BeforeLoad Event
			///////////////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onbeforeload) {
				controller.options.listeners.onbeforeload(data, controller.options);
			}
			//////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////

			//Are there footer?
			if (uiDeniGridUtilSrv.hasColumnFooter(controller)) {
				//
				uiDeniGridUtilSrv.renderColumnFooters(controller, controller.footerContainer, controller.options.columns, data, true);
				//
				uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(controller);
			}

			//
			controller.renderedIndexes = [];

			//Load the data
			if (controller.filterInfo) {
				var valuesToFilterObj;
				//If the value to be used by the filtering is a string, then must be compared with all fields in the column grids
				if (angular.isString(controller.filterInfo.valuesToFilter)) {
					var columnNames = []; //I could simply pass a string, but it would search at all fields (whether or not in the columns grid)
					for (var index = 0; index < controller.options.columns.length; index++) {
						columnNames.push(controller.options.columns[index].name);
					}
					controller.options.data = $filter('filter')(data, function (record, index, array) {
						for (var colIndex = 0; colIndex < columnNames.length; colIndex++) {
							var value = record[columnNames[colIndex]];
							if (value) {
								//Insensitive Comparation
								if (value.toString().search(new RegExp(controller.filterInfo.valuesToFilter, 'i')) !== -1) {
									return true;
								}
							}
						}
						return false;
					});
				} else {
					controller.options.data = $filter('filter')(data, controller.filterInfo.valuesToFilter);
				}
			} else {
				controller.options.data = data;
			}
			controller.options.alldata = data;

			//Records inside Grouping
			controller.groupRecords = [];
			//Data Grouping itself
			controller.options.dataGroup = [];

			//Remmove all rows before load
			controller.bodyContainer.find('.ui-row').remove();
			controller.fixedColsBodyContainer.find('.ui-row').remove();

			//
			var rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));

			//
			controller.rowsPerPage = parseInt(controller.bodyViewport.height() / rowHeight) + 1;
			var limitLength = data.length < controller.rowsPerPage ? data.length : controller.rowsPerPage;

			//
			//
			// GROUPING
			if (controller.options.api.isGrouped()) {
				var expressionToGroup = controller.options.grouping.expr;

				var getEvalFieldValue = function getEvalFieldValue(record, fieldName) {
					return eval('record.' + fieldName);
				};

				var getEvalExpressionValue = function getEvalExpressionValue(record, expression) {
					var evalStr = '(function() {\n' + '		with (record) {\n' + '				return ' + expression + '\n' + '		}\n' + '})()';

					return eval(evalStr);
				};

				var fieldsNotNested = uiDeniGridUtilSrv.prepareForNestedJson(controller.options.data[0]);
				var fields = Object.keys(fieldsNotNested);

				var functionToEvaluate;
				//When the expression is simply a field, use the simple evaluate (works most quickly)
				if (fields.indexOf(controller.options.grouping.expr)) {
					functionToEvaluate = getEvalFieldValue;
				} else {
					functionToEvaluate = getEvalExpressionValue;
				}

				//
				//
				/*
    var sortGroupingFn = function(rec1, rec2) {
    	var val1 = functionToEvaluate(rec1, expressionToGroup);
    	var val2 = functionToEvaluate(rec2, expressionToGroup);
    			if (val1 == val2) {
    		return 0;
    	} else {
    		return val1 > val2 ? -1 : 1
    	}
    };
    */

				//controller.options.api.sort(sortGroupingFn);
				controller.options.data = $filter('orderBy')(controller.options.data, expressionToGroup);

				//Add a fixed sorter to a group
				controller.options.fixedSorters = [{
					name: expressionToGroup,
					direction: 'ASC'
				}];

				//
				var oldValue;
				var recordGroup;
				var groupIndex = -1;
				for (var _index4 = 0; _index4 < controller.options.data.length; _index4++) {
					var record = controller.options.data[_index4];
					var value = functionToEvaluate(record, expressionToGroup);

					//
					if (oldValue === value) {
						//
						recordGroup.children++;

						//changed value
					} else {
						oldValue = value;
						groupIndex++;
						recordGroup = record;
						recordGroup.children = 1;

						controller.options.dataGroup.push(record);
					}

					record.groupIndex = groupIndex;
					record.rowIndex = _index4;
				}

				//
				controller.bodyContainer.height(controller.options.dataGroup.length * rowHeight + 2);
				if (controller.options.fixedCols) {
					controller.fixedColsBodyContainer.height(controller.bodyContainer.height());
				}
			} else {
				var heightBodyContainer;
				if (controller.options.cardView) {
					heightBodyContainer = Math.ceil(controller.options.data.length / controller.options.cardView.numberOfColumns) * rowHeight;
				} else {
					heightBodyContainer = controller.options.data.length * rowHeight;
				}

				//
				controller.bodyContainer.height(heightBodyContainer + 2);

				if (controller.options.fixedCols) {
					controller.fixedColsBodyContainer.height(controller.bodyContainer.height());
				}
			}

			//
			controller.managerRendererItems.createItems();

			/*
   if (data.length > 0) {
   	controller.bodyViewport.css({
   		'overflow-x': 'auto',
   		'overflow-y': 'scroll'				
   	});
   } else {
   	controller.bodyViewport.css({
   		'overflow-x': 'hidden',
   		'overflow-y': 'hidden'				
   	});
   }		
   */

			//
			_repaint(controller);

			uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(controller);

			if (controller.options.data.length > 0) {
				controller.options.api.selectRow(0, false, false);
			}

			///////////////////////////////////////////////////////////////////////////
			//AfterLoad Event
			///////////////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onafterload) {
				controller.options.listeners.onafterload(controller.options.data, controller.options);
			}
			///////////////////////////////////////////////////////////////////////////
			///////////////////////////////////////////////////////////////////////////

			if (controller.options.paging) {
				_checkDisableButtonsPageNavigation(controller, data, controller.options.paging.currentPage);
			}
		};

		me.findKey = function (controller, keyValue, opts) {
			var valuesToFind = JSON.parse('{"' + controller.options.keyField + '": "' + keyValue + '"}');
			return me.find(controller, valuesToFind, opts);
		};

		/**
   *
   *
   * @param valuesToFind {object} json which will contains the keys and values for the search
   * @param opts TODO: specify in more details
   *
   * return {array|record} depends on the value of "all" parameter.
   */
		me.find = function (controller, valuesToFind, opts) {
			var data = controller.options.data || [];
			valuesToFind = valuesToFind || {};
			var keys = Object.keys(valuesToFind);
			if (data.length === 0) {
				throw new Error('"Find" : There is no data to find!');
			} else if (keys.length === 0) {
				throw new Error('"Find" : param "valuesToFind" must be informed!');
			}

			////////////////////////////////////////////////////////////////////////////////
			//get the opt parameter and fill the detault values too
			////////////////////////////////////////////////////////////////////////////////
			opts = opts || {};
			var exactSearch = opts.exactSearch === false ? false : true; //Exact search? default = true (only used for string values)
			var all = opts.all === true ? true : false; //Return all records found? default = false (In this case the search stop when the first record is found)
			var ignoreCase = opts.ignoreCase === true ? true : false; //Ignore case when comparing strings (only used for string values)
			////////////////////////////////////////////////////////////////////////////////

			var recordsFound = [];
			var breakParentLoop = false;

			var newJson = uiDeniGridUtilSrv.prepareForNestedJson(valuesToFind);
			keys = Object.keys(newJson);
			////////////////////////////////////////////////////////////////////////////////
			////////////////////////////////////////////////////////////////////////////////
			var found = false;

			//loop over the data
			for (var index = 0; index < data.length; index++) {
				var record = data[index];

				var foundRecord = false;

				//loop over the fields
				for (var fieldIndex = 0; fieldIndex < keys.length; fieldIndex++) {
					var fieldName = keys[fieldIndex];

					var valueToFind = valuesToFind[fieldName];
					var value = eval('record.' + fieldName); //can be passed address.city
					var valueIsString = angular.isString(value);
					if (ignoreCase) {
						if (valueIsString) {
							valueToFind = valueToFind.toLowerCase();
							value = value.toLowerCase();
						}
					}

					if (exactSearch || !valueIsString) {
						foundRecord = valueToFind === value;
					} else {
						foundRecord = value.indexOf(valueToFind) !== -1;
					}

					if (!foundRecord) {
						continue;
					}
				}

				if (foundRecord) {
					//found record?
					found = true;

					recordsFound.push(record);
					if (!all) {
						break;
					}
				}
			}

			/////////////////////////////////////////////////////////////////////////
			// "inLine" property
			/////////////////////////////////////////////////////////////////////////
			if (found && opts.inLine) {
				/////////////////////////////////////////////////////////////////////////
				// prepare the default values
				/////////////////////////////////////////////////////////////////////////

				// "inLine"
				// default value when its value is iqual true
				var inLineDefaultValue = {
					realce: false
				};
				var inLine;
				if (opts.inLine === true) {
					//opts.inLine: true
					inLine = inLineDefaultValue;
				} else if (angular.isObject(opts.inLine)) {
					//opts.inLine: {...}
					inLine = opts.inLine;
				} else {
					throw new Error('"find": param "inLine" passed in a wrong way');
				}

				// "inLine.realce"
				// default value when its value is iqual true
				var inLineRealceDefaultValue = {
					style: 'background-color:#FFFF00;color:black;padding:1px;'
				};
				var inLineRealce;
				if (inLine.realce) {
					if (inLine.realce === true) {
						//opts.inLine.realce: true
						inLine.realce = inLineRealceDefaultValue;
					} else {
						//opts.inLine: {...}
						inLine.realce = opts.inLine.realce;
						inLine.realce.style = inLine.realce.style || inLineRealceDefaultValue.style;
					}
				}

				// "inLine.scrollIntoView"
				inLine.scrollIntoView = inLine.scrollIntoView === false ? false : true;

				/////////////////////////////////////////////////////////////////////////
				/////////////////////////////////////////////////////////////////////////

				controller.searchInfo = {
					'valuesToFind': valuesToFind,
					'opts': opts
				};

				var selectAndRemoveRendered = function selectAndRemoveRendered(record, preventSelectionChange, scrollIntoView) {
					controller.options.api.selectRow(record, preventSelectionChange, scrollIntoView);
					var rowElement = controller.options.api.resolveRowElement(record);
					rowElement.attr('rendered', false);
				};

				//remove all selections
				controller.options.api.clearSelections();
				if (Array.isArray(recordsFound)) {
					//multiSelect
					if (controller.options.multiSelect) {
						for (var _index5 = 0; _index5 < recordsFound.length; _index5++) {
							selectAndRemoveRendered(recordsFound[_index5], _index5 !== 0, _index5 === 0);
						}
						//singleSelect
					} else {
						if (recordsFound.length > 1) {
							console.warn('"find": More than one record was returned, but as the "inLine" property is true and "multiSelect" is false, just the first record will be selected.');
						}
						selectAndRemoveRendered(recordsFound[0], false, true);
					}
				} else {
					if (recordsFound !== null) {
						selectAndRemoveRendered(recordsFound, false, true);
					}
				}

				_repaint(controller);
			}
			/////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////


			if (all) {
				return recordsFound;
			} else {
				return recordsFound[0];
			}
		};

		me.filter = function (controller, valuesToFilter, opts) {
			controller.filterInfo = {};
			controller.filterInfo.valuesToFilter = valuesToFilter;

			//extends from default values
			controller.filterInfo.options = angular.extend({
				realce: uiDeniGridConstants.DEFAULT_REALCE_CELLS,
				remote: false
			}, opts || {});

			//remote filter
			if (controller.filterInfo.options.remote) {
				//TODO: implement it!
				console.info('TODO : remote filter is not implemented!!');

				//local filter			
			} else {
				controller.options.api.loadData(controller.options.alldata);
			}
		};

		/**
   *
   *
   */
		me.getRowHeight = function (controller) {
			return controller.options.rowHeight;
		};

		/**
   *
   *
   */
		me.setRowHeight = function (controller, rowHeight) {
			var rowElements = controller.bodyViewport.find('div.ui-row:not(.grouping-footer-container)');
			rowElements.css('height', controller.options.rowHeight);
		};

		/**
   *
   *
   */
		var _recreateAll = function _recreateAll(controller) {
			if (controller.options.data) {
				//Remmove all rows before load
				controller.bodyViewport.find('div.ui-deni-view-group-header').remove();
				controller.bodyViewport.find('div.ui-row').remove();

				me.loadData(controller, controller.options.data);
			}
		};

		/**
   *
   *
   */
		me.toogleGrouping = function (controller) {
			controller.options.enableGrouping = !controller.options.enableGrouping;
			_recreateAll(controller);
		};

		/**
   *
   *
   */
		me.isEnableGrouping = function (controller) {
			return controller.options.enableGrouping;
		};

		/**
   *
   *
   */
		me.isGrouped = function (controller) {
			return controller.isGrouped;
		};

		/**
   *
   *
   */
		me.setEnableGrouping = function (controller) {
			controller.options.enableGrouping = true;
			_recreateAll(controller);
		};

		/**
   *
   *
   */
		me.setDisableGrouping = function (controller) {
			controller.options.enableGrouping = false;
			_recreateAll(controller);
		};

		//
		//
		//
		//
		/*
  var _renderFixedRowEl = function(controller, itemToRender, record) {
  	var fixedRow = $(document.createElement('div'));
  	fixedRow.addClass('ui-fixed-row');
  	fixedRow.attr('rowindex', itemToRender.rowIndex.toString());
  	fixedRow.css('left', '0px');
  	fixedRow.css('top', itemToRender.top + 'px');
  	fixedRow.css('height', itemToRender.height + 'px');
  	//.html(itemToRender.rowIndex.toString());
  			controller.fixedColsBodyContainer.append(fixedRow);
  }
  */

		//
		//
		//
		//
		var _renderRowEl = function _renderRowEl(controller, itemToRender, record) {

			var rowElement = $(document.createElement('div'));
			rowElement.addClass('ui-row');
			rowElement.attr('rowindex', itemToRender.rowIndex.toString());
			rowElement.css('left', '0px');

			var fixedRowElement = void 0;
			if (controller.options.fixedCols) {
				fixedRowElement = $(document.createElement('div'));
				fixedRowElement.addClass('ui-row');
				fixedRowElement.attr('rowindex', itemToRender.rowIndex.toString());
				fixedRowElement.css('left', '0px');
				controller.fixedColsBodyContainer.append(fixedRowElement);
			}

			//ROW DETAIL
			if (itemToRender.rowDetails) {
				(function () {
					var rowElementParent = controller.bodyContainer.find('.ui-row[rowIndex=' + itemToRender.rowIndex + ']:not(.row-detail-container)');
					rowElement.insertAfter(rowElementParent);

					var isSelected = rowElementParent.find('.ui-cell:eq(0)').is('.selected');
					if (isSelected) {
						rowElement.addClass('selected');
					}
					rowElement.addClass('row-detail-container');

					var rowDetailsBox = $(document.createElement('div'));
					rowDetailsBox.addClass('row-detail-box');
					rowElement.append(rowDetailsBox);

					rowElementParent = controller.options.api.resolveRowElement(itemToRender.rowIndex);

					rowElement.css('height', itemToRender.height + 'px');
					rowElement.css('top', itemToRender.top + 'px');
					rowElement.insertAfter(rowElementParent);

					rowElement.click(function () {
						controller.options.api.selectRow(rowElementParent);
					});

					itemToRender.rowElement = rowElement;

					if (controller.options.rowDetails.template) {
						var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowDetails.template, record);
						itemToRender.rowElement.html(valueToRender);
					} else if (controller.options.rowDetails.renderer) {
						controller.options.rowDetails.renderer(itemToRender.rowElements, record);
					}
				})();
			} else {
				controller.bodyContainer.append(rowElement);

				rowElement.css('height', itemToRender.height);
				rowElement.css('top', itemToRender.top + 'px');
				if (controller.options.fixedCols) {
					fixedRowElement.css('height', itemToRender.height + 'px');
					fixedRowElement.css('top', itemToRender.top + 'px');
				}

				// GROUPING	OR GROUPING	FOOTER
				if (angular.isDefined(itemToRender.children)) {

					//GROUPING FOOTER
					if (itemToRender.footerContainer) {
						rowElement.addClass('ui-grouping-footer-container');

						//GROUP
					} else {
						rowElement.addClass('row-detail');
						rowElement.addClass('grouping'); //added basically to not select this line

						if (itemToRender.expanded) {
							rowElement.addClass('collapse');
						} else {
							rowElement.addClass('expand');
						}
					}

					//
					rowElement.attr('groupIndex', itemToRender.groupIndex);
					rowElement.attr('children', itemToRender.children);
				} else {
					// GROUP CHILD
					if (angular.isDefined(itemToRender.groupIndex)) {
						rowElement.attr('groupIndex', itemToRender.groupIndex);
						rowElement.attr('indexInsideGroup', itemToRender.indexInsideGroup);

						// stripRows (odd line?)
						if (controller.options.stripRows) {
							if (itemToRender.indexInsideGroup % 2 === 1) {
								rowElement.addClass('odd-row');
							}
						}

						// common row
					} else {
						/*
      if (controller.options.rowDetails) {
      	if (itemToRender.expanded) {
      		rowElement.addClass('collapse');
      	} else {
      		rowElement.addClass('expand');
      	}	
      }
      */

						// stripRows (odd line?)
						if (controller.options.stripRows) {
							if (itemToRender.rowIndex % 2 === 1) {
								rowElement.addClass('odd-row');
								if (controller.options.fixedCols) {
									fixedRowElement.addClass('odd-row');
								}
							}
						}
					}
				}
			}

			///////////////////////////////////////////////
			// onbeforerender event
			///////////////////////////////////////////////
			if (controller.options.listeners.onbeforerender) {
				controller.options.listeners.onbeforerender(rowElement, controller);
			}
			///////////////////////////////////////////////
			///////////////////////////////////////////////

			controller.options.listeners.onrenderer(rowElement, fixedRowElement, record, itemToRender, controller);

			///////////////////////////////////////////////
			// onafterrender event
			////////////////////////////////////////////////////////////////
			if (controller.options.listeners.onafterrender) {
				controller.options.listeners.onafterrender(rowElement, controller);
			}
			///////////////////////////////////////////////
			///////////////////////////////////////////////

			////////////////////////////////////////////////////
			//ondblclick event
			////////////////////////////////////////////////////
			rowElement.dblclick(function (event) {
				var targetEl = $(event.target);
				var rowElementDblClick = targetEl.closest('.ui-row');
				var rowIndexDblClick = parseInt(rowElementDblClick.attr('rowindex'));
				var recordDblClick = controller.options.data[rowIndexDblClick];
				if (controller.options.listeners.onrowdblclick) {
					controller.options.listeners.onrowdblclick(recordDblClick, rowElementDblClick, rowIndexDblClick);
				}
			});
			////////////////////////////////////////////////////
			////////////////////////////////////////////////////

			itemToRender.rendered = true;
			return rowElement;
		};

		/**
   *
   *
   */
		me.repaint = function (controller) {
			_repaint(controller, true);
		};

		/**
   *
   *
   */
		me.repaintRow = function (controller, row) {
			var rowIndex = controller.options.api.resolveRowIndex(row);
			_repaintRow(controller, rowIndex, true, true);
		};

		/**
   *	
   *
   */
		me.repaintSelectedRow = function (controller) {
			var selectedRowIndex = me.getSelectedRowIndex(controller);
			me.repaintRow(controller, selectedRowIndex);
		};

		/**
   *
   *
   */
		me.getRowIndex = function (controller, record) {
			var data = controller.options.data;
			for (var index = 0; index < data.length; index++) {
				var rec = data[index];
				if (angular.equals(rec, record)) {
					return index;
				}
			}
			return -1;
		};

		/**
   *
   *
   */
		me.removeRow = function (controller, row) {
			var rowIndexToDelete = controller.options.api.resolveRowIndex(row);
			var currentRowIndex = controller.options.api.getSelectedRowIndex();
			var deletingCurrentRow = rowIndexToDelete === currentRowIndex;

			controller.managerRendererItems.removeRow(controller, rowIndexToDelete);
			_repaint(controller);

			// try to restore stat of selelction
			if (controller.options.data.length > 0) {
				if (currentRowIndex !== -1) {
					var rowIndexToSelect = currentRowIndex;
					if (rowIndexToSelect > rowIndexToDelete) {
						rowIndexToSelect--;
					}
					controller.options.api.selectRow(rowIndexToSelect, false, false);
				}
			}
		};

		/**
   *
   *
   */
		me.removeSelectedRows = function (controller) {
			var selectedRowIndexes = me.getSelectedRowIndexes(controller);
			var decreaseRowIndex = 0;
			for (var index = 0; index < selectedRowIndexes.length; index++) {
				var rowIndex = selectedRowIndexes[index];
				me.removeRow(controller, rowIndex - decreaseRowIndex);
				decreaseRowIndex++;
			}
		};

		// This function help some other functions which get row parameter where sometimes
		// it comes like a record object and sometimes comes its rowIndex
		//
		// row {Number|Object|JQueryElement} Can be passed rowIndex, the object record or even the JQueryElement which corresponds to the object record
		// returns the JQuery Element which corresponds to the object record
		me.resolveRowElement = function (controller, row) {
			var rowIndex = -1;
			if (angular.isObject(row)) {
				//passed the object record or the DOM element
				if (angular.isElement(row)) {
					//passed JQuery element
					return row;
				} else {
					//passed record object
					rowIndex = me.getRowIndex(controller, row);
				}
			} else {
				//passed rowIndex
				rowIndex = row;
			}

			//don't select grouping rows
			return controller.bodyViewport.find('.ui-row[rowindex=' + rowIndex + ']:not(.grouping)');
		};

		// This function help some other functions which get row parameter where sometimes
		// it comes like a record object and sometimes comes its rowIndex
		//
		// row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
		// returns the row index
		me.resolveRowIndex = function (controller, row) {
			if (angular.isObject(row)) {
				//passed the object record or the DOM element
				if (angular.isElement(row)) {
					//passed DOM element
					return row.attr('rowindex');
				} else {
					//passed record object
					return me.getRowIndex(controller, row);
				}
			} else {
				//passed rowIndex
				return row;
			}
		};

		me.setEnabled = function (controller, enabled) {
			controller.enabled = enabled;

			if (enabled) {
				controller.element.removeClass('disabled');
			} else {
				controller.element.addClass('disabled');
			}
		};
	}
})();
'use strict';

(function () {

				'use strict';

				angular.module('ui-deni-grid').run(['$templateCache', function ($templateCache) {

								/**
         *
         *
         *
         */
								$templateCache.put('ui-deni-grid-sections', '                <div class="ui-viewport">\n' + '                    <div class="ui-container">\n' +

								// HEADER /////////////////////////////////////
								'                        <div class="ui-header-viewport-wrapper">\n' + '                            <div class="ui-header-viewport">\n' + '                                <div class="ui-header-container">\n' + '                                </div>\n' + '                            </div>\n' + '                        </div>\n' +
								///////////////////////////////////////////////

								// BODY ///////////////////////////////////////
								'                        <div class="ui-body-viewport-wrapper">\n' + '                            <div class="ui-body-viewport">\n' + '                                <div class="ui-body-container">\n' + '                                </div>\n' + '                            </div>\n' + '                        </div>\n' +
								//////////////////////////////////////////////

								// FOOTER ////////////////////////////////////
								'                        <div class="ui-footer-viewport-wrapper">\n' + '                            <div class="ui-footer-viewport">\n' + '                                <div class="ui-footer-container">\n' + '                                </div>\n' + '                            </div>\n' + '                        </div>\n' +
								//////////////////////////////////////////////

								'                    </div>\n' + //ui-container
								'                </div>\n' //ui-view-port

								);

								/**
         *
         *
         *
         */
								$templateCache.put('ui-deni-grid', '<div class="ui-deni-grid-wrapper">\n' + '    <div class="ui-deni-grid-viewport">\n' + '        <div class="ui-deni-grid-container">\n' +

								///////////////////////////////////////////////////////////		
								// fixed Columns
								///////////////////////////////////////////////////////////
								'            <div class="ui-fixed-cols-viewport-wrapper">\n' + $templateCache.get('ui-deni-grid-sections') + '            </div>\n' +
								///////////////////////////////////////////////////////////		
								///////////////////////////////////////////////////////////					


								///////////////////////////////////////////////////////////		
								// variable Columns
								///////////////////////////////////////////////////////////
								'            <div class="ui-variable-cols-viewport-wrapper">\n' + $templateCache.get('ui-deni-grid-sections') + '            </div>\n' +
								///////////////////////////////////////////////////////////		
								///////////////////////////////////////////////////////////					

								'        </div>\n' + '        <div class="ui-deni-grid-paging">\n' + '        </div>\n' + '    </div>\n' + '    <div class="ui-deni-grid-loading ng-hide" ng-show="ctrl.loading">\n' + '        <div class="image"></div>\n' + '        <div class="text">Loading...</div>\n' + '    </div>\n' + '</div>');
				}]);
})();