var gulp = require("gulp");
var del = require("del");
var sass = require("gulp-sass");
var purgecss = require("gulp-purgecss");
var replace = require("gulp-replace");
let cleanCSS = require("gulp-clean-css");
var rename = require("gulp-rename");

var paths = {
  styles: {
    src: ["./_sass/main.scss", "./node_modules/bulma/bulma.sass"],
    tmp: "assets/css/dist",
    dest: "_includes",
  },
  html: {
    src: ["_site/{about,blog}/*.html", "index.html"],
  },
};

function purificationDefault() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(
      purgecss({
        content: [
          "_includes/*.html",
          "_layouts/default.html",
          "./index.html",
          "_data/about/*.yml",
        ],
      })
    )
    .pipe(replace(/!important/gm, ""))
    .pipe(
      cleanCSS({ compatibility: "ie8" }, (details) => {
        console.log(
          `Minification of ${details.name}: ${details.stats.originalSize} -> ${details.stats.minifiedSize} b`
        );
      })
    )
    .pipe(rename({ suffix: "-min" }))
    .pipe(gulp.dest("./_includes/"));
}

function clean() {
  return del([paths.styles.tmp]);
}

var build = gulp.series(clean, purificationDefault, clean);

function watch() {
  gulp.watch(
    [
      "_layouts/**",
      "_includes/**.html",
      "_sass/*",
      "assets/css/*",
      "./index.html",
    ],
    build
  );
}

exports.clean = clean;
exports.build = build;
exports.watch = watch;

exports.default = build;
