const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Week = require('../models/Week.js')


//创建信息
router.post('/add', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let writeone = new Week({
            super_id: ctx.request.body.super_id,
            name_id: ctx.request.body.name_id,
            region: ctx.request.body.region,
            date0: ctx.request.body.date0,
            date1: ctx.request.body.date1,
            desc: ctx.request.body.desc,
            delivery: ctx.request.body.delivery == 1 ? true : false,
            isPass: false,
            passRes: ''
        })
        let result = await writeone.save()
        ctx.body = result ? true : false
    } catch (error) {
        console.log(error)
    }
})

//编辑信息
router.post('/approval', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let isPass = ctx.request.body.isPass == 1 ? true : false
        let result = await Week.updateOne({
            _id: ctx.request.body.id
        }, {
            $set: {
                isPass,
                passRes: ctx.request.body.passRes,
            }
        }, {
            new: true
        })
        ctx.body = result.ok ? true : false
    } catch (error) {
        console.log(error)
    }
})

//获取单个信息 
router.get('/one', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Week.find({
        name_id: ctx.request.query.id
    })
    let total = await Week.find({
        name_id: ctx.request.query.id
    }).countDocuments();
    if (result) {
        ctx.body = {
            list: result,
            total
        }
    }
})

//获取对应员工信息 
router.get('/employer', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    if (ctx.request.query.id) {
        let result = await Week.find({
            super_id: ctx.request.query.id
        })
        let total = await Week.find({
            super_id: ctx.request.query.id
        }).countDocuments();
        if (result) {
            ctx.body = {
                list: result,
                total
            }
        }
    } else {
        let result = await Week.find()
        ctx.body = result ? result : ''
    }
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
