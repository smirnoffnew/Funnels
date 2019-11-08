const fs = require("fs");
const mongoose = require("mongoose");
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
const Partner = require('../models/partner.js');
const PartnerToken = require('../models/partnerToken.js');
const activeCampaignApi = require('activecampaign-api');


const fetch = require('node-fetch');
const FormData = require('form-data');

const bufferFile = `${process.env.APP_PATH}${process.env.IMAGE_STORE}buffer-file.jpg`;

//Windows settings
//const bufferFile = __dirname + `../../../public/avatars/buffer-file.jpg`;

/**changeUsersAvatar variables */
module.exports = {
    changeMyProfile: async (req, res) => {
        //await req.body.email.toLowerCase();
        Promise
            .all([
                Profile.findOneAndUpdate({
                        _id: req.authData.profile._id
                    },
                    req.objectForUpdate, {
                        new: true
                    }
                ).exec(),
                User.findOneAndUpdate({
                        _id: req.authData.userId
                    },
                    req.objectForUpdate, {
                        new: true
                    }
                ).exec()

            ])
            .then(result => {
                res.json({
                    message: "profile updated successfully"
                });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err.message
                });
            });

    },
    changeUsersAvatar: (req, res) => {
        console.log(bufferFile)
        Profile
            .findOne({
                _id: req.authData.profile._id
            })
            .exec()
            /**find profile in db */
            .then((profile) => {
                const data = new FormData();
                data.append('userName', profile.accountName);
                data.append('img', fs.createReadStream(bufferFile));
                return fetch(`${process.env.FILE_SHARER}/avatars`, {
                    method: 'POST',
                    body: data
                })
            })
            .then(result => result.json())
            .then((result) => {

                return Profile
                    .findOneAndUpdate({
                        _id: req.authData.profile._id
                    }, {
                        photoUrl: result.link
                    }, {
                        new: true
                    })
                    .exec()
            })
            .then(() => {
                try {
                    fs.unlinkSync(bufferFile)
                } catch (error) {
                    throw new Error('problem with deleting buffer file')
                }
                res.status(200).json({
                    message: "Avatar updated succesfully...",
                })
            })
            .catch(err => {
                res
                    .status(500)
                    .json({
                        error: err.message
                    });
            });
    },

    getAllPartners: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({
                model: 'Profile',
                path: 'myPartners.partnerProfile'
            })
            .orFail(() => new Error('error, Profiles not found'))
            .then(profile => res.status(200).json({
                myPartners: profile.myPartners
            }))
            .catch(err => res.status(400).json({
                error: err.message
            }));
    },

    getSinglePartner: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({
                model: 'Profile',
                path: 'myPartners.partnerProfile'
            })
            .orFail(() => new Error('error, Profiles not found'))
            .then(profile => res
                .status(200)
                .json({
                    myPartners: [profile.myPartners.find(item => req.params.partnerId === item._id.toString())]
                })
            )
            .catch(err => res.status(400).json({
                error: err.message
            }))

    },

    updatePartnersPermissions: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({
                model: 'Profile',
                path: 'myPartners.partnerProfile'
            })
            .orFail(() => new Error('error, Profiles not found'))
            .then(profile => {
                const objIndex = profile.myPartners.findIndex(item => item._id.toString() === req.params.partnerId);
                profile.myPartners[objIndex].permissions = req.body.permissions ? req.body.permissions : "View Only";
                return profile.save()
            })
            .then(updatedProfile => res.status(200).json({
                myPartners: updatedProfile.myPartners
            }))
            .catch(err => res.status(400).json({
                error: err.message
            }))

    },

    deleteSinglePartner: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({
                model: 'Profile',
                path: 'myPartners.partnerProfile'
            })
            .orFail(() => new Error('error, Profiles not found'))
            .then(profile => {
                profile.myPartners = profile.myPartners.filter(item => req.params.partnerId !== item._id.toString());
                return profile.save()
            })
            .then(updatedProfile => res.status(200).json({
                myPartners: updatedProfile.myPartners
            }))
            .catch(err => res.status(400).json({
                error: err.message
            }))

    },

    createUrlForPartner: async (req, res) => {

        const partnerProfileId = req.authData.profile._id;

        new PartnerToken({
                ownerToken: req.headers.authorization,
                permissions: req.body.permissions,
                ownerProfileId: partnerProfileId
            })
            .save()
            .then(partnerToken => res
                .status(200)
                .json({
                    data: Boolean(req.authData.profile.limited) === true ?
                        `No authority to partner` : `${process.env.PROD_URL}/add-partner/${partnerToken._id}`
                })
            )
            .catch(err => res.status(500).json({
                error: err.message
            }));

    },


    createPartnerByLink: async function (req, res) {

        const partnerProfileId = req.authData.profile._id;
        const partnerTokenId = req.params.partnerTokenId;
        let existPartnerToken;
        let profile;

        Profile
            .findById(partnerProfileId)

            .orFail(() => new Error('error, Your profile not found'))

            .then(() => PartnerToken
                .findOne({
                    _id: mongoose.Types.ObjectId(partnerTokenId)
                })
                .orFail(() => new Error('error, Partner token not found'))
            )

            .then(partnerToken => {
                existPartnerToken = partnerToken;
                return Profile
                    .findOne({
                        _id: mongoose.Types.ObjectId(existPartnerToken.ownerProfileId)
                    })
                    .orFail(() => new Error('error, Owner profile not found'))
            })

            .then(ownerProfile => {

                const newPartner = new Partner({
                    token: existPartnerToken.ownerToken,
                    permissions: existPartnerToken.permissions,
                    partnerProfile: mongoose.Types.ObjectId(partnerProfileId)
                });

                const isThisPartnerExist = ownerProfile.myPartners.findIndex(item => item.partnerProfile.toString() === partnerProfileId);

                if (isThisPartnerExist === -1) {
                    ownerProfile.myPartners = ownerProfile.myPartners ? ownerProfile.myPartners : [];
                    ownerProfile.myPartners.push(newPartner);
                } else {
                    throw new Error('error, you are already added like a partner')
                }

                return ownerProfile.save()
            })

            .then(updatedOwnersProfile => {
                profile = updatedOwnersProfile;
                profile.myPartners = profile.myPartners.filter(item => item.partnerProfile.toString() === partnerProfileId);
                return PartnerToken.deleteOne({
                    _id: mongoose.Types.ObjectId(partnerTokenId)
                })
            })

            .then(() => res.status(200).json({
                ownersProfile: profile,
                message: 'now you added like a partner'
            }))
            .catch(err => res.status(400).json({
                error: err.message
            }));

    },

    getAllOwners: async function (req, res) {
        const partnerProfileId = req.authData.profile._id;
        Profile
            .find({
                "myPartners": {
                    "$elemMatch": {
                        partnerProfile: mongoose.Types.ObjectId(partnerProfileId)
                    },
                }
            })
            .select(["firstName", "accountName", "email", "myPartners"])
            .then((result) => res.status(200).json({
                owners: result.map(item =>
                    ({
                        ...item._doc,
                        myPartners: item.myPartners.filter(i => i.partnerProfile.toString() === partnerProfileId)
                    }))
            }))
            .catch(err => res.status(400).json({
                error: err.message
            }));
    }


};