'use strict';
/**
 * Variables and functions
 */

var config = {
    less: {
        app: [],
        lib: []
    },
    js: {
        app: [],
        lib: []
    },
    assets: {
        app: [],
        lib: []
    },
    paths: {
        source: '',
        dest:   ''
    }
};

var DEST    = 'public';
var DESTCSS = DEST + '/css';
var DESTJS  = DEST + '/js';


// Use the function below with gulp-notify to debug streams
// e.g.
//      .pipe(_.notify(debugNotify))
var debugNotify = function(vinyl) {
    console.log(vinyl.inspect());
    return false;
};

/**
 * Gulp & Plugins
 */
var gulp        = require('gulp');
var merge       = require('merge-stream');
var streamqueue = require('streamqueue');
var _           = require('gulp-load-plugins')();

/**
 * Tasks
 */

gulp.task('jshint', function() {
    return gulp.src('**.js')
        .pipe(_.jshint())
        .pipe(_.jshint.reporter('default'));
});


gulp.task('appcss', function() {
    return gulp.src('public/less/style.less')
        .pipe(_.less())
		.pipe(_.autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
	    .pipe(_.concat('style.css'))
	    // .pipe(_.minifyCss()) // currently in DEV mode, don't minify
	    .pipe(gulp.dest('public/css'));
});


// run server
gulp.task( 'server:start', function() {
    _.developServer.listen( { path: 'app.js' } );
});


gulp.task('notify', function() {
    _.notify('Done');
});

gulp.task('watch', ['server:start'], function() {
    gulp.watch( [ 'app.js', 'app/**' ], _.developServer.restart )
    gulp.watch('public/**/*.less', ['css']);

    // Create LiveReload server
    var server = _.livereload();
        gulp.watch(['public/**', 'views/**']).on('change', function(file) {
            server.changed(file.path);
    });
});

gulp.task('css', ['appcss']);

gulp.task('finish', ['jshint', 'css', 'notify'], function() {});

gulp.task('default', function() {
    gulp.start('finish');
});
