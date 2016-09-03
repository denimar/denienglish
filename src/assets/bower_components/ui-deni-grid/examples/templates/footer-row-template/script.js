//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/00500.json',
        columnFooterRowHeight: '35px', //default = '22px'        
        footerRowTemplate: '<div class="custom-row-template">\n' +
                           '    <div>\n' + 
                           '        <img src="https://denimar.github.io/ui-deni-grid/examples/images/money.png" />\n' +
                           '        <span><b>{salary.text}</b>{salary.value}</span>\n' +
                           '    </div>\n' +                            
                           '</div>',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '35%'
            },
            {
                header: 'City',
                name: 'address.city',
                width: '25%'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '15%', 
                align: 'right'
            },
            { 
                header:'Salary', 
                name: 'salary', 
                width: '25%', 
                align: 'right',
                format: 'float',
                footer: [
                    {
                        fn: 'SUM',
                        text: 'Sum of the salaries : '
                    },    
                    {
                        fn: 'AVG',
                        text: 'Average of the salaries : '
                    },    
                    {
                        fn: 'MAX',
                        text: 'Highest salary : '
                    },    
                    {
                        fn: 'MIN',
                        text: 'Lowest salary : '
                    }
                ]
            },
        ]
    };

});

