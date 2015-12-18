var gulp = require('gulp');
var gulpConcat = require('gulp-concat');

gulp.task('compress', function() {
    console.info('Compressing scripts');
    var source = [
        'src/dugun-notifications.module.js',
        'src/dugun-notifications.service.js',
    ];

    return gulp.src(source)
        .pipe(gulpConcat('dugun-notifications.js'))
        .pipe(gulp.dest('dist/'));
});
