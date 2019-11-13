const mongoose = require("mongoose");
//import mongoose   from 'mongoose';

const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('../libs/validators.js');

const funnelScheme = new Schema({
    funnelProject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true,
    },
    funnelName: {
        type: String,
        required: true,
        validate: validator.nameValidator,
    },
    funnelAuthor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    funnelBody: {
        type: Object,
        default: {},
    },
    collaborators:{
        type: [Object],
        default:[]
    },
    funnelBackground:{
        type:String,
        default:""
    },
    funnelNotes: {
        type:String,
        required: false
    }

}, { versionKey: false });
funnelScheme.plugin(uniqueValidator);
module.exports = mongoose.model('Funnel', funnelScheme);