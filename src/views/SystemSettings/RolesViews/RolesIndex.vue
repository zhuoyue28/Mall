<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>系统设置</a-breadcrumb-item>
            <a-breadcrumb-item>角色管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="角色名称" name="keyword">
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
            <div class="mb-[12px]">
                <a-button type="primary" @click="methods.add">新建角色</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'status'">
                        <a-switch v-model:checked="record.status" :checkedValue="1" :uncheckedValue="0"
                            @change="(val: boolean) => { methods.switchChange(val, record.id) }" />
                    </template>
                    <template v-else-if="column.dataIndex === 'description'">
                        <a-tooltip placement="topLeft" :title="record.description">
                            <div style="width: 200px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{
                                record.description }}</div>
                        </a-tooltip>
                    </template>
                    <template v-else-if="column.dataIndex === 'action'">
                        <a-space size="middle">
                            <a-button type="link" @click="methods.edit(record)">编辑</a-button>
                            <a-button type="link" danger @click="methods.delete(record)">删除</a-button>
                        </a-space>
                    </template>
                    <span v-else>{{ record[column.dataIndex] }}</span>
                </template>
            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.tablePagination.current"
                    v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total" show-size-changer
                    show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>

        <!-- 新增/编辑角色 -->
        <a-modal v-model:open="data.AddEShow" :title="data.isEdit ? '编辑角色' : '添加角色'" okText="确认" cancelText="取消"
            icon="warning" maskClosable="true" autoFocusButton="null" @ok="methods.AddEeOk" @cancel="methods.AddECancel"
            width="600px" :confirmLoading="data.AddELoading">
            <a-form :model="data.formAddE" ref="formAddE" name="horizontal_login" autocomplete="off">
                <a-form-item label="角色名称" name="role_name" :rules="[{ required: true, message: '请输入角色名字' }]">
                    <a-input v-model:value="data.formAddE.role_name" placeholder="请输入角色名字"></a-input>
                </a-form-item>
                <a-form-item label="角色描述" name="description" :rules="[{ required: true, message: '请输入角色描述' }]">
                    <a-textarea v-model:value="data.formAddE.description" placeholder="请输入角色描述"></a-textarea>
                </a-form-item>
                <a-form-item label="角色权限" name="rules" :rules="[{ required: true, message: '请选择角色权限' }]">
                    <a-tree v-model:checkedKeys="data.checkedKeys" checkable :tree-data="data.menuData"
                        :fieldNames="{ children: 'children', title: 'menu_name', key: 'id', value: 'id' }"
                        @check="methods.treeChange">
                    </a-tree>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang='ts' setup>
import { reactive, inject, ref, h } from 'vue'
import { onMounted } from 'vue'
import { roleList, roleUpdateStatus, roleDeleteRole, roleUpdate, roleStore } from '../../../request/api/rolesList/index'
import { menuList } from "../../../request/api/menu/menu"
import type { FormInstance } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
const formHeader = ref<FormInstance>()// 新增header表单
const formAddE = ref<FormInstance>()// 新增/编辑表单
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
        },
        {
            title: '角色简介',
            dataIndex: 'description',
            key: 'description',
            width: 300,
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    content: '确定删除该角色吗？',
    formAddE: {//新增/编辑
        role_name: '',
        description: '',
        rules: '',
        rules_copy: ''
    },
    AddEShow: false,//新增/编辑显示
    isEdit: false,//是否编辑
    menuData: [],//菜单数据
    checkedKeys: ref<number[]>([]),//选中
    halfCheckedKeys: [],//半选
    AddELoading: false,//新增/编辑加载
    editID: 0,//编辑id
})

// 方法
const methods = {
    // messageFn
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        roleList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            keyword: data.formHeader.keyword,
        }).then((res: any) => {
            data.tableData = res.data.data
            data.tablePagination.total = res.data.total
            data.tablePagination.current = res.data.current_page
            data.tablePagination.pageSize = res.data.per_page
            data.tableLoading = false
        })
    },
    // 重置
    Repossess() {
        formHeader.value?.resetFields()
        methods.getData()
    },
    // 新增
    add() {
        data.AddEShow = true
        data.isEdit = false
    },
    // 编辑
    edit(text: any) {
        console.log(text, '编辑')

        data.isEdit = true
        data.formAddE.role_name = text.role_name
        data.formAddE.description = text.description
        data.formAddE.rules = text.rules
        data.formAddE.rules_copy = text.rules_copy
        data.editID = text.id
        // data.checkedKeys = text.rules_copy.split(',')
        let arr = text.rules_copy.split(',')
        console.log(arr, 'arr');
        arr.forEach((item: any) => {
            data.checkedKeys.push(Number(item))
        })
        console.log(data.checkedKeys, 'data.checkedKeys');
        data.AddEShow = true

    },
    // 删除
    delete(row: any) {
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                roleDeleteRole({ id: row.id }).then((res: any) => {
                    if (res.code == 200) {
                        methods.messageFn('删除成功', 'success')
                        methods.getData(data.tablePagination.current, data.tablePagination.pageSize)
                    }
                })
            },
            onCancel: () => { }
        })
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
        roleUpdateStatus({
            id: id,
            status: val ? 1 : 0,
        }).then((res: any) => {
            if (res.code == 200) {
                methods.messageFn('修改成功', 'success')
                methods.getData(data.tablePagination.current, data.tablePagination.pageSize)
            }
        })
    },
    // 新增/编辑确认
    AddEeOk() {
        formAddE.value?.validate().then(() => {
            data.AddELoading = true
            if (data.isEdit) {
                roleUpdate({
                    id: data.editID,
                    role_name: data.formAddE.role_name,
                    description: data.formAddE.description,
                    rules: data.formAddE.rules,
                    rules_copy: data.formAddE.rules_copy
                }).then((res: any) => {
                    if (res.code == 200) {
                        methods.messageFn('编辑成功', 'success')
                        methods.getData(data.tablePagination.current, data.tablePagination.pageSize)
                        data.AddEShow = false
                        data.AddELoading = false
                    } else {
                        data.AddELoading = false
                    }
                }).catch(() => {
                    data.AddELoading = false
                })
            } else {
                roleStore({ ...data.formAddE }).then((res: any) => {
                    if (res.code == 200) {
                        methods.messageFn('添加成功', 'success')
                        methods.getData(1, data.tablePagination.pageSize)
                        data.AddEShow = false
                        data.AddELoading = false
                    } else {
                        data.AddELoading = false
                    }
                }).catch(() => {
                    data.AddELoading = false
                })
            }
        })
    },
    // 新增/编辑取消
    AddECancel() {
        formAddE.value!.resetFields()
        data.formAddE.role_name = ''
        data.formAddE.description = ''
        data.formAddE.rules = ''
        data.formAddE.rules_copy = ''
        data.checkedKeys = []
        data.AddEShow = false
    },
    getmenuList() {
        menuList({
            page: 1,
            limit: 1000,
        }).then((res: any) => {
            console.log(res, 'res-----菜单列表');
            data.menuData = res.data
        })
    },
    treeChange(checkedKeys: any, e: any) {
        console.log(checkedKeys, e, 'checkedKeys');
        data.checkedKeys = checkedKeys
        data.halfCheckedKeys = e.halfCheckedKeys
        data.formAddE.rules = data.checkedKeys.concat(data.halfCheckedKeys) + ''
        data.formAddE.rules_copy = data.checkedKeys + ''
        console.log(data.formAddE.rules, 'data.formAddE.rules');
        console.log(data.formAddE.rules_copy, 'data.formAddE.rules_copy');
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
    methods.getmenuList()
})


</script>
<style lang='scss' scoped></style>