const Comments = require('../models/comments');
const Profile = require('../models/profile');
const Funnel = require('../models/funnel');


module.exports = {
    createComment: async function (req, res) {
        Comments.create({
                userId: req.authData.profileId,
                funnelId: req.body.funnelId,
                comment: req.body.comment,
                createdAt: new Date()
            })
            .then(comment => {
                return Funnel
                    .findOneAndUpdate({
                        _id: req.body.funnelId
                    }, {
                        $push: {
                            funnelComments: comment._id
                        }
                    }, {
                        new: true
                    })
                    .exec()
            })
            .then(() => {
                res.status(200).json({
                    message: "Comment created successfully"
                });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            })
    },
    getAllCommentsFunnel: async function (req, res) {
        Comments.find({
                funnelId: req.params.funnelId,
            }).exec()
            .then(comments => {
                return Promise.all(
                    comments.map(comment => {
                        return Profile.findOne({
                                _id: comment.userId
                            }).exec()
                            .then(profile => {
                                return {
                                    'user_id': profile._id,
                                    'user_accountName': profile.accountName,
                                    'user_photoUrl': profile.photoUrl,
                                    'comment': comment.comment,
                                    'createdAt': comment.createdAt
                                }
                            })
                    })
                )

            })
            .then(results => res.status(200).json({
                "message": "success",
                commentsList: results
            }))
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            })
    }
}