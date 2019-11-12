
const fs = require("fs");

module.exports = function(req, res, next) {
    res.json({
        link: `${req.get('host')}/funnelBackgrounds/${req.body.funnelId}/${req.file.filename}`,
    });
};
