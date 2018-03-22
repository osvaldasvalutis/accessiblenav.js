'use strict'

const gulp = require('gulp')
const rename = require('gulp-rename')
const clean = require('gulp-clean')
const sequence = require('gulp-sequence')
const eslint = require('gulp-eslint')
const uglify = require('gulp-uglify')
const browserify = require('gulp-browserify')
const babelify = require('babelify')
const childProcess = require('child_process')

gulp.task('lint', () => {
  return gulp.src('./src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
})

gulp.task('compile', ['clean'], () => {
  return gulp.src('./src/**/*.js')
    .pipe(browserify({
      standalone: 'accessibleNav',
      transform: [
        babelify.configure({
          presets: ['es2015']
        })
      ]
    }))
    .pipe(gulp.dest('./dist'))
})

gulp.task('minify', ['compile'], () => {
  return gulp.src('./dist/**/*.js')
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', () => {
  return gulp.src('./dist/**/*.js')
    .pipe(clean())
})

gulp.task('watch', () => {
  gulp.watch('./src/**/*.js', ['lint', 'compile'])
})

gulp.task('server', () => {
  const cp = childProcess.spawn('node', ['./server.js'])

  cp.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  cp.stderr.on('data', function(data) {
    console.log(data.toString());
  });
})

gulp.task('build', ['lint', 'minify'])

gulp.task('default', ['watch', 'server'])
