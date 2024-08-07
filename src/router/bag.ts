// 说明：路由守卫文件

// 引入
import router from "./index";

import NProgress from "./NProgress"

// 简单配置  进度条,可以不配置：在axios中我们不再做配置，以用来区分。
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })
// 一、前置守卫

const modules: any = await import.meta.glob('../views/**/*.vue')  // 导入





// router.beforeEach((to, from, next) => {
//     // 进度条

//     // 1、动态路由
//     // addRoutes();
//     // 2、中间处理（token）
//     // 3、最后放行
//     next();
// })

// 动态路由获取：注:之后完善项目直接考虑在登录的时候直接获取
// 直接缓存在 pinia 里
// 这里直接取数据，不请求
import { roleFindUserMenu } from '@/request/api/menu/menu'
// import menuData from '@/components/menu2/menuData.json';
async function addRoutes() {
    NProgress.start();
    const menuData = await roleFindUserMenu({})
    // 1、后端数据
    createRouters(menuData.data);
    console.log("router/index.js打印router已有的路由信息", router.getRoutes());
}
// 拼接路由
function createRouters(result: any) {
    result.forEach((item: any) => {
        if (item.children && item.children.length > 0) {
            item.children.forEach((children: any) => {
                createRouterTemplate('IndexLayout', children, item.path);
            })
        }
        // 子路由为空
        if (item.children && item.children.length === 0 || !item.children) {
            createRouterTemplate('IndexLayout', item);
        }

        // // 3、递归层级
        // if (item.children && item.children.length > 0) {
        //     createRouters(item.children);
        // }
    });
}
// 把router 的动态路由进行封装
function createRouterTemplate(fatherRouter: any, item: any, Fpath?: string) {
    router.addRoute(fatherRouter, {
        path: item.path,
        name: item.menu_name,
        meta: {
            title: item.menu_name, // 面包屑用
            Fpath: Fpath || '/'
        },
       
        component: modules[item.component]
    })

}


// 二、后置守卫
router.afterEach((to) => {
    // 标签抬头  - 自定义
    document.title = '簇桥活力广场-' + to.meta.title + '';

    // 进度条
    NProgress.done();
})


// main.js 导入的为这个router
export { addRoutes, router }

