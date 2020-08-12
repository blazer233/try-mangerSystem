const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    type: {
        type: String,
        required: true
    },
    describe: {
        type: String
    },
    income: {
        type: String,
    },
    expend: {
        type: String,
    },
    cash: {
        type: String,
        required: true
    },
    remark: {
        type: String
    },
    file: {
        type: Array
    },
    date: {
        type: String,
        required: true
    }
})

module.exports = Profile = mongoose.model('Profile', newSchema)
