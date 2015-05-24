var gulp = require('gulp');
var $ = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});
// var nodeInspector = require('gulp-node-inspector');

gulp.task('inspector', function() {
  console.log('[info] Visit http://localhost:8080/debug?port=5858 to start debugging.')
  return gulp.src([])
  .pipe($.nodeInspector({
    preload: false,
  }));
});

gulp.task('server', function () {
  $.nodemon({
    script: './server',
    watch: 'server',
    nodeArgs: ['--debug']
  })
});

gulp.task('default', ['server', 'inspector']);