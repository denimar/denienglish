// Karma configuration
// Generated on Mon Sep 05 2016 13:58:11 GMT-0300 (Hora oficial do Brasil)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'src/assets/bower_components/jquery/dist/jquery.min.js',
      'src/assets/bower_components/angular/angular.min.js',
      'src/assets/bower_components/angular-mocks/angular-mocks.js',

      /*
      'src/assets/bower_components/angular-route/angular-route.min.js',  
      'src/assets/bower_components/angular-resource/angular-resource.min.js',    
      'src/assets/bower_components/angular-aria/angular-aria.min.js',
      'src/assets/bower_components/angular-animate/angular-animate.min.js',
      'src/assets/bower_components/angular-sanitize/angular-sanitize.min.js',        
      'src/assets/bower_components/angular-messages/angular-messages.min.js',
      'src/assets/bower_components/svg-assets-cache/svg-assets-cache.js',    
      'src/assets/bower_components/angular-material/angular-material.min.js',
      
      'src/assets/bower_components/jstree/dist/jstree.js',   

      'src/assets/bower_components/ui-deni-grid/dist/ui-deni-grid.js',        
      'src/assets/bower_components/ui-deni-modal/dist/ui-deni-modal.js',          


      'src/assets/bower_components/videogular/videogular.min.js',
      'src/assets/bower_components/videogular-controls/vg-controls.js',    
      'src/assets/bower_components/videogular-youtube/youtube.js', 
      'src/assets/bower_components/ng-file-upload/ng-file-upload.min.js',

      'src/assets/bower_components/summernote/dist/summernote.min.js',
      'src/assets/bower_components/angular-summernote/dist/angular-summernote.min.js',
      */


      'dist/app.js',

      'src/app/shared/**/*test.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Firefox'], //to run in travis
    browsers: ['Chrome'], //to run in locally

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
