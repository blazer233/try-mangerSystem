const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Week = require('../models/Week.js')
const multer = require('multer')


//创建信息
router.post('/add', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let writeone = new Week({
            find_id: ctx.request.body.find_id,
            name: ctx.request.body.name,
            region: ctx.request.body.region,
            date0: ctx.request.body.date0,
            data1: ctx.request.body.data1,
            desc: ctx.request.body.desc,
            delivery: ctx.request.body.delivery
        })
        let result = await writeone.save()
        ctx.body = result ? result : ''
    } catch (error) {
        console.log(error)
    }

})
//
router.post('/uploading', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    console.log(ctx.request.body)
    // ctx.request.body
    // console.log(req.body); //获取到的age和name
    // console.log(req.file); //获取到的文件
    // //做些其他事情
})

//获得全部信息
router.get('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let result = await Week.find()
        if (result) {
            ctx.body = result
        } else {
            ctx.body = {
                info: '没有任何内容'
            }
        }
    } catch (error) {
        console.log(error)
    }

})

//获取单个信息 
router.get('/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Week.find({
        find_id: ctx.params.id
    })
    if (result) {
        ctx.body = result
    } else {
        ctx.body = {
            info: '没有任何内容'
        }
    }
})

//编辑信息
router.post('/edit/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Profile.updateOne({
        _id: ctx.params.id
    }, {
        type: ctx.request.body.type,
        describe: ctx.request.body.describe,
        income: ctx.request.body.income,
        expend: ctx.request.body.expend,
        cash: ctx.request.body.cash,
        remark: ctx.request.body.remark
    })
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
