const koa = require('koa')
const Router = require('koa-router')
const app = new koa()
const router = new Router()
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const users = require('./routers/user.js')
const week = require('./routers/week.js')
const profiles = require('./routers/profiles')
const department = require('./routers/department.js')
const passport = require('koa-passport')
const cors = require('koa2-cors');
const {
    historyApiFallback
} = require('koa2-connect-history-api-fallback')
const KoaStatic = require('koa-static');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const port = process.env.PORT || 5000

app.use(historyApiFallback({
    enable: true
}));
app.use(KoaStatic(__dirname))
app.use(KoaStatic('./client_vue'));
app.use(cors());
app.use(bodyParser())
app.use(router.routes())
app.use(router.allowedMethods())
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)

io.on('connection', socket => {
    socket.on('login', data => {
        console.log(`用户${data.username}加入`);
        socket.join(data.username)
    });
    socket.on('logout', data => {
        console.log(`用户${data.username}已离开`);
        socket.leave(data.username)
    });
    //发生错误时触发
    socket.on('error', err => {
        console.log(err);
    });
});

mongoose.connect("mongodb://localhost:27017/vue", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('mongoose true'))
    .catch((err) => console.log('mongoose false' + err))

router.use('/api/users', users)
router.use('/api/week', week)
router.use('/api/profiles', profiles)
router.use('/api/department', department)

server.listen(port, () => {
    console.log(`http://localhost:${port}`)
})
