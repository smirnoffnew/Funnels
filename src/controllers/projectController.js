const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const Project = require('../models/project.js');
const Profile = require('../models/profile.js');
const Funnel = require('../models/profile.js');


module.exports = {
    createProject: async function (req, res) {
        Project.count({projectAuthor: req.authData.profile._id})
            .exec()
            .then(result => {
                if (result >= process.env.PROJECT_LIMIT &&  req.authData.profile.limited == true) {
                    res
                        .status(400)
                        .json({error: "Project creation limit is reached!"});
                }
                else{
                    new Project({
                        _id: new mongoose.Types.ObjectId(),
                        projectAuthor: req.authData.profile._id,
                        ...req.body
                    })
                        .save()
                        .then(project => {
                            const limit = req.authData.profile.limited == true ? ` ${process.env.PROJECT_LIMIT}` : null;
                            res
                                .status(200)
                                .json({
                                    message: "Project created successfully!",
                                    data: project,
                                    limit:limit
                                });
                        })
                        .catch(err => {
                            res
                                .status(400)
                                .json({error: err.message});
                        });
                }
            })
            .catch(err => {
                res
                    .status(400)
                    .json({error: err.message});
            });
    },
    deleteProject: async function (req, res) {
        Promise
            .all([
                Project
                    .deleteOne({_id: req.params.project_id, projectAuthor: req.authData.profile._id})
                    .exec(),
                Funnel
                    .deleteMany({funnelProject: req.params.project_id})
                    .exec()
            ])
            .then(() => {

                res
                    .status(200)
                    .json({message: "project deleted successfully!"});
            })
            .catch(err => {
                res
                    .status(500)
                    .json({error: err.message});
            });

    },
    getAllUserProject: async function (req, res) {
        Project
            .find({projectAuthor: req.authData.profile._id})
            .exec()
            .then(projects => {
                const limit = req.authData.profile.limited == true ? ` ${process.env.PROJECT_LIMIT}` : null;
                res
                    .status(200)
                    .json({
                        data: projects,
                        limit: limit
                    });
            })
            .catch(err => {
                res
                    .status(500)
                    .json({error: err.message});
            });

    },

    addCollaborator: async function (req, res) {
        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                console.log(req.headers);
                return res.status(403).send("No authority");
            }
            const projectId = req.params.project_id;
            Profile
                .findOne({firstName: req.body.firstName})
                .exec()
                .then(profile => {
                    if (profile) {
                        const collaborator = {
                            _id: profile._id,
                            firstName: profile.firstName,
                            permissions: req.body.permissions
                        };
                        Project
                            .updateOne({
                                _id: projectId,
                                projectAuthor: authData.profile._id
                            }, {$push: {collaborators: collaborator}})
                            .exec()
                            .then(project => {
                                if (project.nModified != 0) {
                                    res.status(200).json({message: "Collaborator added successfully!"});
                                } else {
                                    res.status(404).json({message: 'Project not found or you have no permissions to add collaborators'});
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err.message});
                            });
                    } else {
                        res.status(404).json({message: 'Collaborator not found'});
                    }

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err.message});
                });
        });
    },
    deleteCollaborator: async function (req, res) {
        jwt.verify(req.token, process.env.SECRET, (err, authData) => {
            if (err) {
                return res.status(403).send("No authority");
            }
            const projectId = req.params.project_id;
            const collaboratorId = mongoose.Types.ObjectId(req.params.col_id);
            Project.updateOne({_id: projectId, projectAuthor: authData.profile._id},
                {$pull: {collaborators: {_id: collaboratorId}}})
                .exec()
                .then(project => {
                    if (project.nModified != 0) {
                        res.status(200).json({message: "Collaborator deleted successfully!"});
                    } else {
                        res.status(404).json({
                            message: "Collaborator not found or you have no permissions to delete it!",
                            data: project
                        });
                    }

                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err.message});
                });

        });
    },


};
