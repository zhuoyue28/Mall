import { createRouter,createWebHashHistory } from 'vue-router'
// import { menuList } from "@/request/api/menu/menu"
// import { ref } from 'vue';
const modules: any = await import.meta.glob('../views/**/*.vue')  // 导入
const str = 'LoginView/ViewIndex'
const str2 = 'IndexLayout/IndexLayout'
const url = `../views/${str}.vue`
const url2 = `../views/${str2}.vue`



const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    name: 'IndexLayout',
    component: modules[url2],
    redirect: '/menulist',
    children: []
  },
  {
    path: '/login',
    name: 'login',
    component: modules[url]
  },]
})







export default router