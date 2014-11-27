var mongoose = require('mongoose');



var statusHandlers = {
    'active': serveActive
};

function serveStatus(req, res) {
    var game = {

    };
    var player = {
        status: 'active'
    };

    // choose the right template
    var status = player.status;
    return statusHandlers[status](req, res);
}

function waitingForGame(req, res) {
    res.render('waiting-game', {

    });
}

function serveActive(req, res) {
    var userId = req.user.email;

    var Game = mongoose.model('Game');
    Game.findOne(function)

    res.render('status-active', {
        user: req.user
    });
}

module.exports = serveStatus;
