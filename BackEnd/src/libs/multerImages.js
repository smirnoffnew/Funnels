const multer = require('multer');
const maxSize = process.env.IMAGE_MAX_SIZE;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, `${process.env.APP_PATH}${process.env.IMAGE_STORE}`);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname.toString());
    },

});
function fileFilter(req, file, callback){
    const extension = file.mimetype.split('/')[0];
    if(extension !== 'image'){
        return callback('You can upload only supporting  file types', false);
    }
    callback(null, true);
}
module.exports = multer({storage: storage, fileFilter: fileFilter,limits: {fileSize: maxSize}});