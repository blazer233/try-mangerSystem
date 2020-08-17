const Router = require('koa-router')
const router = new Router()
const bcrypt = require('bcryptjs')
const User = require('../models/Users.js')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const Util = require('../utils')
const control_File = new Util.FileUtils()


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

router.get('/item', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let res = await User.findOne({
            _id: ctx.params.id
        })
        ctx.body = res ? res : ''
    } catch (error) {
        console.log(error)
    }
})


router.post('/register', async ctx => {
    try {
        console.log(ctx.request.body)
        let find_ = await User.findOne({
            $or: [{
                username: ctx.request.body.username
            }, {
                email: ctx.request.body.email
            }]
        })
        console.log(find_)
        if (find_) {
            ctx.body = find_.username === ctx.request.body.username ? {
                info: '用户名已注册',
                success: false
            } : {
                info: '邮箱已注册',
                success: false
            }
        } else {
            let salt = bcrypt.genSaltSync(10);
            let hash = bcrypt.hashSync(ctx.request.body.password, salt);
            let newUse = new User({
                avatar: 'http://localhost:5000/public/avatar.png',
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
    } catch (error) {
        console.log(error)
    }

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
                identity: find_.identity,
                email: find_.email
            }
            let token = jwt.sign(pay, 'art', {
                expiresIn: 10 * 60 * 60 * 2
            });
            ctx.body = {
                success: true,
                token: `Bearer ${token}`
            }
        }
    }
})

//修改头像
/**
 * 前端将图片以base流的形式返回给后端，后端将流通过buffer进行处理转换为二进制文件写入对应文件夹，
 * 返回给数据库图片地址保存
 * 
 */
router.post('/userImg', async ctx => {
    try {
        let userImg = ctx.request.body
        let res = await User.findOne({
            _id: userImg._id
        })
        let oldPath = res.avatar.replace('http://localhost:5000/', '')
        let buffer = Buffer.from(userImg.img_, 'base64')
        console.log(oldPath + '  旧')
        let path = `public/avatar/${new Date().valueOf()}.png`
        if (oldPath !== "public/avatar.png" && oldPath) await control_File.unlink(oldPath)
        await control_File.writeFile(path, buffer)
        console.log(path + '  新')
        let result = await User.updateOne({
            _id: userImg._id
        }, {
            $set: {
                avatar: `http://localhost:5000/${path}`
            }
        })
        ctx.body = result.ok ? {
            success: true,
            url: `http://localhost:5000/${path}`
        } : {
            success: false
        }
    } catch (error) {
        console.log(error)
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
        avatar: ctx.state.user.avatar,
    }
})

module.exports = router.routes()
