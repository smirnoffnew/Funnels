const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

const partnerTokenScheme = new Schema({

    permissions: {
        type: String,
        required: true,
    },

    ownerToken: {
        type: String,
        required: true,
    },


}, { versionKey: false });
partnerTokenScheme.plugin(uniqueValidator);
module.exports = mongoose.model('partnerToken', partnerTokenScheme);
