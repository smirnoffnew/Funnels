const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const activeCampaignApi = require('activecampaign-api');
const AC = require('activecampaign-rest');

const User = require('../models/user.js');
const Profile = require('../models/profile.js');
const sendEmail = require('../libs/sendEmail.js');
const validateEmail = require('../libs/validateEmail.js');
const keygen = require('../libs/keygen.js');

/**signup variables */
let g_profile, g_token;

/**signin variables */
let g_user;

module.exports = {
    signUp: function (req, res) {
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            password: req.body.password,
            email: req.body.email.toLowerCase(),
            firstName: req.body.firstName,
            accountName: req.body.accountName
        });
        user.save()
            .then(() => {
                const profile = new Profile({
                    _id: new mongoose.Types.ObjectId(),
                    password: user.password,
                    limited: user.limited,
                    email: user.email,
                    firstName: user.firstName,
                    accountName: user.accountName,
                    description: req.body.description || null
                });
                profile.save()
                return profile
            })
            .then((profile) => {
                console.log(profile)
                const token = jwt.sign({
                    profile,
                    userId: user._id
                }, process.env.SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRES
                });
                g_token = token;
                return profile
            })
            .then((profile) => {
                g_profile = profile;
                try {
                    return new activeCampaignApi.ApiClient({
                        accountName: process.env.CAMPAING_ACCOUNT_NAME,
                        key: process.env.CAMPAING_ACCOUNT_KEY
                    })
                        .call('contact_add', {}, 'POST', {
                            email: profile.email,
                            first_name: profile.firstName,
                            tags: profile.description,
                            'p[15]': process.env.LISTID
                        })

                } catch (err){
                    throw new Error('Active Campaign Api broken')
                }
            })
            .then((response) => {
                res.status(200).json({
                    data: {
                        _id: g_profile._id,
                        firstName: g_profile.firstName,
                        limited: g_profile.limited,
                        email: g_profile.email,
                        description: g_profile.description,
                        photoUrl: g_profile.photoUrl,
                        accountName: g_profile.accountName
                    },
                    token: `Bearer ${g_token}`,
                    responseApi: response,
                });
            })
            .catch(err => {
                console.log('Error...', err);
                res.status(404).json({
                    message: 'activeCampaignApi error',
                    data: err,
                })
            })
    },
    signIn: function (req, res) {
        const emailFromUser = req.body.email.toLowerCase()
        const checkEmailFromUser = validateEmail(emailFromUser);
        let _token;
        let _profile;

        let apiResponse = '';
        if (checkEmailFromUser) {
                User.findOne({
                        email: emailFromUser
                    }).exec()
                    .then(user => {
                        if (user && bcrypt.compareSync(req.body.password, user.password)) {
                            g_user = user;
                            return user
                        } else {
                            throw 'email not found or password is wrong'
                        }
                    })
                    .then(() => {
                        return Profile.findOne({
                            email: emailFromUser
                        }).exec()
                    })
                    .then(profile => {
                        if (profile) {
                            let today = new Date();
                            let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();
                            let contact = new AC.Contact({
                                'url': 'https://vladhuntyk.activehosted.com',
                                'token': process.env.CAMPAING_ACCOUNT_KEY
                            });
                            let payload = {
                                'email': profile.email,
                                'firstName': profile.firstName,
                                'lastName': profile.lastName,
                                'phone': profile.phone,
                                'fields': [{
                                    'name': 'Last Active',
                                    'value': date
                                }, ]
                            };
                            const token = jwt.sign({
                                profile,
                                userId: g_user._id
                            }, process.env.SECRET, {
                                expiresIn: process.env.TOKEN_EXPIRES
                            });

                            _profile = profile;
                            _token = token;

                            return new Promise((resolve, reject)=>{
                                contact.sync(payload, (err, res) => err ? reject(err) : resolve(res));
                            })

                        } else {
                            throw 'error in profile'
                        }
                    })
                    .then(()=>{
                        return {
                            profile:_profile,
                            token: _token
                        }
                    })
                    .then((obj) => {
                        res.status(200).json({
                            data: {
                                _id: obj.profile._id,
                                firstName: obj.profile.firstName,
                                email: obj.profile.email,
                                description: obj.profile.description,
                                photoUrl: obj.profile.photoUrl,
                                accountName: obj.profile.accountName
                            },
                            token: `Bearer ${obj.token}`,
                        })
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    })
            }
            else {throw 'email is required'}
    },
    emailValidation: async function (req, res) {
        const emailTest = req.body.email.toLowerCase();
        User.findOne({
                email: emailTest
            })
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(302).json({
                        message: "email already exists!"
                    });
                } else {
                    res.status(404).json({
                        message: "email is free"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    err
                });
            });
    },
    resetPassword: async function (req, res) {
        const emailReset = req.body.email.toLowerCase();
        User.findOne({
                email: emailReset
            })
            .exec()
            .then(user => {

                if (user) {
                    const token = jwt.sign({
                        email: user.email
                    }, process.env.SECRET_LETTER, {
                        expiresIn: process.env.TOKEN_EXPIRES_LETTER
                    });
                    const options = sendEmail.getMailoptions(user.email, user.firstName, token);
                    sendEmail.transporter.sendMail(options, (err, info) => {
                        if (err) {
                            console.log(err);
                            res
                                .status(500)
                                .json({
                                    message: "Email not send!",
                                    data: err
                                })
                        } else {
                            res.status(201).json({
                                message: "Email sended!",
                                //token: token,
                            });
                        }
                    });
                } else {
                    res.status(404).json({
                        message: "email doesn't exists in DB"
                    });
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err.message
                });
            });
    },
    changePassword: async function (req, res) {
        jwt.verify(req.token, process.env.SECRET_LETTER, (err, authData) => {
            if (err) {
                return res.status(403).send("No authority");
            }
            const decodedJwt = jwt.decode(req.token, {
                complete: true
            });
            const passwordChange = bcrypt.hashSync(req.body.password, 10);
            User.updateOne({
                    email: decodedJwt.payload.email
                }, {
                    password: passwordChange
                })
                .exec()
                .then(user => {
                    if (user) {
                        Profile.updateOne({
                                email: req.body.email
                            }, {
                                password: passwordChange
                            })
                            .exec()
                            .then(profile => {
                                if (profile) {
                                    res.status(200).json({
                                        message: "Password updated successfully!!"
                                    });
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                });
                            });
                    } else {
                        res.status(404).json({
                            message: "email doesn't exists"
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err.message
                    });
                });
        });

    },
    generateSecretKeys: async function (req, res) {
        res.json({
            secretKey: keygen(20),
            secretKeyEmail: keygen(20)
        });
    },


};
