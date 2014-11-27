var db = require('../db-util')


function servePhoto(req, res) {
    var playerId = req.params.playerId;
    db.getPlayerByFullId(playerId).then(function(player) {
        res.header('content-type', player.photo.contentType);
        res.send(200, player.photo.data);
    }).catch(function(err) {
        console.log(err.stack || err);
        res.send(500, err);
    })
}

module.exports = servePhoto;