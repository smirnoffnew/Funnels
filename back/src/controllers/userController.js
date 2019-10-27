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

module.exports = {
    signUp: async function (req, res) {

        const user = await new User({
            _id: new mongoose.Types.ObjectId(),
            ...req.body
        });

        console.log(user)

        await user.email.toLowerCase();

        user.save()
            .then(doc => {
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
                    .then(profile => {
                        const token = jwt.sign({
                            profile,
                            userId: doc._id
                        }, process.env.SECRET, {expiresIn: process.env.TOKEN_EXPIRES});

                        new activeCampaignApi.ApiClient({
                            accountName: process.env.CAMPAING_ACCOUNT_NAME,
                            key: process.env.CAMPAING_ACCOUNT_KEY
                        })
                            .call('contact_add', {}, 'POST', {
                                email: profile.email,
                                first_name: profile.firstName,
                                tags: profile.description,
                                'p[15]': process.env.LISTID
                            })
                            .then(response => {
                                console.log(response);
                                res.status(200).json({
                                    data: {
                                        _id: profile._id,
                                        firstName: profile.firstName,
                                        limited: profile.limited,
                                        email: profile.email,
                                        description: profile.description,
                                        photoUrl: profile.photoUrl,
                                        accountName: profile.accountName
                                    },
                                    token: `Bearer ${token}`,
                                    responseApi: response,
                                });
                                res
                                    .status(200)
                                    .json({
                                        res_code: response.result_code,
                                        fullApiResponse: response,
                                    })
                            })
                            .catch(err => {
                                console.log('activeCampaignApi Error', err);
                                res
                                    .status(404)
                                    .json({
                                        message: 'activeCampaignApi error',
                                        data: err,
                                    })
                            })


                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).json({
                            errors: err,
                        });
                    })
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({err});
            })
    },
    signIn: async function (req, res) {
        await req.body.email.toLowerCase();
        const emailFromUser = await validateEmail(req.body.email);
        let apiResponse = '';
        if (emailFromUser) {
            User.findOne({email: req.body.email})
                .exec()
                .then(user => {

                        if (user && bcrypt.compareSync(req.body.password, user.password)) {
                            Profile.findOne({email: req.body.email})
                                .exec()
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
                                            'fields': [
                                                {
                                                    'name': 'Last Active',
                                                    'value': date
                                                },
                                            ]
                                        };
                                        contact.sync(payload, (err, res) => {
                                            if (err) {
                                                console.log("AC error", err)
                                                res
                                                    .status(404)
                                                    .json({
                                                        message: 'AC error',
                                                        data: err,
                                                    })
                                            }
                                            console.log(res);
                                        });
                                        const token = jwt.sign({
                                            profile,
                                            userId: user._id
                                        }, process.env.SECRET, {expiresIn: process.env.TOKEN_EXPIRES});

                                        res
                                            .status(200)
                                            .json({
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
                                    } else {
                                        const profile = new Profile({
                                            _id: new mongoose.Types.ObjectId(),
                                            password: user.password,
                                            email: user.email,
                                            firstName: user.firstName,
                                            accountName: user.accountName
                                        });
                                        profile.save()
                                            .then(profile => {
                                                const token = jwt.sign({
                                                    profile,
                                                    userId: user._id
                                                }, process.env.SECRET, {expiresIn: process.env.TOKEN_EXPIRES});
                                                res.status(200).json({
                                                    data: profile,
                                                    token: `Bearer ${token}`
                                                });
                                            })
                                            .catch(err => {
                                                console.log(err);
                                                res.status(500).json({err});
                                            })
                                    }

                                })
                                .catch(err => {
                                    console.log(err);
                                    res.status(500).json({err});
                                });

                        } else {
                            res.status(400).json({message: "User not found or wrong password"});
                        }
                    }
                )
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err.message});
                });
        } else {
            res.status(400).json({message: "email isn't correct"});
        }

    },
    emailValidation: async function (req, res) {
        const emailTest = req.body.email.toLowerCase();
        User.findOne({email: emailTest})
            .exec()
            .then(doc => {
                if (doc) {
                    res.status(302).json({message: "email already exists!"});
                } else {
                    res.status(404).json({message: "email is free"});
                }

            })
            .catch(err => {
                console.log(err);
                res.status(500).json({err});
            });
    },
    resetPassword: async function (req, res) {
        const emailReset = req.body.email.toLowerCase();
        User.findOne({email: emailReset})
            .exec()
            .then(user => {

                if (user) {
                    const token = jwt.sign({email: user.email}, process.env.SECRET_LETTER, {expiresIn: process.env.TOKEN_EXPIRES_LETTER});
                    const options = sendEmail.getMailoptions(user.email, user.firstName, token);
                    sendEmail.transporter.sendMail(options, (err, info) => {
                        if (err) {
                            console.log (err);
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
                    res.status(404).json({message: "email doesn't exists in DB"});
                }
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err.message});
            });
    },
    changePassword: async function (req, res) {
        jwt.verify(req.token, process.env.SECRET_LETTER, (err, authData) => {
            if (err) {
                return res.status(403).send("No authority");
            }
            const decodedJwt = jwt.decode(req.token, {complete: true});
            const passwordChange = bcrypt.hashSync(req.body.password, 10);
            User.updateOne({email: decodedJwt.payload.email}, {password: passwordChange})
                .exec()
                .then(user => {
                    if (user) {
                        Profile.updateOne({email: req.body.email}, {password: passwordChange})
                            .exec()
                            .then(profile => {
                                if (profile) {
                                    res.status(200).json({message: "Password updated successfully!!"});
                                }
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({error: err});
                            });
                    } else {
                        res.status(404).json({message: "email doesn't exists"});
                    }
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({error: err.message});
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
