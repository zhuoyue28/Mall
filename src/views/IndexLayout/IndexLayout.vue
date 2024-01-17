<!-- 总页面  书写人:卓越 -->
<script setup lang="ts">
// 依赖及外部引入
import { RouterView } from 'vue-router'
import { provide } from 'vue'
// import { StepBackwardOutlined } from '@ant-design/icons-vue'
// 内部组件引入 - 公共组件
import MallLayoutMenu from '@/components/CommonComponents/LayOut/MallLayoutMenu.vue'
import MallLayoutHeader from '@/components/CommonComponents/LayOut/MallLayoutHeader.vue'
// 接口
import { menuList } from "@/request/api/menu/menu";
import router from "@/router/index"

const getMenuList = () => {
    menuList({ page: 1, limit: 999 }).then(res => {
        console.log(res, '菜单');
        provide('menuList', res.data)
        console.log(router.getRoutes(), 'router.getRoutes()');
    })
}



// 菜单
getMenuList()
</script>

<template>
    <a-layout style="height: 100vh;overflow: hidden;">
        <a-layout-header style="background-color:#1070FF;">
            <MallLayoutHeader />
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="256px" style="height: calc(100vh - 64px); background-color: #fff;">
                <MallLayoutMenu />
            </a-layout-sider>
            <a-layout-content>
                <RouterView />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<style scoped></style>
