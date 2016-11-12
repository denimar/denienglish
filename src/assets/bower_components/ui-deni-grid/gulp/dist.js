var gulp = require('gulp');

module.exports = function(args) {

	//tasks inside the gulpFile.js
	gulp.start('sass', 'html', 'scripts');

}