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

  //Add the files
  gulp.src('../src/ui-deni-modal.mdl.js')
  .pipe(addsrc.append('../src/ui-deni-modal.con.js'))
  .pipe(addsrc.append('../src/ui-deni-modal.srv.js'))
  .pipe(addsrc.append('../src/ui-deni-modal.ctl.js'))

  // Concatenate all files into a one
  .pipe(concat('ui-deni-modal.js'))

  // Throw above file into a dist folder
  .pipe(gulp.dest('../dist'))

  // Compress that file
  .pipe(rename('ui-deni-modal.min.js'))

  // If eventually happened some error...
  .pipe(uglify().on('error', gulpUtil.log)) // notice the error event here

  // Throw the compressed file into a dist folder
  .pipe(gulp.dest('../dist'))  
});


// Sass Task
gulp.task('sass', function () {
  gulp.src(['../src/ui-deni-modal.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../dist'))      
    .pipe(rename('ui-deni-modal.min.css'))   
    .pipe(uglifycss())
    .pipe(gulp.dest('../dist'));
});

// Watch scripts and sasss
gulp.task('scripts:sass:watch', function () {
gulp.watch(['../src/*.scss'], ['sass']);  
  gulp.watch(['../src/*.js'], ['scripts']);  
});

// Default Task
gulp.task('default', ['scripts:sass:watch']);
