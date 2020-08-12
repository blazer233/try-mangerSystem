import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
 
const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
      path: '/',
      redirect: '/home'
    },
    {
      path: '/index',
      name: 'home',
      component: () => import('@/views/index.vue'),
      children: [{
          path: "/home",
          name: "home",
          component: () => import('@/views/Home.vue')
        },
        {
          path: "/infoshow",
          name: "infoshow",
          component: () => import('@/views/Infoshow.vue')
        },
        {
          path: "/fundlist",
          name: "fundlist",
          component: () => import('@/views/Fundlist.vue')
        },
        {
          path: "/workerlist",
          name: "workerlist",
          component: () => import('@/views/workerlist.vue')
        },
        {
          path: "/schart",
          name: "schart",
          component: () => import('@/views/schart.vue')
        }
      ]
    },
    {
      path: '/Notfound',
      name: '/404',
      component: () => import('@/views/404.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginReg.vue')
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
