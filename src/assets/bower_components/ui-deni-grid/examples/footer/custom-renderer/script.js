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
        //columnFooterRowHeight: '80px', //default = '22px'
        //sorters: 'name',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '35%', 
                align: 'left',
            },
            {
                header: 'City',
                name: 'address.city',
                width: '25%',
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
                width: '25%', 
                align: 'right',
                format: 'float',
                footer: [
                    {
                        fn: 'SUM',
                        textRenderer: function(textElement, text) {
                            textElement.css({
                                'background-color': 'greenyellow',
                                color: 'green',                                
                                padding: '2px'
                            });
                            return 'Sum of the ages --> ';
                        },
                        valueRenderer: function(valueElement, value) {
                            valueElement.css({
                                'background-color': 'greenyellow',
                                color: 'green',                                
                                padding: '2px'
                            });
                            return value; //it is allowed change this value
                        }
                    }    
                ]
            },
        ]
    };

});

