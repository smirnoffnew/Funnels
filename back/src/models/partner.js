const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const partnerScheme = new Schema({
    partnerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    token: {
        type: String,
        required: true,
        default: "View Only"
    },
    permissions: {
        type: String,
        default: "View Only"
    },
}, { versionKey: false });

partnerScheme.plugin(uniqueValidator);
module.exports = mongoose.model(' ', partnerScheme);
