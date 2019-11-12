var multer = require('multer');
var mkdirp = require('mkdirp');
const path = require('path');
const fs = require('fs');

let folderToSave;
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        folderToSave = `${process.env.IMAGE_STORE}${req.body.userName}`;
        mkdirp.sync(folderToSave);
        callback(null, folderToSave);
    },
    filename: function (req, file, callback) {
        fs.readdir(folderToSave, (err, files) => {
            if (files.length > 0) {
                callback(null, `${path.parse(files[0]).name}${path.parse(file.originalname).ext}`);
            } else {
                callback(null, `${Date.now()}${path.parse(file.originalname).ext}`);
            }
        });
    }
});


module.exports = multer({
    storage: storage
});