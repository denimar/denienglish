process.env.DIST_FOLDER = './dist';

//third-party modules
var gulp = require('gulp');

//own modules
var sass = require('./gulp/sass');
var html = require('./gulp/html');
var scripts = require('./gulp/scripts');
var dist = require('./gulp/dist');
var serve = require('./gulp/serve');
var watch = require('./gulp/watch');

//Taks which are part of the "dist" task
gulp.task('sass', sass);	
gulp.task('html', html);	
gulp.task('scripts', scripts);	
gulp.task('dist', dist);

//Serve the application
gulp.task('serve', serve);	

//Watch for changes in: sass, html, scripts and images
gulp.task('watch', watch);	

// Default Task
gulp.task('default', ['dist', 'serve', 'watch']);