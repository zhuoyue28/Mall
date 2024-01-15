<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item><a href="">菜单管理</a></a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListHeaderClass">
            <a-button type="primary" @click="() => {
                data.addShow = true
                data.isEdit = false
            }">{{ data.isEdit ? '编辑菜单' : '新建菜单' }}</a-button>
        </div>
        <div class="tableListContentClass">
            <a-table :dataSource="data.tableData" :columns="data.columns" rowKey="id" :loading="data.tableLoading">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="methods.Edit(record.id)">编辑</a-button>
                    </template>
                </template>
            </a-table>
        </div>

        <!-- 新增弹窗 -->
        <a-modal v-model:open="data.addShow" title="新建菜单" @ok="methods.handleOk" @cancel="methods.handleCancel"
            :confirmLoading="data.addLoading" cancelText="取消" okText="添加">
            <a-form class="mt-[20px]" ref="formRef" :model="data.formState" name="basic" :label-col="{ span: 4 }"
                :wrapper-col="{ span: 19 }" autocomplete="off" @finish="methods.onFinish"
                @finishFailed="methods.onFinishFailed">
                <a-form-item label="pid" name="pid" :rules="[{ required: true, message: '请选择pid!', trigger: 'change' }]">
                    <a-select ref="select" v-model:value="data.formState.pid" :options="data.tableData"
                        :fieldNames="{ lable: 'menu_name', value: 'id' }" placeholder="请选择pid"></a-select>
                </a-form-item>
                <a-form-item label="菜单名" name="menu_name" :rules="[{ required: true, message: '请输入菜单名!' }]">
                    <a-input v-model:value="data.formState.menu_name" placeholder="请输入菜单名" />
                </a-form-item>
                <a-form-item label="icon" name="icon" :rules="[{ required: true, message: '请输入icon!' }]">
                    <a-input v-model:value="data.formState.icon" placeholder="请输入icon" />
                </a-form-item>
                <a-form-item label="route" name="route" :rules="[{ required: true, message: '请输入route!' }]">
                    <a-input v-model:value="data.formState.route" placeholder="请输入route" />
                </a-form-item>
                <a-form-item label="菜单路径" name="path" :rules="[{ required: true, message: '请输入菜单路径!' }]">
                    <a-input v-model:value="data.formState.path" placeholder="请输入菜单路径" />
                </a-form-item>
                <a-form-item label="组件路径" name="component" :rules="[{ required: true, message: '请输入组件路径!' }]">
                    <a-input v-model:value="data.formState.component" placeholder="请输入组件路径" />
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { roleFindUserMenu, menuStore } from "../../request/api/menu/menu"
import type { FormInstance } from 'ant-design-vue';

const formRef = ref<FormInstance>();// 新增弹窗ref

const data = reactive({
    columns: [// 表头
        {
            title: '菜单名称',
            dataIndex: 'menu_name',
            key: 'menu_name',
        },
        {
            title: '权限管理',
            dataIndex: 'is_menu',
            key: 'is_menu',
        },
        {
            title: '菜单路径',
            dataIndex: 'path',
            key: 'path',
        },
        {
            title: '菜单图标',
            dataIndex: 'icon',
            key: 'icon',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    tableLoading: false,// 表格加载
    tableData: [],// 表格数据
    addShow: false,// 新增弹窗
    formState: {// 新增弹窗表单数据
        menu_name: '',
        icon: '',
        route: '',
        path: '',
        component: '',
        is_menu: 1,
        pid: 0
    },
    addLoading: false,// 新增弹窗确定按钮loading
    isEdit: false,// 是否是编辑
})


const methods = reactive({
    getData: () => {
        data.tableLoading = true
        roleFindUserMenu({}).then(res => {
            data.tableData = res.data
            data.tableLoading = false
        })
    },
    Edit: (row: any) => {// 编辑
        console.log(row)
    },
    handleOk: () => {// 新增弹窗确认
        formRef.value!.validateFields()
    },
    handleCancel: () => {// 新增弹窗取消
        formRef.value!.resetFields()
        data.addShow = false
    },
    onFinish: (values: any) => {// 新增表单验证成功
        console.log('Success:', values);
    },
    onFinishFailed: (errorInfo: any) => {// 新增表单验证失败
        console.log('Failed:', errorInfo);
    }
})

// 获取表格数据
methods.getData()

</script>

<style lang="scss" scoped></style>