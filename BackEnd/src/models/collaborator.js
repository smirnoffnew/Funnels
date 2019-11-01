const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const collaboratorScheme = new Schema({
    funnelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Funnel',
        required: true,
    },
    permissions:{
        type: String,
        default: "View Only"
    },

}, { versionKey: false });
module.exports = mongoose.model('Collaborator', collaboratorScheme);