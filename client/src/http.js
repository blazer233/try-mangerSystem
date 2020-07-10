import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'
import router from './router'
let loading

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: "拼命加载中",
    background: 'rgba(0,0,0,0,7)'
  })
}

function endLoading() {
  loading.close()
}


//请求拦截
axios.interceptors.request.use(config => {
  //加载动画
  startLoading()
  if (localStorage.eleToken) {
    //设置统一的请求header
    config.headers.Authorization = localStorage.eleToken
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截
axios.interceptors.response.use(response => {
  //结束加载动画
  endLoading()
  return response
}, error => {
  endLoading()
  //获取错误状态码
  if (!error.response) To("请检查服务器");
  const status = error.response.status
  if (status == 500) {
    Message.error("参数有误")
    return Promise.reject(error)
  }
  if (status == 401) To("token失效 请重新登录")
  return Promise.reject(error)
})

function To(msg) {
  Message.error(msg)
  //清楚token
  localStorage.removeItem("eleToken")
  //跳转到登录页面
  router.push("/login")
}

export default axios;
