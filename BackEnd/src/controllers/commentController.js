const Comments = require('../models/comments');
const Profile = require('../models/profile');
const Funnel = require('../models/funnel');

class CommentController {

    async createComment(req, res) {
        try {

            let comment = await Comments.create({
                userId: req.authData.profileId,
                funnelId: req.body.funnelId,
                comment: req.body.comment,
                itemId: req.body.itemId,
                createdAt: new Date()
            })

            res.status(200).json({ message: "Comment created successfully" });

        } 

        catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    }

    async getAllCommentsFunnel(req, res) {
        try {
            // console.log("AAAAAAAAAAAAAAAAAA : ", req.params.funnelId);
            let comments = await Comments.find({ funnelId: req.params.funnelId, itemId: '' });
            let user, funnel, commentsList = [], comment;

            for (let item of comments) {

                user = await Profile.findOne({ _id: item.userId });
                funnel = await Funnel.findOne({ _id: item.funnelId });

                // comment = {
                // 'user': user,
                // 'funnel': funnel,
                // 'comment': item.comment
                // }
                comment = {
                    'user_id': user._id,
                    // 'user_firstName': user.firstName,
                    'user_accountName': user.accountName,
                    'user_photoUrl': user.photoUrl,
                    // 'funnel_id': funnel._id,
                    // 'funnelName': funnel.funnelName,
                    'comment': item.comment,
                    'createdAt': item.createdAt
                }

                commentsList.push(comment);
            }

            res.status(200).json({ "message": "success", commentsList })
        } 
        catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    }

    async getAllCommentsNodeOfFunnel(req, res) {
        try {
            let comments = await Comments.find({ funnelId: req.body.funnelId, itemId: req.body.itemId });
            let user, funnel, commentsList = [], comment;

            for (let item of comments) {

                user = await Profile.findOne({ _id: item.userId });
                funnel = await Funnel.findOne({ _id: item.funnelId });

                comment = {
                    // 'user_id': user._id,
                    // 'user_firstName': user.firstName,
                    'user_accountName': user.accountName,
                    // 'funnel_id': funnel._id,
                    // 'funnelName': funnel.funnelName,
                    'comment': item.comment,
                    'createdAt': item.createdAt,
                    'itemId': item.itemId
                }

                commentsList.push(comment);
            }

            res.status(200).json({ "message": "success", commentsList })

        } 
      

        catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    }
}

export default new CommentController;