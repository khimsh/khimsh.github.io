// Load Gulp...of course
const { src, dest, task, watch, series, parallel } = require('gulp');

// CSS related plugins
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');

// JS related plugins
const uglify = require('gulp-uglify');
const babelify = require('babelify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const stripDebug = require('gulp-strip-debug');

// Utility plugins
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const notify = require('gulp-notify');
const plumber = require('gulp-plumber');
const options = require('gulp-options');
const gulpif = require('gulp-if');

// Browers related plugins
const browserSync = require('browser-sync').create();

// Project related variables
const styleSRC = './assets/scss/main.scss';
const styleURL = './assets/css/';
const mapURL = './';

const jsSRC = './assets/js/';
const jsFront = 'script.js';
const jsFiles = [jsFront];
const jsURL = './assets/';

const htmlSRC = './*.html';
const htmlURL = './';

const styleWatch = './assets/scss/**/*.scss';
const jsWatch = './assets/js/**/*.js';
const htmlWatch = './*.html';

// Tasks
function browser_sync() {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

function css(done) {
  src([styleSRC])
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        errLogToConsole: true,
        outputStyle: 'compressed'
      })
    )
    .on('error', console.error.bind(console))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', '> 5%', 'Firefox ESR']
      })
    )
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write(mapURL))
    .pipe(dest(styleURL))
    .pipe(browserSync.stream());
  done();
}

function js(done) {
  jsFiles.map(function(entry) {
    return browserify({
      entries: [jsSRC + entry]
    })
      .transform(babelify, { presets: ['@babel/preset-env'] })
      .bundle()
      .pipe(source(entry))
      .pipe(
        rename({
          extname: '.min.js'
        })
      )
      .pipe(buffer())
      .pipe(gulpif(options.has('production'), stripDebug()))
      .pipe(sourcemaps.init({ loadMaps: true }))
      .pipe(uglify())
      .pipe(sourcemaps.write('.'))
      .pipe(dest(jsURL))
      .pipe(browserSync.stream());
  });
  done();
}

function triggerPlumber(src_file, dest_file) {
  return src(src_file)
    .pipe(plumber())
    .pipe(dest(dest_file));
}

// function html() {
//   return triggerPlumber(htmlSRC, htmlURL);
// }

function watch_files() {
  watch(styleWatch, series(css, reload));
  watch(jsWatch, series(js, reload));
  watch(htmlWatch, reload);
  src(jsURL + 'script.min.js').pipe(
    notify({ message: 'Gulp is Watching, Happy Coding!' })
  );
}

task('css', css);
task('js', js);
// task('html', html);
task('default', parallel(css, js));
task('watch', parallel(browser_sync, watch_files));
