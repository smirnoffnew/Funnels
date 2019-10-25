const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const partnerTokenScheme = new Schema({

    permissions: {
        type: String,
        required: true,
    },

    ownerToken: {
        type: String,
        required: true,
    },

    ownerProfileId: {
        type: String,
        required: true,
    },


}, { versionKey: false });

module.exports = mongoose.model('PartnerToken', partnerTokenScheme);
