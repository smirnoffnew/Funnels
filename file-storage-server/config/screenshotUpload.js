var multer = require('multer');
var mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

let folderToSave;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        folderToSave = `${process.env.SCREENSHOT_STORE}${req.body.funnelsId}`;
        mkdirp.sync(folderToSave);
        callback(null, folderToSave);
    },
    filename: function (req, file, callback) {
        callback(null, `${Date.now()}${path.parse(file.originalname).ext}`);
    }
});


module.exports = multer({
    storage: storage
}); 