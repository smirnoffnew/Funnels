const fs = require("fs");
const mongoose = require("mongoose");
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
const Partner = require('../models/partner.js');
const activeCampaignApi = require('activecampaign-api');


module.exports = {
    changeMyProfile: async (req, res) => {
        //await req.body.email.toLowerCase();
        Promise
            .all([
                Profile.findOneAndUpdate(
                    {_id: req.authData.profile._id},
                    req.objectForUpdate,
                    {new:true}
                ).exec(),
                User.findOneAndUpdate(
                    {_id: req.authData.userId},
                    req.objectForUpdate,
                    {new:true}
                ).exec()

            ])
            .then(result => {
                res.json({message: "profile updated successfully"});
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err.message});
            });

    },
    changeUsersAvatar: async (req, res) => {
        const photoURL = process.env.IMAGE_STORE;
        let fileToDelete;
        Promise
            .all([
                Profile
                    .findOne({_id: req.authData.profile._id})
                    .exec()
                    .then(profile => {
                        fileToDelete = `src${profile.photoUrl}`;
                    }),
                Profile
                    .findOneAndUpdate({_id: req.authData.profile._id},
                        {photoUrl: `${photoURL}${req.file.originalname}`},
                        {new: true})
                    .exec()
            ])
            .then(result=>{
                res
                    .status(200)
                    .json({message:"Avatar updated succesfully", data: result[1]})
            })
            .then(()=>{
                fs.unlink(fileToDelete, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            })
            .catch(err=>{
                res
                    .status(500)
                    .json({error: err.message});
            });

    },
    createPartner: async (req, res) => {

        let userProfile;
        let newPartner;

        try {
            userProfile = await Profile
                .findOne({_id: mongoose.Types.ObjectId(req.authData.profile._id)})
                .populate({model: 'Profile', path: 'myPartners.partnerProfile'});

            userProfile ? void(0) : res.status(500).json({error: 'error, Profile not found'});
            newPartner = await new Partner(
                {
                    ...req.body,
                    partnerProfile: mongoose.Types.ObjectId(req.body.partnerProfile)
                }
            );
            userProfile.myPartners = userProfile.myPartners ? userProfile.myPartners : [];
            userProfile.myPartners.push(newPartner);

        } catch(err) {
            res.status(500).json({error: err.message});
        }


        userProfile
            .save()
            .then(updatedProfile => {
                return Profile
                        .findOne({_id: updatedProfile._id})
                        .populate({model: 'Profile', path: 'myPartners.partnerProfile'});

            })
            .then(updatedProfile => res.status(200).json({myPartners: updatedProfile.myPartners}))
            .catch(err => res.status(500).json({error: err.message}));
    },

    getAllPartners: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({model: 'Profile', path: 'myPartners.partnerProfile'})
            .orFail( () => new Error('error, Profiles not found') )
            .then(profile => res.status(200).json({myPartners: profile.myPartners}))
            .catch(err => res.status(400).json({ error: err.message }));
    },

    getSinglePartner: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({model: 'Profile', path: 'myPartners.partnerProfile'})
            .orFail( () => new Error('error, Profiles not found') )
            .then(profile => res
                .status(200)
                .json({myPartners: [profile.myPartners.find(item => req.params.partnerId === item._id.toString())]})
            )
            .catch(err => res.status(400).json({ error: err.message }))

    },

    updatePartnersPermissions: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({model: 'Profile', path: 'myPartners.partnerProfile'})
            .orFail( () => new Error('error, Profiles not found') )
            .then(profile => {
                const objIndex = profile.myPartners.findIndex( item => item._id.toString() === req.params.partnerId);
                profile.myPartners[objIndex].permissions = req.body.permissions ? req.body.permissions : "View Only";
                return profile.save()
            })
            .then(updatedProfile => res.status(200).json({myPartners: updatedProfile.myPartners}))
            .catch(err => res.status(400).json({ error: err.message }))

    },

    deleteSinglePartner: async (req, res) => {

        Profile
            .findById(req.authData.profile._id)
            .populate({model: 'Profile', path: 'myPartners.partnerProfile'})
            .orFail( () => new Error('error, Profiles not found') )
            .then(profile => {
                    profile.myPartners = profile.myPartners.filter(item => req.params.partnerId !== item._id.toString());
                    return profile.save()
            })
            .then(updatedProfile => res.status(200).json({myPartners: updatedProfile.myPartners}))
            .catch(err => res.status(400).json({ error: err.message }))

    }
};
