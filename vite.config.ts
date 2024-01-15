import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
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
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/zyapi': {
        // target: 'https://netseaglobal-api.aucfan-cn.com/', // 测试服
        // target: 'https://extend.aucfan-cn.com/', // 测试服

        target: 'https://cqapi.kkhuo.com', // 实际请求地址
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
