//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		url: 'http://denimar.github.io/static-data/employees/00500.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '30%', 
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '30%', 
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
            },
            { 
                header:'Eye Color', 
                name: 'eyeColor', 
                width: '15%', 
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

