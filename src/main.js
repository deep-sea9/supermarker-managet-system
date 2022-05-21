import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import dateFormat from 'dateformat'
import VueParticles from 'vue-particles' 

//导入全局样式表
import './assets/css/style.css'
import './assets/iconfont/iconfont.css'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
axios.defaults.baseURL = "http://106.13.24.159:8000/sys_market"
//在request拦截器中，展示进度条
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('session')
  return config
})
//在response拦截器中，隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})
Vue.prototype.$http = axios

//设置时间格式
Vue.prototype.$dateFormat = dateFormat

import moment from 'moment'//导入文件 


Vue.prototype.$moment = moment;//赋值使用

Vue.config.productionTip = false
Vue.use(VueParticles)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')




