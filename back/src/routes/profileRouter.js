const express = require('express');
const profileRouter = express.Router();

const profileController = require('../controllers/profileController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const checkModelPropertybyRequestBody = require('../libs/checkModelPropertybyRequestBody.js');
const multerImage = require('../libs/multerImages.js');
const lastActive = require('../libs/lastActive');

profileRouter.patch('/',
    enshureToken,
    verifyToken,
    lastActive,
    checkModelPropertybyRequestBody,
    profileController.changeMyProfile);
profileRouter.patch('/avatar',
    enshureToken,
    verifyToken,
    lastActive,
    multerImage.single('avatar'),
    profileController.changeUsersAvatar);
// profileRouter.get('/avatar',
//     enshureToken,
//     verifyToken,
//     profileController.getAvatarUser    
// )

module.exports = profileRouter;
