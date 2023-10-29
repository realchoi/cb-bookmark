import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
// 自定义 pinia 插件
import { piniaPlugin } from '@/utils/piniaPlugin'

// 引入初始化样式
import "@/assets/css/normalize.css"
// 导入 Unocss 样式 
import 'uno.css'

// 使用自定义 pinia 插件
store.use(piniaPlugin({
    key: 'cb-bookmark'
}))


// 创建 vue 实例
const app = createApp(App)

// 挂载 pinia
app.use(store)
// 挂载 router
app.use(router)

// 挂载实例
app.mount('#app')
