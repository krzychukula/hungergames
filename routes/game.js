var mc = require('../mongoClient');

/*
 * GET home page.
 */

exports.games = function(req, res){
    mc.games(function(games) {
        res.render('games', {games: games});
    });
};