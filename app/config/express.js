var express = require('express');
var session = require('express-session');

var bodyParser     = require('body-parser');
var express        = require('express');
var favicon        = require('serve-favicon');
var logger         = require('morgan');
var methodOverride = require('method-override');
var serveStatic    = require('serve-static');
var session        = require('express-session');
var path           = require('path');

module.exports = function(app, config) {
    app.use(serveStatic(config.root + '/public'));
    app.set('port', config.port);
    app.set('views', config.root + '/app/views');
    app.set('view engine', 'jade');
    app.use(favicon(config.root + '/public/img/favicon.png'));
    app.use(logger('dev'));
    app.use(bodyParser());
    app.use(methodOverride());
    app.use(session({
        secret: 'JJDd8sjHd8345J4Ns33lsKJj',
        resave: true,
        saveUninitialized: true
        // secure: true // NEEDS HTTPS
    }));

};
