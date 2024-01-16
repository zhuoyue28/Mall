import { createRouter, createWebHistory } from 'vue-router'
import { message } from 'ant-design-vue';
// import { menuList } from "@/request/api/menu/menu"
// import { ref } from 'vue';
const modules: any = await import.meta.glob('../views/**/*.vue')  // 导入
const str = 'LoginView/ViewIndex'
const str2 = 'IndexLayout/IndexLayout'
const url = `../views/${str}.vue`
const url2 = `../views/${str2}.vue`
// const menulist = ref([])


// function dynamicRouter(routers: any[]) {
//   const list: any = []
//   routers.forEach((itemRouter: any, index: number) => {
//     list.push({
//       path: itemRouter.path,
//       name: itemRouter.menu_name,
//       // redirect: itemRouter.children && itemRouter.children.length ? itemRouter.children[0].path : itemRouter.path,
//       component: modules[`${itemRouter.component}`],
//       // component: () => import(`@/${itemRouter.component}`)
//     })
//     // 是否存在子集
//     if (itemRouter.children && itemRouter.children.length) {
//       list[index].children = dynamicRouter(itemRouter.children);
//     }
//   })
//   return list
// }

// function setrouterList() {
//   return menuList({}).then(res => {
//     menulist.value = res.data
//     const addRouterList = [
//       {
//         path: '/',
//         name: 'IndexLayout',
//         component: modules[url2],
//         redirect: '/menulist',
//       },
//       {
//         path: '/login',
//         name: 'login',
//         component: modules[url]
//       }
//     ]
//     return addRouterList
//   })
// }


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [{
    path: '/',
    name: 'IndexLayout',
    component: modules[url2],
    redirect: '/SystemSettings',
  },
  {
    path: '/login',
    name: 'login',
    component: modules[url]
  },]
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

    // const menulist = JSON.parse(localStorage.getItem('menuList') + '')
    // dynamicRouter(menulist).forEach((item: any) => {
    //   console.log(item, 'item');
    //   router.addRoute('IndexLayout', item)
    // })
    // next({ path: to.path, replace: true })
    next()

  }
})





export default router