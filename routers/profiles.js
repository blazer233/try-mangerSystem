const Router = require('koa-router')
const router = new Router()
const xlsx = require('node-xlsx')
const passport = require('koa-passport')
const Profile = require('../models/Profiles')
const multer = require('koa-multer')
const Util = require('../utils')
const timeFormat = Util.timeFormat
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

//获得当前页信息
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

//导入表单
router.post('/upFile', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let pattern = /\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
        let buffer = Buffer.from(ctx.request.body.file, 'base64')
        let excel = xlsx.parse(buffer);
        let excel_ = excel[0].data
        excel_.shift()
        excel_.map(i => {
            if (!pattern.test(i[1])) {
                ctx.body = {
                    success: false,
                    info: '上传Excel文件的时间格式请与原数据一致'
                }
                throw Error('时间格式不正确');
            }
        })
        let insertData = excel_.reduce((arr, item) => {
            arr.push({
                date: +new Date(String(item[1])),
                type: item[2],
                describe: item[3],
                income: item[4],
                expend: item[5],
                cash: item[6],
                remark: item[7],
                file: item[8] && item[8].includes('--') ? [{
                    name: item[8].split('--')[0],
                    url: item[8].split('--')[1]
                }] : [],
            })
            return arr
        }, [])
        await Profile.deleteMany()
        let res = await Profile.insertMany(insertData)
        console.log(res)
        ctx.status = 200
        ctx.body = {
            success: true
        }
    } catch (error) {
        console.log(error)
    }
})

//导出表单
router.get('/loadFile', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let data = [
            ['序号', '创建时间', '收支类型', '收支描述', '收入', '支出', '账户现金', '备注', '档案']
        ]
        let result = await Profile.find()
        let options = {
            '!cols': Array.from({
                length: 10
            }, i => i = {
                wch: 20
            })
        };
        result.forEach((i, index) => {
            let row = [index + 1, timeFormat(i.date), i.type, i.describe, i.income, i.expend, i.cash, i.remark, i.file.length ? i.file[0].name + '--' + i.file[0].url : '暂无']
            data.push(row);
        })
        let buffer = xlsx.build([{
            name: "资金表格清单",
            data
        }], options);
        ctx.body = {
            info: buffer,
            success: true
        }
    } catch (error) {
        console.log(error)
    }
})
module.exports = router.routes()
