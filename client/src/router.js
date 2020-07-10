import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/index.vue'
import Notfound from './views/404.vue'
import LoginReg from './views/LoginReg.vue'
import Home from './views/Home.vue'
import Infoshow from './views/Infoshow.vue'
import Fundlist from './views/Fundlist.vue'
import workerlist from './views/workerlist.vue'
Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [{
          path: "",
          component: Home
        },
        {
          path: "/home",
          name: "home",
          component: Home
        },
        {
          path: "/infoshow",
          name: "infoshow",
          component: Infoshow
        },
        {
          path: "/fundlist",
          name: "fundlist",
          component: Fundlist
        },
        {
          path: "/workerlist",
          name: "workerlist",
          component: workerlist
        },
        {
          path: "/workerlist",
          name: "workerlist",
          component: workerlist
        }

      ]
    },
    {
      path: '/Notfound',
      name: '/404',
      component: Notfound
    },
    {
      path: '/login',
      name: 'login',
      component: LoginReg
    }
  ]
})

//路由守卫
router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false
  if (to.path == "/login" || to.path == "/register") {
    next()
  } else {
    isLogin ? next() : next("/login")
  }
})

export default router;
