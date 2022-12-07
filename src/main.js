import Vue from 'vue'
import App from './App.vue'
import router from './router'
// element-ui
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

// 导入插件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器 对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 nProgress 包的js css
import nProgress from 'nprogress'
import 'nprogress/nprogress.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'https://lianghj.top:8888/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 在 request 拦截器中，展示进度条 nProgress.start()
// 设置拦截器 对请求进行预处理
axios.interceptors.request.use(config => {
  // console.log(config) // {}
  nProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须return config
  return config
})

//  在 response 拦截器中 ，隐藏进度条 nProgress.done()
axios.interceptors.response.use(config => {
  nProgress.done()
  return config
}
)
Vue.prototype.$http = axios

Vue.config.productionTip = false

// 注册为全局插件
Vue.component('tree-table', TreeTable)

// 将文本编辑器注册为 全局可用的组件
Vue.use(VueQuillEditor)

// 注册全局过滤器
Vue.filter('dateFormat', function (originValue) {
  const dt = new Date(originValue)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDay() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d}-${hh}-${mm}-${ss}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
