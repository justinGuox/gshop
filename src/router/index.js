// 路由器对象模块
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../pages/Login/Login'
import Shop from '../pages/Shop/Shop'
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods'
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo'
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings'

// import Msite from '../pages/Msite/Msite'
// import Order from '../pages/Order/Order'
// import Profile from '../pages/Profile/Profile'
// import Search from '../pages/Search/Search'
// 路由组件懒加载
const Msite = () => import('../pages/Msite/Msite')
const Order = () => import('../pages/Order/Order')
const Profile = () => import('../pages/Profile/Profile')
const Search = () => import('../pages/Search/Search')

// 声明使用插件
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new VueRouter({
  // 配置所有路由
  routes: [
    {
      path: '/msite',
      component: Msite,
      meta: {
        showFooter: true
      }
    }, {
      path: '/order',
      component: Order,
      meta: {
        showFooter: true
      }
    }, {
      path: '/profile',
      component: Profile,
      meta: {
        showFooter: true
      }
    }, {
      path: '/search',
      component: Search,
      meta: {
        showFooter: true
      }
    }, {
      path: '/login',
      component: Login
    }, {
      path: '/',
      redirect: '/msite'
    }, {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        }, {
          path: '/shop/info',
          component: ShopInfo
        }, {
          path: '/shop/ratings',
          component: ShopRatings
        }, {
          path: '/',
          redirect: '/shop/goods'
        }
      ]
    }
  ]
})
