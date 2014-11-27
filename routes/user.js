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


exports.login = function(req, res) {
  if (req.user) return res.redirect('/');
  res.render('login', {
    title: 'Join Schibsted Hunger Games'
  });
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
* GET /account
* Profile page.
*/

exports.getAccount = function(req, res) {
  res.render('user', {
    title: 'Account Management'
  });
};
