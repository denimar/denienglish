//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope) {

    $scope.gridOptions = {
        url: 'https://denimar.github.io/ui-deni-grid/examples/data/movies/movies-00500.json',    
        fixedCols: {
            columns: ['id', 'title']
        },
        columns: [{
                header: 'Id',
                name: 'id',
                width: '100px',
                align: 'right',
            }, {
                header: 'Title',
                name: 'title',
                width: '250px',
                align: 'left',
            }, {
                header: 'Popularity',
                name: 'popularity',
                width: '160px',
                align: 'right'
            }, {
                header: 'Release',
                name: 'release_date',
                width: '150px',
                align: 'center'
            }, {
                header: 'Votes',
                name: 'vote_count',
                width: '100px',
                align: 'center'
            },

        ]
    };

});
