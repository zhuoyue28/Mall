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
            }">新建菜单</a-button>
        </div>
        <div class="tableListContentClass">
            <a-table :dataSource="data.tableData" :columns="data.columns" rowKey="id" :loading="data.tableLoading">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="methods.Edit(record)">编辑</a-button>
                    </template>
                </template>
            </a-table>
        </div>

        <!-- 新增弹窗 -->
        <a-modal v-model:open="data.addShow" :title="data.isEdit ? '编辑菜单' : '新建菜单'" @ok="methods.handleOk"
            @cancel="methods.handleCancel" :confirmLoading="data.addLoading" cancelText="取消"
            :okText="data.isEdit ? '编辑' : '添加'">
            <a-form class="mt-[20px]" ref="formRef" :model="data.formState" name="basic" :label-col="{ span: 4 }"
                :wrapper-col="{ span: 19 }" autocomplete="off">
                <a-form-item label="pid" name="pid" :rules="[{ required: true, message: '请选择pid!', trigger: 'change' }]">
                    <a-tree-select v-model:value="data.formState.pid" show-search style="width: 100%"
                        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allow-clear
                        tree-default-expand-all :tree-data="data.tableData" tree-node-filter-prop="label"
                        :field-names="{ label: 'menu_name', value: 'id', options: 'children' }" />
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
                <a-form-item label="是否菜单" name="component">
                    <a-radio-group v-model:value="data.formState.is_menu" name="radioGroup">
                        <a-radio value="1">菜单</a-radio>
                        <a-radio value="2">按钮</a-radio>
                        <a-radio value="3">非菜单子页面</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from 'vue';
import { menuStore, menuList, menuUpdate } from "../../request/api/menu/menu"
import type { FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
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
        is_menu: '1',
        pid: 0
    },
    addLoading: false,// 新增弹窗确定按钮loading
    isEdit: false,// 是否是编辑
    editID: null,// 编辑ID
    router: useRouter(),// 路由
})


const methods = reactive({
    getData: () => {
        data.tableLoading = true
        menuList({}).then(res => {
            data.tableData = res.data
            data.tableLoading = false
            console.log(data.tableData, '获取菜单');

        })
    },
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    Edit: (row: any) => {// 编辑
        console.log(row)
        data.isEdit = true
        data.editID = row.id
        data.addShow = true
        data.formState = {
            menu_name: row.menu_name,
            icon: row.icon,
            route: row.route,
            path: row.path,
            component: row.component,
            is_menu: row.is_menu + '',
            pid: row.pid
        }
    },
    handleOk: () => {// 新增弹窗确认
        formRef.value!.validateFields().then(() => {
            console.log('通过');
            data.addLoading = true
            if (!data.isEdit) {
                menuStore({ ...data.formState }).then(res => {
                    if (res.code == 200) {
                        data.addLoading = false
                        methods.handleCancel()
                        methods.getData()
                        methods.messageFn('添加成功', 'success')
                    }
                })
            } else {
                menuUpdate({ ...data.formState, id: data.editID }).then(res => {
                    if (res.code == 200) {
                        data.addLoading = false
                        methods.handleCancel()
                        methods.getData()
                        methods.messageFn('编辑成功', 'success')
                    }
                })
            }
        }).catch(() => {
            console.log('校验失败');
        })
        // formRef.value!.onSubmit()
    },
    handleCancel: () => {// 新增弹窗取消
        formRef.value!.resetFields()
        data.addShow = false
    },
})

// 获取表格数据
methods.getData()

</script>

<style lang="scss" scoped></style>