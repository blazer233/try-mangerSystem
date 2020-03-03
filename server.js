const koa = require('koa')
const Router = require('koa-router')
const app = new koa()
const router = new Router()
const mongoose = require('mongoose')
const bodyParser=require('koa-bodyparser')
const users = require('./routers/user.js')
const profiles = require('./routers/profiles')
const passport = require('koa-passport')

app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

mongoose.connect("mongodb://localhost:27017/vue", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongoose true'))
    .catch((err) => console.log('mongoose false' + err))

router.use('/api/users',users)
router.use('/api/profiles',profiles)


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`server run ${port}`)
})
