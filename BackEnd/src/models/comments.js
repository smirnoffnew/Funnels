const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    funnelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funnel',
        required: true,
    },
    comment: {
        type: mongoose.Schema.Types.String
    },
    createdAt: {
        type: Number,
        default: new Date().getTime()
    },
    itemId: {
        type: mongoose.Schema.Types.String,
        default: ''
        },

})
module.exports = mongoose.model('Comments', commentSchema);