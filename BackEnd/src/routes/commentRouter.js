const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentController.js'); 
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');

commentRouter.post('/', enshureToken, verifyToken, commentController.createComment);
commentRouter.get('/:funnelId', enshureToken, verifyToken, commentController.getAllCommentsFunnel);
module.exports = commentRouter;