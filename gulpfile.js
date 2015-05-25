var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var $ = require("gulp-load-plugins")({
  pattern: ['gulp-*', 'gulp.*'],
  replaceString: /\bgulp[\-.]/
});

gulp.task('sass', function () {
  return gulp.src(__dirname + '/client/styles/main.scss')
    .pipe($.sass().on('error', $.sass.logError))
    .pipe(gulp.dest(__dirname + '/client/css'))
});

gulp.task('sass:watch', function () {
  gulp.watch(__dirname + '/client/styles/main.scss', ['sass']);
});

gulp.task('browserSync', function () {
  return browserSync.init({
    notify: false,
    port: 4005,
    ui: false,
    proxy: 'localhost:4000'
  });
})

gulp.task('public:watch', function () {
  gulp.watch([
    __dirname + '/client/**/*.js'
  ]).on('change', reload);

  gulp.watch([
    __dirname + '/client/**/*.css'
  ]).on('change', reload);

  gulp.watch([
    __dirname + '/client/**/*.html'
  ]).on('change', reload);
})

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

gulp.task('default', ['sass', 'sass:watch', 'public:watch', 'browserSync', 'server', 'inspector']);