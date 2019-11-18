const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const fs = require("fs");

const Funnel = require('../models/funnel.js');
const Project = require('../models/project.js');
const Token = require('../models/colaboratetoken.js');
const Template = require('../models/template.js');
const NodeCounter = require('../models/nodes')
const svgArray = require('../libs/svgArray.js');
const Profile = require('../models/profile');

const ColDataInfo = require('../models/col-data-info');

const fetch = require('node-fetch');
const FormData = require('form-data');

const backgroundbufferDir = process.env.BACKGROUNDBUFFER_DIR;
const screenShotBufferDir = process.env.SCREENSHOTBUFFER_DIR;

let _profile;

const {
    base64encode,
    base64decode
} = require('nodejs-base64');

module.exports = {

    createFunnel: async function (req, res) {
        let savedFunnel, funnelCounter;

        Profile
            .findOne({
                _id: req.authData.profileId
            })
            .exec()
            .then(profile => {
                _profile = profile
                Project.findOne({
                        _id: req.params.projectId
                    })
                    .exec()
                    .then(result => {
                        if (result.projectFunnels.length >= process.env.FUNNEL_LIMIT && _profile.limited == true) {
                            res
                                .status(400)
                                .json({
                                    error: "Funnel creation limit is reached!"
                                })
                        } else {
                            new Funnel({
                                    _id: new mongoose.Types.ObjectId(),
                                    funnelAuthor: _profile._id,
                                    funnelProject: req.params.projectId,
                                    funnelName: req.body.funnelName,
                                    funnelBody: req.body.funnelBody
                                })
                                .save()
                                .then(funnel => {
                                    savedFunnel = funnel;
                                    Project
                                        .findOneAndUpdate({
                                            _id: req.params.projectId
                                        }, {
                                            $push: {
                                                projectFunnels: funnel._id
                                            }
                                        }, {
                                            new: true
                                        })
                                        .exec()
                                        .then((result) => {
                                            funnelCounter = result.projectFunnels.length;
                                        })
                                })
                                .then(() => {
                                    const limit = _profile.limited == true ? ` ${process.env.FUNNEL_LIMIT}` : null;
                                    res
                                        .status(200)
                                        .json({
                                            message: "Funnel added successfully!",
                                            data: savedFunnel,
                                            limit: limit
                                        })
                                        .catch(err => {
                                            res
                                                .status(400)
                                                .json({
                                                    error: err.message
                                                });
                                        });
                                })
                                .catch(err => res.status(400).json({
                                    error: err.message
                                }));
                        }
                    })
            })


            .catch(err => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    });
            });


    },
    getAllFunnelsInProject: async function (req, res) {
        Profile
            .findOne({
                _id: req.authData.profileId
            })
            .exec()
            .then(profile => {
                _profile = profile;
                return Funnel
                    .find({
                        funnelProject: req.params.projectId
                    })
                    .exec()
            })
            .then(funnels => {
                const limit = _profile.limited == true ? ` ${process.env.FUNNEL_LIMIT}` : null;
                res
                    .status(200)
                    .json({
                        data: funnels,
                        limit: limit
                    });
            })
            .catch(err => {
                res
                    .status(400)
                    .json({
                        error: err.message
                    });
            });

    },
    deleteFunnel: async function (req, res) {
        Promise
            .all([
                Funnel
                .findOneAndDelete({
                    _id: req.params.funnelId,
                    funnelAuthor: req.authData.profileId
                })
                .exec(),
                Project
                .updateOne({
                    _id: req.params.projectId
                }, {
                    $pull: {
                        projectFunnels: req.params.funnelId
                    }
                })
                .exec()

            ])
            .then(() => {
                res
                    .status(200)
                    .json({
                        message: "Funnel deleted successfully!"
                    });
            })
            .catch(err => res.status(400).json({
                error: err.message
            }));
    },
    createUrlForCollaborate: async function (req, res) {
        Profile
            .findOne({
                _id: req.authData.profileId
            })
            .exec()
            .then(profile => {
                _profile = profile;
                const funnelColaborateData = {
                    funnelsId: req.body.funnelsId,
                    permissions: req.body.permissions
                };
                const collaborateToken = jwt.sign(funnelColaborateData, process.env.SECRET_COLLABORATOR);
                return new Token({
                        body: collaborateToken
                    })
                    .save()
            })
            .then((token) => {
                const request = _profile.limited == true ? `No authority to collaborate` : `${process.env.PROD_URL}/add-collaborators/${token.body}`;
                res
                    .status(200)
                    .json({
                        data: request,
                        //token: token.body
                    });
            })
            .catch(err => res.status(400).json({
                error: err.message
            }));


    },
    getAllCollaboratedToUserFunnels: async function (req, res) {
        Funnel.find({
                collaborators: {
                    $elemMatch: {
                        profileId: req.authData.profileId
                    }
                }
            })
            .exec()
            .then(funnels => {
                res
                    .status(200)
                    .json({
                        data: funnels,
                        user: req.authData.profileId
                    });
            })
            .catch(err => res.status(400).json({
                error: err.message
            }));
    },
    addFunnelDiagramAndBackground: async function (req, res) {
        Funnel
            .findOne({
                _id: req.params.funnelId
            })
            .exec()
            .then((funnel) => {
                const data = new FormData();
                data.append('funnelId', funnel._id.toString());
                data.append('img', fs.createReadStream(`${backgroundbufferDir}/${req.authData.profileId}.jpg`));
                return fetch(`${process.env.FILE_SHARER}/backgrounds`, {
                    method: 'POST',
                    body: data
                })
            })
            .then(result => result.json())
            .then((result) => {
                return Funnel
                    .findOneAndUpdate({
                        _id: req.params.funnelId
                    }, {
                        funnelBackground: result.link,
                        funnelBody: req.body.funnelBody
                    }, {
                        new: true
                    })
                    .exec()
            })
            .then((result) => {
                fs.readdir(backgroundbufferDir, function (err, items) {
                    if (err) {
                        throw new Error('can not read folder')
                    }
                    if (items) {
                        try {
                            fs.unlinkSync(`${backgroundbufferDir}/${req.authData.profileId}.jpg`)
                        } catch (error) {
                            console.log(error)
                        }
                    }
                    res.status(200).json({
                        message: "Funnel updated succesfully...",
                        data: result
                    })

                });

            })
            .catch(err => {
                console.log(err)
                res.status(400).json({

                    error: err.message
                })
            });
    },
    getFunnelById: async function (req, res) {
        Funnel
            .findOne({
                _id: req.params.funnelId
            }, )
            .exec()
            .then(funnel => {
                res
                    .status(200)
                    .json({
                        data: funnel
                    });
            })
            .catch(err => res.status(400).json({
                error: err.message
            }));
    },
    getScreenshot: async function (req, res) {

        const Url = process.env.NODE_ENV == 'dev' ? process.env.DEV_URL : process.env.PROD_URL;

        let infoObj = new ColDataInfo({
            logo: req.body.info.logo,
            title: req.body.info.title,
            text: req.body.info.text,
            buttonText: req.body.info.buttonText,
            buttonLink: req.body.info.buttonLink
        });

        let collaborateToken;
        let screenShotLink;
        let funnelColaborateData;

        infoObj.validate()
            .then(() => {
                return funnelColaborateData = {
                    funnelsId: [req.body.funnelsId],
                    permissions: req.body.permissions,
                    info: infoObj,
                    userId: req.authData.userId,
                    profileId: req.authData.profileId
                };
            })
            .then(funnelColaborateData => {
                collaborateToken = jwt.sign(funnelColaborateData, process.env.SECRET_COLLABORATOR);
                const data = new FormData();
                data.append('funnelsId', req.body.funnelsId);
                data.append('img', fs.createReadStream(`${screenShotBufferDir}/${req.authData.profileId}.jpg`));
                return fetch(`${process.env.FILE_SHARER}/screenshots`, {
                    method: 'POST',
                    body: data
                })
            })
            .then(result => result.json())
            .then(res => {
                screenShotLink = res.link;
                funnelColaborateData.screenShotURL = screenShotLink
            })
            .then(() => {
                return new Token({
                    body: collaborateToken
                }).save()

            })
            .then((token) => {
                res
                    .status(200)
                    .json({
                        message: "Screenshot added succesfully...",
                        link: `${Url}/add-collaborators-image?image=${screenShotLink}&add-collaborators-image=${token.body}&funnelId=${req.body.funnelsId}`,
                        token: token.body,
                    });
            })
            .then(() => {
                try {
                    fs.unlinkSync(`${screenShotBufferDir}/${req.authData.profileId}.jpg`)
                } catch (err) {
                    console.log(err)
                }
            })
            .catch(err => {
                try {
                    fs.unlinkSync(`${screenShotBufferDir}/${req.authData.profileId}.jpg`)
                    res.status(400).json({
                        error: err.message
                    })
                } catch (err) {
                    console.log(err)
                }
            });
    },
    getSignInToken: function (req, res) {
        new Promise((resolve, reject) => {
                console.log(req.headers.authorization)
                jwt.verify(req.headers.authorization, process.env.SECRET_COLLABORATOR, (err, authData) => {
                    err ? reject({
                        message: 'Invalid token'
                    }) : resolve(authData);
                })
            })
            .then(authData => {
                let token = jwt.sign({
                    profileId: authData.profileId,
                    userId: authData.userId
                }, process.env.SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRES
                });
                res.status(200).json({
                    message: token,
                    info: authData.info
                });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    createFunnelTemplate: async function (req, res) {
        const templateId = req.params.templateId;
        let projectId;
        Promise
            .all([
                Template.findOne({
                    _id: templateId
                })
                .exec(),

                Project.findOne({
                    projectName: req.body.projectName
                })
                .exec()
            ])
            .then(results => {
                //res.json(results);
                if (results[1] != null) {
                    projectId = results[1]._id;
                    new Funnel({
                            _id: new mongoose.Types.ObjectId(),
                            funnelAuthor: req.authData.profileId,
                            funnelProject: results[1]._id,
                            funnelName: results[0].templateName,
                            funnelBody: results[0].templateBody
                        })
                        .save()
                        .then(funnel => {
                            res.json(funnel);
                            return Project
                                .findOneAndUpdate({
                                    _id: projectId
                                }, {
                                    $push: {
                                        projectFunnels: funnel._id
                                    }
                                }, {
                                    new: true
                                })
                                .exec()
                        })
                        .then(funnel => {
                            res
                                .status(200)
                                .json({
                                    message: "Funnel created from template successfully!",
                                    data: funnel
                                })
                        })

                } else {
                    new Project({
                            _id: new mongoose.Types.ObjectId(),
                            projectAuthor: req.authData.profileId,
                            projectName: req.body.projectName
                        })
                        .save()
                        .then(project => {
                            new Funnel({
                                    _id: new mongoose.Types.ObjectId(),
                                    funnelAuthor: req.authData.profileId,
                                    funnelProject: project._id,
                                    funnelName: results[0].templateName,
                                    funnelBody: results[0].templateBody
                                })
                                .save()
                                .then(funnel => {
                                    return Project
                                        .findOneAndUpdate({
                                            _id: project._id
                                        }, {
                                            $push: {
                                                projectFunnels: funnel._id
                                            }
                                        }, {
                                            new: true
                                        })
                                        .exec()
                                })
                                .then(funnel => {
                                    res
                                        .status(200)
                                        .json({
                                            message: "Funnel created from template successfully!",
                                            data: funnel
                                        })
                                })
                                .catch(err => {
                                    res
                                        .status(500)
                                        .json({
                                            error: err.message
                                        });
                                });
                        })
                        .catch(err => res.status(400).json({
                            error: err.message
                        }));
                }

            })
            .catch(err => res.status(400).json({
                error: err.message
            }));

    },
    getFunnelsSvg: async function (req, res) {
        const response = svgArray();
        res
            .status(200)
            .json({
                response,
                count: response.length
            });
    },
    updateFunnel: async function (req, res) {
        const updateObject = {
            ...req.body
        };
        Funnel
            .updateOne({
                    _id: req.params.funnelId
                },
                updateObject, {
                    new: true
                })
            .exec()
            .then(funnel => {
                res
                    .status(200)
                    .json({
                        message: 'Funnel updated successfully!'
                    });
            })
            .catch(err => res.status(400).json({
                error: err.message
            }));
    },

    createUrl: async function (req, res) {

        try {

            // `http://31dcf688.ngrok.io/funnel/node/${base64encode(req.body.url)}/${req.body.funnelId}`
            let random = Math.random().toString(36).substring(2);

            // let url = `https://funnelsmapbackend.qbex.io/funnel/node/${random}`;
            //let url = `http://${req.hostname}:${process.env.PORT}/funnel/node/${random}`;
            let url = `http://${req.hostname}:9001/funnel/node/${random}`;
            // let url =`https://api.funnelsmap.com/funnel/node/${random}`;
            let originalUrl = req.body.url

            let response = await NodeCounter.findOneAndUpdate({
                funnelId: req.body.funnelId,
                nodeId: req.body.elementId
            }, {
                counterUrl: 0,
                nodeId: req.body.elementId,
                hash: random,
                url: url,
                originalUrl: originalUrl
            }, {
                new: true
            });
            if (response === null) {
                await NodeCounter.create({
                    funnelId: req.body.funnelId,
                    nodeId: req.body.elementId,
                    counterUrl: 0,
                    counterNode: 0,
                    hash: random,
                    url: url,
                    originalUrl: originalUrl
                })
            }

            res.status(200).json({
                message: "Updated successfully",
                url: url
            })

        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    getNodeStatus: async function (req, res) {

        try {
            let response = await NodeCounter.findOne({
                funnelId: req.params.funnelId,
                nodeId: req.params.nodeId
            });

            if (response === null) {
                await NodeCounter.create({
                    funnelId: req.params.funnelId,
                    nodeId: req.params.nodeId
                })
            } else {
                res.status(200).json({
                    status: response.status
                });
            }

            // res.status(200).json({ status: response.status });
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    updateStatus: async function (req, res) {
        try {

            req.body.status !== '' ? req.body.status = req.body.status.toUpperCase() : req.body.status = 'DEFAULT';

            let response = await NodeCounter.findOneAndUpdate({
                funnelId: req.body.funnelId,
                nodeId: req.body.nodeId
            }, {
                status: req.body.status
            }, {
                new: true
            }).exec();
            if (!response) {
                response = await NodeCounter.create({
                    funnelId: req.body.funnelId,
                    nodeId: req.body.nodeId,
                    counterUrl: 0,
                    counterNode: 0,
                    status: req.body.status,
                    hash: Math.random().toString(36).substring(2),
                    url: "",
                    originalUrl: ""
                });
                res.status(200).json(response.status);
            }
            res.status(200).json(response.status)
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }

    },

    counterUrl: async function (req, res) {
        try {

            let funnel = await NodeCounter.findOne({
                hash: req.params.hash
            })

            if (funnel === null) {
                return res.status(404).json({
                    message: "Funnel not found"
                })
            }

            await NodeCounter.findOneAndUpdate({
                funnelId: funnel.funnelId,
                nodeId: funnel.nodeId
            }, {
                $inc: {
                    counterUrl: 1
                }
            })

            res.writeHead(301, {
                Location: funnel.originalUrl,
                "Cache-Control": "no-cache"
            });

            res.end();

        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    counterNode: async function (req, res) {
        try {

            let response = await NodeCounter.findOneAndUpdate({
                funnelId: req.body.funnelId,
                nodeId: req.body.nodeId
            }, {
                $inc: {
                    counterNode: 1
                }
            })

            if (response === null) {
                await NodeCounter.create({
                    funnelId: req.body.funnelId,
                    nodeId: req.body.nodeId,
                    counterNode: 1
                });
            }

            res.status(200).json({
                message: "Success"
            })
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    getCounterByIdNodeAndIdFunnel: async function (req, res) {
        try {

            let counter = await NodeCounter.findOne({
                funnelId: req.body.funnelId,
                nodeId: req.body.nodeId
            });

            if (counter === null) {
                return res.status(403).json({
                    message: "Not found"
                })
            }

            res.status(200).json({
                message: "Success",
                counterUrl: counter.counterUrl,
                counterNode: counter.counterNode,
                nodeDescription: counter.nodeDescription
            })
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    deleteNodeById: async function (req, res) {
        try {

            await NodeCounter.findOneAndRemove({
                nodeId: req.params.nodeId,
                funnelId: req.params.funnelId
            })

            res.status(200).json({
                message: "Success"
            })
        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    getCounterByIdFunnel: async function (req, res) {
        try {
            let response = await NodeCounter.find({
                funnelId: req.params.funnelId
            });

            res.status(200).json({
                response
            });

        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    },

    getAllFunnelsNodeDevStatus: async function (req, res) {
        try {
            let response = await NodeCounter.find({
                    funnelId: req.params.funnelId
                })
                .select('nodeId status -_id')


            res.status(200).json({
                response
            });

        } catch (err) {
            res.status(400).json({
                error: err.message
            })
        }
    }

};