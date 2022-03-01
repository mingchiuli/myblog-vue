import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Element from 'element-ui'
import axios from './axios'
import 'highlight.js/styles/atom-one-light.css' //样式


import mavonEditor from 'mavon-editor'

import "element-ui/lib/theme-chalk/index.css"

import 'mavon-editor/dist/css/index.css'
// import "./axios"

import "./permission"
import router from './router'
import 'default-passive-events'

Vue.use(Element)
Vue.use(mavonEditor)

Vue.config.productionTip = false
Vue.prototype.$axios = axios


//标题
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
