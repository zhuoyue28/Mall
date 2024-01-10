import { createRouter, createWebHistory } from 'vue-router'

const modules:any = await import.meta.glob('../views/**/*.vue')  // 导入

const str = 'LoginView/ViewIndex'
const url = `../views/${str}.vue`

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'IndexLayout',
      component: modules[url]
    },
   /*  {
      path: '/login',
      name: 'login',
      component: modules[url]
    } */
  ]
})

export default router
