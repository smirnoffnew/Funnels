const multer = require('multer');
const maxSize = process.env.IMAGE_MAX_SIZE;

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
         callback(null, `${process.cwd()}${process.env.LOGOBUFFER_DIR}`);
    },
    filename: function (req, file, callback) {
        const uploadedFileName = `${req.authData.profileId}${file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)}`;
        req.uploadedFileName = uploadedFileName;
        callback(null, uploadedFileName);
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
