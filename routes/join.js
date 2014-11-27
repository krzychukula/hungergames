var Q = require('q');
var db = require('../db-util')

function serveJoin(req, res) {
    var gameId = req.params.gameId;
    var userEmail = req.user.email;

    var playerId = gameId + ":" + userEmail;

    req.session.gameId = gameId;
    db.getPlayer(playerId).then(function(player) {
        if (!player)
            res.redirect('/register');
        else
            res.redirect('/account');
    });
}

module.exports = serveJoin;
