'use strict';

var gulp                = require('gulp');
var path                = require('path');
var httpProxy           = require('http-proxy');
var browserSync         = require('browser-sync');
var autoprefixer        = require('autoprefixer-core');
var templateCache       = require('gulp-angular-templatecache');
var historyApiFallback  = require('connect-history-api-fallback');
var merge               = require('merge-stream');
var appModule           = 'vppApp';

// TODO: Remove above vars for individual loads
var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files']
});

var paths = {
    tmp: './.tmp'
    , client: './client'
	, bowerDir: './bower_components'
};

var proxy = httpProxy.createProxyServer({
    target: 'http://localhost:9000'
});

// Proxy any api calls to the back end server
var proxyMiddleware = function(req, res, next) {
    var path = req.url.split('/');
    if (/api|auth/.test(path[1])) {
        proxy.web(req, res);
    } else {
        next();
    }
};

// Run server
gulp.task('browser-sync', function() {
    var port = 3000;
    browserSync({
        server: {
            baseDir: [paths.client, paths.tmp]
	        , middleware: [
		        proxyMiddleware
		        , historyApiFallback
	        ]
	        , tunnel: true
        },
        port: port,
        notify: false
    });
});

// Reload browser sync
gulp.task('bs-reload', function () {
    browserSync.reload();
});

// Local styles
gulp.task('styles:local', ['inject:less'], function() {

	var src = paths.client + '/app/app.less'
		, dst = paths.tmp + '/app';

    return gulp.src(src)
        .pipe($.sourcemaps.init())
        .pipe($.less({
            paths: [ path.join('./bower_components') ]
        }))
	    .pipe($.autoprefixer({
		    browsers: ['last 2 versions']
	    }))
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(dst))
        .pipe(browserSync.reload({stream:true}));
});

// Compile app js files
gulp.task('inject:js', function () {
	var dst = paths.tmp + '/app'
		, src = [
			paths.client + '/app/**/*.js'
			, paths.client + '/components/**/*.js'
			, paths.client + '/public/utils/**/*.js'
			, paths.client + '/public/directives/**/*.js'
			, '!' + paths.client + '/app/**/*.spec.js'
			, '!' + paths.client + '/components/**/*.spec.js'
			, '!' + paths.client + '/app/**/*.mock.js'
			, '!' + paths.client + '/components/**/*.mock.js'
		];

	return gulp.src(src)
		.pipe($.concat('scripts.js'))
		.pipe(gulp.dest(paths.tmp + '/app'))
		.pipe($.rename('scripts.min.js'))
		.pipe($.uglify())
		.pipe(gulp.dest(dst));
});

// Compile bower components
gulp.task('bower:js', function () {
	var jsFilter = $.filter('*.js')
		, dst = paths.tmp + '/app';

	return gulp.src($.mainBowerFiles())
		.pipe(jsFilter)
		.pipe($.concat('lib.js'))
		.pipe(gulp.dest(dst))
});

// Import Less files into app.less when adding/deleting
gulp.task('inject:less', function () {
    var target = gulp.src(paths.client + '/app/app.less')
        , sources = gulp.src([
	        paths.client + '/app/**/*.less'
	        , '!client/app/app.less'
	        , paths.client + '/components/**/*.less'
		    , paths.client + '/public/**/*.less'
	        , '!./common/bower_components/**/*.less'
	    ], {read: false});

    return target.pipe($.inject(sources, {
        transform: function(filePath) {
            filePath = filePath.replace('/client/app/', '');
            filePath = filePath.replace('/client/components/', '../components/');
	        filePath = filePath.replace('/client/public/', '../public/');
            return '@import \'' + filePath + '\';';
        },
        starttag: '// injector',
        endtag: '// endinjector',
        addRootSlash: false
    }))
    .pipe(gulp.dest(paths.client + '/app'));
});

// Compile templates
gulp.task('templates', function() {
	var options = { module: appModule }
		, dst = paths.tmp + '/app'
		, src = [
			paths.client + '/public/directives/**/*.html'
		];

	return gulp.src(src)
		.pipe(templateCache(options))
		.pipe(gulp.dest(dst));
});

// Transfer images
gulp.task('images', function() {
	var src = paths.client + '/public/images/**/*',
		dst = paths.tmp + '/app/images';

	return gulp.src(src)
		.pipe($.plumber({
			errorHandler: function(){}
		}))
		.pipe($.changed(dst))
		.pipe($.imagemin())
		.pipe(gulp.dest(dst))
});

// Transfer fonts
gulp.task('fonts', function() {
	var appFonts = gulp.src(paths.client + '/fonts/**/*')
		.pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
		.pipe($.flatten())
		.pipe(gulp.dest(paths.tmp + '/app/fonts/'));

	return appFonts;
});

// Transfer json
gulp.task('json', function() {
	var src = [
			paths.client + '/public/json/**/*.json'
		]
		, dst = paths.tmp + '/app/json';

	return gulp.src(src)
		.pipe($.plumber({
			errorHandler: function(){}
		}))
		.pipe(gulp.dest(dst))
});

// Watch
gulp.task('watch', function() {

    // Watch index.html
    gulp.watch(paths.client + '/index.html', ['bs-reload']);

    // Watch less
    gulp.watch([paths.client + '/**/*.less', paths.client + '/less/**/*.less'], ['styles:local']);

	// Watch less
	gulp.watch([paths.client + '/public/json/**/*.json'], ['json']);

    // Watch templates
    gulp.watch([paths.client + '/app/**/*.html', paths.client + '/public/directives/**/*.html'], ['templates', 'bs-reload']);

	// Watch JS
	gulp.watch([paths.client + '/app/**/*.js', paths.client + '/public/directives/**/*.js', paths.client + '/public/utils/**/*.js'], ['inject:js', 'bs-reload']);

    /* Note: Use gulp-watch because native watch doesn't watch on add/delete */
    // Watch for add/delete of js files
    $.watch([paths.client + '/app/**/*.js', paths.client + '/public/directives/**/*.js',  paths.client + '/public/utils/**/*.js'], function() {
        gulp.start('inject:js');
        gulp.start('bs-reload');
    });

});

// Serve
gulp.task('serve', ['browser-sync', 'images', 'fonts', 'json', 'styles:local', 'bower:js', 'inject:js', 'templates', 'watch']);