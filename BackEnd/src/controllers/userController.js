const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/user.js');
const Profile = require('../models/profile.js');
const sendEmail = require('../libs/sendEmail.js');
const validateEmail = require('../libs/validateEmail.js');
const keygen = require('../libs/keygen.js');
const deviceCheck = require('../libs/deviceCheck.js')


const rp = require('request-promise');
const url = `https://${process.env.CAMPAING_ACCOUNT_NAME}.api-us1.com/api/3/`
const headers = {
    "Api-Token": process.env.CAMPAING_ACCOUNT_KEY
};
const method = 'POST';
let userAC;
let today = new Date();
let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear();


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
                profile.save();
                g_profile = profile;
                return profile
            })
            .then((profile) => {
                const token = jwt.sign({
                    profileId: profile._id.toString(),
                    userId: user._id
                }, process.env.SECRET, {
                    expiresIn: process.env.TOKEN_EXPIRES
                });
                g_token = token;
                return profile
            })
            .then((profile) => {
                return rp({
                    method,
                    headers,
                    url: `${url}contacts`,
                    json: true,
                    body: {
                        "contact": {
                            "email": profile.email,
                            "firstName": profile.firstName,
                            'tags': profile.description,
                            'p[15]': process.env.LISTID,
                        }
                    }
                })

            })
            .then(body => {
                return rp({
                    method,
                    headers,
                    url: `${url}fieldValues`,
                    body: JSON.stringify({
                        fieldValue: {
                            contact: body.contact.id,
                            field: 6,
                            value: deviceCheck(req)
                        }
                    })
                })
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
                    responseApi: 'Registered successfully',
                });
            })
            .catch(err => {
                console.log(err)
                res.status(400).json({
                    error: err.message
                })
            });
    },
    signIn: function (req, res) {
        const emailFromUser = req.body.email.toLowerCase()
        const checkEmailFromUser = validateEmail(emailFromUser);

        let _token;
        let _profile;

        if (checkEmailFromUser) {
            User.findOne({
                    email: emailFromUser
                })
                .exec()
                .then(user => {
                    if (user && bcrypt.compareSync(req.body.password, user.password)) {
                        g_user = user;
                        return user
                    } else {
                        throw new Error('email not found or password is wrong')
                    }
                })
                .then(() => {
                    return Profile.findOne({
                        email: emailFromUser
                    }).exec()
                })
                .then(profile => {
                    _token = jwt.sign({
                        profileId: profile._id.toString(),
                        userId: g_user._id
                    }, process.env.SECRET, {
                        expiresIn: process.env.TOKEN_EXPIRES
                    });
                    _profile = profile;
                    let options = {
                        headers,
                        url: `${url}contact/sync`,
                        method,
                        body: JSON.stringify({
                            "contact": {
                                "email": profile.email,
                            }
                        })
                    };
                    return rp(options)
                })
                .then(body => {
                    userAC = JSON.parse(body).contact.id
                    rp({
                        method,
                        headers,
                        url: `${url}fieldValues`,
                        body: JSON.stringify({
                            fieldValue: {
                                contact: userAC,
                                field: 6,
                                value: deviceCheck(req)
                            }
                        })
                    })
                })
                .then(() => {
                    rp({
                        method,
                        headers,
                        url: `${url}fieldValues`,
                        body: JSON.stringify({
                            fieldValue: {
                                contact: userAC,
                                field: 4,
                                value: date
                            }
                        })
                    })
                })
                .then(() => {
                    let profile = _profile;
                    let token = _token;
                    res.status(200).json({
                        data: {
                            _id: profile._id,
                            firstName: profile.firstName,
                            email: profile.email,
                            description: profile.description,
                            photoUrl: profile.photoUrl,
                            accountName: profile.accountName
                        },
                        token: `Bearer ${token}`,
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(400).json({
                        error: err.message
                    })
                });
        } else {
            throw 'email is required'
        }
    },

    emailValidation: function (req, res) {
        User.findOne({
                email: req.body.email.toLowerCase()
            })
            .exec()
            .then(doc => {
                if (doc) {
                    throw new Error('email already exists!')
                } else {
                    res.json({
                        message: "email is free"
                    });
                }
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    resetPassword: function (req, res) {
        User.findOne({
                email: req.body.email.toLowerCase()
            })
            .exec()
            .then(user => {
                if (!user) {
                    throw new Error('email does not exists in DB')
                } else {
                    const token = jwt.sign({
                        email: user.email
                    }, process.env.SECRET_LETTER, {
                        expiresIn: process.env.TOKEN_EXPIRES_LETTER
                    });
                    const options = sendEmail.getMailoptions(user.email, user.firstName, token);
                    return new Promise((resolve, reject) => {
                        sendEmail.transporter.sendMail(options, (err, info) => err ? reject(err) : resolve(res));
                    })
                }
            })
            .then(() => {
                res.status(201).json({
                    message: "Email sent!",
                    //token: token,
                });
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    changePassword: function (req, res) {
        const passwordChange = bcrypt.hashSync(req.body.password, 10);
        const decodedJwtEmail = jwt.decode(req.token, {
            complete: true
        }).payload.email;

        new Promise((resolve, reject) => {
                jwt.verify(req.token, process.env.SECRET_LETTER, (err, authData) => err ? reject(err) : resolve(res));
            })
            .then(() => {
                console.log(decodedJwtEmail)
                return User.updateOne({
                    email: decodedJwtEmail
                }, {
                    password: passwordChange
                }).exec()
            })
            .then((user) => {
                if (!user.nModified) {
                    throw new Error('Not found user with this email')
                } else {
                    return Profile.updateOne({
                            email: decodedJwtEmail
                        }, {
                            password: passwordChange
                        })
                        .exec()
                }
            })
            .then((profile) => {
                if (!profile.nModified) {
                    throw new Error('Not found profile with this email')
                } else {
                    res.status(200).json({
                        message: "Password updated successfully!!"
                    });
                }

            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            });
    },

    generateSecretKeys: function (req, res) {
        res.json({
            secretKey: keygen(20),
            secretKeyEmail: keygen(20)
        });

    },

};