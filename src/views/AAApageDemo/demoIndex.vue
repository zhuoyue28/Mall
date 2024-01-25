<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item>角色管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="员工名称" name="keyword">
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
        <div class='tableListContentClass'>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #status="scoped">
                    <a-switch v-model:checked="scoped.record.status" :checkedValue="1" :uncheckedValue="0"
                        @change="(val: boolean) => { methods.switchChange(val, scoped.record.id) }" />
                </template>
                <template #action="scoped">
                    <a-space size="middle">
                        <a-button type="link" @click="methods.details(scoped.record)">编辑</a-button>
                        <a-button type="link" @click="methods.edit(scoped.record)">编辑</a-button>
                        <a-button type="link" danger @click="methods.delete(scoped.record)">删除</a-button>
                    </a-space>
                </template>
            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.tablePagination.current"
                    v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total" show-size-changer
                    show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive } from 'vue'
import { onMounted } from 'vue'
import { roleList } from '../../request/api/rolesList/index'

// 变量
const data = reactive({
    formHeader: {//表单头部
        keyword: '',
    },
    tableData: [],//表格数据
    tableLoading: false,//表格加载
    tablePagination: {//分页
        current: 1,
        pageSize: 10,
        total: 0,
    },
    tableColumns: [//表头
        {
            title: '角色名称',
            dataIndex: 'role_name',
            key: 'role_name',
        },
        {
            title: '角色状态',
            dataIndex: 'status',
            key: 'status',
            slots: { customRender: 'status' },
        },
        {
            title: '角色简介',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            slots: { customRender: 'action' },
        },
    ],
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        roleList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            keyword: data.formHeader.keyword,
        }).then((res: any) => {
            console.log(res, 'res-----角色列表');
            data.tableData = res.data.data
            data.tablePagination.total = res.data.total
            data.tablePagination.current = res.data.current_page
            data.tablePagination.pageSize = res.data.per_page
            data.tableLoading = false
        })
    },
    // 重置
    Repossess() {
        console.log('重置')
    },
    // 编辑
    edit(text: any) {
        console.log(text, '编辑')
    },
    // 删除
    delete(text: any) {
        console.log(text, '删除')
    },
    // 详情
    details(text: any) {
        console.log(text, '详情')
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    // 开关
    switchChange(val: boolean, id: number) {
        console.log(val, id, '开关')
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>