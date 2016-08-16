//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'employees.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '50%', 
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '30%', 
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '20%', 
                align: 'right'
            },
        ]
	};

});

