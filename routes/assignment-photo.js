var db = require('../db-util');
var mongoClient = require('../mongoClient');
var fs = require('fs');

module.exports = function createPlayer(req, res) {
    mongoClient.showAssignmentPhoto(req.params.id, function(image) {
        res.header("Content-Type", "image/png");
        res.send(image);
    });

}
