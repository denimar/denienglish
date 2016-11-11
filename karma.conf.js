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
      'src/assets/bower_components/angular-resource/angular-resource.min.js',

      'src/assets/bower_components/ui-deni-modal/dist/ui-deni-modal.js',

      'dist/app.js',

      'src/app/components/**/*spec.js',
      'src/app/shared/**/*spec.js'
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
    reporters: ['kjhtml'],
	/*
    reporters: ['progress', 'html'],

    // the default configuration
    htmlReporter: {
      outputDir: 'karma_html', // where to put the reports 
      templatePath: null, // set if you moved jasmine_template.html
      focusOnFailures: true, // reports show failures on start
      namedFiles: false, // name files instead of creating sub-directories
      pageTitle: null, // page title for reports; browser info by default
      urlFriendlyName: false, // simply replaces spaces with _ for files/dirs
      reportName: 'report-summary-filename', // report summary filename; browser info by default


      // experimental
      preserveDescribeNesting: false, // folded suites stay folded 
      foldAll: false, // reports start folded (only with preserveDescribeNesting)
    },

    // add to plugins
    plugins: [
      // other plugins
      'karma-html-reporter'
    ],
	*/
	
    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


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
