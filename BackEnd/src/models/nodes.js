const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nodeSchema = new Schema({

    funnelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funnel',
        required: true,
    },
    nodeId: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    nodeDescription: {
        type: mongoose.Schema.Types.String
    },
    counterUrl: {
        type: mongoose.Schema.Types.Number
    },
    counterNode: {
        type: mongoose.Schema.Types.Number
    },
    hash: {
        type: mongoose.Schema.Types.String
    },
    url: {
        type: mongoose.Schema.Types.String
    },
    originalUrl: {
        type: mongoose.Schema.Types.String
    },
    status: {
        type: mongoose.Schema.Types.String,
        enum: ["FINISHED", "UNDER DEVELOPMENT" ,"DEFAULT"],
        default: 'DEFAULT'
    },

})
module.exports = mongoose.model('NodeCounter', nodeSchema);