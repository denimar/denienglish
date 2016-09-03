//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/01000.json',
        grouping: {
            expr: 'address.city',
            template: '<b>{address.city} - {address.state}</b> ({count})'
        },
        columns: [{
            header: 'Name',
            name: 'name',
            width: '25%',
        }, {
            header: 'Company',
            name: 'company',
            width: '25%',
        }, {
            header: 'City',
            name: 'address.city',
            width: '25%',
        }, {
            header: 'Salary',
            name: 'salary',
            width: '25%',
            align: 'right',
            format: 'float',
            footer: [
                'SUM', {
                    fn: 'AVG',
                    grouping: false
                }, {
                    fn: 'MIN',
                    grouping: false
                }, {
                    fn: 'MAX',
                    grouping: false
                }
            ]
        }]
    }

});
