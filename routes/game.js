var mc = require('../mongoClient');

/*
 * GET home page.
 */

exports.games = function(req, res){
    mc.games(function(){
        res.send("Hey ya!");
    });
};