import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from './http'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './components/tree/tree.css'
import './utils/directives/dialogDrag' //弹窗拖动指令
import './utils/directives/py' //汉转拼音指令
import {
  debounce,
  DateFormat
} from './utils/utils'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$axios = axios
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
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
