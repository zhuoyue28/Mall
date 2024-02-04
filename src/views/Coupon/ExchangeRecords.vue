<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item @click="router.go(-1)" class=" cursor-pointer">优惠券管理</a-breadcrumb-item>
            <a-breadcrumb-item>优惠券</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">

                <a-form-item label="生成时间" name="create_time">
                    <a-range-picker v-model:value="data.formHeader.create_time" :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" />
                </a-form-item>

                <a-form-item label="兑换时间" name="exchange_time">
                    <a-range-picker v-model:value="data.formHeader.exchange_time" :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" />
                </a-form-item>
                <!-- 状态 0未兑换 1已兑换 全部为空 -->
                <a-form-item label="状态" name="status">
                    <a-select v-model:value="data.formHeader.status" placeholder="请选择" style="width: 200px;">
                        <a-select-option value="">全部</a-select-option>
                        <a-select-option value="0">未兑换</a-select-option>
                        <a-select-option :value="1">已兑换</a-select-option>
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
            <div class="flex  mb-[12px]">
                <a-button type="primary" @click="methods.add">选择时间段生成兑换码</a-button>
            </div>
            <a-table :columns="data.tableColumns" :dataSource="data.tableData" :loading="data.tableLoading"
                :pagination="false" rowKey="id" @change="methods.getData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'start_time'">
                        <span>{{ record.start_time }} - {{ record.end_time }}</span>
                    </template>
                </template>

            </a-table>
            <div class="flex mt-[12px] items-center justify-end">
                <a-pagination v-model:current="data.tablePagination.current"
                    v-model:pageSize="data.tablePagination.pageSize" :total="data.tablePagination.total" show-size-changer
                    show-quick-jumper @change="methods.pageChange" />
            </div>
        </div>

        <a-modal v-model:open="data.exportvisible" title="生成兑换码" @ok="methods.exporthandleOk"
            @cancel="methods.exporthandleCancel" :confirmLoading="data.exportLoading" :okText="'导出'" :cancelText="'取消'">
            <a-form :model="data.exportform" ref="exportForm" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="有效期" name="time" :rules="[{ required: true, message: '请选择有效期', },]">
                    <a-range-picker v-model:value="data.exportform.time" :show-time="{ format: 'HH:mm:ss' }"
                        format="YYYY-MM-DD HH:mm:ss" :placeholder="['开始时间', '结束时间']" />
                </a-form-item>
            </a-form>
        </a-modal>

    </div>
</template>
<script lang='ts' setup>
import { reactive, ref } from 'vue'
import { onMounted } from 'vue'
import { couponCodeList } from '../../request/api/coupon'
import { Dayjs } from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { message, type FormInstance } from 'ant-design-vue';
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const exportForm = ref<FormInstance>()

// 变量
const data = reactive({
    formHeader: {//表单头部
        status: '',
        create_time: ref<Dayjs[]>([]),
        exchange_time: ref<Dayjs[]>([])
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
            title: '生成时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '兑换码',
            dataIndex: 'code',
            key: 'code',
        },
        {
            title: '有效期',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: '兑换状态',
            dataIndex: 'status_text',
            key: 'status_text',
        },
        {
            title: '兑换时间',
            dataIndex: 'exchange_time',
            key: 'exchange_time',
        },
    ],
    exportvisible: false,//生成兑换码弹窗
    exportform: {//表单字段
        time: ref<Dayjs[]>([]),
    },
    exportLoading: false,//生成兑换码弹窗加载

})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        let params = { ...data.formHeader }
        let time1: any[] = []
        let time2: any[] = []
        if (params.create_time && params.create_time.length) {
            time1 = [params.create_time[0].format('YYYY-MM-DD HH:mm:ss')
                , params.create_time[1].format('YYYY-MM-DD HH:mm:ss')]
        }
        if (params.exchange_time && params.exchange_time.length) {
            time2 = [params.exchange_time[0].format('YYYY-MM-DD HH:mm:ss')
                , params.exchange_time[1].format('YYYY-MM-DD HH:mm:ss')]
        }

        couponCodeList({
            page: page ? page : 1,
            limit: pageSize ? pageSize : 10,
            exchange_time: time2,
            create_time: time1,
            status: params.status,
            coupon_id: route.query.id
        }).then((res: any) => {
            console.log(res, 'res-----兑换记录列表');
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
        data.formHeader.status = ''
        data.formHeader.create_time = []
        data.formHeader.exchange_time = []
        methods.getData()
    },

    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    add() {
        data.exportvisible = true
    },
    // 生成兑换码弹窗
    exporthandleOk() {

        exportForm.value?.validate().then(() => {
            data.exportLoading = true
            let params = { ...data.exportform }
            let time: any[] = []
            if (params.time && params.time.length) {
                time = [params.time[0].format('YYYY-MM-DD HH:mm:ss')
                    , params.time[1].format('YYYY-MM-DD HH:mm:ss')]
            }

            axios({
                method: 'post', url: '/zyapi/admin/coupon/exportCode', responseType: 'blob', headers: {
                    "token": localStorage.getItem('mallToken'),
                    "Content-Type": "multipart/form-data",
                    "Accept-Language": "zh"
                },
                data: {
                    coupon_id: route.query.id,
                    create_time: time
                }
            }).then(res => {
                const blob = new Blob([res.data]);
                const fileName = '兑换码列表.xlsx';
                const down = document.createElement('a');
                down.download = fileName; down.style.display = 'none';
                down.href = URL.createObjectURL(blob);
                document.body.appendChild(down);
                down.click(); URL.revokeObjectURL(down.href);
                document.body.removeChild(down);
                data.exportvisible = false
                message.success('导出成功')
                data.exportLoading = false
                exportForm.value?.resetFields()
                data.exportform.time = []
            })

        })
    },
    exporthandleCancel() {
        exportForm.value?.resetFields()
        data.exportform.time = []
        data.exportvisible = false
    },
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>