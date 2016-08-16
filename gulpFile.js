var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var addsrc = require('gulp-add-src');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var browserSync = require('browser-sync').create();
var livereload = require('gulp-livereload');

// Script Task
// Uglifies
gulp.task('scripts', function() {

  /*****************************************************************************
    Add the files - Add in order *mdl.js > *fltr.js > *cnst.js > *val.js > *srv.js > *drv.js > *ctrl.js > *mock.js > *test.js
  
	Legend:
	
		*mdl.js   - Modules
		*fltr.js  - Filters
		*cnst.js  - Constants
		*enum.js  - Enumerations
		*val.js   - Values
		*srv.js   - Services
		*cfg.js   - Config (Route)
		*drv.js   - Directives
		*ctrl.js  - Controllers
		*mock.js  - Mocks
		*test.js  -	Tests
    
  *****************************************************************************/ 
  gulp.src('')

  	//MODULES AT FIRST
	.pipe(addsrc.append('src/app/shared/**/*mdl.js'))  
	.pipe(addsrc.append('src/app/components/**/*mdl.js'))  	
	.pipe(addsrc.append('src/app/app.mdl.js'))

	//SHARED FOLDER
	.pipe(addsrc.append('src/app/shared/**/*fltr.js'))  	
	.pipe(addsrc.append('src/app/shared/**/*cnst.js'))  		
	.pipe(addsrc.append('src/app/shared/**/*enum.js'))  			
	.pipe(addsrc.append('src/app/shared/**/*val.js'))  		
	.pipe(addsrc.append('src/app/shared/**/*srv.js'))  		
	.pipe(addsrc.append('src/app/shared/**/*ctrl.js'))  		
	.pipe(addsrc.append('src/app/shared/**/*drv.js'))  			
	.pipe(addsrc.append('src/app/shared/**/*mock.js'))  		
	.pipe(addsrc.append('src/app/shared/**/*test.js'))  			
  
	//COMPONENTS FOLDER
	.pipe(addsrc.append('src/app/components/**/*fltr.js'))  	
	.pipe(addsrc.append('src/app/components/**/*cnst.js'))  	
	.pipe(addsrc.append('src/app/components/**/*enum.js'))  			
	.pipe(addsrc.append('src/app/components/**/*val.js'))  		
	.pipe(addsrc.append('src/app/components/**/*srv.js'))  		
	.pipe(addsrc.append('src/app/components/**/*ctrl.js'))  		
	.pipe(addsrc.append('src/app/components/**/*drv.js'))  		
	.pipe(addsrc.append('src/app/components/**/*mock.js'))  		
	.pipe(addsrc.append('src/app/components/**/*test.js'))  			

	//REST FOLDER
	.pipe(addsrc.append('src/app/rest/*srv.js'))  	

	
	//APP FOLDER
	.pipe(addsrc.append('src/app/app.cnst.js'))
	.pipe(addsrc.append('src/app/app.enum.js')) 
	.pipe(addsrc.append('src/app/app.cfg.js')) 
	.pipe(addsrc.append('src/app/app.srv.js')) 		
	.pipe(addsrc.append('src/app/app.ctrl.js'))

  // Concatenate all files into a one
  .pipe(concat('dist/app.js'))

  // Throw above file into a dist folder
  .pipe(gulp.dest('./'))

  // Compress that file
  .pipe(rename('dist/app.min.js'))

  // If eventually happened some error...
  .pipe(uglify().on('error', gulpUtil.log)) // notice the error event here

  // Throw the compressed file into a dist folder
  .pipe(gulp.dest('./'))

  .pipe(livereload());  
});

//Sass task
gulp.task('sass', function () {
    gulp.src(['src/app/app.scss', 'src/app/components/**/*.scss', 'src/app/shared/**/*.scss'])
        .pipe(concat('app.scss'))
        .pipe(sass().on('error', sass.logError))
        .pipe(rename('app.css'))        
        .pipe(gulp.dest('dist'))        
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(rename('app.min.css'))
        .pipe(gulp.dest('dist'))
        .pipe(livereload());
});

// Static Server + watching scss/html files
gulp.task('server', function() {
    browserSync.init({server: {baseDir: "./"}});
    //browserSync.init();
});

gulp.task('watch', function () {
	gulp.watch(['src/app/**/*.scss'], ['sass']);
  	gulp.watch(['src/app/*.js', 'src/app/**/*.js'], ['scripts']);  

  	// Create LiveReload server
	livereload.listen({ 
		basePath: 'dist' 
	});

});

// Default Task
gulp.task('default', ['sass', 'scripts', 'server', 'watch']);