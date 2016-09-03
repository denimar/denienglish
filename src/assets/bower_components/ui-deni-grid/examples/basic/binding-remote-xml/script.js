//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'https://api.nytimes.com/svc/news/v3/content/all/all.xml?api-key=8c0e3666087b43589789ee6b15eb5acb',
        restConfig: {
            type: 'xml',
            data: 'results',
            dataItems: 'news_item',
            total: 'num_results',
            start: 'offset',
            limit: 'limit'
        },  
		paging: {
			pageSize: 20
		},
		columns: [{
		  header: 'Type',
		  name: 'item_type',
		  width: '7%',
		},{
		  header: 'Section',
		  name: 'section',
		  width: '9%'
		},{
		  header: 'Sub Section',
		  name: 'subsection',
		  width: '14%',
		},{
		  header: 'Published',
		  name: 'published_date',
		  width: '10%',
		  format: 'date',
		  align: 'center'
		},{
		  header: 'Title',
		  name: 'title',
		  width: '60%',
		}]
	  }

});

