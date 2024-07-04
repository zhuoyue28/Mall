<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item>停车劵</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline"
                autocomplete="off">
                <a-form-item label="优惠券名称" name="search_key">
                    <a-input v-model:value="data.formHeader.search_key">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="状态" name="status">
                    <a-select v-model:value="data.formHeader.status" style="width: 200px;">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option :value="1">已上架</a-select-option>
                        <a-select-option :value="0">未上架</a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item label="创建时间" name="time">
                    <a-range-picker v-model:value="time" :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" @change="methods.onRangeOk" />
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
                <a-button type="primary" @click="methods.add">新建停车券</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #status="scoped">
                    <div>{{ scoped.record.status ? '已上架' : '未上架' }}</div>
                </template>
                <template #action="scoped">
                    <a-space size="middle">
                        <a-button type="link" @click="methods.switchChange(scoped.record)">{{ scoped.record.status ? '下架'
                            : '上架'}}</a-button>
                        <a-button type="link" @click="methods.edit(scoped.record)">编辑</a-button>
                        <a-button type="link" danger @click="methods.delete(scoped.record)">删除</a-button>
                    </a-space>
                </template>
                <template #couponValue="scoped">
                    <div>减{{ scoped.record.price }}元</div>
                </template>
                <template #if_use="scoped">
                    <div>{{ scoped.record.use_number }}/{{ scoped.record.receive_number }}</div>
                </template>
                <template #day="scoped">
                    <div>自领取后{{ scoped.record.day }}天有效</div>
                </template>
            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.tablePagination.current"
                    v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total"
                    show-size-changer show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>
    </div>
</template>
<script lang='ts' setup>
//  methods.switchChange(val, scoped.record.id)
import { reactive, ref, h } from 'vue'
import { onMounted } from 'vue'
import { parkingCouponList, parkingUpdateStatus,parkingDelete } from '../../request/api/coupon'
import { Dayjs } from 'dayjs';
import { useRouter } from 'vue-router';
import { message, type FormInstance } from 'ant-design-vue';
import { Modal } from 'ant-design-vue';
import { WarningOutlined } from '@ant-design/icons-vue';

// 变量
const router = useRouter()//路由
const time = ref<Dayjs[]>([])
const data = reactive({
    formHeader: {//表单头部
        search_key: '',
        status: '',
        start_time: '',
        end_time: '',
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
            title: '优惠券名称',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '优惠券内容',
            dataIndex: 'couponValue',
            key: 'couponValue',
            slots: { customRender: 'couponValue' },

        },
        {
            title: '所需积分',
            dataIndex: 'use_score',
            key: 'use_score',
        },
        {
            title: '已使用/已领取',
            dataIndex: 'if_use',
            key: 'if_use',
            slots: { customRender: 'if_use' },
        },
        {
            title: '有效期',
            dataIndex: 'day',
            key: 'day',
            slots: { customRender: 'day' },

        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            slots: { customRender: 'status' },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            slots: { customRender: 'action' },
        },
    ],
    content: '确定删除该停车券吗？',
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        parkingCouponList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            status: data.formHeader.status,
            start_time: data.formHeader.start_time,
            end_time: data.formHeader.end_time,
            search_key: data.formHeader.search_key
        }).then((res: any) => {
            console.log(res, 'res-----停车券列表');
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
            search_key: '',
            status: '',
            start_time: '',
            end_time: '',
        }
        time.value = []
        methods.getData()
    },
    onRangeOk(value: [Dayjs, Dayjs]) {
        console.log(time.value, 'timevalue------------');

        if (!value) {
            data.formHeader.start_time = ''
            data.formHeader.end_time = ''
            return
        }
        console.log('onOk: ', value);
        data.formHeader.start_time = value[0].format('YYYY-MM-DD HH:mm:ss')
        data.formHeader.end_time = value[1].format('YYYY-MM-DD HH:mm:ss')
    },
    add() {
        router.push({
            path: '/parkingDetail',
            query: { type: 1 }
        })
    },
    // 编辑
    edit(text: any) {
        console.log(text, '编辑')
        router.push({
            path: '/parkingDetail',
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
                parkingDelete({ id: text.id }).then(res => {
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
        console.log(text, '详情')
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    // 开关
    switchChange(row: any) {
        console.log(row, '开关')
        parkingUpdateStatus({ id: row.id, status: row.status == 1 ? 0 : 1 }).then((res: any) => {
            // console.log(res, 'res-----停车券列表');
            message.success('编辑成功')
            if (res.code == 200) {
                methods.getData()
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