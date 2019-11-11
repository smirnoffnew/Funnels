const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const fs = require("fs");


const Funnel = require('../models/funnel.js');
const Profile = require('../models/profile.js');
const Token = require('../models/colaboratetoken.js');


module.exports = {
    changeCollaboratorPermissions: async function (req, res) {
        const profileId = req.params.profileId;
        const funnelId = req.params.funnelId;
        const permissionToChange = req.body.permissions == "View Only" ? "Edit" : "View Only";
        Promise
            .all([
                Profile
                .findOneAndUpdate({
                    _id: profileId,
                    "myCollaborations.funnelId": funnelId
                }, {
                    $set: {
                        "myCollaborations.$.permissions": permissionToChange
                    }
                })
                .exec(),
                Funnel
                .findOneAndUpdate({
                    _id: funnelId,
                    "collaborators.profileId": profileId
                }, {
                    $set: {
                        "collaborators.$.permissions": permissionToChange
                    }
                })
                .exec(),

            ])
            .then(result => {
                res
                    .status(200)
                    .json({
                        message: "permissions changed successfully!"
                    });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },
    deleteCollaborator: async function (req, res) {
        const profileId = req.params.profileId;
        const funnelId = req.params.funnelId;
        Promise
            .all([
                Profile
                .findOneAndUpdate({
                    _id: profileId,
                    "myCollaborations.funnelId": funnelId
                }, {
                    $pull: {
                        myCollaborations: {
                            funnelId: funnelId
                        }
                    }
                })
                .exec(),
                Funnel
                .findOneAndUpdate({
                    _id: funnelId,
                    "collaborators.profileId": profileId
                }, {
                    $pull: {
                        collaborators: {
                            profileId: profileId
                        }
                    }
                })
                .exec(),

            ])
            .then(() => {
                res
                    .status(200)
                    .json({
                        message: "Collaborator deleted successfully!"
                    });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },
    createCollaborator: async function (req, res) {
        const decodedJwtCollaborate = jwt.decode(req.collaborate_confirm, {
            complete: true
        });
        const decodedJwtAuthorization = jwt.decode(req.token, {
            complete: true
        });
        //res.json({colconfirm: decodedJwtCollaborate, url: `src/${decodedJwtCollaborate.payload.screenShotURL}`});
        const funnelsIdArray = decodedJwtCollaborate.payload.funnelsId;

        const collaboratorForFunnel = {
            profileId: decodedJwtAuthorization.payload.profile._id,
            permissions: decodedJwtCollaborate.payload.permissions,
            funnelId: decodedJwtCollaborate.payload.funnelsId
        };


        Promise
            .all([

                Profile.updateOne({
                    _id: decodedJwtAuthorization.payload.profile._id
                }, {
                    $push: {
                        myCollaborations: funnelsIdArray.map(funnelId => {
                            return {
                                permissions: decodedJwtCollaborate.payload.permissions,
                                funnelId: funnelId,
                                funnel: mongoose.Types.ObjectId(funnelId)
                            }
                        })
                    }
                }).exec(),

                Funnel.updateMany({
                        '_id': {
                            $in: decodedJwtCollaborate.payload.funnelsId
                        }
                    },
                    // {$push: {collaborators: collaboratorForFunnel}}
                    {
                        $push: {
                            collaborators: funnelsIdArray.map(funnelId => {
                                return {
                                    permissions: decodedJwtCollaborate.payload.permissions,
                                    funnelId: funnelId,
                                    profileId: decodedJwtAuthorization.payload.profile._id
                                }
                            })
                        }
                    }
                )
                .exec(),
                Token.deleteOne({
                    body: req.collaborate_confirm
                })
                .exec()

            ])
            .then(result => {
                fs.unlink(`src/${decodedJwtCollaborate.payload.screenShotURL}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                res
                    .status(200)
                    .json({
                        message: "collaborator added successfully!"
                    });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },
    getAllFunnelsCollaborators: async function (req, res) {
        Profile
            .find({})
            .and(req.body.funnelsId.map(item => ({
                myCollaborations: {
                    $elemMatch: {
                        "funnelId": item
                    }
                }
            })))
            .populate({
                model: 'Funnel',
                path: 'myCollaborations.funnel',
            })
            .exec()
            .then(profiles => {
                return profiles.map(profile => {
                    return {
                        ...profile._doc,
                        myCollaborations: profile.myCollaborations.filter(element => req.body.funnelsId.indexOf(element.funnelId) > -1)
                    }
                });
            })
            .then(result =>
                res
                .status(200)
                .json(result))
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });

    },

    getAllCollaboratorsByFunnelId: async function (req, res) {
        const funnelId = req.params.funnelId;

        Funnel
            .find({
                "_id": funnelId
            })
            .populate({
                model: 'Profile',
                path: 'collaborators.profileId',

            }).
        populate({
                model: 'Profile',
                path: 'funnelAuthor'
            })
            .exec()
            .then(result => res.status(200).json(result))
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    }
};