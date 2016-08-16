//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        idField: 'id',
        rowHeight: '22px', //22px is default
        hideHeaders: false, //false is default 
        stripRows: true, //true is default       
        enableColumnResize: true, //true is default
        sortableColumns: true, //true is default
        //multiSelect: true, //default is false  
        url: '../../../../data/employees/employees-01000.json',
        //sorters: 'name',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '40%', 
                align: 'left'
            },
            {
                header: 'City',
                name: 'address.city',
                width: '30%',
                align: 'left'
            },
            { 
                header:'Gender', 
                name: 'gender', 
                width: '15%', 
                align: 'left'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '15%', 
                align: 'right',
                format: 'float',                
                footer: [
                    'SUM',
                    'AVG',
                    {
                        fn: 'COUNT',
                        format: 'int'
                    },
                    'MAX',
                    'MIN'
                ]
            },
        ]
    };

});

