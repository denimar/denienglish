(function() {
	'use strict';

	angular
		.module('item')
		.factory('itemMock', itemMock);

	function itemMock(restService)	{

		var fakeItem = {cdItem: 1, dsItem: '_Item-Testing', blFavorite: true, blFazerRevisao: true};
		var fakeCallback = {
			data: {
				data: [fakeItem]
			}		
		};
		var fakeThenCallback = {
			then: function(callbackFn) {
				callbackFn(fakeCallback);
			}
		};

		return {
			fakeItem: fakeItem,
			fakeCallback: fakeCallback,
			fakeThenCallback: fakeThenCallback,
			mock: mock
		}

		function mock() {
			spyOn(restService, 'requestWithPromise').and.returnValue(fakeThenCallback);		
			spyOn(restService, 'requestWithPromisePayLoad').and.returnValue(fakeThenCallback);				
		}
	}

})();	
