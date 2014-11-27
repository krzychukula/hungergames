var Q = require('q');
var mongoose = require('mongoose');

module.exports.getGame = function(id) {
    var Game = mongoose.model('Game');
    var query  = Game.where({name: id});

    return Q.nfcall(query.findOne.bind(query));
};

module.exports.getPlayer = function(gameId, email) {
    var id = gameId + ":" + email;
    return module.exports.getPlayerByFullId(id);
};

module.exports.getPlayerByFullId = function(id) {
    var Player = mongoose.model('Player');
    var query  = Player.where({id: id});

    return Q.nfcall(query.findOne.bind(query));
};

module.exports.createPlayer = function(gameId, userData, photo) {
    var id = gameId + ":" + userData.email;
    var name = userData.name;
    var state = 'active';

    var playerSchema = mongoose.Schema({
        id: String,
        name: String,
        photo: {
            data: Buffer,
            contentType: String
        },
        state: String
    });
};

module.exports.getCurrentAssignment = function(playerId) {
    return Q.resolve(null);
};