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
        //selType: 'cell', //'row' is default
        //multiSelect: true, //default is false 
        url: '../../../../data/movies/movies-01000.json',
        //columnHeaderHeight: '45px',
        columns: [
            { 
                header:'Id', 
                name: 'id', 
                width: '90px',
                align: 'right',
            },
            { 
                header:'Title', 
                name: 'title', 
                width: '200px',
                align: 'left',
            },
            { 
                header:'Popularity', 
                name: 'popularity', 
                width: '100px',
                align: 'right'
            },
            {
                header: 'Release',
                name: 'release_date',
                width: '150px',
                align: 'center'
            },            
            {
                header: 'Votes',
                name: 'vote_count',
                width: '100px',
                align: 'center'
            },

        ]
    };

});

