var express = require('express');
var app = express();
var path = require('path');
var passport = require('passport');
var server = require('http').createServer(app);

var db = require('./models');
var config = require('config');
var cookies = require('./utils/cookieManager');

app.configure(function(){
  app.set('port', config.port);

  // facebook settings
  app.set('facebook-oauth-key', config.passport.facebook.key);
  app.set('facebook-oauth-secret', config.passport.facebook.secret);

  // middleware
  // app.use(express.favicon(__dirname + '/static/images/favicon.ico'));
  app.use(express.logger('dev'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');

  app.use('/static', express.static(path.join(__dirname, '/static')));
  app.use(express.static(path.join(__dirname, '/')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('apple'));
  app.use(cookies('hsqs1'));
  app.use(express.session({ secret: 'h1gH sch00L' }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});

require('./passport')(app, passport);
require('./routes')(app, passport);
require('./api')(app, passport);

db.sequelize.sync().complete(function(){
  server.listen(config.port);
});
