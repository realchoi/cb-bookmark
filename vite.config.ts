import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// 自动引入
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// icon 插件
import Icons from 'unplugin-icons/vite'
// icon 自动引入解析器
import IconsResolver from 'unplugin-icons/resolver'

// Unocss 插件
import Unocss from 'unocss/vite'
// Unocss 默认预设
import presetUno from '@unocss/preset-uno'
// Unocss 属性模式预设
import presetAttributify from '@unocss/preset-attributify'
// Unocss 指令转换插件
import transformerDirective from '@unocss/transformer-directives'

export default defineConfig((config) => {
  const viteEnv = loadEnv(config.mode, './')
  return {
    base: viteEnv.VITE_BASE,
    server: {
      host: '0.0.0.0',
      port: 1996,
      // 端口占用直接退出
      strictPort: true,
      proxy: {
        [viteEnv.VITE_BASE_URL]: {
          target: viteEnv.VITE_BASE_SERVER_URL,
          // 允许跨域
          changeOrigin: true,
          rewrite: path => path.replace(viteEnv.VITE_BASE_URL, '/api')
        }
      }
    },
    plugins: [
      vue(),
      // 新增一个 Unocss 插件配置
      Unocss({
        // 预设
        presets: [presetUno(), presetAttributify()],
        // 指令转换插件
        transformers: [transformerDirective()],
        // 自定义规则
        rules: []
      }),
      // 自动引入
      AutoImport({
        // 需要去解析的文件
        include: [
          /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
          /\.vue$/,
          /\.vue\?vue/, // .vue
          /\.md$/ // .md
        ],
        // imports 指定自动引入的包位置（名）
        imports: ['vue', 'pinia', 'vue-router'],
        // 生成相应的自动导入 json 文件
        eslintrc: {
          // 启用
          enabled: true,
          // 生成自动导入 json 文件位置
          filepath: './.eslintrc-auto-import.json',
          // 全局属性值
          globalsPropValue: true
        },
        resolvers: [NaiveUiResolver(), IconsResolver({ prefix: 'Icon' })]
      }),
      Components({
        // imports 指定组件所在目录，默认为 src/components
        dirs: ['src/components/', '/src/views/'],
        // 需要去解析的文件
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        resolvers: [
          NaiveUiResolver(),
          // icon组件自动引入解析器使用
          IconsResolver({
            enabledCollections: ['ep'],
            // icon自动引入的组件前缀 - 为了统一组件icon组件名称格式
            prefix: 'icon',
            // 自定义的icon模块集合
            customCollections: []
          })
        ]
      }),
      // Icon 插件配置
      Icons({
        compiler: 'vue3',
        customCollections: {},
        autoInstall: true
      })
    ],
    // 这里配置别名
    resolve: {
      alias: {
        // 使用 @ 代替 src 目录
        "@": path.resolve("./src"),
        // 使用 # 代替 types 目录
        "#": path.resolve("./types"),
      }
    }
  }
})