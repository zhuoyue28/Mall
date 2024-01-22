<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item>角色管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListHeaderClass">

            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label=" 角色名称" name="keyword">
                    <a-input v-model:value="data.formHeader.keyword">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item>
                    <a-button type="primary" @click="methods.getData()">查 询</a-button>
                </a-form-item>
                <a-form-item>
                    <a-button type="default" @click="methods.Repossess()">重 置</a-button>
                </a-form-item>
            </a-form>


        </div>
        <div class="tableListContentClass">
            <div class="mb-[12px]">
                <a-button type="primary" @click="methods.viewFn(null, '3')">新建角色</a-button>
            </div>
            <a-table :dataSource="data.tableData" :columns="data.columns" rowKey="id" :loading="data.tableLoading"
                :pagination="false">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'role_name'">
                        <!-- <span v-if="record.role?.role_name" class="text-[#1677ff]"> {{ record.role?.role_name }}</span>
                        <span v-else class="text-[#FF4D4F]">暂无绑定角色</span> -->

                        <a-tag v-if="record.role?.role_name" color="#87d068">{{ record.role?.role_name }}</a-tag>
                        <a-tag v-else color="#FF4D4F">暂无绑定角色</a-tag>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <a-switch class="bg-[#898989]" :checkedValue="1" :uncheckedValue="0" v-model:checked="record.status"
                            @change="(val) => { methods.statusEdit(val, record) }" />
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="methods.viewFn(record.id, '1')">详情</a-button>
                        <a-button type="link" @click="methods.viewFn(record.id, '2')">编辑</a-button>
                        <a-button type="link" danger @click="methods.Edit(record)">删除</a-button>
                    </template>
                </template>
            </a-table>

            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.pagination.current" v-model:pageSize="data.pagination.pageSize"
                    :total="data.pagination.total" show-size-changer show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>



    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject } from 'vue';
import { adminList, adminUpdateStatus } from "../../../request/api/adminList/index";
import type { FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
// const formRef = ref<FormInstance>();// 新增弹窗ref
const formHeader = ref<FormInstance>()// 新增header表单
const data = reactive({
    formHeader: {
        keyword: '',//角色名称
    },
    columns: [// 表头
        {
            title: '员工名称',
            dataIndex: 'real_name',
            key: 'real_name',
        },
        {
            title: '登录账户',
            dataIndex: 'account',
            key: 'account',
        },
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '添加时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    tableLoading: false,// 表格加载
    tableData: [],// 表格数据
    router: useRouter(),// 路由
    pagination: {// 分页
        current: 1,
        pageSize: 10,
        total: 0
    }
})
const methods = reactive({
    getData: (page?: number, limit?: number) => {
        data.tableLoading = true
        adminList({
            ...data.formHeader, page: page || 1, limit: limit || 10
        }).then(res => {
            data.tableData = res.data.data
            data.tableLoading = false
            console.log(data.tableData, '获取角色列表');
            data.pagination.total = res.data.total
            data.pagination.current = res.data.current_page
            data.pagination.pageSize = res.data.per_page
        })
    },
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    Repossess: () => {
        formHeader.value?.resetFields()
        methods.getData()
    },
    Edit: (row: any) => {
        console.log(row);
    },
    viewFn: (id: number | null, type: string) => {//type 1查看 2编辑 3添加
        if (!id) {
            data.router.push({ path: '/addAdmin', query: { type } })
            return
        }
        data.router.push({ path: '/addAdmin', query: { id, type } })
    },
    statusEdit: (val, row: any) => {
        adminUpdateStatus({ status: val ? 1 : 0, id: row.id }).then(() => {
            methods.messageFn('修改成功', 'success')
            methods.getData()
        })
    },
    pageChange: (val) => {
        methods.getData(val, data.pagination.pageSize)
    }
})

// 获取表格数据
methods.getData()

</script>

<style lang="scss" scoped></style>