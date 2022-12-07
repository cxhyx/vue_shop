import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/shopLogin.vue'
import Home from '@/components/shopHome.vue'
import Welcome from '@/components/shopWelcome.vue'
import Users from '@/components/user/shopUsers.vue'
import Rights from '@/components/power/shopRights.vue'
import Roles from '@/components/power/shopRoles.vue'
import Cate from '@/components/goods/GoodsCate.vue'
import Params from '@/components/goods/GoodsParams.vue'
import List from '@/components/goods/GoodsList.vue'
import GoodsAdd from '@/components/goods/GoodsAdd.vue'
import Order from '@/components/order/shopOrder.vue'
import Report from '@/components/report/shopReport.vue'

Vue.use(VueRouter)

const routes = [
  // 重定向路由规则
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    // 路由重定向
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: GoodsAdd },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  // mode: 'history',
  routes
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // * to 将要访问的路径
  // * from 代表从那个路径跳转而来
  // * 是一个函数，表示放行
  // *  next() 放行   next('/login') 强制跳转

  if (to.path === '/login') return next()
  // 获取 token
  const tokenStr = window.sessionStorage.getItem('token')
  // 存在token  则放行
  if (!tokenStr) return next('/login')
   // 否则跳转到登录页面
  next()
})

export default router
