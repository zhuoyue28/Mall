<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item @click="() => { $router.go(-1) }" class="cursor-pointer">添加角色</a-breadcrumb-item>
        </a-breadcrumb>
        <!-- <div class='tableListHeaderClass'>
        </div> -->
        <div class='tableListContentClass'>
            <a-form :model="formState" name="basic" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" autocomplete="off"
                @finish="onFinish" @finishFailed="onFinishFailed">
                <a-form-item label="Username" name="username"
                    :rules="[{ required: true, message: 'Please input your username!' }]">
                    <a-input v-model:value="formState.username" />
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>
<script lang='ts' setup>
import {  reactive } from 'vue';
import { useRoute } from 'vue-router';
import { adminFindData } from '../../../request/api/adminList/index'
const route = useRoute();


const formState = reactive({
    username: '',
})

const onFinish = (values: any) => {
    console.log('Success:', values);
}

const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
}

const getTree = () => {
    adminFindData({ id: route.query.id }).then(res => {
        console.log(res, '查询角色详情');
    })
}


getTree()



</script>
<style lang='scss' scoped></style>