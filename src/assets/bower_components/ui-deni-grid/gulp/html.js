var gulp = require('gulp');
var addsrc = require('gulp-add-src');
var del = require('del');
var notify = require('gulp-notify');
var path = require('path');
var livereload = require('gulp-livereload');

module.exports = function() {

	//Clean out dist/images folder	
	//del([process.env.DIST_FOLDER + '/index.html'], {force: true}).then(function() {

		//index.html
		gulp.src('./index.html')
			.pipe(gulp.dest(process.env.DIST_FOLDER))
			.pipe((notify({
		        title: 'HTMLs successfully!',
		       	icon: path.join(__dirname, 'successfully.png'),
		       	message: 'HTMLs copied!',
		       	onLast: true
			})))
			.pipe(livereload());

	//});

}