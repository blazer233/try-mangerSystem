const mongoose = require('mongoose')
const newSchema=require('../schema/week')

module.exports=mongoose.model('Week',newSchema)
