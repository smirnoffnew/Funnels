
const fs = require("fs");

module.exports = function(req, res, next) {
    console.log(`${req.get('host')}/screenshots/${req.body.funnelsId}/${req.file.filename}`)
    res.json({
        link: `${req.get('host')}/screenshots/${req.body.funnelsId}/${req.file.filename}`,
    }); 
};
