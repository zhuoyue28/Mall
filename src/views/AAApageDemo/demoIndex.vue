<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item>优惠券</a-breadcrumb-item>
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
            <a-tabs v-model:activeKey="data.activeKey" @change="methods.tabsChange">
                <a-tab-pane key="2" tab="商家劵">
                    <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                        :pagination="false" rowKey="id" @change="methods.getData">
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex == 'platform_rebate'">
                                <span>店铺{{ record.store_rebate }}%，平台{{ record.platform_rebate }}%</span>
                            </template>
                            <template v-if="column.dataIndex == 'status'">
                                <span>{{ record.status == 1 ? '已上架' : '已下架' }}</span>
                            </template>
                            <template v-if="column.dataIndex == 'action'">
                                <a-space size="middle">
                                    <a-button type="link" @click="methods.details(record)">详情</a-button>
                                    <a-button type="link" @click="methods.edit(record)">编辑</a-button>
                                    <a-button type="link" danger @click="methods.delete(record)">删除</a-button>
                                </a-space>
                            </template>
                        </template>

                    </a-table>
                    <div class="flex mt-[12px] items-center justify-end">
                        <a-pagination v-model:current="data.tablePagination.current"
                            v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total"
                            show-size-changer show-quick-jumper @change="methods.pageChange" />
                    </div>

                </a-tab-pane>
                <a-tab-pane key="1" tab="平台劵"></a-tab-pane>
            </a-tabs>


        </div>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { couponList } from '../../request/api/coupon'


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
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '店铺名称',
            dataIndex: 'status',
            key: 'status',
            slots: { customRender: 'status' },
        },
        {
            title: '优惠券名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '优惠券类型',
            dataIndex: 'type_text',
            key: 'type_text',
        },
        {
            title: '优惠券价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '有效期',
            dataIndex: 'valid_day_text',
            key: 'valid_day_text',
        },
        {
            title: '优惠券分成',
            dataIndex: 'platform_rebate',
            key: 'platform_rebate',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
    activeKey: ref('2'),//1：平台券 2：商家券
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        couponList({
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
    },
    tabsChange(val: string) {
        console.log(val, 'tabs')
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>