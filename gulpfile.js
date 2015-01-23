/**
 * Created by Deathnerd on 1/23/2015.
 */
var gulp = require('gulp');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var replace = require('gulp-replace');

gulp.task('usemin', function(){
    gulp.src(['./src/template.html'])
        .pipe(usemin({
            js:[uglify(), 'concat']
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js', function(){
    gulp.src(['src/story_js/cookie.js',
            'src/story_js/utils.js',
            'src/story_js/story.js',
            'src/story_js/js.class/js.class.js'])
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
});

gulp.task('closure', function(){
   gulp.src('')
       .pipe(shell([
           'ccjs dist/story.concat.js > dist/story.min.js'
       ]));
});

gulp.task('default', function(){
    gulp.run('usemin');
    gulp.run('closure');
});