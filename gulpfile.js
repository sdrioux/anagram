var gulp = require('gulp');
var apidoc = require('gulp-apidocjs');

gulp.task('doc', function(cb) {
  apidoc.exec({ src: "lib/", dest: "docs/" }, cb);
});
