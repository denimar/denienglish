(function() {
	'use strict';

	angular
		.module('mock', [])
		.factory('appMock', appMock);

	function appMock(uiDeniModalSrv)	{

		return {
			uiDeniModalSrv: {
				createWindow: mockUiDeniModalSrvCreateWindow, 
				prompt: mockUiDeniModalSrvPrompt,
				createWindowDescriptionMoreImage: mockUiDeniModalSrvCreateWindowDescriptionMoreImage 	
			}
		}

		////

		function mockUiDeniModalSrvCreateWindow() {
			spyOn(uiDeniModalSrv, 'createWindow').and.returnValue({
				show: function() {
					return {
						then: function(callbackFn){
							callbackFn({
								'button': 'ok'
							});
						}
					}	
				}	
			});
		}

		function mockUiDeniModalSrvPrompt(textReturn) {
			spyOn(uiDeniModalSrv, 'prompt').and.returnValue({
				then: function(callbackFn){
					callbackFn(textReturn);
				}
			});		
		}

		function mockUiDeniModalSrvCreateWindowDescriptionMoreImage() {
			spyOn(uiDeniModalSrv, 'createWindowDescriptionMoreImage').and.returnValue({
				show: function() {
					return {
						then: function(callbackFn){
							callbackFn({
								'button': 'ok',
								'data': {
									'imageEl': {
										get: function(fakeNr) {
											return 0;
										}
									}
								}
							});
						}
					}	
				}	
			});
		}

	}

})();	
