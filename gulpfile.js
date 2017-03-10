var gulp = require('gulp'),
	gulpLoadPlugins = require('gulp-load-plugins'),
	runSequence = require('run-sequence'),
	del = require('del'),
	plugins = gulpLoadPlugins();


// Gulp plumber error handler
var onErrorCSS = function (err) {
		plugins.notify.onError({
			subtitle: "Error in CSS File",
			message: "<%= error.message %>"
		})(err);
		this.emit('end');
};

// Styles tasks
gulp.task('css', function () {
	return gulp.src(['*.scss', 'badexample/*.scss'])
		.pipe(plugins.plumber({
			errorHandler: onErrorCSS
		}))
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.sass({
			outputStyle: 'expanded',
			indentWidth: 4
		}))
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(plugins.sourcemaps.write('.'))
		.pipe(gulp.dest(function(file) {
			return file.base;
		}))
		.pipe(plugins.notify({
			message: 'Styles compiled'
		}));

});

gulp.task('css:clean', function (cb) {
	del(['**/*.map'], {
		force: true
	}, cb);
});

gulp.task('css:dist', function () {
	runSequence('css', ['css:clean'])
});


// watch tasks
gulp.task('watch', function () {
	gulp.watch('**/*.scss', ['css']);
});

// default tasks
gulp.task('default', ['watch', 'css']);
gulp.task('dist', ['css:dist']);