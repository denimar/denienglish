var gulp = require('gulp');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var path = require('path');

module.exports = function() {

    gulp.src([
<<<<<<< HEAD
    		'./src/ui-deni-grid.scss'
=======
    		'../src/ui-deni-grid.scss'
>>>>>>> 9244bb73336a346f2fbab0945090b9d548480cb0
    	])
    	.pipe(sass().on("error", function(error) {
			var pos = error.file.lastIndexOf('/');
			var file = error.file.substr(pos + 1);
			var message = error.messageFormatted;

			notify({
				title: file,
				message: 'line ' + error.line + ', column ' + error.column + ': ' + error.messageOriginal,
		        sound: 'Frog',
				icon: path.join(__dirname, 'error.png')
			}).write({});
		}))
		
        .pipe(gulp.dest(process.env.DIST_FOLDER))        
        .pipe(rename('ui-deni-grid.min.css'))
        .pipe(gulp.dest(process.env.DIST_FOLDER))
		.pipe((notify({
	        title: 'Sass successfully!',
	        message: 'file: <%= file.relative %>',
			icon: path.join(__dirname, 'successfully.png')
		})))
        .pipe(livereload());	

}