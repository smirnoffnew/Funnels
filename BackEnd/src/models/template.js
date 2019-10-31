const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const templateScheme = new Schema({
    templateName: {
        type: String,
    },
    templateAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
    },
    templateBody: {
        type: Object,
        default: {},
    },
}, { versionKey: false });
module.exports = mongoose.model('Template', templateScheme);