var Q = require('q');
var db = require('../db-util')

var statusHandlers = {
    'ACTIVE': serveActiveAssignment,
    'PENDING': servePendingAssignment
};


function serveStatus(req, res) {
    var game, player, assignment;

    var gameId = req.session.gameId || 'stp-hunger-game';
    var userEmail = req.user.email || 'jakub.wasilewski@schibsted.pl';

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

        var assignmentStatus = assignment.status;

        return statusHandlers[assignmentStatus](req, res, {
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

function serveActiveAssignment(req, res, data) {
    data.targetPhoto = '/photo/' + data.assignment.target;
    res.render('status-active', data);
}


function servePendingAssignment(req, res, data) {
    data.assignmentPhoto = '/assignment-photo/' + data.assignment._id;
    res.render('status-pending', data);
}

module.exports = serveStatus;
