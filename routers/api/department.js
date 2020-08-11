const Router = require('koa-router')
const router = new Router()
const passport = require('koa-passport')
const Department = require('../models/department.js')
const digui = (pArr) => {
    var _arr = [];
    if (pArr.length) pArr.forEach(item => {
        _arr.push(item._id);
        if (item.child && item.child.length) {
            var childArr = digui(item.child);
            if (childArr.length) _arr = [..._arr, ...childArr]
        }
    });
    return _arr;
}

//添加
router.post('/add', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let Departmentone = new Department(ctx.request.body)
        let result = await Departmentone.save()
        ctx.body = result ? ctx.body = {
            info: '添加成功',
            success: true
        } : {
            info: '添加失败',
            success: false
        }
    } catch (error) {
        console.log('错误是' + error)
    }
})

//修改
router.post('/edit', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let result = await Department.updateOne({
            _id: ctx.request.body._id
        }, {
            $set: {
                label: ctx.request.body.label,
            }
        }, {
            new: true
        })
        ctx.body = result.ok ? {
            info: '修改成功',
            success: true
        } : {
            info: '修改失败',
            success: false
        }
    } catch (error) {
        console.log('错误是' + error)
    }
})

router.post('/delete', passport.authenticate('jwt', {
    session: false
}), async ctx => {
    try {
        let _ids = digui([ctx.request.body])
        let result
        for (let i = 0; i < _ids.length; i++) {
            result = await Department.deleteOne({
                _id: _ids[i]
            })
        }
        result.ok ? ctx.body = {
            info: '删除成功',
            success: true
        } : {
            info: '删除失败',
            success: false
        }
    } catch (error) {
        console.log('错误是' + error)
    }
})
router.get('/all',async ctx => {
    try {
        let result = await Department.find().countDocuments()
        if (!result) {
            let Departmentone = new Department({
                "label": "所有部门",
                "pid": '0',
            })
            await Departmentone.save()
        }
        let result_1 = await Department.find()
        ctx.body = {
            list: result_1,
            success: true
        }
    } catch (error) {
        console.log('错误是' + error)
    }
})

module.exports = router.routes()
