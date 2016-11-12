//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/static-data/movies/00500.json',    
        fixedCols: {
            indicator: true,
        },
        columns: [{
                header: 'Id',
                name: 'id',
                width: '90px',
                align: 'right',
            }, {
                header: 'Title',
                name: 'title',
                width: '200px',
                align: 'left',
            }, {
                header: 'Popularity',
                name: 'popularity',
                width: '120px',
                align: 'right'
            }, {
                header: 'Release',
                name: 'release_date',
                width: '130px',
                align: 'center'
            }, {
                header: 'Votes',
                name: 'vote_count',
                width: '80px',
                align: 'center'
            },

        ]
    };

});
