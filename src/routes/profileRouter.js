const express = require('express');
const profileRouter = express.Router();

const profileController = require('../controllers/profileController.js');
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');
const checkModelPropertybyRequestBody = require('../libs/checkModelPropertybyRequestBody.js');
const multerImage = require('../libs/multerImages.js');

profileRouter.patch('/',
    enshureToken,
    verifyToken,
    checkModelPropertybyRequestBody,
    profileController.changeMyProfile);
profileRouter.patch('/avatar',
    enshureToken,
    verifyToken,
    multerImage.single('avatar'),
    profileController.changeUsersAvatar);

module.exports = profileRouter;
