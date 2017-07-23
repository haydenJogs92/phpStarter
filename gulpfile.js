var gulp = require('gulp'),
    gutil = require('gulp-util'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    watch = require('gulp-watch'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    connect = require('gulp-connect'),
    minifyCSS = require('gulp-clean-css'),    
    connect  = require('gulp-connect-php'),
    browserSync = require('browser-sync');

    var server = new connect();



var cssSources = ['css/*.css', '!css/*.min.css'],
    minCSS = ['css/*.min.css'],
    jsSources = ['js/*.js', '!js/*.min.js'],
    minJS = ['js/*.min.js'],
    phpSources = ['**/**/*.php'];



gulp.task('log', function() {
  gutil.log('== My Log Task ==')
});





/*
Run This To Launch Server
 */
gulp.task('connect-sync', function() {
  connect.server({}, function (){
    browserSync({
      proxy: '127.0.0.1:8000'
    });
  });

  //watch for changes in cssSources
  gulp.watch(cssSources, [ 'reloadCSS']);
  //watch for changes in JSSources
  gulp.watch(jsSources, [ 'reloadJS' ] );
  //watch for changes in phpSources
  gulp.watch(phpSources, function(){
    browserSync.reload();
  })

});


gulp.task('disconnect', function() {
    connect.closeServer();
});

/*
Reload the site when css files changes,
requires cssMinify to run before reload happens
 */
gulp.task('reloadCSS', ['cssMinify'], function(){
   browserSync.reload();
});


/*
Reload the site when js files change,
requires minifyJS to run before reload happens
 */
gulp.task('reloadJS', ['minifyJS'], function(){
   browserSync.reload();
});


/*
Minify JS files
minifyJS doesn't go until cleanJS is complete - a task dependency
http://schickling.me/synchronous-tasks-gulp/
*/
gulp.task('minifyJS', ['cleanJS'], function() {
    return gulp.src(jsSources)
    .pipe(uglify())
    .pipe(rename({
         suffix: '.min'
     }))
    .pipe(gulp.dest('js/'));
});

/*
Minify .js Files
*/
gulp.task('cssMinify', ['cleanCSS'], function() {
      return gulp.src(cssSources)
      .pipe(minifyCSS())
      .pipe(rename({
           suffix: '.min'
       }))
      .pipe(gulp.dest('css/'));
});


/*
Delete min.js Files
*/
gulp.task('cleanJS', function() {
  return gulp.src(minJS)
        .pipe(clean());
});


/*
Delete min.css Files
*/
gulp.task('cleanCSS', function() {
  return gulp.src(minCSS)
        .pipe(clean());
});




gulp.task('default', ['connect-sync']);
