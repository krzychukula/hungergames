//var _ = require('lodash');
//var async = require('async');
var crypto = require('crypto');
var passport = require('passport');

var secrets = require('../secrets');
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
};


/**
/**
* GET /logout
* Log out.
*/

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};

/**
* GET /account/unlink/:provider
* Unlink OAuth provider.
* @param provider
*/

exports.getOauthUnlink = function(req, res, next) {
  var provider = req.params.provider;
  User.findById(req.user.id, function(err, user) {
    if (err) return next(err);

    user[provider] = undefined;
    user.tokens = _.reject(user.tokens, function(token) { return token.kind === provider; });

    user.save(function(err) {
      if (err) return next(err);
      req.flash('info', { msg: provider + ' account has been unlinked.' });
      res.redirect('/account');
    });
  });
};

/**
* GET /account
* Profile page.
*/

exports.getAccount = function(req, res) {
  res.render('user', {
    title: 'Account Management'
  });
};
