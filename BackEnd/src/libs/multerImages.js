const multer = require('multer');
const maxSize = process.env.IMAGE_MAX_SIZE;
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        // // Windows settings 
         callback(null, `./${process.env.IMAGE_STORE}`);
        // Linux settings
<<<<<<< HEAD
        //callback(null, `${process.env.APP_PATH}${process.env.IMAGE_STORE}`);
=======
        console.log(__dirname)
        callback(null, `${process.env.APP_PATH}${process.env.IMAGE_STORE}`);
>>>>>>> e98c4c6f92bf77c20460c4eb73e03ac207b3a6c0
    },
    filename: function (req, file, callback) { 
        callback(null, 'buffer-file.jpg');
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