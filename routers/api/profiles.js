const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Profile = require('../models/Profiles')

//插入数据
router.get('/toall', async ctx => {
    try {
        let dd = {
            type: '折旧费',
            describe: '设备折旧损坏',
            income: '5115',
            expend: '900',
            cash: '18000',
            remark: '900',
            id: ''
        }
        let cc = new Array(1000).fill(dd)
        let result = await Profile.insertMany(cc)
        result ? ctx.body = result : ''
    } catch (error) {
        console.log(error)
    }
})

//创建信息
router.post('/add', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let writeone = new Profile(ctx.request.body)
        let result = await writeone.save()
        ctx.body = result ? result : ''
    } catch (error) {
        console.log(error)
    }

})

//获得全部信息
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let result = await Profile.find()
        ctx.body = result ? result : {
            info: '没有任何内容'
        }
    } catch (error) {
        console.log(error)
    }

})

//获取单个信息
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Profile.findOne({
        _id: ctx.params.id
    })
    ctx.body = result ? result : {
        info: '没有任何内容'
    }
})

//编辑信息
router.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Profile.updateOne({
        _id: ctx.params.id
    }, ctx.request.body)
    ctx.body = result ? result : ''
})


// 删除信息
router.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Profile.deleteOne({
        _id: ctx.params.id
    })
    ctx.body = result ? result : ''
})

module.exports = router.routes()
