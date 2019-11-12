
const fs = require("fs");

module.exports = function(req, res, next) {
    res.json({
        link: `${req.get('host')}/avatars/${req.body.userName}/${req.file.filename}`,
    });
};
