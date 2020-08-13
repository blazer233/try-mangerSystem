const koa = require('koa')
const Router = require('koa-router')
const app = new koa()
const router = new Router()
const Moment = require("moment");
const Koa_Logger = require("koa-logger");
const mongoose = require('mongoose')
const bodyParser = require('koa-bodyparser')
const users = require('./routers/user.js')
const week = require('./routers/week.js')
const profiles = require('./routers/profiles')
const department = require('./routers/department.js')
const passport = require('koa-passport')
const cors = require('koa2-cors');
const KoaStatic = require('koa-static');
const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);
const port = process.env.PORT || 5000
const {
    historyApiFallback
} = require('koa2-connect-history-api-fallback')

const logger = Koa_Logger((str) => {
    console.log(Moment().format('YYYY-MM-DD HH:mm:ss') + str);
});
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
        console.log(`${Moment().format('YYYY-MM-DD HH:mm:ss')}   用户${data.username}加入`);
        socket.join(data.username)
    });
    socket.on('logout', data => {
        console.log(`${Moment().format('YYYY-MM-DD HH:mm:ss')}   用户${data.username}已离开`);
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
    .then(() => console.log(`${Moment().format('YYYY-MM-DD HH:mm:ss')}   mongoose true`))
    .catch((err) => console.log(`${Moment().format('YYYY-MM-DD HH:mm:ss')}   mongoose false ${err}`))

router.use('/api/users', users)
router.use('/api/week', week)
router.use('/api/profiles', profiles)
router.use('/api/department', department) 
app.use(logger);

server.listen(port, () => {
    console.log(`${Moment().format('YYYY-MM-DD HH:mm:ss')}   http://localhost:${port}`)
})
