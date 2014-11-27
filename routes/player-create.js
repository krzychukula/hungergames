var db = require('../db-util');
var fs = require('fs');

function createPlayer(req, res) {
    var photo = req.files.photo;
    console.log(photo);
}

module.exports = createPlayer;
