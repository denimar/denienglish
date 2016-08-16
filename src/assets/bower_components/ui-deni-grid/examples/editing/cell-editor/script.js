//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'http://denimar.github.io/static-data/employees/01000.json',
        selType: 'cell',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '40%', 
                align: 'left',
                editor: true
                /*
                renderer: function(value, record, cols, rowIndex) {
                    return value + ' - ' + record.address.city;
                }
                */
            },
            {
                header: 'City',
                name: 'address.city',
                width: '35%',
                align: 'left'
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
                align: 'left',
                style: {
                    color: 'orange'
                },
                editor: {
                    type: 'select',
                    items: [
                        {
                            value: 1,
                            text: 'male'
                        },
                        {
                            value: 2,
                            text: 'female'
                        }
                    ]
                }
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '10%', 
                align: 'right',
                editor: {
                    type: 'number',
                    min: 5,
                    max: 100
                }
            },
        ],
        listeners: {
            onselectionchange: function(controller, element, rowIndex, record) {
                $('.divResponse').html(angular.toJson(record, 2));
            }
        }
    };

});

