const express = require('express');
const userRouter = express.Router();

const usersController = require('../controllers/userController.js');
const enshureLetterToken = require('../libs/enshureLetterToken.js');
const requestLimiter = require('../libs/requestLimiter.js');

userRouter.post('/sign-up',
    usersController.signUp);
userRouter.post('/sign-in',
    usersController.signIn);
userRouter.post('/email-validation',
    usersController.emailValidation);
userRouter.post('/reset-password',
    requestLimiter,
    usersController.resetPassword);
userRouter.post('/change-password', enshureLetterToken,
    usersController.changePassword);

// dev routes
userRouter.get('/keys', usersController.generateSecretKeys);

module.exports = userRouter;
