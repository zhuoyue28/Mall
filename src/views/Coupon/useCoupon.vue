<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>优惠卷管理</a-breadcrumb-item>
            <a-breadcrumb-item>优惠卷</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass h-auto'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off"
                style="height: 100%;">
                <a-form-item label="优惠券名称" name="name">
                    <a-input v-model:value="data.formHeader.name">
                        <template #prefix>
                            <BarcodeOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="创建时间" name="time">
                    <a-range-picker v-model:value="time" :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss"
                        :placeholder="['开始时间', '结束时间']" @change="methods.onRangeOk" />
                </a-form-item>
                <!-- 优惠券类型 -->
                <a-form-item label="优惠券类型" name="type">
                    <a-select v-model:value="data.formHeader.type" style="width: 200px;">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">满减</a-select-option>
                        <a-select-option :value="2">代金券</a-select-option>
                        <a-select-option :value="3">团购券</a-select-option>
                    </a-select>
                </a-form-item>
                <!-- 状态 -->
                <a-form-item label="状态" name="status">
                    <a-select v-model:value="data.formHeader.status" style="width: 200px;">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">已上架</a-select-option>
                        <a-select-option :value="0">已下架</a-select-option>
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
                            <a-button type="link" @click="methods.Generate(record)"
                                v-if="!Number(record.price)">生成优惠券码</a-button>
                            <a-button type="link" @click="methods.Exchange(record)"
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
        <a-modal v-model:open="data.Generatevisible" title="生成优惠券兑换码" @ok="methods.GenerateOK"
            @cancel="methods.GenerateCancel" width="500px" okText="确定" cancelText="取消"
            :confirmLoading="data.GeneratevisibLoading">
            <a-form :model="data.Generateform" ref="Generateform" name="horizontal_login" autocomplete="off"
                :labelCol="{ span: 5 }" :wrapperCol="{ span: 18 }">
                <a-form-item label="生成数量" name="num" :rules="[{ required: true, message: '请输入生成数量' }]">
                    <a-input-number style="width: 200px;" id="inputNumber" v-model:value="data.Generateform.num" :min="1"
                        placeholder="请输入或选择" />
                </a-form-item>
                <!-- 设置有效期 -->
                <a-form-item label="设置有效期" name="time" :rules="[{ required: true, message: '请选择有效期' }]">
                    <a-range-picker v-model:value="data.Generateform.time" :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script lang='ts' setup>
import { reactive, ref, h } from 'vue'
import { onMounted } from 'vue'
import { couponList, couponSetStatus, couponDel, couponcreateCode } from '../../request/api/coupon'
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';
import { Modal } from 'ant-design-vue';
import { Dayjs } from 'dayjs';
import type { FormInstance } from 'ant-design-vue';
const router = useRouter()//路由
const Generateform = ref<FormInstance>()// 新增/编辑表单
// 变量
const data = reactive({
    formHeader: {//表单头部
        name: '',
        create_time_end: '',
        create_time_start: '',
        type: '',
        status: ''
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
    Generatevisible: false,//生成优惠券兑换码
    Generateform: {
        num: '',
        time: ref<Dayjs[]>([])
    },
    GenerateID: '',//生成优惠券兑换码id
    GeneratevisibLoading: false,//生成优惠券兑换码加载
})

const time = ref<Dayjs[]>([])

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        couponList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            name: data.formHeader.name,
            source: data.activeKey,
            status: data.formHeader.status,
            type: data.formHeader.type,
            create_time: data.formHeader.create_time_start && data.formHeader.create_time_end
                ?
                [data.formHeader.create_time_start, data.formHeader.create_time_end] : '',
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
        data.formHeader = {
            name: '',
            create_time_end: '',
            create_time_start: '',
            type: '',
            status: ''
        }
        time.value = []
        methods.getData()
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
    },
    onRangeOk(value: [Dayjs, Dayjs]) {
        console.log(time.value, 'timevalue------------');

        if (!value) {
            data.formHeader.create_time_start = ''
            data.formHeader.create_time_end = ''
            return
        }
        console.log('onOk: ', value);
        data.formHeader.create_time_start = value[0].format('YYYY-MM-DD HH:mm:ss')
        data.formHeader.create_time_end = value[1].format('YYYY-MM-DD HH:mm:ss')
    },
    Generate(text: any) {
        console.log(text, 'text');
        data.GenerateID = text.id
        data.Generatevisible = true
    },
    GenerateOK() {
        console.log(data.Generateform, 'data.Generateform');
        Generateform.value?.validate().then(() => {
            data.GeneratevisibLoading = true
            console.log('校验成功');
            couponcreateCode({
                coupon_id: data.GenerateID,
                num: data.Generateform.num,
                start_time: data.Generateform.time[0].format('YYYY-MM-DD HH:mm:ss'),
                end_time: data.Generateform.time[1].format('YYYY-MM-DD HH:mm:ss'),
            }).then(res => {
                if (res.code == 200) {
                    message.success('生成成功')
                    data.Generatevisible = false
                    data.Generateform = {
                        num: '',
                        time: []
                    }
                    data.GeneratevisibLoading = false
                } else {
                    data.GeneratevisibLoading = false
                }
            }).catch(() => {
                data.GeneratevisibLoading = false
            })
        }).catch(() => {
            console.log('校验失败');
        })

    },
    GenerateCancel() {
        console.log('取消');
        data.Generateform = {
            num: '',
            time: []
        }
        data.Generatevisible = false
    },

    Exchange(text: any) {
        router.push({
            path: '/ExchangeRecords',
            query: { id: text.id }
        })
    }

}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>