const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    pid: {
        type: String,
    }
})

module.exports = Profile = mongoose.model('Department', newSchema)
