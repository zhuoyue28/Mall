<!-- 总页面  书写人:卓越 -->
<script setup lang="ts">
// 依赖及外部引入
import { RouterView } from 'vue-router'
// 内部组件引入 - 公共组件
import MallLayoutMenu from '@/components/CommonComponents/LayOut/MallLayoutMenu.vue'
import MallLayoutHeader from '@/components/CommonComponents/LayOut/MallLayoutHeader.vue'



</script>

<template>
    <a-layout style="height: 100vh;overflow: hidden;">
        <a-layout-header style="background-color:#1070FF;">
            <MallLayoutHeader />
        </a-layout-header>
        <a-layout>
            <a-layout-sider width="256px" style="height: calc(100vh - 64px); background-color: #fff;">
                <MallLayoutMenu  />
            </a-layout-sider>
            <a-layout-content>
                <RouterView />
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<style scoped></style>
