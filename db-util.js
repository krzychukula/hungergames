var Q = require('q');
var mongoose = require('mongoose');

module.exports.getGame = function(id) {
    var Game = mongoose.model('Game');
    var query  = Game.where({name: id});

    return Q.nfcall(query.findOne.bind(query));
};

module.exports.getPlayer = function(gameId, email) {
    var Player = mongoose.model('Player');
    var id = gameId + ":" + email;
    var query  = Player.where({id: id});

    return Q.nfcall(query.findOne.bind(query));
};

module.exports.getCurrentAssignment = function(playerId) {
    return Q.resolve(null);
};