//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'http://denimar.github.io/static-data/employees/00100.json',
    cardView: {
		  numberOfColumns: 3,
		  checkbox: true,
		  template: '<div class="card-view-item">\n' +
                  '    <div class="card-view-watermark" style="background-image:url({avatar});"></div>\n' +
		          '  <div class="card-view-content">\n' +
                  '    <div><b>Name : </b>{name}</div>\n' +
                  '    <div><b>Hiring : </b>{hiringDate}</div>\n' +
                  '    <div><b>Age : </b>{age}</div>\n' +
                  '    <div><b>Email : </b>{email}</div>\n' +
                  '  </div>\n' +
                  '</div>',
		  rowHeight: 180, //default=150
	  },
    listeners: {
      oncheckboxchange: function(record, checkedRecords, checkbox) {
        console.clear();
        console.log(JSON.stringify(checkedRecords, false, '    '));
      }
    }

  }

});
