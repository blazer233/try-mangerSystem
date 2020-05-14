const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    find_id: {
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
    data1: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    delivery: {
        type: Boolean,
    }
})

module.exports = Week = mongoose.model('Week', newSchema)
