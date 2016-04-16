var coffee, data, fs, gulp, jade, minifyHTML, pages, path, sass, stylus, yaml;

gulp = require('gulp');

coffee = require('gulp-coffee');

jade = require('gulp-jade');

stylus = require('gulp-stylus');

yaml = require('gulp-yaml');

sass = require('gulp-sass');

minifyHTML = require('gulp-minify-html');

pages = require('gulp-gh-pages');

data = require('gulp-data');

path = require('path');

fs = require('fs');

gulp.task('default', ['coffee', 'jade', 'styl', 'yaml']);

gulp.task('watch', function() {
  return gulp.watch('./src/**', ['default']);
});

gulp.task('gulpfile', function() {
  return gulp.src('./gulpfile.coffee').pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./'));
});

gulp.task('jade', function() {
  return gulp.src(['./src/**/*.jade', '!./src/_*/**/*.jade']).pipe(data(function(file, cb) {
    var fname;
    fname = path.join(path.dirname(file.path), (path.basename(file.path, path.extname(file.path))) + '.json');
    console.log(fname);
    return fs.access(fname, fs.F_OK, function(err) {
      var fdata;
      if (!err) {
        console.log(fname + ' ... success!');
        fdata = require(fname);
        return cb(void 0, fdata);
      } else {
        console.log(fname + ' ... failure.');
        return cb(void 0, {});
      }
    });
  })).pipe(jade({
    pretty: true
  })).pipe(minifyHTML({})).pipe(gulp.dest('./build'));
});

gulp.task('coffee', function() {
  return gulp.src('./src/**/*.coffee').pipe(coffee({
    bare: true
  })).pipe(gulp.dest('./build'));
});

gulp.task('styl', function() {
  return gulp.src('./src/**/*.styl').pipe(stylus({})).pipe(gulp.dest('./build'));
});

gulp.task('yaml', function() {
  return gulp.src('./src/**/*.yml').pipe(yaml({
    space: 4
  })).pipe(gulp.dest('./build'));
});

gulp.task('inuit', function() {
  return gulp.src('./inuit.css-web-template/css/style.scss').pipe(sass({})).on('error', sass.logError).pipe(gulp.dest('./build'));
});

gulp.task('pages', function() {
  return gulp.src('./build/**/*').pipe(pages({
    branch: 'master'
  }));
});
