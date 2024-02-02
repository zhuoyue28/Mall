import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import topLevelAwait from 'vite-plugin-top-level-await'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/zyapi': {
        // target: 'https://netseaglobal-api.aucfan-cn.com/', // 测试服
        // target: 'https://extend.aucfan-cn.com/', // 测试服

        target: 'https://api.jiazhengroup.com/', // 实际请求地址
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zyapi/, ""),
      }, 
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
