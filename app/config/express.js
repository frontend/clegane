/**
 * Express configuration
 */

'use strict';

var express           = require('express');
var favicon           = require('serve-favicon');
var morgan            = require('morgan');
var compression       = require('compression');
var bodyParser        = require('body-parser');
var cookieParser      = require('cookie-parser');
var methodOverride    = require('method-override');
var errorHandler      = require('errorhandler');
var path              = require('path');
var config            = require('./environment');
var passport          = require('passport');
var session           = require('express-session');
var mongoStore        = require('connect-mongo')(session);
var mongoose          = require('mongoose');

module.exports = function(app) {
  var env = app.get('env');

  // used for views
  app.set('views', config.root + '/app/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());

  // use body parser so we can grab information from POST requests
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use(methodOverride());

  // read cookies (needed for auth)
  app.use(cookieParser());
  app.use(passport.initialize());

  // Persist sessions with mongoStore
  // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
  app.use(session({
    secret: config.secrets.session,
    resave: true,
    saveUninitialized: true,
    store: new mongoStore({ mongoose_connection: mongoose.connection })
  }));
  
  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', 'public');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};