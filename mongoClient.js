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
    var game = new Game(data);

// Convert the Model instance to a simple object using Model's 'toObject' function
// to prevent weirdness like infinite looping...
    var upsertData = game.toObject();

// Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete upsertData._id;

// Do the upsert, which works like this: If no Contact document exists with
// _id = contact.id, then create a new doc using upsertData.
// Otherwise, update the existing doc with upsertData
    Game.update({name: game.name}, upsertData, {upsert: true}, function(err){

    });
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

function games(cb) {
        Game.find(function (err, games) {
            if (err)
                return console.error(err);
            else {
                cb();
                console.log("Games:", games);
            }
        });
}


module.exports.createGame = createGame
module.exports.createPlayer = createPlayer
module.exports.createAssignment = createAssignment

module.exports.games = games