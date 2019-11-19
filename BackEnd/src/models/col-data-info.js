const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const colDataSchema = new Schema({

    colDataId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    logo: {
        type: String,
        required: [true, 'field is required']
    },
    title: {
        type: String,
        required: [true, 'field is required']
    },
    text: {
        type: String,
        required: [true, 'field is required']
    },
    buttonText: {
        type: String,
        required: [true, 'field is required']
    },
    buttonLink: {
        type: String,
        required: [true, 'field is required']
    },
    expire_at: {type: Date, default: Date.now, expires: 259200} 

})
module.exports = mongoose.model('ColDataInfo', colDataSchema);