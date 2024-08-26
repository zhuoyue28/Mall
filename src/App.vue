<!-- 总页面  书写人:卓越 -->
<script setup lang="ts">
// 依赖及外部引入
import { RouterView } from 'vue-router'
import { message } from 'ant-design-vue';
import { provide } from 'vue';

import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');

const [messageApi, contextHolder] = message.useMessage();
const messageFn = (str: string, type: 'info' | 'success' | 'warning' | 'error') => {
  messageApi[type](str)
}
provide('messageFn', messageFn)


localStorage.setItem('sbnum', '0');



</script>

<template>
  <a-config-provider :locale="zhCN">
    <RouterView />
    <context-holder />
  </a-config-provider>
</template>

<style scoped lang="less">
:deep(.ant-modal-body) {
  padding-top: 24px !important;
}

:deep(.ant-modal-confirm-content) {
  padding-top: 24px !important;
}
</style>
