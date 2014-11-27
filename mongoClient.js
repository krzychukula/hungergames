var mongoose = require('mongoose');

var Player,
    Game,
    Assignment,
    db;
module.exports = function () {

    db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));


    var playerSchema = mongoose.Schema({
        id: String,
        firstName: String,
        lastName: String,
        photo: {
            data: Buffer,
            contentType: String
        },
        state: String
    });

    var gameSchema = mongoose.Schema({
        startTime: Date,
        endTime: Date,
        name: String,
        players: []
    });

    var assignmentSchema = mongoose.Schema({
        killer: String,
        target: String,
        status: String,
        photo: {
            data: Buffer,
            contentType: String
        }
    });

    Player = mongoose.model('Player', playerSchema);
    Game = mongoose.model('Game', gameSchema);
    Assignment = mongoose.model('Assignment', assignmentSchema);
}

function create(model, data) {
    var model = new model(data);
    db.once('open', function () {
        model.save(saveCb);
    })
}

function createGame(data) {
    create(Game, data);
}

function createPlayer(data) {
    create(Player, data);

}

function createAssignment(data) {
    create(Assignment, data);
}

function saveCb(err, result) {
    if (err) {
        return console.log(err);
    } else {
        console.log('success');
    }
}

function games() {
    db.once('open', function () {
        Game.find(function (err, games) {
            if (err) return console.error(err);
            console.log(games);
        });
    });
}


module.exports.createGame = createGame
module.exports.createPlayer = createPlayer
module.exports.createAssignment = createAssignment

module.exports.games = games