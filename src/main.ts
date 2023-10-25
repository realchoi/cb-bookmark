import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import store from './store'
import router from './router'
// import { NMessageProvider } from "naive-ui"

// 导入 Unocss 样式 
import 'uno.css'


// 创建 vue 实例
const app = createApp(App)

// 挂载 pinia
app.use(store)
// 挂载 router
app.use(router)

// 挂载实例
app.mount('#app')
