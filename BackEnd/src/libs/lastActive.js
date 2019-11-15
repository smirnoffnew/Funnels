const AC = require('activecampaign-rest');
const Profile = require('../models/profile');

module.exports = function (req, res, next) {

    let today = new Date();
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()

    let contact = new AC.Contact({
        'url': 'https://vladhuntyk.activehosted.com',
        'token': process.env.CAMPAING_ACCOUNT_KEY
    })
    Profile.findOne({
            _id: req.authData.profileId
        })
        .exec()
        .then((profile) => {
            if(profile){
                let payload = {
                'email': profile.email,
                'firstName': profile.firstName,
                'lastName': profile.lastName,
                'phone': profile.phone,
                'fields': [{
                    'name': 'Last Active',
                    'value': date
                }, ]
            }
            contact.sync(payload, (err, res) => {
                if (err) {
                    console.log("error", err)
                }
            });
            }
            else{throw new Error('Profile not found')}
            
        })
        .then(() => {
            next();
        })
        .catch(err => {
            res.status(400).json({
                error: err.message
            })
        });
}