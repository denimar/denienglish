//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

  $scope.gridOptions = {
    url: 'https://denimar.github.io/static-data/employees/01000.json',
    grouping: {
      expr: 'address.city',
      template: '<b>{address.city} - {address.state}</b> ({count})'
    },
    columns: [{
      header: 'Name',
      name: 'name',
      width: '30%',
    }, {
      header: 'Company',
      name: 'company',
      width: '30%',
    }, {
      header: 'City',
      name: 'address.city',
      width: '30%',
    }, {
      header: 'Age',
      name: 'age',
      width: '10%',
      align: 'right'
    }]
  }

});
