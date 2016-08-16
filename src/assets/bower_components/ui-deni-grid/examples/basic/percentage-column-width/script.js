//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var fakeData = [
        {
            "name": "Jack Nicholson",
            "gender": "male",
            "age": 79,
        },
        {
            "name": "Julia Roberts",
            "gender": "female",
            "age": 48,
        },
        {
            "name": "Robert De Niro",
            "gender": "male",
            "age": 72,
        },
        {
            "name": "Jennifer Lawrence",
            "gender": "female",
            "age": 25,
        },
        {
            "name": "Sylvester Stallone",
            "gender": "male",
            "age": 69,
        }
    ];

    $scope.gridOptions = {
		hideHeaders: true,
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: 'calc(100% - 100px)', 
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '60px', 
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '40px', 
                align: 'right'
            },
        ],
        data: fakeData
    };

    $scope.gridOptions2 = {
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '50%', 
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '25%', 
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '25%', 
                align: 'right'
            },
        ],
        data: fakeData
    };


});

