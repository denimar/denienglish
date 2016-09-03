var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var addsrc = require('gulp-add-src');
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');

// Script Task
// Uglifies
gulp.task('scripts', function() {

  //////////////////////////////////////////////////////////////////////
  // Files which are part of the project
  // note: It was used "gulp-add-src" to put the files in order
  //////////////////////////////////////////////////////////////////////  
  gulp.src('../src/ui-deni-grid.mdl.js')

  //uiDeniGrid itself
  .pipe(addsrc.append('../src/ui-deni-grid.con.js'))      
  .pipe(addsrc.append('../src/ui-deni-grid.drv.js'))
  .pipe(addsrc.append('../src/ui-deni-grid-util.srv.js')) //Kind of Privates Methods, Variables, Constants...)    
  .pipe(addsrc.append('../src/ui-deni-grid.ctrl.js'))  
  .pipe(addsrc.append('../src/ui-deni-grid.srv.js'))    
  .pipe(addsrc.append('../src/ui-deni-grid.run.js'))      

  //////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////  
  //.pipe(addsrc.append('../util/routines.srv.js')) //General Routines

  // Concatenate all files into a one
  .pipe(concat('ui-deni-grid.js'))

  // Throw above file into a dist folder
  .pipe(gulp.dest('../dist'))

  // Compress that file
  .pipe(rename('../dist/ui-deni-grid.min.js'))

  // If eventually happened some error...
  .pipe(uglify().on('error', gulpUtil.log)) // notice the error event here

  // Throw the compressed file into a dist folder
  .pipe(gulp.dest('../dist'));
});

// Sass Task
gulp.task('sass', function () {
  gulp.src([
    '../src/ui-deni-grid.scss'
  ])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('ui-deni-grid.css'))           
    .pipe(gulp.dest('../dist'))
    .pipe(rename('ui-deni-grid.min.css'))   
    .pipe(uglifycss())
    .pipe(gulp.dest('../dist'));
});

// Watch scripts and sasss
gulp.task('scripts:sass:watch', function () {
  gulp.watch(['../src/**/*.scss'], ['sass']);
  gulp.watch(['../src/*.js', '../src/**/*.js'], ['scripts']);  
});

// Default Task
gulp.task('default', ['scripts:sass:watch']);
