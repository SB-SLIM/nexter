const gulp = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const rename = require("gulp-rename");

const AUTOPREFIXER_BROWSERS = [
  "ie >= 10",
  "ie_mob >= 10",
  "ff >= 30",
  "chrome >= 34",
  "safari >= 7",
  "opera >= 23",
  "ios >= 7",
  "android >= 4.4",
  "bb >= 10",
];

function buildStyles() {
  return gulp
    .src("./sass/main.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(concat("style.css"))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest("./css"))
    .pipe(browserSync.stream());
}

exports.watch = function () {
  browserSync.init({ server: { baseDir: "./" } });

  gulp.watch("./sass/**/*.scss", gulp.series("buildStyles"));
  gulp.watch("./*.html").on("change", browserSync.reload);
};

// CONCAT *.CSS and PREFIX
exports.concat = () =>
  gulp
    .src("./css/style.css")
    .pipe(sourcemaps.init())
    .pipe(concat("style.concat.css"))
    .pipe(autoprefixer()) // FIXME: { browsers: ["last 10 versions"] }
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./css"));

// UGLEFY
exports.buildCSS = () =>
  gulp
    .src("./css/style.concat.css")
    .pipe(sourcemaps.init())
    .pipe(postcss([cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("dist/css"));

exports.buildStyles = buildStyles;
