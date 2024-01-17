import { ref } from 'vue'
import { defineStore } from 'pinia'
import router from './../router/index';
const modules: any = await import.meta.glob('../views/**/*.vue')  // 导入\
export const useMenuData = defineStore('menuData', () => {
  const menulist = ref<any[]>([])
  const setMenuList = (data: any[]) => {
    menulist.value = data
  }
  const setAddRouter = (data?: any[]) => {
    // data.forEach((item, index) => {
    //   console.log(item, '菜单单条');
    // })
    router.addRoute('IndexLayout', {
      path: 'menulist',
      name: '菜单管理',
      component: modules[`../views/SystemSettings/menuList.vue`]
    })
    console.log(router.getRoutes());
    
  }

  return { menulist, setMenuList, setAddRouter }
})
