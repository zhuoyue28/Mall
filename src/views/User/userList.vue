<template>
    <div class='tableListClass'>
        <a-breadcrumb>
            <a-breadcrumb-item>用户管理</a-breadcrumb-item>
        </a-breadcrumb>
        <div class='tableListHeaderClass'>
            <a-form :model="data.formHeader" ref="formHeader" name="horizontal_login" layout="inline" autocomplete="off">
                <a-form-item label="用户名称" name="keyword_nickname">
                    <a-input v-model:value="data.formHeader.keyword_nickname" placeholder="请输入">
                        <template #prefix>
                            <UserOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="手机号码" name="keyword_phone">
                    <a-input v-model:value="data.formHeader.keyword_phone" placeholder="请输入">
                        <template #prefix>
                            <PhoneOutlined class="site-form-item-icon" />
                        </template>
                    </a-input>
                </a-form-item>
                <a-form-item label="注册时间" name="time">
                    <a-range-picker :show-time="{ format: 'HH:mm:ss' }" format="YYYY-MM-DD HH:mm:ss"
                        :placeholder="['开始时间', '结束时间']" @change="methods.onRangeOk" />
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
                <template #bodyCell="{ column, record }">
                    <template v-if="column.dataIndex == 'action'">
                        <a-space size="middle">
                            <a-button type="link" @click="methods.details(record)">详情</a-button>
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
import { reactive } from 'vue'
import { onMounted } from 'vue'
import { userList } from "../../request/api/userlist"
import { Dayjs } from 'dayjs';
import { useRouter } from 'vue-router';

const router = useRouter()

// 变量
const data = reactive({
    formHeader: {//表单头部
        keyword_nickname: '',
        keyword_phone: '',
        create_time_end: '',
        create_time_start: '',
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
            title: '用户名称',
            dataIndex: 'nickname',
            key: 'nickname',
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            key: 'create_time',
        },
        {
            title: '当前积分',
            dataIndex: 'integral',
            key: 'integral',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
        },
    ],
})

// 方法
const methods = {
    // 获取数据
    getData(page?: number, pageSize?: number) {
        data.tableLoading = true
        userList({
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
    },
    // 详情
    details(text: any) {
        console.log(text, '详情')
        router.push({ path: '/userDetails', query: { id: text.id } })
    },
    pageChange(page: number, pageSize: number) {
        console.log(page, pageSize, '分页')
        methods.getData(page, pageSize)
    },
    onRangeOk(value: [Dayjs, Dayjs]) {
        if (!value) {
            data.formHeader.create_time_start = ''
            data.formHeader.create_time_end = ''
            return
        }
        console.log('onOk: ', value);
        data.formHeader.create_time_start = value[0].format('YYYY-MM-DD HH:mm:ss')
        data.formHeader.create_time_end = value[1].format('YYYY-MM-DD HH:mm:ss')
    }
}


// 生命周期
onMounted(() => {
    methods.getData()
})


</script>
<style lang='scss' scoped></style>