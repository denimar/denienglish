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
                        fn: function(data, columnName) {
                            var count = 0;
                            for (var index = 0 ; index < data.length ; index++) {
                                if ((data[index].age > 20) && (data[index].age <= 40)) {
                                    count++;
                                }
                            }
                            return count;
                        },
                        text: 'Between 20 and 40 : ',
                        format: 'int'
                    },
                    {
                        fn: function(data, columnName) {
                            var count = 0;
                            for (var index = 0 ; index < data.length ; index++) {
                                if ((data[index].age > 40) && (data[index].age <= 50)) {
                                    count++;
                                }
                            }
                            return count;
                        },
                        text: 'Between 40 and 60 : ',
                        format: 'int'
                    },
                    {
                        fn: function(data, columnName) {
                            var count = 0;
                            for (var index = 0 ; index < data.length ; index++) {
                                if ((data[index].age > 60) && (data[index].age <= 80)) {
                                    count++;
                                }
                            }
                            return count;
                        },
                        text: 'Between 60 and 80 : ',
                        format: 'int'
                    }
                ]
            },
        ]
    };

});

