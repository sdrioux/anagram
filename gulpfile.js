'use strict';

var gulp = require('gulp');
var apidoc = require('gulp-apidocjs');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
// code coverage tool
var istanbul = require('gulp-istanbul');

gulp.task('doc', function(cb) {
  apidoc.exec({ src: "lib/", dest: "docs/" }, cb);
});

// run index.js, monitor js files for changes and restart server if necessary.
gulp.task('start', function(){
  nodemon({ script: 'index.js', ext: 'js'});
});

// start server using local version of dynamo db.
gulp.task('start-test', function() {
  nodemon({ script: 'index.js', ext: 'js', env: { 'NODE_ENV': 'test'}})
});

gulp.task('test-coverage', function() {
  process.env.NODE_ENV = "test";
  return gulp.src('lib/dictionary.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['test-coverage'], function() {
  process.env.NODE_ENV = "test";
  return gulp.src('lib/**/*.spec.js')
    .pipe(mocha())
    .pipe(istanbul.writeReports(
      {
        dir: './coverage',
        reporters: ['html','lcov']
      }
    ))
    .on('error', function(error) {
      console.log(error);
    })
    .on('end', function() {
      process.exit();
    });
});

gulp.task('default', ['start']);
