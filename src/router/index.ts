import { createRouter, createWebHistory,createWebHashHistory } from 'vue-router'
import { message } from 'ant-design-vue';
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


router.beforeEach((to, from, next) => {
  const mallToken = localStorage.getItem('mallToken')
  // 在导航前执行操作，例如身份验证检查\
  if (to.path == '/login') {
    console.log('前往登录');
    next()
  } else if (!mallToken) {
    message.error('未登录,请先登录')
    next('/login'); // 重定向到登录页
  } else {
    console.log(router.getRoutes);
    next()
  }
})





export default router