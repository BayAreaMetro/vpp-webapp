/*jslint node: true */

/**
 * Express configuration
 */

'use strict';

var express = require('express');
var favicon = require('static-favicon');
var logger = require('morgan');
var compression = require('compression');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cookieParser = require('cookie-parser');
var errorHandler = require('errorhandler');
var path = require('path');
var config = require('./environment');
var passport = require('passport');
var session = require('express-session');

var routes = require('./../routes/pages/index');
var users = require('./../routes/users');

// var mongoStore = require('connect-mongo')(session);
// var multer = require('multer');

module.exports = function(app) {
    var env = app.get('env');

    // view engine setup
    app.set('views', path.join(__dirname, './../views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join(__dirname, './../public')));

    // Enables CORS
    var enableCORS = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET');
        res.header('Access-Control-Allow-Methods', 'POST');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, *');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
            res.send(200);
        } else {
            next();
        }
    };

    //Check to see if request requires compression or not
    function shouldCompress(req, res) {
        if (req.headers['x-no-compression']) {
            // don't compress responses with this request header
            return false;
        }

        // fallback to standard filter function
        return compression.filter(req, res);
    }

    //Compress all static content
    app.use(compression({
        filter: shouldCompress
    }));



    //Load app modules
    app.use(enableCORS);
    app.use(favicon());
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/bower', express.static('bower_components'));
    // Persist sessions with mongoStore
    // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
    // app.use(session({
    //     secret: process.env.SESSION_SECRET || 'd93c55f2-3189-11e5-a151-feff819cdc9f',
    //     store: new mongoStore({
    //         url: config.mongo.uri,
    //         collection: 'sessions'
    //     }, function() {
    //         console.log('db connection open');
    //     })
    // }));

    //app.use('/', routes);
    //app.use('/users', users);

    /// catch 404 and forward to error handler
    // app.use(function(req, res, next) {
    //     var err = new Error('Not Found');
    //     err.status = 404;
    //     next(err);
    // });

    /// error handlers

    // development error handler
    // will print stacktrace
    // if (app.get('env') === 'development') {
    //     app.use(function(err, req, res, next) {
    //         res.status(err.status || 500);
    //         res.render('error', {
    //             message: err.message,
    //             error: err
    //         });
    //     });
    // }

    // // production error handler
    // // no stacktraces leaked to user
    // app.use(function(err, req, res, next) {
    //     res.status(err.status || 500);
    //     res.render('error', {
    //         message: err.message,
    //         error: {}
    //     });
    // });



    if ('production' === env) {
        //app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
        //app.use(express.static(path.join(config.root, 'public')));
        //app.set('appPath', config.root + '/public');
        app.use(logger('dev'));
    }

    if ('development' === env || 'test' === env) {
        //app.use(require('connect-livereload')());
        //app.use(express.static(path.join(config.root, '.tmp')));
        //app.use(express.static(path.join(config.root, 'client')));
        //app.set('appPath', 'client');
        app.use(logger('dev'));
        app.use(errorHandler()); // Error handler - has to be last
    }
};
