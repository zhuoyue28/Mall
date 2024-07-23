import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import NProgress from "../src/router/NProgress";
// 判断用户无token 返回登录页提示有用
import { message } from 'ant-design-vue';

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
// 简单配置  进度条,可以不配置：在axios中我们不再做配置，以用来区分。
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to, from, next) => {
    NProgress.start();
    const mallToken = localStorage.getItem('mallToken')
    // 在导航前执行操作，例如身份验证检查\
    if (to.path == '/login') {
        console.log('前往登录');
        next()
    } else if (!mallToken) {
        message.error('未登录,请先登录')
        next('/login'); // 重定向到登录页
    }
    else if (from.path == '/login') {
        console.log('登录成功，前往layout');
        // boot()
        addRoutes().then(()=>{
            next()
        })
    }
    else {
        next()
    }
})

