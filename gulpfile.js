'use strict';

/**
 * Import plugins
 */
var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    runSequence = require('run-sequence'),
    argv = require('yargs').argv,
    del = require('del');

/**
 * Build vendors dependencies
 */
gulp.task('vendors', function() {

  /**
   * CSS VENDORS
   */
  gulp.src([
        ''
      ])
      .pipe($.concat('vendors.css'))
      .pipe($.minifyCss())
      .pipe(gulp.dest('public/build/css'));

  /**
   * JS VENDORS
   * (with jQuery and Bootstrap dependencies first)
   */

  gulp.src([
      'public/bower_components/angular/angular.js',
      'public/bower_components/angular-ui-router/release/angular-ui-router.js'
    ])
    .pipe($.concat('vendors.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('public/build/js'));


  /**
   * FONTS SOURCES
   * Important to add the bootstrap fonts to avoid issues with the fonts include path
   */
  gulp.src([
      'public/bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
      'public/assets/fonts/*'
    ])
    .pipe(gulp.dest('public/build/fonts'));

  /**
   * POLYFILLS SOURCES
   * Various polyfills required for old IE
   */
  gulp.src([
      'public/bower_components/html5shiv/dist/html5shiv.js',
      'public/bower_components/respond/dest/respond.src.js'
    ])
    .pipe($.concat('polyfills.min.js'))
    .pipe($.uglify())
    .pipe(gulp.dest('public/build/js'));
});

/**
 * Copy images
 */
gulp.task('img', function() {
  gulp.src([
      'public/assets/img/**/*'
    ])
    .pipe(gulp.dest('public/build/img'));
});

/**
 * Build styles from SCSS files
 * With error reporting on compiling (so that there's no crash)
 */
gulp.task('styles', function() {
  if (argv.production) { console.log('[styles] Processing styles for production env.' ); }
  else { console.log('[styles] Processing styles for dev env. No minifying here, for sourcemaps!') }

  return gulp.src('public/assets/sass/main.scss')
    .pipe($.sass({errLogToConsole: true}))
    .pipe($.if(!argv.production, $.sourcemaps.init()))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'ff 27', 'opera 12.1']
    }))
    .pipe($.if(!argv.production, $.sourcemaps.write()))
    .pipe($.if(argv.production, $.minifyCss()))
    .pipe(gulp.dest('public/build/css'));
});

/**
 * Build styles from SCSS files
 * Only for STYLEGUIDE styles
 */
gulp.task('styleguide-styles', function() {
  return gulp.src('public/assets/sass/styleguide.scss')
    .pipe($.sass({errLogToConsole: true}))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'ff 27', 'opera 12.1']
    }))
    .pipe($.minifyCss())
    .pipe(gulp.dest('public/build/css'));
});

/**
 * Build JS
 * With error reporting on compiling (so that there's no crash)
 * And jshint check to highlight errors as we go.
 */
gulp.task('scripts', function() {
  return gulp.src('public/assets/js/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe(gulp.dest('public/build/js'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.uglify())
    .pipe(gulp.dest('public/build/js'));
});

/**
 * Build Hologram Styleguide
 */
gulp.task('styleguide', function () {
  return gulp.src('hologram_config.yml')
    .pipe($.hologram());
});



/**
 * Clean output directories
 */
gulp.task('clean', del.bind(null, ['public/build', 'styleguide']));

/**
 * Serve
 */
gulp.task('serve', ['styles', 'scripts'], function () {
  browserSync({
    server: {
      baseDir: ['public'],
    },
    open: false
  });
  gulp.watch(['public/assets/sass/**/*.scss'], function() {
    runSequence('styles', 'styleguide', reload);
  });
  gulp.watch(['public/assets/img/**/*'], function() {
    runSequence('img', 'styleguide', reload);
  });
  gulp.watch(['public/assets/js/**/*.js'], function() {
    runSequence('scripts', reload);
  });
  
});

/**
 * Deploy to GH pages
 */

gulp.task('deploy', function () {
  gulp.src("styleguide/**/*")
    .pipe($.ghPages());
});

/**
 * Task to build assets on production server
 */
gulp.task('build',['clean'], function() {
    argv.production = true;
    runSequence('vendors', 'styles', 'img', 'scripts');
});

/**
 * Default task
 */
gulp.task('default', ['clean'], function(cb) {
  var styleguide_styles = argv.production ? '' : 'styleguide-styles';
  runSequence('vendors', 'styles', 'img', 'scripts', 'styleguide', styleguide_styles, cb);
});

