//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var customTemplate = '<div class="row-template">\n' +
                         '    <img class="imagem"\n' +
                         '        src="{avatar}" \n' +
                         '    />\n' +                                  
                         '    <div>\n' +
                         '      <div><b>Name:</b> {name}<div>\n' +
                         '      <div><b>Company:</b> {company}<div>\n' +                         
                         '      <div><b>Age:</b> {age}<div>\n' +                                                                           
                         '      <div><b>Salary:</b> ${salary}<div>\n' +                                                  
                         '    </div>\n' +                         
                         '<div>';

    $scope.gridOptions = {
        rowHeight: '72px', //22px is default
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/employees/01000.json',
        rowTemplate: customTemplate
    };


});

