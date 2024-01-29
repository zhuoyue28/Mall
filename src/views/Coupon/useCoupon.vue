<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>优惠卷管理</a-breadcrumb-item>
            <a-breadcrumb-item>优惠卷</a-breadcrumb-item>
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
                </a-tab-pane>
                <a-tab-pane key="1" tab="平台劵"></a-tab-pane>
            </a-tabs>
            <div class="mb-[12px]" v-if="data.activeKey == '2'">
                <a-button type="primary" @click="methods.add">新建商家劵</a-button>
            </div>
            <div class="mb-[12px]" v-else>
                <a-button type="primary" @click="methods.add">新建平台劵</a-button>
            </div>
            <a-table :columns="data.activeKey == '2' ? data.tableColumns : data.tableColumns1" :dataSource="data.tableData"
                :loading="data.tableLoading" :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'platform_rebate'">
                        <span v-if="record.source == 2">店铺{{ record.store_rebate }}%，平台{{ record.platform_rebate }}%</span>
                        <span v-else>--</span>
                    </template>
                    <template v-if="column.dataIndex == 'reduce'">
                        <span v-if="record.type == '1'">满{{ record.full }}元,减{{ record.reduce }}元</span>
                        <span v-if="record.type == '3'">{{ record.full }}元,团{{ record.reduce }}元</span>
                        <span v-if="record.type == '2'">{{ record.reduce }}元代金券</span>
                    </template>
                    <template v-if="column.dataIndex == 'status'">
                        <span>{{ record.status == 1 ? '已上架' : '已下架' }}</span>
                    </template>
                    <template v-if="column.dataIndex == 'action'">
                        <a-space size="small" class="flex flex-wrap">
                            <a-button v-if="record.status == 0" type="link"
                                @click="methods.setStatus(record, 1)">上架</a-button>
                            <a-button v-if="record.status == 1" type="link" danger
                                @click="methods.setStatus(record, 0)">下架</a-button>
                            <a-button type="link" @click="methods.details(record)">详情</a-button>
                            <a-button type="link" @click="methods.edit(record)">编辑</a-button>
                            <a-button type="link" danger @click="methods.delete(record)">删除</a-button>
                            <a-button type="link" @click="methods.edit(record)"
                                v-if="!Number(record.price)">生成优惠券码</a-button>
                                <a-button type="link" @click="methods.edit(record)"
                                v-if="!Number(record.price)">查看兑换记录</a-button>
                            
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
<script lang='ts' setup>
import { reactive, ref, h } from 'vue'
import { onMounted } from 'vue'
import { couponList, couponSetStatus, couponDel } from '../../request/api/coupon'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
const router = useRouter()//路由
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
            dataIndex: 'store_id',
            key: 'store_id',
        },
        {
            title: '优惠卷名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '优惠卷内容',
            dataIndex: 'reduce',
            key: 'reduce',
        },
        {
            title: '优惠卷类型',
            dataIndex: 'type_text',
            key: 'type_text',
        },
        {
            title: '优惠卷价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '有效期',
            dataIndex: 'valid_day_text',
            key: 'valid_day_text',
        },
        {
            title: '优惠卷分成',
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
    tableColumns1: [//表头
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '优惠卷名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '优惠卷内容',
            dataIndex: 'reduce',
            key: 'reduce',
        },
        {
            title: '优惠卷类型',
            dataIndex: 'type_text',
            key: 'type_text',
        },
        {
            title: '优惠卷价格',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '有效期',
            dataIndex: 'valid_day_text',
            key: 'valid_day_text',
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
            width: 300,
        },
    ],
    activeKey: ref('2'),//1：平台劵 2：商家劵
    content: '确定删除该优惠卷吗？',

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
            source: data.activeKey
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
    // 新建
    add() {
        router.push({
            path: data.activeKey == '1' ? '/couponDetailsP' : '/couponDetails',
            query: { type: 1 }
        })
    },
    // 编辑
    edit(text: any) {
        router.push({
            path: data.activeKey == '1' ? '/couponDetailsP' : '/couponDetails',
            query: { type: 2, id: text.id }
        })
    },
    // 删除
    delete(text: any) {
        console.log(text, '删除')
        Modal.confirm({
            title: '删除提示',
            content: data.content,
            okText: '确认',
            cancelText: '取消',
            icon: h(WarningOutlined),
            maskClosable: true,
            autoFocusButton: null,
            onOk: () => {
                couponDel({ coupon_id: text.id }).then(res => {
                    if (res.code == 200) {
                        methods.getData()
                        message.success('删除成功')
                    }
                })
            },
            onCancel: () => { }
        })

    },
    // 详情
    details(text: any) {
        router.push({
            path: data.activeKey == '1' ? '/couponDetailsP' : '/couponDetails',
            query: { type: 3, id: text.id }
        })
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
        data.activeKey = val
        methods.getData()
    },
    setStatus(text: any, status: number) {
        couponSetStatus({ coupon_id: text.id, status }).then(res => {
            console.log(res, 'res');
            if (res.code == 200) {
                methods.getData()
                message.success('操作成功')
            }
        })
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>