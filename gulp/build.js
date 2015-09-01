'use strict';

var gulp = require('gulp');
var path = require('path');
var merge = require('merge-stream');
var runSequence = require('run-sequence');
var stylish = require('jshint-stylish');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

// Output directories
var paths = {
	tmp: './.tmp'
	, target: './target'
	, distribution: './dist'
	, dist: './dist/dist/vpp-frontend'
	, distApp: './dist/dist/vpp-frontend/app'
	, client: './client'
	, server: './server'
};

// Clean all built directories
gulp.task('clean', function(done) {
	$.del([paths.target, paths.distribution], done);
});

gulp.task('end', function(done) {
	$.del([paths.dist], done);
});

// Compile Less files
gulp.task('styles', function() {
    return gulp.src(paths.client + '/app/app.less')
        .pipe($.sourcemaps.init())
        .pipe($.less({
            paths: [ path.join('./bower_components') ]
        }))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(paths.dist + '/app'));
});

gulp.task('compile:js',function () {
	var dst = paths.dist + '/app'
		, src = [
			paths.client + '/app/**/*.js'
			, paths.client + '/public/utils/**/*.js'
			, paths.client +  '/public/directives/**/*.js'
			, paths.client +  '/public/templates/**/*.js'
			, '!' + paths.client + '/app/**/*.spec.js'
			, '!' + paths.client + '/components/**/*.spec.js'
			, '!' + paths.client + '/app/**/*.mock.js'
			, '!' + paths.client + '/components/**/*.mock.js'
		];

	return gulp.src(src)
		.pipe($.concat('scripts.js'))
		.pipe(gulp.dest(dst))
		.pipe($.rename('scripts.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(dst));
});

// Compile bower components
gulp.task('compile:bower', function () {
	var jsFilter = $.filter('*.js')
		, dst = paths.dist + '/app';

	return gulp.src($.mainBowerFiles())
		.pipe(jsFilter)
		.pipe($.concat('lib.js'))
		.pipe(gulp.dest(dst))
});

// Compile templates and place in Angular template cache
gulp.task('compile:templates', function () {
	return gulp.src([
			paths.client + '/app/**/*.html'
		,   paths.client + '/public/directives/**/*.html'
		,   paths.client + '/public/templates/**/*.html'
	])
		.pipe($.htmlmin({collapseWhitespace: true}))
		.pipe($.ngTemplates({
			filename: 'templates.js'
			, module: 'vppApp'
			, standalone: false
			, path: function (path, base) {
				return path.slice(base.indexOf('client')).replace('client/', '');
			}
		}))
		.pipe(gulp.dest(paths.dist + '/app'));
});

// Copy html files for dev distribution
gulp.task('copy:html', function() {
    return gulp.src(paths.client + '/*.html')
        .pipe(gulp.dest(paths.dist));
});

// Copy favicon
gulp.task('copy:favicon', function() {
    return gulp.src(paths.client + '/*.ico')
        .pipe(gulp.dest(paths.dist));
});

gulp.task('copy:images', function() {
	var src = paths.client + '/public/images/**/*',
		dst = paths.dist + '/app/images/';

	return gulp.src(src)
		.pipe($.plumber({
			errorHandler: function(){}
		}))
		.pipe($.imagemin())
		.pipe(gulp.dest(dst))
});

// Copy fonts
gulp.task('copy:fonts', function () {
	var appFonts = gulp.src(paths.client + '/fonts/**/*')
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(paths.distApp + '/fonts/'));

	return appFonts;
});

// Minify js and css
gulp.task('minify', ['styles', 'templates'], function () {
    var jsFilter = $.filter('**/*.js');
    var cssFilter = $.filter('**/*.css');
    var assets;

    return gulp.src(paths.client + '/*.html')
        .pipe(assets = $.useref.assets())
        .pipe($.rev())
        .pipe(jsFilter)
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense}))
        .pipe(jsFilter.restore())
        .pipe(cssFilter)
        .pipe($.replace('/bower_components/bootstrap/fonts/', '../fonts/'))
        .pipe($.csso())
        .pipe(cssFilter.restore())
        .pipe(assets.restore())
        .pipe($.useref())
        .pipe($.revReplace())
        .pipe(gulp.dest(paths.dist + '/'))
        .pipe($.size({ title: paths.dist + '/', showFiles: true }));
});

// Create tarballs gzip it
gulp.task('compress:frontend', ['build'], function() {
	var dist = gulp.src(paths.distribution + '/dist/**/*')
        .pipe($.tar('vpp-frontend.tar'))
        .pipe($.gzip())
        .pipe(gulp.dest(paths.target));

    return dist;
});

gulp.task('copy:backend', function() {
	var server = gulp.src(paths.server + '/**/*')
		.pipe(gulp.dest(paths.distribution + '/server/server'));

	var nodeModules = gulp.src('package.json')
		.pipe(gulp.dest(paths.distribution + '/server/server'));

	return merge(server, nodeModules);
});


// Create tarballs gzip it for back end
gulp.task('compress:backend', ['copy:backend'], function() {
	return gulp.src(paths.distribution + '/server/**/*')
		.pipe($.tar('vpp-backend.tar'))
		.pipe($.gzip())
		.pipe(gulp.dest(paths.target));
});

// Lint
gulp.task('lint', function() {
    return gulp.src(paths.client + '/{app, components}/**/*.js')
        .pipe($.jshint())
        .pipe($.jshint.reporter(stylish));
});

gulp.task('dev', ['compile:js', 'compile:bower', 'compile:templates']);

gulp.task('dist', ['minify']);

gulp.task('shared', ['copy:html', 'copy:favicon', 'copy:images', 'copy:fonts']);

gulp.task('build', ['dev', 'shared', 'dist']);

gulp.task('deploy-frontend', function() {
    runSequence('clean', ['compress:frontend']);
});

gulp.task('deploy-backend', function() {
	runSequence('clean', ['compress:backend']);
});