(function() {
	'use strict';

	angular
		.module('category')
		.factory('categoryMock', categoryMock);

	function categoryMock(restService)	{

		var fakeCategory = {cdCategoria: 1, dsCategoria: '_Catecory-Testing'};
		var fakeCallback = {
			data: {
				data: [fakeCategory]
			}		
		};	
		var fakeThenCallback = {
			then: function(callbackFn) {
				callbackFn(fakeCallback);
			}
		};


		return {
			fakeCategory: fakeCategory,
			fakeCallback: fakeCallback,
			fakeThenCallback: fakeThenCallback,
			mock: mock
		}

		function mock() {
			spyOn(restService, 'requestWithPromise').and.returnValue(fakeThenCallback);		
		}
	}

})();	
