const multer = require('multer');
const mkdirp = require('mkdirp');
const maxSize = process.env.IMAGE_MAX_SIZE;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let folderToSave = `./${process.env.IMAGE_STORE}${req.authData.profile.accountName}`
        mkdirp.sync(folderToSave);
        callback(null, folderToSave);
    },
    filename: function (req, file, callback) {
        callback(null,  Date.now() + file.originalname.toString().slice(-4));
    },

});

function fileFilter(req, file, callback) {
    const extension = file.mimetype.split('/')[0];
    if (extension !== 'image') {
        return callback('You can upload only supporting  file types', false);
    }
    callback(null, true);
}
module.exports = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: maxSize
    }
});