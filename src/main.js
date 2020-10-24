import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
import axios from './axios/index'; // 这里这里

import VueContextMenu from 'vue-contextmenu'
Vue.use(VueContextMenu)

import clipboard from 'clipboard';
Vue.prototype.clipboard = clipboard;

// 引入初始化样式
import './style/index.css'
// 引入字体图标库
import './style/iconfont.css'

Vue.config.productionTip = false


new Vue({
  router,
  store,
  axios,
  render: h => h(App)
}).$mount('#app')
