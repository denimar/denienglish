//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var customRowTemplate = '<div class="row-template">\n' +
                            '    <img class="imagem" src="http://image.tmdb.org/t/p/w150/{poster_path}" />\n' +                                  
                            '    <div class="description">{overview}</div>\n' +
                            '<div>';

    $scope.gridOptions = {
        rowHeight: '76px', //22px is default
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/movies/01000.json',
        rowTemplate: customRowTemplate
    };


});

