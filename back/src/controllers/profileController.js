const fs = require("fs");
const Profile = require('../models/profile.js');
const User = require('../models/user.js');
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
    // getAvatarUser: async function (req, res) {

    //     try {

    //         let response = await Profile.findOne({_id: req.authData.profile._id});

    //         res.status(200).json({photoUrl: response.photoUrl})
            
    //     } catch (error) {
    //         res
    //             .status(500)
    //             .json({error: err.message});
    //     }

    // },
};
