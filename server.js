const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//passport 初始化
app.use(passport.initialize())
require('./config/passport')(passport)

const users = require('./routers/api/users')
const profiles = require('./routers/api/profiles')

app.use('/api/users',users)
app.use('/api/profiles',profiles)
//DB config
mongoose.connect('mongodb://localhost:27017/mangerSystem', {
    useNewUrlParser: true,useUnifiedTopology: true
}, (err) => {
    if (err) {
        console.log("数据库连接失败")
    } else {
        console.log("数据库连接成功")
    }
})


app.get('/',(req,res)=>{
  res.send('hello world')
})
app.listen(5000,()=>{
  console.log('http://localhost:5000')
})
