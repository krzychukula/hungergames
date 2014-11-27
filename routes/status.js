var Q = require('q');
var db = require('../db-util')

var statusHandlers = {
    'active': serveActive
};


function serveStatus(req, res) {
    var game, player, assignment;

    console.log(req.session);

    db.getGame("hunger game no2").then(function(g) {
        game = g;
        return db.getPlayer('blah');
    }).then(function(p) {
        player = p;
        if (p && p.status == 'active')
            return db.getCurrentAssignment(p.id);
        else
            return null;
    }).then(function(a) {
        assignment = a;

        var status = (player && player.status) || 'active';

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
    res.render('status-active', data);
}

module.exports = serveStatus;
