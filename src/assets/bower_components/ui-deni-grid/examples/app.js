angular.module('myApp', []);

angular.module('myApp').controller('MainCtrl', function($scope) {

	$scope.examples = [
		{
			text: 'Basic',
			children: [
				{
					text: 'Basic Array Grid',
					img: 'basic-array-grid.gif',
					path: '3nfdckrg',
					description: 'The simplest way to show data using the ui-deni-grid'
				},
				{
					text: 'Binding to Local JSON',
					img: 'basic-array-grid.gif',					
					path: '88jxkb1w',
					description: '????'
				},
				{
					text: 'Binding to remote JSON',
					img: 'basic-array-grid.gif',					
					path: 'mc6a24xb',
					description: '????'
				},
				{
					text: 'Binding to Local XML',
					img: 'basic-array-grid.gif',					
					path: 'otey42jd',
					description: '????'
				},
				{
					text: 'Binding to remote XML',
					img: 'basic-array-grid.gif',					
					path: '0u7h2dxd',
					description: '????'
				},
			],
		},		
		{
			text: 'Card View',
			children: [
				{
					text: 'Simple Card View',
					img: 'basic-array-grid.gif',
					path: 't9Lzuyvf',
					description: '?????'
				},
				{
					text: 'Card View with Checkbox',
					img: 'basic-array-grid.gif',
					path: 'uhh0v779',
					description: '?????'
				},
				{
					text: 'Card View with Endless Paging',
					img: 'basic-array-grid.gif',
					path: 'tnn61pkm',
					description: '?????'
				},
			],
		},
		{
			text: 'searches and filters',
			children: [
				{
					text: 'Filtering',
					img: 'basic-array-grid.gif',
					path: '7vyhnv36',
					description: '?????'
				}
			]	
		},
		{
			text: 'Large Dataset',
			children: [
				{
					text: 'Traditional Way',
					path: null,
					description: '?????'
				},
				{
					text: 'Paging 1',
					img: 'basic-array-grid.gif',
					path: 'pjvorqas',
					description: '?????'
				},
				{
					text: 'Paging 2',
					img: 'basic-array-grid.gif',
					path: 'f1pLcwLw',
					description: '?????'
				},
				{
					text: 'Infinite Scroll',
					path: null,
					description: '?????'
				},
				{
					text: 'Endless Paging',
					path: null,
					description: '?????'
				},
			],
		},
		{
			text: 'Fixed Columns',
			children: [
				{
					text: 'Checkbox',
					img: 'basic-array-grid.gif',
					path: 'gv3sgjpy',
					description: 'This example show how put a checkbox as a fixed column'
				},
				{
					text: 'Fixed Columns',
					img: 'basic-array-grid.gif',
					path: 'mousxpr5',
					description: 'A way to scroll the data fixing one or more columns'
				},
				{
					text: 'Indicator',
					img: 'basic-array-grid.gif',
					path: 'v5p3s45x',
					description: 'Showing a indicator at the left side of the grid'
				},
				{
					text: 'Row Number',
					img: 'basic-array-grid.gif',
					path: '4s22s15b',
					description: 'Sometime there is a need to know what line we are'
				},
			]
		},	
		{
			text: 'Templates',
			children: [
				{
					text: 'Row Template 1',
					img: 'basic-array-grid.gif',
					path: 'z075e6d0',
					description: '????????'
				},
				{
					text: 'Row Template 2',
					img: 'basic-array-grid.gif',
					path: '0hhue7rk',
					description: '????????'
				},
				{
					text: 'Footer Template',
					img: 'basic-array-grid.gif',
					path: 'ysp0vdmh',
					description: '????????'
				},
				{
					text: 'Footer Row Template',
					img: 'basic-array-grid.gif',
					path: 'dervvL56',
					description: '????????'
				},
			]
		},		
		{
			text: 'Grouping',
			children: [
				{
					text: 'Grouping',
					img: 'grouping-grouping.gif',
					path: 's9n0x5b7',
					description: 'The simplest way to grouping data using the ui-deni-grid'
				},
				{
					text: 'Grouping with Footer',
					img: 'grouping-grouping.gif',
					path: 'sywnb63x',
					description: 'Showing a footer like a sumary at the end of the grouping, plus, as you can see, the footer is showing at the end of the grid too, exactly like was configured. For more details see the "footer" section.'
				}
			]
		},
		{
			text: 'Selection',
			children: [
				{
					text: 'Row Selection',
				},
				{
					text: 'Simple Cell Selection',
					img: 'grouping-grouping.gif',
					path: 'xw5726xv',
					description: '????'
				},
				{
					text: 'Cell Selection with Cell Template',
					img: 'grouping-grouping.gif',
					path: '???',
					description: '????'
				},
				{
					text: 'CheckBox Selection',
				},
			]
		},
		{
			text: 'Sorting',
			children: [
				{
					text: 'Sorting',
				},
				{
					text: 'Multiple Sorting',
				},
				{
					text: 'Fixed Sorting',
				},
			]
		},
		{
			text: 'Editing',
			children: [
				{
					text: 'Cell Editing',
				},
			]
		},
		{
			text: 'Filtering',
			children: [
				{
					text: 'Local Row Filter'
				},
				{
					text: 'Remote Row Filter'
				}
			]		
		},
		{
			text: 'Drag and Drop',
		},
		{	
			text: 'Footer',
			children: [
				{
					text: 'Custom Functions',
					path: 'footer/custom-functions'
				},
				{
					text: 'Custom Renderer',
					path: 'footer/custom-renderer'
				},
				{
					text: 'Default Functions',
					path: 'footer/default-functions'
				},
				{
					text: 'Row Template',
					path: 'footer/footer-row-template'
				},
				{
					text: 'Footer Template',
					path: 'footer/footer-template'
				},
				{
					text: 'Grouping with Footer',
					path: 'footer/grouping-footer'
				}
			]
		},
		{
			text: 'Other Features',
			children: [
				{
					text: 'Grouped Column Header',
					path: '28ad3uuf',
					img: 'basic-array-grid.gif',
					description: '????????'
				},
				{
					text: 'Row Expand',
					path: '352aacqc',
					img: 'basic-array-grid.gif',
					description: '????????'
				},
				{
					text: 'Property Grid'
				},
				{
					text: 'Action Column',
					path: 'gxpa6yzt',
					img: 'basic-array-grid.gif',
					description: '????????'
				}
			]
		}
	];

	$scope.showItem = function(itemRepeat) {
		if (itemRepeat.$last && itemRepeat.$parent.$last) {
			$('.examples-ui-deni-grid').css('display', 'block');
		}

		return true;
	}

	$scope.itemClick = function(item) {
		if (item.path == null) {
			alert('Feature Under Construction');
			return;
		}

		window.open('preview.html?path=' + item.path + '&title=' + item.text + '&description=' + item.description, '_blank');
	}


});