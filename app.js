
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

var MongoStore = require('connect-mongo')(session);
var mongoose = require('mongoose');
var flash = require('express-flash');

var passport = require('passport');

var User = require('./models/User');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var secrets = require('./secrets')


// Sign in with Google.

passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {

  console.log('AUTH!', !req,user, !accessToken, !refreshToken, !profile);

  if (req.user) {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        console.log('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        console.log('User.findById');
        User.findById(req.user.id, function(err, user) {
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.picture;
          user.save(function(err) {
            req.flash('info', { msg: 'Google account has been linked.' });
            console.log('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    console.log('User.findOne');
    User.findOne({ google: profile.id }, function(err, existingUser) {
      console.log('existingUser', err,  existingUser);
      if (existingUser) return done(null, existingUser);
      console.log('not existing User.findOne', profile._json.email);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        console.log('not existingEmailUser', existingEmailUser);
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          console.log({ msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
          console.log('new User()');
          var user = new User();
          user.email = profile._json.email;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.picture;
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

// Login Required middleware.

var passportConf = {

  isAuthenticated : function(req, res, next) {
    if (req.isAuthenticated()) return next();
    res.redirect('/login');
  },

  // Authorization Required middleware.

  isAuthorized : function(req, res, next) {
    var provider = req.path.split('/').slice(-1)[0];

    if (_.find(req.user.tokens, { kind: provider })) {
      next();
    } else {
      res.redirect('/auth/' + provider);
    }
  }
};

var mongo = require('./mongoClient');

var secrets = {
  db: process.env.MONGOLAB_URI || process.env.MONGODB || 'mongodb://localhost:27017/game',
  sessionSecret: process.env.SESSION_SECRET || 'Default session secret',
}

var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();


/**
* Connect to MongoDB.
*/

mongoose.connect(secrets.db);
mongoose.connection.on('error', function() {
  console.error('MongoDB Connection Error. Please make sure that MongoDB is running.');
});

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
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: secrets.sessionSecret,
  store: new MongoStore({ url: secrets.db, auto_reconnect: true })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use(function(req, res, next) {
  // Make user object available in templates.
  res.locals.user = req.user;
  next();
});
app.use(function(req, res, next) {
  // Remember original destination before login.
  var path = req.path.split('/')[1];
  if (/auth|login|logout|signup|fonts|stylesheets|javascripts|images|favicon/i.test(path)) {
    return next();
  }
  req.session.returnTo = req.path;
  next();
});

app.use(require('less-middleware')(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use(express.static(path.join(__dirname, 'bower_components')));

app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function(req, res) {
  console.log('CALLBACK');
  // console.log('req.session', req.session)
  // console.log('req.user', req.user)
  res.redirect(req.session.returnTo || '/');
});

app.get('/', passportConf.isAuthenticated, routes.index);
app.get('/login', user.login);
app.get('/logout', user.logout);
app.get('/users', user.list);

app.get('/account', passportConf.isAuthenticated, user.getAccount);

app.get('/shoot/:assignment', require('./routes/shoot'));

/**
* 500 Error Handler.
*/

app.use(errorHandler());

/**
* Start Express server.
*/

mongo(secrets.db);


app.listen(app.get('port'), function() {
  console.log('Express server listening on port %d in %s mode', app.get('port'), app.get('env'));

});

module.exports = app;
