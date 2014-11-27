var db = require('../db-util');
var mongoClient = require('../mongoClient');
var fs = require('fs');

function createPlayer(req, res) {
    var base64Image = req.body;
    var decodedImage = new Buffer(base64Image, 'base64');

    var userId = db.getPlayerId(req);
    mongoClient.addAssignmentPhoto(userId, decodedImage);

    res.header("Content-Type", "text/plain");
    res.send(200, "ok");
}

module.exports = createPlayer;
