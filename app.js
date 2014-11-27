
/**
 * Module dependencies.
 */

var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var logger = require('morgan');
var errorHandler = require('errorhandler');
var methodOverride = require('method-override');
var passport = require('passport');

var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');

var secrets = {
  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/game',
  sessionSecret: process.env.SESSION_SECRET || 'Default session secret',
}

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');
//app.use(express.favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressValidator());
app.use(methodOverride());
app.use(cookieParser());
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: secrets.sessionSecret,
//   store: new MongoStore({ url: secrets.db, auto_reconnect: true })
// }));
// app.use(passport.initialize());
// app.use(passport.session());
app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));


app.get('/', routes.index);
app.get('/users', user.list);

/**
* 500 Error Handler.
*/

app.use(errorHandler());

/**
* Start Express server.
*/

app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));
});

module.exports = app;
