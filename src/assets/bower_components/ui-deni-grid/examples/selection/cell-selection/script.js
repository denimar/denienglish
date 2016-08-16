//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/00500.json',
        selType: 'cell', //default = row
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '30%', 
                align: 'left',
            },
            {
                header: 'City',
                name: 'address.city',
                width: '30%',
                align: 'left'
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '30%', 
                align: 'left'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right'
            },
        ]
    };

});

