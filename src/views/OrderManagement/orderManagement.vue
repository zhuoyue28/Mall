<template>
    <div class="tableListClass">
        <a-breadcrumb>
            <a-breadcrumb-item>订单管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="tableListHeaderClass">

            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-flex wrap="wrap" gap="small">
                    <!-- 订单号 -->
                    <a-form-item label="订单号" name="sn">
                        <a-input-group compact style="width: 400px;">
                            <a-select v-model:value="data.snAndshopName" style="width: 40%;"
                                @change="methods.snAndshopNameChange">
                                <a-select-option :value="0">订单号</a-select-option>
                                <a-select-option :value="1">店铺名称</a-select-option>
                            </a-select>
                            <a-form-item-rest>
                                <a-input v-if="data.snAndshopName == 0" v-model:value="data.formHeader.sn"
                                    style="width: 60%" placeholder="请输入订单号" />
                                <a-input v-if="data.snAndshopName == 1" v-model:value="data.formHeader.shop_name"
                                    style="width: 60%" placeholder="请输入店铺名称" />
                            </a-form-item-rest>
                        </a-input-group>
                    </a-form-item>
                    <!-- 创建时间 -->
                    <a-form-item label="创建时间" name="create_time">
                        <a-range-picker :placeholder="['开始时间', '结束时间']" v-model:value="data.formHeader.create_time"
                            :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss" />
                    </a-form-item>
                    <!-- 订单状态 -->
                    <a-form-item label="订单状态" name="status">
                        <a-select style="width: 200px;" v-model:value="data.formHeader.status" placeholder="请选择订单状态">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option :value="10">待支付</a-select-option>
                            <a-select-option :value="20">待使用</a-select-option>
                            <a-select-option :value="30">已使用</a-select-option>
                            <a-select-option :value="-1">取消订单</a-select-option>
                            <a-select-option :value="-2">超时未支付</a-select-option>
                            <a-select-option :value="-3">已退款(超时未使用)</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- 是否结算 -->
                    <a-form-item label="是否结算" name="is_settlement">
                        <a-select style="width: 200px;" v-model:value="data.formHeader.is_settlement" placeholder="请选择是否结算">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option :value="1">未结算</a-select-option>
                            <a-select-option :value="2">已结算</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- 优惠券发放类型 -->
                    <a-form-item label="优惠券发放类型" name="coupon_type">
                        <a-select style="width: 200px;" v-model:value="data.formHeader.coupon_type"
                            placeholder="请选择优惠券发放类型">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option :value="2">商家</a-select-option>
                            <a-select-option :value="1">平台</a-select-option>
                        </a-select>
                    </a-form-item>
                    <!-- 优惠券类型 -->
                    <a-form-item label="优惠券类型" name="coupon_send_type">
                        <a-select style="width: 200px;" v-model:value="data.formHeader.coupon_send_type"
                            placeholder="请选择优惠券类型">
                            <a-select-option value="">全部</a-select-option>
                            <a-select-option :value="1">满减券</a-select-option>
                            <a-select-option :value="2">代金券</a-select-option>
                            <a-select-option :value="3">无门槛券</a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="primary" @click="methods.getData()">查 询</a-button>
                    </a-form-item>
                    <a-form-item>
                        <a-button type="default" @click="methods.Repossess()">重 置</a-button>
                    </a-form-item>
                </a-flex>
            </a-form>


        </div>
        <div class="tableListContentClass">
            <div class="mb-[12px]">
                <!-- 批量结算按钮 -->
                <a-button type="primary" class="mr-[24px]"
                    @click="methods.settlementP(data.selectedRowKeys)">批量结算</a-button>
            </div>
            <a-table :dataSource="data.tableData" :columns="data.columns" rowKey="order_id" :loading="data.tableLoading"
                :row-selection="{
                    selectedRowKeys: data.selectedRowKeys, onChange: methods.onSelectChange, preserveSelectedRowKeys: true,
                    getCheckboxProps: (record: any) => ({
                        disabled: record.status != 30, // Column configuration not to be checked status: record.status, }),
                    })
                }" :pagination="false" :scroll="{ x: 2000 }">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex === 'nickname'">
                        {{ record.user?.nickname }}/{{ record.user?.phone }}
                    </template>
                    <template v-if="column.dataIndex === 'product_json'">
                        <span>{{ JSON.parse(record.product_json)?.name }}/
                            {{ JSON.parse(record.product_json)?.type === 1 ? '满减券'
                                : JSON.parse(record.product_json)?.type === 2 ? '代金券' : '团购券' }}
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'coupon_type'">
                        <span>
                            {{ record.coupon_type == 2 ? '商家' : '平台' }}
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'price'">
                        <span>
                            {{ JSON.parse(record.product_json)?.price }}
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'status'">
                        <!-- 10待支付, 20待使用, 30已使用, -1取消订单, -2超时未支付, -3已退款(超时未使用) -->
                        <span>
                            {{ record.status == 10 ? '待支付' : record.status == 20 ? '待使用' : record.status == 30 ? '已使用' :
                                record.status == -1 ? '取消订单' : record.status == -2 ? '超时未支付' : '已退款(超时未使用)' }}
                        </span>
                    </template>
                    <template v-if="column.dataIndex === 'is_settlement'">
                        <!-- 是否结算：1未结算  2已结算 -->
                        <span> {{ record.is_settlement == 1 ? '未结算' : '已结算' }}</span>
                    </template>
                    <template v-if="column.dataIndex === 'action'">
                        <a-button type="link" @click="methods.settlement(record)"
                            v-if="record.is_settlement == 1 && record.status == 30">结算</a-button>
                        <a-button type="link" @click="methods.Views(record)">详情</a-button>
                    </template>
                </template>
            </a-table>

            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.pagination.current" v-model:pageSize="data.pagination.pageSize"
                    :total="data.pagination.total" show-size-changer show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>


        <!-- 结算弹窗 -->
        <a-modal v-model:open="data.settlementShow" title="结算" width="500px" :footer="null">
            <!-- 结算金额 -->
            <div class="text-[16px] font-[600] mb-[12px]">
                <span>结算金额：</span>
                <span>{{ data.price }}元</span>
            </div>
            <a-form :model="data.settlementForm" ref="settlementForm" name="horizontal_login" layout="inline"
                autocomplete="off" style="width: 100%;">
                <a-form-item label="结算说明" name="settlement_msg" :rules="[{ required: true, message: '请填写结算说明' }]">
                    <!-- <a-input style="width: 80%;" v-model:value="data.settlementForm.settlement_msg" placeholder="请输入结算说明" /> -->
                    <!-- 文本域 -->
                    <a-textarea style="width: 300px;" v-model:value="data.settlementForm.settlement_msg"
                        placeholder="请输入结算说明" />
                </a-form-item>
            </a-form>
            <div class="flex justify-center mt-[24px]">
                <a-button type="primary" class="mr-[24px]" @click="methods.settlementSure"
                    :loading="data.settlementLoading">结 算</a-button>
                <!-- 取消按钮 -->
                <a-button type="default" @click="methods.settlementFalse">取 消</a-button>
            </div>
        </a-modal>




    </div>
</template>

<script lang="ts" setup>
import { reactive, ref, inject, } from 'vue';
import { orderList, orderSettlement } from '../../request/api/order';
import { message, type FormInstance } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import dayjs, { Dayjs } from 'dayjs';
const formHeader = ref<FormInstance>()// 新增header表单
const settlementForm = ref<FormInstance>()// 新增header表单
const data = reactive({
    formHeader: {
        sn: '',// 订单号
        create_time: ref<[Dayjs, Dayjs]>(),// 创建时间
        status: '',// 订单状态
        is_settlement: '',// 是否结算
        coupon_type: '',// 优惠券发放类型
        coupon_send_type: '',// 优惠券类型
        shop_name: '',//店铺信息
    },
    snAndshopName: 0,//查询条件 下拉框
    columns: [// 表头
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '订单号',
            dataIndex: 'sn',
            key: 'sn',
        },
        {
            title: '店铺名称',
            dataIndex: 'shop_name',
            key: 'shop_name',
        },
        {
            title: '用户信息',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '优惠券名称/优惠券类型',
            dataIndex: 'product_json',
            key: 'product_json',
        },
        {
            title: '优惠券发放类型',
            dataIndex: 'coupon_type',
            key: 'coupon_type',
        },
        {
            title: '优惠券价格(元)',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: '优惠券分成价格(元)',
            dataIndex: 'store_rebate',
            key: 'store_rebate',
        },
        {
            title: '订单状态',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '结算状态',
            dataIndex: 'is_settlement',
            key: 'is_settlement',
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
    },
    settlementShow: false,// 结算弹窗
    settlementForm: {// 结算表单
        order_id: '',
        settlement_msg: '',
    },
    price: ref<string | number>(''),// 结算金额
    settlementLoading: false,// 结算加载
    selectedRowKeys: [],// 选中的key
    selectedRow: [],// 选中的数据
})
const methods = reactive({
    getData: (page?: number, limit?: number) => {// 获取表格数据
        data.tableLoading = true
        let params = {
            sn: data.formHeader.sn,// 订单号
            create_time: data.formHeader.create_time && [dayjs(data.formHeader.create_time[0]).format('YYYY-MM-DD HH:mm:ss'), dayjs(data.formHeader.create_time[1]).format('YYYY-MM-DD HH:mm:ss')],// 创建时间
            status: data.formHeader.status,// 订单状态
            is_settlement: data.formHeader.is_settlement,// 是否结算
            coupon_type: data.formHeader.coupon_type,// 优惠券发放类型
            coupon_send_type: data.formHeader.coupon_send_type,// 优惠券类型
            shop_name: data.formHeader.shop_name,//店铺信息
        }
        orderList({
            ...params, page: page || 1, limit: limit || 10
        }).then(res => {
            console.log(res, 'res订单列表');

            data.tableData = res.data.data
            data.tableLoading = false
            data.pagination.total = res.data.total
            data.pagination.current = res.data.current_page
            data.pagination.pageSize = res.data.per_page
        })
    },
    messageFn: inject('messageFn') as Function,//APP.vue传递方法
    Repossess: () => { // 重置
        formHeader.value?.resetFields()
        data.formHeader.create_time = undefined
        data.snAndshopName = 0
        methods.snAndshopNameChange(0)
        methods.getData()
    },

    pageChange: (val: number) => {// 分页
        methods.getData(val, data.pagination.pageSize)
    },
    settlement: (val: any) => {// 结算
        data.settlementShow = true
        data.settlementForm.order_id = val.order_id
        data.price = val.store_rebate
    },
    Views: (val: any) => {// 详情
        data.router.push({
            path: '/orderDetails',
            query: {
                id: val.order_id
            }
        })
    },
    settlementSure: () => {// 结算确定
        settlementForm.value?.validate().then(() => {
            data.settlementLoading = true
            orderSettlement({
                order_id: data.settlementForm.order_id,
                settlement_msg: data.settlementForm.settlement_msg
            }).then(res => {
                if (res.code == 200) {
                    data.settlementShow = false
                    data.settlementForm.settlement_msg = ''
                    data.selectedRowKeys = []
                    data.selectedRow = []
                    data.price = ''
                    data.settlementForm.order_id = ''
                    methods.getData()
                    message.success('结算成功')
                    data.settlementLoading = false

                } else {
                    data.settlementLoading = false
                }
            }).catch(() => {
                data.settlementLoading = false
            })
        })
    },
    settlementFalse: () => {// 结算取消
        data.settlementShow = false
        data.settlementForm.settlement_msg = ''
    },
    onSelectChange: (selectedRowKeys: any, selectedRow: any) => {// 选中的key
        data.selectedRowKeys = selectedRowKeys
        data.selectedRow = selectedRow
    },
    settlementP(val: any) {// 批量结算
        if (data.selectedRowKeys && data.selectedRowKeys.length == 0) {
            message.warning('请选择要结算的订单')
            return
        }
        data.settlementShow = true
        data.settlementForm.order_id = val.join(',')
        // data.price = data.tableData.filter((item: any) => val.includes(item.order_id)).reduce((total: any, item: any) => {
        //     return total + item.store_rebate
        // }, 0)
        let num = 0
        data.selectedRow.forEach((item: any) => {
            console.log(item, 'item');

            num += Number(item.store_rebate)
        })
        data.price = num
    },
    snAndshopNameChange(val: any) {
        console.log(val, '-----');
        if (val == 0) {
            data.formHeader.shop_name = ''
        } else if (val == 1) {
            data.formHeader.sn = ''
        }

    }









})

// 获取表格数据
methods.getData()


</script>

<style lang="scss" scoped></style>