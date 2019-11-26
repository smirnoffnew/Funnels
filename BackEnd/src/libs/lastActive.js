const Profile = require('../models/profile');
const rp = require('request-promise');
const url = `https://${process.env.CAMPAING_ACCOUNT_NAME}.api-us1.com/api/3/`
const headers = {
    "Api-Token": process.env.CAMPAING_ACCOUNT_KEY
};
const method = 'POST';

module.exports = function (req, res, next) {
    let today = new Date();
    let date = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()

    Profile.findOne({ 
        _id: req.authData.profileId
    })
    .exec()
    .then(profile => {
        if (!profile) {throw new Error('Profile not found')}
        try {
            let options = {
                headers,
                url: `${url}contact/sync`,
                method,
                body: JSON.stringify({
                    "contact": {
                        "email": profile.email,
                        'firstName': profile.firstName,
                        'lastName': profile.lastName,
                        'phone': profile.phone,
                    }
                })
            };
            return rp(options)
        } catch (error) {
            console.log(error)
        }
    })
    .then(body => {
        try {
            
            let userAC = JSON.parse(body).contact.id
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
        } catch (error) {
            console.log(error)
        }
    })
    .then(() => {
                next();
            })
    .catch(err => {
        console.log(err.message)
        res.status(400).json({
            error: err.message
        })
    });
}