//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope) {

    $scope.gridOptions = {
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
        ],
        data: [
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
            },
        ],
        listeners: {

            onafterrepaintrow: function(rowIndex, elementRow) {
                console.log(elementRow);
            }

        }
    };

});

