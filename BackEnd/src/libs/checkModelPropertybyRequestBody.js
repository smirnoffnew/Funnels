const Profile = require('../models/profile.js');
const bcrypt = require('bcrypt');


module.exports = (req, res, next) => {
    const keys = Object.keys(req.body);
    const profileForTestPropertiesExistance = new Profile();
    let objectForUpdate = {};
    keys.forEach((item)=>{
        if(profileForTestPropertiesExistance.toObject().hasOwnProperty(item) && req.body[item] != ""){

             objectForUpdate[item] = req.body[item];
        }
    });
    if(objectForUpdate.hasOwnProperty('password') ){
        objectForUpdate.password =  bcrypt.hashSync(req.body.password, 10);
    }
    req.objectForUpdate = objectForUpdate;

    next();
};