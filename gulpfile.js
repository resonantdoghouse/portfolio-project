/*eslint-env node */

const gulp = require("gulp");
const data = require("gulp-data");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const browserSync = require("browser-sync").create();

const jasmine = require('gulp-jasmine');
const eslint = require('gulp-eslint');

const pug = require("gulp-pug");
const fs = require("fs");

const $ = require("gulp-load-plugins")();

gulp.task("debug", done => {
  console.log("debug task");
  done();
});

gulp.task('tests', gulp.series(function jasmineTests(){
    return gulp.src('spec/tests.js')
        .pipe(jasmine())
      }
));

gulp.task(
  "pug",
  gulp.series(function buildHTML() {
    return gulp
      .src("*.pug")
      .pipe(
        data(function(file) {
          return JSON.parse(fs.readFileSync("./project.json"));
        })
      )
      .pipe(
        pug({
          pretty: true
        })
      )
      .pipe(gulp.dest("./"));
  })
);

gulp.task(
  "images",
  gulp.series(function processImages() {
    return gulp
      .src("img/*{jpg,png}")
      .pipe(
        $.responsive(
          {
            "*.jpg": [
              {
                width: 300,
                rename: {
                  suffix: "-small",
                  extname: ".jpg"
                },
                format: "jpeg"
              },
              {
                width: 600,
                rename: {
                  suffix: "-small-@2x",
                  extname: ".jpg"
                }
              },
              {
                width: 550,
                rename: {
                  suffix: "-medium",
                  extname: ".jpg"
                },
                format: "jpeg"
              },
              {
                width: 1150,
                rename: {
                  suffix: "-medium-@2x",
                  extname: ".jpg"
                }
              },
              {
                width: 1170,
                rename: {
                  suffix: "-large",
                  extname: ".jpg"
                },
                withoutEnlargement: true
              },
              {
                width: 2340,
                rename: {
                  suffix: "-large-@2x",
                  extname: ".jpg"
                },
                withoutEnlargement: true
              },
              {
                // Convert images to the webp format
                width: 630,
                rename: {
                  suffix: "-630px",
                  extname: ".webp"
                }
              }
            ]
          },
          {
            // Global configuration for all images output quality
            quality: 80,
            // Use progressive (interlace) scan for JPEG and PNG output
            progressive: true,
            // Strip all metadata
            withMetadata: false,
            errorOnEnlargement: false
          }
        )
      )
      .pipe(gulp.dest("img/bin"));
  })
);

gulp.task(
  "styles",
  gulp.series(function processStyles() {
    return gulp
      .src("sass/**/*.scss")
      .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
      .pipe(
        autoprefixer({
          browsers: ["last 2 versions"]
        })
      )
      .pipe(gulp.dest("./css"))
      .pipe(browserSync.stream());
  })
);

gulp.task('lint', gulp.series(function linter() {
  return gulp.src(['js/**/*.js', '!js/min/*.js'])
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
}));

gulp.task(
  "default",
  gulp.series(["debug", "pug", "styles"], function browserSyncWatch() {
    // gulp.watch('sass/**/*.scss', ['styles']);
    gulp.watch("*.pug", gulp.series(["pug"])).on("change", browserSync.reload);
    //gulp.watch('js/**/*.js', ['lint']);
    browserSync.init({
      server: "./"
    });
  })
);
