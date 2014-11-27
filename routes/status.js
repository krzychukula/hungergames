var mongoose = require('mongoose');
var Q = require('q');


var statusHandlers = {
    'active': serveActive
};

function getGame(id) {
    var Game = mongoose.model('Game');
    var query  = Game.where({name: id});

    return Q.nfcall(query.findOne.bind(query));
}

function serveStatus(req, res) {
    req.user.gameId =

    getGame("hunger game no2").then(function(game) {
        res.send(200, JSON.stringify(game));
        return;
    }).catch(function(err) {
        res.send(500, err);
    });
    /*
    var game = {

    };
    var player = {
        status: 'active'
    };

    // choose the right template
    var status = player.status;
    return statusHandlers[status](req, res);*/
}

function waitingForGame(req, res) {
    res.render('waiting-game', {

    });
}

function serveActive(req, res) {
    var userId = req.user.email;

    var Game = mongoose.model('Game');
    var query  = Game.where({});
    query.findOne(function (err, kitten) {
        if (err) return handleError(err);
        if (kitten) {
            // doc may be null if no document matched
        }
    });

    res.render('status-active', {
        user: req.user
    });
}

module.exports = serveStatus;
