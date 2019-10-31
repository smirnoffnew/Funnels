const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const screenshotScheme = new Schema({
    image: {
        type: String,
        required: true,
    },



}, { versionKey: false });
module.exports = mongoose.model('Screenshot', screenshotScheme);