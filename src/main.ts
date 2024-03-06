import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router, addRoutes } from './router/bag'
import * as Icons from "@ant-design/icons-vue";
import type { Component } from 'vue'
const app = createApp(App)
const IconData: Record<string, Component> = Icons
console.log('IconData', IconData)
Object.keys(IconData).forEach((key: string) => {
    app.component(key, IconData[key]);
})

app.use(createPinia())
const boot = async () => {
    // 挂载动态路由需要在挂载app/router之前
    await addRoutes()
    app.use(router)
    app.mount('#app')
}

boot()

