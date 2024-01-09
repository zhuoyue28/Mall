import { createRouter, createWebHistory } from 'vue-router'

const modules:any = await import.meta.glob('../views/**/*.vue', {
  import: 'default',
  eager: true,
})  // 导入

const str = 'IndexLayout/IndexLayout'
console.log(modules), '----------------';

const url = `../views/${str}.vue`
Object.keys(modules).map((path) => {
  console.log(path, '-----------------123');
  console.log(modules[url]);
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    /* {
      path: '/',
      name: 'IndexLayout',
      component: modules[url]
    },
    {
      path: '/login',
      name: 'login',
      component: modules[url]
    } */
  ]
})

export default router
