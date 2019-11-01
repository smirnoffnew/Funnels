const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerScheme = new Schema({
    partnerProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    token: {
        type: String,
        required: true,
        default: ""
    },
    permissions: {
        type: String,
        default: "View Only"
    },
}, { versionKey: false });

module.exports = mongoose.model('Partner', partnerScheme);
