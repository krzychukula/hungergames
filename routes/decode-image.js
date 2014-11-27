var db = require('../db-util');
var mongoClient = require('../mongoClient');
var fs = require('fs');

function createPlayer(req, res) {
    var base64Image = req.text;
    var decodedImage = new Buffer(base64Image, 'base64');

    var userId = db.getPlayerId();
    mongoClient.addAssignmentPhoto(userId, decodedImage);

    //fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
}

module.exports = createPlayer;
