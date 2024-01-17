import './assets/main.css'
import 'ant-design-vue/dist/reset.css';
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router, addRoutes } from './router/bag'

const app = createApp(App)

const boot = async () => {
    await addRoutes()
    app.use(createPinia())
    app.use(router)
    app.mount('#app')
}

boot()

