import axios from 'axios'
import {
  Loading,
  Message
} from 'element-ui'
import router from './router'
let loading

let axios_ = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:5000/api',
})
   
//请求拦截
axios_.interceptors.request.use(config => {
  //加载动画
  loading = Loading.service({
    lock: true,
    text: "拼命加载中",
    background: 'rgba(0,0,0,0,7)'
  })
  if (localStorage.eleToken) {
    //设置统一的请求header
    config.headers.Authorization = localStorage.eleToken
  }
  return config
}, error => {
  return Promise.reject(error)
})

//响应拦截
axios_.interceptors.response.use(response => {
  //结束加载动画
  loading.close()
  return response
}, error => {
  loading.close()
  //获取错误状态码
  if (!error.response) To("请检查服务器");
  const status = error.response.status
  if (status == 500) {
    Message.error("参数有误")
    return Promise.reject(error)
  }
  if (status == 401) To("token失效 请重新登录")
  if (status == 403) To("请求头过长")
  return Promise.reject(error)
})

function To(msg) {
  Message.error(msg)
  //清楚token
  localStorage.removeItem("eleToken")
  //跳转到登录页面
  router.push("/login")
}

export default axios_;
