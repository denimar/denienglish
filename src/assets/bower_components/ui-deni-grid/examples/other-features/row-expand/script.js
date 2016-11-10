//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    var customTemplate = '<div class="row-expand">\n' +
                         '    <img class="imagem"\n' +
                         '        src="http://image.tmdb.org/t/p/w150/{poster_path}" \n' +
                         '    />\n' +                                  
                         '    <div class="description">{overview}</div>\n' +
                         '<div>';

    $scope.gridOptions = {
        url: 'https://denimar.github.io/static-data/movies/00500.json',
        rowDetails: {
            height: '72px', //50 is default
            template: customTemplate,
            autoExpand: false, //default = false
            renderer: function(element, record) { //when template is filled, the renderer parameter is ignored
                //...
            }
        },
        columns: [
            { 
                header:'Title', 
                name: 'title', 
                width: '60%', 
                align: 'left',
            },
            { 
                header:'Popularity', 
                name: 'popularity', 
                width: '20%', 
                align: 'right'
            },
            {
                header: 'Release',
                name: 'release_date',
                width: '20%',
                align: 'center'
            }
        ]
    };


});

