<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item>活动管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListHeaderClass">
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="活动名称" name="name">
                    <a-input v-model:value="data.formHeader.name" placeholder="请输入">
                        <template #prefix>
                            <StarOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="发布状态" name="status">
                    <a-select v-model:value="data.formHeader.status" placeholder="请选择" style="width: 200px">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">已发布</a-select-option>
                        <a-select-option :value="0">未发布</a-select-option>
                    </a-select>
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
                <a-button type="primary" @click="methods.add">添加活动</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'getCoupons'">
                        <span v-for="(item, index) in record.getCoupons" :key="item.id">{{ item.name }}
                            <span v-if="index + 1 != record.getCoupons?.length">/</span>
                        </span>
                    </template>
                    <template v-if="column.dataIndex == 'cover'">
                        <a-image :src="record.cover" :width="100" />
                    </template>
                    <template v-if="column.dataIndex == 'start_time'">
                        <span>{{ record.start_time }} - {{ record.end_time }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'status'">
                        <span>{{ record.status == 1 ? '已发布' : '未发布' }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space size="middle">
                            <a-button type="link" v-if="record.status == 0"
                                @click="methods.Release(record, 1)">发布</a-button>
                            <a-button type="link" v-if="record.status == 1"
                                @click="methods.Release(record, 2)">取消发布</a-button>
                            <a-button type="link" @click="methods.details(record)">编辑</a-button>
                            <a-button type="link" danger @click="methods.del(record)">删除</a-button>

                        </a-space>
                    </template>
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
<script lang="ts" setup>
import { reactive } from 'vue'
import { onMounted, h } from 'vue'
import { activityList, activitySetStatus, activityDel } from "../../request/api/activity"
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
const router = useRouter()

// 变量
const data = reactive({
    formHeader: {//表单头部
        status: '',
        name: ''
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
            title: '活动名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '活动封面图',
            dataIndex: 'cover',
            key: 'cover',
        },
        {
            title: '活动日期',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '活动优惠券',
            dataIndex: 'getCoupons',
            key: 'getCoupons',
        },
        {
            title: '发布状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    content: '确定要删除该活动吗？'
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        activityList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            ...data.formHeader
        }).then((res: any) => {
            console.log(res, 'res-----用户列表');
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
        data.formHeader = {
            status: '',
            name: ''
        }
        methods.getData()
    },
    // 详情
    details(text: any) {
        router.push({ path: '/activityDetails', query: { type: 2, id: text.id } })
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },

    add() {
        router.push({ path: '/activityDetails', query: { type: 1 } })
    },
    Release(row: any, type: number) {
        activitySetStatus({ activity_id: row.id, status: type }).then((res: any) => {
            console.log(res, 'res-----发布活动');
            if (res.code == 200) {
                methods.getData()
                message.success('操作成功')
            }
        })
    },
    del(row: any) {
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                activityDel({ activity_id: row.id }).then((res: any) => {
                    console.log(res, 'res-----删除活动');
                    if (res.code == 200) {
                        methods.getData()
                        message.success('操作成功')
                    }
                })
            },
            onCancel: () => { }
        })
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})
</script>
<style lang="scss" scoped></style>
