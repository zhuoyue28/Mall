<!-- 总页面-组件-header  书写人:卓越 -->
<script lang="ts" setup>
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { useRouter } from 'vue-router';
import { reactive, createVNode, h } from 'vue'
import { Modal } from 'ant-design-vue';

const router = useRouter()// 路由

// 定义变量
const data = reactive({
    content: () => {//插入节点
        return h('div', {
            style: { fontSize: '16px', fontWeight: '500' }
        }, '确认退出登录吗？')
    }
})

// 定义方法
const methods = reactive({
    LoginOut: () => { //确认退出登录
        Modal.confirm({
            title: '登出提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: createVNode(ExclamationCircleOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                router.push('/login')
            },
            onCancel: () => { }
        })
    },
})



</script>

<template>
    <div class=' w-full h-full flex justify-between items-center'>
        <div class="text-[#fff] text-[20px] font-[700]">
            簇桥活力广场
        </div>
        <div class="flex items-center">
            <div class="mr-[20px]">
                <a-avatar size="large" style="background-color: #f56a00;verticalAlign: middle;">
                    管理员
                </a-avatar>
            </div>
            <div class="text-[16px] text-[#fff] cursor-pointer" @click="methods.LoginOut">
                退出登录
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