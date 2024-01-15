import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue';
const modules: any = await import.meta.glob('../views/**/*.vue')  // 导入
const str = 'LoginView/ViewIndex'
const str2 = 'IndexLayout/IndexLayout'
const url = `../views/${str}.vue`
const url2 = `../views/${str2}.vue`



const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'IndexLayout',
      component: modules[url2],
      children: [
        {
          path: '/',
          name: 'ViewIndex',
          component: modules[url]
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: modules[url]
    }
  ]
})


router.beforeEach((to, from, next) => {
  const mallToken = localStorage.getItem('mallToken')
  // 在导航前执行操作，例如身份验证检查
  if (!mallToken && to.path != '/login') {
    message.error('未登录,请先登录')
    setTimeout(() => {
      next('/login'); // 重定向到登录页
    }, 500);
  } else {
    next(); // 继续导航
  }
})


export default router