(function() {

	'use strict';

	angular
		.module('ui-deni-grid')
		.run(['$templateCache', function($templateCache) {

			/**
			 *
			 *
			 *
			 */
			$templateCache.put('ui-deni-grid-sections', 

				'                <div class="ui-viewport">\n' +
				'                    <div class="ui-container">\n' +

				                         // HEADER /////////////////////////////////////
				'                        <div class="ui-header-viewport-wrapper">\n' +		
				'                            <div class="ui-header-viewport">\n' +
				'                                <div class="ui-header-container">\n' +
				'                                </div>\n' +
				'                            </div>\n' +		
				'                        </div>\n' +
				                         ///////////////////////////////////////////////

					    	             // BODY ///////////////////////////////////////
				'                        <div class="ui-body-viewport-wrapper">\n' +  
				'                            <div class="ui-body-viewport">\n' +
				'                                <div class="ui-body-container">\n' +
				'                                </div>\n' +
				'                            </div>\n' +
				'                        </div>\n' +
				                         //////////////////////////////////////////////

						                 // FOOTER ////////////////////////////////////
				'                        <div class="ui-footer-viewport-wrapper">\n' +  
				'                            <div class="ui-footer-viewport">\n' +
				'                                <div class="ui-footer-container">\n' +
				'                                </div>\n' +
				'                            </div>\n' +
				'                        </div>\n' +
				                         //////////////////////////////////////////////

		        '                    </div>\n' + //ui-container
				'                </div>\n' //ui-view-port

			);		

			/**
			 *
			 *
			 *
			 */
			$templateCache.put('ui-deni-grid', 

				'<div class="ui-deni-grid-wrapper">\n' +
				'    <div class="ui-deni-grid-viewport">\n' +
				'        <div class="ui-deni-grid-container">\n' +		

				             ///////////////////////////////////////////////////////////		
				             // fixed Columns
				             ///////////////////////////////////////////////////////////
				'            <div class="ui-fixed-cols-viewport-wrapper">\n' +
					    		$templateCache.get('ui-deni-grid-sections') +
				'            </div>\n' +
				             ///////////////////////////////////////////////////////////		
				             ///////////////////////////////////////////////////////////					
		    

				             ///////////////////////////////////////////////////////////		
				             // variable Columns
				             ///////////////////////////////////////////////////////////
			    '            <div class="ui-variable-cols-viewport-wrapper">\n' +
			    				$templateCache.get('ui-deni-grid-sections') +
			    '            </div>\n'  +
			    	         ///////////////////////////////////////////////////////////		
				             ///////////////////////////////////////////////////////////					

				'        </div>\n' +
				'        <div class="ui-deni-grid-paging">\n' +		
				'        </div>\n' +		
				'    </div>\n' +
				'    <div class="ui-deni-grid-loading ng-hide" ng-show="ctrl.loading">\n' +
				'        <div class="image"></div>\n' +		
				'        <div class="text">Loading...</div>\n' +				
				'    </div>\n' +
				'</div>'

			);

		}]);

})();		