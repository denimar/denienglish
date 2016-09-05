'use strict';

angular.module('app', [
	'ngRoute',
	'TextMdl',
	'VideoMdl',
	'ngMaterial', 
	'ngResource',
	'ngMessages', 
	'ngSanitize', 
	'material.svgAssetsCache', 
	'ui-deni-grid',
	'uiDeniModalMdl',

	'categoryMdl',
	'routinesMdl',

	"com.2fdevs.videogular",
	"com.2fdevs.videogular.plugins.controls",
	"info.vietnamcode.nampnq.videogular.plugins.youtube",
	//"com.2fdevs.videogular.plugins.overlayplay",
	//"com.2fdevs.videogular.plugins.poster",
	//"com.2fdevs.videogular.plugins.buffering",	
	
	'summernote',
	'ngFileUpload'
]);

angular.module('app').config(function($compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|javascript):/);
});