//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/01000.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '20%', 
                align: 'left',
            },
            {
                header: 'Address',
                width: '40%',
                align: 'center',
                columns: [
                    {
                        header: 'City',
                        name: 'address.city',
                        width: '50%',
                        align: 'left',
                    },
                    {
                        header: 'State',
                        name: 'address.state',
                        width: '50%',
                        align: 'left'
                    },
                ]
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '40%', 
                align: 'right'
            },
        ]
    };

});

