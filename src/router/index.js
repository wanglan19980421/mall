import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home
    }
]

const router = new VueRouter({
  routes
})
//to 将要访问的路劲， from 代表从哪个路径跳转而来， next方形，和强制跳转
router.beforeEach((to, from, next) => {
  if(to.path === '/login') {
    return next()
  }
  //获取token
  const token = window.sessionStorage.getItem('token')
  if(!token) {
    return next('/login')
  }
  next()
})

export default router
