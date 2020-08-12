# vue - node 前后端管理系统 

## 启动
npm i (安装)
npm run server(启动后端)

cd client (定位文件夹)
npm i (安装)
npm run serve(启动前端)

### 前端技术点
+ 登陆校验：由 localstorage 密码保存，路由拦截vuex进行检测是否令牌过期，通过后端 jsonwebtoken 设置过期时间
```
//路由守卫 
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false
  if (to.path == "/login" || to.path == "/register") {
    next()
  } else {
    isLogin ? next() : next("/login")
  }
})
```
+ 树状层级：通过vue函数式组件，对element-UI的树状图进行进一步分装
```
  return (
        <div>
          {data.type ?
           (node.expanded ? ( <i class="el-icon-folder-opened"></i>) : (<i class="el-icon-folder"></i>))
           : (<i class="el-icon-document"></i> )}
          {(this.isEdit && this.isSelect(data)) || data.isEdit ? (
            <input
              placeholder="名称不能为空"
              class="ly-edit__text"
              on-keyup={() => this.labelChange()}
              value={this.edit_label}
            />
          ) : ( <span>{data.label}</span>)}

          {this.$store.getters.user.identity ? (
            (this.isEdit && this.isSelect(data)) || data.isEdit ? (
              <span class="ly-visible">
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.concal(data, node)}
                >
                  取消
                </el-button>
                <el-button
                  size="mini"
                  type="text"
                  on-click={() => this.ok(data, node)}
                >
                  确认
                </el-button>
              </span>
            ) : (
              <span class="ly-visible">
              </span>
            )
          ) : (
            ""
          )}
        </div>
      );
```
+ 状态管理：通过Vue插件原理，手写实现store效果
```
function install(_Vue) {
    Vue = _Vue
    _Vue.mixin({
        beforeCreate() {
            // 在vue原型上注册$store
            if (this.$options && this.$options.store) {
                Vue.util.defineReactive(this, "$store", this.$options.store)
            } else {
                this.$store = this.$parent && this.$parent.$store;
            }
        }
    })
}
...
```
+ 组件分离：通过组件化，将所有表单、表格进行抽离，<koa-table>、<koa-search>
```
<!-- 筛选表单 -->
<koa-search
    :type_="0"    
    :search_all="tableSearch"
    :controlType="controlType"
    @getList="getProfile"
    size="mini"
    :isinline="true"
/>
<!-- 内容表格 -->
<koa-table
:tableHeader="tableHeader"
:tableData="tableData"
:total="total"
@pagination_size_change="set_getProfile"
@delOne="onDeleteMoney"
@editOne="onEditMoney"
/>
```
+ 自定指令：构建多个自定义指令，对代码进行优化 <v-debounce>、<v-DateFormat>、<v-throttle>
```
//防抖 
Vue.directive('debounce', {
  inserted: function (el, binding) {
    el.addEventListener("keyup", debounce(binding.value, 200))
  }
})
//节流 
Vue.directive('throttle', {
  inserted: function (el, binding) {
    el.addEventListener("keyup", throttle(binding.value, 200))
  }
})
//时间戳转换
Vue.directive('DateFormat', {
  inserted: function (el, binding) {
    el.innerHTML = DateFormat(binding.value)
  }
})
```
+ 使用插件：使用vue-socket.io、vue-quill-editor、vue-schart等插件对项目进行维护
+ 请求拦截：对axios进行拦截和响应，对整体api进行抽离和封装
```
```

### 后技术点
+ 文件读写：将文件读写独立封装为构造函数，支持 async await 操作(pdf文件上传、图片上传)
```
module.exports = class FileUtils {
    constructor() {}
    checkFile(path) {
        return new Promise((resolve, reject) => {
            try {
                let result = fs.existsSync(path);
                if (result) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            } catch (e) {
                reject(e)
            }
        });
    }
    ...
```
+ 密码加密：使用bcrypt，将密码加盐加密
```
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
```
+ 数据查询：通过多种查询方法对数据进行模糊查询
```
let find_ = await User.find({
    username: {
        $regex: ctx.request.query.userName
    },
    identity: true
})
```
+ 数据保存：通过 mongoose 操纵数据库模型改变mongodb数据
```
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const newSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    identity: {
        type: Boolean,
        required: true
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: new Date().getTime()
    },
})
module.exports = User = mongoose.model('User', newSchema)
```
+ 权限控制：设置权限管理

