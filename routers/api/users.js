const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const User = require('../models/Users.js')
const jwt = require('jsonwebtoken')
const gravatar = 'http://www.gravatar.com/avatar/0eb178cec364c022a189c3814e5f7483?s=200&r=pg&d=mm'
const passport = require('koa-passport')

router.get('/all', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let find_ = await User.find({
            username: {
                $regex: ctx.request.query.userName
            },
            identity: true
        })
        ctx.body = find_ ? find_.map(i => {
            return i = {
                username: i.username,
                id: i._id
            }
        }) : ''
    } catch (error) {
        console.log(error)
    }
})


router.post('/register', async ctx => {
    try {
        if (ctx.request.body.password !== ctx.request.body.password2) {
            ctx.body = {
                info: '两次密码输入不同',
                success: false
            }
        } else {
            let find_ = await User.findOne({
                email: ctx.request.body.email
            })
            if (find_) {
                ctx.body = {
                    info: '邮箱已注册',
                    success: false
                }
            } else {
                let salt = bcrypt.genSaltSync(10);
                let hash = bcrypt.hashSync(ctx.request.body.password, salt);
                let newUse = new User({
                    avatar: gravatar,
                    username: ctx.request.body.username,
                    password: hash,
                    email: ctx.request.body.email,
                    identity: ctx.request.body.identity
                })

                let result = await newUse.save()
                if (result) {
                    console.log(result)
                    ctx.body = result
                }
            }
        }

    } catch (error) {
        console.log(error)
    }

})

router.post('/avatar/:id', async ctx => {
    let result = await User.updateOne({
        _id: ctx.params.id
    }, {
        $set: {
            "avatar": ctx.request.body.avatar
        }
    })
    ctx.body = result ? result : ''
})

router.post('/login', async ctx => {
    let find_ = await User.findOne({
        email: ctx.request.body.email_log
    })
    if (!find_) {
        ctx.body = {
            info: '用户不存在',
            success: false
        }
    } else {
        let hash_ = bcrypt.compareSync(ctx.request.body.password_log, find_.password);
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
                identity: find_.identity
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
