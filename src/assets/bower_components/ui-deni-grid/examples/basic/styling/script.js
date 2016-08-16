//Module
angular.module('myApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'ui-deni-grid']);

//Controller
angular.module('myApp').controller('ExampleCtrl', function($scope, $http) {

    $scope.gridOptions = {
		rowHeight: '34px',
		//selType: 'cell',
		enableColumnResize: false,
        columns: [
            {
                header: 'Periodo',
                width: '35%',
                align: 'center',
                columns: [		
					{ 
						header:'Inicio', 
						name: 'inicio', 
						width: '50%', 
						align: 'center'
					},
					{ 
						header:'Fim', 
						name: 'fim', 
						width: '50%', 
						align: 'center' 
					},
				]	
			},
            {
                header: 'Planejamento',
                width: '25%',
                align: 'center',
                columns: [		
					{ 
						header:'Pontos', 
						name: 'pontos_planejado', 
						width: '50%', 
						align: 'center'
					},
					{ 
						header:'Ate', 
						name: 'planejado_ate', 
						width: '50%', 
						align: 'center' 
					},
				]	
			},
            {
                header: 'Realizado',
                width: '25%',
                align: 'center',
                columns: [		
					{ 
						header:'Pontos', 
						name: 'pontos_realizado', 
						width: '50%', 
						align: 'center',
						editor: {
							type: 'number',
							min: 5,
							max: 100
						}
					},
					{ 
						header:'Ate', 
						name: 'realizado_ate', 
						width: '50%', 
						align: 'center' 
					},
				]	
			},
			{
	            width: '5%',
	            action: {
	                mdIcon: 'edit',
	                tooltip: 'Edit that employee dsfdsfdasfdasfdas...',
	                fn: function(record) {
	                    alert('Editing user "' + record.name + '"...');
	                }
	            }				
			},
			{
	            width: '5%',
	            action: {
	                mdIcon: 'delete_forever',
	                tooltip: 'Edit that employee...',
	                fn: function(record) {
	                    alert('Editing user "' + record.name + '"...');
	                }
	            }				
			},
			{
	            width: '5%',
	            action: {
	                mdIcon: 'timeline',
	                tooltip: 'Edit that employee...',
	                fn: function(record) {
	                    alert('Editing user "' + record.name + '"...');
	                }
	            }				
			}
        ],
        data: [
            {
                "inicio": "15/08/2016",
                "fim": "20/08/2016",
                "pontos_planejado": 1050,
                "planejado_ate": '19/08/2016',
                "pontos_realizado": 1042,
                "realizado_ate": '18/08/2016'
            },
            {
                "inicio": "11/09/2016",
                "fim": "18/10/2016",
                "pontos_planejado": 856,
                "planejado_ate": '07/08/2016',
                "pontos_realizado": 759,
                "realizado_ate": '05/08/2016'
            },
            {
                "inicio": "15/10/2016",
                "fim": "29/11/2016",
                "pontos_planejado": 745,
                "planejado_ate": '10/11/2016',
                "pontos_realizado": 650,
                "realizado_ate": '07/11/2016'
            }
			
        ]
    };

	$scope.increaseGridHeight = function()     {
		var divContainer = $('.div-container');
		//divContainer.height(divContainer.height() + 50);
		divContainer.css('height', '500px');
	}

});

