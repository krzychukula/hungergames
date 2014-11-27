var Q = require('q');
var db = require('../db-util')

var statusHandlers = {
    'ACTIVE': serveActive
};


function serveStatus(req, res) {
    var game, player, assignment;

    var gameId = req.session.gameId || 'stp-hunger-game';
    var userEmail = req.user.email;

    db.getGame(req.session.gameId).then(function(g) {
        game = g;

        if (game) {
            return db.getPlayer(gameId, userEmail);
        } else {
            return Q.resolve(null);
        }
    }).then(function(p) {
        player = p;
        if (p && p.state == 'ACTIVE')
            return db.getCurrentAssignment(p.id);
        else
            return null;
    }).then(function(a) {
        assignment = a;

        var status = (player && player.state) || 'ACTIVE';

        return statusHandlers[status](req, res, {
            player: player,
            game: game,
            assignment: assignment
        });

    }).catch(function(err) {
        console.log(err.stack || err);
    });
}

function waitingForGame(req, res) {
    res.render('waiting-game', {

    });
}

function serveActive(req, res, data) {
    data.targetPhoto = '/photo/' + data.assignment.target;
    res.render('status-active', data);
}

module.exports = serveStatus;
