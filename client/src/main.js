import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/store'
import ElementUI from 'element-ui'
import mixins from './components/mixins/mixins'
import 'element-ui/lib/theme-chalk/index.css'
import './components/tree/tree.css'
import './utils/directives/dialogDrag' //弹窗拖动指令
import './utils/directives/py' //汉转拼音指令
import VueSocketIO from 'vue-socket.io'
import {
  debounce,
  DateFormat,
  clone,
  isEmpty
} from './utils/utils'
const requireComponents = require.context('@/components/config/', false, /\.vue/)
requireComponents.keys().forEach(i => {
  const Name = i.split('.')[1].slice(1)
  const reqCom = requireComponents(i)
  Vue.component(Name, reqCom.default || reqCom)
})
Vue.config.productionTip = false
Vue.prototype.$clone = clone
Vue.prototype.$isEmpty = isEmpty
Vue.mixin(mixins);
Vue.use(ElementUI)
Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:5000',
}))
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
