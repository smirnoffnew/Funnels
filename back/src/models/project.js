const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('../libs/validators.js');

const projectScheme = new Schema({
    projectAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    projectName: {
        type: String,
        required: true,
        validate: validator.nameValidator,
    },
    projectFunnels:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Funnel',
        default:[]
    },
    collaborators:{
        type: [Object],
        default:[]
    }
}, { versionKey: false });
projectScheme.plugin(uniqueValidator);
module.exports = mongoose.model('Project', projectScheme);