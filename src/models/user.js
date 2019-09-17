const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('../libs/validators.js');

const textValidator = [validator.alphaValidator, validator.nameValidator];
const passwordValidator = [validator.alphaValidator, validator.passwordValidator];

const userScheme = new Schema({
    password: {
        type: String,
        required: true,
        //validate: passwordValidator,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate: validator.emailValidator,
    },
    firstName: {
        type: String,
        validate: textValidator,
    },
    accountName: {
        type: String,
        validate: textValidator,
    },
    limited: {
        type: Boolean,
        default: false
    }
}, {versionKey: false});

userScheme.plugin(uniqueValidator);
userScheme.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});
module.exports = mongoose.model('User', userScheme);
