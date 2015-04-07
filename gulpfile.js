var gulp = require('gulp');
var gutil = require('gulp-util');
var nodemon = require('gulp-nodemon');
// var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var lrload = require('livereactload');


var isProd = process.env.NODE_ENV === 'production';

var bundler = browserify({
  entries: ['./src/app/client/app.jsx'],
  transform: isProd ? [babelify] : [babelify, lrload],
  debug: !isProd,
  cache: {},
  packageCache: {},
  fullPaths: true // for watchify
});


gulp.task('jswatch', function () {
  lrload.listen();
  var watcher = watchify(bundler);
  function rebundle() {
    gutil.log('Update JavaScript bundle');
    watcher
      .bundle()
      .on('error', gutil.log)
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(gulp.dest('static'))
      .pipe(lrload.gulpnotify());
  }

  rebundle();

  return watcher
    .on('error', gutil.log)
    .on('update', rebundle);

});

gulp.task('serverwatch', function () {
  nodemon({
    script: 'server/app.js',
    ext: 'js',
    ignore: ['gulpfile.js', 'static/bundle.js', 'node_modules/*']
  })
    .on('change', [])
    .on('restart', function () {
      console.log('Server restarted');
    });
});

gulp.task('watch', ['serverwatch', 'jswatch']);
