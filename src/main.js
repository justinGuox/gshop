// 入口JS
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import {Button} from 'mint-ui'
import VueLazyLoad from 'vue-lazyload'

import './mock/mockServer' // 加载mockServer即可
import loading from './common/imgs/loading.gif'

// 注册全局组件标签
Vue.component(Button.name, Button) // <mt-button>
Vue.use(VueLazyLoad, { // 内部多了一个指令 v-lazy=
  loading
})

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  render: h => h(App),
  router, // 使用上vur-router
  store // 使用上vuex
})
