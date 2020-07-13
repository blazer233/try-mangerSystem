const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    name_id: {
        type: String,
        required: true
    },
    super_id: {
        type: String,
        required: true
    },
    region: {
        type: String,
        required: true
    },
    date0: {
        type: String,
        required: true
    },
    date1: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    delivery: {
        type: Boolean,
    },
    isPass: {
        type: Boolean,
        required: true
    },
    passRes: {
        type: String
    }
})

module.exports = Week = mongoose.model('Week', newSchema)
