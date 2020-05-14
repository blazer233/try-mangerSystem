const mongoose = require('mongoose')
const newSchema=require('../schema/profile')

module.exports=mongoose.model('Profile',newSchema)
