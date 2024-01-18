<!-- 总页面  书写人:卓越 -->
<script setup lang="ts">
// 依赖及外部引入
import { RouterView } from 'vue-router'
import { message } from 'ant-design-vue';
import { provide } from 'vue';
const [messageApi, contextHolder] = message.useMessage();
const messageFn = (str: string, type: 'info' | 'success' | 'warning' | 'error') => {
  messageApi[type](str)
}
provide('messageFn', messageFn)



</script>

<template>
  <RouterView />
  <context-holder />
</template>

<style scoped lang="less"></style>
