/*eslint-env node */

const gulp = require('gulp');
const data = require('gulp-data');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
//const eslint = require('gulp-eslint');

const pug = require('gulp-pug');
const fs = require('fs');

const responsive = require('gulp-responsive');
const $ = require('gulp-load-plugins')();

gulp.task('default', ['styles', 'images', 'pug'], function() {
    gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch('*.pug', ['pug']);
    //gulp.watch('js/**/*.js', ['lint']);
    browserSync.init({
        server: './'
    });

});

gulp.task('pug', function buildHTML() {
  return gulp.src('*.pug')
  .pipe(data(function(file) {
    return JSON.parse(
      fs.readFileSync('./project.json')
    );
  } ))
  .pipe(pug({
    pretty: true
    // Your options in here.
  }))
  .pipe(gulp.dest(''));
});



gulp.task('images', function () {
  return gulp.src('img/*{jpg,png}')
    .pipe($.responsive({
      '*.jpg': [
      {
        width: 300,
        rename: {
          suffix: '-small',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 600,
        rename: {
          suffix: '-small-@2x',
          extname: '.jpg',
        },
        // format option can be omitted because
        // format of output image is detected from new filename
        // format: 'jpeg'
      },
      {
        width: 550,
        rename: {
          suffix: '-medium',
          extname: '.jpg',
        },
        format: 'jpeg',
      }, {
        width: 1150,
        rename: {
          suffix: '-medium-@2x',
          extname: '.jpg',
        },
      }, {
        width: 1170,
        rename: {
          suffix: '-large',
          extname: '.jpg',
        },
        /* Do not enlarge the output image if the input image are already less
        than the required dimensions. */
        withoutEnlargement: true,
      },
      {
        width: 2340,
        rename: {
          suffix: '-large-@2x',
          extname: '.jpg',
        },
        withoutEnlargement: true,
      },
      {
        // Convert images to the webp format
        width: 630,
        rename: {
          suffix: '-630px',
          extname: '.webp',
        },
      }],
    }, {
      // Global configuration for all images
      // The output quality for JPEG, WebP and TIFF output formats
      quality: 80,
      // Use progressive (interlace) scan for JPEG and PNG output
      progressive: true,
      // Strip all metadata
      withMetadata: false,
      // Do not emit the error when image is enlarged.
      errorOnEnlargement: false,
    }))
    .pipe(gulp.dest('img/bin'));
});




gulp.task('styles', function() {
    gulp.src('sass/**/*.scss')
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browserSync.stream());
});

// gulp.task('lint', function () {
//     return gulp.src(['js/**/*.js', '!js/min/*.js'])
//         // eslint() attaches the lint output to the eslint property
//         // of the file object so it can be used by other modules.
//         .pipe(eslint())
//         // eslint.format() outputs the lint results to the console.
//         // Alternatively use eslint.formatEach() (see Docs).
//         .pipe(eslint.format())
//         // To have the process exit with an error code (1) on
//         // lint error, return the stream and pipe to failOnError last.
//         .pipe(eslint.failOnError());
// });

// gulp.task('tests', function () {
//     gulp.src('tests/spec/extraSpec.js')
//         .pipe(jasmine({
//             integration: true,
//             vendor: 'js/**/*.js'
//         }));
// });
