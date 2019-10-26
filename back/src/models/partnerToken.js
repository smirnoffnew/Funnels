const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerTokenScheme = new Schema({

    ownerProfileId: {
        type: String,
        required: true,
    },

    permissions: {
        type: String,
        required: true,
    },

    ownerToken: {
        type: String,
        required: true,
    }

}, { versionKey: false });

module.exports = mongoose.model('PartnerToken', partnerTokenScheme);
