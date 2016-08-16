//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('SimpleCtrl', function($scope, $http) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/00500.json',
        footerTemplate: '<div class="custom-footer-row-template">\n' +
                        '    <img src="ages.png" />\n' +        

                            //Ages
                            '<table class="data-panel">\n' +
                            '    <tr class="title">\n' +
                            '        <th colspan="2">Age</th>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Sum</td>\n' +
                            '        <td class="col-value">{age(0).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Average</td>\n' +
                            '        <td class="col-value">{age(1).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Highest age</td>\n' +
                            '        <td class="col-value">{age(2).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Lowest age</td>\n' +
                            '        <td class="col-value">{age(3).value}</td>\n' +
                            '    </tr>\n' +
                            '</table>\n' +

                            //Salaries
                            '<table class="data-panel">\n' +
                            '    <tr class="title">\n' +
                            '        <th colspan="2">Salaries</th>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Sum</td>\n' +
                            '        <td class="col-value">{salary(0).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Average</td>\n' +
                            '        <td class="col-value">{salary(1).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Highest salary</td>\n' +
                            '        <td class="col-value">{salary(2).value}</td>\n' +
                            '    </tr>\n' +
                            '    <tr>\n' +
                            '        <td class="col-name">Lowest salary</td>\n' +
                            '        <td class="col-value">{salary(3).value}</td>\n' +
                            '    </tr>\n' +
                            '</table>\n' +
                        '</div>',                        
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '25%', 
                align: 'left',
            },
            {
                header: 'City',
                name: 'address.city',
                width: '25%',
                align: 'left'
            },
            { 
                header:'Company', 
                name: 'company', 
                width: '26%', 
                align: 'left'
            },
            { 
                header:'Age', 
                name: 'age', 
                width: '12%', 
                align: 'right',
                footer: [
                    'SUM',
                    'AVG',
                    'MAX',
                    'MIN'
                ]
            },
            { 
                header:'Salary', 
                name: 'salary', 
                width: '12%', 
                align: 'right',
                format: 'float',
                footer: [
                    'SUM',
                    'AVG',
                    'MAX',
                    'MIN'
                ]
            },
        ]
    };

});

