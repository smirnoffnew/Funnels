const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('../libs/validators.js');

let textValidator = [validator.alphaValidator, validator.nameValidator];

const profileScheme = new Schema({
    password: {
        type: String,
        required: true,
        default:"",
        //select: false
    },
    email: {
        type: String,
        default:"",
    },
    firstName: {
        type: String,
        validate: textValidator,
        default:""
    },
    accountName: {
        type: String,
        default:""

    },
    description: {
        type: Object,
        default: null
    },
    photoUrl: {
        type: String,
        default: ""
    },
    limited: {
        type: Boolean,
        default: false
    },
    myCollaborations: [
        {
            funnel: {
                type: mongoose.Schema.Types.ObjectId,
                require: true,
                ref: "Funnel"
            },

            funnelId: {
                type: String,
            },

            permissions:
                {
                    type: String,
                    required: true
                }

        }
    ],




}, {versionKey: false});
profileScheme.plugin(uniqueValidator);
profileScheme.pre('findOneAndUpdate', function (next) {
    this.options.runValidators = true;
    next();
});

module.exports = mongoose.model('Profile', profileScheme);
