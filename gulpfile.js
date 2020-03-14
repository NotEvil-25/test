'use strict';

const gulp = require('gulp'),
      browserSync = require('browser-sync').create(),
      pug = require('gulp-pug'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      csso = require('gulp-csso'),
      del = require('del'),
      imagemin = require('gulp-imagemin');

gulp.task('pug', function(){
  return gulp.src('src/pug/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('build/'));
});

gulp.task('style', function () {
  return gulp.src(['src/scss/*.scss', 'src/scss/helpers/normalize.scss'])
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(csso({}))
        .pipe(gulp.dest('build/css/'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  return gulp.src('src/js/*js')
        .pipe(gulp.dest('build/js/'))
});

gulp.task('static', function(){
  return gulp.src('src/static/**')
        .pipe(imagemin([
          imagemin.gifsicle({interlaced: true}),
          imagemin.mozjpeg({quality: 80, progressive: true}),
          imagemin.optipng({optimizationLevel: 7, interlaced: true}),
          imagemin.svgo({
            plugins: [
              {removeViewBox: true},
              {cleanupIDs: false}
            ]
          })
        ]))
        .pipe(gulp.dest('build/static/'))
});

gulp.task('del', function () {
  return del('build');
});

gulp.task('watch', function(){

  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(['src/pug/*.pug', 'src/pug/**/*.pug'], gulp.series('pug'))
      .on('change', browserSync.reload);

  gulp.watch('src/scss/**/*.scss', gulp.series('style'))
      .on('change', browserSync.reload);

  gulp.watch('src/js/*js', gulp.series('scripts'))
      .on('change', browserSync.reload);

  gulp.watch('src/static/**', gulp.series('static'))
      .on('change', browserSync.reload);
});

gulp.task('default', gulp.series('del',
    gulp.parallel(
        'static', 'pug',
        'style', 'scripts'
    ),
    'watch'
));