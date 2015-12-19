var gulp = require('gulp');

var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var merge = require('gulp-merge');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');

var del = require('del');

var tsProject = ts.createProject('tsconfig.json');

var PATH = {
  src: {
    html: 'src/**/*.html',
    ts: [
      'src/third-party/**/*.js',
      'src/blog/app.ts',
      'src/blog/*/**/*.ts'
    ],
    sass: [
      'src/**/*.css',
      'src/**/*.scss'
    ],
    libs: {
      js: [
        './bower_components/traceur-runtime/traceur-runtime.js',
        './node_modules/systemjs/dist/system.js',
        './src/systemjs-config.js',
        './node_modules/angular2/bundles/angular2.js',
        './node_modules/angular2/bundles/router.js'
      ],
      css: [

      ]
    },
    assets: [
      'src/assets/**/*'
    ],
    typing: [
      './node_modules/**/*.d.ts'
    ]
  },
  dest: {
    html: './public',
    ts: './public',
    libs: './public/libs',
    sass: './public/style',
    assets: './public/assets',
    typing: './typings'
  }
};

gulp.task('html', function() {
  return gulp.src(PATH.src.html)
    .pipe(gulp.dest(PATH.dest.html));
});

gulp.task('style', function() {
  return gulp.src(PATH.src.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('all.css'))
    .pipe(gulp.dest(PATH.dest.sass));
});

gulp.task('script', function() {
  return gulp.src(PATH.src.ts)
    .pipe(sourcemaps.init())
    .pipe(ts(tsProject))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(PATH.dest.ts));

});


gulp.task('libs', function() {
  var libsJS = gulp.src(PATH.src.libs.js)
    .pipe(sourcemaps.init())
    .pipe(concat('libs.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'));
  var libsCSS = gulp.src(PATH.src.libs.css)
    .pipe(concat('libs.css'));

  return merge([
      libsJS,
      libsCSS
    ])
    .pipe(gulp.dest(PATH.dest.libs));
});

gulp.task('assets', function() {
  return gulp.src(PATH.src.assets)
    .pipe(gulp.dest(PATH.dest.assets));
});

gulp.task('typing', function() {
  return gulp.src(PATH.src.typing)
    .pipe(gulp.dest(PATH.dest.typing));
});

var watch = function() {
  gulp.watch(PATH.src.html, ['html']);
  gulp.watch(PATH.src.sass, ['style']);
  gulp.watch(PATH.src.ts, ['script']);
  gulp.watch(PATH.src.assets, ['assets']);
};

gulp.task('watch', watch);

gulp.task('serve', function() {
  var http = require('http');
  var connect = require('connect');
  var serveStatic = require('serve-static');
  var open = require('open');

  var port = 9000;
  var app;

  watch();

  app = connect().use(serveStatic(__dirname + '/public'));
  http.createServer(app).listen(port, function() {
    open('http://localhost:' + port);
  });
});

gulp.task('clean', function() {
  return del([
    PATH.dest.html,
    PATH.dest.ts,
    PATH.dest.sass,
    PATH.dest.assets
  ]);
});

gulp.task('default', ['html', 'assets', 'style', 'script']);

gulp.task('play', ['default', 'serve']);
