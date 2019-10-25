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

/*partners*/
profileRouter.post('/partners',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.createPartner);
profileRouter.get('/partners',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.getAllPartners);
profileRouter.get('/partners/:partnerId',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.getSinglePartner);
profileRouter.patch('/partners/:partnerId',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.updatePartnersPermissions);
profileRouter.delete('/partners/:partnerId',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.deleteSinglePartner);
profileRouter.post('/partners/link',
    enshureToken,
    verifyToken,
    lastActive,
    profileController.createUrlForPartner);


module.exports = profileRouter;
