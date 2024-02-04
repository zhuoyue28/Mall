<!-- 总页面-组件-header  书写人:卓越 -->
<script lang="ts" setup>
import { WarningOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { reactive, h, inject } from 'vue'
import { Modal } from 'ant-design-vue';

const router = useRouter()// 路由

// 定义变量
const data = reactive({
    contentStyle: { style: { fontSize: '15px', fontWeight: '500' } },//节点样式
    content: () => {//插入节点
        return h('div', data.contentStyle, '确认退出登录吗？')
    },
    adminInfo: JSON.parse(localStorage.getItem('adminInfo') + ''),
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
})


console.log(data.adminInfo, 'data.adminInfo');


// 定义方法
const methods = reactive({
    LoginOut: () => { //确认退出登录
        Modal.confirm({
            title: '退出提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                localStorage.setItem('mallToken', '')
                localStorage.setItem('adminInfo', '{}')
                data.messageFn('退出成功', 'success')
                router.push('/login')
            },
            onCancel: () => { }
        })
    },
})


</script>

<template>
    <div class=' w-full h-full flex justify-between items-center'>
        <div class="text-[#fff] text-[20px] font-[700] flex items-center">
            <img class="w-[40px] h-[40px] mr-[12px]" src="../../../assets/image/loginLogo.png" alt="">
            簇桥活力广场
        </div>
        <div class="flex items-center">
            <div class="mr-[20px] flex items-center cursor-pointer" @click="methods.LoginOut">
                <a-avatar size="large" :src="data.adminInfo.avatar">
                </a-avatar>
                <span class="ml-[10px] text-[14px] text-[#fff]">{{ data.adminInfo.real_name }}</span>
            </div>
        </div>
    </div>
</template>



<style lang="less" scoped>
.test {
    font-size: 16px;
    font-weight: 700;
}
</style>