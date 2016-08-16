//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
	rowHeight: '72px',
    url: 'https://api.nytimes.com/svc/news/v3/content/all/all.json?api-key=8c0e3666087b43589789ee6b15eb5acb',
	restConfig: {
		data: 'results',
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
	  renderer: function(value, record, columns, rowIndex) {
		  //url, source
		  var html = '';
		  var descriptionWidth = '402px';
		  if (record.thumbnail_standard) {
			  html += '<img class="img-news" src="' + record.thumbnail_standard + '" />\n';
		  } else {
			  descriptionWidth = '452px';			  
		  }
		  
		  html += '<div style="width:' + descriptionWidth + '" class="description-news">\n' +
				  '  <div class="title-news"><a href="' + record.url + '" target="_blank">' + value + '</a></div>\n' +
				  '  <div class="title-abstract">' + record.abstract + '</div>\n' +	  
				  '</div>';
		  return html;
	  }
    }]
  }

});
