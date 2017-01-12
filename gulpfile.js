'use strict';

var gulp = require('gulp');
var apidoc = require('gulp-apidocjs');
var nodemon = require('gulp-nodemon');

gulp.task('doc', function(cb) {
  apidoc.exec({ src: "lib/", dest: "docs/" }, cb);
});

// run index.js, monitor js files for changes and restart server if necessary.
gulp.task('nodemon', function(){
  nodemon({ script: 'index.js', ext: 'js' });
});
