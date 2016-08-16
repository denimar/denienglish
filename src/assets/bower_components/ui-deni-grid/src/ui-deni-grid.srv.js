/**
 *
 *
 */
angular.module('ui-deni-grid').service('uiDeniGridSrv', function($compile, $timeout, $templateCache, $q, $http, $filter, uiDeniGridUtilSrv, uiDeniGridConstants) {
	var me = this;


	/**
	 *
	 * remove all selections in the grid
	 *
	 */
	 me.clearSelections = function(controller) {
	 	controller.bodyViewport.find('.ui-row.selected').removeClass('selected');
	 	controller.fixedColsBodyViewport.find('.ui-row.selected').removeClass('selected');

	 	controller.bodyViewport.find('.ui-cell.selected').removeClass('selected');
	 	controller.fixedColsBodyViewport.find('.ui-cell.selected').removeClass('selected');
	 }

	/**
	 *
	 * select all records in the grid
	 *
	 */
	 me.selectAll = function(controller) {
		if (controller.options.multiSelect) {
			controller.bodyViewport.find('.ui-row.selected').addClass('selected');
	 		controller.bodyViewport.find('.ui-cell.selected').addClass('selected');
		} else {			
			throw new Error('"selectAll" : to use selectAll method you must set multiSelect property to true!');
		}
	 }


	/**
	 *
	 * @param headerContainerColumnRow optional comes filled just when we creating sub columns (grouped column headers)
	 */
	me.createColumnHeaders = function(controller, columnsToCreate, headerContainerColumnRow, level, colIndexStart) {
		var columns = [];

		var createDivHeaderContainerColumnRow = function(headerContainerColumn) {
			//ui-header-container-column-row
			var divHeaderContainerColumnRow = $(document.createElement('div'));
			divHeaderContainerColumnRow.addClass('ui-header-container-column-row');
			divHeaderContainerColumnRow.css('height', controller.options.columnHeaderHeight);
			headerContainerColumn.append(divHeaderContainerColumnRow);

			return divHeaderContainerColumnRow;
		}

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

		var colIndex = colIndexStart || 0;

		//Any column was specified in percentage? TODO: create a function to get this
		var anyColumnInPercentage = false;
		for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
			if (controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
				anyColumnInPercentage = true;
				break;
			}
		}
		
		//
		if (anyColumnInPercentage) {
			controller.headerViewport.css('width', 'calc(100% - 17px)');		
			controller.headerContainer.css('width', '100%');
		}
		
		//
		for (var index = 0 ; index < columns.length ; index++) {
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
				if (index == 0) {
					divHeaderContainerColumn.addClass('first-subcolumn');
				} else if (index == columns.length - 1) {
					divHeaderContainerColumn.addClass('last-subcolumn');
				}
			}


			//ui-header-container-column-row
			var divHeaderContainerColumnRow = divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);

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
					cursor: 'pointer',
				});
				divHeaderCell.css({
					'text-align': 'center'
				});
				spanHeaderCellInner.append(inputCheck);
				inputCheck.change(function(event) {
					var checkboxes = controller.fixedColsBodyContainer.find('.ui-cell-inner.checkbox').find('input[type=checkbox]')
					for (var index = 0 ; index < checkboxes.length ; index++) {
						checkboxes[index].checked = event.target.checked;
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
				if ((column.isFixedColumn) || (uiDeniGridUtilSrv.isFixedColumn(controller, column.name))) {
					controller.fixedColsHeaderContainer.append(divHeaderContainerColumn);
				} else {
					controller.headerContainer.append(divHeaderContainerColumn);
				}
			}

			//
			if (controller.columnHeaderLevels > 1) {
				//
				if  (column.columns) {
					//
					divHeaderContainerColumn.addClass('has-subcolumns');
					//
					divHeaderCell.addClass('has-subcolumns');
					//ui-header-container-column-row
					divHeaderContainerColumnRow = createDivHeaderContainerColumnRow(divHeaderContainerColumn);
					//
					me.createColumnHeaders(controller, column.columns, divHeaderContainerColumnRow, currentLevel+1, colIndex);
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
							height: calcNewHeight,
						    //'background-size': '1px ' + calcNewHeight
						    //'background-size': '1px 100%'
						});
					}
				}
			}

			colIndex++;
		}

	}

	/**
	 *
	 *
	 */

	me.createColumnHeadersEvents = function(controller) {
		var hrVerticalLineResizing;
		//var columnHeaderCellResizing;
		var headerContainerColumnResizing;
		var canResize = false;

		var updResizing = function() {
			//controller.colsViewport.css('cursor', 'col-resize');
			//if ((columnHeaderCellResizing) && (event.which == 1)) {
				if (hrVerticalLineResizing == undefined) {
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
		}

		var setResizing = function() {
			if (!hrVerticalLineResizing) {
				hrVerticalLineResizing = document.createElement('hr');
				hrVerticalLineResizing.classList.add('ui-deni-grid-vertical-line-resizing');
				controller.colsViewport.append(hrVerticalLineResizing);
			}
			updResizing();
		}

		var setResizingOff = function() {
			controller.resizing = false;
			//columnHeaderCellResizing = null;
			headerContainerColumnResizing = null;
			controller.colsViewport.css('cursor', 'default');
			if (hrVerticalLineResizing) {
				$(hrVerticalLineResizing).css('display', 'none');
			}
		}

		//Mouse Down
		controller.headerContainer.mousedown(function(event) {
			headerContainerColumn = $(event.target).closest('.ui-header-container-column');
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
		var adjustParentColumnsWidths = function(headerContainerColumn, differenceNewWidth) {
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
		}

		//It is necessary when there are grouped columns
		var adjustChildrenColumnsWidths = function(headerContainerColumn, newWidth) {
			//
			var children = headerContainerColumn.find('.ui-header-container-column');

			//
			if (children.length > 0) {
				//sum the widths
				var totalWidth = 0;
				for (var index = 0 ; index < children.length ; index++) {
					totalWidth += $(children[index]).width();
				}

				//get the column width percentage
				for (var index = 0 ; index < children.length ; index++) {
					var child = $(children[index]);
					var percentage = child.width() * 100 / totalWidth;

					child.css('width', (newWidth * percentage / 100) + 'px');
				}
			}
		}


		//Mouse Up
		$(document).mouseup(function(event){
			if (controller.resizing) {
				if (headerContainerColumnResizing) {
					//
					//var leftResizing = event.pageX - controller.colsViewport.offset().left;
					//var difference = event.clientX - headerContainerColumnResizing.getBoundingClientRect().right;
					var right = headerContainerColumnResizing.getBoundingClientRect().left + headerContainerColumnResizing.clientWidth;
					var difference = event.pageX - right;
					$headerContainerColumnResizing = $(headerContainerColumnResizing);
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
						uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, lastSubcolumn, lastSubcolumn.attr('colindex'));
						//
						//adjustChildrenColumnsWidths($headerContainerColumnResizing, newWidth);

						///////////////////////////////////////////////////////////////////////////////////////////
						// looking for children column headers - It is necessary when there are grouped columns
						///////////////////////////////////////////////////////////////////////////////////////////
						//
						//
						//var headerContainerColumns = $headerContainerColumnResizing.find('.ui-header-container-column');
						//for (var index = 0 ; index < headerContainerColumns.length ; index++) {
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
						uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, $headerContainerColumnResizing, $headerContainerColumnResizing.attr('colindex'));
					}

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
		var debounce = function(func, wait, immediate) {
			var timeout;
			return function() {
				var context = this;
				var args = arguments;
				var later = function() {
					timeout = null;
					if (!immediate) func.apply(context, args);
				};
				var callNow = immediate && !timeout;
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
				if (callNow) func.apply(context, args);
			};
		};

		//Mouse Move
		$(document).mousemove(function(event) {
			if (controller.options.enableColumnResize) {

				if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					if (controller.resizing) {
						debounce(updResizing(), 100);
					}
				} else if (event.which === 0) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					controller.colsViewport.css('cursor', 'default');

					headerContainerColumn = $(event.target).closest('.ui-header-container-column');
					if (headerContainerColumn.length > 0) {

						var columnHeadersCell = controller.headerContainer.find('.ui-header-cell');
						canResize = false;
						//columnHeaderCellResizing = null;
						headerContainerColumnResizing = null;

						for (var index = 0 ; index < columnHeadersCell.length ; index++) {
							var columnHeaderCell = columnHeadersCell[index];

							var position = columnHeaderCell.getBoundingClientRect();
							if ((event.clientX > position.right - 5) && (event.clientX < position.right + 3)) {
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
		for (var index = 0 ; index < columnHeadersCell.length ; index++) {
			var columnHeaderCell = $(columnHeadersCell[index]);

			//
			// Mouse Enter
			columnHeaderCell.mouseenter(function(event) {
				$(event.currentTarget).addClass('hover');
			});

			//
			// Mouse Leave
			columnHeaderCell.mouseleave(function(event) {
				$(event.currentTarget).removeClass('hover');
			});

			//
			// Mouse Up
			columnHeaderCell.mouseup(function(event) {
				if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)
					if (controller.colsViewport.css('cursor') == 'default') { //prevent conflict with the resizing columns function
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
									controller.options.api.sort({name: headerCell.attr('name'), direction: direction});
								}
							}	
						}
					}
				}
			});
		}
		//////////////
		//////////////

	}


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
	var _sort = function(controller, sorters) {
		var sortersArray;
		//Transform param to a Array
		if (angular.isString(sorters)) { //passed a string
			sortersArray = [{name: sorters, direction: 'ASC'}];
		} else if (angular.isObject(sorters)) {
			if (angular.isArray(sorters)) { //passed a array
				sortersArray = sorters;
			} else { //passed a json
				sortersArray = [sorters];
			}
		} else if (angular.isFunction(sorters)) { //Custom Sort
			sortersArray = [sorters];
		} else {
			throw new Error('"sort": param "sorters" passed in a wrong way');
		}

		if (controller.options.data) {
			var sortFn = function(array) {
				for (var index = 0 ; index < array.length ; index++) {
					var sort = array[index];
					var direction = sort.direction || 'ASC'; //default value
					controller.options.data = $filter('orderBy')(controller.options.data, sort.name, direction.toUpperCase() == 'DESC');
				}
			}
			// Are there fixed sorters?
			if (controller.options.fixedSorters) {
				sortFn(controller.options.fixedSorters);
			}

			sortFn(sortersArray);
		}

		return sortersArray;
	}

	/*
	 *
	 *
	 *
	 */
	var _repaintCardView = function(controller, visibleRow) {
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
		for (var indexRecord = 0 ; indexRecord < recordsByRow ; indexRecord++) {
			var indexDataRecord = visibleRow.rowIndex;
			//
			if (visibleRow.rowIndex > 0) {
				indexDataRecord = ((visibleRow.rowIndex) * recordsByRow);
			}
			indexDataRecord += indexRecord;

			var record = controller.options.data[indexDataRecord];

			var divCell = $(rowTableRowCardView.insertCell());
			divCell.css('width', colWidth);
			if (record) {
				var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.cardView.template, record);							
				divCell.html(valueToRender);
				divCell.prop('record', record);							

				divCell.click(function(event) {
					controller.bodyContainer.find('td').removeClass('selected');
					$(event.currentTarget).addClass('selected');

					////////////////////////////////////////////////////
					//onselectionchange event
					////////////////////////////////////////////////////
					if (controller.options.listeners.onselectionchange) {
						controller.options.listeners.onselectionchange($(event.currentTarget).prop('record'));
					}
					////////////////////////////////////////////////////
					////////////////////////////////////////////////////

				});	

				if (controller.options.cardView.checkbox == true) {
					var checkboxCardView = $(document.createElement('input'));
					checkboxCardView.addClass('checkbox');
					checkboxCardView.attr('type', 'checkbox');
					if (controller.checkedRecords.indexOf(record) != -1) {
						checkboxCardView.attr('checked', true);
					}
					checkboxCardView.click(function(event) {
						var rec = $(event.target.parent).prop('record');
						var indexOfRec = controller.checkedRecords.indexOf(rec);

						if (indexOfRec != -1) {
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
	}	


	/*
	 *
	 *
	 *
	 */
	var _repaintRow = function(controller, rowIndex, forceRepaint, execAfterRepaintEvent) {
		var itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
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
	}	

	/*
	 *
	 *
	 *
	 */
	var _repaint = function(controller, forceRepaint) {

		/*
		//
		if (forceRepaint) {
			controller.managerRendererItems.setAllElementsToNotRendered();
		}
		*/

		//
		var visibleRows = controller.managerRendererItems.getVisibleRows();

		//
		for (var index = 0 ; index < visibleRows.length ; index++) {
			var visibleRow = visibleRows[index];
			_repaintRow(controller, visibleRow.rowIndex, forceRepaint);
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
	}

	/**
	 * @param sorters {Array|Object|String} direction is optional
	 * Example:
	 * 		me.sort({name: 'city', direction: 'ASC'}, {name: 'age', direction: 'DESC'}); or
	 * 		me.sort({name: 'city', direction: 'ASC'}); or
	 *		me.sort('city');
	 *
	 */
	me.sort = function(controller, sorters, holdSelection) {
		//var shouldHoldSelection = holdSelection == false ? false : true;
		var recordToHold;
		if (holdSelection != false) {
			recordToHold = me.getSelectedRow(controller);
		}

		controller.headerContainer.find('div.ui-header-cell').removeClass('sort').removeClass('asc').removeClass('desc'); //remove all sorters icons

		var sortersArray;

		//GROUPING
		if (controller.options.api.isGrouped()) {
			sortersArray = _sort(controller, sorters);

			//
			controller.bodyContainer.find('.ui-row.collapse').filter(function() {
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
			var rowElementsExpanded = controller.bodyContainer.find('.ui-row.row-detail-expanded').filter(function() {
				var rowIndex = parseInt($(this).attr('rowindex'));
				var record = controller.options.data[rowIndex];
				recordsToExpand.push(record);
			});

			//
			sortersArray = _sort(controller, sorters);

			//
			controller.options.api.loadData(controller.options.data);

			for (var index = 0 ; index < recordsToExpand.length ; index++) {
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


		for (var index = 0 ; index < sortersArray.length ; index++) {
			var sort = sortersArray[index];

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
	}

	/**
	 * @param raiseError {boolean} Raise a error when it is not found
	 *
	 */
	var _getHeaderColElementByName = function(controller, columnName, raiseError) {
		var columns = controller.headerContainer.find('div.ui-header-cell[name="' + columnName + '"]');
		if (columns.length == 0) {
			if (raiseError) {
				throw new Error('There is not a columns with a name "' + columnName + '"!');
			} else {
				return null;
			}
		} else {
			return columns[0];
		}
	}

	//
	//
	var _rendererRealcedCells = function(completeValue, valueToRealce, realceStyle) {
		if ((completeValue) && (valueToRealce)) {
			completeValue = completeValue.toString();
			var pos = completeValue.toLowerCase().indexOf(valueToRealce.toLowerCase());
			var pos = completeValue.search(new RegExp(valueToRealce, "i"));
			if (pos != -1) {		
				var newValue = '';
				var initPos = 0;
				while (pos != -1) {
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
	}

	//
	//
	//
	var _createDivCell = function(controller, rowElement) {

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
	    	divCell.mouseenter(function(event) {

	    		//selType = 'row'
	    		if (controller.options.selType == 'row') {
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
	    	divCell.mouseleave(function(event) {
	    		//$(event.currentTarget).parent().find('.ui-cell').removeClass('hover');
				//
			 	controller.bodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');
			 	//
			 	controller.fixedColsBodyViewport.find('.ui-row[rowindex=' + rowElement.attr('rowindex') + ']').find('.ui-cell').removeClass('hover');

	    	});

	    	//mousedown
	    	divCell.mousedown(function(event) {
	    		if (event.which === 1) { //event.which: left: 1, middle: 2, right: 3 (pressed)

	    			//selType = 'row'
	    			if (controller.options.selType == 'row') {
	    				var divCell = $(event.currentTarget);
						var rowElement = divCell.closest('.ui-row');
						var rowIndex = parseInt(rowElement.attr('rowindex'));

						me.selectRow(controller, rowElement);

					//selType = 'cell'
					} else {
						//$(event.currentTarget).parent().find('.ui-cell').addClass('hover');
						var divCell = $(event.currentTarget);
						var colIndex = parseInt(divCell.attr('colIndex'));
						var rowElement = divCell.closest('.ui-row');
						var rowIndex = parseInt(rowElement.attr('rowindex'));

						//var rowElement = $(event.currentTarget).closest('.ui-row');
						//var divCell = rowElement.closest('.ui-cell');

						me.selectCell(controller, rowElement, colIndex);
					}

				}
	    	});

			//doubleclick
	    	divCell.dblclick(function(event) {
	    		var targetEl = $(event.target);
	    		if (targetEl.is('.ui-cell-inner')) {
		    		var divCell = $(event.currentTarget);
		    		var colIndex = parseInt(divCell.attr('colIndex'));
					var columns = me.getColumns(controller, controller.options.columns);
					var column = columns[colIndex]

					if (column.editor) {
						var rowElement = divCell.closest('.ui-row');
						var rowIndex = parseInt(rowElement.attr('rowindex'));
						var record = controller.options.data[rowIndex];
						uiDeniGridUtilSrv.setInputEditorDivCell(controller, record, column, divCell);
					}
				}	
	    	});

			///////////////////////////////////
			///////////////////////////////////
		}

		rowElement.append(divCell);

		return divCell;
	}

	//
	//
	//
	var _createDivCellInner = function(divCellParent) {
		var spanCellInner = $(document.createElement('span'));
		spanCellInner.addClass('ui-cell-inner');

		divCellParent.append(spanCellInner);

		return spanCellInner;
	}

	/**
	 *
	 *
	*/
	me.createUiDeniViewEvents = function(controller) {

		//
		//
		controller.options.listeners.onrenderer = function(rowElement, fixedRowElement, record, rowIndex, viewController) {

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
				valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowTemplate, record);
				divCell.html(valueToRender);

			//Row Detail - Grouping or other type of row details
			} else if (rowElement.is('.row-detail')) {
				//uiDeniGridUtilSrv.renderCommonRow(controller, rowElement, record, rowIndex);

				//
				var divCell = _createDivCell(controller, rowElement);
				divCell.addClass('row-detail');

				//
				var spanCellInner = _createDivCellInner(divCell);
				spanCellInner.addClass('row-detail');
				spanCellInner.addClass('expand');
				spanCellInner.css('cursor', 'pointer');

				spanCellInner.click(function(event) {
				 	//if (event.offsetX <= 12) { //:before pseudo element width
				 		spanCellInner.toggleClass('expand collapse');
				 		rowElement.toggleClass('expand collapse');

				 		if (spanCellInner.is('.collapse')) {
				 			uiDeniGridUtilSrv.groupExpand(controller, rowElement, record, rowIndex);
				 		} else {
				 			uiDeniGridUtilSrv.groupCollapse(controller, rowElement, record, rowIndex);
				 		}
				 	//}
				});

				var valueToRender;
				if (controller.options.grouping.template) {
					var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
					valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.grouping.template, record, {count: totalRowsInGroup});
				}

				spanCellInner.html(valueToRender);

			// Grouping Footer
			} else if (rowElement.is('.ui-grouping-footer-container')) {
				var columns = controller.options.columns;
				var totalRowsInGroup = parseInt(rowElement.attr('children') || 0);
				var records = controller.options.data.slice(rowIndex, rowIndex + totalRowsInGroup);

				//
				uiDeniGridUtilSrv.createColumnFooters(controller, rowElement, columns, false);
				//
				uiDeniGridUtilSrv.renderColumnFooters(controller, rowElement, columns, records, false);

			// (Common Row)
			} else {
				//rowElement.css('width', '100%');

				var isRowSelected = rowElement.is('.selected');
				var columns = me.getColumns(controller, controller.options.columns);
				var colIndex = 0;
				for (var index = 0 ; index < columns.length ; index++) {

					//
					if (index == 0) {
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
								var divCellIndicator = _createDivCell(controller, fixedRowElement);
								divCellIndicator.css('width', uiDeniGridConstants.FIXED_COL_INDICATOR_WIDTH);
								divCellIndicator.addClass('auxiliar-fixed-column');
								var spanCellIndicatorInner = _createDivCellInner(divCellIndicator);
								spanCellIndicatorInner.addClass('indicator');
								colIndex++;
							}

							//if has row number
							if (controller.options.fixedCols.rowNumber) {
								var divCellRowNumber = _createDivCell(controller, fixedRowElement);
								divCellRowNumber.css('width', uiDeniGridConstants.FIXED_COL_ROWNUMBER_WIDTH);
								divCellRowNumber.addClass('auxiliar-fixed-column');
								var spanCellRowNumberInner = _createDivCellInner(divCellRowNumber);
								spanCellRowNumberInner.addClass('rownumber');
								spanCellRowNumberInner.html(rowIndex + 1);
								colIndex++;
							}
						}
					}

					//
					var column = columns[index];


					//
					var divCell;

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
						spanCellInner.css('text-align', 'center');						
						spanCellInner.addClass('ui-cell-inner-action');

						var iconActionColumn = column.action.mdIcon || column.action.icon;
						if (angular.isFunction(iconActionColumn)) {
							iconActionColumn = iconActionColumn(record);
						}	
						var imgActionColumn;					
						if (column.action.mdIcon) { //Usa o md-icon do Angular Material
							var imgActionColumnBtn = $(document.createElement('md-button'));
							
							if (column.action.tooltip) {							
								var imgActionColumnBtnTooltip = $(document.createElement('md-tooltip'));
								imgActionColumnBtnTooltip.html(column.action.tooltip);
								imgActionColumnBtn.append(imgActionColumnBtnTooltip);
							}	
						
							imgActionColumn = $(document.createElement('md-icon'));
							imgActionColumn.addClass('material-icons');
							imgActionColumn.html(iconActionColumn);
							imgActionColumnBtn.append(imgActionColumn);														
							
							var imgActionColumnBtnCompiled = $compile(imgActionColumnBtn) (controller.scope);
							spanCellInner.append(imgActionColumnBtn);							
							imgActionColumnBtn.find('md-icon').prop('column', column);							

							imgActionColumnBtn.click(function(event) {
								var imgAction = $(event.currentTarget).find('md-icon');
								var colAction = imgAction.prop('column');
								colAction.action.fn(record, column, imgAction);
							});


						} else {
							imgActionColumn = $(document.createElement('img'));
							imgActionColumn.attr('src', iconActionColumn);
							imgActionColumn.attr('title', column.action.tooltip);
							spanCellInner.append(imgActionColumn);

							imgActionColumn.click(function(event) {
								var imgAction = $(event.currentTarget);
								var colAction = imgAction.prop('column');
								colAction.action.fn(record, column, imgActionColumn);
							});

							imgActionColumn.css('cursor', 'pointer');
						}	

					} else {

						//
						if (index == 0) {
							//
							//rowDetails Property
							if (controller.options.rowDetails) {
								spanCellInner.addClass('row-detail');

								if (controller.options.rowDetails.autoExpand === true) {
									spanCellInner.addClass('collapse');
								} else {
									spanCellInner.addClass('expand');
								}

								spanCellInner.click(function(event) {
								 	if (event.offsetX <= 12) { //:before pseudo element width
								 		var target = $(event.target);

								 		if (target.is('.collapse')) {
								 			uiDeniGridUtilSrv.rowDetailsCollapse(controller, rowElement, record, rowIndex);
								 		} else {
								 			uiDeniGridUtilSrv.rowDetailsExpand(controller, rowElement, record, rowIndex);
								 		}
								 	}
								});

							}
						}

						//
						var style = column.style || {};
						divCell.css(angular.extend(style, {
							'text-align': column.align || 'left'
						}));

						//Margin First column inside of grouping
						if ((index == 0) && (controller.options.api.isGrouped())) {
							divCell.css('padding-left', '20px');
						}

						var value = null;
						try {
							value = eval('record.' + column.name); //value = record[column.name];
						} catch (err) {
						}

						//Is there a specific render for this field?
						if (column.renderer) {
							value = column.renderer(value, record, columns, rowIndex);
						}

						var formattedValue = value;
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
				}

			}
		}

		//
		//
		controller.options.listeners.onafterexpand = function(records, options, elementGroupRow, lastInsertedDivRow) {
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
					var footerDivContainer = $(document.createElement('div'));
					footerDivContainer.addClass('ui-deni-grid-grouping-footer-container');

					//Used to collapse
					elementGroupRow.prop('footer', footerDivContainer);

					footerDivContainer.insertAfter(lastInsertedDivRow);

					uiDeniGridUtilSrv.renderColumnFooters(footerDivContainer, controller.footerContainer, controller.options.columns, records, controller);
				}
			}
		}

		controller.options.listeners.onafterrepaint = function(viewController) {

			var columns = me.getColumns(controller, controller.options.columns);
			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
				if (controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
					anyColumnInPercentage = true;
					break;
				}
			}
			if (anyColumnInPercentage) {
				controller.bodyContainer.find('.ui-row').css('width', '100%');
			}

			/*
			controller.clientWidth;

			var columns = me.getColumns(controller, controller.options.columns);
			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
				if (controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
					anyColumnInPercentage = true;
					break;
				}
			}
			*/

			/*
			var colIndex = 0;

			//Fixed Columns
			var headerContainerColumns = controller.fixedColsHeaderContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (var index = 0 ; index < headerContainerColumns.length ; index++) {
				var headerContainerColumn = $(headerContainerColumns[index]);
				uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
				colIndex++;
			}

			//Variable Columns
			var headerContainerColumns = controller.headerContainer.find('.ui-header-container-column:not(.has-subcolumns)');
			for (var index = 0 ; index < headerContainerColumns.length ; index++) {
				var headerContainerColumn = $(headerContainerColumns[index]);
				uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
				colIndex++;
			}
			*/

        }

		//
		//
		/*
		controller.options.listeners.onafterrepaint = function(viewController) {

			//All columns were specified in percentage? TODO: create a function to get this
			var allColumnsInPercentage = true;
			for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
				if (controller.options.columns[colIndex].width.toString().indexOf('%') == -1) {
					allColumnsInPercentage = false;
					break;
				}
			}
			
			//Any column was specified in percentage? TODO: create a function to get this
			var anyColumnInPercentage = false;
			for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
				if (controller.options.columns[colIndex].width.toString().indexOf('%') != -1) {
					anyColumnInPercentage = true;
					break;
				}
			}
		
			//
			if (controller.options.hideHeaders) {
				
				if (anyColumnInPercentage) {
					controller.container.find('.ui-row').css('width', '100%');
				}	
				
				for (var colIndex = 0 ; colIndex < controller.options.columns.length ; colIndex++) {
					var column = controller.options.columns[colIndex];
					var newWidth = column.width;
					if (!anyColumnInPercentage) {
						newWidth = uiDeniGridUtilSrv.getRealColumnWidth(controller, newWidth, controller.clientWidth);
					}	
					controller.container.find('.ui-cell[colIndex=' + colIndex + ']').css('width', newWidth);
				}
				
			//	
			} else {	
				var colIndex = 0;

				//Fixed Columns
				var headerContainerColumns = controller.fixedColsHeaderContainer.find('.ui-header-container-column:not(.has-subcolumns)');
				for (var index = 0 ; index < headerContainerColumns.length ; index++) {
					var headerContainerColumn = $(headerContainerColumns[index]);
					uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
					colIndex++;
				}

				//Variable Columns
				var headerContainerColumns = controller.headerContainer.find('.ui-header-container-column:not(.has-subcolumns)');
				for (var index = 0 ; index < headerContainerColumns.length ; index++) {
					var headerContainerColumn = $(headerContainerColumns[index]);
					uiDeniGridUtilSrv.adjustColumnWidtsAccordingColumnHeader(controller, headerContainerColumn, colIndex);
					colIndex++;
				}
			}

        }
        */

        //
        controller.bodyViewport.scroll(function(event) {
		    var currentLeft = $(this).scrollLeft();

		    //Vertical Scroll
		    if(controller.bodyViewport.currentScrollLeft === currentLeft) {
		    	controller.bodyViewport.currentScrollTop = $(this).scrollTop();

		        var firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	var boundingClientTop = firstViewRow.get(0).getBoundingClientRect().top;

		        	//
		        	var top = (controller.bodyViewport.currentScrollTop * -1) + 'px';

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

		        var firstViewRow = controller.bodyViewport.find('.ui-row:eq(0)');
		        if (firstViewRow.length > 0) { //if there is at least one record
		        	var boundingClientLeft = firstViewRow.get(0).getBoundingClientRect().left;

		        	//
		        	var left = (controller.bodyViewport.currentScrollLeft * -1) + 'px';

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

	}

	/**
	 *
	 */
	me.getSelectedRow = function(controller) {
		if (controller.rowIndex === undefined) {
			return null;
		} else {
			return controller.options.data[controller.rowIndex];
		}
	}

	/**
	 *
	 */
	me.getChangedRecords = function(controller) {
		var changedRows = controller.bodyViewport.find('div.ui-row.changed');
		var data = controller.options.data;
		var changedRecords = [];
		for (var index = 0 ; index < changedRows.length ; index++) {
			var rowIndex = $(changedRows[index]).attr('rowindex');
			var changedRecord = data[rowIndex];
			changedRecords.push(changedRecord);
		}
		return changedRecords;
	}

	//
	//
	//
	//
	//
	//
	var _resolveJavaScriptElement = function(element) {
		// If element is already a jQuery object
		if(angular.isElement(element)) {
		    return element.get(0);
		} else {
			return element;
		}
	}

	//
	//
	//
	//
	//
	//
	var _resolveJQueryElement = function(element) {
		// If element is already a jQuery object
		if(angular.isElement(element)) {
		    return element
		} else {
			return $(element);
		}
	}

	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its recordIndex
	//
	// record {Object|Number} Can be passed rowIndex or the object record
	// returns the row
	var _resolveRecord = function(controller, record) {
		if (angular.isObject(record)) {  //passed the object record
			return record;
		} else { //passed rowIndex
			return controller.options.data[record];
		}
	}

	/**
	 *	row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
	 *
	 */
	me.isRowSelected = function(controller, row) {
		var rowElement = controller.options.api.resolveRowElement(row);
		return rowElement.is('.selected');
	}

	/**
	 *
	 * return a integer value (see also getSelectedRowIndexes)
	 */
	me.getSelectedRowIndex = function(controller) {
		return controller.rowIndex;
	}

	/**
	 *
	 * return a array (see also getSelectedRowIndex)
	 *
	 */
	me.getSelectedRowIndexes = function(controller) {
		var rowIndexes = [];

		//
		var selectedRows = controller.bodyViewport.find('.ui-row.selected');

		//
		for (var index = 0 ; index < selectedRows.length ; index++) {
			rowIndexes.push(parseInt($(selectedRows[index]).attr('rowindex')));
		}

		return rowIndexes;
	}


	/**
	 *	row {Object|Number} Can be passed rowIndex or the object record
	 *  preventOnSelectionChange {Boolean} default false
	 *  scrollIntoView {Boolean} default true
	*/
    me.selectRow = function(controller, row, preventOnSelectionChange, scrollIntoView) {
    	if ((controller.options.data) && (controller.options.data.length > 0)) {

    		//
    		var rowElement;

    		//
    		if (angular.isElement(row)) {
	    		//
	    		rowElement = row;
	    		//
				controller.rowIndex	= parseInt(rowElement.attr('rowindex'));
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
	    		scrollIntoView = (scrollIntoView == false ? false : true);

				//
				if (rowIndex == -1) {
					throw new Error("selectRow: row passed in a wrong way!");
				}

				//
				var scrollIntoViewFn = function(rowElementToScroll) {
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
							uiDeniGridUtilSrv.groupExpand(controller, groupInfo.rowElement, record, rowIndex)
							itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
						}

						controller.colsViewport.scrollTop(itemRow.top);
						_repaint(controller);

						rowElement = itemRow.rowElement;
					} else {
		    			var rowHeight = parseInt(controller.options.rowHeight.replace('px', ''));
		    			var scrollTop = (rowIndex * rowHeight) - controller.bodyViewportWrapper.height() / 2;
		    			controller.bodyViewport.scrollTop(scrollTop);
		    			_repaint(controller);
		    			var itemRow = controller.managerRendererItems.getInfoRow(rowIndex);
		    			rowElement = itemRow.rowElement;
					}

				}
			}
			
			//
			if ((controller.rowIndex !== undefined) && (!controller.options.multiSelect)) {
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
    }

	/**
	 *	row {Object|Number} Can be passed rowIndex or the object record
	 *  preventOnSelectionChange {Boolean} default false
	 *  scrollIntoView {Boolean} default true
	 *  colIndex {Integer} Column Index.
	*/
    me.selectCell = function(controller, row, colIndex, preventOnSelectionChange, scrollIntoView) {
    	if ((controller.options.data) && (controller.options.data.length > 0)) {

    		//
    		scrollIntoView = (scrollIntoView == false ? false : true);

    		//
    		var rowElement = controller.options.api.resolveRowElement(row);
			//
			if (row.length == 0) {
				throw new Error("selectCell: row passed in a wrong way!");
			}

    		var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
			//
			if (divCell.length == 0) {
				throw new Error("selectCell: colIndex passed in a wrong way!");
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
    }


	/**
	 *	Usage:  getColumns(controller, controller.options.columns)
	 *
	*/
    me.getColumns = function(controller, sourceColumns) {

    	var columns = [];
		for (var index = 0 ; index < sourceColumns.length ; index++) {
			var column = sourceColumns[index];

			//
			if (column.columns) {
				columns = columns.concat(me.getColumns(controller, column.columns));
			} else {
				columns.push(column);
			}
		}

		return columns;
    },


	/**
	 *
	 *
	*/
    me.getColumn = function(controller, fieldName) {
		for (var index = 0 ; index < controller.options.columns.length ; index++) {
			if (controller.options.columns[index].name == fieldName) {
				return controller.options.columns[index];
			}
		}

		return null;
    }

	/**
	 *
	 *
	*/
	me.updateSelectedRow = function(controller, json) {

		if (controller.rowIndex === undefined) {
			throw "You have to select a record";
		} else {
			//
			var fieldsNotNested = uiDeniGridUtilSrv.prepareForNestedJson(json);
			//
			var keyFieldsToChange = Object.keys(fieldsNotNested);
			//
			var record = controller.options.data[controller.rowIndex];
			//
			var dataKeys = 	Object.keys(record);

			//
			for (var index = 0 ; index < keyFieldsToChange.length ; index++) {
				var fieldNameToChange = keyFieldsToChange[index];

				if (dataKeys.indexOf(fieldNameToChange) == -1) {
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
	}

	/**
	 *
	 *
	*/
	me.updateCell = function(controller, rowIndex, colIndex, value) {
		var rowElement = controller.options.api.resolveRowElement(rowIndex);
		var divCell = rowElement.find('.ui-cell[colIndex=' + colIndex + ']');
		var spanCellInner = divCell.find('.ui-cell-inner');
		spanCellInner.html(value);

		//
		divCell.addClass('changed');
		//When we need the changed records we can get by ".ui-row.changed"
		divCell.closest('.ui-row').addClass('changed');
	}
	
	/**
	 *
	 *
	*/
	me.updateSelectedCell = function(controller, value) {

		if ((!angular.isDefined(controller.rowIndex)) || (!angular.isDefined(controller.colIndex))) {
			throw "You have to select a record";
		} else {
			me.updateCell(controller, controller.rowIndex, controller.colIndex, value);
		}

	}
	

	/**
	 *
	 *
	*/
	me.isHideHeaders = function(controller) {
		return controller.options.hideHeaders;
    }

	/**
	 *
	 *
	*/
	me.setHideHeaders = function(controller, hideHeaders) {
		var display;
		if (hideHeaders) {
			display = 'none';
		} else {
			display = 'block';
		}
		controller.colsViewport.find('.ui-header-viewport').css('display', display);
		controller.options.hideHeaders = hideHeaders;
	}

	/**
	 *
	 *
	 */
	me.getPageNumber = function(controller) {
		return controller.options.paging.currentPage;
	}

	/**
	 *
	 *
	 */
	me.setPageNumber = function(controller, pageNumber) {
		controller.options.paging.currentPage = pageNumber;
		controller.paging.find('input.input-page-number').val(pageNumber);
		controller.options.api.reload();
	}


/*	This work is licensed under Creative Commons GNU LGPL License.

	License: http://creativecommons.org/licenses/LGPL/2.1/
   Version: 0.9
	Author:  Stefan Goessner/2006
	Web:     http://goessner.net/ 
*/
/*
function xml2json(xml, tab) {
   var X = {
      toObj: function(xml) {
         var o = {};
         if (xml.nodeType==1) {   // element node ..
            if (xml.attributes.length)   // element with attributes  ..
               for (var i=0; i<xml.attributes.length; i++)
                  o["@"+xml.attributes[i].nodeName] = (xml.attributes[i].nodeValue||"").toString();
            if (xml.firstChild) { // element has child nodes ..
               var textChild=0, cdataChild=0, hasElementChild=false;
               for (var n=xml.firstChild; n; n=n.nextSibling) {
                  if (n.nodeType==1) hasElementChild = true;
                  else if (n.nodeType==3 && n.nodeValue.match(/[^ \f\n\r\t\v]/)) textChild++; // non-whitespace text
                  else if (n.nodeType==4) cdataChild++; // cdata section node
               }
               if (hasElementChild) {
                  if (textChild < 2 && cdataChild < 2) { // structured element with evtl. a single text or/and cdata node ..
                     X.removeWhite(xml);
                     for (var n=xml.firstChild; n; n=n.nextSibling) {
                        if (n.nodeType == 3)  // text node
                           o["#text"] = X.escape(n.nodeValue);
                        else if (n.nodeType == 4)  // cdata node
                           o["#cdata"] = X.escape(n.nodeValue);
                        else if (o[n.nodeName]) {  // multiple occurence of element ..
                           if (o[n.nodeName] instanceof Array)
                              o[n.nodeName][o[n.nodeName].length] = X.toObj(n);
                           else
                              o[n.nodeName] = [o[n.nodeName], X.toObj(n)];
                        }
                        else  // first occurence of element..
                           o[n.nodeName] = X.toObj(n);
                     }
                  }
                  else { // mixed content
                     if (!xml.attributes.length)
                        o = X.escape(X.innerXml(xml));
                     else
                        o["#text"] = X.escape(X.innerXml(xml));
                  }
               }
               else if (textChild) { // pure text
                  if (!xml.attributes.length)
                     o = X.escape(X.innerXml(xml));
                  else
                     o["#text"] = X.escape(X.innerXml(xml));
               }
               else if (cdataChild) { // cdata
                  if (cdataChild > 1)
                     o = X.escape(X.innerXml(xml));
                  else
                     for (var n=xml.firstChild; n; n=n.nextSibling)
                        o["#cdata"] = X.escape(n.nodeValue);
               }
            }
            if (!xml.attributes.length && !xml.firstChild) o = null;
         }
         else if (xml.nodeType==9) { // document.node
            o = X.toObj(xml.documentElement);
         }
         else
            alert("unhandled node type: " + xml.nodeType);
         return o;
      },
      toJson: function(o, name, ind) {
         var json = name ? ("\""+name+"\"") : "";
         if (o instanceof Array) {
            for (var i=0,n=o.length; i<n; i++)
               o[i] = X.toJson(o[i], "", ind+"\t");
            json += (name?":[":"[") + (o.length > 1 ? ("\n"+ind+"\t"+o.join(",\n"+ind+"\t")+"\n"+ind) : o.join("")) + "]";
         }
         else if (o == null)
            json += (name&&":") + "null";
         else if (typeof(o) == "object") {
            var arr = [];
            for (var m in o)
               arr[arr.length] = X.toJson(o[m], m, ind+"\t");
            json += (name?":{":"{") + (arr.length > 1 ? ("\n"+ind+"\t"+arr.join(",\n"+ind+"\t")+"\n"+ind) : arr.join("")) + "}";
         }
         else if (typeof(o) == "string")
            json += (name&&":") + "\"" + o.toString() + "\"";
         else
            json += (name&&":") + o.toString();
         return json;
      },
      innerXml: function(node) {
         var s = ""
         if ("innerHTML" in node)
            s = node.innerHTML;
         else {
            var asXml = function(n) {
               var s = "";
               if (n.nodeType == 1) {
                  s += "<" + n.nodeName;
                  for (var i=0; i<n.attributes.length;i++)
                     s += " " + n.attributes[i].nodeName + "=\"" + (n.attributes[i].nodeValue||"").toString() + "\"";
                  if (n.firstChild) {
                     s += ">";
                     for (var c=n.firstChild; c; c=c.nextSibling)
                        s += asXml(c);
                     s += "</"+n.nodeName+">";
                  }
                  else
                     s += "/>";
               }
               else if (n.nodeType == 3)
                  s += n.nodeValue;
               else if (n.nodeType == 4)
                  s += "<![CDATA[" + n.nodeValue + "]]>";
               return s;
            };
            for (var c=node.firstChild; c; c=c.nextSibling)
               s += asXml(c);
         }
         return s;
      },
      escape: function(txt) {
         return txt.replace(/[\\]/g, "\\\\")
                   .replace(/[\"]/g, '\\"')
                   .replace(/[\n]/g, '\\n')
                   .replace(/[\r]/g, '\\r');
      },
      removeWhite: function(e) {
         e.normalize();
         for (var n = e.firstChild; n; ) {
            if (n.nodeType == 3) {  // text node
               if (!n.nodeValue.match(/[^ \f\n\r\t\v]/)) { // pure whitespace text node
                  var nxt = n.nextSibling;
                  e.removeChild(n);
                  n = nxt;
               }
               else
                  n = n.nextSibling;
            }
            else if (n.nodeType == 1) {  // element node
               X.removeWhite(n);
               n = n.nextSibling;
            }
            else                      // any other node
               n = n.nextSibling;
         }
         return e;
      }
   };
   if (xml.nodeType == 9) // document node
      xml = xml.documentElement;
   var json = X.toJson(X.toObj(X.removeWhite(xml)), xml.nodeName, "\t");
   return "{\n" + tab + (tab ? json.replace(/\t/g, tab) : json.replace(/\t|\n/g, "")) + "\n}";
}

	function parseXml(xml) {
	   var dom = null;
	   if (window.DOMParser) {
	      try { 
	         dom = (new DOMParser()).parseFromString(xml, "text/xml"); 
	      } 
	      catch (e) { dom = null; }
	   }
	   else if (window.ActiveXObject) {
	      try {
	         dom = new ActiveXObject('Microsoft.XMLDOM');
	         dom.async = false;
	         if (!dom.loadXML(xml)) // parse error ..

	            window.alert(dom.parseError.reason + dom.parseError.srcText);
	      } 
	      catch (e) { dom = null; }
	   }
	   else
	      alert("cannot parse xml string!");
	   return dom;
	}
	*/

	var _getPropertyXML = function(properties, item, parentProperty) {
		var property = item.nodeName.toLowerCase();
		if (parentProperty) {
			property = parentProperty + '.' + property;
		}
		if (properties.indexOf(property) == -1) {
			properties.push(property);

			for (var index = 0 ; index < item.children.length ; index++) {
				_getPropertyXML(properties, item.children[index], property);
			}			
		}	
	}

	/**
	 *
	 *
	 */
	var isArrayItem = function(itemToBeAnalyzed) {
		if ((angular.isDefined(itemToBeAnalyzed.children)) && (itemToBeAnalyzed.children.length > 0)) {
			var propName = '';
			for (var i = 0 ; i < itemToBeAnalyzed.children.length ; i++) {
				if (propName == '') {
					propName = itemToBeAnalyzed.children[i].nodeName.toLowerCase();
				} else {
					if (itemToBeAnalyzed.children[i].nodeName.toLowerCase() != propName) {
						return false;
					}
				}
			}
			
			return true;
		} else {
			return false;
		}
	}
	
	/**
	 *
	 *
	 */
	var _getRecordXML = function(records, item, parentNode) {
		var record = parentNode ? parentNode : {};
		
		for (var index = 0 ; index < item.children.length ; index++) {
			var property = item.children[index];
			var propertyName = property.nodeName.toLowerCase();			
			
			if (property.children.length == 0) {
				record[propertyName] = property.textContent;
			} else {
				if (isArrayItem(property)) {
					var valueArray = [];
					for (var childIndex = 0 ; childIndex < property.children.length ; childIndex++) {
						_getRecordXML(valueArray, property.children[childIndex]);
					}
					record[propertyName] = valueArray;
				} else {
					record[propertyName] = {};
					_getRecordXML(records, property, record[propertyName])
				}	
			}				
		}	
		if (!angular.isDefined(parentNode)) {
			records.push(record);
		}
	}
	

	/**
	 *
	 *
	 */
	var _xmlToJson = function(controller, xml) {
		var xmlData = $(xml);
		var items = xmlData.find(controller.options.restConfig.data).find(controller.options.restConfig.dataItems);		
		var records = [];
		for (var index = 0 ; index < items.length ; index++) {
			_getRecordXML(records, items[index]);
		}
		
		var jsonReturn = {
			success: true,
		};
		jsonReturn[controller.options.restConfig.data] = records;
		jsonReturn[controller.options.restConfig.total] = parseInt(xmlData.find(controller.options.restConfig.total).text());		

		return jsonReturn;
	}

	/**
	 *
	 *
	 */
	me.load = function(controller) {
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

				url += '&page=' + page + '&' + controller.options.restConfig.start + '=' + start + '&' + controller.options.restConfig.limit + '=' + limit;
			}	

			//var loading = controller.wrapper.find('.ui-deni-grid-loading');
			//loading.css('display', 'block');

			$http.get(url)
				.then(function(response) {
					var responseData;
					
					if (controller.options.restConfig.type == 'xml') {
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
						
						controller.options.paging.pageCount = Math.floor(controller.options.paging.dataLength / controller.options.paging.pageSize);

						//
						controller.options.api.loadData(responseData[controller.options.restConfig.data]);
						deferred.resolve(responseData[controller.options.restConfig.data]);

						//
						controller.paging.find('.label-page-count').html('of ' + controller.options.paging.pageCount);

						//
						var limit = controller.options.paging.pageSize;
						var start = (controller.options.paging.currentPage - 1) * limit;
						var end = start + controller.options.paging.pageSize;
						controller.paging.find('.label-displaying').html(start + ' - ' + end);

						controller.paging.find('.label-record-count').html(controller.options.paging.dataLength + ' records');
						
					} else {
						//
						controller.options.api.loadData(responseData[controller.options.restConfig.data]);
						deferred.resolve(responseData[controller.options.restConfig.data]);
					}

					controller.bodyViewport.removeClass('initilizing-data');					
					controller.loading = false;
				},
				function(response) {
					controller.loading = false;
					deferred.reject(response.statusText);
    			});
		} else {
			controller.loading = false;
			deferred.reject('"load" : To use load function is necessary set the url property.');
		}

		return deferred.promise;
	}

	/**
	 *
	 *
	 */
	me.reload = function(controller) {
		return me.load(controller);
	}


	/**
	 *
	 *
	 */
	me.loadData = function(controller, data) {
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
				for (var index = 0 ; index < controller.options.columns.length ; index++) {
					columnNames.push(controller.options.columns[index].name);
				}
				controller.options.data = $filter('filter')(data, function(record, index, array) {
					for (var colIndex = 0 ; colIndex < columnNames.length ; colIndex++) {
						var value = record[columnNames[colIndex]];
						if (value) {
							//Insensitive Comparation
							if (value.toString().search(new RegExp(controller.filterInfo.valuesToFilter, "i")) != -1) {
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
			controller.initialData = data;
		}

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
		var limitLength = (data.length < controller.rowsPerPage ? data.length : controller.rowsPerPage);

		//
		//
		// GROUPING
		if (controller.options.api.isGrouped()) {
			var expressionToGroup = controller.options.grouping.expr;

			var getEvalFieldValue = function(record, fieldName) {
				return eval('record.' + fieldName);
			}

			var getEvalExpressionValue = function(record, expression) {
				var evalStr = '(function() {\n' +
			    			  '		with (record) {\n' +
							  '				return ' + expression + '\n' +
							  '		}\n' +
							  '})()';

				return eval(evalStr);
			}

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
			controller.options.fixedSorters	= [{
				name: expressionToGroup,
				direction: 'ASC'
			}];

			//
			var oldValue;
			var recordGroup;
			var groupIndex = -1;
			for (var index = 0 ; index < controller.options.data.length ; index++) {
				var record = controller.options.data[index];
				var value = functionToEvaluate(record, expressionToGroup);

				//
				if (oldValue == value) {
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
				record.rowIndex = index;

			}

			//
			controller.bodyContainer.height((controller.options.dataGroup.length * rowHeight) + 2);
			if (controller.options.fixedCols) {
			  controller.fixedColsBodyContainer.height(controller.bodyContainer.height());
			}
		} else {
			var heightBodyContainer;
			if (controller.options.cardView) {
				heightBodyContainer = (Math.ceil(controller.options.data.length / controller.options.cardView.numberOfColumns) * rowHeight);
			} else {
				heightBodyContainer = (controller.options.data.length * rowHeight);
			}

			//
			controller.bodyContainer.height(heightBodyContainer + 2);

			if (controller.options.fixedCols) {
			  controller.fixedColsBodyContainer.height(controller.bodyContainer.height());
			}
		}

		//
		controller.managerRendererItems.createItems();


		//
		_repaint(controller);

		uiDeniGridUtilSrv.remakeHeightBodyViewportWrapper(controller);

		if (data.length > 0) {
			controller.options.api.selectRow(0, false, false);
		}

		///////////////////////////////////////////////////////////////////////////
		//AfterLoad Event
		///////////////////////////////////////////////////////////////////////////
		if (controller.options.listeners.onafterload) {
			controller.options.listeners.onafterload(data, controller.options);
		}
		///////////////////////////////////////////////////////////////////////////
		///////////////////////////////////////////////////////////////////////////
	};


	me.findKey = function(controller, keyValue, opts) {
		var valuesToFind = JSON.parse('{"' + controller.options.keyField + '": "' + keyValue + '"}');
		return me.find(controller, valuesToFind, opts);
	}

	/**
	 *
	 *
	 * @param valuesToFind {object} json which will contains the keys and values for the search
	 * @param opts TODO: specify in more details
	 *
	 * return {array|record} depends on the value of "all" parameter.
	 */
	 me.find = function(controller, valuesToFind, opts) {
	 	var data = controller.options.data || [];
	 	valuesToFind = valuesToFind || {};
	 	var keys = Object.keys(valuesToFind);
	 	if (data.length == 0) {
			throw new Error ('"Find" : There is no data to find!');
	 	} else if (keys.length == 0) {
			throw new Error ('"Find" : param "valuesToFind" must be informed!');
	 	}

	 	////////////////////////////////////////////////////////////////////////////////
	 	//get the opt parameter and fill the detault values too
	 	////////////////////////////////////////////////////////////////////////////////
	 	opts = opts || {};
	 	var exactSearch = (opts.exactSearch == false ? false : true); //Exact search? default = true (only used for string values)
	 	var all = (opts.all == true ? true : false); //Return all records found? default = false (In this case the search stop when the first record is found)
	 	var ignoreCase = (opts.ignoreCase == true ? true : false) //Ignore case when comparing strings (only used for string values)
	 	////////////////////////////////////////////////////////////////////////////////

	 	var recordsFound = [];
	 	var breakParentLoop = false;

	 	var newJson = uiDeniGridUtilSrv.prepareForNestedJson(valuesToFind);
	 	keys = Object.keys(newJson);
	 	////////////////////////////////////////////////////////////////////////////////
	 	////////////////////////////////////////////////////////////////////////////////
	 	var found = false;

	 	//loop over the data
	 	for (var index = 0 ; index < data.length ; index++) {
	 		var record = data[index];

		 	var foundRecord = false;

	 		//loop over the fields
		 	for (var fieldIndex = 0 ; fieldIndex < keys.length ; fieldIndex++) {
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

				if ((exactSearch) || (!valueIsString)) {
					foundRecord = valueToFind == value;
				} else {
					foundRecord = value.indexOf(valueToFind) != -1;
				}

				if (!foundRecord) {
					continue;
				}
		 	}

	 		if (foundRecord) { //found record?
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
			if (opts.inLine === true) { //opts.inLine: true
				inLine = inLineDefaultValue;
			} else if (angular.isObject(opts.inLine)) { //opts.inLine: {...}
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
				if (inLine.realce == true) { //opts.inLine.realce: true
					inLine.realce = inLineRealceDefaultValue;
				} else { //opts.inLine: {...}
					inLine.realce = opts.inLine.realce;
					inLine.realce.style = inLine.realce.style || inLineRealceDefaultValue.style;
				}
			}

			// "inLine.scrollIntoView"
			inLine.scrollIntoView = (inLine.scrollIntoView == false ? false : true);

			/////////////////////////////////////////////////////////////////////////
			/////////////////////////////////////////////////////////////////////////

			controller.searchInfo = {
				'valuesToFind': valuesToFind,
				'opts': opts
			};

			var selectAndRemoveRendered = function(record, preventSelecionChange, scrollIntoView) {
				controller.options.api.selectRow(record, preventSelecionChange, scrollIntoView);
				var rowElement = controller.options.api.resolveRowElement(record);
				rowElement.attr('rendered', false);
			}

			//remove all selections
			controller.options.api.clearSelections();
			if (Array.isArray(recordsFound)) {
				//multiSelect
				if (controller.options.multiSelect) {
					for (var index = 0 ; index < recordsFound.length ; index++) {
						selectAndRemoveRendered(recordsFound[index], index != 0, index == 0);
					}
				//singleSelect
				} else {
					if (recordsFound.length > 1) {
						console.warn('"find": More than one record was returned, but as the "inLine" property is true and "multiSelect" is false, just the first record will be selected.');
					}
					selectAndRemoveRendered(recordsFound[0], false, true);
				}
			} else {
				if (recordsFound != null) {
					selectAndRemoveRendered(recordsFound, preventSelecionChange, scrollIntoView);
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
	}

	me.filter = function(controller, valuesToFilter, opts) {
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
			controller.options.api.loadData(controller.initialData);
		}
	}

	/**
	 *
	 *
	 */
	me.getRowHeight = function(controller) {
		return controller.options.rowHeight;
	}

	/**
	 *
	 *
	 */
	me.setRowHeight = function(controller, rowHeight) {
		var rowElements = controller.bodyViewport.find('div.ui-row:not(.grouping-footer-container)');
		rowElements.css('height', controller.options.rowHeight);
	}


	/**
	 * @param record {Object|Number} Can be passed rowIndex or the object record
	 *
	 */
	me.getRowElement = function(controller, record) {
		var rowIndex = _resolveRowIndex(record);
		return me.bodyViewport.find('div.ui-row[rowIndex=' + rowIndex + ']');
	}


	var _recreateAll = function(controller) {
		if (controller.options.data) {
			//Remmove all rows before load
			controller.bodyViewport.find('div.ui-deni-view-group-header').remove();
			controller.bodyViewport.find('div.ui-row').remove();

			me.loadData(controller, controller.options.data);
		}
	}

	/**
	 *
	 *
	 */
	me.toogleGrouping = function(controller) {
		controller.options.enableGrouping = !controller.options.enableGrouping;
		_recreateAll(controller);
	}


	/**
	 *
	 *
	 */
	me.isEnableGrouping = function(controller) {
		return controller.options.enableGrouping;
	},

	/**
	 *
	 *
	 */
	me.isGrouped = function(controller) {
		return controller.isGrouped;
	},

	/**
	 *
	 *
	 */
	me.setEnableGrouping = function(controller) {
		controller.options.enableGrouping = true;
		_recreateAll(controller);
	}

	/**
	 *
	 *
	 */
	me.setDisableGrouping = function(controller) {
		controller.options.enableGrouping = false;
		_recreateAll(controller);
	}

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
	var _renderRowEl = function(controller, itemToRender, record) {

		var rowElement = $(document.createElement('div'));
		rowElement.addClass('ui-row');
		rowElement.attr('rowindex', itemToRender.rowIndex.toString());
		rowElement.css('left', '0px');

		var fixedRowElement;
		if (controller.options.fixedCols) {
			fixedRowElement = $(document.createElement('div'));
			fixedRowElement.addClass('ui-row');
			fixedRowElement.attr('rowindex', itemToRender.rowIndex.toString());
			fixedRowElement.css('left', '0px');
			controller.fixedColsBodyContainer.append(fixedRowElement);
		}

		//ROW DETAIL
		if (itemToRender.rowDetails) {
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

			var rowElementParent = controller.options.api.resolveRowElement(itemToRender.rowIndex);

			rowElement.css('height', itemToRender.height + 'px');
			rowElement.css('top', itemToRender.top + 'px');
			rowElement.insertAfter(rowElementParent);

			rowElement.click(function() {
				controller.options.api.selectRow(rowElementParent);
			});

			itemToRender.rowElement = rowElement;


			if (controller.options.rowDetails.template) {
				var valueToRender = uiDeniGridUtilSrv.applyTemplateValues(controller.options.rowDetails.template, record);
				itemToRender.rowElement.html(valueToRender);
			} else if (controller.options.rowDetails.renderer)	{
				controller.options.rowDetails.renderer(itemToRender.rowElements, record);
			}
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
						if (itemToRender.indexInsideGroup % 2 == 1) {
							rowElement.addClass('odd-row');
						}
					}

				// common row
				} else {
					// stripRows (odd line?)
					if (controller.options.stripRows) {
						if (itemToRender.rowIndex % 2 == 1) {
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

		controller.options.listeners.onrenderer(rowElement, fixedRowElement, record, itemToRender.rowIndex, controller);

		///////////////////////////////////////////////
		// onafterrender event
		///////////////////////////////////////////////
		if (controller.options.listeners.onafterrender) {
			controller.options.listeners.onafterrender(rowElement, controller);
		}
		///////////////////////////////////////////////
		///////////////////////////////////////////////

		////////////////////////////////////////////////////
		//ondblclick event
		////////////////////////////////////////////////////
    	rowElement.dblclick(function(event) {
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
	me.repaint = function(controller) {
		_repaint(controller, true);
	};

	/**
	 *
	 *
	 */
	me.repaintRow = function(controller, row) {
		var rowIndex = controller.options.api.resolveRowIndex(row);
		_repaintRow(controller, rowIndex, true, true);
	};

	/**
	 *	
	 *
	 */
	me.repaintSelectedRow = function(controller) {
		var selectedRowIndex = me.getSelectedRowIndex(controller);
		me.repaintRow(controller, selectedRowIndex);
	};	


	/**
	 *
	 *
	 */
	me.getRowIndex = function(controller, record) {
		var data = controller.options.data;
		for (var index = 0 ; index < data.length ; index++) {
			var rec = data[index];
			if (angular.equals(rec, record)) {
				return index;
			}
		}
		return -1;
	}

	/**
	 *
	 *
	 */
	me.removeRow = function(controller, row) {
		var rowIndexToDelete = controller.options.api.resolveRowIndex(row);
		var currentRowIndex = controller.options.api.getSelectedRowIndex();
		var deletingCurrentRow = rowIndexToDelete == currentRowIndex;

		controller.managerRendererItems.removeRow(controller, rowIndexToDelete);
		_repaint(controller);

		// try to restore stat of selelction
		if (controller.options.data.length > 0) {
			if (currentRowIndex != -1) {
				var rowIndexToSelect = currentRowIndex;
				if (rowIndexToSelect > rowIndexToDelete) {
					rowIndexToSelect--;
				}
				controller.options.api.selectRow(rowIndexToSelect, false, false);
			}
		}	
	}

	/**
	 *
	 *
	 */
	me.removeSelectedRows = function(controller) {		
		var selectedRowIndexes = me.getSelectedRowIndexes(controller);
		var decreaseRowIndex = 0;
		for (var index = 0 ; index < selectedRowIndexes.length ; index++) {
			var rowIndex = selectedRowIndexes[index];
			me.removeRow(controller, rowIndex - decreaseRowIndex);
			decreaseRowIndex++;
		}
	}

	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its rowIndex
	//
	// row {Number|Object|JQueryElement} Can be passed rowIndex, the object record or even the JQueryElement which corresponds to the object record
	// returns the JQuery Element which corresponds to the object record
	me.resolveRowElement = function(controller, row) {
		var rowIndex = -1;
		if (angular.isObject(row)) {  //passed the object record or the DOM element
			if (angular.isElement(row)) { //passed JQuery element
				return row;
			} else { //passed record object
				rowIndex = me.getRowIndex(controller, row);
			}
		} else { //passed rowIndex
			rowIndex = row;
		}

		//don't select grouping rows
		return controller.bodyViewport.find('.ui-row[rowindex=' + rowIndex + ']:not(.grouping)');
	}

	// This function help some other functions which get row parameter where sometimes
	// it comes like a record object and sometimes comes its rowIndex
	//
	// row {Number|Object|Element} Can be passed rowIndex, the object record or even the DOM element which corresponds to the object record
	// returns the row index
	me.resolveRowIndex = function(controller, row) {
		if (angular.isObject(row)) {  //passed the object record or the DOM element
			if (angular.isElement(row)) { //passed DOM element
				return row.attr('rowindex');
			} else { //passed record object
				return me.getRowIndex(controller, row);
			}
		} else { //passed rowIndex
			return row;
		}
	}


	////////////////////////////////////////////////////////////////
	// PRIVATES METHODS
	////////////////////////////////////////////////////////////////

	//
	//
	//
	//

	////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////


});
