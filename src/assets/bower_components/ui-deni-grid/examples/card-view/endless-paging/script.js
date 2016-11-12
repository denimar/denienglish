//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'http://denimar.github.io/static-data/movies/00100.json',
    cardView: {
		  numberOfColumns: 2,
		  template: '<div class="card-view-item">\n' +
                '  <div>\n' +
                '    <img class="card-view-image" src="http://image.tmdb.org/t/p/w150/{poster_path}" />\n' +
                '    <div class="card-view-info">\n' +
                '      <div><b>Title : </b>{title}</div>\n' +
                '      <div><b>Language : </b>{original_language}</div>\n' +                
                '      <div><b>Release : </b>{release_date}</div>\n' +                                
                '      <div><b>Overview : </b>{overview}</div>\n' +                 
                '    </div>"\n' +                    
                '  </div>\n' +                
                '</div>',
		  rowHeight: 180, //default=150
      endlessPaging: true
	  },
    listeners: {
      onselectionchange: function(controller, element, rowIndex, record) {
        console.clear();
        console.log(JSON.stringify(record, false, '    '));
      }
    }

  }

});
