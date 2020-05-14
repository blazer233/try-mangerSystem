const mongoose = require('mongoose')
const newSchema=require('../schema/user')

module.exports=mongoose.model('User',newSchema)
