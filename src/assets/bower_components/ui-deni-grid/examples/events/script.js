//Module
angular.module('myApp', ['ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope) {

    var me = this;
    me.events = [];

    var _addEvent = function(eventName) {
        me.events.push({eventName: eventName, time: new Date()});

        try {
            $scope.$apply();
        } catch(e) {
        }
    }

    me.gridOptions = {
        url: 'https://denimar.github.io/static-data/employees/01000.json',
        columns: [
            { 
                header:'Name', 
                name: 'name', 
                width: '40%', 
                align: 'left'
            },
            {
                header: 'City',
                name: 'address.city',
                width: '35%',
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
                width: '10%', 
                align: 'right'
            },
        ],
        listeners: {

            onbeforeload: function(data, options) {
                _addEvent('onbeforeload');
            },

            onafterload: function(data, options) {
                _addEvent('onafterload');
            },

            onselectionchange: function(controller, element, rowIndex, record) {
                _addEvent('onselectionchange');
            }

        }
    };

});

