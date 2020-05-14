const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const User = require('../models/Users.js')
const jwt = require('jsonwebtoken')
const gravatar = require('gravatar')
const passport = require('koa-passport')

router.get('/all', async ctx => {
    let find_ = await User.find()
    ctx.body = find_ ? find_ : ''
})


router.post('/register', async ctx => {
    try {
        let find_ = await User.findOne({
            email: ctx.request.body.email
        })
        if (find_) {
            ctx.body = {
                info: '邮箱已注册',
                success: false
            }
        } else {
            const avatar = gravatar.url(ctx.request.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(ctx.request.body.password, salt);
            let newUse = new User({
                avatar,
                username: ctx.request.body.username,
                password: hash,
                email: ctx.request.body.email,
                identity:ctx.request.body.identity
            })

            let result = await newUse.save()
            if (result) {
                ctx.body = result
            }
        }
    } catch (error) {
        console.log(error)
    }

})

router.post('/login', async ctx => {
    let find_ = await User.findOne({
        email: ctx.request.body.email
    })
    if (!find_) {
        ctx.body = {
            info: '用户不存在',
            success: false
        }
    } else {
        let hash_ = bcrypt.compareSync(ctx.request.body.password, find_.password);
        if (!hash_) {
            ctx.body = {
                info: '密码错误',
                success: false
            }
        } else {
            let pay = {
                id: find_.id,
                name: find_.username,
                date: find_.date,
                avatar: find_.avatar,
                identity:find_.identity
            }
            let token = jwt.sign(pay, 'art', {
                expiresIn: 60 * 60 * 60 * 2
            });
            ctx.body = {
                success: true,
                token: `Bearer ${token}`
            }
        }
    }
})

router.get('/pre', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    ctx.body = {
        id: ctx.state.user.id,
        name: ctx.state.user.username,
        email: ctx.state.user.email,
        date: ctx.state.user.date,
    }
})

module.exports = router.routes()
