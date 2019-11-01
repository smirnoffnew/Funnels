const express = require('express');
const commentRouter = express.Router();
// const CommentController = require('../controllers/commentController');
import CommentController from '../controllers/commentController'; 
const enshureToken = require('../libs/enshureToken.js');
const verifyToken = require('../libs/verifyToken.js');

commentRouter.post('/', enshureToken, verifyToken, CommentController.createComment);
commentRouter.get('/:funnelId', enshureToken, verifyToken, CommentController.getAllCommentsFunnel)
commentRouter.get('/node', enshureToken, verifyToken, CommentController.getAllCommentsNodeOfFunnel)

module.exports = commentRouter;