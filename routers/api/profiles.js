const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Profile = require('../models/Profiles')
const multer = require('koa-multer')
const storage = multer.diskStorage({
    // 存储的位置
    destination: `public/pdf/`,
    // 文件名 
    filename(req, file, cb) {
        const filename = file.originalname.split(".")
        cb(null, `${req.body._id}-${Date.now()}.${filename[filename.length - 1]}`)
    }
})
const upload = multer({
    storage
})

//创建信息
router.post('/add', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let writeone = new Profile(ctx.request.body)
        let result = await writeone.save()
        ctx.body = result.ok ? true : false
    } catch (error) {
        console.log('错误是' + error)
    }
})

//上传pdf文件
router.post('/toFile', upload.single('file'), async ctx => {
    try {
        let url = `/${ctx.req.file.destination}${ctx.req.file.filename}`
        ctx.body = {
            url,
            success: true,
            mes: '上传成功',
        }
    } catch (error) {
        console.log('错误是' + error)
    }
})

//获得全部信息
//ctx.request是context经过封装的请求对象，ctx.req是context提供的node.js原生HTTP请求对象
router.post('/', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let index = ctx.request.body.page_index - 1
        let size = ctx.request.body.page_size
        let date1 = ctx.request.body.date1 ? ctx.request.body.date1 : 0
        let date2 = ctx.request.body.date2 ? ctx.request.body.date2 : Number.POSITIVE_INFINITY
        let total = await Profile.find({
            "date": {
                $gte: date1,
                $lte: date2
            }
        }).countDocuments();
        let result = await Profile.find({
            "date": {
                $gt: date1,
                $lt: date2
            }
        }).sort({
            _id: -1
        }).limit(Number(size)).skip(Number(index * size))
        if (result) {
            ctx.body = {
                list: result,
                total
            }
        } else {
            ctx.body = ''
        }
    } catch (error) {
        console.log(error)
    }
})

// 删除信息
router.delete('/delete/:id', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    let result = await Profile.deleteOne({
        _id: ctx.params.id
    })
    ctx.body = result.ok ? true : false
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

module.exports = router.routes()
