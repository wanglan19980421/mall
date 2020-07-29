import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import UserList from '../components/user/userList'
import RightList from '../components/power/rightList'
import Roles from '../components/power/roles'
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
      component: Home,
      redirect: '/welcome',
      children: [
        {
          path: '/welcome',
          component: Welcome
        },
        {
          path: '/users',
          component: UserList
        },
        {
          path:'/rights',
          component: RightList
        }, 
        {
          path: '/roles',
          component: Roles
        }
      ]
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
