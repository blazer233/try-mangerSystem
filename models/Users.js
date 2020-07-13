const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    identity: {
        type: Boolean, 
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: new Date().toString()
    },
})

module.exports = User = mongoose.model('User', newSchema)
