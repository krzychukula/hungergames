var statusHandlers = {
    'active': serveActive
};

function serveStatus(req, res) {
    var status = 'active';
    statusHandlers[status](req, res);
}

function serveActive(req, res) {
    res.render('status-active', {
        user: req.user
    });
}

module.exports = serveStatus;
