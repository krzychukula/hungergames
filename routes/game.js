var mc = require('../mongoClient');

/*
 * GET home page.
 */

exports.games = function(req, res){
    mc.games();
    res.send("Hey ya!");
};