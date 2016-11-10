var gulp = require('gulp');
var webserver = require('gulp-webserver');

module.exports = function() {

	gulp.src(['./', process.env.DIST_FOLDER])
		.pipe(webserver({
			//livereload: true,
			//directoryListing: true,
			//fallback: 'index.html',
			open: true,
			port: 3000,
			//open: 'http://localhost:3000/ui-deni-grid'
	    }));

}